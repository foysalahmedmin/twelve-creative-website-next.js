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
      case "facebook":
        return Facebook01Icon;
      case "twitter":
        return NewTwitterIcon;
      case "linkedin":
        return Linkedin01Icon;
      case "instagram":
        return InstagramIcon;
      case "youtube":
        return YoutubeIcon;
      default:
        return Globe02Icon;
    }
  };

  return (
    <footer
      className={cn("relative overflow-hidden", "bg-brand-artefact", className)}
    >
      {/* ── Dark-mode decorative glows ── */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-56 -right-56 hidden h-[36rem] w-[36rem] rounded-full bg-white/[0.05] blur-3xl dark:block"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 hidden h-80 w-80 rounded-full bg-black/10 blur-3xl dark:block"
      />

      <div className="relative z-10">
        {/* ── Top micro-CTA strip ── */}
        <div className="border-primary-foreground/20 border-b">
          <div className="container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <p className="text-primary-foreground/80 text-sm font-semibold">
              Ready to build the structure behind your growth?
            </p>
            <Link
              href="/contact"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all dark:bg-white/15 dark:text-white dark:backdrop-blur-sm dark:hover:bg-white dark:hover:text-[#E96A2C]"
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

              <p className="text-primary-foreground/75 max-w-xs text-sm leading-relaxed">
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
                    className="border-primary-foreground bg-primary-foreground text-primary hover:bg-primary-foreground/90 group flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 hover:scale-110 dark:border-white/20 dark:bg-white/10 dark:text-white dark:backdrop-blur-sm dark:hover:border-white dark:hover:bg-white dark:hover:text-[#E96A2C]"
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
              <h4 className="text-primary-foreground text-[11px] font-bold tracking-[0.18em] uppercase">
                Navigation
              </h4>
              <ul className="flex flex-col gap-2.5">
                {FOOTER_QUICK_LINKS.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-primary-foreground/70 hover:text-primary-foreground group inline-flex items-center gap-1.5 text-sm transition-colors"
                    >
                      <span className="bg-primary-foreground h-px w-0 transition-all duration-200 group-hover:w-3" />
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
              <h4 className="text-primary-foreground text-[11px] font-bold tracking-[0.18em] uppercase">
                Industries
              </h4>
              <ul className="flex flex-col gap-2.5">
                {FOOTER_INDUSTRIES.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-primary-foreground/70 hover:text-primary-foreground group inline-flex items-center gap-1.5 text-sm transition-colors"
                    >
                      <span className="bg-primary-foreground h-px w-0 transition-all duration-200 group-hover:w-3" />
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
              <h4 className="text-primary-foreground text-[11px] font-bold tracking-[0.18em] uppercase">
                Contact
              </h4>
              <div className="flex flex-col gap-4">
                <a
                  href={`mailto:${email}`}
                  className="text-primary-foreground/70 hover:text-primary-foreground group flex items-start gap-3 text-sm transition-colors"
                >
                  <span className="bg-primary-foreground/10 group-hover:bg-primary-foreground/20 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors">
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      className="text-primary-foreground h-4 w-4"
                    />
                  </span>
                  <span className="break-all">{email}</span>
                </a>
                <div className="text-primary-foreground/70 group flex items-start gap-3 text-sm">
                  <span className="bg-primary-foreground/10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                    <HugeiconsIcon
                      icon={Call02Icon}
                      className="text-primary-foreground h-4 w-4"
                    />
                  </span>
                  <p>{address}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-primary-foreground/15 border-t">
          <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
            <p className="text-primary-foreground/50 text-xs">
              © {new Date().getFullYear()} Twelve Creative. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <Link
                href="/privacy-policy"
                className="text-primary-foreground/50 hover:text-primary-foreground text-xs transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="text-primary-foreground/50 hover:text-primary-foreground text-xs transition-colors"
              >
                Terms of Use
              </Link>
              <span className="text-primary-foreground/30 text-xs">
                Built by{" "}
                <span className="text-primary-foreground/60 font-semibold">
                  Twelve Creative
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
