# Data Model: SkinScores Platform Enhancement

**Feature**: SkinScores Comprehensive Dermatological Assessment Platform  
**Date**: 2025-01-06  
**Version**: 1.0.0

## Overview
This document defines the data structures for the SkinScores platform enhancements, including role-based access, batch assessments, population analytics, clinical alerts, and assessment templates.

## Core Entities

### UserRole
Represents a healthcare professional's role with hierarchical permissions and preferences.

```typescript
interface UserRole {
  id: string; // 'attending' | 'resident' | 'student' | 'research_assistant'
  displayName: string;
  selectedAt: Date;
  permissions: RolePermissions;
  preferences: UserPreferences;
  dashboardConfig: DashboardConfig;
  supervisionLevel: 'independent' | 'review_available' | 'supervision_required' | 'view_only';
}

interface RolePermissions {
  canFinalizeAssessment: boolean;      // attending: true, resident: true, student: false
  canApproveAssessments: boolean;      // attending: true, others: false
  requiresSupervision: boolean;        // student: true, others: false
  canExportClinicalData: boolean;      // attending/resident: true, others: false
  canManageStudyProtocols: boolean;    // research_assistant: true, others: limited
  canViewAllPatients: boolean;         // attending: true, others: limited
  canFlagForReview: boolean;           // resident/student: true
}

interface UserPreferences {
  favoriteTools: string[]; // Tool IDs
  recentTools: string[]; // Last 10 used tools
  defaultView: 'grid' | 'list' | 'compact';
  quickEntryEnabled: boolean;
  voiceDictationEnabled: boolean;
  autoSaveCalculations: boolean;
  alertSettings: AlertPreferences;
}

interface DashboardConfig {
  widgets: DashboardWidget[];
  layout: 'clinical' | 'research' | 'learning';
  theme: 'light' | 'dark' | 'system';
}

interface DashboardWidget {
  id: string;
  type: 'recent-tools' | 'patient-stats' | 'alerts' | 'quick-actions' | 'learning-resources' | 
        'supervision-queue' | 'case-log' | 'study-protocols' | 'pending-reviews';
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
}
```

### StudyProtocol
Manages research study configuration and patient enrollment.

```typescript
interface StudyProtocol {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string; // Research assistant ID
  status: 'planning' | 'active' | 'completed' | 'suspended';
  requiredAssessments: AssessmentRequirement[];
  visitSchedule: StudyVisit[];
  enrolledPatients: PatientEnrollment[];
  metadata: StudyMetadata;
}

interface AssessmentRequirement {
  toolId: string;
  visits: string[]; // Which visits require this tool
  isRequired: boolean;
  timeWindow?: { min: number; max: number }; // Days from target date
}

interface StudyVisit {
  id: string;
  name: string; // e.g., "Baseline", "Week 4", "Week 12"
  targetDay: number; // Days from enrollment
  allowedWindow: { before: number; after: number }; // Days
}

interface PatientEnrollment {
  patientId: string;
  enrollmentDate: Date;
  status: 'active' | 'completed' | 'withdrawn';
  completedVisits: CompletedVisit[];
  nextVisitDue?: Date;
}

interface CompletedVisit {
  visitId: string;
  completedDate: Date;
  assessments: { toolId: string; assessmentId: string }[];
  compliance: 'on_time' | 'late' | 'early';
}

interface StudyMetadata {
  protocol?: string;
  principalInvestigator?: string;
  irbApproval?: string;
  targetEnrollment: number;
  tags: string[];
}
```

### AssessmentValidation
Manages the approval workflow for student assessments.

```typescript
interface AssessmentValidation {
  id: string;
  assessmentId: string;
  studentId: string;
  patientId: string;
  toolId: string;
  submittedAt: Date;
  status: 'pending_review' | 'approved' | 'needs_revision' | 'rejected';
  reviewer?: string; // Attending ID
  reviewedAt?: Date;
  feedback?: ValidationFeedback;
}

interface ValidationFeedback {
  overallComments: string;
  fieldCorrections: FieldCorrection[];
  educationalNotes: string[];
  approvalStatus: 'approved' | 'approved_with_corrections' | 'needs_resubmission';
}

interface FieldCorrection {
  fieldId: string;
  studentValue: any;
  correctedValue: any;
  explanation: string;
}
```

### ClinicalAlert
Threshold-based monitoring for patient assessments.

```typescript
interface ClinicalAlert {
  id: string;
  patientId: string;
  toolId: string;
  metric: string; // e.g., 'score', 'interpretation.severity'
  condition: 'above' | 'below' | 'equals' | 'change';
  threshold: number | string;
  changeThreshold?: number; // For 'change' condition
  enabled: boolean;
  createdAt: Date;
  lastChecked: Date;
  triggeredCount: number;
  notifications: AlertNotification[];
}

interface AlertNotification {
  id: string;
  alertId: string;
  triggeredAt: Date;
  assessmentId: string;
  value: number | string;
  previousValue?: number | string;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  notes?: string;
}

interface AlertPreferences {
  enabledAlerts: string[]; // Alert IDs
  notificationMethod: 'dashboard' | 'popup' | 'sound' | 'all';
  soundEnabled: boolean;
  groupByPatient: boolean;
}
```

### AssessmentTemplate
Pre-configured assessment workflows for common scenarios.

```typescript
interface AssessmentTemplate {
  id: string;
  name: string;
  description: string;
  toolId: string;
  category: 'routine' | 'initial' | 'followup' | 'research';
  createdBy: string; // User role ID
  createdAt: Date;
  lastUsed?: Date;
  useCount: number;
  inputs: TemplateInput[];
  tags: string[];
  isPublic: boolean; // Shareable across users
}

interface TemplateInput {
  fieldId: string;
  value: any;
  locked: boolean; // Cannot be changed during use
  note?: string; // Guidance for the user
}
```

### PopulationMetrics
Aggregated analytics across patient cohorts.

```typescript
interface PopulationMetrics {
  id: string;
  generatedAt: Date;
  toolId: string;
  cohortFilter: CohortFilter;
  metrics: MetricsSummary;
  distributions: Distribution[];
  trends: TrendData[];
}

interface CohortFilter {
  patientIds?: string[]; // Specific patients
  dateRange?: { start: Date; end: Date };
  tags?: string[];
  minAssessments?: number;
  includeAnonymous: boolean;
}

interface MetricsSummary {
  totalPatients: number;
  totalAssessments: number;
  averageScore: number;
  medianScore: number;
  standardDeviation: number;
  severityBreakdown: Record<string, number>; // e.g., { mild: 23, moderate: 45, severe: 12 }
  improvementRate: number; // Percentage showing improvement
}

interface Distribution {
  metric: string;
  type: 'histogram' | 'box' | 'violin';
  bins: DistributionBin[];
  outliers: number[];
}

interface DistributionBin {
  range: [number, number];
  count: number;
  percentage: number;
  patientIds: string[]; // For drill-down
}

interface TrendData {
  period: 'daily' | 'weekly' | 'monthly';
  points: TrendPoint[];
  regression: {
    slope: number;
    intercept: number;
    r2: number;
  };
}

interface TrendPoint {
  date: Date;
  value: number;
  count: number; // Number of assessments
  confidence: number; // Statistical confidence
}
```

### VoiceDictationSession
Manages voice input state and processing.

```typescript
interface VoiceDictationSession {
  id: string;
  fieldId: string;
  startedAt: Date;
  endedAt?: Date;
  status: 'listening' | 'processing' | 'completed' | 'error';
  transcript: string;
  confidence: number;
  alternativeTranscripts?: string[];
  finalValue?: any; // Processed value after normalization
  corrections: DictationCorrection[];
}

interface DictationCorrection {
  original: string;
  corrected: string;
  timestamp: Date;
  type: 'manual' | 'auto';
}
```

### ResearchExport
Configuration for data exports.

```typescript
interface ResearchExport {
  id: string;
  name: string;
  createdAt: Date;
  format: 'fhir' | 'redcap' | 'spss' | 'csv' | 'json' | 'xlsx';
  config: ExportConfig;
  filters: ExportFilter;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  outputUrl?: string; // Blob URL for download
  metadata: ExportMetadata;
}

interface ExportConfig {
  includePatientIds: boolean;
  anonymizationLevel: 'none' | 'partial' | 'full';
  dateFormat: string;
  missingValueHandling: 'blank' | 'null' | 'NA' | 'custom';
  customMissingValue?: string;
  includeMetadata: boolean;
  compression: boolean;
}

interface ExportFilter {
  tools?: string[];
  patients?: string[];
  dateRange?: { start: Date; end: Date };
  minimumAssessments?: number;
  tags?: string[];
}

interface ExportMetadata {
  totalRecords: number;
  exportedFields: string[];
  dataVersion: string;
  generatedBy: string;
  checksum: string; // For data integrity
}
```

## Relationships

### Entity Relationships
1. **UserRole** → **StudyProtocol**: Research assistants can create and manage protocols
2. **UserRole** → **AssessmentTemplate**: Any role can create templates
3. **UserRole** → **AssessmentValidation**: Students submit, attendings review
4. **Patient** → **ClinicalAlert**: One patient can have many alerts
5. **Patient** → **PatientEnrollment**: Patients can be enrolled in multiple studies
6. **Tool** → **ClinicalAlert**: One tool can be monitored by many alerts
7. **Tool** → **PopulationMetrics**: One tool can have many metric calculations
8. **Assessment** → **AssessmentValidation**: Student assessments require validation
9. **Assessment** → **VoiceDictationSession**: One assessment can have many dictation sessions
10. **StudyProtocol** → **PatientEnrollment**: One study has many enrolled patients

### Data Flow
1. **Role Selection** → Updates UserRole → Configures Dashboard with Permissions
2. **Study Creation** → Creates StudyProtocol → Enrolls Patients → Tracks Compliance
3. **Student Assessment** → Creates Assessment → Triggers Validation → Attending Reviews → Approval/Feedback
4. **Alert Configuration** → Creates ClinicalAlert → Monitors Assessments → Triggers Notifications
5. **Template Creation** → Saves AssessmentTemplate → Speeds up Future Assessments
6. **Analytics Request** → Filters Data → Generates PopulationMetrics → Enables Export

## Storage Strategy

### IndexedDB Collections
- `userRoles`: Current user role, permissions, and preferences
- `studyProtocols`: Research study configurations and enrollments
- `assessmentValidations`: Student assessment review queue
- `clinicalAlerts`: Alert configurations and history
- `assessmentTemplates`: User and shared templates
- `populationMetrics`: Cached analytics results
- `voiceSessions`: Temporary dictation data
- `exportQueue`: Pending and completed exports

### LocalStorage Keys
- `skinscores_current_role`: Active user role ID
- `skinscores_quick_entry_enabled`: Quick entry mode flag
- `skinscores_voice_enabled`: Voice dictation flag
- `skinscores_alert_acknowledgments`: Recent alert acknowledgments
- `skinscores_export_preferences`: Last used export settings

## Migration Strategy

### From Version 1.x to 2.0
1. **Preserve existing data**: All current patient and assessment data remains intact
2. **Add role defaults**: Existing users get 'attending' role by default
3. **Initialize permissions**: Set appropriate permissions based on role
4. **Initialize preferences**: Copy existing preferences to UserRole.preferences
5. **Create indexes**: Add new IndexedDB indexes for performance
6. **Backward compatibility**: Maintain old localStorage keys for 6 months

### Data Validation Rules
1. **Role IDs**: Must be one of predefined values
2. **Patient IDs**: Must be encrypted using existing encryption
3. **Timestamps**: All dates in ISO 8601 format
4. **Scores**: Validated against tool-specific ranges
5. **Templates**: Must reference valid tool IDs
6. **Exports**: Anonymization required for research exports

## Performance Considerations

### Indexing Strategy
- Index on `patientId` + `toolId` for timeline queries
- Index on `createdAt` for date range queries
- Index on `status` for validation queue filtering
- Index on `studyProtocolId` + `visitId` for compliance tracking
- Composite index on `toolId` + `metric` for population analytics

### Data Limits
- Maximum 1000 patients per study protocol
- Maximum 10000 assessments per analytics query
- Export size limit: 100MB uncompressed
- Alert check frequency: Maximum once per minute
- Voice dictation timeout: 30 seconds per field
- Validation queue limit: 100 pending reviews per attending

## Security & Privacy

### Data Encryption
- Patient IDs: Encrypted using existing `encryptPatientId()` function
- Sensitive fields: Encrypted at rest in IndexedDB
- Export data: Optional encryption for file downloads
- Voice transcripts: Deleted after processing

### Access Control
- Role-based dashboard access with hierarchical permissions
- Student assessments require attending approval
- Research assistants limited to de-identified data
- Template sharing requires explicit permission
- Export audit trail maintained
- Alert acknowledgments tracked by user role

## Future Extensibility

### Planned Enhancements
1. **Multi-language support**: Structure supports localization
2. **Team collaboration**: Shared assessments and comments
3. **AI assistance**: Suggested values based on history
4. **Custom tools**: User-created assessment tools
5. **Integration hooks**: Third-party system connections