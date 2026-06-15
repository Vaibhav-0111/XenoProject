/**
 * Firebase Web SDK setup for "Sign in with Google".
 *
 * Reads config from VITE_FIREBASE_* env vars (see .env.example). If
 * VITE_FIREBASE_API_KEY is not set, Firebase is not initialised and
 * `getFirebaseAuth()` returns null -- callers fall back to the dev-mode
 * email sign-in (see src/lib/auth.ts), so the app still runs without a
 * Firebase project configured.
 */
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type Auth,
} from "firebase/auth";

const env =
  (typeof import.meta !== "undefined"
    ? (import.meta as unknown as { env: Record<string, string> }).env
    : {}) || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

function getFirebaseAuth(): Auth | null {
  if (!isFirebaseConfigured()) return null;
  if (!auth) {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
  return auth;
}

/**
 * Opens the Google Sign-In popup and returns a real Firebase ID token,
 * ready to be exchanged via POST /api/auth/google.
 */
export async function signInWithGooglePopup(): Promise<string> {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) {
    throw new Error("Firebase is not configured. Set VITE_FIREBASE_* env vars (see .env.example).");
  }
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(firebaseAuth, provider);
  return result.user.getIdToken();
}

export async function firebaseSignOutIfConfigured() {
  const firebaseAuth = getFirebaseAuth();
  if (firebaseAuth?.currentUser) {
    await firebaseSignOut(firebaseAuth);
  }
}
