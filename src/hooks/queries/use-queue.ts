import { useQuery } from "@tanstack/react-query";
import { queueService } from "@/services/queue.service";

// Query Key Factory for central cache invalidation
export const queueKeys = {
  all: ["queues"] as const,
  byDoctor: (doctorId: string, hospitalId?: string) =>
    [...queueKeys.all, "doctor", doctorId, ...(hospitalId ? [hospitalId] : [])] as const,
  byHospital: (hospitalId: string) => [...queueKeys.all, "hospital", hospitalId] as const,
};

export const useLiveQueueForDoctor = (doctorId: string, hospitalId?: string) => {
  return useQuery({
    queryKey: queueKeys.byDoctor(doctorId, hospitalId),
    queryFn: () => queueService.getLiveQueueForDoctor(doctorId, hospitalId),
    enabled: !!doctorId,
    refetchInterval: 30000,
    staleTime: 10000,
    retry: false,
  });
};

export const useLiveQueueForHospital = (hospitalId: string) => {
  return useQuery({
    queryKey: queueKeys.byHospital(hospitalId),
    queryFn: () => queueService.getLiveQueueForHospital(hospitalId),
    enabled: !!hospitalId,
    refetchInterval: 30000,
    retry: false,
  });
};
