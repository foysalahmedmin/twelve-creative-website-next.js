import { unstable_rethrow } from "next/navigation";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import {
  PROCESS_DATA,
  PROCESS_ICON_KEYS,
  type TProcessData,
  type TProcessIconKey,
  type TProcessStep,
} from "@/data/process.data";

export const PROCESS_SECTION_TAG = "process-section";

const MAX_PROCESS_STEPS = 12;
const PROCESS_ICON_SET = new Set<string>(PROCESS_ICON_KEYS);

export interface ApiProcessSection extends TProcessData {
  _id?: string;
  singleton_key?: string;
  created_at?: string;
  updated_at?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanRequiredString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned.length > 0 && cleaned.length <= maxLength ? cleaned : null;
}

function isSafeImageReference(value: string): boolean {
  if (/[\u0000-\u001F\u007F]/.test(value) || value.includes("\\")) {
    return false;
  }

  if (value.startsWith("/")) {
    if (value.startsWith("//")) return false;
    try {
      const path = value.split(/[?#]/, 1)[0];
      return !decodeURIComponent(path).split("/").includes("..");
    } catch {
      return false;
    }
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeStep(value: unknown, position: number): TProcessStep | null {
  if (!isRecord(value)) return null;

  const title = cleanRequiredString(value.title, 160);
  const description = cleanRequiredString(value.description, 600);
  const image = cleanRequiredString(value.image, 2048);
  const rawIcon = cleanRequiredString(value.icon, 32);
  if (
    !title ||
    !description ||
    !image ||
    !isSafeImageReference(image) ||
    !rawIcon ||
    !PROCESS_ICON_SET.has(rawIcon)
  ) {
    return null;
  }

  const suppliedId = cleanRequiredString(value.id, 64);
  if (
    value.id !== undefined &&
    (!suppliedId || !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(suppliedId))
  ) {
    return null;
  }
  return {
    id: suppliedId ?? `process-step-${position + 1}`,
    index: String(position + 1).padStart(2, "0"),
    icon: rawIcon as TProcessIconKey,
    title,
    description,
    image,
  };
}

function normalizeProcessSection(value: unknown): ApiProcessSection | null {
  if (!isRecord(value)) return null;

  const label = cleanRequiredString(value.label, 80);
  const title = cleanRequiredString(value.title, 300);
  const description = cleanRequiredString(value.description, 800);
  const thumbnail = cleanRequiredString(value.thumbnail, 2048);
  if (
    !label ||
    !title ||
    !description ||
    !thumbnail ||
    !isSafeImageReference(thumbnail)
  ) {
    return null;
  }

  if (
    !Array.isArray(value.process_steps) ||
    value.process_steps.length < 1 ||
    value.process_steps.length > MAX_PROCESS_STEPS
  ) {
    return null;
  }

  const steps = value.process_steps.map(normalizeStep);
  if (steps.some((step) => step === null)) return null;
  const normalizedSteps = steps as TProcessStep[];
  if (
    new Set(normalizedSteps.map((step) => step.id)).size !==
    normalizedSteps.length
  ) {
    return null;
  }

  const section: ApiProcessSection = {
    label,
    title,
    description,
    thumbnail,
    process_steps: normalizedSteps,
  };

  for (const key of [
    "_id",
    "singleton_key",
    "created_at",
    "updated_at",
  ] as const) {
    if (typeof value[key] === "string") section[key] = value[key];
  }

  return section;
}

function builtInProcessSection(): ApiProcessSection {
  return {
    ...PROCESS_DATA,
    process_steps: PROCESS_DATA.process_steps.map((step) => ({ ...step })),
  };
}

/**
 * Public reads are deliberately resilient: malformed, missing, or temporarily
 * unavailable CMS data falls back to the reviewed built-in section so the
 * public pages never render an empty Process section.
 */
export async function getPublicProcessSection(): Promise<ApiProcessSection> {
  try {
    const response = await apiFetch<unknown>("/api/process-section/public", {
      method: "GET",
      auth: false,
      revalidate: 300,
      tags: [PROCESS_SECTION_TAG],
    });
    return normalizeProcessSection(response.data) ?? builtInProcessSection();
  } catch {
    return builtInProcessSection();
  }
}

/** Returns null only when the singleton has not been created yet. */
export async function getAdminProcessSection(): Promise<ApiProcessSection | null> {
  try {
    const response = await apiFetch<unknown>("/api/process-section", {
      method: "GET",
    });
    if (response.data === null || response.data === undefined) return null;

    const normalized = normalizeProcessSection(response.data);
    if (!normalized) {
      throw new ApiError(
        502,
        "Saved Process section data is malformed. Please repair it through the API before editing.",
        null,
      );
    }
    return normalized;
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
