import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Tool, CalculationResult } from '@/lib/types';

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  type: 'page_view' | 'tool_used' | 'calculation_completed' | 'export' | 'search' | 'filter_applied' | 'share_created' | 'share_copied' | 'share_native' | 'qr_downloaded';
  data: Record<string, any>;
}

export interface ToolUsageStats {
  toolId: string;
  toolName: string;
  usageCount: number;
  lastUsed: string;
  averageTime?: number;
  successRate?: number;
}

export interface AnalyticsData {
  events: AnalyticsEvent[];
  toolStats: Record<string, ToolUsageStats>;
  dailyUsage: Record<string, number>;
  totalCalculations: number;
  uniqueToolsUsed: number;
  averageSessionDuration: number;
  exportCount: number;
  searchQueries: string[];
}

const ANALYTICS_KEY = 'skinscores_analytics';
const MAX_EVENTS = 1000; // Keep only last 1000 events

export function useAnalytics() {
  const pathname = usePathname();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    events: [],
    toolStats: {},
    dailyUsage: {},
    totalCalculations: 0,
    uniqueToolsUsed: 0,
    averageSessionDuration: 0,
    exportCount: 0,
    searchQueries: [],
  });
  
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
  
  // Load from localStorage after hydration
  useEffect(() => {
    if (!hasLoadedFromStorage) {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      if (stored) {
        try {
          setAnalyticsData(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to load analytics:', e);
        }
      }
      setHasLoadedFromStorage(true);
    }
  }, [hasLoadedFromStorage]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analyticsData));
  }, [analyticsData]);

  // Track page views
  useEffect(() => {
    trackEvent('page_view', { path: pathname });
  }, [pathname]);

  const trackEvent = useCallback((type: AnalyticsEvent['type'], data: Record<string, any>) => {
    const timestamp = new Date().toISOString();
    const randomSuffix = typeof window !== 'undefined' ? Math.random().toString(36).substr(2, 9) : 'ssr';
    const event: AnalyticsEvent = {
      id: `event_${timestamp}_${randomSuffix}`,
      timestamp,
      type,
      data,
    };

    setAnalyticsData(prev => {
      const events = [event, ...prev.events].slice(0, MAX_EVENTS);
      const today = new Date().toISOString().split('T')[0];
      
      // Update daily usage
      const dailyUsage = { ...prev.dailyUsage };
      dailyUsage[today] = (dailyUsage[today] || 0) + 1;

      // Update specific metrics based on event type
      let updates = { ...prev };
      
      switch (type) {
        case 'calculation_completed':
          updates.totalCalculations = prev.totalCalculations + 1;
          break;
        case 'export':
          updates.exportCount = prev.exportCount + 1;
          break;
        case 'search':
          if (data.query && !prev.searchQueries.includes(data.query)) {
            updates.searchQueries = [...prev.searchQueries, data.query].slice(-50);
          }
          break;
      }

      return {
        ...updates,
        events,
        dailyUsage,
      };
    });
  }, []);

  const trackToolUsage = useCallback((tool: Tool, result: CalculationResult, duration: number) => {
    trackEvent('tool_used', {
      toolId: tool.id,
      toolName: tool.name,
      condition: tool.condition,
      score: result.score,
      duration,
    });

    setAnalyticsData(prev => {
      const toolStats = { ...prev.toolStats };
      const stats = toolStats[tool.id] || {
        toolId: tool.id,
        toolName: tool.name,
        usageCount: 0,
        lastUsed: new Date().toISOString(),
      };

      stats.usageCount += 1;
      stats.lastUsed = new Date().toISOString();
      stats.averageTime = stats.averageTime 
        ? (stats.averageTime * (stats.usageCount - 1) + duration) / stats.usageCount
        : duration;

      toolStats[tool.id] = stats;

      return {
        ...prev,
        toolStats,
        uniqueToolsUsed: Object.keys(toolStats).length,
      };
    });
  }, [trackEvent]);

  const trackCalculation = useCallback((tool: Tool, result: CalculationResult, inputs: Record<string, any>) => {
    trackEvent('calculation_completed', {
      toolId: tool.id,
      toolName: tool.name,
      score: result.score,
      inputCount: Object.keys(inputs).length,
    });
  }, [trackEvent]);

  const trackExport = useCallback((format: 'csv' | 'pdf' | 'json', toolName?: string) => {
    trackEvent('export', { format, toolName });
  }, [trackEvent]);

  const trackSearch = useCallback((query: string, resultCount: number) => {
    trackEvent('search', { query, resultCount });
  }, [trackEvent]);

  const trackFilterApplied = useCallback((filterType: string, values: any[]) => {
    trackEvent('filter_applied', { filterType, values });
  }, [trackEvent]);

  const getInsights = useCallback(() => {
    const { events, toolStats, dailyUsage } = analyticsData;
    
    // Most used tools
    const mostUsedTools = Object.values(toolStats)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 5);

    // Usage trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const usageTrend = last7Days.map(date => ({
      date,
      count: dailyUsage[date] || 0,
    }));

    // Peak usage time
    const hourlyUsage: Record<number, number> = {};
    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourlyUsage[hour] = (hourlyUsage[hour] || 0) + 1;
    });

    const peakHour = Object.entries(hourlyUsage)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || '0';

    // Recent activity
    const recentActivity = events.slice(0, 10);

    return {
      mostUsedTools,
      usageTrend,
      peakHour: parseInt(peakHour),
      recentActivity,
      totalTools: Object.keys(toolStats).length,
      totalEvents: events.length,
    };
  }, [analyticsData]);

  const clearAnalytics = useCallback(() => {
    setAnalyticsData({
      events: [],
      toolStats: {},
      dailyUsage: {},
      totalCalculations: 0,
      uniqueToolsUsed: 0,
      averageSessionDuration: 0,
      exportCount: 0,
      searchQueries: [],
    });
    localStorage.removeItem(ANALYTICS_KEY);
  }, []);

  return {
    analyticsData,
    trackEvent,
    trackToolUsage,
    trackCalculation,
    trackExport,
    trackSearch,
    trackFilterApplied,
    getInsights,
    clearAnalytics,
  };
}