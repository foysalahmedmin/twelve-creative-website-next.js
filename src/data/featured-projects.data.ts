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
