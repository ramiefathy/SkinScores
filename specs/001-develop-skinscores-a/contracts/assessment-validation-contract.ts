/**
 * Assessment Validation Contract
 * Defines interfaces for student assessment review and approval workflow
 */

import { z } from 'zod';

// Validation status
export const ValidationStatusSchema = z.enum(['pending_review', 'approved', 'needs_revision', 'rejected']);

// Approval status
export const ApprovalStatusSchema = z.enum(['approved', 'approved_with_corrections', 'needs_resubmission']);

// Field correction
export const FieldCorrectionSchema = z.object({
  fieldId: z.string(),
  studentValue: z.any(),
  correctedValue: z.any(),
  explanation: z.string(),
});

// Validation feedback
export const ValidationFeedbackSchema = z.object({
  overallComments: z.string(),
  fieldCorrections: z.array(FieldCorrectionSchema),
  educationalNotes: z.array(z.string()),
  approvalStatus: ApprovalStatusSchema,
});

// Assessment validation record
export const AssessmentValidationSchema = z.object({
  id: z.string(),
  assessmentId: z.string(),
  studentId: z.string(),
  patientId: z.string(),
  toolId: z.string(),
  submittedAt: z.date(),
  status: ValidationStatusSchema,
  reviewer: z.string().optional(),
  reviewedAt: z.date().optional(),
  feedback: ValidationFeedbackSchema.optional(),
});

// Submit for review request
export const SubmitForReviewSchema = z.object({
  assessmentId: z.string(),
  studentId: z.string(),
  patientId: z.string(),
  toolId: z.string(),
});

// Review assessment request
export const ReviewAssessmentSchema = z.object({
  validationId: z.string(),
  reviewerId: z.string(),
  feedback: ValidationFeedbackSchema,
});

// Service interface
export interface AssessmentValidationService {
  /**
   * Submit assessment for review
   */
  submitForReview(request: z.infer<typeof SubmitForReviewSchema>): Promise<z.infer<typeof AssessmentValidationSchema>>;

  /**
   * Get validation by ID
   */
  getValidation(validationId: string): Promise<z.infer<typeof AssessmentValidationSchema> | null>;

  /**
   * List pending reviews for attending
   */
  listPendingReviews(attendingId: string): Promise<z.infer<typeof AssessmentValidationSchema>[]>;

  /**
   * List student's submissions
   */
  listStudentSubmissions(studentId: string, filters?: {
    status?: z.infer<typeof ValidationStatusSchema>;
    dateRange?: { start: Date; end: Date };
  }): Promise<z.infer<typeof AssessmentValidationSchema>[]>;

  /**
   * Review and provide feedback
   */
  reviewAssessment(review: z.infer<typeof ReviewAssessmentSchema>): Promise<void>;

  /**
   * Get review statistics for student
   */
  getStudentStatistics(studentId: string): Promise<{
    totalSubmissions: number;
    approvedCount: number;
    needsRevisionCount: number;
    averageReviewTime: number;
    commonErrors: Array<{ field: string; count: number }>;
  }>;

  /**
   * Get attending's review workload
   */
  getReviewWorkload(attendingId: string): Promise<{
    pendingCount: number;
    reviewedToday: number;
    averageReviewTime: number;
    studentDistribution: Record<string, number>;
  }>;
}

// Hook interface
export interface UseAssessmentValidation {
  // Validation records
  pendingReviews: z.infer<typeof AssessmentValidationSchema>[];
  studentSubmissions: z.infer<typeof AssessmentValidationSchema>[];
  currentValidation: z.infer<typeof AssessmentValidationSchema> | null;
  
  // Loading states
  isSubmitting: boolean;
  isReviewing: boolean;
  isLoading: boolean;
  
  // Error state
  error: Error | null;
  
  // Actions - For Students
  submitForReview: (assessmentId: string) => Promise<void>;
  checkSubmissionStatus: (assessmentId: string) => Promise<void>;
  
  // Actions - For Attendings
  loadPendingReviews: () => Promise<void>;
  selectValidation: (validationId: string) => Promise<void>;
  reviewAssessment: (feedback: z.infer<typeof ValidationFeedbackSchema>) => Promise<void>;
  
  // Statistics
  studentStats: {
    totalSubmissions: number;
    approvalRate: number;
    commonErrors: Array<{ field: string; count: number }>;
  } | null;
  
  reviewWorkload: {
    pendingCount: number;
    reviewedToday: number;
    averageReviewTime: number;
  } | null;
  
  // Filters
  filterByStatus: (status: z.infer<typeof ValidationStatusSchema>) => void;
  filterByDate: (range: { start: Date; end: Date }) => void;
}