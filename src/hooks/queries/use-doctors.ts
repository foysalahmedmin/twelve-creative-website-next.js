import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { doctorService } from "@/services/doctor.service";

/**
 * Unique Query Keys for Doctor Module
 */
export const doctorKeys = {
  all: ["doctors"] as const,
  lists: () => [...doctorKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...doctorKeys.lists(), { filters }] as const,
  details: (id: string) => [...doctorKeys.all, "detail", id] as const,
};

/**
 * Hook for fetching multiple doctors with filters and pagination
 */
export const useDoctors = (filters: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: doctorKeys.list(filters),
    queryFn: () => doctorService.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

/**
 * Hook for fetching a single doctor's details
 */
export const useDoctorDetails = (id: string) => {
  return useQuery({
    queryKey: doctorKeys.details(id),
    queryFn: () => doctorService.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};
