# Tasks: SkinScores Comprehensive Dermatological Assessment Platform

**Input**: Design documents from `/specs/001-develop-skinscores-a/`
**Prerequisites**: plan.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓)

## Execution Flow Overview
Following TDD principles with RED-GREEN-Refactor cycle:
1. Setup and dependencies
2. Contract tests (MUST fail initially)
3. Implementation to make tests pass
4. Integration and polish

## Phase 3.1: Setup & Dependencies

- [ ] T001 Install voice dictation dependencies (fhir.js, PDFKit, PapaParse, ExcelJS) in package.json
- [ ] T002 [P] Create new route directories in src/app/(app)/dashboard/, src/app/(app)/studies/, src/app/(app)/alerts/, src/app/(app)/research/, src/app/(app)/supervision/
- [ ] T003 [P] Create new component directories in src/components/role/, src/components/batch/, src/components/analytics/, src/components/voice/
- [ ] T004 [P] Create new hook files in src/hooks/ (useUserRole.tsx, useStudyProtocol.tsx, usePopulationAnalytics.tsx, useClinicalAlerts.tsx, useVoiceDictation.tsx, useAssessmentTemplates.tsx, useAssessmentValidation.tsx)
- [ ] T005 [P] Create new library files in src/lib/ (role-config.ts, study-protocols.ts, analytics-engine.ts, alert-system.ts, validation-workflow.ts, export-formats/)

## Phase 3.2: Contract Tests (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] T006 [P] Contract test UserRoleService.getCurrentRole() in tests/contracts/user-role-service.test.ts
- [ ] T007 [P] Contract test UserRoleService.setRole() in tests/contracts/user-role-service.test.ts  
- [ ] T008 [P] Contract test UserRoleService.updatePreferences() in tests/contracts/user-role-service.test.ts
- [ ] T009 [P] Contract test StudyProtocolService.createStudy() in tests/contracts/study-protocol-service.test.ts
- [ ] T010 [P] Contract test StudyProtocolService.enrollPatient() in tests/contracts/study-protocol-service.test.ts
- [ ] T011 [P] Contract test AssessmentValidationService.submitForReview() in tests/contracts/assessment-validation-service.test.ts
- [ ] T012 [P] Contract test ClinicalAlertService.createAlert() in tests/contracts/clinical-alert-service.test.ts
- [ ] T013 [P] Contract test ClinicalAlertService.checkAlerts() in tests/contracts/clinical-alert-service.test.ts
- [ ] T014 [P] Contract test PopulationAnalyticsService.generateMetrics() in tests/contracts/population-analytics-service.test.ts
- [ ] T015 [P] Contract test PopulationAnalyticsService.compareCohorts() in tests/contracts/population-analytics-service.test.ts

## Phase 3.3: Hook Implementation (Core - ONLY after tests are failing)

- [ ] T016 [P] Implement useUserRole hook in src/hooks/useUserRole.tsx with role selection, permissions, and hierarchy
- [ ] T017 [P] Implement useStudyProtocol hook in src/hooks/useStudyProtocol.tsx with study management and enrollment
- [ ] T018 [P] Implement useClinicalAlerts hook in src/hooks/useClinicalAlerts.tsx with threshold monitoring
- [ ] T019 [P] Implement usePopulationAnalytics hook in src/hooks/usePopulationAnalytics.tsx with cohort analysis
- [ ] T020 [P] Implement useVoiceDictation hook in src/hooks/useVoiceDictation.tsx with Web Speech API
- [ ] T021 [P] Implement useAssessmentTemplates hook in src/hooks/useAssessmentTemplates.tsx with template management
- [ ] T022 [P] Implement useAssessmentValidation hook in src/hooks/useAssessmentValidation.tsx with student review workflow

## Phase 3.4: Library Implementation

- [ ] T023 [P] Create role configuration constants in src/lib/role-config.ts with permissions and default dashboards
- [ ] T024 [P] Implement study protocol logic in src/lib/study-protocols.ts for research management
- [ ] T025 [P] Create analytics engine in src/lib/analytics-engine.ts for population metrics calculations
- [ ] T026 [P] Implement alert system in src/lib/alert-system.ts for threshold monitoring
- [ ] T027 [P] Implement validation workflow in src/lib/validation-workflow.ts for student assessments
- [ ] T028 [P] Create export format handlers in src/lib/export-formats/ (fhir.ts, redcap.ts, spss.ts, csv.ts)

## Phase 3.5: Component Implementation

- [ ] T029 [P] Create RoleSelector component in src/components/role/RoleSelector.tsx
- [ ] T030 [P] Create DashboardWidget component in src/components/role/DashboardWidget.tsx
- [ ] T031 [P] Create StudyEnrollment component in src/components/studies/StudyEnrollment.tsx
- [ ] T032 [P] Create StudyCompliance component in src/components/studies/StudyCompliance.tsx
- [ ] T033 [P] Create ValidationQueue component in src/components/supervision/ValidationQueue.tsx
- [ ] T032 [P] Create AlertConfiguration component in src/components/analytics/AlertConfiguration.tsx
- [ ] T033 [P] Create PopulationCharts component in src/components/analytics/PopulationCharts.tsx
- [ ] T034 [P] Create VoiceInput component in src/components/voice/VoiceInput.tsx
- [ ] T035 [P] Create QuickEntryMode component in src/components/voice/QuickEntryMode.tsx

## Phase 3.6: Page Implementation  

- [ ] T038 Role-based dashboard pages in src/app/(app)/dashboard/page.tsx
- [ ] T039 Study protocol management in src/app/(app)/studies/page.tsx
- [ ] T040 Clinical alerts management in src/app/(app)/alerts/page.tsx
- [ ] T041 Research analytics dashboard in src/app/(app)/research/page.tsx
- [ ] T042 Supervision and review queue in src/app/(app)/supervision/page.tsx

## Phase 3.7: Integration Tests

- [ ] T043 [P] Integration test role switching with permissions in tests/integration/role-workflow.test.ts
- [ ] T044 [P] Integration test study enrollment and compliance in tests/integration/study-protocol.test.ts
- [ ] T045 [P] Integration test student assessment validation in tests/integration/assessment-validation.test.ts
- [ ] T046 [P] Integration test alert triggering and acknowledgment in tests/integration/clinical-alerts.test.ts
- [ ] T047 [P] Integration test analytics generation and export in tests/integration/population-analytics.test.ts
- [ ] T048 [P] Integration test voice dictation accuracy in tests/integration/voice-dictation.test.ts
- [ ] T049 [P] Integration test template creation and usage in tests/integration/assessment-templates.test.ts

## Phase 3.8: Data Migration & Storage

- [ ] T050 Create data migration utility in src/lib/migration/v2-migration.ts for existing users and role assignment
- [ ] T051 Update IndexedDB schema in src/lib/storage/database.ts with new collections
- [ ] T052 Implement encrypted storage for sensitive data in src/lib/security/encryption.ts

## Phase 3.9: E2E Test Implementation

- [ ] T053 [P] E2E test Attending physician dashboard workflow in tests/e2e/attending-workflow.spec.ts
- [ ] T054 [P] E2E test Resident clinical workflow with case flagging in tests/e2e/resident-workflow.spec.ts
- [ ] T055 [P] E2E test Student assessment and validation flow in tests/e2e/student-workflow.spec.ts
- [ ] T056 [P] E2E test Research assistant study management in tests/e2e/research-workflow.spec.ts
- [ ] T057 [P] E2E test Clinical alert notification flow in tests/e2e/alerts-workflow.spec.ts
- [ ] T058 [P] E2E test Voice dictation and quick entry modes in tests/e2e/input-modes.spec.ts

## Phase 3.10: Polish & Performance

- [ ] T059 [P] Unit tests for role configuration and permissions in tests/unit/role-config.test.ts
- [ ] T060 [P] Unit tests for study protocol logic in tests/unit/study-protocols.test.ts
- [ ] T061 [P] Unit tests for validation workflow in tests/unit/validation-workflow.test.ts
- [ ] T062 [P] Unit tests for analytics calculations in tests/unit/analytics-engine.test.ts
- [ ] T063 [P] Unit tests for alert system logic in tests/unit/alert-system.test.ts
- [ ] T064 Performance optimization for analytics queries (<2s for 1000+ assessments)
- [ ] T065 [P] Update CLAUDE.md with new features and workflows
- [ ] T066 Accessibility audit for role selection and validation interfaces
- [ ] T067 Mobile responsiveness testing for new dashboard layouts
- [ ] T068 Execute quickstart.md validation scenarios

## Dependencies

**Blocking Dependencies**:
- Setup (T001-T005) must complete before contract tests
- Contract tests (T006-T015) MUST be written and failing before implementation starts
- Hooks (T016-T021) block components that use them
- Library files (T022-T026) block hooks that depend on them
- Pages (T036-T039) require components and hooks to be complete
- Data migration (T046-T048) must complete before E2E tests
- Integration tests (T040-T045) require implementation to be complete

**Parallel Execution Groups**:
```
Group 1 (Setup): T002, T003, T004, T005
Group 2 (Contract Tests): T006-T015 (all parallel)
Group 3 (Hooks): T016-T021 (all parallel) 
Group 4 (Libraries): T022-T026 (all parallel)
Group 5 (Components): T027-T035 (all parallel)
Group 6 (Integration Tests): T040-T045 (all parallel)
Group 7 (E2E Tests): T049-T053 (all parallel)
Group 8 (Unit Tests): T054-T057 (all parallel)
```

## Validation Checklist
*GATE: Must verify before considering tasks complete*

- [ ] All contract tests written and initially failing
- [ ] UserRole entity has permissions hierarchy and dashboard implementation
- [ ] StudyProtocol entity has enrollment and compliance tracking
- [ ] AssessmentValidation entity has student review workflow
- [ ] ClinicalAlert entity has monitoring and notification system
- [ ] PopulationAnalytics entity has generation and export capabilities
- [ ] Voice dictation works with Web Speech API
- [ ] Assessment templates save and load correctly
- [ ] All four role dashboards display appropriate widgets and permissions
- [ ] Study enrollment tracks individual patient assessments correctly
- [ ] Student assessments require attending approval when submitted
- [ ] Analytics generate for 1000+ assessments in <2s
- [ ] Export formats (FHIR, REDCap, SPSS, CSV) work correctly
- [ ] Data migration assigns existing users to 'attending' role
- [ ] Quick entry mode reduces assessment time by 50%
- [ ] All E2E scenarios from quickstart.md pass
- [ ] Mobile and accessibility requirements met

## Performance Requirements

All implementations must meet these benchmarks:
- Role switch: < 100ms
- Tool load with new features: < 200ms  
- Calculation time: < 50ms
- Batch save: < 500ms per patient
- Analytics generation: < 2s for 1000 assessments
- Export processing: < 3s for 10,000 records
- Voice dictation response: < 1s
- Template loading: < 100ms

## Notes

- Tasks marked [P] can run in parallel (different files, no dependencies)
- Follow TDD strictly: RED (failing test) → GREEN (make it pass) → REFACTOR
- Commit after each task completion
- Voice dictation requires HTTPS in production
- All data processing remains client-side (no backend)
- Export formats must validate against respective schemas
- Role-based features require proper permission checks per hierarchy:
  - Attending: Full access, can approve student assessments
  - Resident: Clinical access, can flag for review
  - Student: Supervised access, assessments require approval
  - Research Assistant: Study management only, no clinical access
- Study protocols track individual assessments, not batch entry
- Analytics calculations use existing patient/assessment data
- Migration utility must handle data from version 1.x to 2.0.0