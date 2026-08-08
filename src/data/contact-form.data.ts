/**
 * Inquiry form defaults.
 *
 * These are the labels, placeholders and dropdown entries the form used to
 * hardcode. They stay here as the fallback so the page renders identically if
 * the API is unreachable or the contact setting was never seeded.
 */

export const CONTACT_FIELD_KEYS = [
  "name",
  "email",
  "phone",
  "company",
  "website",
  "industry",
  "lookingFor",
  "notWorking",
  "timeline",
  "budget",
] as const;

export type TContactFieldKey = (typeof CONTACT_FIELD_KEYS)[number];

/** Never hideable or optional — ContactMessage cannot be saved without them. */
export const LOCKED_CONTACT_FIELD_KEYS: TContactFieldKey[] = ["name", "email"];

export type TContactField = {
  key: TContactFieldKey;
  label: string;
  placeholder: string;
  is_visible: boolean;
  is_required: boolean;
};

export type TContactOption = {
  label: string;
  value: string;
  is_active?: boolean;
};

export type TContactFormContent = {
  submit_label: string;
  submitting_label: string;
  industry_placeholder: string;
  industry_other_label: string;
  timeline_placeholder: string;
  budget_placeholder: string;
};

export type TContactFormData = {
  content: TContactFormContent;
  fields: TContactField[];
  timeline_options: TContactOption[];
  budget_options: TContactOption[];
};

export const CONTACT_FORM_DATA: TContactFormData = {
  content: {
    submit_label: "Submit Inquiry",
    submitting_label: "Submitting Inquiry...",
    industry_placeholder: "Select Industry",
    industry_other_label: "Other",
    timeline_placeholder: "Select Timeline",
    budget_placeholder: "Select Range",
  },
  fields: [
    {
      key: "name",
      label: "Full Name",
      placeholder: "John Doe",
      is_visible: true,
      is_required: true,
    },
    {
      key: "email",
      label: "Email Address",
      placeholder: "john@example.com",
      is_visible: true,
      is_required: true,
    },
    {
      key: "phone",
      label: "Phone Number",
      placeholder: "+1 (234) 567-890",
      is_visible: true,
      is_required: false,
    },
    {
      key: "company",
      label: "Company Name",
      placeholder: "SparkLabs Inc",
      is_visible: true,
      is_required: false,
    },
    {
      key: "website",
      label: "Website / Instagram",
      placeholder: "example.com",
      is_visible: true,
      is_required: false,
    },
    {
      key: "industry",
      label: "Industry Category",
      placeholder: "",
      is_visible: true,
      is_required: false,
    },
    {
      key: "lookingFor",
      label: "What are you looking for help with?",
      placeholder:
        "e.g. Creative Production, SaaS Video Editing, CRM Integrations...",
      is_visible: true,
      is_required: false,
    },
    {
      key: "notWorking",
      label: "What is currently not working?",
      placeholder: "Describe your current bottleneck problems in detail...",
      is_visible: true,
      is_required: false,
    },
    {
      key: "timeline",
      label: "Timeline",
      placeholder: "",
      is_visible: true,
      is_required: false,
    },
    {
      key: "budget",
      label: "Monthly Budget Range",
      placeholder: "",
      is_visible: true,
      is_required: false,
    },
  ],
  timeline_options: [
    { label: "ASAP", value: "asap", is_active: true },
    { label: "1-3 Months", value: "1-3-months", is_active: true },
    { label: "3-6 Months", value: "3-6-months", is_active: true },
    { label: "Flexible", value: "flexible", is_active: true },
  ],
  budget_options: [
    { label: "$2,000 - $5,000", value: "2k-5k", is_active: true },
    { label: "$5,000 - $10,000", value: "5k-10k", is_active: true },
    { label: "$10,000+", value: "10k-plus", is_active: true },
  ],
};

/** Convenience lookup so components can read one field without scanning. */
export function findContactField(
  fields: TContactField[],
  key: TContactFieldKey,
): TContactField {
  return (
    fields.find((f) => f.key === key) ??
    CONTACT_FORM_DATA.fields.find((f) => f.key === key)!
  );
}
