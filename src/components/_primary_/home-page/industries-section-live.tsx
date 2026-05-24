/**
 * Server wrapper for the client `IndustriesSection` — fetches industries from
 * the admin-managed `industry` module and feeds them in. Falls back to the
 * static `INDUSTRIES_DATA` if the API is empty or unreachable, so the home
 * page never renders an empty section.
 */

import { IndustriesSection } from "@/components/_primary_/home-page/industries-section";
import { getPublicIndustriesAsLegacy } from "@/lib/api/industries";

interface Props {
  className?: string;
}

export async function LiveIndustriesSection({ className }: Props) {
  const industries = await getPublicIndustriesAsLegacy();
  return (
    <IndustriesSection
      className={className}
      data={industries.length ? industries : undefined}
    />
  );
}
