"use client";

import { Spinner } from "@/components/ui/spinner";
import { useExclusiveVideoPlayback } from "@/hooks/use-exclusive-video-playback";
import { cn } from "@/lib/utils";
import {
  Alert01Icon,
  PauseIcon,
  PlayIcon,
  VolumeHighIcon,
  VolumeMute01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type PlayerStatus = "loading" | "ready" | "buffering" | "error";

/**
 * Thumbnail + centered play button, shared by the pre-start cover and the
 * paused cover below — same look, different click target.
 */
function VideoCoverButton({
  label,
  thumbnailSrc,
  thumbnailSizes,
  onClick,
}: {
  label: string;
  thumbnailSrc?: string;
  thumbnailSizes: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute inset-0 z-10 block h-full w-full cursor-pointer"
      aria-label={label}
    >
      {thumbnailSrc && (
        <Image
          src={thumbnailSrc}
          alt=""
          fill
          sizes={thumbnailSizes}
          className="object-cover transition-transform duration-300 group-hover/video:scale-105"
        />
      )}
      <span
        aria-hidden
        className="bg-foreground/0 group-hover/video:bg-foreground/15 absolute inset-0 transition-colors duration-300"
      />
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center",
          "h-10 w-16 rounded-xl md:h-12 md:w-20 md:rounded-2xl",
          "bg-card/10 border border-white/20 text-white shadow-2xl backdrop-blur-md",
          "group-hover/video:bg-card/30 transition-all duration-300 group-hover/video:scale-110 group-hover/video:border-white/35",
          "group-active/video:scale-95",
        )}
      >
        <HugeiconsIcon
          icon={PlayIcon}
          className="size-5 md:size-6"
          fill="currentColor"
        />
      </span>
    </button>
  );
}

interface InlineVideoPlayerProps {
  src: string;
  title: string;
  thumbnailSrc?: string;
  className?: string;
  /** Applied to the poster's <Image>, matching each grid's own responsive columns. */
  thumbnailSizes?: string;
}

/**
 * The card-grid counterpart to VideoDialog: a video that plays in place
 * rather than in a lightbox, for featured projects, industry reels, work
 * items, and every other list where several of these can be on screen at
 * once. Shares VideoDialog's two hard-won fixes — custom controls instead of
 * the native `controls` attribute, and `playing` tied to real pause state
 * instead of hardcoded `true` — because both defects reproduce here the same
 * way they did in the modal: on a single instance, native controls broke out
 * of a rounded, clipped card exactly as they did out of the dialog's box, and
 * a hardcoded `playing` fights every manual pause. What's different inline is
 * exclusivity: with several of these mounted side by side, starting one used
 * to leave every previously started card still playing underneath it, so
 * every instance registers with the shared playback coordinator and is told
 * to pause the moment another one starts.
 */
export function InlineVideoPlayer({
  src,
  title,
  thumbnailSrc,
  className,
  thumbnailSizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
}: InlineVideoPlayerProps) {
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [paused, setPaused] = useState(false);
  // Separate from `paused`: `paused` is play/pause *intent* (drives the
  // `playing` prop and the control-bar icon) and flips to false optimistically
  // the instant start() fires, before the provider has actually begun
  // rendering frames. `isPlaying` only flips true once a real playback event
  // confirms it. YouTube removed the `showinfo` embed param years ago, so its
  // title/avatar overlay and big center play/pause/replay icon show natively
  // on the iframe any time it isn't actively playing — controls={false} only
  // suppresses the in-player scrub bar, not this cover. Every other state
  // (loading, buffering, paused, ended, force-paused by exclusivity or
  // scrolling away) needs our own opaque cover in front of the iframe, or
  // YouTube's chrome shows through underneath.
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Real, already-settled pixel dimensions instead of the "100%" the box's
  // own aspect-ratio CSS would otherwise resolve to. Same reason VideoDialog
  // computes exact pixels rather than trusting percentage/aspect-ratio: a
  // native <video> repaints itself on every later layout change regardless
  // of when it was told its size, but the YouTube/Vimeo/etc. providers here
  // render through a cross-origin iframe that reads its box once and doesn't
  // reliably re-adapt — on a portrait (9:16) reel this showed up as the
  // video pillarboxed into a fraction of the card with YouTube's own
  // title/avatar/Shorts chrome still visible, because the iframe locked in a
  // size before this card's aspect-ratio box had actually resolved. Measured
  // via ResizeObserver specifically because its callback only ever fires
  // after layout has genuinely settled — no other API in the platform makes
  // that guarantee — and the player stays unmounted until a measurement
  // exists, so the iframe is never created against an unresolved box.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = (rect: { width: number; height: number }) => {
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width <= 0 || height <= 0) return;
      setSize((prev) =>
        prev && prev.width === width && prev.height === height
          ? prev
          : { width, height },
      );
    };
    measure(container.getBoundingClientRect());
    const observer = new ResizeObserver(([entry]) => {
      measure(entry.contentRect);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const { claimPlayback, releasePlayback } = useExclusiveVideoPlayback(() => {
    videoRef.current?.pause();
  });

  useEffect(() => {
    if (!started) releasePlayback();
  }, [started, releasePlayback]);

  // Exclusivity alone isn't enough: it only pauses this player when a
  // *different* one starts. Nothing else stops a video that's still playing
  // when it scrolls out of view on its own — a carousel slide advancing past
  // it, react-fast-marquee endlessly carrying it sideways, or a scroll-stacked
  // section (growth-system, work-with-us) covering it with the next stage. In
  // all three, the element stays mounted and simply moves, so this container
  // leaving the viewport is the only signal available. Pause-only: resuming
  // on scroll-back-into-view would restart audio the user isn't expecting.
  useEffect(() => {
    if (!started) return;
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) videoRef.current?.pause();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [started]);

  // Same fallback as VideoDialog: on at least one real device, none of
  // react-player's onReady/onCanPlay/onPlaying fired even though the
  // underlying <video> was already playing, so the custom controls never
  // appeared. This reads the element's own readyState directly, independent
  // of whatever swallowed those events.
  useEffect(() => {
    if (!started || (status !== "loading" && status !== "buffering")) return;
    const id = window.setInterval(() => {
      const video = videoRef.current;
      if (video && (video.readyState >= 3 || !video.paused)) {
        setStatus((s) => (s === "error" ? s : "ready"));
        if (!video.paused) setIsPlaying(true);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [started, status]);

  const start = useCallback(() => {
    setStatus("loading");
    setPaused(false);
    setIsPlaying(false);
    setStarted(true);
  }, []);

  const togglePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    // Compute the target once and use it for both — the YouTube provider's
    // `muted` setter mutes asynchronously (it waits on an internal ready
    // promise before calling the real mute/unmute API), so reading
    // `video.muted` back immediately after assigning it returns the old,
    // pre-toggle value almost every time. The button looked like it did
    // nothing because the icon was always one click behind.
    const next = !video.muted;
    video.muted = next;
    setMuted(next);
  }, []);

  const showControls = status === "ready" || status === "buffering";

  return (
    <div
      ref={containerRef}
      className={cn(
        "group/video relative w-full overflow-hidden bg-black",
        className,
      )}
    >
      {!started ? (
        <VideoCoverButton
          label={`Play ${title}`}
          thumbnailSrc={thumbnailSrc}
          thumbnailSizes={thumbnailSizes}
          onClick={start}
        />
      ) : (
        <>
          {status !== "error" && size && (
            <ReactPlayer
              ref={videoRef}
              src={src}
              playing={!paused}
              controls={false}
              playsInline
              // Real pixel numbers reach the YouTube provider's own iframe
              // via a patched dependency (patches/youtube-video-element.patch)
              // — see that patch for why. CSS width/height alone leaves the
              // iframe's own width/height *attributes* at the library's
              // hardcoded "100%", which YouTube reads as "no real size
              // given" and defaults its internal layout to landscape,
              // rendering a portrait (Shorts) video pillarboxed regardless
              // of the iframe's actual CSS-rendered shape.
              config={{ youtube: { width: size.width, height: size.height } }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: size.width,
                height: size.height,
                objectFit: "contain",
              }}
              onReady={() => setStatus((s) => (s === "error" ? s : "ready"))}
              onCanPlay={() => setStatus((s) => (s === "error" ? s : "ready"))}
              onWaiting={() =>
                setStatus((s) => (s === "ready" ? "buffering" : s))
              }
              onPlaying={() => {
                setStatus((s) => (s === "error" ? s : "ready"));
                setIsPlaying(true);
              }}
              onError={() => setStatus("error")}
              onPlay={() => {
                setPaused(false);
                setIsPlaying(true);
                claimPlayback();
              }}
              onPause={() => {
                setPaused(true);
                setIsPlaying(false);
              }}
              onVolumeChange={() => setMuted(videoRef.current?.muted ?? false)}
            />
          )}

          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
              <HugeiconsIcon
                icon={Alert01Icon}
                className="text-primary-foreground/50 size-6"
              />
              <p className="text-primary-foreground/70 text-xs">
                This video couldn&apos;t load.
              </p>
            </div>
          )}

          {status !== "error" && !isPlaying && (
            <>
              {status === "loading" || status === "buffering" ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black">
                  <Spinner className="text-primary-foreground size-6" />
                </div>
              ) : (
                <VideoCoverButton
                  label={`Play ${title}`}
                  thumbnailSrc={thumbnailSrc}
                  thumbnailSizes={thumbnailSizes}
                  onClick={togglePlay}
                />
              )}
            </>
          )}

          {showControls && (
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-linear-to-t from-black/80 via-black/30 to-transparent px-2 pt-8 pb-2">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={paused ? "Play" : "Pause"}
                className="text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full transition-transform active:scale-90"
              >
                <HugeiconsIcon
                  icon={paused ? PlayIcon : PauseIcon}
                  className="size-4"
                  fill="currentColor"
                />
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                className="text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full transition-transform active:scale-90"
              >
                <HugeiconsIcon
                  icon={muted ? VolumeMute01Icon : VolumeHighIcon}
                  className="size-4"
                />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
