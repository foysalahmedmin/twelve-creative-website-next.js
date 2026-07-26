import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoPlayer } from "@/components/common/video-player";
import { adaptWorkToLegacy, getPublicWorkBySlug } from "@/lib/api/works";
import type { IWorkItem } from "@/data/works.data";
import { getPublicSiteSetting } from "@/lib/api/site-setting";

interface WorksDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function loadWork(slug: string): Promise<IWorkItem | undefined> {
  const live = await getPublicWorkBySlug(slug);
  return live ? adaptWorkToLegacy(live) : undefined;
}

export async function generateMetadata({
  params,
}: WorksDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const workData = await loadWork(id);

  if (!workData) return { title: "Not Found" };

  return {
    title: `${workData.title} | Twelve Creative`,
    description: workData.description,
    openGraph: {
      title: workData.title,
      description: workData.description,
      images: [{ url: workData.image_url }],
    },
  };
}

export default async function WorksDetailsPage({
  params,
}: WorksDetailsPageProps) {
  const { id } = await params;
  const [workData, settings] = await Promise.all([
    loadWork(id),
    getPublicSiteSetting(),
  ]);

  if (!workData) return notFound();

  const metricsList = workData.metrics || [];
  const bookingHref =
    workData.calendly_url || settings.calendly_url || "/contact";
  const isExternalBookingHref = /^https?:\/\//i.test(bookingHref);
  const clientDetails = workData.client
    ? [
        workData.client.industry,
        workData.client.domain,
        workData.client.employees
          ? `${workData.client.employees} employees`
          : undefined,
      ].filter((value): value is string => Boolean(value))
    : [];

  return (
    <main className="bg-background min-h-screen">
      {/* HERO SECTION */}
      <header className="bg-primary/5 dark:bg-primary/10 relative overflow-hidden px-4 pt-48 pb-8 sm:px-6 lg:pt-60 lg:pb-16">
        <div className="bg-primary pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full opacity-[0.03] dark:opacity-[0.05]" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
            <h1 className="font-heading text-foreground mb-6 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {workData.title}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-2xl text-lg leading-relaxed sm:text-xl">
              {workData.description}
            </p>

            {workData.tag_slugs?.length > 0 && (
              <div className="mb-10 flex flex-wrap justify-center gap-2">
                {workData.tag_slugs.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-primary/10 border-primary/20 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#ea692d] uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="relative mt-2 w-full pb-8 lg:mt-8">
            {/* Image */}
            <div className="border-primary/10 bg-muted/30 relative aspect-video w-full overflow-hidden rounded-[32px] border">
              <Image
                src={workData.image_url}
                alt={workData.image_alt}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>

            {/* Stat Card 1 - Bottom Left */}
            {workData.hero_stats?.[0] && (
              <div className="bg-card/95 border-primary/15 absolute -bottom-5 -left-5 hidden min-w-[200px] items-center gap-3 rounded-2xl border p-4 shadow-sm backdrop-blur-md lg:flex">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 12h-4l-3 9L9 3l-3 9H2"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="text-primary truncate text-xl font-bold">
                    {workData.hero_stats[0].value}
                  </span>
                  <span className="text-muted-foreground truncate text-xs font-semibold tracking-widest uppercase">
                    {workData.hero_stats[0].label}
                  </span>
                </div>
              </div>
            )}

            {/* Stat Card 2 - Top Right */}
            {workData.hero_stats?.[1] && (
              <div className="bg-card/95 border-primary/15 absolute -top-5 -right-5 hidden min-w-[200px] items-center gap-3 rounded-2xl border p-4 shadow-sm backdrop-blur-md lg:flex">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="9"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="text-primary truncate text-xl font-bold">
                    {workData.hero_stats[1].value}
                  </span>
                  <span className="text-muted-foreground truncate text-xs font-semibold tracking-widest uppercase">
                    {workData.hero_stats[1].label}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* METRICS STRIP */}
      {metricsList.length > 0 && (
        <section className="bg-card border-primary/5 border-y px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {metricsList.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-primary/5 dark:bg-primary/10 border-primary/10 hover:bg-primary/10 rounded-2xl border p-6 transition-colors"
                >
                  <div className="font-heading text-primary mb-1 text-3xl font-semibold sm:text-4xl">
                    {metric.value}
                  </div>
                  <div className="text-foreground mb-1.5 text-sm font-semibold tracking-wider uppercase">
                    {metric.label}
                  </div>
                  {metric.sub && (
                    <div className="text-muted-foreground text-xs font-medium">
                      {metric.sub}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-20">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_320px] lg:gap-20">
          <article className="min-w-0 space-y-16">
            {/* About the Client */}
            {workData.client && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-6 w-1.5 rounded-full" />
                  <h2 className="font-heading text-foreground text-2xl font-semibold">
                    About the Client
                  </h2>
                </div>

                <div className="bg-card border-primary/10 flex flex-col gap-5 rounded-2xl border p-6 sm:flex-row sm:items-start">
                  {workData.client.logo ? (
                    <div className="border-primary/20 relative h-16 w-16 shrink-0 overflow-hidden rounded-[14px] border">
                      <Image
                        src={workData.client.logo}
                        alt={workData.client.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="border-primary/20 bg-primary/5 h-16 w-16 shrink-0 rounded-[14px] border" />
                  )}
                  <div className="space-y-2">
                    <h3 className="text-foreground text-xl font-semibold">
                      {workData.client.name}
                    </h3>
                    {clientDetails.length > 0 && (
                      <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm font-medium">
                        {clientDetails.map((detail, index) => (
                          <span
                            key={detail}
                            className="inline-flex items-center gap-2"
                          >
                            {index > 0 && (
                              <span
                                aria-hidden
                                className="bg-primary/40 h-1 w-1 rounded-full"
                              />
                            )}
                            {detail}
                          </span>
                        ))}
                      </div>
                    )}
                    {workData.client.tags?.length ? (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {workData.client.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-primary/5 text-primary border-primary/10 rounded-md border px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                {workData.client.desc && (
                  <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
                    {workData.client.desc}
                  </p>
                )}
                <div className="bg-primary/10 mt-10 h-px w-full" />
              </div>
            )}

            {/* The Situation */}
            {workData.situation_intro && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-6 w-1.5 rounded-full" />
                  <h2 className="font-heading text-foreground text-2xl font-semibold">
                    The Situation
                  </h2>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
                  {workData.situation_intro}
                </p>
              </div>
            )}

            {/* The Challenge */}
            {(workData.challenge_intro ||
              (workData.challenge_items?.length ?? 0) > 0) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-6 w-1.5 rounded-full" />
                  <h2 className="font-heading text-foreground text-2xl font-semibold">
                    The Challenge
                  </h2>
                </div>

                {workData.challenge_intro && (
                  <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
                    {workData.challenge_intro}
                  </p>
                )}

                {(workData.challenge_items?.length ?? 0) > 0 && (
                  <div className="space-y-4 pt-2">
                    {workData.challenge_items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="border-l-primary border-primary/5 bg-primary/[0.02] flex gap-4 rounded-2xl border-t border-r border-b border-l-4 p-5"
                      >
                        <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-sm font-bold text-white">
                          {idx + 1}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-foreground font-semibold">
                            {item.title}
                          </h4>
                          <p className="text-muted-foreground text-sm sm:text-base">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Our Solution */}
            {(workData.solution_intro ||
              (workData.solution_phases?.length ?? 0) > 0) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-6 w-1.5 rounded-full" />
                  <h2 className="font-heading text-foreground text-2xl font-semibold">
                    Our Solution
                  </h2>
                </div>

                {workData.solution_intro && (
                  <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
                    {workData.solution_intro}
                  </p>
                )}

                {/* Timeline */}
                {(workData.solution_phases?.length ?? 0) > 0 && (
                  <div className="relative pt-4 pl-4 sm:pl-8">
                    <div className="bg-primary/20 absolute top-8 bottom-4 left-6 w-px sm:left-10" />
                    <div className="space-y-10">
                      {workData.solution_phases?.map((item, idx) => (
                        <div key={idx} className="relative pl-10 sm:pl-12">
                          <div className="bg-primary ring-background absolute top-1.5 left-[3px] h-3.5 w-3.5 rounded-full ring-4" />
                          <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                            <h4 className="text-foreground text-lg font-semibold">
                              {item.phase}
                            </h4>
                            {item.time && (
                              <span className="text-primary/70 bg-primary/10 rounded px-2 py-0.5 text-xs font-semibold tracking-widest uppercase">
                                {item.time}
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* The Outcome */}
            {(workData.outcome_desc || workData.outcome_video) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-6 w-1.5 rounded-full" />
                  <h2 className="font-heading text-foreground text-2xl font-semibold">
                    The Outcome
                  </h2>
                </div>

                {workData.outcome_desc && (
                  <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
                    {workData.outcome_desc}
                  </p>
                )}

                {workData.outcome_video && (
                  <div className="pt-4">
                    <VideoPlayer
                      link={workData.outcome_video}
                      thumbnail={
                        workData.outcome_video_thumbnail || workData.image_url
                      }
                    />
                  </div>
                )}
              </div>
            )}

            <div className="bg-primary/10 h-px w-full" />

            {/* Testimonial */}
            {workData.testimonial && (
              <div className="bg-primary/[0.03] border-primary/10 relative overflow-hidden rounded-[32px] border p-6 sm:p-10">
                <div className="text-primary/10 pointer-events-none absolute -top-4 -left-2 font-serif text-[120px] leading-none select-none">
                  &quot;
                </div>
                <p className="font-heading text-foreground relative z-10 mb-8 pt-4 text-lg leading-relaxed font-medium sm:text-xl md:text-2xl">
                  {workData.testimonial.quote}
                </p>
                <div className="relative z-10 flex flex-wrap items-center gap-4">
                  {workData.testimonial.avatar_url ? (
                    <div className="border-primary/20 relative h-14 w-14 shrink-0 overflow-hidden rounded-full border">
                      <Image
                        src={workData.testimonial.avatar_url}
                        alt={workData.testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-primary/10 h-14 w-14 shrink-0 rounded-full" />
                  )}
                  <div>
                    <div className="text-foreground font-semibold">
                      {workData.testimonial.name}
                    </div>
                    <div className="text-muted-foreground text-sm font-medium">
                      {workData.testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Sticky Sidebar CTA */}
          <aside className="sticky top-24 hidden lg:block">
            <div className="bg-primary relative overflow-hidden rounded-[24px] p-8 text-white shadow-xl">
              <div className="pointer-events-none absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-white opacity-10" />
              <h3 className="font-heading relative z-10 mb-2 text-2xl font-bold">
                Want similar results?
              </h3>
              <p className="relative z-10 mb-8 font-medium text-white/80">
                Let's talk about your growth challenges.
              </p>
              <Link
                href={bookingHref}
                target={isExternalBookingHref ? "_blank" : undefined}
                rel={isExternalBookingHref ? "noopener noreferrer" : undefined}
                className="text-primary relative z-10 flex w-full items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold tracking-wider uppercase transition-colors hover:bg-white/90"
              >
                Book A Call
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
