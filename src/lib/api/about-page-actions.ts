"use server";

import { revalidatePath, updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import { sanitizeCmsMedia } from "./cms-media";
import { ABOUT_PAGE_TAG, type AdminAboutPage } from "./about-page";

export type AboutPageInput = Omit<
  AdminAboutPage,
  "_id" | "singleton_key" | "created_at" | "updated_at"
>;

type AboutPageUpdateBody = Omit<AboutPageInput, "story_cards" | "gallery"> & {
  story_cards: Array<Omit<AdminAboutPage["story_cards"][number], "index">>;
  gallery: Array<Omit<AdminAboutPage["gallery"][number], "index">>;
};

export interface AboutPageActionResult {
  ok: boolean;
  error?: string;
  data?: AdminAboutPage;
}

function cleanHeader(header: AdminAboutPage["mission_section"]) {
  return {
    label: header.label.trim(),
    title: header.title.trim(),
    description: header.description.trim(),
    is_visible: header.is_visible,
  };
}

function sanitize(payload: AboutPageInput): AboutPageUpdateBody {
  return {
    mission_section: cleanHeader(payload.mission_section),
    mission: {
      title: payload.mission.title.trim(),
      description: payload.mission.description.trim(),
      is_visible: payload.mission.is_visible,
    },
    vision: {
      title: payload.vision.title.trim(),
      description: payload.vision.description.trim(),
      is_visible: payload.vision.is_visible,
    },
    story_section: cleanHeader(payload.story_section),
    story_cards: payload.story_cards.map((card) => ({
      id: card.id.trim(),
      title: card.title.trim(),
      description: card.description.trim(),
      media: sanitizeCmsMedia(card.media),
      is_visible: card.is_visible,
    })),
    founder: {
      ...(payload.founder.eyebrow?.trim()
        ? { eyebrow: payload.founder.eyebrow.trim() }
        : {}),
      first_name: payload.founder.first_name.trim(),
      last_name: payload.founder.last_name.trim(),
      title: payload.founder.title.trim(),
      biography: payload.founder.biography.map((paragraph) => paragraph.trim()),
      media: sanitizeCmsMedia(payload.founder.media),
      is_visible: payload.founder.is_visible,
    },
    gallery_section: cleanHeader(payload.gallery_section),
    gallery: payload.gallery.map((item) => ({
      id: item.id.trim(),
      alt: item.alt.trim(),
      media: sanitizeCmsMedia(item.media),
      is_visible: item.is_visible,
    })),
    is_active: payload.is_active,
  };
}

function errorMessage(error: unknown): string {
  unstable_rethrow(error);
  if (error instanceof ApiError) {
    const sources = error.body?.errorSources;
    if (sources?.length) {
      return sources
        .map((source) => `${source.path}: ${source.message}`)
        .join(" · ");
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Save failed";
}

export async function updateAboutPageAction(
  payload: AboutPageInput,
): Promise<AboutPageActionResult> {
  try {
    const response = await apiFetch<AdminAboutPage>("/api/about-page", {
      method: "PATCH",
      body: sanitize(payload),
    });
    updateTag(ABOUT_PAGE_TAG);
    revalidatePath("/about");
    revalidatePath("/admin/about-page");
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}
