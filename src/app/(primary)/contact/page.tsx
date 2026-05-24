import { BookingSection } from "@/components/sections/booking-section";
import { ContactInfoMapSection } from "@/components/sections/contact-info-map-section";
import { PageContactSection } from "@/components/sections/contact-section-section";
import { FaqSection } from "@/components/sections/faqs-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { CONTACT_PAGE_DATA } from "@/data/contact.data";
import { FAQS_DATA } from "@/data/faqs.data";
import { getPublicFaqsForSection } from "@/lib/api/faqs";
import { getPublicPageHero, resolveVideoSrc } from "@/lib/api/page-heroes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Twelve Creative | Start a Conversation",
  description:
    "Start a conversation with Twelve Creative about positioning, creative, campaigns, websites, CRM, automation, and business growth systems.",
};

export default async function ContactPage() {
  const { header, contact_cards, booking, map } = CONTACT_PAGE_DATA;
  const [faqsData, hero] = await Promise.all([
    getPublicFaqsForSection({
      image: FAQS_DATA.image,
      alt: FAQS_DATA.alt,
      title: FAQS_DATA.title,
      description: FAQS_DATA.description,
      name: FAQS_DATA.name,
      position: FAQS_DATA.position,
      contact_link: FAQS_DATA.contact_link,
    }),
    getPublicPageHero("contact"),
  ]);

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label={hero?.label ?? "Contact"}
        title={hero?.title ?? header.title}
        description={hero?.description ?? header.description}
        videoSrc={resolveVideoSrc(hero?.video)}
      />

      {/* Inquiry form (cards removed — moved below with map) */}
      <PageContactSection />

      {/* Booking — opens the same multi-step modal used by the header CTA */}
      <BookingSection
        label={booking.label}
        title={booking.title}
        description={booking.description}
      />

      {/* Contact cards (left) + Map (right) — side-by-side on lg */}
      <ContactInfoMapSection
        label={map.label}
        title={map.title}
        description={map.description}
        cards={contact_cards}
        map={{ address: map.address, embed_src: map.embed_src }}
      />

      {/* FAQ for common questions before reaching out */}
      <div className="container py-8 lg:py-12">
        <FaqSection data={faqsData} />
      </div>
    </main>
  );
}
