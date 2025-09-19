# SkinScores Clinical Workspace

SkinScores is a Vite + React (TypeScript) application backed by Firebase. It now ships with a
front-end tool runtime capable of rendering and calculating 70+ dermatology scoring and screening
instruments, with results persisted through callable Cloud Functions.

## Prerequisites

- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- (optional) Java 17+ for the Firebase emulator suite

## Project Layout

```
src/
  firebase/        # Firebase client wrappers (auth/firestore/functions)
  hooks/           # React Query hooks (auth, tools, sessions, analytics, etc.)
  routes/          # Route components (library, calculators, analytics, patients…)
  services/        # Client-side service helpers (tools metadata, sessions, results)
  tools/           # Rich tool definitions + lazy loader (70+ calculators)
  utils/           # Shared utilities (result formatting, Firestore helpers)
functions/
  src/index.ts     # Cloud Functions: calculateScore, submitToolResult, nightly aggregates
scripts/
  clear-aggregates.mjs  # Utility to purge `aggregateSnapshots`
```

## Key npm Scripts

| Command                    | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| `npm run dev`              | Start the Vite dev server on http://localhost:5173            |
| `npm run lint`             | ESLint with TypeScript + Prettier rules                       |
| `npm run typecheck`        | TypeScript type checking (no emit)                            |
| `npm run test`             | Vitest via Firebase emulators (auth, Firestore, functions)    |
| `npm run build`            | TypeScript compile + production bundle                        |
| `npm run emulators`        | Launch Firebase emulators locally                             |
| `npm run seed:emulator`    | Seed the auth emulator with the default clinician account     |
| `npm run clear:aggregates` | Remove all docs from `aggregateSnapshots` (use before deploy) |

> The old template seeding scripts have been removed. Calculators now live in code under
> `src/tools` and load lazily at runtime.

## Firebase Functions Overview

- `calculateScore` – legacy callable retained for existing sessions that use the Braden Scale
  pipeline.
- `submitToolResult` – accepts arbitrary tool IDs, inputs, and calculation payloads produced by the
  new runtime and persists both session and result documents.
- `generateResultExport` – streams stored results (now aware of numeric & non-numeric scores).
- `nightlyScoreAggregation` – summarizes daily usage; it now records both total submissions and the
  subset with numeric scores to support analytics for textual tools.

Deploy all functions with:

```bash
firebase deploy --only functions
```

## Data Maintenance

- **Aggregates** – before deploying, clear `aggregateSnapshots` if you have legacy data:

  ```bash
  npm run clear:aggregates -- --project=YOUR_PROJECT_ID
  ```

  The script honors `FIRESTORE_EMULATOR_HOST` if you prefer to run against the emulator.

- **Historical sessions** – legacy `scoreSessions`/`scoreResults` documents remain readable. New
  submissions flow through the `submitToolResult` function and include `scoreText`/`details` for
  non-numeric outcomes.

## Manual QA Checklist

1. Library page lists all tools and deep links to `/calculators/:slug`.
2. Submit at least one numeric tool (e.g., PASI) and one textual tool (e.g., ABCDE) – verify patient
   history, dashboard, and analytics render appropriately.
3. Download exports (text/CSV) from the patient detail view and confirm textual scores appear.
4. Run `npm run test` (inc. `__tests__/tools.load.test.ts`) to ensure every tool definition loads.

## Adding / Updating Tools

1. Create or edit the relevant module in `src/tools` (see existing examples).
2. Add metadata (name, condition, keywords) in `src/tools/tool-metadata.ts`.
3. Tests automatically ensure the tool loads successfully.
4. If the tool emits non-numeric results, the nightly aggregator will still include it in the total
   count; only numeric scores feed the average/min/max.

## Firestore Rules

Rules now cover sessions, results, patients, and users. Templates are no longer stored in
Firestore. Run `npm run test` to execute `firestore.rules.test.ts` against the emulator.

## Deployment Checklist

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `PATH=/opt/homebrew/opt/openjdk@17/bin:$PATH npm run test`
- [ ] `npm run clear:aggregates -- --project=<id>` against the target project
- [ ] `firebase deploy --only functions`
- [ ] Confirm Cloud Firestore indexes/rules are published
- [ ] Smoke test the deployed environment (library, calculators, exports, analytics)
# Trigger CI
# Trigger rebuild with Firebase config
