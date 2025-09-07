"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BodyMapping } from '@/components/ui/body-mapping';
import { Button } from '@/components/ui/button';
import { PremiumButton } from '@/components/ui/button-premium';
import { Info, MapPin, Activity, Moon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { Form } from '@/components/ui/form';
import { getValidationSchema } from '@/lib/toolValidation';
import type { Tool } from '@/lib/types';

interface ScoradFormProps {
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

const intensityOptions = [
  { value: 0, label: '0 - None' },
  { value: 1, label: '1 - Mild' },
  { value: 2, label: '2 - Moderate' },
  { value: 3, label: '3 - Severe' },
];

export function ScoradFormWithBodyMapping({ tool, onCalculate }: ScoradFormProps) {
  // Generate form schema
  const formSchema = React.useMemo(() => {
    const shape: Record<string, z.ZodSchema<any>> = {
      extentPercent: z.number().min(0).max(100),
      intensityRedness: z.number().min(0).max(3),
      intensityEdema: z.number().min(0).max(3),
      intensityOozing: z.number().min(0).max(3),
      intensityExcoriation: z.number().min(0).max(3),
      intensityLichenification: z.number().min(0).max(3),
      intensityDryness: z.number().min(0).max(3),
      pruritusVAS: z.number().min(0).max(10),
      sleepLossVAS: z.number().min(0).max(10),
    };
    return z.object(shape);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      extentPercent: 0,
      intensityRedness: 0,
      intensityEdema: 0,
      intensityOozing: 0,
      intensityExcoriation: 0,
      intensityLichenification: 0,
      intensityDryness: 0,
      pruritusVAS: 0,
      sleepLossVAS: 0,
    },
  });
  const [bodyRegions, setBodyRegions] = useState<BodyRegion[]>([
    { id: 'head_neck', name: 'Head & Neck', path: '', percentage: 0 },
    { id: 'upper_limbs', name: 'Upper Limbs', path: '', percentage: 0 },
    { id: 'trunk_front', name: 'Trunk (Front)', path: '', percentage: 0 },
    { id: 'trunk_back', name: 'Trunk (Back)', path: '', percentage: 0 },
    { id: 'lower_limbs', name: 'Lower Limbs', path: '', percentage: 0 },
  ]);

  // Calculate total BSA from all regions
  const calculateTotalBSA = useCallback((regions: BodyRegion[]) => {
    const weights = {
      'head_neck': 9,      // 9% for head and neck
      'upper_limbs': 18,   // 18% for both upper limbs (9% each)
      'trunk_front': 18,   // 18% for front trunk
      'trunk_back': 18,    // 18% for back trunk
      'lower_limbs': 36,   // 36% for both lower limbs (18% each)
    };

    let totalBSA = 0;
    regions.forEach(region => {
      const regionWeight = weights[region.id as keyof typeof weights] || 0;
      // Calculate the portion of this region that's affected
      const regionBSA = (region.percentage / 100) * regionWeight;
      totalBSA += regionBSA;
    });

    return Math.min(100, Math.round(totalBSA));
  }, []);

  // Initialize from form value
  useEffect(() => {
    const currentBSA = Number(form.getValues('extentPercent')) || 0;
    // Distribute the BSA proportionally across regions for initial display
    if (currentBSA > 0) {
      setBodyRegions(prev => prev.map(region => ({
        ...region,
        percentage: currentBSA // Simple initial distribution
      })));
    }
  }, []);

  const handleRegionUpdate = useCallback((regionId: string, data: Partial<BodyRegion>) => {
    setBodyRegions(prev => {
      const updated = prev.map(region => 
        region.id === regionId ? { ...region, ...data } : region
      );
      
      // Calculate and update total BSA
      const totalBSA = calculateTotalBSA(updated);
      form.setValue('extentPercent', totalBSA);
      
      return updated;
    });
  }, [form, calculateTotalBSA]);

  const onSubmit = (data: Record<string, any>) => {
    onCalculate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
        <CardContent className="space-y-6">
          {/* Part A: Extent with Body Mapping */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Part A: Extent (Body Surface Area)
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Click on body regions to mark affected areas. The total BSA will be calculated automatically using the Rule of Nines.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <BodyMapping
          regions={bodyRegions}
          onRegionUpdate={handleRegionUpdate}
          mode="percentage"
          showHeatmap={true}
          className="w-full mb-4"
        />
        
        {/* Total BSA Display */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <Label htmlFor="extentPercent" className="text-base">
              Total Body Surface Area Involved
            </Label>
            <div className="text-2xl font-bold text-primary">
              {form.watch('extentPercent') || 0}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Calculated using the Rule of Nines
          </p>
          
          {/* Manual override option */}
          <div className="mt-3">
            <Label htmlFor="manual_bsa" className="text-sm">Manual Override (if needed)</Label>
            <Input
              id="manual_bsa"
              type="number"
              min={0}
              max={100}
              value={form.watch('extentPercent') || 0}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 0 && value <= 100) {
                  form.setValue('extentPercent', value);
                  // Reset body regions when manually overridden
                  setBodyRegions(prev => prev.map(region => ({
                    ...region,
                    percentage: 0
                  })));
                }
              }}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Part B: Intensity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Part B: Intensity</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Assess the average intensity of six clinical signs across affected areas
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'intensityRedness', label: 'Erythema' },
            { id: 'intensityEdema', label: 'Edema/Papulation' },
            { id: 'intensityOozing', label: 'Oozing/Crusting' },
            { id: 'intensityExcoriation', label: 'Excoriation' },
            { id: 'intensityLichenification', label: 'Lichenification' },
            { id: 'intensityDryness', label: 'Dryness (non-affected skin)' },
          ].map(sign => (
            <div key={sign.id} className="space-y-2">
              <Label htmlFor={sign.id}>{sign.label}</Label>
              <Select
                value={form.watch(sign.id)?.toString() || "0"}
                onValueChange={(value) => form.setValue(sign.id, Number(value))}
              >
                <SelectTrigger id={sign.id}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {intensityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        
        {/* Intensity Sum Preview */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm">
            <span className="font-medium">Total Intensity Score:</span>{' '}
            {(Number(form.watch('intensityRedness') || 0) +
              Number(form.watch('intensityEdema') || 0) +
              Number(form.watch('intensityOozing') || 0) +
              Number(form.watch('intensityExcoriation') || 0) +
              Number(form.watch('intensityLichenification') || 0) +
              Number(form.watch('intensityDryness') || 0))} / 18
          </p>
        </div>
      </Card>

      {/* Part C: Subjective Symptoms */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Part C: Subjective Symptoms</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Patient rates average itch and sleep loss over the past three days (0-10 scale)
        </p>
        
        <div className="space-y-6">
          {/* Pruritus (Itch) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <Label htmlFor="pruritusVAS">Pruritus (Itch) VAS</Label>
              <span className="ml-auto text-lg font-semibold">
                {form.watch('pruritusVAS') || 0}
              </span>
            </div>
            <Slider
              id="pruritusVAS"
              min={0}
              max={10}
              step={0.5}
              value={[Number(form.watch('pruritusVAS') || 0)]}
              onValueChange={(value) => form.setValue('pruritusVAS', value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>No itch</span>
              <span>Worst imaginable itch</span>
            </div>
          </div>

          {/* Sleep Loss */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-primary" />
              <Label htmlFor="sleepLossVAS">Sleeplessness VAS</Label>
              <span className="ml-auto text-lg font-semibold">
                {form.watch('sleepLossVAS') || 0}
              </span>
            </div>
            <Slider
              id="sleepLossVAS"
              min={0}
              max={10}
              step={0.5}
              value={[Number(form.watch('sleepLossVAS') || 0)]}
              onValueChange={(value) => form.setValue('sleepLossVAS', value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>No sleep loss</span>
              <span>Total sleep loss</span>
            </div>
          </div>
        </div>
        
        {/* Subjective Symptoms Sum Preview */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm">
            <span className="font-medium">Total Subjective Score:</span>{' '}
            {(Number(form.watch('pruritusVAS') || 0) + 
              Number(form.watch('sleepLossVAS') || 0)).toFixed(1)} / 20
          </p>
        </div>
      </Card>

      {/* Real-time SCORAD Calculation Preview */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="font-semibold mb-2">SCORAD Score Preview</h4>
        <div className="text-sm space-y-1">
          <p>A (Extent): {form.watch('extentPercent') || 0}</p>
          <p>B (Intensity): {
            Number(form.watch('intensityRedness') || 0) +
            Number(form.watch('intensityEdema') || 0) +
            Number(form.watch('intensityOozing') || 0) +
            Number(form.watch('intensityExcoriation') || 0) +
            Number(form.watch('intensityLichenification') || 0) +
            Number(form.watch('intensityDryness') || 0)
          }</p>
          <p>C (Subjective): {
            (Number(form.watch('pruritusVAS') || 0) + 
             Number(form.watch('sleepLossVAS') || 0)).toFixed(1)
          }</p>
          <div className="pt-2 mt-2 border-t">
            <p className="font-semibold">
              Total SCORAD: {(
                (Number(form.watch('extentPercent') || 0) / 5) +
                (7 * (Number(form.watch('intensityRedness') || 0) +
                      Number(form.watch('intensityEdema') || 0) +
                      Number(form.watch('intensityOozing') || 0) +
                      Number(form.watch('intensityExcoriation') || 0) +
                      Number(form.watch('intensityLichenification') || 0) +
                      Number(form.watch('intensityDryness') || 0)) / 2) +
                Number(form.watch('pruritusVAS') || 0) +
                Number(form.watch('sleepLossVAS') || 0)
              ).toFixed(1)} / 103
            </p>
          </div>
        </div>
      </Card>
        </CardContent>
        <CardFooter className="p-6 pt-4 flex justify-end">
          <PremiumButton type="submit" size="lg">
            Calculate SCORAD Score
          </PremiumButton>
        </CardFooter>
      </form>
    </Form>
  );
}