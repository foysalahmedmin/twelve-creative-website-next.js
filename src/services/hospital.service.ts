import api from "@/lib/api";
import { API } from "@/config/api";
import { ApiResponse, ApiMeta } from "@/types/api.type";
import { BackendHospital, Hospital } from "@/types/hospital.type";
import { hospitalAdapter, hospitalsAdapter } from "@/adapters/hospital.adapter";

export const hospitalService = {
  /**
   * Fetch all hospitals with robust transformation and pagination support
   */
  getAll: async (params?: Record<string, unknown>): Promise<{ data: Hospital[], meta?: ApiMeta }> => {
    const { data: response } = await api.get<ApiResponse<BackendHospital[]>>(
      API.ENDPOINTS.HOSPITALS.LIST, 
      { params }
    );
    
    // Validating data before transformation to avoid runtime crashes
    return {
      data: hospitalsAdapter(response.data || []),
      meta: response.meta
    };
  },

  /**
   * Fetch a single hospital detail by slug
   */
  getBySlug: async (slug: string): Promise<Hospital> => {
    const { data: response } = await api.get<ApiResponse<BackendHospital>>(
      API.ENDPOINTS.HOSPITALS.DETAILS(slug)
    );
    
    // Ensure response data exists before adapting
    if (!response.data) {
      throw new Error(`Hospital with slug ${slug} not found`);
    }
    
    return hospitalAdapter(response.data);
  }
};
