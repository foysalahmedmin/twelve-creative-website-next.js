import api from "@/lib/api";
import { ApiResponse } from "@/types/api.type";
import { BackendLiveQueue } from "@/types/queue.type";
import { adaptLiveQueue } from "@/adapters/queue.adapter";

export const queueService = {
  getLiveQueueForDoctor: async (doctorId: string, hospitalId?: string) => {
    try {
      const { data: response } = await api.get<ApiResponse<BackendLiveQueue>>(
        `/doctor-live-queues/doctor/${doctorId}`,
        { params: hospitalId ? { hospitalId } : undefined }
      );
      if (response.success && response.data) {
        return adaptLiveQueue(response.data);
      }
      return null;
    } catch {
      return null;
    }
  },

  getLiveQueueForHospital: async (hospitalId: string) => {
    try {
      const { data: response } = await api.get<ApiResponse<BackendLiveQueue[]>>(`/doctor-live-queues/hospital/${hospitalId}`);
      if (response.success && Array.isArray(response.data)) {
        return response.data.map(adaptLiveQueue);
      }
      return [];
    } catch {
      return [];
    }
  }
};
