"use client";

import React, { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { PremiumButton } from '@/components/ui/button-premium';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SplitScreenLayout, ComparisonIndicator } from '@/components/ui/split-screen-layout';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitCompare, Calendar, Calculator, 
  TrendingUp, TrendingDown, Minus, AlertCircle,
  Shuffle, Sparkles, ArrowUpDown, Filter
} from 'lucide-react';
import { useCalculationHistory, type CalculationHistoryItem } from '@/hooks/useCalculationHistory';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ComparePage() {
  const { history } = useCalculationHistory();
  const [leftSelection, setLeftSelection] = useState<string | null>(null);
  const [rightSelection, setRightSelection] = useState<string | null>(null);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  const leftCalculation = history.find(item => item.id === leftSelection);
  const rightCalculation = history.find(item => item.id === rightSelection);

  const swapSelections = () => {
    const temp = leftSelection;
    setLeftSelection(rightSelection);
    setRightSelection(temp);
  };

  const getScoreDifference = (left: number | string, right: number | string) => {
    if (typeof left === 'string' || typeof right === 'string') return null;
    
    const diff = right - left;
    const percentChange = left !== 0 ? ((diff / left) * 100).toFixed(1) : null;
    
    return {
      diff,
      percentChange,
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same',
    };
  };

  // Group calculations by tool
  const groupedHistory = history.reduce((acc, item) => {
    if (!acc[item.toolName]) {
      acc[item.toolName] = [];
    }
    acc[item.toolName].push(item);
    return acc;
  }, {} as Record<string, CalculationHistoryItem[]>);

  const renderCalculationPanel = (calc: CalculationHistoryItem | null, side: 'left' | 'right') => {
    if (!calc) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <Calculator className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Select a calculation to compare</p>
        </div>
      );
    }

    return (
      <motion.div
        key={calc.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* Score Display */}
        <GlassCard>
          <CardHeader>
            <CardTitle>Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{calc.result.score}</div>
            {leftCalculation && rightCalculation && side === 'right' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                {(() => {
                  const comparison = getScoreDifference(
                    leftCalculation.result.score as number, 
                    rightCalculation.result.score as number
                  );
                  if (!comparison) return null;
                  
                  return (
                    <>
                      {comparison.trend === 'up' && (
                        <>
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-500">
                            +{comparison.diff} ({comparison.percentChange}%)
                          </span>
                        </>
                      )}
                      {comparison.trend === 'down' && (
                        <>
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-500">
                            {comparison.diff} ({comparison.percentChange}%)
                          </span>
                        </>
                      )}
                      {comparison.trend === 'same' && (
                        <>
                          <Minus className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">No change</span>
                        </>
                      )}
                    </>
                  );
                })()}
              </motion.div>
            )}
          </CardContent>
        </GlassCard>

        {/* Interpretation */}
        <GlassCard>
          <CardHeader>
            <CardTitle>Interpretation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{calc.result.interpretation}</p>
          </CardContent>
        </GlassCard>

        {/* Input Values */}
        <GlassCard>
          <CardHeader>
            <CardTitle>Input Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(calc.inputs).map(([key, value]) => {
              const otherCalc = side === 'left' ? rightCalculation : leftCalculation;
              const isDifferent = otherCalc && otherCalc.inputs[key] !== value;
              
              if (showDifferencesOnly && !isDifferent) return null;
              
              return (
                <ComparisonIndicator
                  key={key}
                  label={key.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
                  value1={value}
                  value2={otherCalc?.inputs[key]}
                />
              );
            })}
          </CardContent>
        </GlassCard>

        {/* Notes */}
        {calc.notes && (
          <GlassCard>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{calc.notes}</p>
            </CardContent>
          </GlassCard>
        )}
      </motion.div>
    );
  };

  const CalculationSelector = ({ value, onChange, excludeId }: { 
    value: string | null; 
    onChange: (value: string) => void;
    excludeId?: string | null;
  }) => (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a calculation" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupedHistory).map(([toolName, calculations]) => (
          <div key={toolName}>
            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
              {toolName}
            </div>
            {calculations
              .filter(calc => calc.id !== excludeId)
              .map(calc => (
                <SelectItem key={calc.id} value={calc.id}>
                  <div className="flex items-center gap-2">
                    <span>Score: {calc.result.score}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {format(new Date(calc.timestamp), 'MMM d, HH:mm')}
                    </span>
                  </div>
                </SelectItem>
              ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <PageWrapper>
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[hsl(var(--premium-purple))]/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              <GitCompare className="h-6 w-6" />
            </motion.div>
            <span className="text-sm font-medium uppercase tracking-wider font-accent">Compare</span>
          </div>
          <h1 className="text-4xl font-bold font-headline">Compare Calculations</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Analyze differences between your calculations side by side
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Left Calculation</Label>
                  <CalculationSelector 
                    value={leftSelection} 
                    onChange={setLeftSelection}
                    excludeId={rightSelection}
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Right Calculation</Label>
                  <CalculationSelector 
                    value={rightSelection} 
                    onChange={setRightSelection}
                    excludeId={leftSelection}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <PremiumButton
                      onClick={swapSelections}
                      disabled={!leftSelection || !rightSelection}
                      size="sm"
                    >
                      <Shuffle className="h-4 w-4 mr-2" />
                      Swap
                    </PremiumButton>
                  </motion.div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      id="differences-only"
                      checked={showDifferencesOnly}
                      onCheckedChange={setShowDifferencesOnly}
                    />
                    <Label htmlFor="differences-only" className="text-sm cursor-pointer">
                      Show differences only
                    </Label>
                  </div>
                </div>
                
                <Badge variant="secondary" className="gap-1">
                  <Filter className="h-3 w-3" />
                  {history.length} calculations available
                </Badge>
              </div>
            </CardContent>
          </GlassCard>
        </motion.div>

        {/* Split Screen Comparison */}
        {(leftSelection || rightSelection) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="h-[800px]"
          >
            <SplitScreenLayout
              leftTitle={leftCalculation ? `${leftCalculation.toolName} - ${format(new Date(leftCalculation.timestamp), 'MMM d, HH:mm')}` : 'Select Calculation'}
              rightTitle={rightCalculation ? `${rightCalculation.toolName} - ${format(new Date(rightCalculation.timestamp), 'MMM d, HH:mm')}` : 'Select Calculation'}
              leftPanel={
                <AnimatePresence mode="wait">
                  {renderCalculationPanel(leftCalculation || null, 'left')}
                </AnimatePresence>
              }
              rightPanel={
                <AnimatePresence mode="wait">
                  {renderCalculationPanel(rightCalculation || null, 'right')}
                </AnimatePresence>
              }
              className="shadow-xl"
            />
          </motion.div>
        )}

        {/* Empty State */}
        {!leftSelection && !rightSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Alert className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                Select calculations from the dropdowns above to begin comparing. 
                Best results when comparing calculations from the same tool.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}