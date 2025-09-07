/**
 * User Role Management Contract
 * Defines interfaces for role selection and preferences
 */

import { z } from 'zod';

// Role selection
export const UserRoleSchema = z.enum(['attending', 'resident', 'student', 'research_assistant']);
export type UserRoleType = z.infer<typeof UserRoleSchema>;

// Role permissions
export const RolePermissionsSchema = z.object({
  canFinalizeAssessment: z.boolean(),
  canApproveAssessments: z.boolean(),
  requiresSupervision: z.boolean(),
  canExportClinicalData: z.boolean(),
  canManageStudyProtocols: z.boolean(),
  canViewAllPatients: z.boolean(),
  canFlagForReview: z.boolean(),
});

// Dashboard widget configuration
export const DashboardWidgetSchema = z.object({
  id: z.string(),
  type: z.enum(['recent-tools', 'patient-stats', 'alerts', 'quick-actions', 'learning-resources',
                'supervision-queue', 'case-log', 'study-protocols', 'pending-reviews']),
  position: z.object({
    x: z.number().min(0),
    y: z.number().min(0),
    w: z.number().min(1).max(12),
    h: z.number().min(1).max(12),
  }),
  config: z.record(z.any()),
});

// User preferences
export const UserPreferencesSchema = z.object({
  favoriteTools: z.array(z.string()).max(20),
  recentTools: z.array(z.string()).max(10),
  defaultView: z.enum(['grid', 'list', 'compact']),
  quickEntryEnabled: z.boolean(),
  voiceDictationEnabled: z.boolean(),
  autoSaveCalculations: z.boolean(),
  alertSettings: z.object({
    enabledAlerts: z.array(z.string()),
    notificationMethod: z.enum(['dashboard', 'popup', 'sound', 'all']),
    soundEnabled: z.boolean(),
    groupByPatient: z.boolean(),
  }),
});

// Role configuration
export const RoleConfigSchema = z.object({
  id: UserRoleSchema,
  displayName: z.string(),
  selectedAt: z.date(),
  permissions: RolePermissionsSchema,
  preferences: UserPreferencesSchema,
  dashboardConfig: z.object({
    widgets: z.array(DashboardWidgetSchema),
    layout: z.enum(['clinical', 'research', 'learning', 'supervision']),
    theme: z.enum(['light', 'dark', 'system']),
  }),
  supervisionLevel: z.enum(['independent', 'review_available', 'supervision_required', 'view_only']),
});

// Service interface
export interface UserRoleService {
  /**
   * Get current user role
   */
  getCurrentRole(): Promise<z.infer<typeof RoleConfigSchema> | null>;

  /**
   * Set user role
   */
  setRole(role: UserRoleType): Promise<z.infer<typeof RoleConfigSchema>>;

  /**
   * Update user preferences
   */
  updatePreferences(preferences: Partial<z.infer<typeof UserPreferencesSchema>>): Promise<void>;

  /**
   * Update dashboard configuration
   */
  updateDashboard(widgets: z.infer<typeof DashboardWidgetSchema>[]): Promise<void>;

  /**
   * Reset to default configuration
   */
  resetToDefaults(role: UserRoleType): Promise<void>;
}

// Hook interface
export interface UseUserRole {
  role: z.infer<typeof RoleConfigSchema> | null;
  isLoading: boolean;
  error: Error | null;
  setRole: (role: UserRoleType) => Promise<void>;
  updatePreferences: (preferences: Partial<z.infer<typeof UserPreferencesSchema>>) => Promise<void>;
  updateDashboard: (widgets: z.infer<typeof DashboardWidgetSchema>[]) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}