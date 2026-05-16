import api from "@/lib/api";
import { ApiResponse } from "@/types/api.type";

export interface BackendDoctorSchedule {
  _id: string;
  doctor: any;
  hospital: {
    _id: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    logo?: string;
    cover?: string;
    photo?: string;
    mapUrl?: string;
  };
  schedules: Array<{
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
  consultationFee?: number;
  followUpFee?: number;
  status: "Active" | "Inactive";
}

export const doctorScheduleService = {
  /**
   * Fetch all schedules for a specific doctor
   */
  getByDoctorId: async (doctorId: string) => {
    const { data: response } = await api.get<ApiResponse<BackendDoctorSchedule[]>>(
      `/doctor-schedules/doctor/${doctorId}`
    );
    return {
      data: response.data || [],
      meta: response.meta
    };
  },

  /**
   * Fetch all schedules (filters can be applied)
   */
  getAll: async (params?: Record<string, any>) => {
    const { data: response } = await api.get<ApiResponse<BackendDoctorSchedule[]>>(
      "/doctor-schedules",
      { params }
    );
    return {
      data: response.data || [],
      meta: response.meta
    };
  }
};
