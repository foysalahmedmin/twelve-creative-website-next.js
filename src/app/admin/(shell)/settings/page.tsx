import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminSiteSetting } from "@/lib/api/site-setting";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const setting = await getAdminSiteSetting();

  return (
    <div className="container max-w-2xl space-y-6 py-8">
      <AdminPageHeader
        title="Site Settings"
        description="Single source of truth for contact info and social URLs. Updates take effect on the public site immediately."
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Settings" },
        ]}
      />

      <Card>
        <CardContent className="pt-6">
          <SettingsForm initial={setting} />
        </CardContent>
      </Card>
    </div>
  );
}
