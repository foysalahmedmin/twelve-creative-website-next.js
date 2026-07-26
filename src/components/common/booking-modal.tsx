"use client";

import { LogoIcon } from "@/components/icons/logo-icon";
import { submitBookingAction } from "@/lib/api/bookings-actions";
import type { PublicIndustryOption } from "@/lib/api/industries";
import { localDateInputValue } from "@/lib/local-date";
import { cn } from "@/lib/utils";
import {
  ArrowLeft01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const TIME_SLOTS = [
  { label: "Morning", range: "9:00 AM – 12:00 PM" },
  { label: "Afternoon", range: "12:00 PM – 4:00 PM" },
  { label: "Evening", range: "4:00 PM – 7:00 PM" },
  { label: "Flexible", range: "Any time works" },
];

const TOTAL_STEPS = 3;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  industries?: PublicIndustryOption[];
}

export function BookingModal({
  isOpen,
  onClose,
  industries = [],
}: BookingModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [redirectIn, setRedirectIn] = useState(3);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const [formData, setFormData] = useState({
    industryId: "",
    industryName: "",
    preferredDate: "",
    preferredTime: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
  });

  // Keep latest onClose without restarting the countdown on parent re-render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current =
        document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      window.requestAnimationFrame(() => dialogRef.current?.focus());
    } else {
      document.body.style.overflow = "";
      previouslyFocusedRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep(1);
        setFormData({
          industryId: "",
          industryName: "",
          preferredDate: "",
          preferredTime: "",
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          company: "",
        });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) {
        e.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (!dialogRef.current.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (
        e.shiftKey &&
        (active === first || active === dialogRef.current)
      ) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, isOpen]);

  // On success, count down then hand off to the confirmation page. Gated on
  // isOpen so closing the modal mid-countdown cancels the pending redirect.
  useEffect(() => {
    if (!isOpen || step !== 4) return;
    let n = 3;
    const id = setInterval(() => {
      n -= 1;
      setRedirectIn(n);
      if (n <= 0) {
        clearInterval(id);
        onCloseRef.current();
        router.push("/booking/confirm");
      }
    }, 1000);
    return () => clearInterval(id);
  }, [isOpen, step, router]);

  const handleMarketSelect = (industry: PublicIndustryOption | null) => {
    setFormData((d) => ({
      ...d,
      industryId: industry?._id ?? "",
      industryName: industry?.name ?? "Other",
    }));
    setStep(2);
  };

  const handleDateTime = () => {
    if (!formData.preferredDate || !formData.preferredTime) return;
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const res = await submitBookingAction({
      name: fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      company: formData.company || undefined,
      industry_id: formData.industryId || undefined,
      industry_name_snapshot: formData.industryName || undefined,
      preferred_date: formData.preferredDate || undefined,
      preferred_time: formData.preferredTime || undefined,
    });
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error ?? "Could not submit your booking.");
      return;
    }
    setRedirectIn(3);
    setStep(4);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            tabIndex={-1}
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="bg-card border-border relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border shadow-sm sm:max-h-[calc(100dvh-2rem)]"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                {step > 1 && step < 4 && (
                  <button
                    type="button"
                    aria-label="Go to previous booking step"
                    onClick={() => setStep(step - 1)}
                    className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
                  </button>
                )}
                <LogoIcon className="h-8 w-auto" />
              </div>
              <button
                type="button"
                aria-label="Close booking dialog"
                onClick={onClose}
                className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="relative min-h-0 overflow-y-auto px-6 pb-8">
              <AnimatePresence mode="wait">
                {/* ── STEP 1: Industry ── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5">
                      <span className="bg-primary text-primary-foreground inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold">
                        1
                      </span>
                      <h2
                        id="booking-modal-title"
                        className="font-heading text-foreground text-2xl font-black tracking-tight"
                      >
                        Which sector are we discussing?
                      </h2>
                    </div>
                    <div className="grid gap-2.5">
                      {[
                        ...industries.map((industry) => ({
                          key: industry._id,
                          label: industry.name,
                          industry,
                        })),
                        { key: "other", label: "Other", industry: null },
                      ].map((option, idx) => (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => handleMarketSelect(option.industry)}
                          className="group border-border hover:border-primary/40 hover:bg-primary/8 flex items-center gap-3.5 rounded-2xl border bg-transparent p-3.5 text-left transition-all"
                        >
                          <span className="group-hover:border-primary group-hover:bg-primary border-border bg-muted text-muted-foreground group-hover:text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-foreground/80 group-hover:text-foreground text-sm font-medium">
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: Date & Time ── */}
                {step === 2 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5">
                      <span className="bg-primary text-primary-foreground inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold">
                        2
                      </span>
                      <h2
                        id="booking-modal-title"
                        className="font-heading text-foreground text-2xl font-black tracking-tight"
                      >
                        Pick a date &amp; preferred time.
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        We&apos;ll reach out around your selected time slot.
                      </p>
                    </div>

                    {/* Date picker */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="booking-preferred-date"
                        className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                      >
                        Preferred Date
                      </label>
                      <input
                        id="booking-preferred-date"
                        type="date"
                        value={formData.preferredDate}
                        min={localDateInputValue()}
                        onChange={(e) =>
                          setFormData((d) => ({
                            ...d,
                            preferredDate: e.target.value,
                          }))
                        }
                        className="border-border bg-muted/50 text-foreground focus:border-primary w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none"
                      />
                    </div>

                    {/* Time slots */}
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Preferred Time
                      </p>
                      <div className="grid grid-cols-2 gap-2.5">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot.label}
                            type="button"
                            aria-pressed={formData.preferredTime === slot.label}
                            onClick={() =>
                              setFormData((d) => ({
                                ...d,
                                preferredTime: slot.label,
                              }))
                            }
                            className={cn(
                              "flex flex-col items-start rounded-2xl border px-4 py-3 text-left transition-all",
                              formData.preferredTime === slot.label
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/40 hover:bg-primary/8",
                            )}
                          >
                            <span
                              className={cn(
                                "text-sm font-semibold",
                                formData.preferredTime === slot.label
                                  ? "text-primary"
                                  : "text-foreground",
                              )}
                            >
                              {slot.label}
                            </span>
                            <span className="text-muted-foreground mt-0.5 text-xs">
                              {slot.range}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDateTime}
                      disabled={
                        !formData.preferredDate || !formData.preferredTime
                      }
                      className="bg-primary hover:bg-primary/90 text-primary-foreground mt-1 w-full rounded-lg py-4 text-sm font-bold tracking-wider uppercase transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continue →
                    </button>
                  </motion.div>
                )}
                {/* ── STEP 3: Contact Info ── */}
                {step === 3 && (
                  <motion.div
                    key="step3b"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5">
                      <span className="bg-primary text-primary-foreground inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold">
                        3
                      </span>
                      <h2
                        id="booking-modal-title"
                        className="font-heading text-foreground text-2xl font-black tracking-tight"
                      >
                        Great! Now let us know who you are.
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                      <div className="grid grid-cols-2 gap-3">
                        {(["firstName", "lastName"] as const).map((field) => (
                          <div key={field} className="space-y-1.5">
                            <label
                              htmlFor={`booking-${field}`}
                              className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                            >
                              {field === "firstName"
                                ? "First name"
                                : "Last name"}
                            </label>
                            <input
                              id={`booking-${field}`}
                              required
                              type="text"
                              name={field}
                              value={formData[field]}
                              onChange={(e) =>
                                setFormData((d) => ({
                                  ...d,
                                  [field]: e.target.value,
                                }))
                              }
                              placeholder={
                                field === "firstName" ? "Jane" : "Smith"
                              }
                              className="border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>

                      {[
                        {
                          field: "phone" as const,
                          label: "Phone number",
                          type: "tel",
                          placeholder: "+1 (555) 000-0000",
                        },
                        {
                          field: "email" as const,
                          label: "Email",
                          type: "email",
                          placeholder: "jane@example.com",
                        },
                        {
                          field: "company" as const,
                          label: "Company (Optional)",
                          type: "text",
                          placeholder: "Acme Corporation",
                        },
                      ].map(({ field, label, type, placeholder }) => (
                        <div key={field} className="space-y-1.5">
                          <label
                            htmlFor={`booking-${field}`}
                            className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                          >
                            {label}
                          </label>
                          <input
                            id={`booking-${field}`}
                            required={field !== "company"}
                            type={type}
                            name={field}
                            value={formData[field]}
                            onChange={(e) =>
                              setFormData((d) => ({
                                ...d,
                                [field]: e.target.value,
                              }))
                            }
                            placeholder={placeholder}
                            className="border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none"
                          />
                        </div>
                      ))}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground mt-2 w-full rounded-lg py-4 text-sm font-bold tracking-wider uppercase transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? "Submitting…" : "Submit →"}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* ── STEP 4: Success ── */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="flex flex-col items-center justify-center space-y-5 py-12 text-center"
                  >
                    <div className="relative">
                      <div className="bg-primary absolute inset-0 rounded-full opacity-20 blur-2xl" />
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        className="text-primary relative z-10 h-24 w-24"
                      />
                    </div>
                    <div className="space-y-2">
                      <h2
                        id="booking-modal-title"
                        className="font-heading text-foreground text-3xl font-black tracking-tight"
                      >
                        Booking received!
                      </h2>
                      <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                        Taking you to your confirmation…
                      </p>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Redirecting in{" "}
                      <span className="text-primary font-bold tabular-nums">
                        {redirectIn}
                      </span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress bar at bottom */}
            {step < 4 && (
              <div className="bg-muted h-1 w-full">
                <motion.div
                  className="bg-primary h-full"
                  initial={false}
                  animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
