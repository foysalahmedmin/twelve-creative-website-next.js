"use client";

import { submitBookingAction } from "@/lib/api/bookings-actions";
import { cn } from "@/lib/utils";
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MARKETS = [
  "Hospitality (Restaurants, Hotels, Nightlife)",
  "Real Estate (Developers, Projects, Brokerages)",
  "Aviation (Charter, Maintenance, Sales)",
  "Professional Services (Legal, Medical, Consulting)",
  "Other",
];

const TIME_SLOTS = [
  { label: "Morning", range: "9:00 AM – 12:00 PM" },
  { label: "Afternoon", range: "12:00 PM – 4:00 PM" },
  { label: "Evening", range: "4:00 PM – 7:00 PM" },
  { label: "Flexible", range: "Any time works" },
];

const TOTAL_STEPS = 3;

export function BookingInlineSection({
  className,
  calendlyUrl,
}: {
  className?: string;
  /** When set, the section links out to Calendly instead of the built-in form. */
  calendlyUrl?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [redirectIn, setRedirectIn] = useState(3);
  const [formData, setFormData] = useState({
    market: "",
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
      industry: formData.market || undefined,
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

  // On success, count down then redirect to the confirmation page.
  useEffect(() => {
    if (step !== 4) return;
    let n = 3;
    const id = setInterval(() => {
      n -= 1;
      setRedirectIn(n);
      if (n <= 0) {
        clearInterval(id);
        router.push("/booking/confirm");
      }
    }, 1000);
    return () => clearInterval(id);
  }, [step, router]);

  // When a Calendly URL is configured, this section links out to Calendly
  // instead of showing the built-in multi-step form — matching the Header and
  // contact page behaviour promised in the admin settings.
  if (calendlyUrl) {
    return (
      <section className={cn("py-16 sm:py-20 lg:py-24", className)}>
        <div className="container">
          <div className="mb-10 text-center">
            <span className="bg-primary/10 text-primary border-primary/20 mb-5 inline-flex rounded-full border px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
              Book a Call
            </span>
            <h2 className="font-heading text-foreground text-3xl leading-[115%] font-black tracking-tight sm:text-4xl">
              Start the conversation.
            </h2>
            <p className="text-muted-foreground mx-auto mt-3 max-w-md text-base leading-relaxed">
              A 30-minute call — no commitment, no pitch deck. Pick a time that
              works for you.
            </p>
          </div>

          <div className="border-border bg-card relative mx-auto max-w-xl overflow-hidden rounded-3xl border px-6 py-10 text-center md:px-12">
            <div
              aria-hidden
              className="bg-primary/12 pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl"
            />
            <div
              aria-hidden
              className="bg-primary/8 pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl"
            />
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="from-primary-from to-primary-to hover:shadow-primary text-primary-foreground group/cta relative z-10 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-linear-to-br px-8 text-base font-semibold shadow-md transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Booking
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-5 transition-transform group-hover/cta:translate-x-1"
              />
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-16 sm:py-20 lg:py-24", className)}>
      <div className="container">
        {/* Header */}
        {step < 4 && (
          <div className="mb-10 text-center">
            <span className="bg-primary/10 text-primary border-primary/20 mb-5 inline-flex rounded-full border px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
              Book a Call
            </span>
            <h2 className="font-heading text-foreground text-3xl leading-[115%] font-black tracking-tight sm:text-4xl">
              Start the conversation.
            </h2>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">
              A 30-minute call — no commitment, no pitch deck. We&apos;ll get
              back to you within 24 hours.
            </p>
          </div>
        )}

        {/* Content */}
        <div className="relative w-full overflow-hidden rounded-3xl px-6 py-8 md:px-12 md:py-12">
          {/* Ambient glows */}
          <div
            aria-hidden
            className="bg-primary/12 pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl"
          />
          <div
            aria-hidden
            className="bg-primary/8 pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl"
          />

          <AnimatePresence mode="wait">
            {/* STEP 1: Industry */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.22 }}
                className="relative z-10 space-y-6"
              >
                <div className="space-y-1.5">
                  <span className="bg-primary text-primary-foreground inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold">
                    1
                  </span>
                  <h3 className="font-heading text-foreground text-2xl font-semibold">
                    Which sector are we discussing?
                  </h3>
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

            {/* STEP 2: Date & Time */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.22 }}
                className="relative z-10 space-y-6"
              >
                <div className="space-y-1.5">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setStep(1)}
                      className="text-muted-foreground/50 hover:text-muted-foreground text-xs transition-colors"
                    >
                      ← back
                    </button>
                  </div>
                  <span className="bg-primary text-primary-foreground inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold">
                    2
                  </span>
                  <h3 className="font-heading text-foreground text-2xl font-semibold">
                    Pick a date &amp; preferred time.
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    We&apos;ll reach out around your selected time slot.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData((d) => ({
                        ...d,
                        preferredDate: e.target.value,
                      }))
                    }
                    className="border-border bg-muted/50 text-foreground focus:border-primary w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Preferred Time
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.label}
                        type="button"
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
                  disabled={!formData.preferredDate || !formData.preferredTime}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-2xl py-4 text-sm font-bold tracking-wider uppercase transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue →
                </button>
              </motion.div>
            )}

            {/* STEP 3: Contact */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.22 }}
                className="relative z-10 space-y-6"
              >
                <div className="space-y-1.5">
                  <button
                    onClick={() => setStep(2)}
                    className="text-muted-foreground/50 hover:text-muted-foreground text-xs transition-colors"
                  >
                    ← back
                  </button>
                  <span className="bg-primary text-primary-foreground inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold">
                    3
                  </span>
                  <h3 className="font-heading text-foreground text-2xl font-semibold">
                    Great! Now let us know who you are.
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    {(["firstName", "lastName"] as const).map((field) => (
                      <div key={field} className="space-y-1.5">
                        <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                          {field === "firstName" ? "First name" : "Last name"}
                        </label>
                        <input
                          required
                          type="text"
                          value={formData[field]}
                          onChange={(e) =>
                            setFormData((d) => ({
                              ...d,
                              [field]: e.target.value,
                            }))
                          }
                          placeholder={field === "firstName" ? "Jane" : "Smith"}
                          className="border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:outline-none"
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
                      <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        {label}
                      </label>
                      <input
                        required={field !== "company"}
                        type={type}
                        value={formData[field]}
                        onChange={(e) =>
                          setFormData((d) => ({
                            ...d,
                            [field]: e.target.value,
                          }))
                        }
                        placeholder={placeholder}
                        className="border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:outline-none"
                      />
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground mt-2 w-full rounded-2xl py-4 text-sm font-bold tracking-wider uppercase transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "Submit →"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: Success */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="relative z-10 flex flex-col items-center justify-center space-y-6 py-12 text-center"
              >
                <div className="relative">
                  <div className="bg-primary absolute inset-0 rounded-full opacity-20 blur-2xl" />
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary relative z-10 h-20 w-20"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-foreground text-3xl font-bold">
                    Booking received!
                  </h3>
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

          {/* Progress bar at bottom */}
          {step < 4 && (
            <div className="bg-muted mt-10 h-px w-full overflow-hidden">
              <motion.div
                className="bg-primary h-full"
                initial={false}
                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
