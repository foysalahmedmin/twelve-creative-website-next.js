import { BookingSection } from "@/components/sections/booking-section";
import { ContactInfoMapSection } from "@/components/sections/contact-info-map-section";
import { PageContactSection } from "@/components/sections/contact-section-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { CONTACT_PAGE_DATA, type TContactCard } from "@/data/contact.data";
import {
  getPublicPageHero,
  resolvePageMetadata,
  resolveThumbnail,
  resolveVideoSrc,
} from "@/lib/api/page-heroes";
import { getPublicSiteSetting } from "@/lib/api/site-setting";
import { getPublicIndustryOptions } from "@/lib/api/industries";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPublicPageHero("contact");
  return resolvePageMetadata(hero, {
    title: "Contact Twelve Creative | Start a Conversation",
    description:
      "Start a conversation with Twelve Creative about positioning, creative, campaigns, websites, CRM, automation, and business growth systems.",
  });
}

export default async function ContactPage() {
  const { header, contact_cards, booking, map } = CONTACT_PAGE_DATA;
  const [hero, settings, industries] = await Promise.all([
    getPublicPageHero("contact"),
    getPublicSiteSetting(),
    getPublicIndustryOptions(),
  ]);

  const inquiryCopy = settings.contact_page?.inquiry;
  const bookingCopy = settings.contact_page?.booking;
  const mapCopy = settings.contact_page?.map;
  const liveCards = contact_cards.map((card) => {
    if (card.id === "email" && settings.contact_email) {
      return {
        ...card,
        value: settings.contact_email,
        href: `mailto:${settings.contact_email}`,
      };
    }
    if (card.id === "whatsapp" && settings.contact_whatsapp) {
      return {
        ...card,
        value: settings.contact_whatsapp,
        href: `https://wa.me/${settings.contact_whatsapp.replace(/[^0-9]/g, "")}`,
      };
    }
    return card;
  });
  const phone = settings.contact_phone?.trim();
  if (phone) {
    const phoneCard: TContactCard = {
      id: "phone",
      title: "Call Us",
      value: phone,
      href: `tel:${phone.replace(/[^+\d]/g, "")}`,
    };
    liveCards.splice(1, 0, phoneCard);
  }

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
      <PageContactSection
        industries={industries}
        label={inquiryCopy?.label || undefined}
        title={inquiryCopy?.title || undefined}
        description={inquiryCopy?.description || undefined}
      />

      {/* Booking — opens the same multi-step modal used by the header CTA */}
      <BookingSection
        label={bookingCopy?.label || booking.label}
        title={bookingCopy?.title || booking.title}
        description={bookingCopy?.description || booking.description}
        calendlyUrl={settings.calendly_url || undefined}
        industries={industries}
      />

      {/* Contact cards (left) + Map (right) — side-by-side on lg */}
      <ContactInfoMapSection
        label={mapCopy?.label || map.label}
        title={mapCopy?.title || map.title}
        description={mapCopy?.description || map.description}
        cards={liveCards}
        map={{
          address: settings.contact_address || map.address,
          embed_src: settings.contact_map_embed_url || map.embed_src,
        }}
      />
    </main>
  );
}
