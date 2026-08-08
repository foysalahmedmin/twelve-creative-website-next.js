"use client";

import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { cn } from "@/lib/utils";
import { submitContactMessageAction } from "@/lib/api/contact-messages-actions";
import {
  CONTACT_FORM_DATA,
  findContactField,
  type TContactFormData,
} from "@/data/contact-form.data";
import type { PublicIndustryOption } from "@/lib/api/industries";
import React, { useState } from "react";
import { toast } from "sonner";

export interface ContactSectionProps {
  className?: string;
  industries?: PublicIndustryOption[];
  label?: string;
  title?: string;
  description?: string;
  /** Admin-managed labels, placeholders and dropdowns. Falls back to defaults. */
  form?: TContactFormData;
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
const ContactFormSection = ({
  industries,
  form = CONTACT_FORM_DATA,
}: {
  industries: PublicIndustryOption[];
  form?: TContactFormData;
}) => {
  const [formData, setFormData] = useState<FormDataType>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const f = (key: Parameters<typeof findContactField>[1]) =>
    findContactField(form.fields, key);
  const content = form.content;

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

    const parts: string[] = [];
    if (formData.lookingFor) parts.push(`Looking for: ${formData.lookingFor}`);
    if (formData.notWorking) parts.push(`Not working: ${formData.notWorking}`);
    // Record the label the visitor actually chose. This used to push the
    // <option> value, so notifications read "Budget: 10k-plus" instead of
    // "Budget: $10,000+".
    const optionLabel = (
      options: { label: string; value: string }[],
      value: string,
    ) => options.find((o) => o.value === value)?.label ?? value;

    if (formData.timeline)
      parts.push(
        `Timeline: ${optionLabel(form.timeline_options, formData.timeline)}`,
      );
    if (formData.budget)
      parts.push(
        `Budget: ${optionLabel(form.budget_options, formData.budget)}`,
      );
    if (formData.website) parts.push(`Website/Instagram: ${formData.website}`);
    if (formData.industry) {
      const selectedIndustry = industries.find(
        (industry) => industry._id === formData.industry,
      );
      const industryName = selectedIndustry?.name ?? "Other";
      parts.push(`Industry: ${industryName}`);
      if (selectedIndustry) {
        parts.push(`Industry reference: ${selectedIndustry._id}`);
      }
    }

    const result = await submitContactMessageAction({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      subject: formData.company
        ? `Inquiry from ${formData.company}`
        : "New inquiry",
      message: parts.join("\n\n") || "No additional details provided.",
    });

    setIsSubmitting(false);

    if (result.ok) {
      toast.success("Thank you. Your inquiry has been successfully received!");
      setFormData(INITIAL_FORM_DATA);
    } else {
      toast.error(result.error ?? "Failed to send inquiry. Please try again.");
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
            {f("name").label}{f("name").is_required && (
              <span className="text-primary"> *</span>
            )}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required={f("name").is_required}
            value={formData.name}
            onChange={handleChange}
            placeholder={f("name").placeholder}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-lg border px-4 transition-all focus:ring-1 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label
            className="text-foreground text-sm font-semibold sm:text-base"
            htmlFor="email"
          >
            {f("email").label}{f("email").is_required && (
              <span className="text-primary"> *</span>
            )}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required={f("email").is_required}
            value={formData.email}
            onChange={handleChange}
            placeholder={f("email").placeholder}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-lg border px-4 transition-all focus:ring-1 focus:outline-none"
          />
        </div>

        {/* Phone */}
        {f("phone").is_visible && (
          <div className="flex flex-col gap-2">
            <label
              className="text-foreground text-sm font-semibold sm:text-base"
              htmlFor="phone"
            >
              {f("phone").label}{f("phone").is_required && (
                <span className="text-primary"> *</span>
              )}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required={f("phone").is_required}
              value={formData.phone}
              onChange={handleChange}
              placeholder={f("phone").placeholder}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-lg border px-4 transition-all focus:ring-1 focus:outline-none"
            />
          </div>
        )}

        {/* Company Name */}
        {f("company").is_visible && (
          <div className="flex flex-col gap-2">
            <label
              className="text-foreground text-sm font-semibold sm:text-base"
              htmlFor="company"
            >
              {f("company").label}{f("company").is_required && (
                <span className="text-primary"> *</span>
              )}
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required={f("company").is_required}
              value={formData.company}
              onChange={handleChange}
              placeholder={f("company").placeholder}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-lg border px-4 transition-all focus:ring-1 focus:outline-none"
            />
          </div>
        )}

        {/* Website / Instagram */}
        {f("website").is_visible && (
          <div className="flex flex-col gap-2">
            <label
              className="text-foreground text-sm font-semibold sm:text-base"
              htmlFor="website"
            >
              {f("website").label}{f("website").is_required && (
                <span className="text-primary"> *</span>
              )}
            </label>
            <input
              id="website"
              name="website"
              type="text"
              required={f("website").is_required}
              value={formData.website}
              onChange={handleChange}
              placeholder={f("website").placeholder}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-lg border px-4 transition-all focus:ring-1 focus:outline-none"
            />
          </div>
        )}

        {/* Industry */}
        {f("industry").is_visible && (
          <div className="flex flex-col gap-2">
            <label
              className="text-foreground text-sm font-semibold sm:text-base"
              htmlFor="industry"
            >
              {f("industry").label}{f("industry").is_required && (
                <span className="text-primary"> *</span>
              )}
            </label>
            <select
              id="industry"
              name="industry"
              required={f("industry").is_required}
              value={formData.industry}
              onChange={handleChange}
              className="border-border bg-background text-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-lg border px-4 transition-all focus:ring-1 focus:outline-none"
            >
              <option value="" className="bg-card">
                {content.industry_placeholder}
              </option>
              {industries.map((industry) => (
                <option
                  key={industry._id}
                  value={industry._id}
                  className="bg-card"
                >
                  {industry.name}
                </option>
              ))}
              <option value="other" className="bg-card">
                {content.industry_other_label}
              </option>
            </select>
          </div>
        )}
      </div>

      {/* Looking For */}
      {f("lookingFor").is_visible && (
        <div className="flex w-full flex-col gap-2">
          <label
            className="text-foreground text-sm font-semibold sm:text-base"
            htmlFor="lookingFor"
          >
            {f("lookingFor").label}{f("lookingFor").is_required && (
                <span className="text-primary"> *</span>
              )}
          </label>
          <textarea
            id="lookingFor"
            name="lookingFor"
            required={f("lookingFor").is_required}
            value={formData.lookingFor}
            onChange={handleChange}
            placeholder={f("lookingFor").placeholder}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-24 w-full resize-none rounded-lg border p-4 transition-all focus:ring-1 focus:outline-none"
          />
        </div>
      )}

      {/* Bottle Necks */}
      {f("notWorking").is_visible && (
        <div className="flex w-full flex-col gap-2">
          <label
            className="text-foreground text-sm font-semibold sm:text-base"
            htmlFor="notWorking"
          >
            {f("notWorking").label}{f("notWorking").is_required && (
                <span className="text-primary"> *</span>
              )}
          </label>
          <textarea
            id="notWorking"
            name="notWorking"
            required={f("notWorking").is_required}
            value={formData.notWorking}
            onChange={handleChange}
            placeholder={f("notWorking").placeholder}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-24 w-full resize-none rounded-lg border p-4 transition-all focus:ring-1 focus:outline-none"
          />
        </div>
      )}

      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
        {/* Timeline */}
        {f("timeline").is_visible && (
          <div className="flex flex-col gap-2">
            <label
              className="text-foreground text-sm font-semibold sm:text-base"
              htmlFor="timeline"
            >
              {f("timeline").label}{f("timeline").is_required && (
                <span className="text-primary"> *</span>
              )}
            </label>
            <select
              id="timeline"
              name="timeline"
              required={f("timeline").is_required}
              value={formData.timeline}
              onChange={handleChange}
              className="border-border bg-background text-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-lg border px-4 transition-all focus:ring-1 focus:outline-none"
            >
              <option value="" className="bg-card">
                {content.timeline_placeholder}
              </option>
              {form.timeline_options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-card"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Budget */}
        {f("budget").is_visible && (
          <div className="flex flex-col gap-2">
            <label
              className="text-foreground text-sm font-semibold sm:text-base"
              htmlFor="budget"
            >
              {f("budget").label}{f("budget").is_required && (
                <span className="text-primary"> *</span>
              )}
            </label>
            <select
              id="budget"
              name="budget"
              required={f("budget").is_required}
              value={formData.budget}
              onChange={handleChange}
              className="border-border bg-background text-foreground focus:border-primary focus:ring-primary/20 h-13 w-full rounded-lg border px-4 transition-all focus:ring-1 focus:outline-none"
            >
              <option value="" className="bg-card">
                {content.budget_placeholder}
              </option>
              {form.budget_options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-card"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary text-primary-foreground mt-4 flex h-14 w-full items-center justify-center rounded-lg text-sm font-semibold tracking-[0.05em] uppercase transition-all duration-200 select-none hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
      >
        {isSubmitting ? content.submitting_label : content.submit_label}
      </button>
    </form>
  );
};

// ── Main Layout Coordinator ────────────────────────────
export const PageContactSection = ({
  form,
  className,
  industries = [],
  label = "Send an Inquiry",
  title = "Tell us what needs to move.",
  description = "Whether the issue is unclear positioning, weak content, poor follow-up, a website that does not convert, or a campaign that needs structure — the first step is understanding the business.",
}: ContactSectionProps) => {
  return (
    <section
      className={cn(
        "bg-background border-border/40 w-full border-t py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="container">
        <div className="relative w-full">
          {/* Layered peeking back card element */}
          <div className="bg-muted border-border pointer-events-none absolute right-[2.5%] -bottom-3 left-[2.5%] z-0 h-12 rounded-b-3xl border-x border-b" />

          {/* Main box holding the form */}
          <div className="border-border bg-card relative z-10 space-y-10 rounded-3xl border p-8 sm:p-10 lg:p-12">
            <ScrollReveal animation="fade-in-up" durationMs={800}>
              <CenteredSectionHeader
                label={label}
                title={title}
                description={description}
                className="mb-0"
              />
            </ScrollReveal>

            {/* Form wrapper */}
            <ScrollReveal
              animation="fade-in-up"
              delayMs={200}
              className="border-border bg-muted/40 w-full rounded-3xl border p-6 sm:p-8 lg:p-10"
            >
              <ContactFormSection industries={industries} form={form} />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageContactSection;
