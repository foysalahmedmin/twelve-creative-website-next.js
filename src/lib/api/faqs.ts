import type { TFaqsData, TFaqItem } from "@/data/faqs.data";
import { apiFetch } from "@/lib/admin/api-client";

export const FAQS_TAG = "faqs";

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  group?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getPublicFaqs(): Promise<Faq[]> {
  try {
    const res = await apiFetch<Faq[]>("/api/faq/public", {
      method: "GET",
      auth: false,
      revalidate: 300,
      tags: [FAQS_TAG],
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getAdminFaqs(query: {
  search?: string;
  page?: number;
  limit?: number;
  filter?: "active" | "inactive";
} = {}): Promise<{
  data: Faq[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.filter) params.set("filter", query.filter);

  const qs = params.toString();
  const res = await apiFetch<Faq[]>(`/api/faq${qs ? `?${qs}` : ""}`);
  return {
    data: res.data ?? [],
    meta: res.meta as
      | { total: number; page: number; limit: number; total_pages: number }
      | undefined,
  };
}

export async function getFaqById(id: string): Promise<Faq> {
  const res = await apiFetch<Faq>(`/api/faq/${id}`);
  return res.data;
}

/**
 * Adapts admin FAQs to the legacy `TFaqsData` shape `FaqSection` already
 * consumes — chrome (image/title/description/etc.) comes from defaults.
 */
export async function getPublicFaqsForSection(
  defaults: Omit<TFaqsData, "faqs">,
): Promise<TFaqsData> {
  const items = await getPublicFaqs();
  const faqs: TFaqItem[] = items.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));
  return { ...defaults, faqs };
}
