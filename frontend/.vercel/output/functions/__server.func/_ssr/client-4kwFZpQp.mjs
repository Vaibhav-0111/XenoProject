//#region node_modules/.nitro/vite/services/ssr/assets/client-4kwFZpQp.js
/**
* Typed fetch client for the XenoReach crm-core backend.
*
* - Reads the API base URL from VITE_API_BASE_URL (defaults to localhost:8080).
* - Attaches the stored JWT (see lib/auth.ts) as a Bearer token.
* - Throws ApiError with a human-readable message + status for the UI to handle.
* - On 401, clears the session so the auth guard can redirect to /login.
*/
var API_BASE_URL = typeof import.meta !== "undefined" && "http://localhost:8080" || "http://localhost:8080";
var TOKEN_KEY = "xenoreach_token";
var ApiError = class extends Error {
	status;
	fieldErrors;
	constructor(message, status, fieldErrors) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.fieldErrors = fieldErrors;
	}
};
function getToken() {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(TOKEN_KEY);
}
function setToken(token) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(TOKEN_KEY, token);
}
function clearToken() {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(TOKEN_KEY);
}
function buildUrl(path, query) {
	const url = new URL(path.startsWith("http") ? path : `${API_BASE_URL}${path}`);
	if (query) Object.entries(query).forEach(([key, value]) => {
		if (value !== void 0 && value !== null) url.searchParams.set(key, String(value));
	});
	return url.toString();
}
async function apiRequest(path, options = {}) {
	const { method = "GET", body, query, unauthenticated } = options;
	const headers = { Accept: "application/json" };
	if (body !== void 0) headers["Content-Type"] = "application/json";
	if (!unauthenticated) {
		const token = getToken();
		if (token) headers["Authorization"] = `Bearer ${token}`;
	}
	let response;
	try {
		response = await fetch(buildUrl(path, query), {
			method,
			headers,
			body: body !== void 0 ? JSON.stringify(body) : void 0
		});
	} catch (err) {
		throw new ApiError("Could not reach the XenoReach API. Check your connection or try again shortly.", 0);
	}
	if (response.status === 204) return;
	const data = response.headers.get("content-type")?.includes("application/json") ? await response.json().catch(() => null) : null;
	if (!response.ok) {
		if (response.status === 401 && !unauthenticated) clearToken();
		throw new ApiError(data && data.message || `Request failed with status ${response.status}`, response.status, data?.fieldErrors);
	}
	return data;
}
var api = {
	get: (path, query) => apiRequest(path, {
		method: "GET",
		query
	}),
	post: (path, body, options) => apiRequest(path, {
		...options,
		method: "POST",
		body
	}),
	put: (path, body) => apiRequest(path, {
		method: "PUT",
		body
	}),
	delete: (path) => apiRequest(path, { method: "DELETE" })
};
//#endregion
export { setToken as i, api as n, clearToken as r, ApiError as t };
