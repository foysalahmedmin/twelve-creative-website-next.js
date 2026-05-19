import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { ComingSoon } from "@/components/common/coming-soon";
import { PageHeader } from "@/components/sections/page-header-section";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { getPublicInsights } from "@/lib/api/insights";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights | Twelve Creative",
  description:
    "Notes on positioning, creative, distribution, and the systems behind real business growth.",
};

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const insights = await getPublicInsights();

  // If nothing is published yet, keep the "Coming Soon" experience —
  // the page goes live the moment the first article is published.
  if (!insights.length) return <ComingSoon title="Insights" />;

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label="Insights"
        title="Notes on positioning, creative, and growth systems."
        description="Field-tested thinking from the work we do for hospitality, real estate, aviation, and professional service operators."
      />

      <section className="container py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((article, idx) => (
            <ScrollReveal
              key={article._id}
              animation="fade-in-up"
              delayMs={idx * 100}
            >
              <Link
                href={`/blogs/${article.slug}`}
                className="group bg-card border-primary/10 hover:border-primary/30 flex h-full flex-col overflow-hidden rounded-2xl border transition-colors"
              >
                <div className="bg-muted relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={article.cover}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                    {article.category && (
                      <>
                        <span className="text-primary tracking-wider uppercase">
                          {article.category}
                        </span>
                        <span className="text-muted-foreground/40">·</span>
                      </>
                    )}
                    {article.published_at && (
                      <span>
                        {format(new Date(article.published_at), "d MMM yyyy")}
                      </span>
                    )}
                    {article.read_minutes ? (
                      <>
                        <span className="text-muted-foreground/40">·</span>
                        <span>{article.read_minutes} min read</span>
                      </>
                    ) : null}
                  </div>
                  <h2 className="font-heading text-foreground text-lg font-semibold tracking-tight">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-3 text-sm">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
