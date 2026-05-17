# Twelve Creative Frontend Development Roles & Guidelines

This document outlines the standard development roles, practices, and architectural "laws" for the Twelve Creative Frontend to maintain a clean and scalable frontend codebase.

---

## 1. Naming & Casing Conventions

### A. Files & Directories

- **Directories:** Always use `kebab-case` (e.g., `auth-provider/`, `user-profile/`).
- **Code Files:**
  - **Standard Files:** Always use `kebab-case` (e.g., `app-provider.tsx`, `app-slice.ts`, `redux-store.ts`).
  - **Types, Services & Adapters:** Use Dot Notation for files inside `types/`, `services/` or `adapters/` folders.
    - Example: `src/services/auth.service.ts`, `src/types/user.type.ts`, `src/adapters/user.adapter.ts`.
  - **Component Files:** Follow the specific role-based naming:
    - Sections: `[name]-section.tsx`
    - Cards: `[name]-card.tsx`
    - Icons: `[name]-icon.tsx`
- **Documentation:** Always use `snake_case` for every `.md` file (e.g., `plan_overview.md`, `tasks_list.md`).

### B. Data & Payloads

- **API Payloads:** All request bodies and response data must be `snake_case`.
- **Query Parameters:** URL parameters must use `snake_case` (e.g., `?page_size=10&sort_by=date`).
- **Interfaces/Types:** Use PascalCase with appropriate prefixes.
  - **Types (Priority):** Use `T` prefix (e.g., `TUser`, `TPaymentPayload`).
  - **Interfaces:** Use `I` prefix (e.g., `IUser`, `IPaymentPayload`).
- **Schemas:** Zod schemas should end with `Schema` (e.g., `userValidationSchema`).

---

## 2. Project Organization (Modular Architecture)

### A. Component Structure (`src/components/`)

All UI components MUST reside in `src/components/`. The `src/app/` folder is reserved strictly for routing (groups and pages).

- **UI Primitives (`src/components/ui/`):** **shadcn/ui managed directory.** All interactive UI primitives (Button, Input, Dialog, Card, Tabs, Select, etc.) live here. **Do NOT manually create or modify files in this directory** — use `npx shadcn@latest add <component>` or the MCP tools.
- **Base Components (`src/components/base/`):** Non-UI utility wrappers and structural elements only (e.g., layout wrappers, error boundaries). **NOT for UI primitives** — those belong in `ui/`.
- **Common Components (`src/components/common/`):** Shared reusable components used across multiple modules. These MUST compose from `ui/` primitives.
- **Page-Specific Components (`src/components/_[group-name]_/[page-name]-page/`):** Components that belong to a specific page (e.g., hero sections, specific forms).
- **Sections (`src/components/sections/`):** Generic layout sections. Named as `[name]-section.tsx`.
- **Cards (`src/components/cards/`):** All card-based UI elements. Named as `[name]-card.tsx`. MUST use `<Card>` from `ui/` as the container.
- **Icons (`src/components/icons/`):** SVG Icon components. Named as `[name]-icon.tsx`.

### B. Logical Modules

- **State Management:**
  - **Global State:** Redux Slices in `src/lib/redux/slices/` (e.g., `app-slice.ts`).
  - **Data Fetching:** TanStack Query hooks in `src/hooks/queries/` (e.g., `use-user.ts`).
- **Services (`src/services/`):** API connectivity logic. Named as `[module-name].service.ts`.
- **Adapters (`src/adapters/`):** Data transformation logic (The "Buffer"). Named as `[module-name].adapter.ts`.
- **Types (`src/types/`):** Global/Module Type definitions. Named as `[module-name].type.ts`.

### C. Data Management (`src/data/`)

To maintain a clean separation of concerns, all static data (like service lists, navigation items, etc.) MUST be kept in `src/data/`.

- **Pure Data Law:** Data files must contain **ONLY PURE DATA** (strings, IDs, URLs, booleans).
- **No UI Classes:** You MUST NOT include any Tailwind CSS classes, logic-related classes, or UI styling strings inside data objects.
- **Typing:** Every data file should export a corresponding type (e.g., `TServiceCard`) to ensure type safety.
- **Naming:** Files should follow the `[module].data.ts` naming convention.
  - Example: `src/data/services.data.ts`, `src/data/navigation.data.ts`.

---

## 3. Development Guidelines

- **Atomic Design:** Build from small components up to full pages.
- **Performance:** Use `React.memo`, `useCallback`, and `useMemo` specifically where performance bottlenecks are identified.
- **Styling:** Use **Tailwind CSS 4** with **shadcn/ui** for consistent aesthetics.
- **Theme Awareness:** All components MUST be designed to be **Dark/Light Mode friendly** from the start.
- **Clean Code:** Follow ESLint and Prettier configurations strictly.
- **Async Handling:** Always use `async/await` and handle errors using `try/catch` or global error boundaries.

### shadcn/ui Component Law

> **All UI primitives MUST come from shadcn/ui (`src/components/ui/`).** Introducing alternative UI component libraries (Material UI, Chakra UI, Ant Design, Headless UI, etc.) is **STRICTLY FORBIDDEN** without explicit architectural approval.

- **Before creating any custom UI element**, verify no shadcn/ui equivalent exists by checking `docs/llms.md` or the shadcn MCP tools.
- **Component Installation:** Use `npx shadcn@latest add <component>` — never manually create files in `src/components/ui/`.
- **Composition Rule:** Feature components (`cards/`, `common/`, `app-*/`) MUST compose from shadcn/ui primitives. Example: use `<Card>` from `@/components/ui/card`, not `<div className="bg-card border rounded-xl">`.
- **Empty States:** Use `<Empty>` from `@/components/ui/empty`.
- **Loading States:** Use `<Skeleton>` from `@/components/ui/skeleton` and `<Spinner>` from `@/components/ui/spinner`.
- **Pagination:** Use `<Pagination>` from `@/components/ui/pagination`.
- **Forms:** Use `<Field>` + `react-hook-form` + `zod` for all form handling.

---

## 4. Centralized Configuration (`src/config/`)

To keep the application manageable and avoid hardcoded strings spread throughout the codebase, all global settings must be centralized in `src/config/`.

### A. Environment Variable Law (`env.ts`)

- **Single Point of Entry:** `src/config/env.ts` is the **ONLY** file allowed to access `process.env`.
- **Logic:** ALL environment variables must be exported through the `ENV` object. Direct use of `process.env` anywhere else in the project is strictly **FORBIDDEN**.
- **Type Safety:** Ensure every environment variable used is documented in `env.ts`.

### B. Professional API Routing (`api.ts`)

- **Centralized Payloads:** All base URLs and endpoints must be stored in the `API` object.
- **Consistency:** Use endpoints from `api.ts` in all services and hooks to ensure consistency.

### C. Site Identity (`site.ts`)

- **Metadata Source:** All site-wide information (Name, SEO Description, Social Links, Contact Info) must be exported through the `SITE` object.
- **Centralized SEO:** Use `SITE.name`, `SITE.description`, etc., in the main `Metadata` objects.

### D. Global Constants (`constant.ts`)

- **Fixed Values:** Hardcoded numerical values (Pagination limits, VAT, Phone regex) must be kept in the `CONSTANT` object.
- **No Magic Numbers:** Use constants to make the code more readable and easier to adjust.

---

100:
101: ## 5. Layered Data Architecture (The Adapter Pattern)
102:
103: To bridge the gap between backend responses and frontend UI needs without making the UI fragile, every module MUST follow our **4-Layer Data Flow**:
104:
105: ### A. Layer 1: Type Definitions (`src/types/`)
106: - **Role:** Define the contract for both raw backend data (`BackendModel`) and the transformed frontend model (`Model`).
107: - **Direction:** Always start here. Define exactly what the data looks like.
108:
109: ### B. Layer 2: Adapter Layer (`src/adapters/`)
110: - **Role:** The "Protective Buffer". Pure functions that map `BackendModel` -> `Model`.
111: - **Law:** Never allow `_id` or other backend-specific nested paths to leak into the UI. Map them to clean keys (e.g., `id`, `thumbnail`).
112: - **Logic:** Handle null-safety, default fallbacks (e.g., placeholder images), and type conversions here.
113:
114: ### C. Layer 3: Service Layer (`src/services/`)
115: - **Role:** Handles API communication using Axios.
116: - **Implementation:** Import raw data from API and return the transformed data using the **Adapter**.
117: - **Standard:** Use `ApiResponse<T>` wrapper for all responses to ensure consistency.
118:
119: ### D. Layer 4: Hook Layer (`src/hooks/queries/`)
120: - **Role:** TanStack Query orchestration. Provides loading, error states, and caching.
121: - **Best Practice:** Use a **Query Key Factory** inside the hook file to manage caching/invalidation centrally.
122:
123: ---

## 6. Design System & Theme Standards

To ensure a premium and accessible user experience across all devices and preferences:

### A. shadcn/ui as the Design Foundation

- **Single Source of Truth:** shadcn/ui is the **exclusive** UI component library for this project. The theme configuration lives in `components.json` (style: `radix-luma`, icons: `hugeicons`).
- **Component Primitives:** All interactive UI elements MUST use shadcn/ui components from `src/components/ui/`. See `docs/llms.md` for the full component catalog.
- **Theme Tokens:** shadcn/ui defines CSS custom properties in `globals.css` that power all semantic variables. These tokens are the bridge between the design system and the component library.

### B. Semantic Variable Law

- **No Hardcoded Colors:** Directly using HEX, RGB, or static Tailwind classes (e.g., `bg-white`, `text-black`, `border-gray-200`) is strictly **FORBIDDEN**.
- **Semantic Mapping:** All UI elements must use our custom **OKLCH Semantic Variables** defined in `globals.css` (e.g., `bg-background`, `text-foreground`, `bg-card`, `border-border`). These variables are managed by the shadcn/ui theming system.
- **Mode Compatibility:** Every component must look polished and professional in both **Light** and **Dark** modes.

### C. Visual Consistency & Smart Aesthetics

- **Minimalist Color Palette:** Avoid using unnecessary colors for backgrounds and text. The website must not be "overly colorful." Focus on a "Simple and Smart Looking" aesthetic.
- **Radius Consistency:** All **Cards, Buttons, and Inputs** must maintain a consistent `border-radius`. Use the predefined `--radius` variable (currently set to `0.625rem`) to ensure harmony across the interface.
- **Brand Identity:** Always use the `--primary` and `--accent` tokens for brand identity, but avoid over-saturation.
- **Supportive Text:** Use `text-muted-foreground` for non-primary information.
- **Glassmorphism:** Use `backdrop-blur` combined with semi-transparent semantic backgrounds (e.g., `bg-background/80`) for modern overlays.

### D. Component Usage Standards

| UI Need      | Required shadcn/ui Component              | FORBIDDEN Alternative                 |
| ------------ | ----------------------------------------- | ------------------------------------- |
| Containers   | `<Card>`, `<CardHeader>`, `<CardContent>` | `<div className="bg-card border...">` |
| Buttons      | `<Button variant="...">`                  | `<button className="...">`            |
| Inputs       | `<Input>`, `<Textarea>`, `<Select>`       | `<input className="...">`             |
| Modals       | `<Dialog>`, `<AlertDialog>`, `<Sheet>`    | Custom modal `<div>`                  |
| Loading      | `<Skeleton>`, `<Spinner>`                 | Custom loading divs                   |
| Empty States | `<Empty>`                                 | Custom empty state divs               |
| Navigation   | `<Tabs>`, `<Breadcrumb>`, `<Pagination>`  | Custom tab/nav implementations        |
| Feedback     | `<Alert>`, Sonner toasts                  | `window.alert()` or custom toasts     |

---

## 7. Documentation & Planning Standards

1.  **Implementation Plans:** Create a subfolder in `documents/plans/[feature_name]/`.
    - `plan_overview.md`: UI/UX strategy, state requirements, and logic mapping.
    - `tasks_list.md`: Phase-by-phase implementation (Phase 1: Styles, Phase 2: Logic, Phase 3: API).
2.  **Architectural Memories:** Record core decisions in `documents/memories/` using ADR format (e.g., `001_redux_setup.md`).
3.  **Source of Truth:** Update `project_structure.md` and `project_specification.md` after every feature rollout.

---

## 8. Git & Workflow

- **Prefixes:**
  - `feat: [feature name]` — New functionality.
  - `fix: [bug name]` — Correction of a problem.
  - `refactor: [optimization]` — Improving code quality without changing behavior.
  - `docs: [update]` — Documentation changes.
- **Commits:** Ensure commit messages are clear and follow conventional standards. NEVER include any assistant identifiers in the commit.
