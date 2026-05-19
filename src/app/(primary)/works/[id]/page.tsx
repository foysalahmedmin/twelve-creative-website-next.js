import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { WORKS_PAGE_MOCK_DATA } from "@/data/works.data";
import { VideoPlayer } from "@/components/common/video-player";
import { adaptWorkToLegacy, getPublicWorkBySlug } from "@/lib/api/works";
import type { IWorkItem } from "@/data/works.data";

interface WorksDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function loadWork(slug: string): Promise<IWorkItem | undefined> {
  const live = await getPublicWorkBySlug(slug);
  if (live) return adaptWorkToLegacy(live);
  return WORKS_PAGE_MOCK_DATA.find((item) => item.id === slug);
}

export async function generateMetadata({ params }: WorksDetailsPageProps): Promise<Metadata> {
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

export default async function WorksDetailsPage({ params }: WorksDetailsPageProps) {
  const { id } = await params;
  const workData = await loadWork(id);

  if (!workData) return notFound();

  const metricsList = workData.metrics || [];

  return (
    <main className="bg-background min-h-screen">
      
      {/* HERO SECTION */}
      <header className="relative pt-32 lg:pt-40 pb-8 lg:pb-16 px-4 sm:px-6 overflow-hidden bg-primary/5 dark:bg-primary/10">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full opacity-[0.03] dark:opacity-[0.05] bg-primary pointer-events-none" />
        
        <div className="flex flex-col justify-center items-center relative z-10 max-w-7xl mx-auto">
          
          <div className="max-w-4xl mx-auto flex flex-col justify-center items-center text-center">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground font-semibold tracking-tight leading-[1.1] mb-6">
              {workData.title}
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl">
              {workData.description}
            </p>
            
            {workData.tag_slugs?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10 justify-center">
                {workData.tag_slugs.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-primary/10 text-[#ea692d] border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full lg:mt-8 mt-2 pb-8">
            {/* Image */}
            <div className="relative aspect-video w-full rounded-[32px] overflow-hidden border border-primary/10 bg-muted/30">
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
              <div className="absolute hidden lg:flex items-center gap-3 -bottom-5 -left-5 bg-card/95 backdrop-blur-md rounded-2xl p-4 border border-primary/15 shadow-sm min-w-[200px]">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-xl font-bold text-primary truncate">{workData.hero_stats[0].value}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold truncate">{workData.hero_stats[0].label}</span>
                </div>
              </div>
            )}

            {/* Stat Card 2 - Top Right */}
            {workData.hero_stats?.[1] && (
              <div className="absolute hidden lg:flex items-center gap-3 -top-5 -right-5 bg-card/95 backdrop-blur-md rounded-2xl p-4 border border-primary/15 shadow-sm min-w-[200px]">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-xl font-bold text-primary truncate">{workData.hero_stats[1].value}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold truncate">{workData.hero_stats[1].label}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* METRICS STRIP */}
      {metricsList.length > 0 && (
        <section className="py-8 sm:py-12 px-4 sm:px-6 bg-card border-y border-primary/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {metricsList.map((metric, idx) => (
                <div key={idx} className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/10 transition-colors hover:bg-primary/10">
                  <div className="text-3xl sm:text-4xl font-heading font-semibold text-primary mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1.5">
                    {metric.label}
                  </div>
                  {metric.sub && (
                    <div className="text-xs text-muted-foreground font-medium">{metric.sub}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-20 items-start">
          
          <article className="min-w-0 space-y-16">
            
            {/* About the Client */}
            {workData.client && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 rounded-full bg-primary" />
                  <h2 className="text-2xl font-heading font-semibold text-foreground">About the Client</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-start gap-5 p-6 bg-card border border-primary/10 rounded-2xl">
                  {workData.client.logo ? (
                    <div className="relative w-16 h-16 rounded-[14px] overflow-hidden border border-primary/20 shrink-0">
                      <Image src={workData.client.logo} alt={workData.client.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-[14px] border border-primary/20 shrink-0 bg-primary/5" />
                  )}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">{workData.client.name}</h3>
                    <div className="text-sm font-medium text-muted-foreground flex flex-wrap items-center gap-2">
                      <span>{workData.client.industry}</span>
                      <span className="w-1 h-1 rounded-full bg-primary/40" />
                      <span>{workData.client.domain}</span>
                      <span className="w-1 h-1 rounded-full bg-primary/40" />
                      <span>{workData.client.employees} employees</span>
                    </div>
                    {workData.client.tags && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {workData.client.tags.map((tag, idx) => (
                          <span key={idx} className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md bg-primary/5 text-primary border border-primary/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {workData.client.desc}
                </p>
                <div className="h-px bg-primary/10 w-full mt-10" />
              </div>
            )}

            {/* The Situation */}
            {workData.situation_intro && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 rounded-full bg-primary" />
                  <h2 className="text-2xl font-heading font-semibold text-foreground">The Situation</h2>
                </div>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {workData.situation_intro}
                </p>
              </div>
            )}

            {/* The Challenge */}
            {(workData.challenge_intro || workData.challenge_items) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 rounded-full bg-primary" />
                  <h2 className="text-2xl font-heading font-semibold text-foreground">The Challenge</h2>
                </div>
                
                {workData.challenge_intro && (
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {workData.challenge_intro}
                  </p>
                )}

                {workData.challenge_items && (
                  <div className="space-y-4 pt-2">
                    {workData.challenge_items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-5 rounded-2xl border-l-4 border-l-primary border-t border-r border-b border-primary/5 bg-primary/[0.02]">
                        <div className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 text-white text-sm font-bold bg-primary">
                          {idx + 1}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-foreground">{item.title}</h4>
                          <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Our Solution */}
            {(workData.solution_intro || workData.solution_phases) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 rounded-full bg-primary" />
                  <h2 className="text-2xl font-heading font-semibold text-foreground">Our Solution</h2>
                </div>
                
                {workData.solution_intro && (
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {workData.solution_intro}
                  </p>
                )}

                {/* Timeline */}
                {workData.solution_phases && (
                  <div className="relative pt-4 pl-4 sm:pl-8">
                    <div className="absolute left-6 sm:left-10 top-8 bottom-4 w-px bg-primary/20" />
                    <div className="space-y-10">
                      {workData.solution_phases.map((item, idx) => (
                        <div key={idx} className="relative pl-10 sm:pl-12">
                          <div className="absolute left-[3px] top-1.5 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-background" />
                          <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <h4 className="font-semibold text-lg text-foreground">{item.phase}</h4>
                            {item.time && (
                              <span className="text-xs font-semibold uppercase tracking-widest text-primary/70 bg-primary/10 px-2 py-0.5 rounded">
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
                  <div className="w-1.5 h-6 rounded-full bg-primary" />
                  <h2 className="text-2xl font-heading font-semibold text-foreground">The Outcome</h2>
                </div>
                
                {workData.outcome_desc && (
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {workData.outcome_desc}
                  </p>
                )}

                {workData.outcome_video && (
                  <div className="pt-4">
                    <VideoPlayer link={workData.outcome_video} thumbnail={workData.image_url} />
                  </div>
                )}
              </div>
            )}
            
            <div className="h-px bg-primary/10 w-full" />

            {/* Testimonial */}
            {workData.testimonial && (
              <div className="relative p-6 sm:p-10 rounded-[32px] bg-primary/[0.03] border border-primary/10 overflow-hidden">
                <div className="absolute -top-4 -left-2 text-[120px] font-serif text-primary/10 select-none pointer-events-none leading-none">
                  &quot;
                </div>
                <p className="relative z-10 text-lg sm:text-xl md:text-2xl font-heading font-medium leading-relaxed text-foreground mb-8 pt-4">
                  {workData.testimonial.quote}
                </p>
                <div className="flex flex-wrap items-center gap-4 relative z-10">
                  {workData.testimonial.avatar_url ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border border-primary/20 shrink-0">
                      <Image src={workData.testimonial.avatar_url} alt={workData.testimonial.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/10 shrink-0" />
                  )}
                  <div>
                    <div className="font-semibold text-foreground">{workData.testimonial.name}</div>
                    <div className="text-sm font-medium text-muted-foreground">{workData.testimonial.role}</div>
                  </div>
                </div>
              </div>
            )}

          </article>

          {/* Sticky Sidebar CTA */}
          <aside className="hidden lg:block sticky top-24">
            <div className="rounded-[24px] p-8 text-white relative overflow-hidden bg-primary shadow-xl">
              <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-white opacity-10 pointer-events-none" />
              <h3 className="relative z-10 text-2xl font-heading font-bold mb-2">Want similar results?</h3>
              <p className="text-white/80 font-medium mb-8 relative z-10">
                Let's talk about your growth challenges.
              </p>
              <a
                href={workData.calendly_url || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-full bg-white text-primary text-sm font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl hover:bg-white/90 transition-colors relative z-10"
              >
                Start a Conversation
              </a>
            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}
