"use client";

import { ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { updateLegalPageAction } from "@/lib/api/legal-page-actions";
import {
  isSafeLegalMarkdown,
  LEGAL_PAGE_LABELS,
  type AdminLegalPage,
} from "@/lib/api/legal-page-shared";
import { cn } from "@/lib/utils";

interface LegalPageFormProps {
  initial: AdminLegalPage;
}

function inputDate(value: string | null): string {
  return value ? value.slice(0, 10) : "";
}

export function LegalPageForm({ initial }: LegalPageFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [contentTab, setContentTab] = useState<"write" | "preview">("write");
  const [title, setTitle] = useState(initial.title);
  const [markdown, setMarkdown] = useState(initial.markdown);
  const [effectiveDate, setEffectiveDate] = useState(
    inputDate(initial.effective_date),
  );
  const [seoTitle, setSeoTitle] = useState(initial.seo.title);
  const [seoDescription, setSeoDescription] = useState(initial.seo.description);
  const [published, setPublished] = useState(initial.is_published);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanMarkdown = markdown.replace(/\r\n?/g, "\n").trim();
    const cleanSeoTitle = seoTitle.trim();
    const cleanSeoDescription = seoDescription.trim();
    if (
      !cleanTitle ||
      !cleanMarkdown ||
      !cleanSeoTitle ||
      !cleanSeoDescription
    ) {
      toast.error(
        "Title, approved Markdown, SEO title, and SEO description are required",
      );
      return;
    }
    if (!isSafeLegalMarkdown(cleanMarkdown)) {
      toast.error("Markdown cannot contain raw HTML or unsafe protocols");
      return;
    }
    if (published && !effectiveDate) {
      toast.error("Choose an effective date before publishing");
      return;
    }

    setSaving(true);
    const result = await updateLegalPageAction(initial.slug, {
      slug: initial.slug,
      title: cleanTitle,
      markdown: cleanMarkdown,
      effective_date: effectiveDate
        ? new Date(`${effectiveDate}T00:00:00.000Z`).toISOString()
        : null,
      seo: {
        title: cleanSeoTitle,
        description: cleanSeoDescription,
      },
      is_published: published,
    });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? "Save failed");
      return;
    }
    toast.success(
      published ? "Legal page published" : "Legal page draft saved",
    );
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AdminPageHeader
        title={`Edit ${LEGAL_PAGE_LABELS[initial.slug]}`}
        description="Only publish final language approved by the client and their legal counsel. Markdown is rendered without raw HTML."
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Legal Pages", href: "/admin/legal-pages" },
          { label: LEGAL_PAGE_LABELS[initial.slug] },
        ]}
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={`/${initial.slug}`} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              Preview
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Page content</CardTitle>
          <CardDescription>
            Paste approved legal language in Markdown. Raw HTML and executable
            protocols are rejected by both the form and API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="legal-title">
              Public title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="legal-title"
              required
              maxLength={200}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="legal-markdown">
                Approved Markdown <span className="text-destructive">*</span>
              </Label>
              <div className="flex overflow-hidden rounded-md border text-xs">
                {(["write", "preview"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setContentTab(tab)}
                    className={cn(
                      "px-3 py-1.5 capitalize transition-colors",
                      contentTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {contentTab === "write" ? (
              <Textarea
                id="legal-markdown"
                required
                rows={24}
                maxLength={50000}
                value={markdown}
                onChange={(event) => setMarkdown(event.target.value)}
                className="min-h-112 font-mono text-sm"
                placeholder="Paste counsel-approved Markdown here…"
              />
            ) : (
              <div className="prose prose-sm dark:prose-invert min-h-112 max-w-none rounded-md border p-5">
                {markdown.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdown}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground text-sm italic">
                    Nothing to preview yet.
                  </p>
                )}
              </div>
            )}
            <div className="text-muted-foreground flex justify-between gap-3 text-xs">
              <span>
                {markdown.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <span>
                {markdown.length.toLocaleString()} / 50,000 characters
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Search metadata</CardTitle>
          <CardDescription>
            Used by search engines only after this page is published.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="legal-seo-title">
              SEO title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="legal-seo-title"
              required
              maxLength={200}
              value={seoTitle}
              onChange={(event) => setSeoTitle(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legal-seo-description">
              SEO description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="legal-seo-description"
              required
              rows={3}
              maxLength={500}
              value={seoDescription}
              onChange={(event) => setSeoDescription(event.target.value)}
            />
            <p className="text-muted-foreground text-right text-xs">
              {seoDescription.length} / 500
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Publication</CardTitle>
          <CardDescription>
            Draft pages never expose their Markdown on the public endpoint.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="legal-effective-date">
              Effective date{" "}
              {published && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id="legal-effective-date"
              type="date"
              required={published}
              value={effectiveDate}
              onChange={(event) => setEffectiveDate(event.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
            <div>
              <Label htmlFor="legal-published">Publish this page</Label>
              <p className="text-muted-foreground mt-1 text-xs">
                Visitors can read the content immediately after saving.
              </p>
            </div>
            <Switch
              id="legal-published"
              checked={published}
              onCheckedChange={setPublished}
            />
          </div>
        </CardContent>
      </Card>

      <div className="border-border bg-background/95 sticky bottom-0 z-20 flex items-center justify-between gap-4 border-t py-4 backdrop-blur">
        <p className="text-muted-foreground hidden text-xs sm:block">
          {published
            ? "Saving publishes this approved page."
            : "Saving keeps this page private as a draft."}
        </p>
        <Button type="submit" disabled={saving} className="ml-auto min-w-40">
          {saving && <Loader2 className="size-4 animate-spin" />}
          {saving ? "Saving…" : published ? "Save and publish" : "Save draft"}
        </Button>
      </div>
    </form>
  );
}
