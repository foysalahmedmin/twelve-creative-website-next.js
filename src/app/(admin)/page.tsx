import { redirect } from "next/navigation";
import { ADMIN_CONFIG } from "@/lib/admin/config";

export default function AdminIndexPage() {
  redirect(ADMIN_CONFIG.dashboardPath);
}
