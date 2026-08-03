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
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [started, status]);

  const start = useCallback(() => {
    setStatus("loading");
    setPaused(false);
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
    video.muted = !video.muted;
    setMuted(video.muted);
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
        <button
          type="button"
          onClick={start}
          className="absolute inset-0 z-10 block h-full w-full cursor-pointer"
          aria-label={`Play ${title}`}
        >
          {thumbnailSrc && (
            <Image
              src={thumbnailSrc}
              alt={title}
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
      ) : (
        <>
          {status !== "error" && (
            <ReactPlayer
              ref={videoRef}
              src={src}
              playing={!paused}
              controls={false}
              playsInline
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              onReady={() => setStatus((s) => (s === "error" ? s : "ready"))}
              onCanPlay={() => setStatus((s) => (s === "error" ? s : "ready"))}
              onWaiting={() =>
                setStatus((s) => (s === "ready" ? "buffering" : s))
              }
              onPlaying={() => setStatus((s) => (s === "error" ? s : "ready"))}
              onError={() => setStatus("error")}
              onPlay={() => {
                setPaused(false);
                claimPlayback();
              }}
              onPause={() => setPaused(true)}
              onVolumeChange={() => setMuted(videoRef.current?.muted ?? false)}
            />
          )}

          {(status === "loading" || status === "buffering") && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black">
              <Spinner className="text-primary-foreground size-6" />
            </div>
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
