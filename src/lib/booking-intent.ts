import { CONSTANT } from "@/config/constant";

export const INTENT_TTL_MS = 30 * 60 * 1000;

export type AppointmentIntent = {
  source: "booking-drawer";
  doctorSlug: string;
  doctorId: string;
  serviceType: "clinic" | "home";
  step: number;
  selectedChamberId: string;
  selectedConsultation: string;
  selectedAppointmentType: string;
  selectedDateIdx: number;
  selectedSlot: string;
  homeSelectedDateIdx: number | null;
  savedAt: number;
};

export type AmbulanceIntent = {
  source: "ambulance-form";
  from: string;
  to: string;
  ambulanceType: string;
  date: string;
  phone: string;
  roundTrip: boolean;
  savedAt: number;
};

export type GuideIntent = {
  source: "guide-form";
  city: string;
  hospital: string;
  age: string;
  description: string;
  savedAt: number;
};

export type DiagnosticIntent = {
  source: "diagnostic-form";
  testId: string;
  labId: string;
  address: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  savedAt: number;
};

export type BookingIntent =
  | AppointmentIntent
  | AmbulanceIntent
  | GuideIntent
  | DiagnosticIntent;

export function saveIntent(intent: BookingIntent): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    "booking_intent",
    JSON.stringify(intent),
  );
}

export function readIntent(): BookingIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("booking_intent");
    if (!raw) return null;
    const intent = JSON.parse(raw) as BookingIntent;
    if (Date.now() - intent.savedAt > INTENT_TTL_MS) {
      clearIntent();
      return null;
    }
    return intent;
  } catch {
    return null;
  }
}

export function clearIntent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("booking_intent");
}
