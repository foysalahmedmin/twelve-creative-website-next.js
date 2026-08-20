import type { ReactNode } from "react";
import { requireAdminRole } from "@/lib/admin/session";

/**
 * Guards every route under /admin/users. A layout rather than a per-page call
 * so nested routes (new, and anything added later) cannot be reached without
 * the check by simply forgetting it.
 */
export default async function UsersLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdminRole("admin");
  return <>{children}</>;
}
