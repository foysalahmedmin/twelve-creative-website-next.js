"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import type { CmsMedia } from "@/lib/api/cms-media";
import { resolveVideo } from "@/lib/media/video";
import { cn } from "@/lib/utils";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface CmsMediaDisplayProps {
  media: CmsMedia;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}

/** Renders the CMS image/video union without changing the caller's layout. */
export function CmsMediaDisplay({
  media,
  alt,
  className,
  imageClassName,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority,
}: CmsMediaDisplayProps) {
  if (media.type === "image") {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={media.image}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    );
  }

  const resolved = resolveVideo(media.video, media.thumbnail);

  return (
    <div
      className={cn("relative overflow-hidden bg-black", className)}
      role="group"
      aria-label={alt}
    >
      <ReactPlayer
        src={media.video.value}
        width="100%"
        height="100%"
        controls
        playsInline
        // Always defer loading the real player until interaction. Direct and
        // uploaded videos may not have a poster, but should still avoid eagerly
        // loading dozens of sources in CMS marquees/stories.
        light={resolved?.posterUrl || true}
        className="absolute inset-0"
      />
    </div>
  );
}
