import { BackendSpecialty, Specialty } from "./specialty.type";

export interface BackendDoctor {
  _id?: string;
  name?: string;
  photo?: string;
  degrees?: string;
  short_description?: string;
  BMDC_REG_NO?: string;
  about?: string;
  email?: string;
  phone?: string;
  isAvailableHome?: boolean;
  field_of_concentration?: any[];
  specializations?: BackendSpecialty[] | string[];
  educations?: string[];
  createdAt?: string;
  updatedAt?: string;
  rating?: number | string;
  totalReviews?: number | string;
  years_of_experience?: number;
  fee?: number;
}

export interface Doctor {
  id: string;
  name: string;
  slug: string;
  photo: string;
  degrees: string[];
  primarySpecialty: string;
  shortDescription: string;
  bmdcRegNo: string;
  about: string;
  email: string;
  phone: string;
  isAvailableHome: boolean;
  specializations: Specialty[];
  educations: string[];
  chamber?: {
    name: string;
    address: string;
    otherLocationsCount?: number;
  };
  chambers: {
    id: string;
    name: string;
    address: string;
    mapUrl?: string;
    availability: string[];
    consultationMethod: string[];
    appointmentTypes: string[];
  }[];
  availability?: string[];
  services?: string[];
  videos?: {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
  }[];
  // Derived UI Fallbacks
  fee: number;
  rating: number;
  reviewCount: number;
  experience: string;
  // Rich schedule data per hospital for the Locations tab
  locationSchedules?: Array<{
    hospitalId: string;
    hospitalName: string;
    hospitalLogo?: string;
    hospitalCover?: string;
    hospitalAddress?: string;
    hospitalPhone?: string;
    hospitalEmail?: string;
    hospitalMapUrl?: string;
    schedules: Array<{
      day: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }>;
  }>;
}
