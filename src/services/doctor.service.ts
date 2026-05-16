import api from "@/lib/api";
import { API } from "@/config/api";
import { ApiResponse, ApiMeta } from "@/types/api.type";
import { BackendDoctor, Doctor } from "@/types/doctor.type";
import { BackendSpecialty, Specialty } from "@/types/specialty.type";
import { doctorAdapter, doctorsAdapter } from "@/adapters/doctor.adapter";
import { specialtiesAdapter } from "@/adapters/specialty.adapter";

export const doctorService = {
  /**
   * Fetch all doctors with pagination and filters
   */
  getAll: async (params?: Record<string, unknown>): Promise<{ data: Doctor[], meta?: ApiMeta }> => {
    const { data: response } = await api.get<ApiResponse<BackendDoctor[]>>(
      API.ENDPOINTS.DOCTORS.LIST, 
      { params }
    );
    
    return {
      data: doctorsAdapter(response.data || []),
      meta: response.meta
    };
  },

  /**
   * Fetch a single doctor detail by ID or Slug
   * Note: Replace with proper slug resolution if backend supports slugs for doctors
   */
  getById: async (id: string): Promise<Doctor> => {
    const { data: response } = await api.get<ApiResponse<BackendDoctor>>(
      API.ENDPOINTS.DOCTORS.DETAILS(id)
    );
    
    if (!response.data) throw new Error("Doctor not found");
    
    return doctorAdapter(response.data);
  },

  /**
   * Fetch all Specializations
   */
  getSpecializations: async (): Promise<{ data: Specialty[], meta?: ApiMeta }> => {
    const { data: response } = await api.get<ApiResponse<BackendSpecialty[]>>(
      API.ENDPOINTS.DOCTORS.SPECIALIZATIONS
    );
    
    return {
      data: specialtiesAdapter(response.data || []),
      meta: response.meta
    };
  }
};
