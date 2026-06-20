import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as setToken, n as api, r as clearToken, t as ApiError } from "./client-4kwFZpQp.mjs";
import { o as getApps, s as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import "../_libs/firebase.mjs";
import { i as signOut, n as getAuth, r as signInWithPopup, t as GoogleAuthProvider } from "../_libs/firebase__auth.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CHZIWgXM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Firebase Web SDK setup for "Sign in with Google".
*
* Reads config from VITE_FIREBASE_* env vars (see .env.example). If
* VITE_FIREBASE_API_KEY is not set, Firebase is not initialised and
* `getFirebaseAuth()` returns null -- callers fall back to the dev-mode
* email sign-in (see src/lib/auth.ts), so the app still runs without a
* Firebase project configured.
*/
var env = (typeof import.meta !== "undefined" ? {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_API_BASE_URL": "http://localhost:8080",
	"VITE_FIREBASE_API_KEY": "AIzaSyCdN-F0Z_vtxBWcTAvaTBBR5nxBhDu2Egg",
	"VITE_FIREBASE_APP_ID": "1:649755559775:web:dd5f9ffc0a472190b818ea",
	"VITE_FIREBASE_AUTH_DOMAIN": "xeno-8e5d2.firebaseapp.com",
	"VITE_FIREBASE_PROJECT_ID": "xeno-8e5d2"
} : {}) || {};
var firebaseConfig = {
	apiKey: env.VITE_FIREBASE_API_KEY,
	authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: env.VITE_FIREBASE_PROJECT_ID,
	appId: env.VITE_FIREBASE_APP_ID
};
function isFirebaseConfigured() {
	return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}
var app = null;
var auth = null;
function getFirebaseAuth() {
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
async function signInWithGooglePopup() {
	const firebaseAuth = getFirebaseAuth();
	if (!firebaseAuth) throw new Error("Firebase is not configured. Set VITE_FIREBASE_* env vars (see .env.example).");
	return (await signInWithPopup(firebaseAuth, new GoogleAuthProvider())).user.getIdToken();
}
async function firebaseSignOutIfConfigured() {
	const firebaseAuth = getFirebaseAuth();
	if (firebaseAuth?.currentUser) await signOut(firebaseAuth);
}
var USER_KEY = "xenoreach_user";
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
function buildDevIdToken(params) {
	const header = {
		alg: "none",
		typ: "JWT"
	};
	const payload = {
		user_id: `dev_${params.email}`,
		sub: `dev_${params.email}`,
		email: params.email,
		name: params.name,
		picture: params.picture,
		iat: Math.floor(Date.now() / 1e3)
	};
	const encode = (obj) => btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
	return `${encode(header)}.${encode(payload)}.devsignature`;
}
function readStoredUser() {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(USER_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function persistSession(auth) {
	setToken(auth.token);
	if (typeof window !== "undefined") {
		window.localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
		window.dispatchEvent(new Event("xenoreach-auth-change"));
	}
}
function clearSession() {
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
async function signInWithEmail(email, name) {
	const idToken = buildDevIdToken({
		email,
		name: name?.trim() || email.split("@")[0]
	});
	const auth = await api.post("/api/auth/google", { idToken }, { unauthenticated: true });
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
async function signInWithGoogle() {
	if (isFirebaseConfigured()) {
		const idToken = await signInWithGooglePopup();
		const auth = await api.post("/api/auth/google", { idToken }, { unauthenticated: true });
		persistSession(auth);
		return auth.user;
	}
	const email = window.prompt("Demo Google Sign-In (Firebase not configured) -- enter your email:");
	if (!email) throw new ApiError("Sign-in cancelled", 0);
	return signInWithEmail(email, window.prompt("Display name:", email.split("@")[0]) || void 0);
}
/**
* Reactive auth state for use in components. Re-reads from localStorage
* whenever the session changes (sign-in/out in this tab or another).
*/
function useAuth() {
	const [user, setUser] = (0, import_react.useState)(() => readStoredUser());
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
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
	const logout = (0, import_react.useCallback)(() => {
		clearSession();
		firebaseSignOutIfConfigured();
	}, []);
	return {
		user,
		isAuthenticated: Boolean(user),
		/** True once we've checked localStorage on the client (avoids SSR flicker) */
		hydrated,
		logout
	};
}
//#endregion
export { signInWithGoogle as n, useAuth as r, signInWithEmail as t };
