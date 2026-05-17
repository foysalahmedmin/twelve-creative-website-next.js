# Twelve Creative Frontend Project Structure

This document provides a detailed overview of the project's folder structure, architectural patterns, and design system implementation.

---

## 1. Directory Overview

```text
twelve-creative-frontend-v2/
├── documents/          # Technical documentation, plans, and architectural memories
├── public/             # Static assets (images, fonts, original SVGs)
└── src/                # Core application source code
    ├── app/            # Next.js App Router (Routing and Layouts)
    ├── adapters/       # Data transformation logic (The "Buffer" Layer)
    ├── components/     # UI Components (Modular & Atomic)
    ├── config/         # Centralized system configurations (ENV, API, SITE)
    ├── data/           # Static data and mock datasets
    ├── hooks/          # Custom React hooks
    │   ├── queries/    # TanStack Query logic (API orchestrators)
    │   └── ui/         # Generic UI-related hooks (use-mobile, etc.)
    ├── lib/            # Third-party library initializations (axios, redux)
    ├── providers/      # React Context Providers (Auth, Theme, etc.)
    ├── redux/          # Global state management (Slices and Store)
    ├── services/       # API interaction logic (Axios connectivity)
    └── types/          # Global TypeScript type definitions
```

---

## 2. Routing Architecture (`src/app/`)

We use **Route Groups** to logically organize the application without affecting the URL structure.

- **`(primary)`**: Main user-facing pages (Home, Doctors, Telemedicine, Hospitals). Uses the primary layout with Header and Footer.
- **`(secondary)`**: Supporting pages (Privacy Policy, Terms, FAQ).
- **`(auth)`**: Authentication flow (Sign In, Sign Up).
- **`(dashboard)`**: User/Doctor private dashboard area.

**Note:** The `app/` folder should contain ONLY `page.tsx`, `layout.tsx`, `loading.tsx`, and `error.tsx` files. All UI logic must be moved to `src/components/`.

---

## 3. Component Architecture (`src/components/`)

Components are organized by their scope and reuse potential.

| Directory      | Description                                                                                             | Example                                | Managed By |
| :------------- | :------------------------------------------------------------------------------------------------------ | :------------------------------------- | :--------- |
| `ui/`          | **shadcn/ui ONLY.** All UI primitives. Use `npx shadcn@latest add`. Can be modified to fit design. | `button.tsx`, `card.tsx`, `dialog.tsx` | shadcn CLI |
| `base/`        | Non-UI utility wrappers (error boundaries, layout shells). NOT for UI primitives.                       | `error-boundary.tsx`                   | Manual     |
| `partials/`    | Shared components composing FROM `ui/` primitives.                                                      | `header.tsx`, `footer.tsx`             | Manual     |
| `cards/`       | Data-display cards. MUST use `<Card>` from `ui/`.                                                       | `doctor-card.tsx`, `hospital-card.tsx` | Manual     |
| `icons/`       | Custom SVG icon components.                                                                             | `logo-icon.tsx`                        | Manual     |
| `app-[group]/` | Page-specific components organized by route group.                                                      | `app-primary/home-page/`               | Manual     |

> ⚠️ **Rule:** `src/components/ui/` is exclusively managed by shadcn/ui. See `docs/llms.md` for the full component catalog. Use the shadcn MCP tools or CLI to install new components.

---

## 4. Configuration System (`src/config/`)

This is the **"Brain"** of the application settings. All external and global configurations MUST be mapped here.

- **`env.ts` (`ENV`)**: Centralized access to environment variables. **Direct use of `process.env` is forbidden outside this file.**
- **`api.ts` (`API`)**: Constant end-points and base URLs.
- **`site.ts` (`SITE`)**: Site metadata, contact info, and SEO constants.
- **`constant.ts` (`CONSTANT`)**: Fixed numerical or string values (Pagination, VAT, Regex).

---

## 5. Design System Structure

We use a modern, semantic-first design system built on **shadcn/ui** + **Tailwind CSS 4** + **OKLCH** color spacing.

### A. shadcn/ui Foundation

- **Config**: `components.json` — style: `radix-luma`, icons: `hugeicons`, CSS variables: `true`
- **Components**: All UI primitives.`
- **Theme**: OKLCH CSS custom properties managed through the shadcn/ui theming system
- **Installation**: `npx shadcn@latest add <component>` or via MCP tools

### B. Color Architecture (`globals.css`)

- **OKLCH Colors**: Used for better perceptual uniformity and vibrant colors.
- **Theme Variables**: Defined in `:root` and `.dark`, managed by shadcn/ui theming.
- **Semantic Mapping**:
  - `primary`: Main brand color (Greenish-Teal).
  - `secondary`: Supporting teal-blue.
  - `accent`: Light highlight color.
  - `background/foreground`: Core surface and text colors.

### C. Typography

- **Heading**: `Geist Sans` (mapped to `--font-sans`).
- **Body**: `Geist Sans`.
- **Logic**: All typography is responsive and controlled via Tailwind's `text-*` utilities using rem units.

### D. Aesthetic Layers

- **Glassmorphism**: Achieved using `backdrop-blur` and semi-transparent semantic backgrounds (e.g., `bg-background/80`).
- **Standardized Shadows**: Custom semantic shadows (`shadow-primary`, `shadow-accent`) defined in `globals.css`.

### D. Aesthetic Consistency & Minimalism

- **Smart Minimalism:** Prioritize a "Simple and Smart Looking" interface. Avoid over-saturating the UI with unnecessary colors in backgrounds or text.
- **Component Harmony:** Maintain a strict consistency in `border-radius` for all **Cards, Buttons, and Inputs**. Use the centralized `--radius` token to ensure a unified visual language.
- **UI Consistency:** Ensure that spacing, rounding, and color usage remain predictable throughout the entire application.

---

## 6. Layered Data Architecture

To bridge backend responses and frontend UI needs, every dynamic module follows a professional **4-Layer Data Flow**:

1.  **Type Layer (`src/types/`)**: Defines the contract for raw backend data and transformed models.
2.  **Adapter Layer (`src/adapters/`)**: Pure functions that transform complex backend data into clean, flat objects for the UI.
3.  **Service Layer (`src/services/`)**: Axios-based logic that communicates with API endpoints using transformed models.
4.  **Hook Layer (`src/hooks/queries/`)**: TanStack Query orchestration that manages caching, loading/error states, and background synchronization.

**Data Flow Pattern:**
`API Response` ➔ `Service` ➔ `Adapter` ➔ `Query Hook` ➔ `UI Component`

---

## 7. Data & Type Safety

- **Static Data (`src/data/`)**: Pure TypeScript objects for UI content. No styling or logic allowed.
- **Dynamic Types (`src/types/`)**: Unified interfaces with PascalCase naming and appropriate suffixes (e.g., `BackendHospital`, `Hospital`).
- **Null Safety**: Every Adapter must enforce null-checks and provide default fallbacks for essential UI fields.

---

## 8. Operational Guidelines

1.  **Always** check `src/config/env.ts` before adding a new environment variable.
2.  **Always** use semantic variables in CSS/Tailwind (Never use hex colors).
3.  **Always** build features in order: **Type ➔ Adapter ➔ Service ➔ Hook ➔ UI**.
4.  **Never** leak backend-specific fields (like `_id` or `v`) directly into UI components. Use the Adapter.
5.  **Always** maintain UI consistency specially for `border-radius` and minimalist color usage.
6.  **Always** use shadcn/ui components from `src/components/ui/` for all UI primitives. Check `docs/llms.md` before creating custom elements.
7.  **Never** install alternative UI libraries (`@mui/*`, `@chakra-ui/*`, `@headlessui/*`, etc.).
8.  **Always** install new shadcn/ui components via `npx shadcn@latest add` or the MCP tools. You may modify existing files if required by the design.
