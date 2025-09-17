# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SkinScores is a clinical dermatology scoring workspace built with:
- Frontend: Vite + React (TypeScript) + Material-UI
- Backend: Firebase (Firestore, Auth, Cloud Functions)
- Tools: 70+ dermatology calculators and screening instruments

## Essential Commands

### Development
```bash
npm run dev              # Start Vite dev server (http://localhost:5173)
npm run emulators        # Start Firebase emulators
npm run seed:emulator    # Seed auth emulator with default clinician account
```

### Quality Checks
```bash
npm run lint             # ESLint with TypeScript + Prettier
npm run typecheck        # TypeScript type checking (no emit)
npm run test             # Vitest via Firebase emulators (requires Java 17+)
```

### Building & Deployment
```bash
npm run build            # TypeScript compile + production bundle
npm run clear:aggregates # Clear aggregateSnapshots before deploy
firebase deploy --only functions
```

### Testing Single Test
```bash
npm run test -- path/to/test.spec.ts
```

## Architecture Overview

### Frontend Structure
- **Routes**: App uses React Router v6 with protected/public routes
- **State Management**: React Query for server state, Zustand for client state
- **Tool Runtime**: Lazy-loaded calculator definitions in `src/tools/` with dynamic import
- **Firebase Integration**: Wrapped in `src/firebase/` with custom hooks in `src/hooks/`

### Key Directories
- `src/tools/`: Individual calculator modules + `tool-metadata.ts` + lazy loader
- `src/hooks/`: React Query hooks for auth, sessions, results, analytics
- `src/services/`: Business logic for tools, sessions, results formatting
- `functions/src/`: Cloud Functions for score calculation, result submission, aggregation

### Data Flow
1. User selects tool from library → navigates to `/calculators/:slug`
2. Tool definition lazy-loaded from `src/tools/`
3. User inputs data → frontend calculates result
4. Result submitted via `submitToolResult` Cloud Function
5. Persists to `scoreSessions` and `scoreResults` collections
6. Nightly aggregation updates analytics

### Cloud Functions
- `calculateScore`: Legacy function for Braden Scale compatibility
- `submitToolResult`: Primary function for new tool submissions (numeric & text results)
- `generateResultExport`: Exports patient results (CSV/text)
- `nightlyScoreAggregation`: Daily usage statistics

### Important Notes
- Tools no longer stored in Firestore - all defined in code
- ESLint ignores `src/tools/` directory
- Tests automatically verify all tools load successfully
- Non-numeric tools supported (textual results stored in `scoreText`/`details`)

## Java 17 Requirement
For Firebase emulators/tests: `PATH=/opt/homebrew/opt/openjdk@17/bin:$PATH npm run test`