/**
 * Server-side admin session helpers.
 *
 * Reads admin-only httpOnly cookies set by the login server action.
 * Safe to call from RSCs, layouts, and server actions.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_CONFIG } from "./config";
import type { AdminRole, AdminUser } from "./types";

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

/**
 * Returns the current user, or sends them to the dashboard unless they hold
 * one of `roles`.
 *
 * The sidebar already hides what a role cannot use, but hiding a link is not a
 * guard: the page still rendered for anyone who typed its URL, and the refusal
 * only surfaced as a 403 once the form was submitted — a filled-in form that
 * throws the work away. This makes the route agree with the nav, so a role
 * that cannot use a page never reaches it.
 */
export async function requireAdminRole(
  ...roles: AdminRole[]
): Promise<AdminUser> {
  const user = await requireAdminSession();
  if (!roles.includes(user.role)) redirect(ADMIN_CONFIG.dashboardPath);
  return user;
}
