export const LEGAL_PAGE_SLUGS = [
  "privacy-policy",
  "terms-and-conditions",
] as const;

export type LegalPageSlug = (typeof LEGAL_PAGE_SLUGS)[number];

export const LEGAL_PAGE_LABELS: Record<LegalPageSlug, string> = {
  "privacy-policy": "Privacy Policy",
  "terms-and-conditions": "Terms and Conditions",
};

export interface LegalPageSeo {
  title: string;
  description: string;
}

export interface PublicLegalPage {
  slug: LegalPageSlug;
  title: string;
  markdown: string;
  effective_date: string | null;
  seo: LegalPageSeo;
}

export interface AdminLegalPage extends PublicLegalPage {
  _id?: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export function isLegalPageSlug(value: string): value is LegalPageSlug {
  return (LEGAL_PAGE_SLUGS as readonly string[]).includes(value);
}

export function isSafeLegalMarkdown(value: string): boolean {
  const withoutWhitespaceControls = value.replace(/[\n\r\t]/g, "");
  if (/[\u0000-\u001F\u007F]/.test(withoutWhitespaceControls)) return false;
  if (/<\/?[A-Za-z][^>]*>/.test(value)) return false;
  return !/(?:javascript|vbscript|data)\s*:/i.test(value);
}
