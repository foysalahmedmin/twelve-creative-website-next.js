"use client";

import { Loader2, Upload, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadAdminFile } from "@/lib/admin/upload-client";
import { cn } from "@/lib/utils";

type Mode = "url" | "upload";

interface ImageInputProps {
  /** Field label shown above the control. */
  label: string;
  /** Optional helper text shown under the label. */
  description?: string;
  /** Whether the field is required (visual asterisk + browser validation hint). */
  required?: boolean;
  /** Current value — a URL string. */
  value: string;
  /** Called when the URL changes (typed, uploaded, or cleared). */
  onChange: (value: string) => void;
  /** Aspect ratio hint for the preview frame, e.g. "1/1", "16/9". Defaults to 1/1. */
  previewAspect?: string;
  /** Hidden input name — used by native form submission if needed. */
  name?: string;
  className?: string;
}

/**
 * Soft-warn when uploaded image differs significantly from the recommended
 * aspect ratio. Tolerance defaults to 15%. Pass `expectedRatio` as a number
 * (e.g. 1 for square, 16/9 for landscape, 9/16 for portrait) to enable.
 */
function checkAspectRatio(
  file: File,
  expectedRatio: number,
  tolerance = 0.15,
): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const actual = img.naturalWidth / img.naturalHeight;
      const diff = Math.abs(actual - expectedRatio) / expectedRatio;
      if (diff > tolerance) {
        resolve(
          `Image is ${img.naturalWidth}×${img.naturalHeight}. Recommended ratio is ${expectedRatio.toFixed(2)}:1; current is ${actual.toFixed(2)}:1.`,
        );
      } else {
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };
    img.src = objectUrl;
  });
}

function parseAspect(aspect: string): number | null {
  const parts = aspect.split("/").map((s) => Number(s.trim()));
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return parts[0] / parts[1];
}

export function ImageInput({
  label,
  description,
  required,
  value,
  onChange,
  previewAspect = "1/1",
  name,
  className,
}: ImageInputProps) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>(value ? "url" : "url");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const pickFile = () => fileRef.current?.click();

  const handleUpload = async (file: File) => {
    setError(null);
    setWarning(null);
    setUploading(true);
    try {
      const expected = parseAspect(previewAspect);
      if (expected) {
        const aspectWarning = await checkAspectRatio(file, expected);
        if (aspectWarning) setWarning(aspectWarning);
      }
      const uploaded = await uploadAdminFile(file);
      onChange(uploaded.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

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
          {(["url", "upload"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded px-2.5 py-1 capitalize transition-colors",
                mode === m
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {description && (
        <p className="text-muted-foreground text-xs">{description}</p>
      )}

      {mode === "url" && (
        <Input
          id={id}
          name={name}
          type="url"
          placeholder="https://…"
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {mode === "upload" && (
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
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
            {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </Button>
          {value && (
            <span className="text-muted-foreground truncate text-xs">
              {value}
            </span>
          )}
        </div>
      )}

      {error && (
        <p className="text-destructive text-xs font-medium">{error}</p>
      )}

      {warning && !error && (
        <p className="border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400 rounded-md border px-2.5 py-1.5 text-xs font-medium">
          ⚠ {warning} The image will still upload — crop/resize for a tighter fit if needed.
        </p>
      )}

      {value && (
        <div
          className="border-border/60 bg-muted/30 relative w-full max-w-xs overflow-hidden rounded-lg border"
          style={{ aspectRatio: previewAspect }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={`${label} preview`}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="bg-background/90 hover:bg-background absolute right-2 top-2 rounded-full p-1 shadow"
            aria-label="Clear image"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
