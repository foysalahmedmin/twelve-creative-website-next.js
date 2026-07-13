"use client";

import { cn } from "@/lib/utils";
import { ArrowRight01Icon, Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/* ── Signature brand device: outlined rounded-rect chip (BRANDBOOK) ── */
function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "border-foreground/30 text-foreground inline-flex items-center rounded-md border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Swatch({
  name,
  hex,
  className,
  text = "text-foreground",
}: {
  name: string;
  hex: string;
  className: string;
  text?: string;
}) {
  return (
    <div className="border-border overflow-hidden rounded-xl border">
      <div className={cn("flex h-32 items-end p-3", className)}>
        <span className={cn("font-heading text-sm font-bold", text)}>{name}</span>
      </div>
      <div className="bg-card flex items-center justify-between px-3 py-2">
        <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
          {hex}
        </span>
      </div>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border/70 border-t py-14">
      <div className="mb-8 flex flex-col gap-3">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="font-heading text-foreground text-3xl font-black tracking-tight sm:text-4xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

/* NEW brand button styles (preview of Phase-2 primitives) */
const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-[0.05em] transition-transform duration-200 active:scale-[0.98]";

export default function BrandPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const isDark = resolvedTheme === "dark";

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Theme toggle */}
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="border-border bg-card fixed right-5 top-5 z-50 flex h-11 items-center gap-2 rounded-lg border px-4 text-xs font-bold uppercase tracking-widest"
      >
        {mounted && (
          <>
            <HugeiconsIcon
              icon={isDark ? Sun03Icon : Moon02Icon}
              className="text-primary size-4"
            />
            {isDark ? "Cream" : "Dark"}
          </>
        )}
      </button>

      {/* ── Hero: the target look ── */}
      <header className="bg-brand-hero relative overflow-hidden">
        <div className="bg-brand-texture pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <span className="inline-flex items-center rounded-md border border-[#eaeae4]/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#eaeae4]">
            Brand System · 2025 / 26
          </span>
          <h1 className="font-heading mt-6 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-[#eaeae4] sm:text-7xl">
            The TwelveCreative design system, on brand.
          </h1>
          <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-[#eaeae4]/80 sm:text-lg">
            Energy orange used with confidence, warm cream and teal-black
            backgrounds, editorial radii, and Object Sans throughout — straight
            from the brandbook.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button className={cn(btnBase, "bg-primary text-primary-foreground")}>
              Explore our world
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </button>
            <button
              className={cn(
                btnBase,
                "border border-[#eaeae4]/35 text-[#eaeae4]",
              )}
            >
              View work
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6">
        {/* ── Palette ── */}
        <Section eyebrow="Primary Palette" title="Three colors carry the brand.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Swatch
              name="Energy Orange"
              hex="#E96A2C"
              className="bg-[#e96a2c]"
              text="text-[#131c20]"
            />
            <Swatch
              name="Cream"
              hex="#EAEAE4"
              className="bg-[#eaeae4]"
              text="text-[#131c20]"
            />
            <Swatch
              name="Teal-Black"
              hex="#131C20"
              className="bg-[#131c20]"
              text="text-[#eaeae4]"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Swatch name="background" hex="token" className="bg-background border" text="text-foreground" />
            <Swatch name="card" hex="token" className="bg-card" text="text-foreground" />
            <Swatch name="muted" hex="token" className="bg-muted" text="text-foreground" />
            <Swatch name="primary" hex="token" className="bg-primary" text="text-primary-foreground" />
          </div>
        </Section>

        {/* ── Typography ── */}
        <Section eyebrow="Typography" title="PP Object Sans — Heavy, Bold, Regular.">
          <div className="space-y-8">
            <div>
              <Eyebrow className="mb-3">Headline · Heavy · tight</Eyebrow>
              <p className="font-heading text-foreground text-4xl font-black leading-[1.03] tracking-tight sm:text-6xl">
                We help brands stand out with bold, refined visuals.
              </p>
            </div>
            <div>
              <Eyebrow className="mb-3">Subheading · Regular · ALL CAPS</Eyebrow>
              <p className="text-muted-foreground text-lg font-normal uppercase tracking-[0.12em]">
                From automation to content, systems that scale
              </p>
            </div>
            <div>
              <Eyebrow className="mb-3">Body · Regular</Eyebrow>
              <p className="text-foreground/85 max-w-2xl text-base leading-relaxed">
                Object Sans offers crisp readability with the perfect touch of
                warmth to maintain a human feel — Heavy for headlines, Regular
                for comfortable reading, Bold to highlight key ideas.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Chips & Buttons ── */}
        <Section eyebrow="Components" title="Chips, buttons & controls.">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>Visual Identity</Eyebrow>
              <Eyebrow>Primary Palette</Eyebrow>
              <Eyebrow className="border-primary/40 text-primary">Hospitality</Eyebrow>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className={cn(btnBase, "bg-primary text-primary-foreground")}>
                Book a call
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </button>
              <button className={cn(btnBase, "bg-foreground text-background")}>
                Talk to us
              </button>
              <button
                className={cn(btnBase, "border-border text-foreground border")}
              >
                Explore
              </button>
            </div>
          </div>
        </Section>

        {/* ── Cards ── */}
        <Section eyebrow="Surfaces" title="Cards — cream, dark & orange.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="border-border bg-card rounded-2xl border p-6">
              <Eyebrow className="mb-4">Cream</Eyebrow>
              <h3 className="font-heading text-foreground text-xl font-black tracking-tight">
                Positioning the business
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Hairline border, warm surface, editorial radius.
              </p>
            </div>
            <div className="rounded-2xl bg-[#131c20] p-6 ring-1 ring-white/10">
              <span className="mb-4 inline-flex items-center rounded-md border border-[#eaeae4]/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#eaeae4]">
                Dark
              </span>
              <h3 className="font-heading text-xl font-black tracking-tight text-[#eaeae4]">
                Conversion systems
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#eaeae4]/70">
                Teal-black surface for premium, evening-appropriate contexts.
              </p>
            </div>
            <div className="rounded-2xl bg-[#e96a2c] p-6">
              <span className="mb-4 inline-flex items-center rounded-md border border-[#131c20]/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#131c20]">
                Orange
              </span>
              <h3 className="font-heading text-xl font-black tracking-tight text-[#131c20]">
                Distribution with intent
              </h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#131c20]/80">
                Bold solid orange — used with confidence, not as a wash.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Gradients & texture ── */}
        <Section eyebrow="Gradients & Texture" title="Rich dark → orange, not faint washes.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-brand-artefact flex h-56 items-end rounded-2xl p-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#eaeae4]">
                Artefact
              </span>
            </div>
            <div className="bg-brand-hero flex h-56 items-end rounded-2xl p-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#eaeae4]">
                Hero
              </span>
            </div>
            <div className="relative flex h-56 items-end overflow-hidden rounded-2xl bg-[#e96a2c] p-5">
              <div className="bg-brand-texture absolute inset-0 opacity-70" />
              <span className="relative text-xs font-bold uppercase tracking-widest text-[#131c20]">
                Orange + texture
              </span>
            </div>
          </div>
        </Section>

        {/* ── Radius scale ── */}
        <Section eyebrow="Shape" title="Editorial radius scale.">
          <div className="flex flex-wrap gap-4">
            {[
              ["sm · 8", "rounded-sm"],
              ["md · 10", "rounded-md"],
              ["lg · 12", "rounded-lg"],
              ["xl · 16", "rounded-xl"],
              ["2xl · 20", "rounded-2xl"],
              ["3xl · 24", "rounded-3xl"],
            ].map(([label, r]) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "bg-primary/15 border-primary/40 size-20 border",
                    r,
                  )}
                />
                <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <footer className="border-border/70 border-t py-14">
          <p className="text-muted-foreground text-sm">
            Foundation preview · nothing deployed. Approve to roll this system
            across every section, card, and page.
          </p>
        </footer>
      </div>
    </main>
  );
}
