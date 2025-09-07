"use client";

import React, { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PremiumInput } from '@/components/ui/input-premium';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCalculationHistory } from '@/hooks/useCalculationHistory';
import { History, Search, Trash2, FileText, Calendar, Download, Calculator, Activity } from 'lucide-react';
import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek } from 'date-fns';
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
import { Textarea } from '@/components/ui/textarea';
import { TimelineConnector } from '@/components/ui/timeline-connector';
import { TimelineEntry } from '@/components/ui/timeline-entry';
import { FloatingDateMarker } from '@/components/ui/floating-date-marker';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';

export default function HistoryPage() {
  const { history, deleteCalculation, clearHistory, searchHistory, updateNotes } = useCalculationHistory();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  const filteredHistory = searchQuery ? searchHistory(searchQuery) : history;

  // Group calculations by date
  const groupedHistory = useMemo(() => {
    const groups: Record<string, typeof history> = {};
    
    filteredHistory.forEach(item => {
      const date = new Date(item.timestamp);
      let dateKey: string;
      
      if (isToday(date)) {
        dateKey = 'Today';
      } else if (isYesterday(date)) {
        dateKey = 'Yesterday';
      } else if (isThisWeek(date)) {
        dateKey = format(date, 'EEEE');
      } else {
        dateKey = format(date, 'MMMM d, yyyy');
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });
    
    // Sort items within each group by timestamp (newest first)
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    });
    
    return groups;
  }, [filteredHistory]);

  const exportHistory = () => {
    const data = {
      calculations: filteredHistory,
      exportDate: new Date().toISOString(),
      totalCount: filteredHistory.length,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skinscores-history-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "History Exported",
      description: `Exported ${filteredHistory.length} calculation(s)`,
    });
  };

  const handleDeleteCalculation = (id: string) => {
    deleteCalculation(id);
    toast({
      title: "Calculation Deleted",
      description: "The calculation has been removed from history.",
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: "History Cleared",
      description: "All calculations have been removed.",
      variant: "destructive",
    });
  };

  const startEditingNotes = (id: string, currentNotes?: string) => {
    setEditingNotes(id);
    setNotesDraft(currentNotes || '');
  };

  const saveNotes = (id: string) => {
    updateNotes(id, notesDraft);
    setEditingNotes(null);
    toast({
      title: "Notes Updated",
      description: "Your notes have been saved.",
    });
  };

  return (
    <PageWrapper>
      {/* ECG Background Pattern */}
      <div className="fixed inset-0 -z-10 opacity-[0.02]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ecg-pattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
              <path 
                d="M0,50 L40,50 L45,30 L50,70 L55,10 L60,90 L65,30 L70,50 L200,50" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="text-primary"
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0 400;400 0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ecg-pattern)" />
        </svg>
      </div>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <History className="h-8 w-8 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold font-headline">Calculation History</h1>
              <p className="text-lg text-muted-foreground">
                {history.length} saved calculation{history.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportHistory} disabled={filteredHistory.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={history.length === 0}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All History?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {history.length} saved calculations. 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory}>
                    Clear History
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PremiumInput
            placeholder="Search calculations by tool name, score, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="max-w-lg mx-auto"
          />
        </motion.div>

        {/* Timeline */}
        {filteredHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No calculations found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Your saved calculations will appear here'}
              </p>
            </CardContent>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="relative">
            {/* Timeline container */}
            <div className="space-y-8">
              {Object.entries(groupedHistory).map(([dateKey, items], groupIndex) => {
                const isFirstGroup = groupIndex === 0;
                const isLastGroup = groupIndex === Object.keys(groupedHistory).length - 1;
                
                return (
                  <div key={dateKey} className="relative">
                    {/* Date marker */}
                    <FloatingDateMarker 
                      date={dateKey} 
                      isVisible={true} 
                    />
                    
                    {/* Timeline entries for this date */}
                    <div className="relative ml-24">
                      {items.map((item, index) => {
                        const isFirst = isFirstGroup && index === 0;
                        const isLast = isLastGroup && index === items.length - 1;
                        
                        return (
                          <div key={item.id} className="relative">
                            {/* Connector line */}
                            {!isLast && (
                              <TimelineConnector 
                                isActive={isFirst}
                                isLast={false}
                              />
                            )}
                            
                            {/* Timeline entry */}
                            <TimelineEntry
                              date={new Date(item.timestamp)}
                              toolName={item.toolName}
                              score={item.result.score}
                              isFirst={isFirst}
                              isLast={isLast}
                              delay={index * 0.1}
                              className="mb-6"
                            >
                              <div className="space-y-4">
                                {/* Result */}
                                <div className="bg-accent/50 rounded-lg p-3">
                                  <p className="text-sm">{item.result.interpretation}</p>
                                </div>
                                
                                {/* Inputs preview */}
                                <div>
                                  <p className="text-xs font-medium mb-2 text-muted-foreground">Input Values:</p>
                                  <ScrollArea className="h-16 rounded-md border bg-background/50 p-2">
                                    <div className="space-y-0.5">
                                      {Object.entries(item.inputs).slice(0, 3).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-xs">
                                          <span className="text-muted-foreground">
                                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                          </span>
                                          <span className="font-medium">{String(value)}</span>
                                        </div>
                                      ))}
                                      {Object.keys(item.inputs).length > 3 && (
                                        <div className="text-xs text-muted-foreground">
                                          ... and {Object.keys(item.inputs).length - 3} more
                                        </div>
                                      )}
                                    </div>
                                  </ScrollArea>
                                </div>
                                
                                {/* Notes section */}
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-medium text-muted-foreground">Clinical Notes:</p>
                                    {editingNotes !== item.id && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => startEditingNotes(item.id, item.notes)}
                                      >
                                        <FileText className="h-3 w-3 mr-1" />
                                        {item.notes ? 'Edit' : 'Add'}
                                      </Button>
                                    )}
                                  </div>
                                  
                                  {editingNotes === item.id ? (
                                    <div className="space-y-2">
                                      <Textarea
                                        value={notesDraft}
                                        onChange={(e) => setNotesDraft(e.target.value)}
                                        placeholder="Add clinical notes..."
                                        className="min-h-[80px] text-sm"
                                      />
                                      <div className="flex gap-2">
                                        <Button size="sm" onClick={() => saveNotes(item.id)}>
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setEditingNotes(null)}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    item.notes && (
                                      <p className="text-xs text-muted-foreground bg-muted rounded-md p-2">
                                        {item.notes}
                                      </p>
                                    )
                                  )}
                                </div>
                                
                                {/* Actions */}
                                <div className="flex justify-end">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteCalculation(item.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </TimelineEntry>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}