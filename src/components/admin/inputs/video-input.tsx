"use client";

import { Loader2, Upload, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resolveVideo } from "@/lib/media/video";
import { uploadAdminFile } from "@/lib/admin/upload-client";
import type { VideoRef, VideoSource } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

interface VideoInputProps {
  label: string;
  description?: string;
  required?: boolean;
  value: VideoRef | null;
  onChange: (value: VideoRef | null) => void;
  className?: string;
}

const SOURCE_LABEL: Record<VideoSource, string> = {
  youtube: "YouTube",
  url: "URL",
  upload: "Upload",
};

const SOURCES: VideoSource[] = ["youtube", "url", "upload"];

export function VideoInput({
  label,
  description,
  required,
  value,
  onChange,
  className,
}: VideoInputProps) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const initialSource: VideoSource = value?.source ?? "youtube";
  const [mode, setMode] = useState<VideoSource>(initialSource);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentValue = value?.source === mode ? value.value : "";

  const updateValue = (next: string) => {
    if (!next) {
      onChange(null);
      return;
    }
    onChange({ source: mode, value: next });
  };

  const switchMode = (next: VideoSource) => {
    setMode(next);
    // Clear value when switching modes — different sources hold different things
    if (value && value.source !== next) onChange(null);
  };

  const pickFile = () => fileRef.current?.click();

  const handleUpload = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const uploaded = await uploadAdminFile(file);
      onChange({ source: "upload", value: uploaded.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const preview = resolveVideo(value, undefined);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <div
          role="tablist"
          className="bg-muted/60 inline-flex rounded-md p-0.5 text-xs font-medium"
        >
          {SOURCES.map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={cn(
                "rounded px-2.5 py-1 transition-colors",
                mode === m
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {SOURCE_LABEL[m]}
            </button>
          ))}
        </div>
      </div>

      {description && (
        <p className="text-muted-foreground text-xs">{description}</p>
      )}

      {mode === "youtube" && (
        <Input
          id={id}
          type="url"
          placeholder="https://www.youtube.com/watch?v=…"
          value={currentValue}
          required={required}
          onChange={(e) => updateValue(e.target.value)}
        />
      )}

      {mode === "url" && (
        <Input
          id={id}
          type="url"
          placeholder="https://cdn.example.com/video.mp4"
          value={currentValue}
          required={required}
          onChange={(e) => updateValue(e.target.value)}
        />
      )}

      {mode === "upload" && (
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleUpload(f);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={pickFile}
            disabled={uploading}
            className="gap-1.5"
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {uploading
              ? "Uploading…"
              : currentValue
                ? "Replace video"
                : "Upload video"}
          </Button>
          {currentValue && (
            <span className="text-muted-foreground truncate text-xs">
              {currentValue}
            </span>
          )}
        </div>
      )}

      {error && (
        <p className="text-destructive text-xs font-medium">{error}</p>
      )}

      {preview && (
        <div className="border-border/60 bg-muted/30 relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
          {preview.isYouTube ? (
            <iframe
              src={preview.embedUrl}
              title={`${label} preview`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="h-full w-full"
            />
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              src={preview.embedUrl}
              controls
              className="h-full w-full object-contain bg-black"
            />
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="bg-background/90 hover:bg-background absolute right-2 top-2 rounded-full p-1 shadow"
            aria-label="Clear video"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
