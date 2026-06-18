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
        "relative overflow-hidden pt-16 pb-8",
        "bg-[#E96A2C]",
        className,
      )}
    >
      <div className="container">
        <div className="grid grid-cols-1 gap-10 border-b border-white/20 pb-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {/* Column 1: Brand */}
          <ScrollReveal
            animation="fade-in-left"
            durationMs={700}
            className="flex flex-col gap-6"
          >
            <Link href="/" className="flex w-max items-center gap-2">
              <LogoIcon className="h-8 w-auto brightness-0 invert lg:h-10" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed font-medium text-white/80">
              Twelve Creative builds positioning, creative, distribution,
              websites, CRM, and automation systems for businesses that need a
              clearer path from attention to revenue.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.platform}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:scale-110 hover:bg-white hover:text-[#E96A2C]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <HugeiconsIcon
                    icon={renderSocialIcon(social.platform)}
                    className="h-5 w-5"
                  />
                </Link>
              ))}
            </div>
          </ScrollReveal>

          {/* Column 2: Navigation */}
          <ScrollReveal
            animation="fade-in-up"
            delayMs={120}
            durationMs={700}
            className="flex flex-col gap-5"
          >
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">
              Navigation
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_QUICK_LINKS.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Column 3: Industries */}
          <ScrollReveal
            animation="fade-in-up"
            delayMs={200}
            durationMs={700}
            className="flex flex-col gap-5"
          >
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">
              Industries
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_INDUSTRIES.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Column 4: Contact */}
          <ScrollReveal
            animation="fade-in-right"
            delayMs={280}
            durationMs={700}
            className="flex flex-col gap-5"
          >
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">
              Contact
            </h4>
            <div className="flex flex-col gap-4 text-sm font-medium text-white/80">
              <div className="flex items-center gap-3">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="h-5 w-5 shrink-0 text-white"
                />
                <a
                  href={`mailto:${email}`}
                  className="transition-colors hover:text-white"
                >
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={Call02Icon}
                  className="mt-0.5 h-5 w-5 shrink-0 text-white"
                />
                <p>{address}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <p className="text-sm font-medium text-white/70">
            &copy; {new Date().getFullYear()} Twelve Creative. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="/privacy-policy"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
