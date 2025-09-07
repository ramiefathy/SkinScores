"use client";

import React, { createContext, useContext } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { AnalyticsData, AnalyticsEvent } from '@/hooks/useAnalytics';
import type { Tool, CalculationResult } from '@/lib/types';

interface AnalyticsContextType {
  analyticsData: AnalyticsData;
  trackEvent: (type: AnalyticsEvent['type'], data: Record<string, any>) => void;
  trackToolUsage: (tool: Tool, result: CalculationResult, duration: number) => void;
  trackCalculation: (tool: Tool, result: CalculationResult, inputs: Record<string, any>) => void;
  trackExport: (format: 'csv' | 'pdf' | 'json', toolName?: string) => void;
  trackSearch: (query: string, resultCount: number) => void;
  trackFilterApplied: (filterType: string, values: any[]) => void;
  getInsights: () => any;
  clearAnalytics: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const analytics = useAnalytics();

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
}