import { DifferenceSection } from "@/components/_primary_/home-page/difference-section";
import { AlternatingServicesSection } from "@/components/sections/alternating-services-section";
import { CTASection } from "@/components/sections/cta-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { ProcessSection } from "@/components/sections/process-section";
import { CTA_PROCESS } from "@/data/page-ctas.data";
import { PROCESS_DATA, PROCESS_STEPS } from "@/data/process.data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Process | How Twelve Creative Builds Growth Systems",
  description:
    "Learn how Twelve Creative approaches growth through diagnostics, positioning, creative production, system installation, and optimization.",
};

/**
 * Per-step outputs and activities derived from the requirements doc.
 * Each step's `Output` describes what the business has at the end of that stage.
 */
const STEP_HIGHLIGHTS: Record<string, string[]> = {
  "step-1": [
    "Business and offer review",
    "Audience and market mapping",
    "Bottleneck and friction audit",
  ],
  "step-2": [
    "Sharper message and angle",
    "Offer structure clarified",
    "Sales language aligned",
  ],
  "step-3": [
    "Brand films and founder content",
    "Campaign and short-form assets",
    "Photography and stills",
  ],
  "step-4": [
    "Paid social and retargeting",
    "Email and SMS campaigns",
    "PR and influencer coordination",
  ],
  "step-5": [
    "Landing pages and lead capture",
    "CRM, automations, follow-up",
    "Tracking and reporting",
  ],
  "step-6": [
    "Performance review cadence",
    "Drop-off and conversion analysis",
    "Iterative refinements",
  ],
};

const PROCESS_ITEMS = PROCESS_STEPS.map((step) => ({
  id: step.id,
  title: `Step ${step.index} — ${step.title}`,
  description: step.description,
  highlights: STEP_HIGHLIGHTS[step.id] ?? [],
  thumbnail_src: step.image,
}));

export default function ProcessPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label="Our Process"
        title="Our process is built around clarity first."
        description="We do not begin by making random assets. We begin by understanding what the business is trying to move, where the friction is, and what structure needs to be built."
        breadcrumb={[{ label: "Process", active: true }]}
      />

      {/* Interactive step overview */}
      <ProcessSection data={PROCESS_DATA} />

      {/* Each step in depth */}
      <AlternatingServicesSection data={PROCESS_ITEMS} />

      {/* The Twelve Creative Difference */}
      <DifferenceSection />

      {/* CTA */}
      <CTASection data={CTA_PROCESS} />
    </main>
  );
}
