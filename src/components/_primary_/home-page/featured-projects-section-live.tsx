/**
 * Server wrapper for the client `FeaturedProjectsSection`. Empty or
 * unavailable API data intentionally omits the section instead of publishing
 * demo projects.
 */

import { FeaturedProjectsSection } from "@/components/_primary_/home-page/featured-projects-section";
import { getPublicFeaturedProjectsGrouped } from "@/lib/api/featured-projects";
import type { HeadingSection } from "@/lib/api/shared-sections";

interface Props {
  className?: string;
  heading?: HeadingSection | null;
}

export async function LiveFeaturedProjectsSection({
  className,
  heading,
}: Props) {
  const grouped = await getPublicFeaturedProjectsGrouped();
  if (!grouped.length) return null;

  return (
    <FeaturedProjectsSection
      className={className}
      data={grouped}
      heading={heading}
    />
  );
}
