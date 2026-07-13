"use client";

import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { submitContactMessageAction } from "@/lib/api/contact-messages-actions";
import {
  CustomerService01Icon,
  Location01Icon,
  Mail01Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loader2 } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import { toast } from "sonner";

import { SITE } from "@/config/site";

const CONTACT_INFOS: {
  id: number;
  icon: any;
  title: string;
  description: string;
  value?: string;
  href?: string;
  links?: { label: string; href: string }[];
}[] = [
  {
    id: 1,
    icon: Mail01Icon,
    title: "Email Support",
    description: "Our team can help you at",
    links: [
      { label: SITE.contact.email, href: `mailto:${SITE.contact.email}` },
    ],
  },
  {
    id: 2,
    icon: CustomerService01Icon,
    title: "Call Center",
    description: "Available 24/7 for you",
    links: SITE.contact.phones.map((phone) => ({
      label: phone,
      href: `tel:${phone.replace(/[^0-9+]/g, "")}`,
    })),
  },
  {
    id: 3,
    icon: Location01Icon,
    title: "Our Office",
    description: SITE.contact.address,
    value: "",
  },
  {
    id: 4,
    icon: WhatsappIcon,
    title: "WhatsApp Support",
    description: "Chat with our experts",
    links: SITE.contact.whatsapp.map((wa) => ({
      label: wa,
      href: `https://wa.me/${wa.replace(/[^0-9]/g, "")}`,
    })),
  },
];

import { cn } from "@/lib/utils";

export const ContactSection = ({
  hideHeader = false,
  className,
}: {
  hideHeader?: boolean;
  className?: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
  }>({});

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email.";
    if (form.phone && form.phone.replace(/\D/g, "").length < 7)
      e.phone = "Please enter a valid phone number.";
    if (!form.message.trim() || form.message.trim().length < 5)
      e.message = "Message must be at least 5 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const res = await submitContactMessageAction({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone || undefined,
      subject: form.subject.trim() || undefined,
      message: form.message.trim(),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      toast.error(res.error ?? "Failed to send message. Please try again.");
      return;
    }
    toast.success("Message sent successfully!");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <section
      className={cn(
        "bg-background border-t border-border/40 py-16 sm:py-20 lg:py-24",
        className,
      )}
      id="contact"
    >
      <div className="container">
        {!hideHeader && (
          <SectionHeader
            label="Get in Touch"
            title="Have any Questions?"
            description="We're here to help and answer any question you might have. We look forward to hearing from you."
            centeredOnMobile
          />
        )}

        <div className="flex flex-col gap-[3em] lg:flex-row lg:items-start lg:gap-[5em]">
          {/* Left Side: Contact Info */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-[2.5em] text-xs md:text-base lg:grid-cols-1">
              {CONTACT_INFOS.map((item) => (
                <div
                  key={item.id}
                  className="text-center lg:flex lg:items-start lg:gap-4 lg:text-left"
                >
                  <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-[3.5em] w-[3.5em] shrink-0 items-center justify-center rounded-[1em] lg:mx-0 lg:mb-0">
                    <HugeiconsIcon icon={item.icon} size={28} />
                  </div>
                  <div className="space-y-1 lg:pt-[0.2em]">
                    <h4 className="text-foreground text-[1.125em] font-bold">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-[0.875em] leading-relaxed font-medium">
                      {item.description}
                    </p>
                    {item.links ? (
                      <div className="mt-[0.5em] flex flex-wrap items-center justify-center gap-1 text-[0.875em] font-bold lg:justify-start">
                        {item.links.map((link, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <a
                              href={link.href}
                              className="hover:text-primary text-muted-foreground font-medium hover:underline"
                            >
                              {link.label}
                            </a>
                            {i < (item?.links?.length || 0) - 1 && (
                              <span className="text-foreground">/</span>
                            )}
                          </span>
                        ))}
                      </div>
                    ) : item.href ? (
                      <a
                        href={item.href}
                        className="hover:text-primary text-muted-foreground font-medium hover:underline"
                      >
                        {item.value}
                      </a>
                    ) : item.value ? (
                      <p className="text-muted-foreground mt-[0.5em] text-[0.875em] font-medium">
                        {item.value}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-muted/30 border-border flex-1 rounded-2xl border p-4 shadow-sm lg:p-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-bold">
                    Full Name <span className="text-destructive ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="John Doe"
                    className={`bg-background placeholder:text-muted-foreground/40 focus:border-primary w-full rounded-lg border px-4 py-3 text-sm font-medium transition-all outline-none ${errors.name ? "border-destructive" : "border-border"}`}
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs font-medium">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-bold">
                    Email <span className="text-destructive ml-0.5">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className={`bg-background placeholder:text-muted-foreground/40 focus:border-primary w-full rounded-lg border px-4 py-3 text-sm font-medium transition-all outline-none ${errors.email ? "border-destructive" : "border-border"}`}
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs font-medium">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-bold">
                    Phone Number
                  </label>
                  <PhoneInput
                    value={form.phone}
                    onChange={(val) =>
                      handleChange("phone", (val as string) || "")
                    }
                    placeholder="+8801XXXXXXXXX"
                    className={`[&_button]:h-11.5 [&_input]:h-11.5 ${errors.phone ? "[&_input]:border-destructive" : ""}`}
                  />
                  {errors.phone && (
                    <p className="text-destructive text-xs font-medium">
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-bold">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    placeholder="How can we help?"
                    className={`bg-background placeholder:text-muted-foreground/40 focus:border-primary w-full rounded-lg border px-4 py-3 text-sm font-medium transition-all outline-none ${errors.subject ? "border-destructive" : "border-border"}`}
                  />
                  {errors.subject && (
                    <p className="text-destructive text-xs font-medium">
                      {errors.subject}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-foreground text-sm font-bold">
                  Message <span className="text-destructive ml-0.5">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Type your question here..."
                  className={`bg-background placeholder:text-muted-foreground/40 focus:border-primary w-full rounded-lg border px-4 py-3 text-sm font-medium transition-all outline-none ${errors.message ? "border-destructive" : "border-border"}`}
                />
                {errors.message && (
                  <p className="text-destructive text-xs font-medium">
                    {errors.message}
                  </p>
                )}
              </div>

              <Button
                disabled={isSubmitting}
                className="h-11 w-full text-base transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
