"use client";

import { ImageIcon, Video } from "lucide-react";
import { useState } from "react";
import { ImageInput } from "@/components/admin/inputs/image-input";
import { VideoInput } from "@/components/admin/inputs/video-input";
import { Label } from "@/components/ui/label";
import type { CmsMedia } from "@/lib/api/cms-media";
import { cn } from "@/lib/utils";

interface CmsMediaInputProps {
  label: string;
  description?: string;
  required?: boolean;
  value: CmsMedia;
  onChange: (value: CmsMedia) => void;
  onUploadingChange?: (uploading: boolean) => void;
  imagePreviewAspect?: string;
  videoThumbnailPreviewAspect?: string;
  className?: string;
}

/**
 * Shared editor for the CMS media discriminated union. Switching the type
 * clears the previous type's fields so an image and video can never be saved
 * ambiguously in the same record.
 */
export function CmsMediaInput({
  label,
  description,
  required,
  value,
  onChange,
  onUploadingChange,
  imagePreviewAspect = "4/3",
  videoThumbnailPreviewAspect = "16/9",
  className,
}: CmsMediaInputProps) {
  const [activeUploads, setActiveUploads] = useState(0);
  const isUploading = activeUploads > 0;

  const reportUploading = (uploading: boolean) => {
    setActiveUploads((current) => Math.max(0, current + (uploading ? 1 : -1)));
    onUploadingChange?.(uploading);
  };

  const switchType = (type: CmsMedia["type"]) => {
    if (type === value.type) return;
    onChange(
      type === "image"
        ? { type: "image", image: "" }
        : {
            type: "video",
            video: { source: "youtube", value: "" },
          },
    );
  };

  return (
    <div className={cn("space-y-4 rounded-xl border p-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Label>
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </div>
        <div
          role="tablist"
          aria-label={`${label} type`}
          className="bg-muted/60 inline-flex w-fit shrink-0 rounded-lg p-1 text-xs font-medium"
        >
          <button
            type="button"
            role="tab"
            aria-selected={value.type === "image"}
            disabled={isUploading}
            onClick={() => switchType("image")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              value.type === "image"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ImageIcon className="size-3.5" />
            Image
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={value.type === "video"}
            disabled={isUploading}
            onClick={() => switchType("video")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              value.type === "video"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Video className="size-3.5" />
            Video
          </button>
        </div>
      </div>

      {value.type === "image" ? (
        <ImageInput
          label="Image source"
          description="Paste a public URL or upload an image."
          required={required}
          allowRelative
          value={value.image}
          onChange={(image) => onChange({ type: "image", image })}
          onUploadingChange={reportUploading}
          previewAspect={imagePreviewAspect}
        />
      ) : (
        <div className="space-y-5">
          <VideoInput
            label="Video source"
            description="Use YouTube, a direct public video URL, or upload a video file."
            required={required}
            value={value.video.value ? value.video : null}
            onChange={(video) =>
              onChange({
                type: "video",
                video: video ?? {
                  source: value.video.source,
                  value: "",
                },
                ...(value.thumbnail ? { thumbnail: value.thumbnail } : {}),
              })
            }
            onUploadingChange={reportUploading}
          />
          <ImageInput
            label="Video thumbnail"
            description="Optional poster image shown before playback. YouTube can generate one automatically."
            allowRelative
            value={value.thumbnail ?? ""}
            onChange={(thumbnail) =>
              onChange({
                ...value,
                ...(thumbnail ? { thumbnail } : { thumbnail: undefined }),
              })
            }
            onUploadingChange={reportUploading}
            previewAspect={videoThumbnailPreviewAspect}
          />
        </div>
      )}
    </div>
  );
}
