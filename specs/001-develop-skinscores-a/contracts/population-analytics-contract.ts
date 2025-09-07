/**
 * Population Analytics Contract
 * Defines interfaces for cohort analysis and research insights
 */

import { z } from 'zod';

// Time period for trends
export const TrendPeriodSchema = z.enum(['daily', 'weekly', 'monthly']);

// Distribution types
export const DistributionTypeSchema = z.enum(['histogram', 'box', 'violin']);

// Cohort filter
export const CohortFilterSchema = z.object({
  patientIds: z.array(z.string()).optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  minAssessments: z.number().min(1).optional(),
  includeAnonymous: z.boolean().default(false),
});

// Distribution bin
export const DistributionBinSchema = z.object({
  range: z.tuple([z.number(), z.number()]),
  count: z.number(),
  percentage: z.number(),
  patientIds: z.array(z.string()),
});

// Distribution data
export const DistributionSchema = z.object({
  metric: z.string(),
  type: DistributionTypeSchema,
  bins: z.array(DistributionBinSchema),
  outliers: z.array(z.number()),
});

// Trend point
export const TrendPointSchema = z.object({
  date: z.date(),
  value: z.number(),
  count: z.number(),
  confidence: z.number().min(0).max(1),
});

// Trend data with regression
export const TrendDataSchema = z.object({
  period: TrendPeriodSchema,
  points: z.array(TrendPointSchema),
  regression: z.object({
    slope: z.number(),
    intercept: z.number(),
    r2: z.number().min(0).max(1),
  }),
});

// Metrics summary
export const MetricsSummarySchema = z.object({
  totalPatients: z.number(),
  totalAssessments: z.number(),
  averageScore: z.number(),
  medianScore: z.number(),
  standardDeviation: z.number(),
  severityBreakdown: z.record(z.number()),
  improvementRate: z.number().min(0).max(100),
});

// Complete population metrics
export const PopulationMetricsSchema = z.object({
  id: z.string(),
  generatedAt: z.date(),
  toolId: z.string(),
  cohortFilter: CohortFilterSchema,
  metrics: MetricsSummarySchema,
  distributions: z.array(DistributionSchema),
  trends: z.array(TrendDataSchema),
});

// Analytics request
export const AnalyticsRequestSchema = z.object({
  toolId: z.string(),
  cohortFilter: CohortFilterSchema,
  includeDistributions: z.boolean().default(true),
  includeTrends: z.boolean().default(true),
  trendPeriod: TrendPeriodSchema.default('weekly'),
});

// Service interface
export interface PopulationAnalyticsService {
  /**
   * Generate population metrics
   */
  generateMetrics(request: z.infer<typeof AnalyticsRequestSchema>): Promise<z.infer<typeof PopulationMetricsSchema>>;

  /**
   * Get cached metrics
   */
  getCachedMetrics(toolId: string, cohortFilter: z.infer<typeof CohortFilterSchema>): Promise<z.infer<typeof PopulationMetricsSchema> | null>;

  /**
   * Compare two cohorts
   */
  compareCohorts(
    toolId: string,
    cohort1: z.infer<typeof CohortFilterSchema>,
    cohort2: z.infer<typeof CohortFilterSchema>
  ): Promise<{
    cohort1: z.infer<typeof PopulationMetricsSchema>;
    cohort2: z.infer<typeof PopulationMetricsSchema>;
    comparison: {
      scoreDifference: number;
      improvementDifference: number;
      pValue: number;
    };
  }>;

  /**
   * Get treatment response analysis
   */
  analyzeTreatmentResponse(
    toolId: string,
    patientIds: string[],
    baselineWindow: number,
    followupWindow: number
  ): Promise<{
    responders: number;
    nonResponders: number;
    responseRate: number;
    averageImprovement: number;
  }>;

  /**
   * Export analytics data
   */
  exportAnalytics(
    metrics: z.infer<typeof PopulationMetricsSchema>,
    format: 'csv' | 'json' | 'xlsx'
  ): Promise<Blob>;
}

// Hook interface
export interface UsePopulationAnalytics {
  // Current metrics
  metrics: z.infer<typeof PopulationMetricsSchema> | null;
  
  // Comparison data
  comparisonData: {
    cohort1: z.infer<typeof PopulationMetricsSchema>;
    cohort2: z.infer<typeof PopulationMetricsSchema>;
    comparison: any;
  } | null;
  
  // Loading states
  isLoading: boolean;
  isExporting: boolean;
  
  // Error state
  error: Error | null;
  
  // Actions
  generateMetrics: (request: z.infer<typeof AnalyticsRequestSchema>) => Promise<void>;
  compareCohorts: (
    toolId: string,
    cohort1: z.infer<typeof CohortFilterSchema>,
    cohort2: z.infer<typeof CohortFilterSchema>
  ) => Promise<void>;
  analyzeTreatmentResponse: (
    toolId: string,
    patientIds: string[],
    baselineWindow: number,
    followupWindow: number
  ) => Promise<any>;
  exportData: (format: 'csv' | 'json' | 'xlsx') => Promise<void>;
  
  // Filtering
  updateCohortFilter: (filter: Partial<z.infer<typeof CohortFilterSchema>>) => void;
  currentFilter: z.infer<typeof CohortFilterSchema>;
  
  // Visualization helpers
  getChartData: (metric: string) => any;
  getDistributionData: (metric: string) => any;
  getTrendData: (metric: string) => any;
}