"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Alert01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import dynamic from "next/dynamic";
import { useState } from "react";

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

/**
 * Shared video lightbox for every "play this clip" surface in the app
 * (testimonials, marquee reels). Wraps react-player in its own loading/error
 * chrome so a slow network never exposes the browser's raw native buffering
 * or "can't play" icon inside the modal — that native chrome is what read as
 * a broken/glitchy line across the video.
 */
export function VideoDialog({
  open,
  onOpenChange,
  src,
  title,
  aspect = "9/16",
}: VideoDialogProps) {
  const [status, setStatus] = useState<PlayerStatus>("loading");

  // Every newly opened video starts covered until it proves it can play.
  // Reset during render (not an effect) on the closed→open transition, per
  // React's "storing information from previous renders" pattern:
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setStatus("loading");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "w-auto gap-0 rounded-3xl border-none bg-transparent p-2 shadow-xl ring-0",
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
            aspect === "9/16"
              ? "aspect-9/16 h-[min(78vh,720px)]"
              : "aspect-video w-[90vw]",
          )}
        >
          {status !== "error" && open && (
            <ReactPlayer
              src={src}
              playing
              controls
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
