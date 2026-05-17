"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, MessageCircle, Briefcase, Info, ArrowUpRight } from "lucide-react";
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
const ContactForm = () => {
  const [formData, setFormData] = useState<FormDataType>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
    <form className="w-full flex flex-col gap-6 justify-center" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-base font-semibold text-foreground" htmlFor="name">
            Full Name <span className="text-primary">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full h-13 px-4 rounded-xl border border-primary/15 bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-base font-semibold text-foreground" htmlFor="email">
            Email Address <span className="text-primary">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full h-13 px-4 rounded-xl border border-primary/15 bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-base font-semibold text-foreground" htmlFor="phone">
            Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (234) 567-890"
            className="w-full h-13 px-4 rounded-xl border border-primary/15 bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Company Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-base font-semibold text-foreground" htmlFor="company">
            Company Name
          </label>
          <input
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="SparkLabs Inc"
            className="w-full h-13 px-4 rounded-xl border border-primary/15 bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Website / Instagram */}
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-base font-semibold text-foreground" htmlFor="website">
            Website / Instagram
          </label>
          <input
            name="website"
            type="text"
            value={formData.website}
            onChange={handleChange}
            placeholder="example.com"
            className="w-full h-13 px-4 rounded-xl border border-primary/15 bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Industry */}
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-base font-semibold text-foreground" htmlFor="industry">
            Industry Category
          </label>
          <select
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full h-13 px-4 rounded-xl border border-primary/15 bg-card/50 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          >
            <option value="" className="bg-card">Select Industry</option>
            <option value="hospitality" className="bg-card">Hospitality / Restaurant</option>
            <option value="real-estate" className="bg-card">Real Estate</option>
            <option value="aviation" className="bg-card">Aviation</option>
            <option value="professional-services" className="bg-card">Professional Services</option>
            <option value="other" className="bg-card">Other</option>
          </select>
        </div>
      </div>

      {/* Looking For */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm sm:text-base font-semibold text-foreground" htmlFor="lookingFor">
          What are you looking for help with?
        </label>
        <textarea
          name="lookingFor"
          value={formData.lookingFor}
          onChange={handleChange}
          placeholder="e.g. Creative Production, SaaS Video Editing, CRM Integrations..."
          className="w-full h-24 p-4 rounded-xl border border-primary/15 bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
        />
      </div>

      {/* Bottle Necks */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm sm:text-base font-semibold text-foreground" htmlFor="notWorking">
          What is currently not working?
        </label>
        <textarea
          name="notWorking"
          value={formData.notWorking}
          onChange={handleChange}
          placeholder="Describe your current bottleneck problems in detail..."
          className="w-full h-24 p-4 rounded-xl border border-primary/15 bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {/* Timeline */}
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-base font-semibold text-foreground" htmlFor="timeline">
            Timeline
          </label>
          <select
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="w-full h-13 px-4 rounded-xl border border-primary/15 bg-card/50 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          >
            <option value="" className="bg-card">Select Timeline</option>
            <option value="asap" className="bg-card">ASAP</option>
            <option value="1-3-months" className="bg-card">1-3 Months</option>
            <option value="3-6-months" className="bg-card">3-6 Months</option>
            <option value="flexible" className="bg-card">Flexible</option>
          </select>
        </div>

        {/* Budget */}
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-base font-semibold text-foreground" htmlFor="budget">
            Monthly Budget Range
          </label>
          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full h-13 px-4 rounded-xl border border-primary/15 bg-card/50 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          >
            <option value="" className="bg-card">Select Range</option>
            <option value="2k-5k" className="bg-card">$2,000 - $5,000</option>
            <option value="5k-10k" className="bg-card">$5,000 - $10,000</option>
            <option value="10k-plus" className="bg-card">$10,000+</option>
          </select>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 rounded-2xl bg-primary text-white font-semibold flex items-center justify-center hover:scale-105 active:scale-95 duration-200 transition-all mt-4 disabled:opacity-50 disabled:pointer-events-none select-none"
      >
        {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry"}
      </button>
    </form>
  );
};

// ── Main Layout Coordinator ────────────────────────────
export const PageContactSection = ({ className }: ContactSectionProps) => {
  const contactCards = [
    {
      title: "Email Us",
      value: "carlos@twelvecreative.io",
      icon: Mail,
      href: "mailto:carlos@twelvecreative.io",
    },
    {
      title: "WhatsApp Us",
      value: "+1 951 822 6223",
      icon: MessageCircle,
      href: "https://wa.me/19518226223?text=Hello!",
    },
    {
      title: "Work with Us",
      value: "Explore current opportunities",
      icon: Briefcase,
      href: "/careers",
    },
    {
      title: "Explore Us",
      value: "Learn about our services",
      icon: Info,
      href: "/about",
    },
  ];

  return (
    <section className={cn("container py-16 sm:py-20 lg:py-24", className)}>
      <div className="relative w-full">
        {/* Layered peeking back card element */}
        <div className="absolute -bottom-3 left-[2.5%] right-[2.5%] h-12 bg-primary/10 dark:bg-primary/20 rounded-b-[38px] z-0 border-x border-b border-primary/10 pointer-events-none" />

        {/* Main box holding the form and detail cards */}
        <div className="relative rounded-[40px] border border-primary/15 bg-card/95 p-8 sm:p-10 lg:p-12 z-10 space-y-12">
          
          <ScrollReveal animation="fade-in-up" durationMs={800}>
            <CenteredSectionHeader
              label="Contact Us"
              title="Have a Project? Let's Talk"
              description="Tell us about your project bottlenecks. We will get back to you with a clear tactical plan."
              className="mb-0"
            />
          </ScrollReveal>

          {/* Quick Connect Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {contactCards.map((item, idx) => {
              const Icon = item.icon;

              return (
                <ScrollReveal
                  key={idx}
                  animation="fade-in-up"
                  delayMs={100 * idx}
                  className="flex h-full"
                >
                  <Link
                    href={item.href}
                    target="_blank"
                    className="group/contact-card w-full h-full rounded-[24px] bg-gradient-to-br from-primary/30 to-primary/5 dark:to-primary/2 p-[1px] flex transition-all duration-300 hover:scale-105"
                  >
                    <div className="rounded-[23px] bg-background w-full h-full p-5 flex justify-between items-center gap-4">
                      
                      {/* Left texts */}
                      <div className="flex-1 space-y-1 truncate">
                        <h4 className="font-heading font-semibold text-base sm:text-lg text-foreground group-hover/contact-card:text-primary transition-colors flex items-center gap-1.5 truncate">
                          {item.title}
                          <ArrowUpRight className="size-4 opacity-0 group-hover/contact-card:opacity-100 transition-all shrink-0 duration-200" />
                        </h4>
                        <p className="text-muted-foreground text-xs sm:text-sm truncate">
                          {item.value}
                        </p>
                      </div>

                      {/* Right icon element */}
                      <div className="size-11 shrink-0 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                        <Icon className="size-5" />
                      </div>

                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Form wrapper */}
          <ScrollReveal
            animation="fade-in-up"
            delayMs={400}
            className="w-full rounded-3xl border border-primary/10 bg-primary/[0.02] dark:bg-primary/[0.04] p-6 sm:p-8 lg:p-10"
          >
            <ContactForm />
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

export default PageContactSection;
