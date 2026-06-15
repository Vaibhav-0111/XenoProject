import { useCallback, useEffect, useState } from "react";
import { api, clearToken, getToken, setToken, ApiError } from "./api/client";
import {
  firebaseSignOutIfConfigured,
  isFirebaseConfigured,
  signInWithGooglePopup,
} from "./firebase";
import type { AuthResponse, UserResponse } from "./api/types";

const USER_KEY = "xenoreach_user";

/**
 * Builds a JWT-shaped (but unsigned) token carrying standard Firebase ID
 * token claims (email, name, picture, user_id). The backend's AuthService
 * verifies tokens via the Firebase Admin SDK when configured, and falls back
 * to decoding these claims without signature verification when
 * FIREBASE_ENABLED=false -- which is the default for local/demo deployments.
 *
 * This lets the full "Sign in with Google -> /api/auth/google -> JWT" flow
 * work end-to-end without a Firebase project, while remaining a drop-in
 * replacement for a real Firebase ID token once one is wired up.
 */
function buildDevIdToken(params: { email: string; name: string; picture?: string }) {
  const header = { alg: "none", typ: "JWT" };
  const payload = {
    user_id: `dev_${params.email}`,
    sub: `dev_${params.email}`,
    email: params.email,
    name: params.name,
    picture: params.picture,
    iat: Math.floor(Date.now() / 1000),
  };

  const encode = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  return `${encode(header)}.${encode(payload)}.devsignature`;
}

function readStoredUser(): UserResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UserResponse) : null;
  } catch {
    return null;
  }
}

function persistSession(auth: AuthResponse) {
  setToken(auth.token);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
    window.dispatchEvent(new Event("xenoreach-auth-change"));
  }
}

export function clearSession() {
  clearToken();
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("xenoreach-auth-change"));
  }
}

/**
 * Dev/demo sign-in: exchanges an email + display name for a real XenoReach
 * JWT via POST /api/auth/google. Use this for the "Sign in with email" form
 * and as the handler behind "Continue with Google" until a real Firebase
 * Google Sign-In popup is wired up on the frontend.
 */
export async function signInWithEmail(email: string, name?: string): Promise<UserResponse> {
  const idToken = buildDevIdToken({
    email,
    name: name?.trim() || email.split("@")[0],
  });

  const auth = await api.post<AuthResponse>(
    "/api/auth/google",
    { idToken },
    { unauthenticated: true },
  );
  persistSession(auth);
  return auth.user;
}

/**
 * Sign in with Google.
 *
 * - If Firebase is configured (VITE_FIREBASE_* env vars set), opens the real
 *   Google account picker via Firebase Auth and exchanges the resulting ID
 *   token with the backend.
 * - Otherwise, falls back to a `window.prompt`-based dev sign-in so the
 *   end-to-end flow still works without a Firebase project.
 */
export async function signInWithGoogle(): Promise<UserResponse> {
  if (isFirebaseConfigured()) {
    const idToken = await signInWithGooglePopup();
    const auth = await api.post<AuthResponse>(
      "/api/auth/google",
      { idToken },
      { unauthenticated: true },
    );
    persistSession(auth);
    return auth.user;
  }

  const email = window.prompt("Demo Google Sign-In (Firebase not configured) -- enter your email:");
  if (!email) throw new ApiError("Sign-in cancelled", 0);
  const name = window.prompt("Display name:", email.split("@")[0]) || undefined;
  return signInWithEmail(email, name);
}

export async function signOut() {
  clearSession();
  await firebaseSignOutIfConfigured().catch(() => {});
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function getCurrentUser(): UserResponse | null {
  return readStoredUser();
}

/**
 * Reactive auth state for use in components. Re-reads from localStorage
 * whenever the session changes (sign-in/out in this tab or another).
 */
export function useAuth() {
  const [user, setUser] = useState<UserResponse | null>(() => readStoredUser());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(readStoredUser());
    setHydrated(true);

    const onChange = () => setUser(readStoredUser());
    window.addEventListener("xenoreach-auth-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("xenoreach-auth-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    void firebaseSignOutIfConfigured();
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    /** True once we've checked localStorage on the client (avoids SSR flicker) */
    hydrated,
    logout,
  };
}
