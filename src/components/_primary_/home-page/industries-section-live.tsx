/**
 * Server wrapper for the client `IndustriesSection` — fetches industries from
 * the admin-managed `industry` module and feeds them in. Falls back to the
 * static `INDUSTRIES_DATA` only if the API is unreachable. An authoritative
 * empty response stays empty so removed CMS content is not resurrected.
 */

import { IndustriesSection } from "@/components/_primary_/home-page/industries-section";
import { getPublicIndustriesAsLegacyResult } from "@/lib/api/industries";
import type { HeadingSection } from "@/lib/api/shared-sections";

interface Props {
  className?: string;
  heading?: HeadingSection | null;
}

export async function LiveIndustriesSection({ className, heading }: Props) {
  const industries = await getPublicIndustriesAsLegacyResult();
  return (
    <IndustriesSection
      className={className}
      data={industries.failed ? undefined : industries.data}
      heading={heading}
    />
  );
}
