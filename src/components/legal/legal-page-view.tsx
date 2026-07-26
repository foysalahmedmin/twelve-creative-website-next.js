import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import type { PublicLegalPage } from "@/lib/api/legal-pages";

interface LegalPageViewProps {
  page: PublicLegalPage | null;
}

function isExternalLink(href: string | undefined): boolean {
  if (!href) return false;
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function formatEffectiveDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function LegalPageView({ page }: LegalPageViewProps) {
  if (!page) {
    return (
      <section className="container py-16 sm:py-20 lg:py-24">
        <div className="border-border bg-card mx-auto max-w-3xl rounded-2xl border p-8 text-center shadow-sm sm:p-12">
          <h2 className="font-heading text-foreground text-2xl font-bold tracking-tight">
            This page is not currently published.
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl leading-relaxed">
            Please contact Twelve Creative if you need information related to
            this page.
          </p>
          <Button asChild className="mt-7">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-16 sm:py-20 lg:py-24">
      <article className="border-border bg-card mx-auto max-w-4xl rounded-2xl border p-6 shadow-sm sm:p-10 lg:p-14">
        {page.effective_date && (
          <p className="text-muted-foreground mb-8 text-sm">
            Effective date: {formatEffectiveDate(page.effective_date)}
          </p>
        )}
        <div className="prose prose-neutral dark:prose-invert prose-headings:font-heading prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl text-foreground/90 prose-p:leading-relaxed max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...props }) => (
                <a
                  {...props}
                  href={href}
                  {...(isExternalLink(href)
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {children}
                </a>
              ),
            }}
          >
            {page.markdown}
          </ReactMarkdown>
        </div>
      </article>
    </section>
  );
}
