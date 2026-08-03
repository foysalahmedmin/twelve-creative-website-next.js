"use client";

import Image from "next/image";
import { InlineVideoPlayer } from "@/components/common/inline-video-player";
import type { CmsMedia } from "@/lib/api/cms-media";
import { resolveVideo } from "@/lib/media/video";
import { cn } from "@/lib/utils";

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
    <InlineVideoPlayer
      src={media.video.value}
      title={alt}
      thumbnailSrc={resolved?.posterUrl}
      className={className}
    />
  );
}
