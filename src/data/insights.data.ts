/**
 * Insight (blog) demo content.
 *
 * `TInsightCardItem` is the minimum an insight card needs to render. The live
 * `Insight` type from lib/api/insights.ts is a superset of it, so API records
 * can be passed straight to the card without adapting.
 */

export type TInsightCardItem = {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category?: string;
  read_minutes?: number;
  published_at?: string;
};

export type TInsightsData = {
  label: string;
  title: string;
  description: string;
  insights: TInsightCardItem[];
};

/**
 * Mirrors the backend seed (twelve-creative-server/src/scripts/seeds/
 * insight.seed.ts) so a local run without an API still shows the section as
 * it appears in production.
 */
export const INSIGHTS: TInsightCardItem[] = [
  {
    slug: "why-most-marketing-fails-structure",
    title:
      "Why most marketing fails: a structure problem, not a content problem",
    excerpt:
      "The businesses we work with rarely have a content problem. They have a structure problem. Here's how to tell the difference — and what to do about it.",
    cover:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1280&h=720&fit=crop&auto=format",
    category: "Positioning",
    read_minutes: 4,
  },
  {
    slug: "positioning-before-production",
    title: "Positioning comes first. Production is the easy part.",
    excerpt:
      "Great footage cannot rescue an unclear offer. Decide what the business stands for before booking the shoot.",
    cover:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1280&h=720&fit=crop&auto=format",
    category: "Strategy",
    read_minutes: 4,
  },
  {
    slug: "creative-without-systems",
    title: "Creative without systems: why great content still doesn't convert",
    excerpt:
      "Attention that has nowhere to go is wasted spend. The system behind the creative is what turns interest into revenue.",
    cover:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1280&h=720&fit=crop&auto=format",
    category: "Systems",
    read_minutes: 5,
  },
  {
    slug: "distribution-is-half-the-work",
    title: "Distribution is half the work — and almost always under-invested",
    excerpt:
      "Most teams spend everything on making the asset and nothing on getting it in front of the right people.",
    cover:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop&auto=format",
    category: "Distribution",
    read_minutes: 4,
  },
  {
    slug: "crm-is-marketing",
    title: "CRM is a marketing function — most businesses don't treat it that way",
    excerpt:
      "The handoff between marketing and sales is where most leads die. The fix is treating CRM as marketing infrastructure, not a sales tool.",
    cover:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1280&h=720&fit=crop&auto=format",
    category: "Systems",
    read_minutes: 5,
  },
  {
    slug: "measuring-what-actually-matters",
    title: "Measuring what actually matters, not what is easy to count",
    excerpt:
      "Impressions and follower counts are easy to report and rarely tell you anything. Here is the shorter list of numbers that reflect whether the business is actually growing.",
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop&auto=format",
    category: "Systems",
    read_minutes: 4,
  },
];

export const INSIGHTS_DATA: TInsightsData = {
  label: "Insights",
  title: "Notes from the work",
  description:
    "Field-tested thinking on positioning, creative, distribution, and the systems that turn attention into revenue.",
  insights: INSIGHTS,
};

/** Cards shown by InsightsSection before it starts scrolling. */
export const INSIGHTS_SECTION_LIMIT = 6;
