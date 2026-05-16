import { PageHeader } from "@/components/sections/page-header-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Process | Twelve Creative",
  description:
    "How Twelve Creative approaches every engagement — from business audit and positioning to creative production, distribution, and system install.",
};

export default function ProcessPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="A clear process from understanding to execution."
        description="We audit, position, build, launch, and install — then review and improve based on what actually happens."
        breadcrumb={[{ label: "Process", active: true }]}
      />
    </main>
  );
}
