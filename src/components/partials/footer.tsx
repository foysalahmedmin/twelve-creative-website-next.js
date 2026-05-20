"use client";

import { LogoIcon } from "@/components/icons/logo-icon";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import {
  FOOTER_CONTACT,
  FOOTER_INDUSTRIES,
  FOOTER_QUICK_LINKS,
  FOOTER_SERVICES,
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

  const getSocialStyle = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]";
      case "twitter":
        return "bg-foreground/10 text-foreground hover:bg-foreground hover:text-background";
      case "linkedin":
        return "bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]";
      case "instagram":
        return "bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F]";
      case "youtube":
        return "bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000]";
      default:
        return "bg-muted-foreground/10 text-foreground hover:bg-muted-foreground/20";
    }
  };

  return (
    <footer
      className={cn(
        "relative overflow-hidden bg-muted/50 border-t pt-16 pb-8",
        className,
      )}
    >
      {/* Primary gradient glow — bottom-left bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary/20 blur-[100px]"
      />
      {/* Softer center-bottom radial bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-1/2 h-48 w-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-[80px]"
      />
      <div className="container">
        <div className="grid grid-cols-1 gap-10 border-b pb-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Brand */}
          <ScrollReveal
            animation="fade-in-left"
            durationMs={700}
            className="flex flex-col gap-6"
          >
            <Link href="/" className="flex w-max items-center gap-2">
              <LogoIcon className="h-8 w-auto lg:h-10" />
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed font-medium">
              Twelve Creative builds positioning, creative, distribution,
              websites, CRM, and automation systems for businesses that need a
              clearer path from attention to revenue.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.platform}
                  href={social.href}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110 hover:text-white ${getSocialStyle(social.platform)}`}
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
            <h4 className="text-foreground text-sm font-bold uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_QUICK_LINKS.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Column 3: What We Build */}
          <ScrollReveal
            animation="fade-in-up"
            delayMs={200}
            durationMs={700}
            className="flex flex-col gap-5"
          >
            <h4 className="text-foreground text-sm font-bold uppercase tracking-widest">
              What We Build
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_SERVICES.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
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
            <h4 className="text-foreground text-sm font-bold uppercase tracking-widest">
              Contact
            </h4>
            <div className="text-muted-foreground flex flex-col gap-4 text-sm font-medium">
              <div className="flex items-center gap-3">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="text-primary h-5 w-5 shrink-0"
                />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-foreground transition-colors"
                >
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={Call02Icon}
                  className="text-primary mt-0.5 h-5 w-5 shrink-0"
                />
                <p>{address}</p>
              </div>
            </div>

            <div className="mt-2">
              <h4 className="text-foreground mb-3 text-sm font-bold uppercase tracking-widest">
                Industries
              </h4>
              <ul className="flex flex-col gap-2">
                {FOOTER_INDUSTRIES.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm font-medium">
            &copy; {new Date().getFullYear()} Twelve Creative. All rights
            reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="/privacy-policy"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
