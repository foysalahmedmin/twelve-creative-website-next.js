"use client";

import { TestimonialCard } from "@/components/cards/testimonial-card";
import { VideoTestimonialCard } from "@/components/cards/video-testimonial-card";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import {
  TESTIMONIALS_DATA,
  type TTestimonial,
  type TTestimonialData,
} from "@/data/testimonials.data";
import { cn } from "@/lib/utils";
import type { HeadingSection } from "@/lib/api/shared-sections";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useCallback,
  useRef,
  useState,
} from "react";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

// ── Continuous rAF marquee ──────────────────────────────────────────────────
// A hand-rolled ticker: the track's translateX is advanced every animation
// frame by a signed velocity. Because "direction" is just the sign of that
// velocity (read fresh each frame), flipping it reverses on the very next
// frame — genuinely instant, with no transition to finish first. Supports
// seamless looping (content rendered twice + wrap), hover-to-pause and
// pointer drag.
export type MarqueeHandle = { setDirection: (leftward: boolean) => void };

interface MarqueeProps {
  items: TTestimonial[];
  renderItem: (item: TTestimonial, index: number) => React.ReactNode;
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
  // Engage drag (and capture the pointer) only after a small movement
  // threshold, so a plain tap/click on a reel still reaches the card and opens
  // its video — capturing on every pointerdown can swallow the click.
  const DRAG_THRESHOLD = 5;
  const onPointerDown = (e: React.PointerEvent) => {
    down.current = true;
    moved.current = 0;
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
      dragging.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(
          pointerId.current,
        );
      } catch {
        /* already released */
      }
    }
  };
  const onClickCapture = (e: React.MouseEvent) => {
    // Swallow the click only if this pointer sequence was a real drag.
    if (moved.current > 6) {
      e.stopPropagation();
      e.preventDefault();
    }
    moved.current = 0;
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
            inert={copy === 1}
          >
            {items.map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className={cn("flex shrink-0 self-stretch", itemWidthClass)}
                style={{ marginRight: gap }}
                aria-hidden={copy === 1 || i >= accessibleItemCount}
                inert={copy === 1 || i >= accessibleItemCount}
              >
                {renderItem(item, i)}
              </div>
            ))}
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
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

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

  const openVideo = (testimonial: TTestimonial) => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setActiveVideo(testimonial);
  };

  const closeVideo = useCallback(() => {
    setActiveVideo(null);
    window.requestAnimationFrame(() => previousFocusRef.current?.focus());
  }, [setActiveVideo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeVideo) return;
      if (e.key === "Escape") {
        closeVideo();
        return;
      }
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) {
        e.preventDefault();
        modalRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (!modalRef.current.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (
        e.shiftKey &&
        (active === first || active === modalRef.current)
      ) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo, closeVideo]);

  useEffect(() => {
    if (!activeVideo) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeVideo]);

  if (!testimonials.length) return null;

  return (
    <section
      className={cn(
        "bg-brand-artefact border-primary-foreground/15 w-full border-y py-16 sm:py-20 lg:py-24 dark:border-[#eaeae4]/10",
        className,
      )}
    >
      <ScrollReveal animation="fade-in-up" durationMs={800}>
        <div className="container">
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
              <div className="flex items-center gap-3 px-4 md:px-8 lg:px-12">
                <SliderArrow
                  className="hidden"
                  direction="prev"
                  onClick={() => videoMarquee.current?.setDirection(true)}
                />

                <Marquee
                  ref={videoMarquee}
                  items={videoItems}
                  initialLeftward={false}
                  pxPerSecond={30}
                  gap={14}
                  itemWidthClass="w-[180px] lg:w-[200px] xl:w-[240px]"
                  accessibleItemCount={videoTestimonials.length}
                  renderItem={(testimonial, index) => (
                    <VideoTestimonialCard
                      testimonial={testimonial}
                      onOpen={openVideo}
                      interactive={index < videoTestimonials.length}
                      className="h-full w-full md:w-full"
                    />
                  )}
                />

                <SliderArrow
                  className="hidden"
                  direction="next"
                  onClick={() => videoMarquee.current?.setDirection(false)}
                />
              </div>
            )}

            {/* ── Row 2: Text — default drifts right → left ── */}
            {textTestimonials.length > 0 && (
              <div className="flex items-center gap-3 px-4 md:px-8 lg:px-12">
                <SliderArrow
                  className="hidden"
                  direction="prev"
                  onClick={() => textMarquee.current?.setDirection(true)}
                />

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

      {/* ── Video modal ── */}
      {activeVideo && (
        <div
          onClick={closeVideo}
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-video-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="bg-card animate-zoom-in border-border relative max-h-[85vh] w-auto max-w-[90vw] rounded-3xl border p-2 shadow-xl"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeVideo}
              className="hover:text-primary absolute -top-12 right-0 z-10 flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all duration-200"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
              Close (ESC)
            </button>

            <h2 id="testimonial-video-title" className="sr-only">
              Video testimonial from {activeVideo.name}
            </h2>

            <div className="aspect-9/16 h-[min(78vh,720px)] max-w-full overflow-hidden rounded-2xl bg-black">
              <ReactPlayer
                src={activeVideo.video_message || ""}
                playing
                controls
                width="100%"
                height="100%"
                playsInline
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
