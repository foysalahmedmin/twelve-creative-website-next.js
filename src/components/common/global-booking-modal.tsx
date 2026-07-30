"use client";

import { BookingModal } from "@/components/common/booking-modal";
import type { PublicIndustryOption } from "@/lib/api/industries";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeBookingModal } from "@/redux/slices/booking-modal-slice";

interface GlobalBookingModalProps {
  industries?: PublicIndustryOption[];
}

// Single, app-wide BookingModal instance. Any "Start a Conversation" CTA
// dispatches openBookingModal() rather than rendering its own modal, so only
// one instance ever mounts (see isStartConversationCta in ./booking-modal).
export function GlobalBookingModal({
  industries = [],
}: GlobalBookingModalProps) {
  const isOpen = useAppSelector((state) => state.bookingModal.isOpen);
  const dispatch = useAppDispatch();

  return (
    <BookingModal
      isOpen={isOpen}
      onClose={() => dispatch(closeBookingModal())}
      industries={industries}
    />
  );
}
