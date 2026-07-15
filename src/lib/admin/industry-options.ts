import {
  getAdminIndustryOptions,
  type IndustrySummary,
} from "@/lib/api/industries";

export interface IndustryOptionsState {
  data: IndustrySummary[];
  error?: string;
}

/** Keeps an Industry options outage distinct from a valid empty collection. */
export async function loadIndustryOptions(): Promise<IndustryOptionsState> {
  try {
    return { data: await getAdminIndustryOptions() };
  } catch {
    return {
      data: [],
      error: "Industries could not be loaded. Refresh the page and try again.",
    };
  }
}
