/**
 * Booking section + modal defaults.
 *
 * These are the strings the section and modal used to hardcode. They stay here
 * as the fallback so the page renders identically if the API is unreachable or
 * the booking setting was never seeded.
 */

export type TBookingStep = {
  title: string;
  description: string;
};

export type TBookingSlot = {
  label: string;
  range: string;
  is_active?: boolean;
};

export type TBookingContent = {
  label: string;
  title: string;
  steps: TBookingStep[];
  card_title: string;
  card_description: string;
  benefits: string[];
  cta_label: string;
  footnote: string;
};

export type TBookingQuestions = {
  sector_title: string;
  schedule_title: string;
  schedule_subtitle: string;
  details_title: string;
};

export type TBookingAvailability = {
  slots: TBookingSlot[];
  /** 0 = Sunday … 6 = Saturday, matching Date.prototype.getDay(). */
  available_weekdays: number[];
  min_lead_days: number;
  max_advance_days: number;
};

export type TBookingData = {
  content: TBookingContent;
  questions: TBookingQuestions;
  availability: TBookingAvailability;
};

export const BOOKING_DATA: TBookingData = {
  content: {
    label: "4-Step Booking",
    title: "A quick path from interest to conversation.",
    steps: [
      { title: "Sector", description: "Tell us what industry you operate in." },
      { title: "Timeline", description: "Pick when you're looking to start." },
      {
        title: "Date & Time",
        description: "Choose a date and preferred slot.",
      },
      {
        title: "Your Details",
        description: "Quick contact info and we're set.",
      },
    ],
    card_title: "Book a 30-minute call.",
    card_description:
      "Skip the form. Pick a sector, share your timeline and a preferred slot — we’ll reach out within 24 hours.",
    benefits: [
      "30-minute strategic conversation",
      "No commitment, no pitch deck",
      "Response within 24 hours",
    ],
    cta_label: "Start Booking",
    footnote: "Or send a detailed inquiry using the form above.",
  },
  questions: {
    sector_title: "Which sector are we discussing?",
    schedule_title: "Pick a date & preferred time.",
    schedule_subtitle: "We'll reach out around your selected time slot.",
    details_title: "Great! Now let us know who you are.",
  },
  availability: {
    slots: [
      { label: "Morning", range: "9:00 AM – 12:00 PM", is_active: true },
      { label: "Afternoon", range: "12:00 PM – 4:00 PM", is_active: true },
      { label: "Evening", range: "4:00 PM – 7:00 PM", is_active: true },
      { label: "Flexible", range: "Any time works", is_active: true },
    ],
    available_weekdays: [1, 2, 3, 4, 5],
    min_lead_days: 1,
    max_advance_days: 60,
  },
};

export const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
