import { StatusBadge } from "@/components/admin/status-badge";
import type { LeadSource } from "@/lib/api/bookings";

type Tone = "neutral" | "positive" | "warning" | "danger" | "info";

const LEAD_SOURCE_LABEL: Record<LeadSource, string> = {
  organic: "Organic",
  meta_ad: "Meta Ad",
  google_ad: "Google Ad",
  referral: "Referral",
  direct: "Direct",
  email: "Email",
  other: "Other",
};

const LEAD_SOURCE_TONE: Record<LeadSource, Tone> = {
  organic: "positive",
  meta_ad: "info",
  google_ad: "info",
  referral: "warning",
  direct: "neutral",
  email: "neutral",
  other: "neutral",
};

export function LeadSourceBadge({ source }: { source?: LeadSource }) {
  if (!source) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <StatusBadge
      label={LEAD_SOURCE_LABEL[source]}
      tone={LEAD_SOURCE_TONE[source]}
    />
  );
}
