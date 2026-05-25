"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import type { VideoRef } from "@/lib/admin/types";
import {
  PAGE_HERO_TAG,
  type ApiPageHero,
  type PageKey,
} from "./page-heroes";

export interface PageHeroInput {
  label?: string;
  title?: string;
  description?: string;
  thumbnail?: string | null;
  video?: (VideoRef & { poster?: string }) | null;
  trust_label?: string;
  primary_cta?: { label: string; href: string } | null;
  secondary_cta?: { label: string; href: string } | null;
  is_active?: boolean;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const PUBLIC_PATH: Record<PageKey, string> = {
  home: "/",
  about: "/about",
  works: "/works",
  industries: "/industries",
  "what-we-build": "/what-we-build",
  contact: "/contact",
  blogs: "/blogs",
  process: "/process",
};

export async function upsertPageHeroAction(
  page: PageKey,
  payload: PageHeroInput,
): Promise<ActionResult<ApiPageHero>> {
  try {
    const res = await apiFetch<ApiPageHero>(`/api/page-hero/${page}`, {
      method: "PATCH",
      body: payload,
    });
    updateTag(PAGE_HERO_TAG);
    updateTag(`${PAGE_HERO_TAG}-${page}`);
    revalidatePath("/admin/page-heroes");
    revalidatePath(`/admin/page-heroes/${page}/edit`);
    revalidatePath(PUBLIC_PATH[page]);
    return { ok: true, data: res.data };
  } catch (e) {
    if (e instanceof ApiError) {
      const sources = e.body?.errorSources;
      if (sources?.length) {
        return {
          ok: false,
          error: sources.map((s) => `${s.path}: ${s.message}`).join(" · "),
        };
      }
      return { ok: false, error: e.message };
    }
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Save failed",
    };
  }
}
