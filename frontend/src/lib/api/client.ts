/**
 * Typed fetch client for the XenoReach crm-core backend.
 *
 * - Reads the API base URL from VITE_API_BASE_URL (defaults to localhost:8080).
 * - Attaches the stored JWT (see lib/auth.ts) as a Bearer token.
 * - Throws ApiError with a human-readable message + status for the UI to handle.
 * - On 401, clears the session so the auth guard can redirect to /login.
 */

const API_BASE_URL: string =
  (typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL) ||
  "http://localhost:8080";

const TOKEN_KEY = "xenoreach_token";

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Skip attaching the Authorization header (e.g. for /api/auth/google) */
  unauthenticated?: boolean;
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, unauthenticated } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (!unauthenticated) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new ApiError(
      "Could not reach the XenoReach API. Check your connection or try again shortly.",
      0,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    if (response.status === 401 && !unauthenticated) {
      clearToken();
    }
    const message =
      (data && (data.message as string)) || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data?.fieldErrors);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, query?: RequestOptions["query"]) =>
    apiRequest<T>(path, { method: "GET", query }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
};

export { API_BASE_URL };
