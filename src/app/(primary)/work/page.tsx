import { PageHeader } from "@/components/sections/page-header-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work | Twelve Creative",
  description:
    "A selection of projects built by Twelve Creative — from brand positioning and cinematic production to full growth system installs.",
};

export default function WorkPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Work that connects strategy to result."
        description="Projects built for businesses that needed more than a single deliverable — they needed a system."
        breadcrumb={[{ label: "Work", active: true }]}
      />
    </main>
  );
}
