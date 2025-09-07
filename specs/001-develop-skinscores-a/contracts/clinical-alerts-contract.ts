/**
 * Clinical Alerts Contract
 * Defines interfaces for threshold-based patient monitoring
 */

import { z } from 'zod';

// Alert condition types
export const AlertConditionSchema = z.enum(['above', 'below', 'equals', 'change']);

// Alert notification
export const AlertNotificationSchema = z.object({
  id: z.string(),
  alertId: z.string(),
  triggeredAt: z.date(),
  assessmentId: z.string(),
  value: z.union([z.number(), z.string()]),
  previousValue: z.union([z.number(), z.string()]).optional(),
  acknowledged: z.boolean(),
  acknowledgedAt: z.date().optional(),
  notes: z.string().optional(),
});

// Clinical alert configuration
export const ClinicalAlertSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  toolId: z.string(),
  metric: z.string(),
  condition: AlertConditionSchema,
  threshold: z.union([z.number(), z.string()]),
  changeThreshold: z.number().optional(),
  enabled: z.boolean(),
  createdAt: z.date(),
  lastChecked: z.date(),
  triggeredCount: z.number(),
  notifications: z.array(AlertNotificationSchema),
});

// Create alert request
export const CreateAlertRequestSchema = z.object({
  patientId: z.string(),
  toolId: z.string(),
  metric: z.string(),
  condition: AlertConditionSchema,
  threshold: z.union([z.number(), z.string()]),
  changeThreshold: z.number().optional(),
});

// Update alert request
export const UpdateAlertRequestSchema = z.object({
  enabled: z.boolean().optional(),
  threshold: z.union([z.number(), z.string()]).optional(),
  changeThreshold: z.number().optional(),
});

// Service interface
export interface ClinicalAlertService {
  /**
   * Create new alert
   */
  createAlert(request: z.infer<typeof CreateAlertRequestSchema>): Promise<z.infer<typeof ClinicalAlertSchema>>;

  /**
   * Get alert by ID
   */
  getAlert(alertId: string): Promise<z.infer<typeof ClinicalAlertSchema> | null>;

  /**
   * List alerts for patient
   */
  listPatientAlerts(patientId: string): Promise<z.infer<typeof ClinicalAlertSchema>[]>;

  /**
   * List all active alerts
   */
  listActiveAlerts(): Promise<z.infer<typeof ClinicalAlertSchema>[]>;

  /**
   * Update alert configuration
   */
  updateAlert(alertId: string, update: z.infer<typeof UpdateAlertRequestSchema>): Promise<void>;

  /**
   * Delete alert
   */
  deleteAlert(alertId: string): Promise<void>;

  /**
   * Check alerts for new assessment
   */
  checkAlerts(patientId: string, toolId: string, result: any): Promise<z.infer<typeof AlertNotificationSchema>[]>;

  /**
   * Acknowledge notification
   */
  acknowledgeNotification(notificationId: string, notes?: string): Promise<void>;

  /**
   * Get unacknowledged notifications
   */
  getUnacknowledgedNotifications(): Promise<z.infer<typeof AlertNotificationSchema>[]>;

  /**
   * Clear old notifications
   */
  clearOldNotifications(daysOld: number): Promise<void>;
}

// Hook interface
export interface UseClinicalAlerts {
  // Alert lists
  patientAlerts: z.infer<typeof ClinicalAlertSchema>[];
  activeAlerts: z.infer<typeof ClinicalAlertSchema>[];
  notifications: z.infer<typeof AlertNotificationSchema>[];
  unacknowledgedCount: number;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  
  // Error state
  error: Error | null;
  
  // Actions
  createAlert: (request: z.infer<typeof CreateAlertRequestSchema>) => Promise<void>;
  updateAlert: (alertId: string, update: z.infer<typeof UpdateAlertRequestSchema>) => Promise<void>;
  deleteAlert: (alertId: string) => Promise<void>;
  acknowledgeNotification: (notificationId: string, notes?: string) => Promise<void>;
  checkAlerts: (patientId: string, toolId: string, result: any) => Promise<void>;
  
  // Filtering
  filterByPatient: (patientId: string) => void;
  filterByTool: (toolId: string) => void;
  clearFilters: () => void;
  
  // Real-time monitoring
  startMonitoring: () => void;
  stopMonitoring: () => void;
  isMonitoring: boolean;
}