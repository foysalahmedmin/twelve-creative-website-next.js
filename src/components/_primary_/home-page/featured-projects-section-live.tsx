/**
 * Server wrapper for the client `FeaturedProjectsSection` — fetches grouped
 * categories from the admin-managed `featured-project` module and feeds them
 * in. Falls back to the static `FEATURED_CATEGORIES` if the API is empty or
 * unreachable, so the home page never renders an empty section.
 */

import { FeaturedProjectsSection } from "@/components/_primary_/home-page/featured-projects-section";
import { getPublicFeaturedProjectsGrouped } from "@/lib/api/featured-projects";

interface Props {
  className?: string;
}

export async function LiveFeaturedProjectsSection({ className }: Props) {
  const grouped = await getPublicFeaturedProjectsGrouped();
  return (
    <FeaturedProjectsSection
      className={className}
      data={grouped.length ? grouped : undefined}
    />
  );
}
