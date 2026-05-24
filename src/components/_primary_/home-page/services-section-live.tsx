/**
 * Server wrapper for the client `ServicesSection` — fetches services from the
 * admin-managed `service` module and feeds them in. Falls back to the static
 * `SERVICES_DATA` if the API is empty or unreachable, so the home page never
 * renders an empty section.
 */

import { ServicesSection } from "@/components/_primary_/home-page/services-section";
import { getPublicServicesAsLegacy } from "@/lib/api/services";

interface Props {
  className?: string;
}

export async function LiveServicesSection({ className }: Props) {
  const services = await getPublicServicesAsLegacy();
  return (
    <ServicesSection
      className={className}
      data={services.length ? services : undefined}
    />
  );
}
