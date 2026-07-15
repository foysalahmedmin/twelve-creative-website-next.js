"use client";

import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IndustrySummary } from "@/lib/api/industries";

interface IndustrySelectProps {
  industries: IndustrySummary[];
  value: string;
  onValueChange: (value: string) => void;
  currentIndustry?: IndustrySummary;
  loadError?: string;
  disabled?: boolean;
  description?: string;
}

/**
 * Required Industry relation picker shared by Industry-owned admin forms.
 * It deliberately never selects the first option automatically.
 */
export function IndustrySelect({
  industries,
  value,
  onValueChange,
  currentIndustry,
  loadError,
  disabled,
  description = "Controls which Industry this content belongs to on the public website.",
}: IndustrySelectProps) {
  const options = currentIndustry
    ? mergeCurrentIndustry(industries, currentIndustry)
    : industries;
  const selected = options.find((industry) => industry._id === value);
  const unavailable = Boolean(loadError) || options.length === 0;

  return (
    <div className="space-y-2">
      <Label htmlFor="industry">
        Industry <span className="text-destructive">*</span>
      </Label>
      <Select
        value={value || undefined}
        onValueChange={onValueChange}
        disabled={disabled || unavailable}
        required
      >
        <SelectTrigger id="industry" aria-invalid={!value}>
          <SelectValue
            placeholder={
              loadError
                ? "Industries unavailable"
                : options.length === 0
                  ? "No industries available"
                  : "Select an industry"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((industry) => (
            <SelectItem key={industry._id} value={industry._id}>
              {industry.name}
              {!industry.is_active ? " (Inactive)" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loadError ? (
        <p className="text-destructive text-xs" role="alert">
          {loadError}
        </p>
      ) : options.length === 0 ? (
        <p className="text-muted-foreground text-xs">
          Create an Industry before adding this content.{" "}
          <Link
            href="/admin/industries/new"
            className="text-primary underline-offset-4 hover:underline"
          >
            Create Industry
          </Link>
        </p>
      ) : selected && !selected.is_active ? (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          This Industry is inactive. Related content remains hidden publicly
          until the Industry is activated.
        </p>
      ) : (
        <p className="text-muted-foreground text-xs">{description}</p>
      )}
    </div>
  );
}

function mergeCurrentIndustry(
  industries: IndustrySummary[],
  currentIndustry: IndustrySummary,
): IndustrySummary[] {
  if (industries.some((industry) => industry._id === currentIndustry._id)) {
    return industries;
  }

  return [...industries, currentIndustry].sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name),
  );
}
