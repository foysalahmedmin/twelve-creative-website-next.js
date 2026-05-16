import { PageHeader } from "@/components/sections/page-header-section";
import { CONTACT_PAGE_DATA } from "@/data/contact.data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Twelve Creative",
  description:
    "Start a conversation with Twelve Creative. Tell us what you're building and where you need to go.",
};

export default function ContactPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title={CONTACT_PAGE_DATA.header.title}
        description={CONTACT_PAGE_DATA.header.description}
        breadcrumb={[{ label: "Contact Us", active: true }]}
      />
    </main>
  );
}
