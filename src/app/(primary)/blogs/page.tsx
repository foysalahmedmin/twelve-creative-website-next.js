import { ComingSoon } from "@/components/common/coming-soon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights | Twelve Creative",
  description:
    "Notes on positioning, creative, distribution, and the systems behind real business growth — coming soon.",
};

export default function BlogsPage() {
  return <ComingSoon title="Insights" />;
}
