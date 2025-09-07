"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar,
  FileText,
  Download,
  Link,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';
import type { PatientRecord, PatientTimelineEntry } from '@/lib/patient-progress';
import { calculateTrend, exportPatientTimeline } from '@/lib/patient-progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PatientTimelineViewProps {
  patientRecord: PatientRecord;
  onGenerateLink?: () => void;
  onAddEntry?: () => void;
  onExport?: () => void;
}

export function PatientTimelineView({
  patientRecord,
  onGenerateLink,
  onAddEntry,
  onExport
}: PatientTimelineViewProps) {
  const { toast } = useToast();
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const toggleEntry = (entryId: string) => {
    setExpandedEntries(prev => {
      const next = new Set(prev);
      if (next.has(entryId)) {
        next.delete(entryId);
      } else {
        next.add(entryId);
      }
      return next;
    });
  };

  // Group entries by tool for trend analysis
  const entriesByTool = useMemo(() => {
    const grouped = new Map<string, PatientTimelineEntry[]>();
    
    patientRecord.timeline.forEach(entry => {
      const existing = grouped.get(entry.toolId) || [];
      grouped.set(entry.toolId, [...existing, entry]);
    });
    
    return grouped;
  }, [patientRecord.timeline]);

  // Calculate overall trend
  const overallTrend = useMemo(() => 
    calculateTrend(patientRecord.timeline), 
    [patientRecord.timeline]
  );

  // Prepare chart data
  const chartData = useMemo(() => {
    const data = new Map<string, any>();
    
    patientRecord.timeline.forEach(entry => {
      const date = format(new Date(entry.timestamp), 'MMM dd');
      const existing = data.get(date) || { date };
      
      if (typeof entry.result.score === 'number') {
        existing[entry.toolName] = entry.result.score;
      }
      
      data.set(date, existing);
    });
    
    return Array.from(data.values());
  }, [patientRecord.timeline]);

  // Get unique tools for chart
  const uniqueTools = Array.from(entriesByTool.keys());
  const toolColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  const handleExport = () => {
    const exportData = exportPatientTimeline(patientRecord);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-timeline-${patientRecord.id}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Timeline Exported",
      description: "Patient timeline has been downloaded as JSON",
    });
    
    onExport?.();
  };

  const getTrendIcon = () => {
    switch (overallTrend.trend) {
      case 'improving':
        return <TrendingDown className="h-5 w-5 text-green-600" />;
      case 'worsening':
        return <TrendingUp className="h-5 w-5 text-red-600" />;
      case 'stable':
        return <Minus className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTrendText = () => {
    switch (overallTrend.trend) {
      case 'improving':
        return `Improving ${Math.abs(overallTrend.changePercent || 0).toFixed(1)}%`;
      case 'worsening':
        return `Worsening ${Math.abs(overallTrend.changePercent || 0).toFixed(1)}%`;
      case 'stable':
        return 'Stable';
      default:
        return 'Insufficient Data';
    }
  };

  if (patientRecord.timeline.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Timeline Data</h3>
          <p className="text-muted-foreground mb-4">
            Start tracking patient progress by adding assessment results.
          </p>
          {onAddEntry && (
            <Button onClick={onAddEntry}>Add First Assessment</Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Patient Progress Timeline</CardTitle>
              <CardDescription>
                Tracking {patientRecord.timeline.length} assessments
                {typeof window !== 'undefined' && patientRecord.timeline.length > 0 && (
                  <>
                    {' '}over{' '}
                    {differenceInDays(
                      new Date(),
                      new Date(patientRecord.timeline[0].timestamp)
                    )}{' '}
                    days
                  </>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Overall Trend</p>
                <div className="flex items-center gap-2">
                  {getTrendIcon()}
                  <span className="font-semibold">{getTrendText()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {onGenerateLink && (
              <Button variant="outline" size="sm" onClick={onGenerateLink}>
                <Link className="mr-2 h-4 w-4" />
                Generate Patient Link
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Timeline
            </Button>
            {onAddEntry && (
              <Button size="sm" onClick={onAddEntry}>
                <FileText className="mr-2 h-4 w-4" />
                Add Assessment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Timeline View */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
              <CardDescription>
                Click on an entry to view detailed results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {[...patientRecord.timeline].reverse().map((entry, index) => {
                    const isExpanded = expandedEntries.has(entry.id);
                    const isLatest = index === 0;
                    
                    return (
                      <Card 
                        key={entry.id}
                        className={cn(
                          "cursor-pointer transition-all",
                          isLatest && "border-primary"
                        )}
                        onClick={() => toggleEntry(entry.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{entry.toolName}</h4>
                                {isLatest && (
                                  <Badge variant="secondary" className="text-xs">
                                    Latest
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(entry.timestamp), 'MMM dd, yyyy')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(entry.timestamp), 'h:mm a')}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Score</p>
                                <p className="text-xl font-bold">{entry.result.score}</p>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        
                        {isExpanded && (
                          <CardContent className="pt-0">
                            <div className="space-y-3 border-t pt-3">
                              <div>
                                <p className="text-sm font-medium mb-1">Interpretation</p>
                                <p className="text-sm text-muted-foreground">
                                  {entry.result.interpretation}
                                </p>
                              </div>
                              
                              {entry.notes && (
                                <div>
                                  <p className="text-sm font-medium mb-1">Clinical Notes</p>
                                  <p className="text-sm text-muted-foreground">
                                    {entry.notes}
                                  </p>
                                </div>
                              )}
                              
                              {entry.treatmentNotes && (
                                <div>
                                  <p className="text-sm font-medium mb-1">Treatment Notes</p>
                                  <p className="text-sm text-muted-foreground">
                                    {entry.treatmentNotes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends View */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Score Trends</CardTitle>
              <CardDescription>
                Visual representation of score changes over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    {Array.from(entriesByTool.entries()).map(([toolId, entries], index) => {
                      const toolName = entries[0].toolName;
                      const color = toolColors[index % toolColors.length];
                      
                      return (
                        <React.Fragment key={toolId}>
                          <Area
                            type="monotone"
                            dataKey={toolName}
                            stroke={color}
                            fill={color}
                            fillOpacity={0.3}
                          />
                          <Line
                            type="monotone"
                            dataKey={toolName}
                            stroke={color}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </React.Fragment>
                      );
                    })}
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>Need at least 2 assessments to show trends</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary View */}
        <TabsContent value="summary">
          <div className="grid gap-4">
            {Array.from(entriesByTool.entries()).map(([toolId, entries]) => {
              const toolName = entries[0].toolName;
              const trend = calculateTrend(entries);
              const latestScore = entries[entries.length - 1].result.score;
              const firstScore = entries[0].result.score;
              
              return (
                <Card key={toolId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{toolName}</CardTitle>
                        <CardDescription>
                          {entries.length} assessment{entries.length > 1 ? 's' : ''}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Current Score</p>
                        <p className="text-2xl font-bold">{latestScore}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">First Score</p>
                        <p className="font-semibold">{firstScore}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Trend</p>
                        <div className="flex items-center justify-center gap-1">
                          {trend.trend === 'improving' && <TrendingDown className="h-4 w-4 text-green-600" />}
                          {trend.trend === 'worsening' && <TrendingUp className="h-4 w-4 text-red-600" />}
                          {trend.trend === 'stable' && <Minus className="h-4 w-4 text-yellow-600" />}
                          <span className="font-semibold">
                            {trend.trend === 'insufficient-data' ? 'N/A' : trend.trend}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Change</p>
                        <p className="font-semibold">
                          {trend.changePercent ? `${trend.changePercent.toFixed(1)}%` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}