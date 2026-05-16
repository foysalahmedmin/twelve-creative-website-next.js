import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { guideService } from "@/services/guide.service";
import { TCreateGuideBookingPayload } from "@/types/guide.type";
import { toast } from "sonner";

export const guideKeys = {
  all: ["guide-bookings"] as const,
  my: () => [...guideKeys.all, "my"] as const,
};

export const useMyGuideBookings = () => {
  return useQuery({
    queryKey: guideKeys.my(),
    queryFn: () => guideService.getMyBookings(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateGuideBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TCreateGuideBookingPayload) => guideService.create(payload),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: guideKeys.my() });
        toast.success("Hospital assistant requested successfully!");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to request assistant.");
    },
  });
};

export const useCancelGuideBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => guideService.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guideKeys.my() });
      toast.success("Hospital guide request cancelled");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to cancel request");
    },
  });
};
