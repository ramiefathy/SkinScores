# Repository Guidelines

## Project Structure & Module Organization

- `src/tools/` contains the full catalogue of scoring instruments. Each module exports a `Tool`
  object (inputs, validation, calculation logic). Metadata lives in `tool-metadata.ts` and loads via
  the lazy loader.
- UI is routed through `src/routes/` (library, calculators, patients, analytics) and uses hooks in
  `src/hooks/` plus service helpers in `src/services/`.
- Firebase integrations sit under `src/firebase/` (client SDK) and `functions/` (callable/cloud
  tasks compiled to `functions/lib/`).
- `scripts/` houses maintenance utilities (`seed-emulator.cjs`, `clear-aggregates.mjs`).
- Firestore rules/indexes live at the repository root; config samples remain in `.env.example`.

## Build, Test, and Development Commands

- `npm install` – install workspace dependencies (and `npm install` inside `functions/` when Cloud
  Functions change).
- `npm run dev` – Vite dev server with hot reload.
- `npm run build` / `npm run preview` – production bundle build + local preview.
- `npm run lint`, `npm run typecheck` – enforce ESLint (with Prettier) and TypeScript strict mode.
- `npm run test` / `npm run test:watch` – Vitest suite via Firebase emulators.
- `npm run emulators` – launch Firebase emulators for manual QA.
- `npm run seed:emulator` – seed the auth emulator with the default clinician user.
- `npm run clear:aggregates` – delete all documents in `aggregateSnapshots` (run before deploy).

## Coding Style & Naming Conventions

- Prettier manages formatting (2 spaces, single quotes, trailing commas). Run `npm run format` before
  committing larger changes.
- React files follow PascalCase for components (`LibraryPage.tsx`), camelCase for utilities, and
  `use`-prefix for hooks.
- Keep shared types in `src/types/`; colocate domain-specific schemas near their consumers. Tool
  definitions should lean on `getValidationSchema` helpers where possible.
- Avoid hard-coded Firebase project IDs; use `import.meta.env` and centralized helpers in
  `src/firebase/`.

## Testing Guidelines

- Maintain or add Vitest coverage when introducing new tools or changing core services. The tools
  catalogue test (`src/__tests__/tools.load.test.ts`) must stay green.
- Prefer Testing Library queries for UI specs and run against emulators where Firestore/Functions
  behaviour matters (`npm run test`).
- QA flows involving aggregate analytics should include at least one numeric and one textual tool to
  ensure averages remain stable and the UI defaults gracefully.

## Commit & Pull Request Guidelines

- Use concise, imperative subjects (e.g., `Add PASI calculator`). Mention follow-up tasks (e.g.,
  `clear aggregateSnapshots in prod`) in commit bodies or PR descriptions.
- Link tracking issues with `Closes #123` when applicable, and summarize local testing (lint/typecheck/test/emulator usage) in PR descriptions.

## Security & Configuration Tips

- Copy `.env.example` to `.env` and populate Firebase web config locally; never check secrets into
  the repo.
- Deploy `functions/` alongside updated `firestore.rules`/`storage.rules`. Remember to purge
  `aggregateSnapshots` with `npm run clear:aggregates` before production deploys if legacy data is
  present.
- Review Firestore usage after large tool submissions (each save writes to `scoreSessions` and
  `scoreResults`). Add indexes to `firestore.indexes.json` as necessary.
