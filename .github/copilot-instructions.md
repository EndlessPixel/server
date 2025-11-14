**Repository Overview**

This repository is a Next.js (App Router) website for the EndlessPixel server. Key directories:

- `app/` : Next.js App Router pages, layouts and nested routes (entry point: `app/layout.tsx`, pages like `app/page.tsx`).
- `components/` : React components. UI primitives are under `components/ui/` (e.g. `button.tsx`, `input.tsx`).
- `app/api/` : Edge/server API routes (e.g. `app/api/auth/*`).
- `lib/` : small helpers and data sources (e.g. `lib/launcherMeta.ts`).
- `public/` : static assets and `manifest.json`.

**How to run & build**

- Install dependencies: `npm install`
- Start dev server: `npm run dev` (dev at `http://localhost:3000`).
- Build: `npm run build` and `npm start` for production.
- Lint: `npm run lint`.

Notes: `next.config.mjs` disables image optimization and ignores TypeScript/eslint build errors. Agents should not assume CI will enforce TS types unless changed.

**Architecture & Patterns (important for code changes)**

- App Router (server + client components): check for `"use client"` at top of files when modifying components that use browser-only APIs.
- Shared UI primitives: prefer updating and reusing components in `components/ui/`. These act as the design system (Radix primitives + Tailwind/CVA). Example: to change button variants, update `components/ui/button.tsx` and then update consumers.
- Styling: Tailwind CSS + `class-variance-authority` (CVA) patterns are used. Keep utility class patterns consistent with existing components.
- Data & helpers: business logic and small data lives in `lib/` (e.g. `lib/launcherMeta.ts`), not scattered in pages.
- API & server interactions: API routes live under `app/api`. For server-side fetching in pages, prefer using Next.js server components or fetch helpers in `lib/`.

**Conventions & gotchas**

- TypeScript and ESLint: `next.config.mjs` sets `ignoreBuildErrors: true` and `ignoreDuringBuilds: true`. Fixing type or lint errors is still encouraged, but be aware builds may succeed despite type problems.
- Next.js version: project uses `next` v15 — be mindful of App Router conventions and stable/experimental APIs.
- Image handling: `images.unoptimized: true` — images are not processed by Next; treat large images carefully.
- No test harness found: repository does not include automated tests. Rely on local `npm run dev` checks and manual validation.

**Key files to inspect for context**

- `app/layout.tsx` : global layout & providers
- `app/page.tsx` and subfolders (e.g. `downloads/`, `wiki/`) : canonical page structure
- `components/LauncherDownloadPage.tsx` : example feature component (launcher download flow)
- `components/ui/` : design system primitives (button, input, toast, etc.)
- `lib/launcherMeta.ts` : domain data example
- `next.config.mjs` : build/runtime flags
- `package.json` : scripts & dependencies

**External dependencies & integrations**

- UI: Radix UI, Tailwind CSS, CVA, Lucide icons
- Runtime: Next.js, React 18
- Others: `vaul`, `sonner`, `recharts`, various UI libs — prefer existing patterns over introducing new UI libraries.

**PR guidance for AI edits**

- Small changes (fix a single component or bug): run `npm run dev` locally and verify the affected page renders as expected.
- Larger changes touching primitives (`components/ui/*`): update the primitive, then run the dev server and smoke-test pages that import it (e.g. home page, downloads page).
- When adding new API endpoints, follow existing folder structure under `app/api/` and use `lib/` helpers where appropriate.

**Examples**

- To update a page layout: edit `app/layout.tsx` (affects entire site). Verify with `npm run dev`.
- To change launcher metadata displayed on the downloads page: edit `lib/launcherMeta.ts` then `components/LauncherDownloadPage.tsx` will pick it up.

If any part of these notes is unclear or you want me to include more specific code examples (e.g. a template PR, component refactor checklist, or example unit-test scaffold), tell me which section to expand.
