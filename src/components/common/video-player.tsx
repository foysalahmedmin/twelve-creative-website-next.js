"use client";

import { InlineVideoPlayer } from "@/components/common/inline-video-player";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  link: string;
  thumbnail: string;
  className?: string;
  aspectRatio?: "video" | "shorts";
}

/**
 * Thin, named wrapper around InlineVideoPlayer for call sites that think in
 * terms of "video" vs "shorts" rather than a raw aspect class.
 */
export const VideoPlayer = ({
  link,
  thumbnail,
  className,
  aspectRatio = "video",
}: VideoPlayerProps) => (
  <InlineVideoPlayer
    src={link}
    title="video"
    thumbnailSrc={thumbnail}
    className={cn(
      "rounded-2xl border border-primary/10",
      aspectRatio === "shorts" ? "aspect-9/16 max-w-70 mx-auto" : "aspect-video w-full",
      className,
    )}
  />
);

export default VideoPlayer;
