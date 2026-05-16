import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { hospitalService } from "@/services/hospital.service";

/**
 * Unique Query Keys for Hospital Module
 * Centralizing keys helps in invalidation and caching strategy
 */
export const hospitalKeys = {
  all: ["hospitals"] as const,
  lists: () => [...hospitalKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...hospitalKeys.lists(), { filters }] as const,
  details: (slug: string) => [...hospitalKeys.all, "detail", slug] as const,
};

/**
 * Hook for fetching multiple hospitals
 */
export const useHospitals = (filters: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: hospitalKeys.list(filters),
    queryFn: () => hospitalService.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

/**
 * Hook for fetching a single hospital's details
 */
export const useHospitalDetails = (slug: string) => {
  return useQuery({
    queryKey: hospitalKeys.details(slug),
    queryFn: () => hospitalService.getBySlug(slug),
    enabled: !!slug, // Only fetch if slug is present
    staleTime: 10 * 60 * 1000,
  });
};
