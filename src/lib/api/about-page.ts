import { unstable_rethrow } from "next/navigation";
import {
  ABOUT_GALLERY_DATA,
  ABOUT_MISSION_DATA,
  ABOUT_STORY_DATA,
} from "@/data/about.data";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import { normalizeCmsMedia, type CmsMedia } from "./cms-media";

export const ABOUT_PAGE_TAG = "about-page";

export interface AboutSectionHeader {
  label: string;
  title: string;
  description: string;
  is_visible: boolean;
}

export interface AboutValueCard {
  title: string;
  description: string;
  is_visible: boolean;
}

export interface AboutStoryCard {
  id: string;
  index: string;
  title: string;
  description: string;
  media: CmsMedia;
  is_visible: boolean;
}

export interface AboutFounder {
  eyebrow?: string;
  first_name: string;
  last_name: string;
  title: string;
  biography: string[];
  media: CmsMedia;
  is_visible: boolean;
}

export interface AboutGalleryItem {
  id: string;
  index: string;
  alt: string;
  media: CmsMedia;
  is_visible: boolean;
}

export interface PublicAboutPage {
  mission_section: AboutSectionHeader | null;
  mission: AboutValueCard | null;
  vision: AboutValueCard | null;
  story_section: AboutSectionHeader | null;
  story_cards: AboutStoryCard[];
  founder: AboutFounder | null;
  gallery_section: AboutSectionHeader | null;
  gallery: AboutGalleryItem[];
}

export interface AdminAboutPage {
  mission_section: AboutSectionHeader;
  mission: AboutValueCard;
  vision: AboutValueCard;
  story_section: AboutSectionHeader;
  story_cards: AboutStoryCard[];
  founder: AboutFounder;
  gallery_section: AboutSectionHeader;
  gallery: AboutGalleryItem[];
  _id?: string;
  singleton_key?: "about";
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const BUILT_IN_GALLERY_ALTS = [
  "Hospitality production by Twelve Creative",
  "Property production by Twelve Creative",
  "Aviation production by Twelve Creative",
  "Twelve Creative strategy session",
  "Twelve Creative camera production",
  "Restaurant production by Twelve Creative",
];

const BUILT_IN_STORY_IDS = [
  "where-it-started",
  "business-logic",
  "assets-to-systems",
  "today",
];

/** Exact reviewed content used by the existing About page and backend seed. */
export const BUILT_IN_ABOUT_PAGE: AdminAboutPage = {
  mission_section: {
    label: "Our Mission",
    title: "Built for Strategic Execution",
    description:
      "We build the structure that helps businesses become understood, trusted, and easier to buy from.",
    is_visible: true,
  },
  mission: {
    title: ABOUT_MISSION_DATA.mission.title,
    description: ABOUT_MISSION_DATA.mission.desc,
    is_visible: true,
  },
  vision: {
    title: ABOUT_MISSION_DATA.vision.title,
    description: ABOUT_MISSION_DATA.vision.desc,
    is_visible: true,
  },
  story_section: {
    label: "Our Story",
    title: "Merging Art and Science",
    description:
      "Our journey of combining creative excellence with backend growth infrastructure.",
    is_visible: true,
  },
  story_cards: ABOUT_STORY_DATA.map((card, position) => ({
    id: BUILT_IN_STORY_IDS[position] ?? `story-${position + 1}`,
    index: String(position + 1).padStart(2, "0"),
    title: card.title,
    description: card.description,
    media: { type: "image", image: card.image },
    is_visible: true,
  })),
  founder: {
    first_name: "Carlos",
    last_name: "Doce",
    title: "Owner — Twelve Creative",
    biography: [
      "Carlos built Twelve Creative from the belief that most businesses don't have a creative problem — they have a strategy problem disguised as one. He combines the analytical rigor of growth systems with the visual instincts of a creative director.",
      "Every project at Twelve Creative reflects his core conviction: that positioning, creative, and execution must exist in the same room — not across three different agencies.",
    ],
    media: {
      type: "image",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&auto=format",
    },
    is_visible: true,
  },
  gallery_section: {
    label: "Behind the Scenes",
    title: "Inside Twelve Creative",
    description:
      "A look at the people, places, and production behind the work.",
    is_visible: true,
  },
  gallery: ABOUT_GALLERY_DATA.map((image, position) => ({
    id:
      [
        "hospitality-production",
        "property-production",
        "aviation-production",
        "strategy-session",
        "camera-production",
        "restaurant-production",
      ][position] ?? `gallery-${position + 1}`,
    index: String(position + 1).padStart(2, "0"),
    alt: BUILT_IN_GALLERY_ALTS[position] ?? "Twelve Creative production",
    media: { type: "image", image },
    is_visible: true,
  })),
  is_active: true,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const clean = value.trim();
  return clean && clean.length <= maxLength ? clean : null;
}

function optionalString(
  value: unknown,
  maxLength: number,
): string | undefined | null {
  if (value === undefined) return undefined;
  if (typeof value !== "string") return null;
  const clean = value.trim();
  return clean.length <= maxLength ? clean || undefined : null;
}

function normalizeHeader(value: unknown): AboutSectionHeader | null {
  if (!isRecord(value) || typeof value.is_visible !== "boolean") return null;
  const label = requiredString(value.label, 100);
  const title = requiredString(value.title, 300);
  const description = requiredString(value.description, 1200);
  return label && title && description
    ? { label, title, description, is_visible: value.is_visible }
    : null;
}

function normalizeValueCard(value: unknown): AboutValueCard | null {
  if (!isRecord(value) || typeof value.is_visible !== "boolean") return null;
  const title = requiredString(value.title, 160);
  const description = requiredString(value.description, 1200);
  return title && description
    ? { title, description, is_visible: value.is_visible }
    : null;
}

function normalizeStoryCard(value: unknown): AboutStoryCard | null {
  if (!isRecord(value) || typeof value.is_visible !== "boolean") return null;
  const id = requiredString(value.id, 64);
  const index = requiredString(value.index, 2);
  const title = requiredString(value.title, 180);
  const description = requiredString(value.description, 1600);
  const media = normalizeCmsMedia(value.media);
  if (
    !id ||
    !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id) ||
    !index ||
    !/^\d{2}$/.test(index) ||
    !title ||
    !description ||
    !media
  ) {
    return null;
  }
  return { id, index, title, description, media, is_visible: value.is_visible };
}

function normalizeFounder(value: unknown): AboutFounder | null {
  if (!isRecord(value) || typeof value.is_visible !== "boolean") return null;
  const eyebrow = optionalString(value.eyebrow, 100);
  const firstName = requiredString(value.first_name, 80);
  const lastName = requiredString(value.last_name, 80);
  const title = requiredString(value.title, 160);
  const media = normalizeCmsMedia(value.media);
  if (
    eyebrow === null ||
    !firstName ||
    !lastName ||
    !title ||
    !media ||
    !Array.isArray(value.biography) ||
    value.biography.length < 1 ||
    value.biography.length > 6
  ) {
    return null;
  }
  const biography = value.biography.map((paragraph) =>
    requiredString(paragraph, 1600),
  );
  if (biography.some((paragraph) => paragraph === null)) return null;
  return {
    ...(eyebrow ? { eyebrow } : {}),
    first_name: firstName,
    last_name: lastName,
    title,
    biography: biography as string[],
    media,
    is_visible: value.is_visible,
  };
}

function normalizeGalleryItem(value: unknown): AboutGalleryItem | null {
  if (!isRecord(value) || typeof value.is_visible !== "boolean") return null;
  const id = requiredString(value.id, 64);
  const index = requiredString(value.index, 2);
  const alt = requiredString(value.alt, 200);
  const media = normalizeCmsMedia(value.media);
  if (
    !id ||
    !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id) ||
    !index ||
    !/^\d{2}$/.test(index) ||
    !alt ||
    !media
  ) {
    return null;
  }
  return { id, index, alt, media, is_visible: value.is_visible };
}

function normalizeAboutPage(
  value: unknown,
  requireAdminFields: boolean,
): AdminAboutPage | PublicAboutPage | null {
  if (!isRecord(value)) return null;
  const missionSection = normalizeHeader(value.mission_section);
  const mission = normalizeValueCard(value.mission);
  const vision = normalizeValueCard(value.vision);
  const storySection = normalizeHeader(value.story_section);
  const founder = normalizeFounder(value.founder);
  const gallerySection = normalizeHeader(value.gallery_section);
  const fixedBlocksAreValid = requireAdminFields
    ? Boolean(
        missionSection &&
          mission &&
          vision &&
          storySection &&
          founder &&
          gallerySection,
      )
    : [
        [value.mission_section, missionSection],
        [value.mission, mission],
        [value.vision, vision],
        [value.story_section, storySection],
        [value.founder, founder],
        [value.gallery_section, gallerySection],
      ].every(([raw, normalized]) => raw == null || normalized !== null);
  if (
    !fixedBlocksAreValid ||
    !Array.isArray(value.story_cards) ||
    (requireAdminFields && value.story_cards.length < 1) ||
    value.story_cards.length > 12 ||
    !Array.isArray(value.gallery) ||
    (requireAdminFields && value.gallery.length < 1) ||
    value.gallery.length > 24
  ) {
    return null;
  }

  const stories = value.story_cards.map(normalizeStoryCard);
  const gallery = value.gallery.map(normalizeGalleryItem);
  if (
    stories.some((item) => item === null) ||
    gallery.some((item) => item === null)
  ) {
    return null;
  }
  const storyCards = stories as AboutStoryCard[];
  const galleryItems = gallery as AboutGalleryItem[];
  if (
    new Set(storyCards.map((item) => item.id)).size !== storyCards.length ||
    new Set(galleryItems.map((item) => item.id)).size !== galleryItems.length
  ) {
    return null;
  }

  const page: PublicAboutPage = {
    mission_section: missionSection,
    mission,
    vision,
    story_section: storySection,
    story_cards: storyCards,
    founder,
    gallery_section: gallerySection,
    gallery: galleryItems,
  };
  if (!requireAdminFields) return page;
  if (typeof value.is_active !== "boolean") return null;

  const adminPage: AdminAboutPage = {
    mission_section: missionSection!,
    mission: mission!,
    vision: vision!,
    story_section: storySection!,
    story_cards: storyCards,
    founder: founder!,
    gallery_section: gallerySection!,
    gallery: galleryItems,
    is_active: value.is_active,
  };
  if (typeof value._id === "string") adminPage._id = value._id;
  if (value.singleton_key === "about") adminPage.singleton_key = "about";
  if (typeof value.created_at === "string")
    adminPage.created_at = value.created_at;
  if (typeof value.updated_at === "string")
    adminPage.updated_at = value.updated_at;
  return adminPage;
}

function cloneBuiltIn(): AdminAboutPage {
  return structuredClone(BUILT_IN_ABOUT_PAGE);
}

export async function getPublicAboutPage(): Promise<PublicAboutPage | null> {
  try {
    const response = await apiFetch<unknown>("/api/about-page/public", {
      method: "GET",
      auth: false,
      revalidate: 300,
      tags: [ABOUT_PAGE_TAG],
    });
    // A successful `null` response is authoritative: the singleton is either
    // absent or inactive, so its managed sections must stay hidden. The
    // built-in copy is only a resilience fallback when the API cannot be
    // reached at all.
    if (response.data === null || response.data === undefined) return null;
    if (isRecord(response.data) && response.data.is_active === false) {
      return null;
    }
    return normalizeAboutPage(response.data, false) as PublicAboutPage | null;
  } catch {
    return cloneBuiltIn();
  }
}

export async function getAdminAboutPage(): Promise<AdminAboutPage | null> {
  try {
    const response = await apiFetch<unknown>("/api/about-page", {
      method: "GET",
    });
    if (response.data === null || response.data === undefined) return null;
    const normalized = normalizeAboutPage(response.data, true);
    if (!normalized) {
      throw new ApiError(
        502,
        "Saved About page data is malformed. Please repair it through the API before editing.",
        null,
      );
    }
    return normalized as AdminAboutPage;
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
