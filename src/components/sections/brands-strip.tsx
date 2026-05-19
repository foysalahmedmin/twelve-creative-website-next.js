/**
 * Server wrapper that fetches admin-managed brands and renders the existing
 * `BrandsSection` client component. Falls back to the static `BRANDS_DATA`
 * if the API returns nothing — keeps the public site rendering correctly
 * even before the client adds their first brand.
 */

import { BrandsSection } from "@/components/sections/brands-section";
import type { TBrand } from "@/data/brands.data";
import { getPublicBrands } from "@/lib/api/brands";

interface Props {
  className?: string;
}

export async function BrandsStrip({ className }: Props) {
  const brands = await getPublicBrands();
  const data: TBrand[] = brands.map((b) => ({
    id: b._id,
    name: b.name,
    logo_src: b.logo,
    alt: b.name,
  }));
  return <BrandsSection data={data.length ? data : undefined} className={className} />;
}
