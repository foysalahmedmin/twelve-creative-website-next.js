import { PageHeader } from "@/components/sections/page-header-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What We Build | Twelve Creative",
  description:
    "Positioning, creative production, websites, ads, CRM, and automation — built together as a system, not as separate activities.",
};

export default function WhatWeBuildPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="We build the pieces that move a business forward."
        description="Positioning, creative, distribution, websites, CRM, and automation — designed to connect and work together."
        breadcrumb={[{ label: "What We Build", active: true }]}
      />
    </main>
  );
}
