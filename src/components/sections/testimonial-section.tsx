"use client";

import { TestimonialCard } from "@/components/cards/testimonial-card";
import { VideoTestimonialCard } from "@/components/cards/video-testimonial-card";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { VideoDialog } from "@/components/common/video-dialog";
import {
  TESTIMONIALS_DATA,
  type TTestimonial,
  type TTestimonialData,
} from "@/data/testimonials.data";
import { TESTIMONIALS_SECTION_ID } from "@/hooks/use-testimonials-section-state";
import type { HeadingSection } from "@/lib/api/shared-sections";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// ── Continuous rAF marquee ──────────────────────────────────────────────────
// A hand-rolled ticker: the track's translateX is advanced every animation
// frame by a signed velocity. Because "direction" is just the sign of that
// velocity (read fresh each frame), flipping it reverses on the very next
// frame — genuinely instant, with no transition to finish first. Supports
// seamless looping (content rendered twice + wrap), hover-to-pause and
// pointer drag.
export type MarqueeHandle = { setDirection: (leftward: boolean) => void };

// Fades each row to transparent at both edges (borrowed from BrandsSection)
// rather than letting a card cut off abruptly — needed here specifically
// because this section drops its container on mobile, so the row runs edge
// to edge with nothing to visually close it off.
const EDGE_FADE_MASK: React.CSSProperties = {
  maskImage:
    "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
};

interface MarqueeProps {
  items: TTestimonial[];
  /**
   * `interactive` is false for the duplicated copy and for the repeat-padding
   * items. Only the Marquee knows which copy an item is in, so it decides —
   * a card cannot work it out from its index alone.
   */
  renderItem: (
    item: TTestimonial,
    index: number,
    interactive: boolean,
  ) => React.ReactNode;
  pxPerSecond: number;
  /** true → content scrolls right → left; false → left → right */
  initialLeftward: boolean;
  gap: number;
  itemWidthClass: string;
  accessibleItemCount: number;
  className?: string;
}

const Marquee = forwardRef<MarqueeHandle, MarqueeProps>(function Marquee(
  {
    items,
    renderItem,
    pxPerSecond,
    initialLeftward,
    gap,
    itemWidthClass,
    accessibleItemCount,
    className,
  },
  ref,
) {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  const offset = useRef(0);
  const copyWidth = useRef(0);
  const sign = useRef(initialLeftward ? -1 : 1); // -1 = leftward, +1 = rightward
  const hover = useRef(false);
  const dragging = useRef(false);
  const moved = useRef(0);
  const lastX = useRef(0);
  const reduced = useRef(false);
  const down = useRef(false);
  const pointerId = useRef(-1);

  useImperativeHandle(ref, () => ({
    setDirection: (leftward: boolean) => {
      sign.current = leftward ? -1 : 1;
    },
  }));

  const wrap = () => {
    const w = copyWidth.current;
    if (w <= 0) return;
    if (offset.current <= -w) offset.current += w;
    else if (offset.current > 0) offset.current -= w;
  };
  const apply = () => {
    const t = trackRef.current;
    if (t) t.style.transform = `translate3d(${offset.current}px,0,0)`;
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Measure one real copy's outer width (exact & browser-consistent) rather
    // than dividing the total, which trailing margins can throw off.
    const measure = () => {
      copyWidth.current = copyRef.current?.offsetWidth ?? track.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (copyRef.current) ro.observe(copyRef.current);
    ro.observe(track);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      if (
        !reduced.current &&
        !hover.current &&
        !dragging.current &&
        copyWidth.current > 0
      ) {
        offset.current += (sign.current * pxPerSecond * dt) / 1000;
        wrap();
        apply();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [pxPerSecond]);

  // ── Pointer drag ──
  // Engage drag (and capture the pointer) only after a clear movement
  // threshold, so a plain tap/click on a reel still reaches the card and opens
  // its video.
  const DRAG_THRESHOLD = 10;
  const onPointerDown = (e: React.PointerEvent) => {
    down.current = true;
    moved.current = 0;
    dragging.current = false;
    lastX.current = e.clientX;
    pointerId.current = e.pointerId;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!down.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    moved.current += Math.abs(dx);
    if (!dragging.current && moved.current > DRAG_THRESHOLD) {
      dragging.current = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(pointerId.current);
      } catch {
        /* capture unsupported */
      }
    }
    if (dragging.current) {
      offset.current += dx;
      wrap();
      apply();
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    down.current = false;
    if (dragging.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(
          pointerId.current,
        );
      } catch {
        /* already released */
      }
    }
    setTimeout(() => {
      dragging.current = false;
      moved.current = 0;
    }, 50);
  };
  const onClickCapture = (e: React.MouseEvent) => {
    // Swallow the click only if this pointer sequence was a real drag.
    if (dragging.current || moved.current > DRAG_THRESHOLD) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div
      className={cn(
        "-my-3 min-w-0 flex-1 cursor-grab overflow-hidden py-3 select-none active:cursor-grabbing",
        className,
      )}
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
    >
      <div
        ref={trackRef}
        className="flex w-max items-stretch will-change-transform"
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            ref={copy === 0 ? copyRef : undefined}
            className="flex shrink-0 items-stretch"
            aria-hidden={copy === 1}
          >
            {items.map((item, i) => {
              // The duplicate copy exists only to make the loop seamless, and
              // the repeat-padding items are the same testimonials again — both
              // are hidden from assistive tech, so anything focusable inside
              // them must be taken out of the tab order too. (`inert` would do
              // both, but it also swallows the click that opens the video.)
              const interactive = copy === 0 && i < accessibleItemCount;
              return (
                <div
                  key={`${item.id}-${i}`}
                  className={cn("flex shrink-0 self-stretch", itemWidthClass)}
                  style={{ marginRight: gap }}
                  aria-hidden={!interactive}
                >
                  {renderItem(item, i, interactive)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
});

// ── Arrow nav button ───────────────────────────────────────────────────────
function SliderArrow({
  direction,
  onClick,
  className,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        direction === "prev" ? "Scroll right to left" : "Scroll left to right"
      }
      className={cn(
        "z-10 hidden shrink-0 items-center justify-center lg:flex",
        "h-10 w-10 rounded-full",
        "border-border bg-card border",
        "text-foreground/60 transition-all duration-200",
        "hover:border-primary/50 hover:text-foreground",
        "focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
    >
      {direction === "prev" ? (
        <ChevronLeft className="h-5 w-5" />
      ) : (
        <ChevronRight className="h-5 w-5" />
      )}
    </button>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────
export interface PageTestimonialSectionProps {
  data: TTestimonialData;
  heading?: HeadingSection | null;
  className?: string;
}

// ── Main component ─────────────────────────────────────────────────────────
export const TestimonialSection = ({
  data = TESTIMONIALS_DATA,
  heading,
  className,
}: Partial<PageTestimonialSectionProps>) => {
  const { label, title, description, testimonials = [] } = data || {};
  const [activeVideo, setActiveVideo] = useState<TTestimonial | null>(null);

  const videoMarquee = useRef<MarqueeHandle>(null);
  const textMarquee = useRef<MarqueeHandle>(null);

  const videoTestimonials = testimonials.filter(
    (t) => t.category === "video_message",
  );
  const textTestimonials = testimonials.filter((t) => t.category === "message");

  // Duplicate short lists so a single "copy" is wider than the viewport —
  // otherwise the seamless-loop wrap would leave a visible gap.
  const repeatToFill = (items: TTestimonial[], min: number): TTestimonial[] => {
    if (items.length === 0) return items;
    const copies = Math.max(1, Math.ceil(min / items.length));
    return Array.from({ length: copies }, () => items).flat();
  };
  const videoItems = repeatToFill(videoTestimonials, 12);
  const textItems = repeatToFill(textTestimonials, 12);

  const openVideo = (testimonial: TTestimonial) => setActiveVideo(testimonial);

  if (!testimonials.length) return null;

  return (
    <section
      id={TESTIMONIALS_SECTION_ID}
      className={cn(
        "bg-brand-artefact border-primary-foreground/15 w-full scroll-mt-24 border-y py-16 sm:py-20 lg:py-24 dark:border-[#eaeae4]/10",
        className,
      )}
    >
      <ScrollReveal animation="fade-in-up" durationMs={800}>
        <div className="lg:container">
          {/* Section header */}
          {heading !== null && (
            <CenteredSectionHeader
              label={heading?.label ?? label ?? "Testimonials"}
              title={heading?.title ?? title ?? "What Our Clients Say"}
              description={
                heading?.description ??
                description ??
                "1,000+ creators trust us to edit their videos."
              }
              tone="inverse"
              className="relative z-10 mb-0 lg:mb-0"
            />
          )}

          {/* ── Marquee rows ── */}
          <div
            className={cn(
              "relative z-10 flex flex-col gap-10 md:gap-12",
              heading === null ? "mt-0" : "mt-12 md:mt-16",
            )}
          >
            {/* ── Row 1: Reels — default drifts left → right ── */}
            {videoTestimonials.length > 0 && (
              <div className="flex items-center gap-1 px-1">
                <SliderArrow
                  className="hidden"
                  direction="prev"
                  onClick={() => videoMarquee.current?.setDirection(true)}
                />

                <div className="flex min-w-0 flex-1" style={EDGE_FADE_MASK}>
                  <Marquee
                    ref={videoMarquee}
                    items={videoItems}
                    initialLeftward={false}
                    pxPerSecond={30}
                    gap={14}
                    itemWidthClass="w-[200px] lg:w-[240px]"
                    accessibleItemCount={videoTestimonials.length}
                    renderItem={(testimonial, _index, interactive) => (
                      <VideoTestimonialCard
                        testimonial={testimonial}
                        onOpen={openVideo}
                        interactive={interactive}
                        className="h-full w-full md:w-full"
                      />
                    )}
                  />
                </div>

                <SliderArrow
                  className="hidden"
                  direction="next"
                  onClick={() => videoMarquee.current?.setDirection(false)}
                />
              </div>
            )}

            {/* ── Row 2: Text — default drifts right → left ── */}
            {textTestimonials.length > 0 && (
              <div className="flex items-center gap-1 px-1">
                <SliderArrow
                  className="hidden"
                  direction="prev"
                  onClick={() => textMarquee.current?.setDirection(true)}
                />

                <div className="flex min-w-0 flex-1" style={EDGE_FADE_MASK}>
                  <Marquee
                    ref={textMarquee}
                    items={textItems}
                    initialLeftward={true}
                    pxPerSecond={40}
                    gap={18}
                    itemWidthClass="w-[272px] sm:w-[310px] lg:w-[348px] xl:w-[384px]"
                    accessibleItemCount={textTestimonials.length}
                    renderItem={(testimonial) => (
                      <TestimonialCard
                        testimonial={testimonial}
                        className="h-full w-full md:w-full"
                      />
                    )}
                  />
                </div>

                <SliderArrow
                  className="hidden"
                  direction="next"
                  onClick={() => textMarquee.current?.setDirection(false)}
                />
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      <VideoDialog
        open={!!activeVideo}
        onOpenChange={(next) => {
          if (!next) setActiveVideo(null);
        }}
        src={activeVideo?.video_message || ""}
        title={`Video testimonial from ${activeVideo?.name ?? ""}`}
      />
    </section>
  );
};
