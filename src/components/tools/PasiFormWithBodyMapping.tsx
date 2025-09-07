"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BodyMapping } from '@/components/ui/body-mapping';
import { severityOptions0to4, getValidationSchema } from '@/lib/toolValidation';
import { Button } from '@/components/ui/button';
import { PremiumButton } from '@/components/ui/button-premium';
import { Info, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Form } from '@/components/ui/form';
import type { Tool } from '@/lib/types';

interface PasiFormProps {
  tool: any;
  onCalculate: (inputs: Record<string, any>) => void;
}

interface BodyRegion {
  id: string;
  name: string;
  path: string;
  percentage: number;
  severity?: number;
}

// Convert percentage to PASI area score (0-6)
const percentageToAreaScore = (percentage: number): number => {
  if (percentage === 0) return 0;
  if (percentage < 10) return 1;
  if (percentage < 30) return 2;
  if (percentage < 50) return 3;
  if (percentage < 70) return 4;
  if (percentage < 90) return 5;
  return 6;
};

// Convert PASI area score to percentage range
const areaScoreToPercentage = (score: number): number => {
  const mapping: Record<number, number> = {
    0: 0,
    1: 5,   // Middle of 1-9%
    2: 20,  // Middle of 10-29%
    3: 40,  // Middle of 30-49%
    4: 60,  // Middle of 50-69%
    5: 80,  // Middle of 70-89%
    6: 95   // Middle of 90-100%
  };
  return mapping[score] || 0;
};

export function PasiFormWithBodyMapping({ tool, onCalculate }: PasiFormProps) {
  console.log('PasiFormWithBodyMapping loaded for tool:', tool.id);
  // Generate form schema from tool configuration
  const formSchema = React.useMemo(() => {
    const shape: Record<string, z.ZodSchema<any>> = {};
    const regions = ['h', 'u', 't', 'l'];
    regions.forEach(region => {
      shape[`E_${region}`] = getValidationSchema('select', severityOptions0to4, 0, 4);
      shape[`I_${region}`] = getValidationSchema('select', severityOptions0to4, 0, 4);
      shape[`S_${region}`] = getValidationSchema('select', severityOptions0to4, 0, 4);
      shape[`A_${region}`] = getValidationSchema('number', undefined, 0, 6);
    });
    return z.object(shape);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      E_h: 0, I_h: 0, S_h: 0, A_h: 0,
      E_u: 0, I_u: 0, S_u: 0, A_u: 0,
      E_t: 0, I_t: 0, S_t: 0, A_t: 0,
      E_l: 0, I_l: 0, S_l: 0, A_l: 0,
    },
  });
  const [bodyRegions, setBodyRegions] = useState<BodyRegion[]>([
    { id: 'head_neck', name: 'Head/Neck', path: '', percentage: 0 },
    { id: 'upper_limbs', name: 'Upper Limbs', path: '', percentage: 0 },
    { id: 'trunk', name: 'Trunk', path: '', percentage: 0 },
    { id: 'lower_limbs', name: 'Lower Limbs', path: '', percentage: 0 },
  ]);

  // Initialize body regions from form values
  useEffect(() => {
    const headArea = form.getValues('A_h');
    const upperArea = form.getValues('A_u');
    const trunkArea = form.getValues('A_t');
    const lowerArea = form.getValues('A_l');

    setBodyRegions([
      { id: 'head_neck', name: 'Head/Neck', path: '', percentage: areaScoreToPercentage(Number(headArea) || 0) },
      { id: 'upper_limbs', name: 'Upper Limbs', path: '', percentage: areaScoreToPercentage(Number(upperArea) || 0) },
      { id: 'trunk', name: 'Trunk', path: '', percentage: areaScoreToPercentage(Number(trunkArea) || 0) },
      { id: 'lower_limbs', name: 'Lower Limbs', path: '', percentage: areaScoreToPercentage(Number(lowerArea) || 0) },
    ]);
  }, []);

  const handleRegionUpdate = useCallback((regionId: string, data: Partial<BodyRegion>) => {
    setBodyRegions(prev => prev.map(region => 
      region.id === regionId ? { ...region, ...data } : region
    ));

    // Update form values based on region
    if (data.percentage !== undefined) {
      const areaScore = percentageToAreaScore(data.percentage);
      const regionMap: Record<string, string> = {
        'head_neck': 'A_h',
        'upper_limbs': 'A_u',
        'trunk': 'A_t',
        'lower_limbs': 'A_l'
      };
      
      if (regionMap[regionId]) {
        form.setValue(regionMap[regionId], areaScore.toString());
      }
    }
  }, [form]);

  const regionConfig = [
    { abbr: 'h', name: 'Head/Neck', multiplier: 0.1, bsa: 10 },
    { abbr: 'u', name: 'Upper Limbs', multiplier: 0.2, bsa: 20 },
    { abbr: 't', name: 'Trunk', multiplier: 0.3, bsa: 30 },
    { abbr: 'l', name: 'Lower Limbs', multiplier: 0.4, bsa: 40 },
  ];

  const onSubmit = (data: Record<string, any>) => {
    onCalculate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
        <CardContent className="space-y-6">
          {/* Body Mapping Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Body Surface Area Mapping
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Click on body regions to select affected areas. The percentage will be automatically converted to PASI area scores (0-6).</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <BodyMapping
          regions={bodyRegions}
          onRegionUpdate={handleRegionUpdate}
          mode="percentage"
          showHeatmap={true}
          className="w-full"
        />
        
        {/* Area Score Reference */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium mb-2">PASI Area Score Reference:</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div>0 = No involvement (0%)</div>
            <div>4 = 50-69% affected</div>
            <div>1 = &lt;10% affected</div>
            <div>5 = 70-89% affected</div>
            <div>2 = 10-29% affected</div>
            <div>6 = 90-100% affected</div>
            <div>3 = 30-49% affected</div>
          </div>
        </div>
      </Card>

      {/* Traditional Form Sections */}
      <Tabs defaultValue="h" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {regionConfig.map(region => (
            <TabsTrigger key={region.abbr} value={region.abbr}>
              {region.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {regionConfig.map(region => (
          <TabsContent key={region.abbr} value={region.abbr}>
            <Card className="p-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold">{region.name} Region</h4>
                <p className="text-sm text-muted-foreground">
                  Multiplier x{region.multiplier} ({region.bsa}% of BSA)
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Erythema */}
                <div className="space-y-2">
                  <Label htmlFor={`E_${region.abbr}`}>Erythema (Redness)</Label>
                  <Select
                    value={form.watch(`E_${region.abbr}`)?.toString() || "0"}
                    onValueChange={(value) => form.setValue(`E_${region.abbr}`, value)}
                  >
                    <SelectTrigger id={`E_${region.abbr}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {severityOptions0to4.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Induration */}
                <div className="space-y-2">
                  <Label htmlFor={`I_${region.abbr}`}>Induration (Thickness)</Label>
                  <Select
                    value={form.watch(`I_${region.abbr}`)?.toString() || "0"}
                    onValueChange={(value) => form.setValue(`I_${region.abbr}`, value)}
                  >
                    <SelectTrigger id={`I_${region.abbr}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {severityOptions0to4.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Scaling */}
                <div className="space-y-2">
                  <Label htmlFor={`S_${region.abbr}`}>Scaling (Desquamation)</Label>
                  <Select
                    value={form.watch(`S_${region.abbr}`)?.toString() || "0"}
                    onValueChange={(value) => form.setValue(`S_${region.abbr}`, value)}
                  >
                    <SelectTrigger id={`S_${region.abbr}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {severityOptions0to4.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Area - now synced with body mapping */}
                <div className="space-y-2">
                  <Label htmlFor={`A_${region.abbr}`}>
                    Area Score
                    <span className="text-xs text-muted-foreground ml-2">
                      (Auto-set from body map)
                    </span>
                  </Label>
                  <Select
                    value={form.watch(`A_${region.abbr}`)?.toString() || "0"}
                    onValueChange={(value) => {
                      form.setValue(`A_${region.abbr}`, value);
                      // Update body mapping
                      const regionIdMap: Record<string, string> = {
                        'h': 'head_neck',
                        'u': 'upper_limbs',
                        't': 'trunk',
                        'l': 'lower_limbs'
                      };
                      if (regionIdMap[region.abbr]) {
                        const percentage = areaScoreToPercentage(Number(value));
                        handleRegionUpdate(regionIdMap[region.abbr], { percentage });
                      }
                    }}
                  >
                    <SelectTrigger id={`A_${region.abbr}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 - No involvement</SelectItem>
                      <SelectItem value="1">1 - &lt;10% affected</SelectItem>
                      <SelectItem value="2">2 - 10-29% affected</SelectItem>
                      <SelectItem value="3">3 - 30-49% affected</SelectItem>
                      <SelectItem value="4">4 - 50-69% affected</SelectItem>
                      <SelectItem value="5">5 - 70-89% affected</SelectItem>
                      <SelectItem value="6">6 - 90-100% affected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Real-time calculation preview for this region */}
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium">Region Calculation Preview:</p>
                <div className="text-xs text-muted-foreground mt-1">
                  E({form.watch(`E_${region.abbr}`) || 0}) + 
                  I({form.watch(`I_${region.abbr}`) || 0}) + 
                  S({form.watch(`S_${region.abbr}`) || 0}) × 
                  A({form.watch(`A_${region.abbr}`) || 0}) × 
                  {region.multiplier} = 
                  <span className="font-semibold ml-1">
                    {(
                      (Number(form.watch(`E_${region.abbr}`) || 0) +
                       Number(form.watch(`I_${region.abbr}`) || 0) +
                       Number(form.watch(`S_${region.abbr}`) || 0)) *
                      Number(form.watch(`A_${region.abbr}`) || 0) *
                      region.multiplier
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
        </CardContent>
        <CardFooter className="p-6 pt-4 flex justify-end">
          <PremiumButton type="submit" size="lg">
            Calculate PASI Score
          </PremiumButton>
        </CardFooter>
      </form>
    </Form>
  );
}