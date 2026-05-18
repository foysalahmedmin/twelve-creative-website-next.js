/**
 * Server-side admin session helpers.
 *
 * Reads admin-only httpOnly cookies set by the login server action.
 * Safe to call from RSCs, layouts, and server actions.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_CONFIG } from "./config";
import type { AdminUser } from "./types";

/**
 * Returns the current admin user, or null if not authenticated.
 * Does NOT redirect.
 */
export async function getAdminSession(): Promise<AdminUser | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_CONFIG.cookies.access)?.value;
  const userJson = jar.get(ADMIN_CONFIG.cookies.user)?.value;

  if (!token || !userJson) return null;

  try {
    const user = JSON.parse(userJson) as AdminUser;
    if (!user._id || !user.role) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Returns the current admin user, or redirects to login.
 * Use in admin route layouts/pages that require authentication.
 */
export async function requireAdminSession(): Promise<AdminUser> {
  const user = await getAdminSession();
  if (!user) redirect(ADMIN_CONFIG.loginPath);
  return user;
}
