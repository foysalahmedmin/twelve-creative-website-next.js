"use client";

import { LogoIcon } from "@/components/icons/logo-icon";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import {
  FOOTER_CONTACT,
  FOOTER_INDUSTRIES,
  FOOTER_QUICK_LINKS,
  SOCIAL_LINKS,
} from "@/data/footer.data";
import { cn } from "@/lib/utils";
import {
  Call02Icon,
  Facebook01Icon,
  Globe02Icon,
  InstagramIcon,
  Linkedin01Icon,
  Mail01Icon,
  NewTwitterIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export interface FooterSocialItem {
  platform: string;
  href: string;
}

interface FooterProps {
  className?: string;
  socials?: FooterSocialItem[];
  contactEmail?: string;
  contactAddress?: string;
}

export const Footer = ({
  className,
  socials,
  contactEmail,
  contactAddress,
}: FooterProps) => {
  const socialLinks = socials && socials.length ? socials : SOCIAL_LINKS;
  const email = contactEmail || FOOTER_CONTACT.email;
  const address = contactAddress || FOOTER_CONTACT.address;

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":  return Facebook01Icon;
      case "twitter":   return NewTwitterIcon;
      case "linkedin":  return Linkedin01Icon;
      case "instagram": return InstagramIcon;
      case "youtube":   return YoutubeIcon;
      default:          return Globe02Icon;
    }
  };

  return (
    <footer
      className={cn(
        "relative overflow-hidden",
        "bg-brand-artefact",
        className,
      )}
    >
      {/* ── Decorative texture / glows ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='28' viewBox='0 0 56 28'%3E%3Cpath d='M0 28 L14 2 L28 28 L42 2 L56 28' fill='none' stroke='%23EAEAE4' stroke-opacity='0.06' stroke-width='1.5'/%3E%3C/svg%3E\")",
          backgroundSize: "56px 28px",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-56 -right-56 h-[36rem] w-[36rem] rounded-full bg-white/[0.05] blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-black/10 blur-3xl"
      />

      <div className="relative z-10">
        {/* ── Top micro-CTA strip ── */}
        <div className="border-b border-white/20">
          <div className="container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <p className="text-sm font-semibold text-white/80">
              Ready to build the structure behind your growth?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#E96A2C]"
            >
              Start a conversation
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="container pt-14 pb-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">

            {/* Brand column — spans 4 */}
            <ScrollReveal
              animation="fade-in-left"
              durationMs={700}
              className="flex flex-col gap-6 lg:col-span-4"
            >
              <Link href="/" className="flex w-max items-center gap-2">
                <LogoIcon className="h-8 w-auto brightness-0 invert lg:h-10" />
              </Link>

              <p className="max-w-xs text-sm leading-relaxed text-white/75">
                Twelve Creative builds positioning, creative, distribution,
                websites, CRM, and automation systems for businesses that need a
                clearer path from attention to revenue.
              </p>

              {/* Socials */}
              <div className="flex items-center gap-2.5">
                {socialLinks.map((social) => (
                  <Link
                    key={social.platform}
                    href={social.href}
                    className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-white hover:bg-white hover:text-[#E96A2C]"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                  >
                    <HugeiconsIcon
                      icon={renderSocialIcon(social.platform)}
                      className="h-4 w-4"
                    />
                  </Link>
                ))}
              </div>
            </ScrollReveal>

            {/* Spacer on desktop */}
            <div className="hidden lg:col-span-1 lg:block" />

            {/* Navigation — spans 2 */}
            <ScrollReveal
              animation="fade-in-up"
              delayMs={120}
              durationMs={700}
              className="flex flex-col gap-5 lg:col-span-2"
            >
              <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                Navigation
              </h4>
              <ul className="flex flex-col gap-2.5">
                {FOOTER_QUICK_LINKS.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 bg-white transition-all duration-200 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            {/* Industries — spans 2 */}
            <ScrollReveal
              animation="fade-in-up"
              delayMs={200}
              durationMs={700}
              className="flex flex-col gap-5 lg:col-span-2"
            >
              <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                Industries
              </h4>
              <ul className="flex flex-col gap-2.5">
                {FOOTER_INDUSTRIES.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 bg-white transition-all duration-200 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            {/* Contact — spans 3 */}
            <ScrollReveal
              animation="fade-in-right"
              delayMs={280}
              durationMs={700}
              className="flex flex-col gap-5 lg:col-span-3"
            >
              <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                Contact
              </h4>
              <div className="flex flex-col gap-4">
                <a
                  href={`mailto:${email}`}
                  className="group flex items-start gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 transition-colors group-hover:bg-white/20">
                    <HugeiconsIcon icon={Mail01Icon} className="h-4 w-4 text-white" />
                  </span>
                  <span className="break-all">{email}</span>
                </a>
                <div className="group flex items-start gap-3 text-sm text-white/70">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <HugeiconsIcon icon={Call02Icon} className="h-4 w-4 text-white" />
                  </span>
                  <p>{address}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/15">
          <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} Twelve Creative. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <Link
                href="/privacy-policy"
                className="text-xs text-white/50 transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="text-xs text-white/50 transition-colors hover:text-white"
              >
                Terms of Use
              </Link>
              <span className="text-xs text-white/30">
                Built by{" "}
                <span className="font-semibold text-white/60">Twelve Creative</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
