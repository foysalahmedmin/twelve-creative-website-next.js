import { unstable_rethrow } from "next/navigation";
import { DIFFERENCE_DATA } from "@/data/difference.data";
import { GROWTH_SYSTEM_DATA } from "@/data/growth-system.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { CANVAS_PORTFOLIO_DATA } from "@/data/thumbnail-work-section.data";
import { WHY_CHOOSE_US_DATA } from "@/data/why-choose-us.data";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import { normalizeCmsMedia, type CmsMedia } from "./cms-media";
import {
  SHARED_SECTION_KEYS,
  WHY_CHOOSE_US_ICON_KEYS,
  type SharedHeadingKey,
  type SharedSectionKey,
  type WhyChooseUsIconKey,
} from "./shared-sections-shared";

export {
  SHARED_HEADING_KEYS,
  SHARED_SECTION_KEYS,
  SHARED_SECTION_LABELS,
  WHY_CHOOSE_US_ICON_KEYS,
  type SharedHeadingKey,
  type SharedSectionKey,
  type WhyChooseUsIconKey,
} from "./shared-sections-shared";

export const SHARED_SECTION_TAG = "shared-sections";

export interface OrderedTextItem {
  id: string;
  index: string;
  text: string;
}

export interface WhyChooseUsFeature {
  id: string;
  index: string;
  icon: WhyChooseUsIconKey;
  title: string;
  description: string;
  media?: CmsMedia;
}

export interface GrowthSystemStep {
  id: string;
  index: string;
  title: string;
  description: string;
  media: CmsMedia;
  items: OrderedTextItem[];
}

export interface StatementSegment {
  id: string;
  index: string;
  text: string;
  highlight: boolean;
}

export interface StatementParagraph {
  id: string;
  index: string;
  segments: StatementSegment[];
}

export interface WorkWithUsCard {
  id: string;
  index: string;
  title: string;
  description: string;
  media?: CmsMedia;
}

interface SharedSectionBase {
  label?: string;
  title: string;
  description: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type DifferenceSection = SharedSectionBase & {
  key: "difference";
  content: {
    fragmented: { title: string; items: OrderedTextItem[] };
    connected: { title: string; items: OrderedTextItem[] };
  };
};
export type WhyChooseUsSection = SharedSectionBase & {
  key: "why-choose-us";
  content: { features: WhyChooseUsFeature[] };
};
export type GrowthSystemSection = SharedSectionBase & {
  key: "growth-system";
  content: { steps: GrowthSystemStep[] };
};
export type ScrollStatementSection = SharedSectionBase & {
  key: "scroll-statement";
  content: { paragraphs: StatementParagraph[] };
};
export type WorkWithUsSection = SharedSectionBase & {
  key: "work-with-us";
  content: { cards: WorkWithUsCard[] };
};
export type HeadingSection = SharedSectionBase & {
  key: SharedHeadingKey;
  content: Record<string, never>;
};

export type ApiSharedSection =
  | DifferenceSection
  | WhyChooseUsSection
  | GrowthSystemSection
  | ScrollStatementSection
  | WorkWithUsSection
  | HeadingSection;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanString(
  value: unknown,
  maximum: number,
  required = true,
): string | null {
  if (typeof value !== "string") return required ? null : "";
  const clean = value.trim();
  if (clean.length > maximum || (required && !clean)) return null;
  return clean;
}

function cleanStatementText(value: unknown, maximum: number): string | null {
  if (typeof value !== "string") return null;
  if (!value.trim() || value.length > maximum) return null;
  return value;
}

function cleanId(value: unknown, fallback: string): string | null {
  if (value === undefined) return fallback;
  const id = cleanString(value, 64);
  return id && /^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id) ? id : null;
}

function hasUniqueIds(items: { id: string }[]): boolean {
  return new Set(items.map((item) => item.id)).size === items.length;
}

function normalizeTextItems(
  value: unknown,
  prefix: string,
  maximum = 12,
): OrderedTextItem[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > maximum) {
    return null;
  }
  const items = value.map((raw, position): OrderedTextItem | null => {
    if (!isRecord(raw)) return null;
    const id = cleanId(raw.id, `${prefix}-${position + 1}`);
    const text = cleanString(raw.text, 300);
    return id && text
      ? { id, index: String(position + 1).padStart(2, "0"), text }
      : null;
  });
  if (items.some((item) => item === null)) return null;
  const result = items as OrderedTextItem[];
  return hasUniqueIds(result) ? result : null;
}

function baseFrom(value: Record<string, unknown>) {
  const title = cleanString(value.title, 400);
  const description = cleanString(value.description, 1600);
  const label = cleanString(value.label, 100, false);
  if (!title || !description || label === null) return null;
  return {
    ...(label ? { label } : {}),
    title,
    description,
    is_active: value.is_active !== false,
    ...(typeof value.created_at === "string"
      ? { created_at: value.created_at }
      : {}),
    ...(typeof value.updated_at === "string"
      ? { updated_at: value.updated_at }
      : {}),
  };
}

function normalizeDifference(
  value: Record<string, unknown>,
  base: NonNullable<ReturnType<typeof baseFrom>>,
): DifferenceSection | null {
  if (!isRecord(value.content)) return null;
  const { fragmented, connected } = value.content;
  if (!isRecord(fragmented) || !isRecord(connected)) return null;
  const fragmentedTitle = cleanString(fragmented.title, 160);
  const connectedTitle = cleanString(connected.title, 160);
  const fragmentedItems = normalizeTextItems(fragmented.items, "fragmented");
  const connectedItems = normalizeTextItems(connected.items, "connected");
  if (
    !fragmentedTitle ||
    !connectedTitle ||
    !fragmentedItems ||
    !connectedItems
  ) {
    return null;
  }
  return {
    ...base,
    key: "difference",
    content: {
      fragmented: { title: fragmentedTitle, items: fragmentedItems },
      connected: { title: connectedTitle, items: connectedItems },
    },
  };
}

function normalizeWhyChooseUs(
  value: Record<string, unknown>,
  base: NonNullable<ReturnType<typeof baseFrom>>,
): WhyChooseUsSection | null {
  if (!isRecord(value.content) || !Array.isArray(value.content.features)) {
    return null;
  }
  if (value.content.features.length < 1 || value.content.features.length > 12) {
    return null;
  }
  const features = value.content.features.map(
    (raw, position): WhyChooseUsFeature | null => {
      if (!isRecord(raw)) return null;
      const id = cleanId(raw.id, `feature-${position + 1}`);
      const title = cleanString(raw.title, 160);
      const description = cleanString(raw.description, 800);
      const icon = cleanString(raw.icon, 40);
      const media =
        raw.media === undefined ? undefined : normalizeCmsMedia(raw.media);
      if (
        !id ||
        !title ||
        !description ||
        !WHY_CHOOSE_US_ICON_KEYS.includes(icon as WhyChooseUsIconKey) ||
        (raw.media !== undefined && !media)
      ) {
        return null;
      }
      return {
        id,
        index: String(position + 1).padStart(2, "0"),
        icon: icon as WhyChooseUsIconKey,
        title,
        description,
        ...(media ? { media } : {}),
      };
    },
  );
  if (features.some((item) => item === null)) return null;
  const result = features as WhyChooseUsFeature[];
  return hasUniqueIds(result)
    ? { ...base, key: "why-choose-us", content: { features: result } }
    : null;
}

function normalizeGrowthSystem(
  value: Record<string, unknown>,
  base: NonNullable<ReturnType<typeof baseFrom>>,
): GrowthSystemSection | null {
  if (!isRecord(value.content) || !Array.isArray(value.content.steps))
    return null;
  if (value.content.steps.length < 1 || value.content.steps.length > 12)
    return null;
  const steps = value.content.steps.map(
    (raw, position): GrowthSystemStep | null => {
      if (!isRecord(raw)) return null;
      const id = cleanId(raw.id, `step-${position + 1}`);
      const title = cleanString(raw.title, 160);
      const description = cleanString(raw.description, 1000);
      const media = normalizeCmsMedia(raw.media);
      const items = normalizeTextItems(raw.items, `step-${position + 1}-item`);
      return id && title && description && media && items
        ? {
            id,
            index: String(position + 1).padStart(2, "0"),
            title,
            description,
            media,
            items,
          }
        : null;
    },
  );
  if (steps.some((item) => item === null)) return null;
  const result = steps as GrowthSystemStep[];
  return hasUniqueIds(result)
    ? { ...base, key: "growth-system", content: { steps: result } }
    : null;
}

function normalizeScrollStatement(
  value: Record<string, unknown>,
  base: NonNullable<ReturnType<typeof baseFrom>>,
): ScrollStatementSection | null {
  if (!isRecord(value.content) || !Array.isArray(value.content.paragraphs)) {
    return null;
  }
  if (
    value.content.paragraphs.length < 1 ||
    value.content.paragraphs.length > 8
  ) {
    return null;
  }
  const paragraphs = value.content.paragraphs.map(
    (raw, position): StatementParagraph | null => {
      if (!isRecord(raw) || !Array.isArray(raw.segments)) return null;
      if (raw.segments.length < 1 || raw.segments.length > 20) return null;
      const id = cleanId(raw.id, `paragraph-${position + 1}`);
      const segments = raw.segments.map(
        (segment, segmentPosition): StatementSegment | null => {
          if (!isRecord(segment)) return null;
          const segmentId = cleanId(
            segment.id,
            `paragraph-${position + 1}-segment-${segmentPosition + 1}`,
          );
          // Statement segments intentionally keep surrounding spaces so adjacent
          // highlighted and plain fragments render as natural prose.
          const text = cleanStatementText(segment.text, 800);
          return segmentId && text
            ? {
                id: segmentId,
                index: String(segmentPosition + 1).padStart(2, "0"),
                text,
                highlight: segment.highlight === true,
              }
            : null;
        },
      );
      if (!id || segments.some((item) => item === null)) return null;
      const result = segments as StatementSegment[];
      return hasUniqueIds(result)
        ? {
            id,
            index: String(position + 1).padStart(2, "0"),
            segments: result,
          }
        : null;
    },
  );
  if (paragraphs.some((item) => item === null)) return null;
  const result = paragraphs as StatementParagraph[];
  return hasUniqueIds(result)
    ? { ...base, key: "scroll-statement", content: { paragraphs: result } }
    : null;
}

function normalizeWorkWithUs(
  value: Record<string, unknown>,
  base: NonNullable<ReturnType<typeof baseFrom>>,
): WorkWithUsSection | null {
  if (!isRecord(value.content) || !Array.isArray(value.content.cards))
    return null;
  if (value.content.cards.length < 1 || value.content.cards.length > 12)
    return null;
  const cards = value.content.cards.map(
    (raw, position): WorkWithUsCard | null => {
      if (!isRecord(raw)) return null;
      const id = cleanId(raw.id, `card-${position + 1}`);
      const title = cleanString(raw.title, 160);
      const description = cleanString(raw.description, 1000);
      const media =
        raw.media === undefined ? undefined : normalizeCmsMedia(raw.media);
      return id && title && description && (raw.media === undefined || media)
        ? {
            id,
            index: String(position + 1).padStart(2, "0"),
            title,
            description,
            ...(media ? { media } : {}),
          }
        : null;
    },
  );
  if (cards.some((item) => item === null)) return null;
  const result = cards as WorkWithUsCard[];
  return hasUniqueIds(result)
    ? { ...base, key: "work-with-us", content: { cards: result } }
    : null;
}

export function normalizeSharedSection(
  value: unknown,
): ApiSharedSection | null {
  if (!isRecord(value)) return null;
  const key = cleanString(value.key, 40);
  if (!SHARED_SECTION_KEYS.includes(key as SharedSectionKey)) return null;
  const base = baseFrom(value);
  if (!base) return null;
  if (key === "difference") return normalizeDifference(value, base);
  if (key === "why-choose-us") return normalizeWhyChooseUs(value, base);
  if (key === "growth-system") return normalizeGrowthSystem(value, base);
  if (key === "scroll-statement") return normalizeScrollStatement(value, base);
  if (key === "work-with-us") return normalizeWorkWithUs(value, base);
  if (!base.label) return null;
  if (!isRecord(value.content) || Object.keys(value.content).length > 0)
    return null;
  return { ...base, key: key as SharedHeadingKey, content: {} };
}

const orderedText = (prefix: string, items: string[]): OrderedTextItem[] =>
  items.map((text, position) => ({
    id: `${prefix}-${position + 1}`,
    index: String(position + 1).padStart(2, "0"),
    text,
  }));

const heading = (
  key: SharedHeadingKey,
  label: string,
  title: string,
  description: string,
): HeadingSection => ({
  key,
  label,
  title,
  description,
  content: {},
  is_active: true,
});

export const SHARED_SECTION_FALLBACKS: Record<
  SharedSectionKey,
  ApiSharedSection
> = {
  difference: {
    key: "difference",
    label: DIFFERENCE_DATA.eyebrow,
    title: DIFFERENCE_DATA.title,
    description: DIFFERENCE_DATA.description,
    content: {
      fragmented: {
        title: DIFFERENCE_DATA.fragmented.title,
        items: orderedText("fragmented", DIFFERENCE_DATA.fragmented.items),
      },
      connected: {
        title: DIFFERENCE_DATA.connected.title,
        items: orderedText("connected", DIFFERENCE_DATA.connected.items),
      },
    },
    is_active: true,
  },
  "why-choose-us": {
    key: "why-choose-us",
    label: WHY_CHOOSE_US_DATA.label,
    title: WHY_CHOOSE_US_DATA.title,
    description: WHY_CHOOSE_US_DATA.description,
    content: {
      features: WHY_CHOOSE_US_DATA.features.map((feature, position) => ({
        ...feature,
        index: String(position + 1).padStart(2, "0"),
      })),
    },
    is_active: true,
  },
  "growth-system": {
    key: "growth-system",
    label: GROWTH_SYSTEM_DATA.tag,
    title: GROWTH_SYSTEM_DATA.heading_title,
    description: GROWTH_SYSTEM_DATA.paragraph,
    content: {
      steps: GROWTH_SYSTEM_DATA.steps.map((step, position) => ({
        id: `growth-${position + 1}`,
        index: String(position + 1).padStart(2, "0"),
        title: step.title,
        description: step.description,
        media: { type: "image", image: step.image },
        items: orderedText(`growth-${position + 1}`, step.items),
      })),
    },
    is_active: true,
  },
  "scroll-statement": {
    key: "scroll-statement",
    title:
      "Make the business understood. Then construct the system that converts attention into revenue.",
    description:
      "Positioning, cinema-level creative, distribution, CRM, automation, and conversion logic are integrated from the start.",
    content: {
      paragraphs: [
        [
          { text: "Positioning, " },
          { text: "cinema-level creative", highlight: true },
          {
            text: ", and distribution are built together with the systems behind them. ",
          },
          { text: "CRM, automation, and conversion logic", highlight: true },
          { text: " integrated from the start." },
        ],
        [
          {
            text: "Demand is generated, qualified, and directed into revenue. The result is a business that is understood immediately and ",
          },
          { text: "scales with control", highlight: true },
          { text: "." },
        ],
      ].map((segments, paragraphPosition) => ({
        id: `paragraph-${paragraphPosition + 1}`,
        index: String(paragraphPosition + 1).padStart(2, "0"),
        segments: segments.map((segment, segmentPosition) => ({
          id: `paragraph-${paragraphPosition + 1}-${segmentPosition + 1}`,
          index: String(segmentPosition + 1).padStart(2, "0"),
          text: segment.text,
          highlight: segment.highlight === true,
        })),
      })),
    },
    is_active: true,
  },
  "work-with-us": {
    key: "work-with-us",
    title: "Work With Us",
    description:
      "Every engagement follows a clear structure built around the business.",
    content: {
      cards: [
        [
          "How We Work",
          "Every engagement follows the same three-phase structure — intelligence, execution, and refinement. No guesswork, no generic playbooks. Just a clear system built around your business.",
        ],
        [
          "Market Intelligence",
          "We study the business, audience, competition, and market conditions before building anything. The goal is to understand what drives demand, what creates trust, and where the clearest opportunity exists.",
        ],
        [
          "Strategy Into Systems",
          "We turn the intelligence into a working growth system: messaging, landing pages, CRM, ads, email, SMS, tracking, and follow-up. Everything is built so attention has somewhere to go.",
        ],
        [
          "Optimization & Advisory",
          "Once the system is in motion, we monitor performance, streamline what is working, report what matters, maintain the infrastructure, and continue advising the business as new opportunities appear.",
        ],
      ].map(([title, description], position) => ({
        id: `work-card-${position + 1}`,
        index: String(position + 1).padStart(2, "0"),
        title,
        description,
      })),
    },
    is_active: true,
  },
  "home-services": heading(
    "home-services",
    "Our Services",
    "Services Built to Move the Business",
    "We help businesses build positioning, creative, and systems that turn attention into revenue.",
  ),
  "home-featured-projects": heading(
    "home-featured-projects",
    "Our Works",
    "Featured Projects",
    "Real projects that show how strategy, creative, and systems work together.",
  ),
  "home-industries": heading(
    "home-industries",
    "Industries",
    "Industries We Work With",
    "We work across industries where the buying decision depends on credibility, timing, taste, and a clear path to action.",
  ),
  testimonials: heading(
    "testimonials",
    TESTIMONIALS_DATA.label,
    TESTIMONIALS_DATA.title,
    TESTIMONIALS_DATA.description,
  ),
  faq: heading(
    "faq",
    "FAQ",
    "Frequently Asked Questions",
    "Everything you need to know before we get started.",
  ),
  "core-verticals": heading(
    "core-verticals",
    "Industries",
    "Core Verticals",
    "We work across a focused set of industries where marketing structure, creative execution, and conversion systems make the biggest difference.",
  ),
  "work-showcase": heading(
    "work-showcase",
    CANVAS_PORTFOLIO_DATA.label,
    CANVAS_PORTFOLIO_DATA.title,
    CANVAS_PORTFOLIO_DATA.description,
  ),
  "visual-library": heading(
    "visual-library",
    "Visual Library",
    "A live look at the work.",
    "Frames from recent campaigns — content, ads, and brand assets built to perform.",
  ),
};

export function cloneSharedSection(
  section: ApiSharedSection,
): ApiSharedSection {
  return structuredClone(section);
}

export async function getPublicSharedSection<Key extends SharedSectionKey>(
  key: Key,
): Promise<Extract<ApiSharedSection, { key: Key }> | null> {
  try {
    const response = await apiFetch<unknown>(
      `/api/shared-sections/public/${key}`,
      {
        method: "GET",
        auth: false,
        revalidate: 300,
        tags: [SHARED_SECTION_TAG, `${SHARED_SECTION_TAG}-${key}`],
      },
    );
    // `null` is the public API's authoritative representation of an inactive
    // or missing managed section. Do not turn it back on via static fallback.
    if (response.data === null || response.data === undefined) return null;
    const normalized = normalizeSharedSection(response.data);
    if (normalized?.is_active === false) return null;
    return normalized as Extract<ApiSharedSection, { key: Key }> | null;
  } catch {
    return cloneSharedSection(SHARED_SECTION_FALLBACKS[key]) as Extract<
      ApiSharedSection,
      { key: Key }
    >;
  }
}

export async function getPublicSharedSections<Keys extends SharedSectionKey[]>(
  keys: readonly [...Keys],
): Promise<{
  [Index in keyof Keys]: Extract<ApiSharedSection, { key: Keys[Index] }> | null;
}> {
  return Promise.all(
    keys.map((key) => getPublicSharedSection(key)),
  ) as Promise<{
    [Index in keyof Keys]: Extract<
      ApiSharedSection,
      { key: Keys[Index] }
    > | null;
  }>;
}

export async function getAdminSharedSections(): Promise<ApiSharedSection[]> {
  const response = await apiFetch<unknown>("/api/shared-sections");
  if (!Array.isArray(response.data)) {
    throw new ApiError(
      502,
      "Shared section list returned malformed data",
      null,
    );
  }
  return response.data.map((item) => {
    const normalized = normalizeSharedSection(item);
    if (!normalized)
      throw new ApiError(502, "A saved shared section is malformed", null);
    return normalized;
  });
}

export async function getAdminSharedSection<Key extends SharedSectionKey>(
  key: Key,
): Promise<Extract<ApiSharedSection, { key: Key }> | null> {
  try {
    const response = await apiFetch<unknown>(`/api/shared-sections/${key}`);
    if (response.data === null || response.data === undefined) return null;
    const normalized = normalizeSharedSection(response.data);
    if (!normalized)
      throw new ApiError(502, "Saved shared section is malformed", null);
    return normalized as Extract<ApiSharedSection, { key: Key }>;
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
