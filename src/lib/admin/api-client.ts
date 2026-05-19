/**
 * Server-side fetch wrapper for talking to the backend from RSCs and server actions.
 *
 * - Reads the admin access cookie and forwards it as the `Authorization` header.
 * - Normalises errors into `ApiError` so callers can `try/catch` consistently.
 * - Supports Next's fetch revalidation tags so admin mutations can invalidate
 *   public reads with `revalidateTag()`.
 *
 * Never import this file from a client component — it uses `next/headers`.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_CONFIG } from "./config";
import { ApiError, type ApiErrorPayload, type ApiResponse } from "./types";

/**
 * When the backend returns 401 for an admin-authenticated call, the access
 * cookie is expired or has been invalidated. Clear both cookies so middleware
 * routes the user back to login (with a callbackUrl pointing to where they were).
 * Calls `redirect()` which throws — control never returns to the caller.
 */
async function handleExpiredSession(): Promise<never> {
  const jar = await cookies();
  jar.delete(ADMIN_CONFIG.cookies.access);
  jar.delete(ADMIN_CONFIG.cookies.user);
  redirect(ADMIN_CONFIG.loginPath);
}

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Forward the admin auth cookie. Defaults to true. */
  auth?: boolean;
  /** Pass-through to next.revalidate. */
  revalidate?: number | false;
  /** Pass-through to next.tags for cache invalidation. */
  tags?: string[];
  /** Additional headers (rare — auth is added automatically). */
  headers?: Record<string, string>;
  /** Whether to read the response body as JSON. Defaults to true. */
  parseJson?: boolean;
}

async function readAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ADMIN_CONFIG.cookies.access)?.value ?? null;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    auth = true,
    revalidate,
    tags,
    headers = {},
    parseJson = true,
  } = options;

  const url = `${ADMIN_CONFIG.apiUrl}${path}`;

  const finalHeaders: Record<string, string> = { ...headers };

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = await readAccessToken();
    if (token) {
      finalHeaders.Authorization = token;
    }
  }

  const nextOptions: { revalidate?: number | false; tags?: string[] } = {};
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;
  if (tags) nextOptions.tags = tags;

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
    cache: revalidate === undefined && !tags ? "no-store" : undefined,
    next: Object.keys(nextOptions).length ? nextOptions : undefined,
  });

  // Session-expired auth path: clear admin cookies + redirect to login.
  // Only applies when this request was authenticated; public unauthenticated
  // reads (auth=false) shouldn't be hijacked by upstream 401s.
  if (auth && res.status === 401) {
    await handleExpiredSession();
  }

  if (!parseJson) {
    if (!res.ok) {
      throw new ApiError(res.status, `Request failed (${res.status})`, null);
    }
    return { success: true, data: undefined as T };
  }

  let json: ApiResponse<T> | ApiErrorPayload;
  try {
    json = (await res.json()) as ApiResponse<T> | ApiErrorPayload;
  } catch {
    throw new ApiError(res.status, `Invalid JSON from ${path}`, null);
  }

  if (!res.ok || ("success" in json && json.success === false)) {
    const err = json as ApiErrorPayload;
    throw new ApiError(
      res.status,
      err.message || `Request failed (${res.status})`,
      err,
    );
  }

  return json as ApiResponse<T>;
}
