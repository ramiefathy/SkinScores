# Implementation Plan: SkinScores Comprehensive Dermatological Assessment Platform

**Branch**: `001-develop-skinscores-a` | **Date**: 2025-01-06 | **Spec**: [/specs/001-develop-skinscores-a/spec.md]
**Input**: Feature specification from `/specs/001-develop-skinscores-a/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, or `GEMINI.md` for Gemini CLI).
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Develop a comprehensive dermatological assessment platform that enhances the existing 80+ tool catalog with role-based dashboards reflecting medical hierarchy (attending, resident, student, research assistant), study protocol management for research, population-level analytics, clinical threshold alerts, voice dictation, and advanced research export features. The system will provide appropriate permissions and workflows for each role while maintaining individual patient assessment integrity.

## Technical Context
**Language/Version**: TypeScript 5.x / JavaScript ES2022
**Primary Dependencies**: Next.js 15.2, React 18, Tailwind CSS, Radix UI, react-hook-form, Zod, Recharts
**Storage**: LocalStorage (encrypted) with IndexedDB for larger datasets
**Testing**: Jest, React Testing Library, Playwright (E2E)
**Target Platform**: Web (Progressive Web App), mobile-responsive
**Project Type**: web - Next.js App Router based application
**Performance Goals**: <200ms tool load time, <50ms calculation time, offline-capable
**Constraints**: All data processing client-side, no backend servers, HIPAA-compliant data handling
**Scale/Scope**: 4 user roles with hierarchy, 80+ tools, 1000+ patients per instance, 10k+ assessments

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 1 (single Next.js application with client-side only)
- Using framework directly? Yes (Next.js App Router, React hooks)
- Single data model? Yes (unified patient/assessment/analytics model)
- Avoiding patterns? Yes (no unnecessary abstractions)

**Architecture**:
- EVERY feature as library? Yes - modular hooks and utilities
- Libraries listed:
  - useUserRole: Role selection with permissions and hierarchy
  - useStudyProtocol: Research study management and compliance
  - usePopulationAnalytics: Cohort analysis and visualizations
  - useClinicalAlerts: Threshold monitoring and notifications
  - useVoiceDictation: Speech-to-text integration
  - useAssessmentTemplates: Template creation and management
  - useResearchExport: Advanced export formatting
  - useAssessmentValidation: Student assessment approval workflow
- CLI per library: N/A (browser-based application)
- Library docs: JSDoc + TypeScript definitions

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? Yes
- Git commits show tests before implementation? Yes
- Order: Contract→Integration→E2E→Unit strictly followed? Yes
- Real dependencies used? Yes (actual browser APIs, IndexedDB)
- Integration tests for: new hooks, data flow, state management

**Observability**:
- Structured logging included? Yes (console + error boundary)
- Frontend logs → backend? N/A (client-only)
- Error context sufficient? Yes (user action tracking)

**Versioning**:
- Version number assigned? 2.0.0 (major feature addition)
- BUILD increments on every change? Yes
- Breaking changes handled? Yes (data migration for existing users)

## Project Structure

### Documentation (this feature)
```
specs/001-develop-skinscores-a/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Next.js App Router Structure (existing)
src/
├── app/(app)/
│   ├── dashboard/       # NEW: Role-specific dashboards
│   ├── studies/        # NEW: Study protocol management
│   ├── alerts/         # NEW: Clinical alerts management
│   ├── research/       # NEW: Research analytics
│   └── supervision/    # NEW: Student assessment review
├── components/
│   ├── role/           # NEW: Role selection components
│   ├── batch/          # NEW: Batch assessment UI
│   ├── analytics/      # NEW: Population analytics charts
│   └── voice/          # NEW: Voice dictation UI
├── hooks/
│   ├── useUserRole.tsx      # NEW
│   ├── useStudyProtocol.tsx # NEW
│   ├── usePopulationAnalytics.tsx # NEW
│   ├── useClinicalAlerts.tsx # NEW
│   ├── useVoiceDictation.tsx # NEW
│   ├── useAssessmentTemplates.tsx # NEW
│   └── useAssessmentValidation.tsx # NEW
└── lib/
    ├── role-config.ts       # NEW: Role definitions with permissions
    ├── study-protocols.ts   # NEW: Study management logic
    ├── analytics-engine.ts  # NEW: Analytics calculations
    ├── alert-system.ts      # NEW: Alert management
    ├── validation-workflow.ts # NEW: Assessment approval logic
    └── export-formats/      # NEW: Research export formats
```

**Structure Decision**: Single Next.js application with feature modules

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - Quick-entry mode UI/UX patterns
   - Voice dictation field selection
   - EMR export format standards
   - Research database export formats
   - Tool update process and frequency

2. **Generate and dispatch research agents**:
   ```
   Task 1: "Research quick-entry UI patterns for medical forms"
   Task 2: "Find Web Speech API best practices for form dictation"
   Task 3: "Research HL7 FHIR and common EMR export formats"
   Task 4: "Investigate research data formats (SPSS, REDCap, CSV)"
   Task 5: "Design tool versioning and update notification system"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - UserRole entity with permissions, hierarchy, and dashboard config
   - StudyProtocol entity for research study management
   - ClinicalAlert entity for threshold monitoring
   - AssessmentTemplate entity for quick workflows
   - PopulationMetrics entity for analytics
   - AssessmentValidation entity for student approval workflow

2. **Generate API contracts** from functional requirements:
   - Role selection interface
   - Batch assessment workflow
   - Alert configuration API
   - Analytics query interface
   - Export format specifications

3. **Generate contract tests** from contracts:
   - Role switching behavior tests
   - Batch processing validation
   - Alert trigger scenarios
   - Analytics calculation accuracy
   - Export format compliance

4. **Extract test scenarios** from user stories:
   - Resident dashboard optimization test
   - Research coordinator batch workflow
   - Clinical alert notification flow
   - Population analytics generation
   - Voice dictation integration

5. **Update agent file incrementally** (O(1) operation):
   - Add new features to CLAUDE.md
   - Update tech stack with new libraries
   - Document new user workflows

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, CLAUDE.md update

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each new hook → test + implementation task [P]
- Each new route → page component task [P]
- Each user story → integration test task
- Data migration task for existing users

**Ordering Strategy**:
- TDD order: Tests before implementation
- Core features first: Role selection → Dashboards → Batch → Analytics
- UI components after hooks
- Migration utilities last

**Estimated Output**: 30-35 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*No violations - design follows simplicity principles*

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved: COMPLETE
- [x] Complexity deviations documented: NONE

---
*Based on Next.js best practices and existing SkinScores architecture*