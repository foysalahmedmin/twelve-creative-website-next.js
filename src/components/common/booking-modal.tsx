"use client";

import { LogoIcon } from "@/components/icons/logo-icon";
import { cn } from "@/lib/utils";
import {
  ArrowLeft01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const MARKETS = [
  "Hospitality (Restaurants, Hotels, Nightlife)",
  "Real Estate (Developers, Projects, Brokerages)",
  "Aviation (Charter, Maintenance, Sales)",
  "Professional Services (Legal, Medical, Consulting)",
  "SaaS & Technology",
  "Other",
];

const EXPECTED_DATES = [
  "As soon as possible",
  "Within 2 weeks",
  "This month",
  "Next 1–3 months",
  "Just exploring for now",
];

const TIME_SLOTS = [
  { label: "Morning", range: "9:00 AM – 12:00 PM" },
  { label: "Afternoon", range: "12:00 PM – 4:00 PM" },
  { label: "Evening", range: "4:00 PM – 7:00 PM" },
  { label: "Flexible", range: "Any time works" },
];

const TOTAL_STEPS = 4;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    market: "",
    expectedDate: "",
    preferredDate: "",
    preferredTime: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
  });

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
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
          market: "",
          expectedDate: "",
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
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleMarketSelect = (market: string) => {
    setFormData((d) => ({ ...d, market }));
    setStep(2);
  };

  const handleTimelineSelect = (date: string) => {
    setFormData((d) => ({ ...d, expectedDate: date }));
    setStep(3);
  };

  const handleDateTime = () => {
    if (!formData.preferredDate || !formData.preferredTime) return;
    setStep(4);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No API — just go to success step
    setStep(5);
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
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="bg-card ring-foreground/8 relative w-full max-w-lg overflow-hidden rounded-[28px] shadow-2xl ring-1"
          >
            {/* Ambient glows */}
            <div className="bg-primary/15 pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full blur-[80px]" />
            <div className="bg-primary/8 pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full blur-[80px]" />

            {/* Header */}
            <div className="relative flex items-center justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                {step > 1 && step < 4 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="text-muted-foreground hover:bg-muted flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:text-foreground"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
                  </button>
                )}
                <LogoIcon className="h-8 w-auto" />
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:bg-muted flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:text-foreground"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="relative px-6 pb-8">
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
                      <span className="bg-primary inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground">
                        1
                      </span>
                      <h2 className="font-heading text-foreground text-2xl font-semibold">
                        Which sector are we discussing?
                      </h2>
                    </div>
                    <div className="grid gap-2.5">
                      {MARKETS.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleMarketSelect(option)}
                          className="group border-border hover:border-primary/40 hover:bg-primary/8 flex items-center gap-3.5 rounded-2xl border bg-transparent p-3.5 text-left transition-all"
                        >
                          <span className="group-hover:border-primary group-hover:bg-primary border-border bg-muted text-muted-foreground group-hover:text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-foreground/80 group-hover:text-foreground text-sm font-medium">
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: Expected Date ── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5">
                      <span className="bg-primary inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground">
                        2
                      </span>
                      <h2 className="font-heading text-foreground text-2xl font-semibold">
                        When are you looking to get started?
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Select your expected timeline so we can plan accordingly.
                      </p>
                    </div>
                    <div className="grid gap-2.5">
                      {EXPECTED_DATES.map((date, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleTimelineSelect(date)}
                          className={cn(
                            "group flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all",
                            formData.expectedDate === date
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border hover:border-primary/40 hover:bg-primary/8",
                          )}
                        >
                          <span className="group-hover:border-primary group-hover:bg-primary border-border bg-muted text-muted-foreground group-hover:text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-foreground/80 group-hover:text-foreground text-sm font-medium">
                            {date}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3: Date & Time ── */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5">
                      <span className="bg-primary inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground">
                        3
                      </span>
                      <h2 className="font-heading text-foreground text-2xl font-semibold">
                        Pick a date &amp; preferred time.
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        We&apos;ll reach out around your selected time slot.
                      </p>
                    </div>

                    {/* Date picker */}
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                          setFormData((d) => ({ ...d, preferredDate: e.target.value }))
                        }
                        className="border-border bg-muted/50 text-foreground focus:border-primary w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:outline-none"
                      />
                    </div>

                    {/* Time slots */}
                    <div className="space-y-2">
                      <label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                        Preferred Time
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot.label}
                            type="button"
                            onClick={() =>
                              setFormData((d) => ({ ...d, preferredTime: slot.label }))
                            }
                            className={cn(
                              "flex flex-col items-start rounded-2xl border px-4 py-3 text-left transition-all",
                              formData.preferredTime === slot.label
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/40 hover:bg-primary/8",
                            )}
                          >
                            <span className={cn(
                              "text-sm font-semibold",
                              formData.preferredTime === slot.label ? "text-primary" : "text-foreground",
                            )}>
                              {slot.label}
                            </span>
                            <span className="text-muted-foreground text-xs mt-0.5">{slot.range}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDateTime}
                      disabled={!formData.preferredDate || !formData.preferredTime}
                      className="bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed mt-1 w-full rounded-2xl py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all active:scale-[0.98]"
                    >
                      Continue →
                    </button>
                  </motion.div>
                )}
                {/* ── STEP 4: Contact Info ── */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5">
                      <span className="bg-primary inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground">
                        4
                      </span>
                      <h2 className="font-heading text-foreground text-2xl font-semibold">
                        Great! Now let us know who you are.
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                      <div className="grid grid-cols-2 gap-3">
                        {(["firstName", "lastName"] as const).map((field) => (
                          <div key={field} className="space-y-1.5">
                            <label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                              {field === "firstName" ? "First name" : "Last name"}
                            </label>
                            <input
                              required
                              type="text"
                              name={field}
                              value={formData[field]}
                              onChange={(e) => setFormData((d) => ({ ...d, [field]: e.target.value }))}
                              placeholder={field === "firstName" ? "Jane" : "Smith"}
                              className="border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>

                      {[
                        { field: "phone" as const, label: "Phone number", type: "tel", placeholder: "+1 (555) 000-0000" },
                        { field: "email" as const, label: "Email", type: "email", placeholder: "jane@example.com" },
                        { field: "company" as const, label: "Company (Optional)", type: "text", placeholder: "Acme Corporation" },
                      ].map(({ field, label, type, placeholder }) => (
                        <div key={field} className="space-y-1.5">
                          <label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{label}</label>
                          <input
                            required={field !== "company"}
                            type={type}
                            name={field}
                            value={formData[field]}
                            onChange={(e) => setFormData((d) => ({ ...d, [field]: e.target.value }))}
                            placeholder={placeholder}
                            className="border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:outline-none"
                          />
                        </div>
                      ))}

                      <button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 mt-2 w-full rounded-2xl py-4 text-sm font-bold tracking-wider text-white uppercase transition-all active:scale-[0.98]"
                      >
                        Submit →
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* ── STEP 4: Success ── */}
                {step === 5 && (
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
                      <h2 className="font-heading text-foreground text-3xl font-bold">
                        You&apos;re all set!
                      </h2>
                      <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                        Thanks for reaching out. Our team will get back to you within 24 hours.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="border-border bg-muted text-foreground hover:bg-muted/80 mt-2 rounded-xl border px-8 py-3 text-sm font-semibold transition-all"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress bar at bottom */}
            {step < 5 && (
              <div className="h-1 w-full bg-muted">
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
