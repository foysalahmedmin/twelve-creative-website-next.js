"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
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
import { useRef, useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type PlayerStatus = "loading" | "ready" | "buffering" | "error";

interface VideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  title: string;
  /** Portrait reels vs. standard landscape video. */
  aspect?: "9/16" | "16/9";
}

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

/**
 * Shared video lightbox for every "play this clip" surface in the app
 * (testimonials, marquee reels). Wraps react-player in its own loading/error
 * chrome so a slow network never exposes the browser's raw native buffering
 * or "can't play" icon inside the modal — that native chrome is what read as
 * a broken/glitchy line across the video.
 *
 * Controls are custom-built, not the native `controls` attribute: on real
 * iOS Safari (never reproduced in desktop Chrome, including its device
 * emulation — only caught by testing against real WebKit), the native
 * control skin renders at a size that ignores this dialog's rounded,
 * clipped container entirely, blowing the video up to cover most of the
 * screen. Confirmed by removing `controls` alone, with nothing else
 * changed, that this fixed it completely.
 */
export function VideoDialog({
  open,
  onOpenChange,
  src,
  title,
  aspect = "9/16",
}: VideoDialogProps) {
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Every newly opened video starts covered until it proves it can play.
  // Reset during render (not an effect) on the closed→open transition, per
  // React's "storing information from previous renders" pattern:
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStatus("loading");
      setPaused(false);
      setProgress(0);
      setCurrentTime(0);
    }
  }

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const seek = (fraction: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = fraction * video.duration;
    setProgress(fraction);
  };

  const showControls = status === "ready" || status === "buffering";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          // flex, not the base grid: a CSS Grid column track is sized once,
          // up front, from the auto-track algorithm, and every item is then
          // clamped to that track regardless of the item's own width — even
          // an explicit inline width can't exceed it. That was capping the
          // video at a fraction of its real width. A flex column lets each
          // child size independently.
          "flex w-auto flex-col gap-0 rounded-3xl border-none bg-transparent p-2 shadow-xl ring-0",
          aspect === "16/9" && "sm:max-w-2xl",
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          Video playback dialog. Press Escape to close.
        </DialogDescription>

        <div
          className={cn(
            "relative max-w-full overflow-hidden rounded-2xl bg-black",
            aspect === "16/9" && "aspect-video w-[90vw]",
          )}
          // 9/16 sizing is inline, not a Tailwind arbitrary class: Tailwind's
          // JIT silently failed to generate any rule for a min()-of-calc()s
          // expression this nested, so the class was present in the markup
          // but produced no CSS at all. Both dimensions are explicit here —
          // not just height with aspect-ratio deriving width — because
          // DialogContent is a CSS Grid with an auto column track, and that
          // track's own auto-sizing pass ran before aspect-ratio resolved,
          // pinning the column to ~185px regardless of the 9:16 ratio and
          // squeezing the video into a thin, letterboxed strip.
          style={
            aspect === "9/16"
              ? {
                  aspectRatio: "9 / 16",
                  height: "min(78vh, 720px)",
                  width:
                    "min(calc(78vh * 9 / 16), calc(720px * 9 / 16), 100%)",
                }
              : undefined
          }
        >
          {status !== "error" && open && (
            <ReactPlayer
              ref={videoRef}
              src={src}
              // Tied to our own paused state, not hardcoded true: react-player
              // re-asserts this prop's play/pause state on every re-render,
              // and onTimeUpdate re-renders constantly. Left as a constant
              // `playing`, it fought every manual video.pause() from the
              // custom button below and resumed playback within a few
              // hundred ms — confirmed live, this is what that looked like.
              playing={!paused}
              controls={false}
              width="100%"
              height="100%"
              playsInline
              style={{ width: "100%", height: "100%" }}
              onReady={() => setStatus((s) => (s === "error" ? s : "ready"))}
              onWaiting={() =>
                setStatus((s) => (s === "ready" ? "buffering" : s))
              }
              onPlaying={() =>
                setStatus((s) => (s === "buffering" ? "ready" : s))
              }
              onError={() => setStatus("error")}
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
              onVolumeChange={() =>
                setMuted(videoRef.current?.muted ?? false)
              }
              onTimeUpdate={() => {
                const video = videoRef.current;
                if (!video) return;
                setCurrentTime(video.currentTime);
                if (video.duration) {
                  setProgress(video.currentTime / video.duration);
                }
              }}
            />
          )}

          {(status === "loading" || status === "buffering") && (
            // Fully opaque, not translucent: this sits directly over the
            // native <video> element, and anything less than opaque lets the
            // browser's own buffering spinner show through underneath ours —
            // which is the exact glitch this component exists to hide.
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black">
              <Spinner className="text-primary-foreground size-8" />
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <HugeiconsIcon
                icon={Alert01Icon}
                className="text-primary-foreground/50 size-8"
              />
              <p className="text-primary-foreground/70 text-sm">
                This video couldn&apos;t load. Please try again.
              </p>
            </div>
          )}

          {showControls && (
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2.5 bg-linear-to-t from-black/80 via-black/40 to-transparent px-3 pt-10 pb-3">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={paused ? "Play" : "Pause"}
                className="text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full transition-transform active:scale-90"
              >
                <HugeiconsIcon
                  icon={paused ? PlayIcon : PauseIcon}
                  className="size-5"
                  fill="currentColor"
                />
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={progress}
                onChange={(e) => seek(Number(e.target.value))}
                aria-label="Seek"
                className="accent-primary h-1 flex-1 cursor-pointer"
              />

              <span className="text-primary-foreground/90 shrink-0 text-xs tabular-nums">
                {formatTime(currentTime)}
              </span>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                className="text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full transition-transform active:scale-90"
              >
                <HugeiconsIcon
                  icon={muted ? VolumeMute01Icon : VolumeHighIcon}
                  className="size-5"
                />
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
