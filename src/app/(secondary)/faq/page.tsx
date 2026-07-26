import { FaqSection } from "@/components/sections/faqs-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { FAQS_DATA } from "@/data/faqs.data";
import { getPublicFaqsForSection } from "@/lib/api/faqs";
import { getPublicSharedSection } from "@/lib/api/shared-sections";
import {
  getPublicPageHero,
  resolvePageMetadata,
  resolveThumbnail,
  resolveVideoSrc,
} from "@/lib/api/page-heroes";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPublicPageHero("faq");
  return resolvePageMetadata(hero, {
    title: "Frequently Asked Questions | Twelve Creative",
    description:
      "Answers about Twelve Creative's services, process, engagements, pricing, and industry experience.",
  });
}

export default async function FaqPage() {
  const [data, heading, hero] = await Promise.all([
    getPublicFaqsForSection({
      image: FAQS_DATA.image,
      alt: FAQS_DATA.alt,
      title: FAQS_DATA.title,
      description: FAQS_DATA.description,
      name: FAQS_DATA.name,
      position: FAQS_DATA.position,
      contact_link: FAQS_DATA.contact_link,
    }),
    getPublicSharedSection("faq"),
    getPublicPageHero("faq"),
  ]);

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label={hero?.label ?? "FAQ"}
        title={hero?.title ?? "Frequently Asked Questions"}
        description={
          hero?.description ??
          "Clear answers about how we work, who we work with, and what to expect from an engagement."
        }
        breadcrumb={[{ label: "FAQ", active: true }]}
        videoSrc={resolveVideoSrc(hero?.video)}
        thumbnailSrc={resolveThumbnail(hero?.thumbnail, hero?.video)}
      />
      <FaqSection data={data} heading={heading} className="border-t-0" />
    </main>
  );
}
