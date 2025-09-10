'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  getCalculationHistory,
  CalculationHistoryItem,
} from '@/lib/calculation-history';
import { toolRegistry } from '@/lib/tools/tool-registry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [selectedTool, setSelectedTool] = useState<string | 'all'>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  useEffect(() => {
    const historyData = getCalculationHistory();
    setHistory(historyData);
    const toolId = searchParams.get('toolId');
    if (toolId && toolRegistry.get(toolId)) {
      setSelectedTool(toolId);
    }
  }, [searchParams]);

  const filteredHistory = useMemo(() => {
    return history
      .filter(item => {
        if (selectedTool === 'all') return true;
        return item.toolId === selectedTool;
      })
      .filter(item => {
        if (!dateRange?.from) return false;
        const itemDate = new Date(item.timestamp);
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        if (itemDate < fromDate) return false;
        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (itemDate > toDate) return false;
        }
        return true;
      });
  }, [history, selectedTool, dateRange]);

  const toolUsageData = useMemo(() => {
    const counts = filteredHistory.reduce(
      (acc, item) => {
        const tool = toolRegistry.get(item.toolId);
        if (tool) {
          acc[tool.name] = (acc[tool.name] || 0) + 1;
        }
        return acc;
      },
      {} as { [key: string]: number },
    );
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [filteredHistory]);

  const scoreTrendData = useMemo(() => {
    const tool = toolRegistry.get(selectedTool);
    if (selectedTool === 'all' || !tool) return [];

    return filteredHistory
      .map(item => ({
        date: new Date(item.timestamp).toLocaleDateString(),
        score: item.result.score,
      }))
      .reverse();
  }, [filteredHistory, selectedTool]);

  const allTools = useMemo(() => toolRegistry.getAll(), []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select value={selectedTool} onValueChange={setSelectedTool}>
          <SelectTrigger>
            <SelectValue placeholder="Select a tool" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tools</SelectItem>
            {allTools.map(tool => (
              <SelectItem key={tool.id} value={tool.id}>
                {tool.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="md:col-span-2">
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
            className="w-full"
          />
        </div>
      </div>

      <Tabs defaultValue="usage">
        <TabsList>
          <TabsTrigger value="usage">Tool Usage</TabsTrigger>
          <TabsTrigger value="trends" disabled={selectedTool === 'all'}>
            Score Trends
          </TabsTrigger>
        </TabsList>
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Tool Usage Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              {toolUsageData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={toolUsageData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p>No data available for the selected period.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>
                Score Trends for {toolRegistry.get(selectedTool)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scoreTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={scoreTrendData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p>
                  No score data available. Select a specific tool to see trends.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalyticsContent />
    </Suspense>
  );
}
