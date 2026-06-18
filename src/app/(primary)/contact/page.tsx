import { BookingSection } from "@/components/sections/booking-section";
import { ContactInfoMapSection } from "@/components/sections/contact-info-map-section";
import { PageContactSection } from "@/components/sections/contact-section-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { CONTACT_PAGE_DATA } from "@/data/contact.data";
import { getPublicPageHero, resolveVideoSrc, resolveThumbnail } from "@/lib/api/page-heroes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Twelve Creative | Start a Conversation",
  description:
    "Start a conversation with Twelve Creative about positioning, creative, campaigns, websites, CRM, automation, and business growth systems.",
};

export default async function ContactPage() {
  const { header, contact_cards, booking, map } = CONTACT_PAGE_DATA;
  const hero = await getPublicPageHero("contact");

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label={hero?.label ?? "Contact"}
        title={hero?.title ?? header.title}
        description={hero?.description ?? header.description}
        videoSrc={resolveVideoSrc(hero?.video)}
        thumbnailSrc={resolveThumbnail(hero?.thumbnail, hero?.video)}
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

    </main>
  );
}
