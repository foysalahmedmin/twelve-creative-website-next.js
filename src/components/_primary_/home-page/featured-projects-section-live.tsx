/**
 * Server wrapper for the client `FeaturedProjectsSection`. Empty or
 * unavailable API data intentionally omits the section instead of publishing
 * demo projects.
 */

import { FeaturedProjectsSection } from "@/components/_primary_/home-page/featured-projects-section";
import { getPublicFeaturedProjectsGrouped } from "@/lib/api/featured-projects";

interface Props {
  className?: string;
}

export async function LiveFeaturedProjectsSection({ className }: Props) {
  const grouped = await getPublicFeaturedProjectsGrouped();
  if (!grouped.length) return null;

  return <FeaturedProjectsSection className={className} data={grouped} />;
}
