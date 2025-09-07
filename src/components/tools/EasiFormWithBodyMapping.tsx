"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BodyMapping } from '@/components/ui/body-mapping';
import { Button } from '@/components/ui/button';
import { PremiumButton } from '@/components/ui/button-premium';
import { Info, MapPin, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Form } from '@/components/ui/form';
import { getValidationSchema } from '@/lib/toolValidation';
import type { Tool } from '@/lib/types';

interface EasiFormProps {
  tool: Tool;
  onCalculate: (inputs: Record<string, any>) => void;
}

interface BodyRegion {
  id: string;
  name: string;
  path: string;
  percentage: number;
  severity?: number;
}

// Convert percentage to EASI area score (0-6)
const percentageToAreaScore = (percentage: number): number => {
  if (percentage === 0) return 0;
  if (percentage < 10) return 1;
  if (percentage < 30) return 2;
  if (percentage < 50) return 3;
  if (percentage < 70) return 4;
  if (percentage < 90) return 5;
  return 6;
};

// Convert EASI area score to percentage range
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

const severityOptions = [
  { value: 0, label: '0 - None' },
  { value: 1, label: '1 - Mild' },
  { value: 2, label: '2 - Moderate' },
  { value: 3, label: '3 - Severe' },
];

export function EasiFormWithBodyMapping({ tool, onCalculate }: EasiFormProps) {
  // Generate form schema
  const formSchema = React.useMemo(() => {
    const shape: Record<string, z.ZodSchema<any>> = {};
    shape['age_group'] = z.string();
    const regions = ['head_neck', 'upper_limbs', 'trunk', 'lower_limbs'];
    regions.forEach(region => {
      shape[`${region}_area`] = z.number().min(0).max(6);
      shape[`${region}_erythema`] = z.number().min(0).max(3);
      shape[`${region}_induration`] = z.number().min(0).max(3);
      shape[`${region}_excoriation`] = z.number().min(0).max(3);
      shape[`${region}_lichenification`] = z.number().min(0).max(3);
    });
    return z.object(shape);
  }, []);

  const defaultValues = React.useMemo(() => {
    const defaults: Record<string, any> = { age_group: 'adult' };
    const regions = ['head_neck', 'upper_limbs', 'trunk', 'lower_limbs'];
    regions.forEach(region => {
      defaults[`${region}_area`] = 0;
      defaults[`${region}_erythema`] = 0;
      defaults[`${region}_induration`] = 0;
      defaults[`${region}_excoriation`] = 0;
      defaults[`${region}_lichenification`] = 0;
    });
    return defaults;
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const [bodyRegions, setBodyRegions] = useState<BodyRegion[]>([
    { id: 'head_neck', name: 'Head & Neck', path: '', percentage: 0 },
    { id: 'upper_limbs', name: 'Upper Limbs', path: '', percentage: 0 },
    { id: 'trunk', name: 'Trunk (incl. genitals)', path: '', percentage: 0 },
    { id: 'lower_limbs', name: 'Lower Limbs (incl. buttocks)', path: '', percentage: 0 },
  ]);

  const ageGroup = form.watch('age_group') || 'adult';

  // Initialize body regions from form values
  useEffect(() => {
    const regions = ['head_neck', 'upper_limbs', 'trunk', 'lower_limbs'];
    const updatedRegions = regions.map(regionId => {
      const areaValue = form.getValues(`${regionId}_area`);
      return {
        id: regionId,
        name: regionId === 'head_neck' ? 'Head & Neck' : 
              regionId === 'upper_limbs' ? 'Upper Limbs' :
              regionId === 'trunk' ? 'Trunk (incl. genitals)' : 
              'Lower Limbs (incl. buttocks)',
        path: '',
        percentage: areaScoreToPercentage(Number(areaValue) || 0)
      };
    });
    setBodyRegions(updatedRegions);
  }, []);

  const handleRegionUpdate = useCallback((regionId: string, data: Partial<BodyRegion>) => {
    setBodyRegions(prev => prev.map(region => 
      region.id === regionId ? { ...region, ...data } : region
    ));

    // Update form values based on region
    if (data.percentage !== undefined) {
      const areaScore = percentageToAreaScore(data.percentage);
      form.setValue(`${regionId}_area`, areaScore);
    }
  }, [form]);

  const regionConfig = [
    { id: 'head_neck', name: 'Head & Neck', adultWeight: 0.1, childWeight: 0.2 },
    { id: 'upper_limbs', name: 'Upper Limbs', adultWeight: 0.2, childWeight: 0.2 },
    { id: 'trunk', name: 'Trunk (incl. genitals)', adultWeight: 0.3, childWeight: 0.3 },
    { id: 'lower_limbs', name: 'Lower Limbs (incl. buttocks)', adultWeight: 0.4, childWeight: 0.3 },
  ];

  const onSubmit = (data: Record<string, any>) => {
    onCalculate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
        <CardContent className="space-y-6">
          {/* Age Group Selection */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <User className="h-5 w-5 text-primary" />
          <div className="flex-1 space-y-2">
            <Label htmlFor="age_group">Age Group (determines regional weights)</Label>
            <Select
              value={form.watch('age_group') || 'adult'}
              onValueChange={(value) => form.setValue('age_group', value)}
            >
              <SelectTrigger id="age_group">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adult">Adult/Child &gt;7 years</SelectItem>
                <SelectItem value="child">Child 0-7 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

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
                <p>Click on body regions to select affected areas. The percentage will be automatically converted to EASI area scores (0-6).</p>
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
          <p className="text-sm font-medium mb-2">EASI Area Score Reference:</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div>0 = No involvement (0%)</div>
            <div>4 = 50-69% affected</div>
            <div>1 = 1-9% affected</div>
            <div>5 = 70-89% affected</div>
            <div>2 = 10-29% affected</div>
            <div>6 = 90-100% affected</div>
            <div>3 = 30-49% affected</div>
          </div>
        </div>
      </Card>

      {/* Traditional Form Sections */}
      <Tabs defaultValue="head_neck" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {regionConfig.map(region => (
            <TabsTrigger key={region.id} value={region.id}>
              {region.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {regionConfig.map(region => {
          const weight = ageGroup === 'child' ? region.childWeight : region.adultWeight;
          
          return (
            <TabsContent key={region.id} value={region.id}>
              <Card className="p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold">{region.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Weight: {weight} ({ageGroup === 'child' ? 'Child 0-7 years' : 'Adult/Child >7 years'})
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Area - synced with body mapping */}
                  <div className="space-y-2">
                    <Label htmlFor={`${region.id}_area`}>
                      Area Affected Score
                      <span className="text-xs text-muted-foreground ml-2">
                        (Auto-set from body map)
                      </span>
                    </Label>
                    <Select
                      value={form.watch(`${region.id}_area`)?.toString() || "0"}
                      onValueChange={(value) => {
                        form.setValue(`${region.id}_area`, Number(value));
                        // Update body mapping
                        const percentage = areaScoreToPercentage(Number(value));
                        handleRegionUpdate(region.id, { percentage });
                      }}
                    >
                      <SelectTrigger id={`${region.id}_area`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 (0%)</SelectItem>
                        <SelectItem value="1">1 (1-9%)</SelectItem>
                        <SelectItem value="2">2 (10-29%)</SelectItem>
                        <SelectItem value="3">3 (30-49%)</SelectItem>
                        <SelectItem value="4">4 (50-69%)</SelectItem>
                        <SelectItem value="5">5 (70-89%)</SelectItem>
                        <SelectItem value="6">6 (90-100%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Erythema */}
                  <div className="space-y-2">
                    <Label htmlFor={`${region.id}_erythema`}>Erythema</Label>
                    <Select
                      value={form.watch(`${region.id}_erythema`)?.toString() || "0"}
                      onValueChange={(value) => form.setValue(`${region.id}_erythema`, Number(value))}
                    >
                      <SelectTrigger id={`${region.id}_erythema`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {severityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Induration/Papulation */}
                  <div className="space-y-2">
                    <Label htmlFor={`${region.id}_induration`}>Induration/Papulation</Label>
                    <Select
                      value={form.watch(`${region.id}_induration`)?.toString() || "0"}
                      onValueChange={(value) => form.setValue(`${region.id}_induration`, Number(value))}
                    >
                      <SelectTrigger id={`${region.id}_induration`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {severityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Excoriation */}
                  <div className="space-y-2">
                    <Label htmlFor={`${region.id}_excoriation`}>Excoriation</Label>
                    <Select
                      value={form.watch(`${region.id}_excoriation`)?.toString() || "0"}
                      onValueChange={(value) => form.setValue(`${region.id}_excoriation`, Number(value))}
                    >
                      <SelectTrigger id={`${region.id}_excoriation`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {severityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lichenification */}
                  <div className="space-y-2">
                    <Label htmlFor={`${region.id}_lichenification`}>Lichenification</Label>
                    <Select
                      value={form.watch(`${region.id}_lichenification`)?.toString() || "0"}
                      onValueChange={(value) => form.setValue(`${region.id}_lichenification`, Number(value))}
                    >
                      <SelectTrigger id={`${region.id}_lichenification`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {severityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Real-time calculation preview for this region */}
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">Region Calculation Preview:</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    (E:{form.watch(`${region.id}_erythema`) || 0} + 
                     I:{form.watch(`${region.id}_induration`) || 0} + 
                     Ex:{form.watch(`${region.id}_excoriation`) || 0} + 
                     L:{form.watch(`${region.id}_lichenification`) || 0}) × 
                    Area:{form.watch(`${region.id}_area`) || 0} × 
                    Weight:{weight} = 
                    <span className="font-semibold ml-1">
                      {(
                        (Number(form.watch(`${region.id}_erythema`) || 0) +
                         Number(form.watch(`${region.id}_induration`) || 0) +
                         Number(form.watch(`${region.id}_excoriation`) || 0) +
                         Number(form.watch(`${region.id}_lichenification`) || 0)) *
                        Number(form.watch(`${region.id}_area`) || 0) *
                        weight
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
        </CardContent>
        <CardFooter className="p-6 pt-4 flex justify-end">
          <PremiumButton type="submit" size="lg">
            Calculate EASI Score
          </PremiumButton>
        </CardFooter>
      </form>
    </Form>
  );
}