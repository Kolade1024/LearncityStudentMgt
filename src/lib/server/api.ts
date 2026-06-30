import { cookies } from "next/headers";

/**
 * Server-only helpers for talking to the LearnCity backend.
 *
 * The browser never calls the backend directly — every request is proxied
 * through Next.js route handlers so that:
 *   - the http:// origin is reached server-side (no mixed-content / CORS),
 *   - the access token lives in an httpOnly cookie and never touches JS.
 */

export const API_BASE =
  process.env.LEARNCITY_API_BASE?.replace(/\/$/, "") ??
  "http://aftsolutions-003-site9.jtempurl.com/api/v1";

export const COOKIE = {
  access: "lc_access",
  refresh: "lc_refresh",
  email: "lc_email",
} as const;

const isProd = process.env.NODE_ENV === "production";
const DAY = 60 * 60 * 24;

interface LoginTokens {
  accessToken: string;
  refreshToken: string;
  expiration?: string;
}

/** Raw fetch against the backend; `path` is relative to {@link API_BASE}. */
export function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
  });
}

export async function readAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE.access)?.value;
}

export async function readEmail(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE.email)?.value;
}

export async function writeSession(tokens: LoginTokens, email: string): Promise<void> {
  const store = await cookies();
  const base = {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
  };

  let accessMaxAge = 60 * 60 * 8; // 8h fallback
  if (tokens.expiration) {
    const secs = Math.floor((new Date(tokens.expiration).getTime() - Date.now()) / 1000);
    if (Number.isFinite(secs) && secs > 0) accessMaxAge = secs;
  }

  store.set(COOKIE.access, tokens.accessToken, { ...base, maxAge: accessMaxAge });
  store.set(COOKIE.refresh, tokens.refreshToken, { ...base, maxAge: 30 * DAY });
  store.set(COOKIE.email, email, { ...base, maxAge: 30 * DAY });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  for (const name of Object.values(COOKIE)) store.delete(name);
}

/** A JSON 401 used when the caller has no valid session cookie. */
export function unauthorized(): Response {
  return Response.json({ message: "Not authenticated." }, { status: 401 });
}

/**
 * Proxy an authenticated request to the backend and mirror its response
 * (status, body, and relevant headers) back to the browser. Handles both
 * JSON payloads and binary streams (e.g. the certificate PDF).
 */
export async function proxyAuthed(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await readAccessToken();
  if (!token) return unauthorized();

  const res = await backendFetch(path, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const headers = new Headers();
  for (const h of ["content-type", "content-disposition", "content-length"]) {
    const v = res.headers.get(h);
    if (v) headers.set(h, v);
  }
  return new Response(res.body, { status: res.status, headers });
}
