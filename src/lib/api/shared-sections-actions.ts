"use server";

import { revalidatePath, updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import { sanitizeCmsMedia } from "./cms-media";
import {
  SHARED_SECTION_TAG,
  type ApiSharedSection,
  type SharedSectionKey,
} from "./shared-sections";

export interface SharedSectionActionResult {
  ok: boolean;
  error?: string;
  data?: ApiSharedSection;
}

function cleanSection(section: ApiSharedSection): ApiSharedSection {
  const base = {
    // Empty is an intentional clear value for non-heading section labels.
    label: section.label?.trim() ?? "",
    title: section.title.trim(),
    description: section.description.trim(),
    is_active: section.is_active !== false,
  };
  if (section.key === "difference") {
    return {
      ...base,
      key: section.key,
      content: {
        fragmented: {
          title: section.content.fragmented.title.trim(),
          items: section.content.fragmented.items.map(
            ({ id, text }, position) => ({
              id: id.trim(),
              text: text.trim(),
              index: String(position + 1).padStart(2, "0"),
            }),
          ),
        },
        connected: {
          title: section.content.connected.title.trim(),
          items: section.content.connected.items.map(
            ({ id, text }, position) => ({
              id: id.trim(),
              text: text.trim(),
              index: String(position + 1).padStart(2, "0"),
            }),
          ),
        },
        ...(section.content.media
          ? { media: sanitizeCmsMedia(section.content.media) }
          : {}),
      },
    };
  }
  if (section.key === "why-choose-us") {
    return {
      ...base,
      key: section.key,
      content: {
        features: section.content.features.map((feature, position) => ({
          ...feature,
          id: feature.id.trim(),
          index: String(position + 1).padStart(2, "0"),
          title: feature.title.trim(),
          description: feature.description.trim(),
          ...(feature.media ? { media: sanitizeCmsMedia(feature.media) } : {}),
        })),
      },
    };
  }
  if (section.key === "growth-system") {
    return {
      ...base,
      key: section.key,
      content: {
        steps: section.content.steps.map((step, position) => ({
          ...step,
          id: step.id.trim(),
          index: String(position + 1).padStart(2, "0"),
          title: step.title.trim(),
          description: step.description.trim(),
          media: sanitizeCmsMedia(step.media),
          items: step.items.map((item, itemPosition) => ({
            ...item,
            id: item.id.trim(),
            index: String(itemPosition + 1).padStart(2, "0"),
            text: item.text.trim(),
          })),
        })),
      },
    };
  }
  if (section.key === "scroll-statement") {
    return {
      ...base,
      key: section.key,
      content: {
        paragraphs: section.content.paragraphs.map((paragraph, position) => ({
          ...paragraph,
          id: paragraph.id.trim(),
          index: String(position + 1).padStart(2, "0"),
          segments: paragraph.segments.map((segment, segmentPosition) => ({
            ...segment,
            id: segment.id.trim(),
            index: String(segmentPosition + 1).padStart(2, "0"),
            text: segment.text,
          })),
        })),
      },
    };
  }
  if (section.key === "work-with-us") {
    return {
      ...base,
      key: section.key,
      content: {
        cards: section.content.cards.map((card, position) => ({
          ...card,
          id: card.id.trim(),
          index: String(position + 1).padStart(2, "0"),
          title: card.title.trim(),
          description: card.description.trim(),
          ...(card.media ? { media: sanitizeCmsMedia(card.media) } : {}),
        })),
      },
    };
  }
  return { ...base, key: section.key, content: {} };
}

function invalidateSharedSections(key: SharedSectionKey): void {
  updateTag(SHARED_SECTION_TAG);
  updateTag(`${SHARED_SECTION_TAG}-${key}`);
  for (const path of [
    "/",
    "/about",
    "/works",
    "/industries",
    "/process",
    "/what-we-build",
    "/canvus",
    "/faq",
  ]) {
    revalidatePath(path);
  }
  revalidatePath("/industries/[slug]", "page");
  revalidatePath("/marketing/industries/[slug]", "page");
  revalidatePath("/verticals/[id]", "page");
  revalidatePath("/admin/shared-sections");
  revalidatePath(`/admin/shared-sections/${key}`);
}

function errorMessage(error: unknown): string {
  unstable_rethrow(error);
  if (error instanceof ApiError) {
    if (error.body?.errorSources?.length) {
      return error.body.errorSources
        .map((source) => `${source.path}: ${source.message}`)
        .join(" · ");
    }
    return error.message;
  }
  return error instanceof Error ? error.message : "Save failed";
}

export async function saveSharedSectionAction(
  section: ApiSharedSection,
): Promise<SharedSectionActionResult> {
  try {
    const response = await apiFetch<ApiSharedSection>(
      `/api/shared-sections/${section.key}`,
      { method: "PUT", body: cleanSection(section) },
    );
    invalidateSharedSections(section.key);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}
