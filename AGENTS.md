# Repository Guidelines

## Project Structure & Module Organization
- `src/app` – App Router entry (routes, layouts, server actions).
- `src/components` – Reusable UI components (React, TSX).
- `src/lib` – Utilities, types, and services. Note: code in `src/lib/tools` is chunked separately (see `next.config.ts`).
- `public/` – Static assets served at the site root.
- `docs/`, `templates/`, `scripts/` – Documentation, scaffolds, and helper scripts.
- `specs/` – Planning and product specs (not code tests).

## Build, Test, and Development Commands
- `npm run dev` – Start local dev server on `http://localhost:3000`.
- `npm run dev:turbo` – Dev with Next.js Turbo (faster rebuilds).
- `npm run build` – Production build into `.next/`.
- `npm start` – Run the production server.
- `npm run lint` – Lint using Next/ESLint rules.
- `npm run typecheck` – TypeScript checks with `--noEmit`.
- Optional: `npm run genkit:dev` / `genkit:watch` – Run the AI/dev tooling in `src/ai/dev.ts`.

## Coding Style & Naming Conventions
- Language: TypeScript (strict). Indent 2 spaces; prefer single quotes.
- React: Functional components; `PascalCase` component files in `src/components` (e.g., `CardList.tsx`).
- Routes: Lowercase, hyphenated segments under `src/app` (e.g., `src/app/user-settings/page.tsx`).
- Imports: Use the alias `@/*` for `src/*` (see `tsconfig.json`).
- Linting: `npm run lint` (auto-fix with `--fix` when appropriate). Keep Core Web Vitals rules green.

## Testing Guidelines
- E2E: Playwright is installed. Place tests under `tests/` or `e2e/` using `*.spec.ts` (e.g., `e2e/smoke.spec.ts`).
- Run: `npx playwright test` (first time, run `npx playwright install`).
- Unit tests: Not configured by default; prefer pragmatic integration/E2E coverage for critical flows in `src/app` and `src/lib`.
- Aim for reliable smoke coverage of routing, forms, and API endpoints.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
  - Examples: `feat: add dashboard filters`, `fix: debounce search input`.
- PRs must include: clear description, scope, screenshots for UI changes, linked issues, and a test plan.
- Requirements before review: `npm run lint` and `npm run typecheck` pass; update docs or templates as needed.

## Security & Configuration Tips
- Environment: Use `.env.local` for secrets (never commit). Only expose client-safe vars with `NEXT_PUBLIC_*`.
- Domains: Review `allowedDevOrigins` and `images.remotePatterns` in `next.config.ts` when adding hosts.
- Avoid importing server-only code into client components; keep sensitive logic in `src/lib` or server routes.
