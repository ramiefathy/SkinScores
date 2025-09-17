import { z } from 'zod';

export const RoleEnum = z.enum(['clinician', 'admin']);
export type Role = z.infer<typeof RoleEnum>;

export const UserProfileSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1),
  organizationId: z.string().nullable(),
  photoURL: z.string().url().nullable(),
  role: RoleEnum.default('clinician'),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const ScoreTemplateInputSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['number', 'select', 'multiselect', 'boolean', 'text']),
  description: z.string().optional(),
  required: z.boolean().default(true),
  options: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        score: z.number().optional(),
      }),
    )
    .optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  weight: z.number().optional(),
});
export type ScoreTemplateInput = z.infer<typeof ScoreTemplateInputSchema>;

export const ScoreTemplateSchema = z.object({
  name: z.string(),
  slug: z.string(),
  category: z.string(),
  version: z.string(),
  description: z.string(),
  citation: z.string().optional(),
  inputs: z.array(ScoreTemplateInputSchema),
  interpretation: z.object({
    summaryTemplate: z.string(),
    ranges: z.array(
      z.object({
        min: z.number(),
        max: z.number(),
        label: z.string(),
        guidance: z.string(),
      }),
    ),
  }),
  copyBlocks: z.array(
    z.object({
      label: z.string(),
      bodyTemplate: z.string(),
    }),
  ),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ScoreTemplate = z.infer<typeof ScoreTemplateSchema>;

export const ScoreSessionSchema = z.object({
  userId: z.string(),
  templateId: z.string(),
  templateSlug: z.string().optional(),
  templateName: z.string().optional(),
  status: z.enum(['draft', 'submitted']).default('draft'),
  patientRef: z.string().nullable(),
  inputs: z.record(z.any()),
  score: z.number().nullable().optional(),
  scoreText: z.string().nullable().optional(),
  interpretationLabel: z.string().nullable().optional(),
  interpretationSummary: z.string().nullable().optional(),
  resultDetails: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ScoreSession = z.infer<typeof ScoreSessionSchema>;

export const ScoreResultSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  templateId: z.string(),
  templateSlug: z.string().optional(),
  templateName: z.string().optional(),
  score: z.number().nullable().optional(),
  scoreText: z.string().nullable().optional(),
  interpretationLabel: z.string().nullable().optional(),
  interpretationSummary: z.string().nullable().optional(),
  copyBlocks: z.array(z.string()).optional(),
  details: z.record(z.any()).optional(),
  createdAt: z.date(),
});
export type ScoreResult = z.infer<typeof ScoreResultSchema>;

export const PatientProfileSchema = z.object({
  displayId: z.string(),
  notes: z.string().optional(),
  ownerUserId: z.string(),
  organizationId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type PatientProfile = z.infer<typeof PatientProfileSchema>;

export type CollectionName =
  | 'users'
  | 'scoreSessions'
  | 'scoreResults'
  | 'patients'
  | 'aggregateSnapshots';

export const collectionNames: Record<CollectionName, CollectionName> = {
  users: 'users',
  scoreSessions: 'scoreSessions',
  scoreResults: 'scoreResults',
  patients: 'patients',
  aggregateSnapshots: 'aggregateSnapshots',
};
