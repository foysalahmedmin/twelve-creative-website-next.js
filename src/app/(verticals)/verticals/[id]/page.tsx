import { ScrollReveal } from "@/components/common/scroll-reveal";
import { BookingInlineSection } from "@/components/sections/booking-inline-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { WorkWithUsSection } from "@/components/sections/work-with-us-section";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { VERTICALS_DATA } from "@/data/verticals.data";
import { getPublicSiteSetting } from "@/lib/api/site-setting";
import { getPublicTestimonialsForSection } from "@/lib/api/testimonials";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const CANONICAL_INDUSTRY_SLUGS = new Set([
  "hospitality",
  "real-estate",
  "aviation",
  "professional-services",
]);

export async function generateStaticParams() {
  return VERTICALS_DATA.filter((v) => v.href.startsWith("/verticals/")).map(
    (v) => ({ id: v.id }),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vertical = VERTICALS_DATA.find((v) => v.id === id);
  if (!vertical) return {};
  return {
    title: `${vertical.title} | Twelve Creative`,
    description: vertical.body,
  };
}

export default async function VerticalDetailPage({ params }: Props) {
  const { id } = await params;
  // Industry is the canonical taxonomy. This mapping must not depend on a
  // successful API request: the target Industry page itself enforces active /
  // missing parent visibility with a 404.
  if (CANONICAL_INDUSTRY_SLUGS.has(id)) {
    permanentRedirect(`/industries/${id}`);
  }

  const vertical = VERTICALS_DATA.find((v) => v.id === id);
  if (!vertical) notFound();

  const [testimonialsData, settings] = await Promise.all([
    getPublicTestimonialsForSection({
      label: TESTIMONIALS_DATA.label,
      title: TESTIMONIALS_DATA.title,
      description: TESTIMONIALS_DATA.description,
    }),
    getPublicSiteSetting(),
  ]);

  return (
    <div className="bg-background min-h-screen">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        {/* Background image */}
        <img
          src={vertical.image}
          alt={vertical.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/20" />

        {/* Content */}
        <div className="relative z-10 container pt-24 pb-16 lg:pb-20">
          <ScrollReveal animation="fade-in-up" durationMs={700}>
            <span className="mb-6 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              {vertical.tagline}
            </span>
            <h1 className="font-heading mb-6 text-5xl leading-[110%] font-bold tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              {vertical.title}
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
              {vertical.body}
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-bold tracking-widest text-black uppercase transition-all hover:bg-white/90"
            >
              Book A Call
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialSection data={testimonialsData} />

      {/* ── Work With Us ── */}
      <WorkWithUsSection />

      {/* ── Inline Booking ── */}
      <BookingInlineSection calendlyUrl={settings.calendly_url || undefined} />
    </div>
  );
}
