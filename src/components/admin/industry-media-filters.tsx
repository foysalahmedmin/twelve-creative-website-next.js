"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IndustrySummary } from "@/lib/api/industries";

const ALL = "all";

interface IndustryMediaFiltersProps {
  industries: IndustrySummary[];
  showAspect?: boolean;
}

/** URL-backed filters shared by Featured Projects and Showcase Videos. */
export function IndustryMediaFilters({
  industries,
  showAspect = true,
}: IndustryMediaFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedIndustry = searchParams.get("industry");
  const selectedIndustry = industries.some(
    (industry) => industry._id === requestedIndustry,
  )
    ? requestedIndustry!
    : ALL;

  const update = (key: "industry" | "aspect", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
      <Select
        value={selectedIndustry}
        onValueChange={(value) => update("industry", value)}
        disabled={industries.length === 0}
      >
        <SelectTrigger
          className="w-full sm:w-52"
          aria-label="Filter by Industry"
        >
          <SelectValue
            placeholder={
              industries.length === 0 ? "No industries" : "All industries"
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All industries</SelectItem>
          {industries.map((industry) => (
            <SelectItem key={industry._id} value={industry._id}>
              {industry.name}
              {!industry.is_active ? " (Inactive)" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showAspect ? (
        <Select
          value={searchParams.get("aspect") ?? ALL}
          onValueChange={(value) => update("aspect", value)}
        >
          <SelectTrigger
            className="w-full sm:w-44"
            aria-label="Filter by aspect"
          >
            <SelectValue placeholder="All aspects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All aspects</SelectItem>
            <SelectItem value="reel">Reel (9:16)</SelectItem>
            <SelectItem value="landscape">Landscape (16:9)</SelectItem>
          </SelectContent>
        </Select>
      ) : null}
    </div>
  );
}
