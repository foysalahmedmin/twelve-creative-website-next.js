"use server";

/**
 * Admin auth server actions: login + logout.
 *
 * Cookies are set httpOnly so the access token never reaches client JS.
 * The login action returns a structured result instead of throwing, so the
 * login form can render error messages cleanly.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_CONFIG } from "./config";
import { ApiError, type ApiResponse } from "./types";
import type { AdminUser } from "./types";

interface SigninResponse {
  token: string;
  info: AdminUser;
}

export interface SigninActionResult {
  ok: boolean;
  error?: string;
  redirectTo?: string;
}

export async function signinAction(
  _prevState: SigninActionResult | undefined,
  formData: FormData,
): Promise<SigninActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "").trim();

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  let result: ApiResponse<SigninResponse>;
  try {
    const res = await fetch(`${ADMIN_CONFIG.apiUrl}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const json = (await res.json().catch(() => null)) as
      | ApiResponse<SigninResponse>
      | { success: false; message?: string }
      | null;

    if (!json) {
      return { ok: false, error: "Unexpected response from server." };
    }

    if (!res.ok || json.success === false) {
      return {
        ok: false,
        error: (json as { message?: string }).message || "Sign-in failed.",
      };
    }

    result = json as ApiResponse<SigninResponse>;
  } catch (err) {
    if (err instanceof ApiError) return { ok: false, error: err.message };
    return { ok: false, error: "Could not reach the server. Check your connection." };
  }

  const { token, info } = result.data;

  if (info.role !== "admin" && info.role !== "editor") {
    return { ok: false, error: "This account does not have admin access." };
  }

  const jar = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  jar.set({
    name: ADMIN_CONFIG.cookies.access,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_CONFIG.accessCookieMaxAgeSeconds,
  });

  jar.set({
    name: ADMIN_CONFIG.cookies.user,
    value: JSON.stringify({
      _id: info._id,
      name: info.name,
      email: info.email,
      role: info.role,
      ...(info.image && { image: info.image }),
    }),
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_CONFIG.accessCookieMaxAgeSeconds,
  });

  return {
    ok: true,
    redirectTo: callbackUrl && callbackUrl.startsWith("/admin")
      ? callbackUrl
      : ADMIN_CONFIG.dashboardPath,
  };
}

export async function signoutAction(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(ADMIN_CONFIG.cookies.access)?.value;

  // Best-effort backend logout — don't block on failure.
  if (token) {
    try {
      await fetch(`${ADMIN_CONFIG.apiUrl}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: token },
        cache: "no-store",
      });
    } catch {
      // Ignore — we still clear the cookies locally.
    }
  }

  jar.delete(ADMIN_CONFIG.cookies.access);
  jar.delete(ADMIN_CONFIG.cookies.user);

  redirect(ADMIN_CONFIG.loginPath);
}
