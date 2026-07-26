import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { getPublicIndustries } from "@/lib/api/industries";
import { getPublicWorks } from "@/lib/api/works";

const STATIC_PATHS = [
  "",
  "/about",
  "/what-we-build",
  "/industries",
  "/works",
  "/process",
  "/contact",
  "/faq",
  "/blogs",
  "/privacy-policy",
  "/terms-and-conditions",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [industries, works] = await Promise.all([
    getPublicIndustries(),
    getPublicWorks(),
  ]);
  const lastModified = new Date();
  const paths = [
    ...STATIC_PATHS,
    ...industries.map((industry) => `/industries/${industry.slug}` as const),
    ...works.map((work) => `/works/${work.slug}` as const),
  ];
  return paths.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: path.startsWith("/works/")
      ? new Date(
          works.find((work) => path === `/works/${work.slug}`)?.updated_at ??
            lastModified,
        )
      : lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/industries/") ? 0.8 : 0.7,
  }));
}
