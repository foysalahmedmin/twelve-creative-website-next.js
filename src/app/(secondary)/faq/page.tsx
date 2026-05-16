import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Twelve Creative",
  description: "Find answers to common questions about Twelve Creative's services, appointments, payments, and healthcare platform.",
};

export default function FaqPage() {

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Frequently Asked Questions"
        description="Learn how we collect, use, and protect your personal information."
        breadcrumb={[{ label: "Privacy Policy", active: true }]}
      />
    </main>
  );
}
