import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPublicInsightBySlug } from "@/lib/api/insights";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublicInsightBySlug(slug);
  if (!article) return { title: "Not Found" };
  return {
    title: `${article.title} | Twelve Creative`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.cover }],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublicInsightBySlug(slug);
  if (!article) notFound();

  return (
    <main className="bg-background min-h-screen">
      <article className="container max-w-3xl py-16 sm:py-20 lg:py-24">
        <header className="mb-10 space-y-5">
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs font-medium">
            <Link
              href="/blogs"
              className="hover:text-foreground transition-colors"
            >
              ← All insights
            </Link>
            <span className="text-muted-foreground/40">·</span>
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
          <h1 className="font-heading text-foreground text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {article.excerpt}
          </p>
        </header>

        <div className="border-border/60 bg-muted/30 relative mb-10 aspect-video w-full overflow-hidden rounded-2xl border">
          <Image
            src={article.cover}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 prose-headings:font-heading prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl prose-p:leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
