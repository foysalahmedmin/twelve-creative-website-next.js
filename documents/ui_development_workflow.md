# UI Development Workflow & Guidelines (Reference: Montago Motion)

This document serves as the official guide for migrating and building UI components and pages for the **Twelve Creative** project, using [montagemotion.com/](https://montagemotion.com/) as a structural and pattern reference.

---

## 0. shadcn/ui — The Mandatory First Check

> **Before creating ANY new UI element, you MUST verify no shadcn/ui equivalent exists.**

### Discovery Order:

1. Check `docs/role.md` — the canonical shadcn/ui component index for this project
2. Use the shadcn MCP tools: `search_items_in_registries`, `view_items_in_registries`, `get_item_examples_from_registries`
3. Browse existing components in `src/components/ui/` (55+ installed)

### If a shadcn/ui component exists → USE IT.

### If no shadcn/ui component exists → Install it via `npx shadcn@latest add <component>`.

### Only if shadcn/ui has no equivalent → Create a custom component that composes FROM shadcn/ui primitives.

### Configuration:

- **Config file:** `components.json` (style: `radix-luma`, icons: `hugeicons`)
- **Component directory:** `src/components/ui/` (shadcn-managed, do NOT manually edit)
- **Theme:** OKLCH CSS variables in `globals.css`

---

## 1. Core Principles

- **shadcn/ui First:** ALL UI primitives (buttons, inputs, cards, dialogs, tabs, selects, etc.) MUST use shadcn/ui components from `src/components/ui/`. No alternative UI libraries allowed.
- **Design System First:** Never copy hardcoded HEX colors or arbitrary HEX/RGB values. Always map them to our internal **OKLCH Semantic Variables** (e.g., `bg-background`, `text-foreground`).
- **Semantic Over Static:** Avoid hardcoded static colors like `bg-white` or `text-black`. Use semantic classes that adapt to both Dark and Light modes automatically.
- **Component Driven:** **ALWAYS** use **shadcn/ui** primitives for interaction logic (Modals, Tabs, Accordions, Cards, etc.). Never re-implement what shadcn/ui provides.
- **Consistency:** Follow the [rules.md](documents/rules.md) naming and folder structure laws strictly.

---

## 2. Color & Style Mapping

When inspecting elements on the reference site, use the following mapping Table to ensure the "Twelve Creative" identity is maintained:

| Sasthyaseba Element | Sasthyaseba Color (Approx) | Twelve Creative Semantic Variable (OKLCH)               |
| :------------------ | :------------------------- | :------------------------------------------------------ |
| Primary Branding    | Blue/Navy                  | `--primary`                                             |
| Active/Accent       | Light Blue                 | `--primary-light` (bg-primary-light)                    |
| **Section BGs**     | Light Blue                 | ** `--primary`** (bg-primary)                           |
| Text Headers        | Dark Navy                  | `--foreground` (Adaptive Text)                          |
| Main Backgrounds    | White (#FFFFFF)            | `--background` / `--card` (Adaptive Base)               |
| Inputs & Surfaces   | Gray Shades                | `--muted` / `--accent / 5%` (Avoid Static Grays)        |
| **Transparency**    | N/A                        | Use `bg-primary/10`, `text-foreground/80`               |
| **Mode Support**    | N/A                        | Always verify UI in both **Light** and **Dark** themes. |

---

## 3. Implementation Workflow

### Step 1: Inspect & Analyze

Identify the Tailwind classes used in the reference (e.g., `flex`, `grid-cols-3`, `rounded-full`, `shadow-lg`).

### Step 2: Component Choice (shadcn/ui First)

1.  **MANDATORY:** Check if a **shadcn/ui** component exists for the need. Reference `docs/llms.md` or the MCP tools.
2.  If the component is installed, use it directly. If not installed, run `npx shadcn@latest add <component>`.
3.  Wrap the shadcn component in a modular file inside `@/components/` (NOT inside `@/components/ui/`).

### Step 3: Naming & Placement

Follow the placement rules from `rules.md`:

- **Generic:** `src/components/common/`
- **Page Sections:** `src/components/app-[group]/[page]-page/` (Naming: `[name]-section.tsx`)
- **Cards:** `src/components/cards/` (Naming: `[name]-card.tsx`)

### Step 4: Logic & Pure Data Separation

- Ensure components are not static. Use **Props** (`TProps`) for data.
- **Pure Data Separation:** Always move static arrays or objects into `src/data/[name].data.ts`.
- **UI Logic Only:** Components should handle ALL styling (Tailwind classes) and UI logic. Data files MUST remain "pure" (no CSS classes allowed).
- Use **TanStack Query** (`useQuery`) for fetching dynamic data from services.

---

## 4. Icon & Asset Pipeline

### SVG Icons

1.  Copy the SVG from the reference.
2.  Create a new file in `src/components/icons/[name]-icon.tsx`.
3.  Clean the SVG (remove hardcoded `fill` or `stroke` and use `currentColor`).
4.  Export it as a React component.

### Images

If using external images from Sasthyaseba for prototyping:

1.  Add the domain to `next.config.ts` under `images.remotePatterns`.
2.  Use the `next/image` component for optimization.

---

## 5. Standard Component Checklist

Before finalizing a component, ensure:

- [ ] **shadcn/ui primitives used** — All interactive elements use components from `src/components/ui/` (Button, Card, Input, Dialog, Tabs, etc.).
- [ ] **No alternative UI libraries** — No imports from `@mui/*`, `@chakra-ui/*`, `@headlessui/*`, or similar.
- [ ] **Composition pattern** — Feature components compose FROM shadcn/ui primitives (e.g., `<Card>` not `<div className="bg-card...">`).
- [ ] It supports **Dark Mode** natively by using **Semantic Classes** (Avoiding fixed white/black).
- [ ] It is fully **Responsive** (Mobile, Tablet, Desktop) with 100% layout integrity.
- [ ] Any interactivity (hover, active states) uses the `--accent` or `--primary` variables.
- [ ] All surfaces (cards, inputs, panels) use theme-aware glassmorphism (`backdrop-blur`) where applicable.
- [ ] Handling **Loading states** with `<Skeleton>` from `@/components/ui/skeleton`.
- [ ] Handling **Empty states** with `<Empty>` from `@/components/ui/empty`.
- [ ] Handling **Pagination** with `<Pagination>` from `@/components/ui/pagination`.
- [ ] File and folder naming follows the **kebab-case** and **dot-notation** (for types) laws.

---

## 6. Project-Specific Patterns

### A. Form Handling

Healthcare platforms rely heavily on data entry (Appointment details, Profile updates).

- **Tooling:** Use `react-hook-form` + `zod` + `shadcn/form`.
- **Validation:** All forms must have a corresponding **Zod Schema** ending in `Schema` (e.g., `appointmentValidationSchema`).

### B. Loading & Error States

- **Skeletons:** For every data-driven card or list, create a corresponding Skeleton component (e.g., `doctor-card-skeleton.tsx`).
- **Error Boundaries:** Use clean error states from shadcn if a query fails.

### C. Typography

- **Headings:** Map Sasthyaseba headers to `font-sans` (Geist) with `font-semibold` or `font-bold`.
- **Body:** Use `text-muted-foreground` for supportive text to maintain visual hierarchy.

---

## 7. Example: Service Card Conversion

**Reference (Sasthyaseba):**

```html
<div class="rounded-lg border-blue-500 bg-white p-4 shadow-md">
  <img src="..." />
  <h3 class="text-blue-900">Doctor Search</h3>
</div>
```

**Twelve Creative Implementation:**

```tsx
// Inside @/components/cards/service-card.tsx
import { Card } from "@/components/ui/card";

export const ServiceCard = ({ title, icon: Icon }: TServiceCardProps) => {
  return (
    <Card className="border-border bg-card hover:border-primary p-4 transition-colors">
      <Icon className="text-primary h-8 w-8" />
      <h3 className="text-foreground font-semibold">{title}</h3>
    </Card>
  );
};
```
