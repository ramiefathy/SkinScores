"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { BodyMapping } from '@/components/ui/body-mapping';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, Camera, TrendingUp, Info, 
  ChevronRight, RotateCcw, Save 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tool } from '@/lib/types';

interface PASIRegionData {
  id: string;
  name: string;
  path: string;
  percentage: number;
  erythema: number;
  induration: number;
  scaling: number;
  multiplier: number;
  score?: number;
}

const initialRegions: PASIRegionData[] = [
  { id: 'head_neck', name: 'Head/Neck', path: '', percentage: 0, erythema: 0, induration: 0, scaling: 0, multiplier: 0.1 },
  { id: 'upper_limbs', name: 'Upper Limbs', path: '', percentage: 0, erythema: 0, induration: 0, scaling: 0, multiplier: 0.2 },
  { id: 'trunk', name: 'Trunk', path: '', percentage: 0, erythema: 0, induration: 0, scaling: 0, multiplier: 0.3 },
  { id: 'lower_limbs', name: 'Lower Limbs', path: '', percentage: 0, erythema: 0, induration: 0, scaling: 0, multiplier: 0.4 }
];

const severityOptions = [
  { value: 0, label: 'None', color: 'bg-green-100 text-green-800' },
  { value: 1, label: 'Mild', color: 'bg-yellow-100 text-yellow-800' },
  { value: 2, label: 'Moderate', color: 'bg-orange-100 text-orange-800' },
  { value: 3, label: 'Severe', color: 'bg-red-100 text-red-800' }
];

const areaScoreMapping = [
  { range: [0, 0], score: 0, label: '0%' },
  { range: [1, 9], score: 1, label: '1-9%' },
  { range: [10, 29], score: 2, label: '10-29%' },
  { range: [30, 49], score: 3, label: '30-49%' },
  { range: [50, 69], score: 4, label: '50-69%' },
  { range: [70, 89], score: 5, label: '70-89%' },
  { range: [90, 100], score: 6, label: '90-100%' }
];

interface PASIEnhancedProps {
  tool: Tool;
  onCalculate: (inputs: Record<string, any>) => void;
}

export function PASIEnhanced({ tool, onCalculate }: PASIEnhancedProps) {
  const [regions, setRegions] = useState<PASIRegionData[]>(initialRegions);
  const [activeTab, setActiveTab] = useState('body-mapping');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [showRealTimeScore, setShowRealTimeScore] = useState(true);

  // Calculate area score from percentage
  const getAreaScore = useCallback((percentage: number): number => {
    const mapping = areaScoreMapping.find(m => percentage >= m.range[0] && percentage <= m.range[1]);
    return mapping ? mapping.score : 0;
  }, []);

  // Calculate PASI score
  const calculatePASI = useCallback(() => {
    let total = 0;
    const updatedRegions = regions.map(region => {
      const areaScore = getAreaScore(region.percentage);
      const severitySum = region.erythema + region.induration + region.scaling;
      const regionScore = region.multiplier * severitySum * areaScore;
      total += regionScore;
      return { ...region, score: regionScore };
    });
    
    setRegions(updatedRegions);
    setTotalScore(parseFloat(total.toFixed(1)));
    
    // Prepare inputs for original calculation logic
    const inputs: Record<string, any> = {};
    regions.forEach(region => {
      const abbr = region.id === 'head_neck' ? 'h' : 
                   region.id === 'upper_limbs' ? 'u' : 
                   region.id === 'trunk' ? 't' : 'l';
      inputs[`E_${abbr}`] = region.erythema;
      inputs[`I_${abbr}`] = region.induration;
      inputs[`S_${abbr}`] = region.scaling;
      inputs[`A_${abbr}`] = getAreaScore(region.percentage);
    });
    
    return inputs;
  }, [regions, getAreaScore]);

  // Real-time calculation
  useEffect(() => {
    if (showRealTimeScore) {
      calculatePASI();
    }
  }, [regions, showRealTimeScore, calculatePASI]);

  // Handle region update from body mapping
  const handleRegionUpdate = useCallback((regionId: string, data: Partial<PASIRegionData>) => {
    setRegions(prev => prev.map(region => 
      region.id === regionId ? { ...region, ...data } : region
    ));
  }, []);

  // Handle severity update
  const handleSeverityUpdate = useCallback((regionId: string, type: 'erythema' | 'induration' | 'scaling', value: number) => {
    setRegions(prev => prev.map(region => 
      region.id === regionId ? { ...region, [type]: value } : region
    ));
  }, []);

  // Get severity interpretation
  const getSeverityInterpretation = (score: number) => {
    if (score < 10) return { label: 'Mild Psoriasis', color: 'text-green-600' };
    if (score <= 20) return { label: 'Moderate Psoriasis', color: 'text-orange-600' };
    return { label: 'Severe Psoriasis', color: 'text-red-600' };
  };

  const interpretation = getSeverityInterpretation(totalScore);

  return (
    <div className="space-y-6">
      {/* Header with Real-time Score */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              PASI Calculator - Enhanced
            </CardTitle>
            {showRealTimeScore && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-right"
              >
                <div className="text-3xl font-bold">{totalScore}</div>
                <div className={`text-sm font-medium ${interpretation.color}`}>
                  {interpretation.label}
                </div>
              </motion.div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Main Interface Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="body-mapping" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Body Mapping
          </TabsTrigger>
          <TabsTrigger value="severity-grading" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Severity Grading
          </TabsTrigger>
          <TabsTrigger value="photo-reference" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Photo Reference
          </TabsTrigger>
        </TabsList>

        {/* Body Mapping Tab */}
        <TabsContent value="body-mapping" className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Click on body regions to select them, then adjust the percentage of area affected using the slider.
            </AlertDescription>
          </Alert>
          
          <BodyMapping
            regions={regions.map(r => ({
              id: r.id,
              name: r.name,
              path: r.path,
              percentage: r.percentage,
              severity: Math.round((r.erythema + r.induration + r.scaling) / 3)
            }))}
            onRegionUpdate={handleRegionUpdate}
            mode="percentage"
            showHeatmap={true}
            allowPhotoAnnotation={true}
          />
        </TabsContent>

        {/* Severity Grading Tab */}
        <TabsContent value="severity-grading" className="space-y-4">
          {regions.filter(r => r.percentage > 0).length === 0 ? (
            <Alert>
              <AlertDescription>
                Please select affected regions in the Body Mapping tab first.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {regions.filter(r => r.percentage > 0).map((region, index) => (
                <motion.div
                  key={region.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{region.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{region.percentage}% affected</Badge>
                          <Badge>Score: {region.score?.toFixed(1) || 0}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      {['erythema', 'induration', 'scaling'].map((type) => (
                        <div key={type} className="space-y-2">
                          <label className="text-sm font-medium capitalize">
                            {type} {type === 'erythema' && '(Redness)'}
                            {type === 'induration' && '(Thickness)'}
                            {type === 'scaling' && '(Scale)'}
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {severityOptions.map((option) => (
                              <motion.button
                                key={option.value}
                                onClick={() => handleSeverityUpdate(
                                  region.id, 
                                  type as 'erythema' | 'induration' | 'scaling', 
                                  option.value
                                )}
                                className={cn(
                                  "p-3 rounded-lg border transition-all",
                                  region[type as keyof PASIRegionData] === option.value
                                    ? option.color
                                    : "bg-background hover:bg-muted"
                                )}
                                whileTap={{ scale: 0.95 }}
                              >
                                <div className="font-semibold">{option.value}</div>
                                <div className="text-xs">{option.label}</div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Photo Reference Tab */}
        <TabsContent value="photo-reference" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Severity Reference Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['erythema', 'induration', 'scaling'].map((type) => (
                  <div key={type} className="space-y-3">
                    <h4 className="font-semibold capitalize">{type}</h4>
                    <div className="space-y-2">
                      {severityOptions.map((option) => (
                        <div key={option.value} className={cn(
                          "p-3 rounded-lg border flex items-center gap-3",
                          "hover:bg-muted/50 cursor-pointer transition-colors"
                        )}>
                          <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">
                            <Camera className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-muted-foreground">
                              Score: {option.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setRegions(initialRegions);
            setTotalScore(0);
          }}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            const inputs = calculatePASI();
            // Save as template logic here
          }}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Template
        </Button>
        
        <Button
          onClick={() => {
            const inputs = calculatePASI();
            onCalculate(inputs);
          }}
          className="flex-1"
          disabled={regions.every(r => r.percentage === 0)}
        >
          Calculate Final Score
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assessment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Regions Assessed</span>
              <span className="font-medium">
                {regions.filter(r => r.percentage > 0).length} / {regions.length}
              </span>
            </div>
            <Progress 
              value={(regions.filter(r => r.percentage > 0).length / regions.length) * 100} 
              className="h-2"
            />
            
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div className="flex justify-between">
                <span>Total BSA:</span>
                <span className="font-medium">{regions.reduce((sum, r) => sum + r.percentage, 0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Max Severity:</span>
                <span className="font-medium">
                  {Math.max(...regions.flatMap(r => [r.erythema, r.induration, r.scaling]))}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}