/**
 * Server wrapper for the client `ServicesSection` — fetches services from the
 * admin-managed `service` module and feeds them in. Falls back to the static
 * `SERVICES_DATA` if the API is empty or unreachable, so the home page never
 * renders an empty section.
 */

import { ServicesSection } from "@/components/sections/services-section";
import { getPublicServicesAsLegacy } from "@/lib/api/services";
import type { HeadingSection } from "@/lib/api/shared-sections";

interface Props {
  className?: string;
  heading?: HeadingSection | null;
}

export async function LiveServicesSection({ className, heading }: Props) {
  const services = await getPublicServicesAsLegacy();
  return (
    <ServicesSection
      className={className}
      data={services.length ? services : undefined}
      heading={heading}
    />
  );
}
