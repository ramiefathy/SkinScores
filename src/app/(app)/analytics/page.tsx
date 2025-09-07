"use client";

import React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { MeshGradient } from '@paper-design/shaders-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAnalyticsContext } from '@/contexts/AnalyticsContext';
import { 
  BarChart as BarChartIcon, LineChart, PieChart, Activity, TrendingUp, 
  Users, FileText, Download, Search, Clock, Trash2 
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, Line, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsPage() {
  const { analyticsData, getInsights, clearAnalytics, trackExport } = useAnalyticsContext();
  const { toast } = useToast();
  const insights = getInsights();

  const exportAnalytics = () => {
    const exportData = {
      analytics: analyticsData,
      insights: insights,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skinscores-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    trackExport('json', 'analytics');
    toast({
      title: "Analytics Exported",
      description: "Your analytics data has been downloaded successfully.",
    });
  };

  const handleClearAnalytics = () => {
    clearAnalytics();
    toast({
      title: "Analytics Cleared",
      description: "All analytics data has been removed.",
      variant: "destructive",
    });
  };

  // Prepare data for score distribution chart
  const scoreDistribution = React.useMemo(() => {
    const distribution: Record<string, number> = {};
    analyticsData.events
      .filter(e => e.type === 'calculation_completed')
      .forEach(event => {
        const score = event.data.score;
        if (typeof score === 'number') {
          const range = `${Math.floor(score / 10) * 10}-${Math.floor(score / 10) * 10 + 9}`;
          distribution[range] = (distribution[range] || 0) + 1;
        }
      });
    
    return Object.entries(distribution)
      .map(([range, count]) => ({ range, count }))
      .sort((a, b) => a.range.localeCompare(b.range));
  }, [analyticsData.events]);

  // Format usage trend data for chart
  const formattedUsageTrend = insights.usageTrend.map((item: any) => ({
    ...item,
    date: format(parseISO(item.date), 'MMM dd'),
  }));

  return (
    <PageWrapper>
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 opacity-20">
        <MeshGradient
          speed={0.05}
          colors={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981']}
          className="w-full h-full"
        />
      </div>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold font-headline">Analytics Dashboard</h1>
              <p className="text-lg text-muted-foreground">
                Track usage patterns and gain insights into tool performance
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportAnalytics}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Analytics?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all analytics data. 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAnalytics}>
                    Clear Analytics
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard hover className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  Total Calculations
                </CardTitle>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <AnimatedCounter
                  value={analyticsData.totalCalculations}
                  className="text-2xl font-bold"
                  duration={1.5}
                />
                <p className="text-sm text-muted-foreground">
                  Lifetime calculations performed
                </p>
              </CardContent>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard hover className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  Unique Tools Used
                </CardTitle>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <AnimatedCounter
                  value={analyticsData.uniqueToolsUsed}
                  className="text-2xl font-bold"
                  duration={1.5}
                />
                <p className="text-sm text-muted-foreground">
                  Out of {insights.totalTools} available
                </p>
              </CardContent>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GlassCard hover className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  Exports
                </CardTitle>
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <AnimatedCounter
                  value={analyticsData.exportCount}
                  className="text-2xl font-bold"
                  duration={1.5}
                />
                <p className="text-sm text-muted-foreground">
                  Results exported
                </p>
              </CardContent>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GlassCard hover className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  Peak Usage Hour
                </CardTitle>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {insights.peakHour}:00 - {insights.peakHour + 1}:00
                </div>
                <p className="text-sm text-muted-foreground">
                  Most active time
                </p>
              </CardContent>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Usage Trend Chart */}
            <GlassCard blur="sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Usage Trend (Last 7 Days)
                </CardTitle>
                <CardDescription>
                  Daily calculation activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={formattedUsageTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </GlassCard>

            {/* Score Distribution */}
            {scoreDistribution.length > 0 && (
              <GlassCard blur="sm">
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>
                    Distribution of calculation scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={scoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </GlassCard>
            )}
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            {/* Most Used Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Most Used Tools</CardTitle>
                <CardDescription>
                  Top 5 tools by usage frequency
                </CardDescription>
              </CardHeader>
              <CardContent>
                {insights.mostUsedTools.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={insights.mostUsedTools}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ toolName, usageCount }) => `${toolName}: ${usageCount}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="usageCount"
                      >
                        {insights.mostUsedTools.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No tool usage data available yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Tool Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Tool Performance</CardTitle>
                <CardDescription>
                  Detailed tool usage statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Tool Name</th>
                        <th className="text-right p-2">Usage Count</th>
                        <th className="text-right p-2">Avg. Time (ms)</th>
                        <th className="text-right p-2">Last Used</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(analyticsData.toolStats)
                        .sort((a, b) => b.usageCount - a.usageCount)
                        .map(stat => (
                          <tr key={stat.toolId} className="border-b">
                            <td className="p-2">{stat.toolName}</td>
                            <td className="text-right p-2">{stat.usageCount}</td>
                            <td className="text-right p-2">
                              {stat.averageTime ? Math.round(stat.averageTime) : '-'}
                            </td>
                            <td className="text-right p-2">
                              {format(parseISO(stat.lastUsed), 'MMM dd, HH:mm')}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {Object.keys(analyticsData.toolStats).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No tool performance data available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Last 10 events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {insights.recentActivity.map((event: any) => (
                    <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        {event.type === 'page_view' && <Activity className="h-4 w-4" />}
                        {event.type === 'tool_used' && <BarChartIcon className="h-4 w-4" />}
                        {event.type === 'export' && <Download className="h-4 w-4" />}
                        {event.type === 'search' && <Search className="h-4 w-4" />}
                        <span className="text-sm font-medium capitalize">
                          {event.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(event.timestamp), 'MMM dd, HH:mm')}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Search Queries */}
            {analyticsData.searchQueries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Popular Search Queries</CardTitle>
                  <CardDescription>
                    Most recent search terms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analyticsData.searchQueries.slice(-20).reverse().map((query, idx) => (
                      <span key={idx} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                        {query}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>
                  AI-powered analytics insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Usage Pattern</p>
                      <p className="text-sm text-muted-foreground">
                        Your most active time is between {insights.peakHour}:00-{insights.peakHour + 1}:00. 
                        Consider scheduling important calculations during this time for peak performance.
                      </p>
                    </div>
                  </div>
                  
                  {insights.mostUsedTools.length > 0 && (
                    <div className="flex items-start gap-2">
                      <BarChartIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Tool Preference</p>
                        <p className="text-sm text-muted-foreground">
                          Your most used tool is {insights.mostUsedTools[0]?.toolName} with {insights.mostUsedTools[0]?.usageCount} uses. 
                          Consider adding it to your favorites for quick access.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Tool Discovery</p>
                      <p className="text-sm text-muted-foreground">
                        You&apos;ve used {analyticsData.uniqueToolsUsed} out of {insights.totalTools} available tools. 
                        Explore new tools to expand your diagnostic capabilities.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </PageWrapper>
  );
}