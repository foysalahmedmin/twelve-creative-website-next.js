import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminContactSetting } from "@/lib/api/contact-settings";
import { ContactSettingForm } from "./contact-setting-form";

export const dynamic = "force-dynamic";

export default async function AdminContactFormPage() {
  const setting = await getAdminContactSetting();

  return (
    <div className="container max-w-3xl space-y-6 py-8">
      <AdminPageHeader
        title="Contact Form"
        description="Field labels, placeholders, which fields appear, and the Timeline and Budget dropdown options."
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Contact Form" },
        ]}
      />
      <ContactSettingForm initial={setting} />
    </div>
  );
}
