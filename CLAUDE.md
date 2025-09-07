# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with TurboPack on port 3000
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (next lint)
- `npm run typecheck` - Run TypeScript type checking (tsc --noEmit)

### AI Development (Genkit)
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with watch mode

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.2 with App Router
- **UI**: React 18 with TypeScript, Tailwind CSS, and Radix UI components
- **State Management**: React Context API (ToolProvider, SearchProvider, AnalyticsProvider, ThemeProvider, UserRoleProvider)
- **Forms**: react-hook-form with Zod validation
- **Voice**: Web Speech API for dictation
- **Analytics**: Recharts for visualizations
- **Storage**: IndexedDB + encrypted LocalStorage
- **AI**: Google Genkit with Firebase integration

### Directory Structure
- `src/app/(app)/` - Main application routes using App Router
  - Each route has its own `page.tsx` file
  - Routes include: analytics, batch, compare, dashboard, help, history, patients, research, settings, share, templates, tools
- `src/components/` - Reusable React components
  - `ui/` - Base UI components (shadcn/ui based)
  - `layout/` - Layout components (AppHeader, AppSidebar, Providers)
  - `role/` - Role selection and dashboard components
  - `batch/` - Batch assessment UI components
  - `analytics/` - Population analytics charts
  - `voice/` - Voice dictation components
- `src/lib/` - Core business logic
  - `tools/` - Medical assessment tool implementations (80+ tools)
  - `role-config.ts` - User role definitions
  - `batch-processor.ts` - Batch assessment logic
  - `analytics-engine.ts` - Population analytics
  - `alert-system.ts` - Clinical alerts
  - `export-formats/` - Research export utilities
- `src/hooks/` - Custom React hooks including:
  - `useUserRole` - Role management
  - `useBatchAssessment` - Batch workflows
  - `usePopulationAnalytics` - Cohort analysis
  - `useClinicalAlerts` - Threshold monitoring
  - `useVoiceDictation` - Speech-to-text
- `src/contexts/` - React Context providers

### Key Architecture Patterns

#### Tool System
The application is built around a medical assessment tool system. Each tool:
- Is defined in `src/lib/tools/[toolname].ts`
- Implements the `Tool` interface from `src/lib/types.ts`
- Contains form configuration, calculation logic, and metadata
- Is registered in `src/lib/tools/index.ts`

#### Component Conventions
- Use existing UI components from `src/components/ui/`
- Follow the established patterns for forms (ToolForm component)
- Maintain consistency with Tailwind CSS classes and Radix UI usage
- Components use client-side rendering by default (marked with "use client")

#### Provider Hierarchy
The app uses nested providers in `src/components/layout/Providers.tsx`:
1. ThemeProvider (dark/light mode)
2. AnalyticsProvider (usage tracking)
3. ToolProvider (tool state management)
4. SearchProvider (command palette)
5. KeyboardShortcutsProvider
6. SidebarProvider (navigation)

### Important Notes
- Path aliases use `@/` for `src/` directory
- Images are optimized with Next.js Image component
- PWA support with service worker and manifest
- All data processing is client-side only (no backend)
- Strict TypeScript configuration enabled
- Voice dictation requires HTTPS

### Recent Updates (v2.0)
- **Role-based dashboards**: 3 user types with custom layouts
- **Batch assessments**: Process multiple patients at once
- **Population analytics**: Cohort analysis and visualizations  
- **Clinical alerts**: Threshold-based monitoring
- **Quick entry mode**: Keyboard-first navigation (Ctrl+Q)
- **Voice dictation**: Speech-to-text for form fields
- **Assessment templates**: Reusable form configurations
- **Enhanced exports**: FHIR, REDCap, SPSS formats