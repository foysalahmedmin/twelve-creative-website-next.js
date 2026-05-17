import { PageHeader } from "@/components/sections/page-header-section";
import { WorksCard } from "@/components/cards/works-card";
import { WORKS_PAGE_MOCK_DATA } from "@/data/works.data";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Works | Twelve Creative",
  description:
    "A selection of projects built by Twelve Creative — from brand positioning and cinematic production to full growth system installs.",
};

export default function WorksPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Works that connects strategy to result."
        description="Projects built for businesses that needed more than a single deliverable — they needed a system."
        breadcrumb={[{ label: "Works", active: true }]}
      />

      {/* Case Studies / Works Grid Section */}
      <section className="container py-16 sm:py-20 lg:py-24 border-t border-primary/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WORKS_PAGE_MOCK_DATA.map((item, index) => (
            <ScrollReveal
              key={item.id}
              animation="fade-in-up"
              delayMs={index * 150}
              className="h-full flex"
            >
              <WorksCard item={item} className="h-full w-full" />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
