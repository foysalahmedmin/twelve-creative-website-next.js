import api from "@/lib/api";
import { API } from "@/config/api";
import { ApiResponse } from "@/types/api.type";
import { BackendGuideBooking, TCreateGuideBookingPayload } from "@/types/guide.type";
import { adaptGuideBooking } from "@/adapters/guide.adapter";

export const guideService = {
  create: async (payload: TCreateGuideBookingPayload) => {
    const { data } = await api.post<ApiResponse<BackendGuideBooking>>(
      API.ENDPOINTS.GUIDES.BOOK, 
      payload
    );
    return data;
  },

  getMyBookings: async () => {
    const { data: response } = await api.get<ApiResponse<BackendGuideBooking[]>>(
      API.ENDPOINTS.GUIDES.MY_BOOKINGS
    );

    if (response.success && Array.isArray(response.data)) {
      return response.data.map(adaptGuideBooking);
    }
    return [];
  },

  cancelBooking: async (id: string): Promise<void> => {
    await api.patch(`/guide-bookings/${id}/status`, { status: "Cancelled" });
  },
};
