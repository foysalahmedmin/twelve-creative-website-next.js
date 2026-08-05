export type TFeaturedAspect = "landscape" | "reel";

export type TFeaturedProject = {
  id: string;
  title: string;
  aspect: TFeaturedAspect;
  thumbnail_src: string;
  video_src: string;
};

export type TFeaturedIndustryGroup = {
  /** Stable Industry ObjectId; never derive tab identity from a label. */
  id: string;
  label: string;
  order: number;
  projects: TFeaturedProject[];
};

/** @deprecated Groups are Industry relations, not free-form categories. */
export type TFeaturedCategory = TFeaturedIndustryGroup;

export type TFeaturedProjectsData = {
  label: string;
  title: string;
  description: string;
  groups: TFeaturedIndustryGroup[];
};

/**
 * Header copy only — `groups` stays empty on purpose. Featured projects are
 * real client work, so there is no demo set to fall back to: with no CMS
 * entries the section renders nothing rather than showing invented projects.
 */
export const FEATURED_PROJECTS_DATA: TFeaturedProjectsData = {
  label: "Our Works",
  title: "Featured Projects",
  description:
    "Real projects that show how strategy, creative, and systems work together.",
  groups: [],
};
