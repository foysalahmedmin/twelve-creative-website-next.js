"use client";

import { submitBookingAction } from "@/lib/api/bookings-actions";
import { cn } from "@/lib/utils";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

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

const STEP_LABELS = ["Sector", "Timeline", "Date & Time", "Your Details"];

export function BookingInlineSection({ className }: { className?: string }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
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
      industry: formData.market || undefined,
      timeline: formData.expectedDate || undefined,
      preferred_date: formData.preferredDate || undefined,
      preferred_time: formData.preferredTime || undefined,
    });
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error ?? "Could not submit your booking.");
      return;
    }
    setStep(5);
  };

  const handleReset = () => {
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
  };

  return (
    <section className={cn("py-16 sm:py-20 lg:py-24 bg-card/30", className)}>
      <div className="container max-w-3xl">
        {/* Header */}
        {step < 5 && (
          <div className="mb-10 text-center">
            <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 mb-5">
              Book a Call
            </span>
            <h2 className="font-heading text-foreground text-3xl font-medium tracking-tight leading-[115%] sm:text-4xl">
              Start the conversation.
            </h2>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">
              A 30-minute call — no commitment, no pitch deck. We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        )}

        {/* Progress bar */}
        {step < 5 && (
          <div className="mb-8">
            <div className="flex justify-between mb-2.5">
              {STEP_LABELS.map((label, i) => (
                <span
                  key={label}
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider hidden sm:block",
                    i + 1 <= step ? "text-primary" : "text-muted-foreground/40",
                  )}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={false}
                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}

        {/* Form card */}
        <div className="from-primary/20 to-primary/5 relative rounded-[28px] bg-linear-to-br p-px lg:rounded-[32px]">
          <div className="bg-card relative overflow-hidden rounded-[27px] px-8 py-10 lg:rounded-[31px] lg:px-12 lg:py-12">
            {/* Ambient glows */}
            <div aria-hidden className="bg-primary/12 pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl" />
            <div aria-hidden className="bg-primary/8 pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl" />

            <AnimatePresence mode="wait">
              {/* STEP 1: Industry */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6 relative z-10"
                >
                  <div className="space-y-1.5">
                    <span className="bg-primary inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground">1</span>
                    <h3 className="font-heading text-foreground text-2xl font-semibold">Which sector are we discussing?</h3>
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
                        <span className="text-foreground/80 group-hover:text-foreground text-sm font-medium">{option}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Timeline */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6 relative z-10"
                >
                  <div className="space-y-1.5">
                    <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground text-xs font-semibold mb-1 transition-colors">← Back</button>
                    <span className="bg-primary inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground">2</span>
                    <h3 className="font-heading text-foreground text-2xl font-semibold">When are you looking to get started?</h3>
                    <p className="text-muted-foreground text-sm">Select your expected timeline so we can plan accordingly.</p>
                  </div>
                  <div className="grid gap-2.5">
                    {EXPECTED_DATES.map((date, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTimelineSelect(date)}
                        className={cn(
                          "group flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all",
                          formData.expectedDate === date
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/40 hover:bg-primary/8",
                        )}
                      >
                        <span className="group-hover:border-primary group-hover:bg-primary border-border bg-muted text-muted-foreground group-hover:text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-foreground/80 group-hover:text-foreground text-sm font-medium">{date}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Date & Time */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6 relative z-10"
                >
                  <div className="space-y-1.5">
                    <button onClick={() => setStep(2)} className="text-muted-foreground hover:text-foreground text-xs font-semibold mb-1 transition-colors">← Back</button>
                    <span className="bg-primary inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground">3</span>
                    <h3 className="font-heading text-foreground text-2xl font-semibold">Pick a date &amp; preferred time.</h3>
                    <p className="text-muted-foreground text-sm">We&apos;ll reach out around your selected time slot.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Preferred Date</label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setFormData((d) => ({ ...d, preferredDate: e.target.value }))}
                      className="border-border bg-muted/50 text-foreground focus:border-primary w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Preferred Time</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot.label}
                          type="button"
                          onClick={() => setFormData((d) => ({ ...d, preferredTime: slot.label }))}
                          className={cn(
                            "flex flex-col items-start rounded-2xl border px-4 py-3 text-left transition-all",
                            formData.preferredTime === slot.label
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/40 hover:bg-primary/8",
                          )}
                        >
                          <span className={cn("text-sm font-semibold", formData.preferredTime === slot.label ? "text-primary" : "text-foreground")}>{slot.label}</span>
                          <span className="text-muted-foreground text-xs mt-0.5">{slot.range}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDateTime}
                    disabled={!formData.preferredDate || !formData.preferredTime}
                    className="bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed w-full rounded-2xl py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all active:scale-[0.98]"
                  >
                    Continue →
                  </button>
                </motion.div>
              )}

              {/* STEP 4: Contact */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6 relative z-10"
                >
                  <div className="space-y-1.5">
                    <button onClick={() => setStep(3)} className="text-muted-foreground hover:text-foreground text-xs font-semibold mb-1 transition-colors">← Back</button>
                    <span className="bg-primary inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground">4</span>
                    <h3 className="font-heading text-foreground text-2xl font-semibold">Great! Now let us know who you are.</h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      {(["firstName", "lastName"] as const).map((field) => (
                        <div key={field} className="space-y-1.5">
                          <label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{field === "firstName" ? "First name" : "Last name"}</label>
                          <input
                            required
                            type="text"
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
                          value={formData[field]}
                          onChange={(e) => setFormData((d) => ({ ...d, [field]: e.target.value }))}
                          placeholder={placeholder}
                          className="border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:outline-none"
                        />
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-primary hover:bg-primary/90 mt-2 w-full rounded-2xl py-4 text-sm font-bold tracking-wider text-primary-foreground uppercase transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Submitting…" : "Submit →"}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 5: Success */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="flex flex-col items-center justify-center space-y-6 py-12 text-center relative z-10"
                >
                  <div className="relative">
                    <div className="bg-primary absolute inset-0 rounded-full opacity-20 blur-2xl" />
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary relative z-10 h-20 w-20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading text-foreground text-3xl font-bold">You&apos;re all set!</h3>
                    <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                      Thanks for reaching out. Our team will get back to you within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="border-border bg-muted text-foreground hover:bg-muted/80 rounded-xl border px-8 py-3 text-sm font-semibold transition-all"
                  >
                    Book another call
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
