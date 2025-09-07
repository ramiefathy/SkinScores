/**
 * Study Protocol Management Contract
 * Defines interfaces for research study configuration and patient enrollment
 */

import { z } from 'zod';

// Study status
export const StudyStatusSchema = z.enum(['planning', 'active', 'completed', 'suspended']);

// Visit compliance
export const ComplianceStatusSchema = z.enum(['on_time', 'late', 'early']);

// Enrollment status
export const EnrollmentStatusSchema = z.enum(['active', 'completed', 'withdrawn']);

// Assessment requirement
export const AssessmentRequirementSchema = z.object({
  toolId: z.string(),
  visits: z.array(z.string()),
  isRequired: z.boolean(),
  timeWindow: z.object({
    min: z.number(),
    max: z.number(),
  }).optional(),
});

// Study visit definition
export const StudyVisitSchema = z.object({
  id: z.string(),
  name: z.string(),
  targetDay: z.number(),
  allowedWindow: z.object({
    before: z.number(),
    after: z.number(),
  }),
});

// Completed visit record
export const CompletedVisitSchema = z.object({
  visitId: z.string(),
  completedDate: z.date(),
  assessments: z.array(z.object({
    toolId: z.string(),
    assessmentId: z.string(),
  })),
  compliance: ComplianceStatusSchema,
});

// Patient enrollment
export const PatientEnrollmentSchema = z.object({
  patientId: z.string(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  completedVisits: z.array(CompletedVisitSchema),
  nextVisitDue: z.date().optional(),
});

// Study metadata
export const StudyMetadataSchema = z.object({
  protocol: z.string().optional(),
  principalInvestigator: z.string().optional(),
  irbApproval: z.string().optional(),
  targetEnrollment: z.number().min(1).max(1000),
  tags: z.array(z.string()).max(10),
});

// Complete study protocol
export const StudyProtocolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
  createdBy: z.string(),
  status: StudyStatusSchema,
  requiredAssessments: z.array(AssessmentRequirementSchema),
  visitSchedule: z.array(StudyVisitSchema),
  enrolledPatients: z.array(PatientEnrollmentSchema),
  metadata: StudyMetadataSchema,
});

// Create study request
export const CreateStudyRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  requiredAssessments: z.array(AssessmentRequirementSchema),
  visitSchedule: z.array(StudyVisitSchema),
  metadata: StudyMetadataSchema,
});

// Enroll patient request
export const EnrollPatientRequestSchema = z.object({
  studyId: z.string(),
  patientId: z.string(),
  enrollmentDate: z.date().optional(),
});

// Record visit completion
export const RecordVisitSchema = z.object({
  studyId: z.string(),
  patientId: z.string(),
  visitId: z.string(),
  assessments: z.array(z.object({
    toolId: z.string(),
    assessmentId: z.string(),
  })),
});

// Service interface
export interface StudyProtocolService {
  /**
   * Create new study protocol
   */
  createStudy(request: z.infer<typeof CreateStudyRequestSchema>): Promise<z.infer<typeof StudyProtocolSchema>>;

  /**
   * Get study protocol by ID
   */
  getStudy(studyId: string): Promise<z.infer<typeof StudyProtocolSchema> | null>;

  /**
   * List all study protocols
   */
  listStudies(filters?: {
    status?: z.infer<typeof StudyStatusSchema>;
    createdBy?: string;
  }): Promise<z.infer<typeof StudyProtocolSchema>[]>;

  /**
   * Enroll patient in study
   */
  enrollPatient(request: z.infer<typeof EnrollPatientRequestSchema>): Promise<void>;

  /**
   * Record visit completion
   */
  recordVisit(record: z.infer<typeof RecordVisitSchema>): Promise<void>;

  /**
   * Get patient's study enrollment
   */
  getPatientEnrollment(studyId: string, patientId: string): Promise<z.infer<typeof PatientEnrollmentSchema> | null>;

  /**
   * Check visit compliance
   */
  checkCompliance(studyId: string, patientId: string): Promise<{
    overdueVisits: string[];
    upcomingVisits: { visitId: string; dueDate: Date }[];
    complianceRate: number;
  }>;

  /**
   * Generate study report
   */
  generateStudyReport(studyId: string): Promise<{
    enrollmentProgress: number;
    overallCompliance: number;
    visitCompletionRates: Record<string, number>;
    toolCompletionRates: Record<string, number>;
  }>;
}

// Hook interface
export interface UseStudyProtocol {
  // Current study
  currentStudy: z.infer<typeof StudyProtocolSchema> | null;
  
  // Patient context
  patientEnrollment: z.infer<typeof PatientEnrollmentSchema> | null;
  
  // Loading states
  isCreating: boolean;
  isLoading: boolean;
  isEnrolling: boolean;
  
  // Error state
  error: Error | null;
  
  // Actions
  createStudy: (request: z.infer<typeof CreateStudyRequestSchema>) => Promise<void>;
  loadStudy: (studyId: string) => Promise<void>;
  enrollPatient: (patientId: string) => Promise<void>;
  recordVisit: (visitId: string, assessments: Array<{toolId: string; assessmentId: string}>) => Promise<void>;
  
  // Compliance tracking
  checkPatientCompliance: (patientId: string) => Promise<void>;
  complianceStatus: {
    overdueVisits: string[];
    upcomingVisits: Array<{ visitId: string; dueDate: Date }>;
    complianceRate: number;
  };
  
  // Study analytics
  studyReport: {
    enrollmentProgress: number;
    overallCompliance: number;
    visitCompletionRates: Record<string, number>;
    toolCompletionRates: Record<string, number>;
  } | null;
  generateReport: () => Promise<void>;
}