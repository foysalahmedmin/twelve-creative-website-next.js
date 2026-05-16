/**
 * Page Feature Configuration
 * This file manages the metadata and activation status of all primary routes.
 */

export type TPageFeature = {
  enabled: boolean;
  name: string;
  description?: string;
  launch_date?: string;
};

export const PAGE_FEATURES: Record<string, TPageFeature> = {
  "/": { enabled: true, name: "Home" },
  "/about": { enabled: true, name: "About" },
};

export const getPageFeature = (path: string): TPageFeature | undefined => {
  const matchingPath = Object.keys(PAGE_FEATURES)
    .filter((p) => path === p || path.startsWith(p + "/"))
    .sort((a, b) => b.length - a.length)[0];

  return matchingPath ? PAGE_FEATURES[matchingPath] : undefined;
};

export const isPageEnabled = (path: string): boolean => {
  const feature = getPageFeature(path);
  return feature ? feature.enabled : true;
};
