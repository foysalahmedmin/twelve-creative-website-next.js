import { ComingSoon } from "@/components/common/coming-soon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Blogs | Twelve Creative",
  description: "Read our latest health articles and medical insights.",
};

export default function BlogsPage() {
  return <ComingSoon title="Health Blogs" />;
}
