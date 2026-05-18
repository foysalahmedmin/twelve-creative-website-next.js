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
        label="What We Build"
        title="We build the systems that capture demand & move businesses forward."
        description="Positioning, cinematic creative, websites, CRM, and automations — all built as a single unified engine to turn attention into revenue."
        breadcrumb={[{ label: "What We Build", active: true }]}
        videoSrc="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      />
    </main>
  );
}
