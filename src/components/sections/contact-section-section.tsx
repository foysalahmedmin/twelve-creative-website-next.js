"use client";

import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { toast } from "sonner";

export interface ContactSectionProps {
  className?: string;
}

interface FormDataType {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  industry: string;
  lookingFor: string;
  notWorking: string;
  timeline: string;
  budget: string;
  message: string;
}

const INITIAL_FORM_DATA: FormDataType = {
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  industry: "",
  lookingFor: "",
  notWorking: "",
  timeline: "",
  budget: "",
  message: "",
};

// ── Contact Inquiry Form ──────────────────────────────
const ContactFormSection = () => {
  const [formData, setFormData] = useState<FormDataType>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Proactive delay mock submit
      await new Promise((res) => setTimeout(res, 1200));
      toast.success("Thank you. Your inquiry has been successfully received!");
      setFormData(INITIAL_FORM_DATA);
    } catch {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex w-full flex-col justify-center gap-6"
      onSubmit={handleSubmit}
    >
      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label
            className="text-foreground text-sm font-semibold sm:text-base"
            htmlFor="name"
          >
            Full Name <span className="text-primary">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="border-primary/15 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-xl border px-4 transition-all focus:ring-1 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label
            className="text-foreground text-sm font-semibold sm:text-base"
            htmlFor="email"
          >
            Email Address <span className="text-primary">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="border-primary/15 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-xl border px-4 transition-all focus:ring-1 focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label
            className="text-foreground text-sm font-semibold sm:text-base"
            htmlFor="phone"
          >
            Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (234) 567-890"
            className="border-primary/15 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-xl border px-4 transition-all focus:ring-1 focus:outline-none"
          />
        </div>

        {/* Company Name */}
        <div className="flex flex-col gap-2">
          <label
            className="text-foreground text-sm font-semibold sm:text-base"
            htmlFor="company"
          >
            Company Name
          </label>
          <input
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="SparkLabs Inc"
            className="border-primary/15 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-xl border px-4 transition-all focus:ring-1 focus:outline-none"
          />
        </div>

        {/* Website / Instagram */}
        <div className="flex flex-col gap-2">
          <label
            className="text-foreground text-sm font-semibold sm:text-base"
            htmlFor="website"
          >
            Website / Instagram
          </label>
          <input
            name="website"
            type="text"
            value={formData.website}
            onChange={handleChange}
            placeholder="example.com"
            className="border-primary/15 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-xl border px-4 transition-all focus:ring-1 focus:outline-none"
          />
        </div>

        {/* Industry */}
        <div className="flex flex-col gap-2">
          <label
            className="text-foreground text-sm font-semibold sm:text-base"
            htmlFor="industry"
          >
            Industry Category
          </label>
          <select
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="border-primary/15 bg-card/50 text-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-xl border px-4 transition-all focus:ring-1 focus:outline-none"
          >
            <option value="" className="bg-card">
              Select Industry
            </option>
            <option value="hospitality" className="bg-card">
              Hospitality / Restaurant
            </option>
            <option value="real-estate" className="bg-card">
              Real Estate
            </option>
            <option value="aviation" className="bg-card">
              Aviation
            </option>
            <option value="professional-services" className="bg-card">
              Professional Services
            </option>
            <option value="other" className="bg-card">
              Other
            </option>
          </select>
        </div>
      </div>

      {/* Looking For */}
      <div className="flex w-full flex-col gap-2">
        <label
          className="text-foreground text-sm font-semibold sm:text-base"
          htmlFor="lookingFor"
        >
          What are you looking for help with?
        </label>
        <textarea
          name="lookingFor"
          value={formData.lookingFor}
          onChange={handleChange}
          placeholder="e.g. Creative Production, SaaS Video Editing, CRM Integrations..."
          className="border-primary/15 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-24 w-full resize-none rounded-xl border p-4 transition-all focus:ring-1 focus:outline-none"
        />
      </div>

      {/* Bottle Necks */}
      <div className="flex w-full flex-col gap-2">
        <label
          className="text-foreground text-sm font-semibold sm:text-base"
          htmlFor="notWorking"
        >
          What is currently not working?
        </label>
        <textarea
          name="notWorking"
          value={formData.notWorking}
          onChange={handleChange}
          placeholder="Describe your current bottleneck problems in detail..."
          className="border-primary/15 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-24 w-full resize-none rounded-xl border p-4 transition-all focus:ring-1 focus:outline-none"
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
        {/* Timeline */}
        <div className="flex flex-col gap-2">
          <label
            className="text-foreground text-sm font-semibold sm:text-base"
            htmlFor="timeline"
          >
            Timeline
          </label>
          <select
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="border-primary/15 bg-card/50 text-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-xl border px-4 transition-all focus:ring-1 focus:outline-none"
          >
            <option value="" className="bg-card">
              Select Timeline
            </option>
            <option value="asap" className="bg-card">
              ASAP
            </option>
            <option value="1-3-months" className="bg-card">
              1-3 Months
            </option>
            <option value="3-6-months" className="bg-card">
              3-6 Months
            </option>
            <option value="flexible" className="bg-card">
              Flexible
            </option>
          </select>
        </div>

        {/* Budget */}
        <div className="flex flex-col gap-2">
          <label
            className="text-foreground text-sm font-semibold sm:text-base"
            htmlFor="budget"
          >
            Monthly Budget Range
          </label>
          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="border-primary/15 bg-card/50 text-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-xl border px-4 transition-all focus:ring-1 focus:outline-none"
          >
            <option value="" className="bg-card">
              Select Range
            </option>
            <option value="2k-5k" className="bg-card">
              $2,000 - $5,000
            </option>
            <option value="5k-10k" className="bg-card">
              $5,000 - $10,000
            </option>
            <option value="10k-plus" className="bg-card">
              $10,000+
            </option>
          </select>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary mt-4 flex h-14 w-full items-center justify-center rounded-2xl font-semibold text-white transition-all duration-200 select-none hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
      >
        {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry"}
      </button>
    </form>
  );
};

// ── Main Layout Coordinator ────────────────────────────
export const PageContactSection = ({ className }: ContactSectionProps) => {
  return (
    <section className={cn("container py-16 sm:py-20 lg:py-24", className)}>
      <div className="relative w-full">
        {/* Layered peeking back card element */}
        <div className="bg-primary/10 dark:bg-primary/20 border-primary/10 pointer-events-none absolute right-[2.5%] -bottom-3 left-[2.5%] z-0 h-12 rounded-b-[38px] border-x border-b" />

        {/* Main box holding the form */}
        <div className="border-primary/15 bg-card/95 relative z-10 space-y-10 rounded-[40px] border p-8 sm:p-10 lg:p-12">
          <ScrollReveal animation="fade-in-up" durationMs={800}>
            <CenteredSectionHeader
              label="Send an Inquiry"
              title="Tell us what needs to move."
              description="Whether the issue is unclear positioning, weak content, poor follow-up, a website that does not convert, or a campaign that needs structure — the first step is understanding the business."
              className="mb-0"
            />
          </ScrollReveal>

          {/* Form wrapper */}
          <ScrollReveal
            animation="fade-in-up"
            delayMs={200}
            className="border-primary/10 bg-primary/[0.02] dark:bg-primary/[0.04] w-full rounded-3xl border p-6 sm:p-8 lg:p-10"
          >
            <ContactFormSection />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default PageContactSection;
