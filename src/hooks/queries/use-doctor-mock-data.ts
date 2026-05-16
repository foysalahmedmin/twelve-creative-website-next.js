import { useQuery } from "@tanstack/react-query";
import {
  MOCK_REVIEWS,
  MOCK_FAQS,
  MOCK_AWARDS,
  MOCK_STATS,
  MOCK_CONDITIONS,
  MOCK_INSURANCES,
} from "@/data/mock-doctor";

export const doctorMockKeys = {
  reviews: (doctorId: string) => ["doctor-reviews", doctorId] as const,
  faqs: (doctorId: string) => ["doctor-faqs", doctorId] as const,
  awards: (doctorId: string) => ["doctor-awards", doctorId] as const,
  stats: (doctorId: string) => ["doctor-stats", doctorId] as const,
  conditions: (doctorId: string) => ["doctor-conditions", doctorId] as const,
  insurances: (doctorId: string) => ["doctor-insurances", doctorId] as const,
};

export const useDoctorReviews = (doctorId: string) =>
  useQuery({
    queryKey: doctorMockKeys.reviews(doctorId),
    queryFn: async () => MOCK_REVIEWS,
    staleTime: 10 * 60 * 1000,
    enabled: !!doctorId,
  });

export const useDoctorFaqs = (doctorId: string) =>
  useQuery({
    queryKey: doctorMockKeys.faqs(doctorId),
    queryFn: async () => MOCK_FAQS,
    staleTime: 10 * 60 * 1000,
    enabled: !!doctorId,
  });

export const useDoctorAwards = (doctorId: string) =>
  useQuery({
    queryKey: doctorMockKeys.awards(doctorId),
    queryFn: async () => MOCK_AWARDS,
    staleTime: 10 * 60 * 1000,
    enabled: !!doctorId,
  });

export const useDoctorStats = (doctorId: string) =>
  useQuery({
    queryKey: doctorMockKeys.stats(doctorId),
    queryFn: async () => MOCK_STATS,
    staleTime: 10 * 60 * 1000,
    enabled: !!doctorId,
  });

export const useDoctorConditions = (doctorId: string) =>
  useQuery({
    queryKey: doctorMockKeys.conditions(doctorId),
    queryFn: async () => MOCK_CONDITIONS,
    staleTime: 10 * 60 * 1000,
    enabled: !!doctorId,
  });

export const useDoctorInsurances = (doctorId: string) =>
  useQuery({
    queryKey: doctorMockKeys.insurances(doctorId),
    queryFn: async () => MOCK_INSURANCES,
    staleTime: 10 * 60 * 1000,
    enabled: !!doctorId,
  });
