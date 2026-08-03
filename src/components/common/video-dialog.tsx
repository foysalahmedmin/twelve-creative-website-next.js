"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useExclusiveVideoPlayback } from "@/hooks/use-exclusive-video-playback";
import { cn } from "@/lib/utils";
import {
  Alert01Icon,
  Cancel01Icon,
  PauseIcon,
  PlayIcon,
  VolumeHighIcon,
  VolumeMute01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

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

/** Share of the viewport's height the player is allowed to occupy. */
const HEIGHT_RATIO = 0.78;
/** Share of the viewport's width the player is allowed to occupy. */
const WIDTH_RATIO = 0.92;
const MAX_HEIGHT_PX = 720;
const MAX_WIDTH_PX = { portrait: 405, landscape: 1000 } as const;

type Size = { width: number; height: number };

/** Ratio is width ÷ height, so 9/16 is portrait and 16/9 is landscape. */
const ratioOf = (aspect: "9/16" | "16/9") =>
  aspect === "16/9" ? 16 / 9 : 9 / 16;

/**
 * Largest box of the given ratio that fits the current viewport.
 *
 * Deliberately plain arithmetic on window.innerWidth/innerHeight rather than
 * the CSS it replaces (`aspect-ratio` plus a `min()` of vh/px/% terms). That
 * CSS measured correctly in every engine available here, yet still collapsed
 * to zero width on a real iPhone — the modal rendered as nothing but its
 * close button, and the video kept playing audio at zero size. Percentages
 * and aspect-ratio both need the engine to resolve a size against a parent
 * that is itself sized by its children; numbers resolved here have no such
 * dependency and cannot collapse.
 */
const measure = (ratio: number): Size => {
  const availableHeight = Math.min(
    window.innerHeight * HEIGHT_RATIO,
    MAX_HEIGHT_PX,
  );
  const availableWidth = Math.min(
    window.innerWidth * WIDTH_RATIO,
    ratio >= 1 ? MAX_WIDTH_PX.landscape : MAX_WIDTH_PX.portrait,
  );

  let height = availableHeight;
  let width = height * ratio;
  if (width > availableWidth) {
    width = availableWidth;
    height = width / ratio;
  }
  return { width: Math.round(width), height: Math.round(height) };
};

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
 * or "can't play" icon inside the modal.
 *
 * Controls are custom-built rather than the native `controls` attribute, so
 * the control bar is styled with the rest of the app and stays inside the
 * dialog's rounded, clipped box on every engine.
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
  // `paused` is play/pause intent and flips false optimistically the instant
  // the dialog opens, before playback has actually begun. `isPlaying` only
  // flips true on a confirmed playback event. YouTube removed the `showinfo`
  // embed param years ago, so its title/avatar overlay and big center
  // play/pause/replay icon render natively on the iframe any time it isn't
  // actively playing — controls={false} only suppresses the in-player scrub
  // bar, not this cover. Loading/buffering already get an opaque cover below;
  // paused/ended/force-paused-by-exclusivity need one too, or that native
  // YouTube chrome shows through inside our own dialog.
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [size, setSize] = useState<Size | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [report, setReport] = useState<string | null>(null);
  // The `aspect` prop is only a hint for the first paint. The real ratio comes
  // from the file itself, because callers don't reliably know it: the marquee
  // renders a mixed library and asks for portrait for everything, so 16:9
  // clips were being letterboxed into a tall box with the picture reduced to a
  // band across the middle.
  const [ratio, setRatio] = useState(() => ratioOf(aspect));

  const { claimPlayback, releasePlayback } = useExclusiveVideoPlayback(() => {
    videoRef.current?.pause();
  });

  useEffect(() => {
    if (!open) releasePlayback();
  }, [open, releasePlayback]);

  const syncRatio = useCallback(() => {
    const video = videoRef.current;
    if (!video?.videoWidth || !video.videoHeight) return;
    const actual = video.videoWidth / video.videoHeight;
    setRatio((current) =>
      Math.abs(current - actual) < 0.01 ? current : actual,
    );
  }, []);

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
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setRatio(ratioOf(aspect));
    }
  }

  // Re-measured on rotate/resize, and on every open: iOS reports a different
  // innerHeight depending on whether the browser chrome is expanded, and that
  // can change between one open and the next.
  useEffect(() => {
    if (!open) return;
    const update = () => setSize(measure(ratio));
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [open, ratio]);

  // Independent of react-player's own event props, as a fallback: on a real
  // device none of onReady/onCanPlay/onPlaying fired at all even though the
  // underlying <video> was already playing, so the controls never appeared.
  // Reading readyState off the element itself can't be affected by whatever
  // swallowed those events.
  useEffect(() => {
    if (!open || (status !== "loading" && status !== "buffering")) return;
    const id = window.setInterval(() => {
      const video = videoRef.current;
      if (video && (video.readyState >= 3 || !video.paused)) {
        syncRatio();
        setStatus((s) => (s === "error" ? s : "ready"));
        if (!video.paused) setIsPlaying(true);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [open, status, syncRatio]);

  // Temporary, opt-in only: append ?vdebug=1 to the URL to overlay what the
  // player actually measured on this device. Kept because this modal has
  // already been "fixed" against engines that could not reproduce the real
  // device's behaviour — a single screenshot of these numbers says more than
  // another round of guessing. Safe to delete once the modal is settled.
  useEffect(() => {
    if (!open || !window.location.search.includes("vdebug=1")) return;
    const id = window.setInterval(() => {
      const box = boxRef.current?.getBoundingClientRect();
      const dialog = boxRef.current?.closest("[data-slot='dialog-content']");
      const dialogBox = dialog?.getBoundingClientRect();
      const video = videoRef.current;
      setReport(
        [
          `viewport ${window.innerWidth}x${window.innerHeight}`,
          `measured ${size ? `${size.width}x${size.height}` : "null"}`,
          `box      ${box ? `${Math.round(box.width)}x${Math.round(box.height)}` : "none"}`,
          `dialog   ${dialogBox ? `${Math.round(dialogBox.width)}x${Math.round(dialogBox.height)}` : "none"}`,
          `video    ${video ? `${Math.round(video.getBoundingClientRect().width)}x${Math.round(video.getBoundingClientRect().height)} nat ${video.videoWidth}x${video.videoHeight}` : "none"}`,
          `state    rs=${video?.readyState ?? "-"} paused=${video?.paused ?? "-"} status=${status}`,
        ].join("\n"),
      );
    }, 400);
    return () => window.clearInterval(id);
  }, [open, size, status]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const seek = useCallback((fraction: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = fraction * video.duration;
    setProgress(fraction);
  }, []);

  const showControls = status === "ready" || status === "buffering";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // The dialog's own close button anchors to the dialog, which is wider
        // than the video to keep the video's own width definite. That left the
        // X floating off the picture's corner, so the close button lives
        // inside the video box below instead.
        showCloseButton={false}
        // w-full + items-center, never w-auto: a shrink-to-fit dialog takes
        // its width from this box, while the box took its width from the
        // dialog — a cycle the engine has to break on its own, and one engine
        // broke it by collapsing to zero. A definite width removes the cycle,
        // and means even a dropped size on the box degrades to "full width"
        // instead of "invisible".
        className={cn(
          "flex w-full flex-col items-center gap-0 border-none bg-transparent p-2 shadow-none ring-0",
          // Wide enough to clear the measured box in either orientation, so
          // the dialog's own max-width never clips it.
          ratio >= 1 ? "sm:max-w-5xl" : "sm:max-w-lg",
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          Video playback dialog. Press Escape to close.
        </DialogDescription>

        {report && (
          <pre className="fixed inset-x-0 top-0 z-100 m-0 bg-black/85 p-2 font-mono text-[10px] leading-tight whitespace-pre text-lime-400">
            {report}
          </pre>
        )}

        <div
          ref={boxRef}
          className="relative overflow-hidden rounded-2xl bg-black"
          style={
            size
              ? { width: size.width, height: size.height }
              : // Only ever used for the first paint before measuring. Plain
                // viewport units with no percentage and no ratio to resolve,
                // so this fallback cannot collapse either.
                {
                  width: "90vw",
                  height: ratio >= 1 ? "50.6vw" : "160vw",
                  maxHeight: "78vh",
                }
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
              // hundred ms.
              playing={!paused}
              controls={false}
              playsInline
              // Pinned to the box's edges rather than sized at 100%: the box
              // is already an exact pixel size, so there is nothing left for
              // a percentage to resolve against incorrectly.
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              onLoadedMetadata={syncRatio}
              onReady={() => {
                syncRatio();
                setStatus((s) => (s === "error" ? s : "ready"));
              }}
              onCanPlay={() => {
                syncRatio();
                setStatus((s) => (s === "error" ? s : "ready"));
              }}
              onWaiting={() =>
                setStatus((s) => (s === "ready" ? "buffering" : s))
              }
              onPlaying={() => {
                syncRatio();
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

          {status !== "error" && !isPlaying && (
            <>
              {status === "loading" || status === "buffering" ? (
                // Fully opaque, not translucent: this sits directly over the
                // native <video> element, and anything less than opaque lets
                // the browser's own buffering spinner show through underneath.
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black">
                  <Spinner className="text-primary-foreground size-8" />
                </div>
              ) : (
                // Same reasoning as the loading cover, but for paused/ended/
                // force-paused: without this, YouTube's own title/avatar
                // overlay and big center icon (controls={false} never
                // suppresses that cover screen, only the in-player scrub bar)
                // show through the instant playback isn't active.
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={`Play ${title}`}
                  className="absolute inset-0 z-5 flex items-center justify-center bg-black"
                >
                  <span
                    aria-hidden
                    className="flex h-12 w-20 items-center justify-center rounded-2xl border border-white/20 bg-card/10 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-card/30 hover:scale-110 active:scale-95"
                  >
                    <HugeiconsIcon
                      icon={PlayIcon}
                      className="size-6"
                      fill="currentColor"
                    />
                  </span>
                </button>
              )}
            </>
          )}

          {/* Above every overlay and always mounted, so the video can still be
              dismissed while it's loading or after it has failed. Carries its
              own scrim because it sits over the footage, which can be any
              colour at the moment it's tapped. */}
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Close video"
              className="text-primary-foreground absolute top-2 right-2 z-20 flex size-9 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm transition-transform active:scale-90"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                className="size-4.5"
                strokeWidth={2.5}
              />
            </button>
          </DialogClose>

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
