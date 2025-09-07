
"use client";

import React, { useEffect, Suspense, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useSearchParams } from 'next/navigation';
import { useToolContext } from '@/hooks/useToolContext';
import { useScrollToElement } from '@/hooks/useScrollToTop';
import { useCalculationHistory } from '@/hooks/useCalculationHistory';
import { useAnalyticsContext } from '@/contexts/AnalyticsContext';
import { useToast } from '@/hooks/use-toast';
import { ToolFormWrapper } from '@/components/dermscore/ToolFormWrapper';
import { ResultsDisplay } from '@/components/dermscore/ResultsDisplay';
import { HomePage } from '@/components/layout/HomePage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Info, CheckSquare, List, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  getPatientRecords,
  createPatientRecord,
  savePatientRecord,
  addTimelineEntry,
  findPatientRecordByPatientId,
  encryptPatientId,
} from '@/lib/patient-progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdBanner } from '@/components/AdBanner';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ToolIntroCard } from '@/components/ui/tool-intro-card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from 'lucide-react';
import type { Tool, InputConfig } from '@/lib/types';


const getSourceTypeBadgeProps = (sourceType: Tool['sourceType']): { variant?: "default" | "secondary" | "destructive" | "outline", className?: string } => {
  switch (sourceType) {
    case 'Research':
      return { variant: "default" };
    case 'Clinical Guideline':
      return { className: "bg-accent text-accent-foreground border-transparent hover:bg-accent/80" };
    case 'Expert Consensus':
      return { variant: "secondary" };
    default:
      return { variant: "outline" };
  }
};

function SkinScorePageContent() {
  const { 
    selectedTool, 
    calculationResult,
    setCalculationResult, 
    setSelectedTool,
    handleToolSelect,
  } = useToolContext();
  const searchParams = useSearchParams();
  const scrollToElement = useScrollToElement();
  const { saveCalculation } = useCalculationHistory();
  const { trackToolUsage, trackCalculation } = useAnalyticsContext();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<any>(null);
  const [lastInputs, setLastInputs] = useState<Record<string, any>>({});
  const [calculationStartTime, setCalculationStartTime] = useState<number>(0);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [showPatientDialog, setShowPatientDialog] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Load preferences
  useEffect(() => {
    const stored = localStorage.getItem('skinscores_preferences');
    if (stored) {
      try {
        const prefs = JSON.parse(stored);
        setPreferences(prefs);
      } catch (e) {
        console.error('Failed to load preferences');
      }
    }
    setPreferencesLoaded(true);
  }, []);

  useEffect(() => {
    const toolIdFromQuery = searchParams.get('toolId');
    if (toolIdFromQuery) {
      if (toolIdFromQuery !== selectedTool?.id) {
          // Tool will be loaded by the ToolContext
          handleToolSelect(toolIdFromQuery);
      }
    } else {
      if (selectedTool) {
          handleToolSelect(null);
      }
    }
  }, [searchParams, selectedTool?.id, handleToolSelect]);


  const handleCalculate = (inputs: Record<string, any>) => {
    if (selectedTool && selectedTool.calculationLogic && selectedTool.displayType !== 'staticList') {
      // Track calculation start time
      const startTime = Date.now();
      setCalculationStartTime(startTime);
      
      const result = selectedTool.calculationLogic(inputs);
      setCalculationResult(result);
      setLastInputs(inputs); // Store inputs for save button
      scrollToElement('results-section');
      
      // Track analytics
      const duration = Date.now() - startTime;
      trackToolUsage(selectedTool, result, duration);
      trackCalculation(selectedTool, result, inputs);
      
      // Save to history if auto-save is enabled
      if (preferences?.autoSaveCalculations) {
        saveCalculation(selectedTool, result, inputs);
      }
    }
  };
  
  if (!selectedTool) {
    return <HomePage />;
  }

  const badgeProps = selectedTool ? getSourceTypeBadgeProps(selectedTool.sourceType) : {};

  return (
    <>
    <PageWrapper>
        <div className="space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/?category=${selectedTool.condition}`}>
                {selectedTool.condition}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedTool.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Show intro card if enabled and it's not a static list tool */}
        {preferences?.showIntroCards !== false && selectedTool.displayType !== 'staticList' && (
          <ToolIntroCard 
            tool={selectedTool} 
            onStart={undefined}  // Remove the Start Assessment button
            className="mb-6"
          />
        )}
        
        {/* Show form directly after intro card */}
        {selectedTool.displayType !== 'staticList' && (
          <Card className="shadow-xl border">
            <CardHeader>
                <CardTitle className="text-3xl font-headline flex items-center gap-2"><CheckSquare className="text-primary h-7 w-7"/>Scoring Inputs</CardTitle>
            </CardHeader>
            <ToolFormWrapper tool={selectedTool} onCalculate={handleCalculate} />
          </Card>
        )}
        
        {selectedTool.displayType === 'staticList' && (
           <Card className="shadow-xl border">
            <CardHeader>
                <CardTitle className="text-3xl font-headline flex items-center gap-2"><List className="text-primary h-7 w-7"/>Classification Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                  {selectedTool.formSections.flatMap((section) =>
                      'inputs' in section
                      ? (section.inputs as InputConfig[]).flatMap(input =>
                          input.options
                          ? input.options.map((option, optionIndex) => (
                              <div key={`${input.id}-${option.value}-${optionIndex}`} className="text-sm text-foreground bg-card p-3 rounded-md border shadow-sm">
                                {option.label}
                              </div>
                          ))
                          : []
                      )
                      : (section as InputConfig).options
                        ? (section as InputConfig).options!.map((option, optionIndex) => (
                          <div key={`${section.id}-${option.value}-${optionIndex}`} className="text-sm text-foreground bg-card p-3 rounded-md border shadow-sm">
                            {option.label}
                          </div>
                        ))
                        : []
                  )}
               </div>
            </CardContent>
          </Card>
        )}


        <div id="results-section" className="pt-4">
          {calculationResult && selectedTool.displayType !== 'staticList' && (
              <ResultsDisplay 
                result={calculationResult} 
                tool={selectedTool} 
                inputs={lastInputs} 
                preferences={preferences}
                onAddToPatient={() => setShowPatientDialog(true)}
              />
          )}
        </div>
        
        <Card className="shadow-xl border mt-8">
            <CardHeader>
            <CardTitle className="text-3xl font-headline flex items-center gap-2"><Info className="text-primary h-7 w-7"/>Details & References</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <p className="text-base leading-relaxed">
                    <span className="font-semibold text-foreground/90">Condition:</span> {selectedTool.condition}
                </p>
                <Badge variant={badgeProps.variant} className={`self-start ${badgeProps.className || ''}`}>
                    {selectedTool.sourceType}
                </Badge>
                    <ScrollArea className="h-auto max-h-[150px] pr-3 border rounded-md p-3 bg-muted/20">
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{selectedTool.description}</p>
                    </ScrollArea>
                {(selectedTool.rationale || selectedTool.clinicalPerformance) && (
                    <Accordion type="multiple" className="w-full">
                        {selectedTool.rationale && (
                        <AccordionItem value="rationale">
                            <AccordionTrigger>Rationale</AccordionTrigger>
                            <AccordionContent>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{selectedTool.rationale}</p>
                            </AccordionContent>
                        </AccordionItem>
                        )}
                        {selectedTool.clinicalPerformance && (
                        <AccordionItem value="performance">
                            <AccordionTrigger>Clinical Performance & Reliability</AccordionTrigger>
                            <AccordionContent>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{selectedTool.clinicalPerformance}</p>
                            </AccordionContent>
                        </AccordionItem>
                        )}
                    </Accordion>
                )}
            
                {selectedTool.keywords && selectedTool.keywords.length > 0 && (
                    <div className="mt-3">
                    <span className="text-sm font-semibold text-foreground/90">Keywords: </span>
                    {selectedTool.keywords.map(keyword => (
                        <Badge key={keyword} variant="outline" className="mr-1.5 mb-1.5 text-xs py-1 px-2.5">{keyword}</Badge>
                    ))}
                    </div>
                )}
            
                {selectedTool.references && selectedTool.references.length > 0 && (
                    <>
                    <Separator className="my-4"/>
                    <div className="space-y-1.5">
                        <h4 className="text-md font-semibold text-foreground/90">References:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 pl-1">
                        {selectedTool.references.map((ref, index) => (
                            <li key={index}>
                                {ref.startsWith('http') ? 
                                <a href={ref} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1.5 break-all">
                                    {ref.length > 80 ? ref.substring(0,77) + '...' : ref} <ExternalLink size={14}/>
                                </a> 
                                : <span className="break-all">{ref.length > 100 ? ref.substring(0,97) + '...' : ref}</span>
                                }
                            </li>
                        ))}
                        </ul>
                    </div>
                    </>
                )}
                </div>
            </CardContent>
        </Card>

        <AdBanner />
      </div>
    </PageWrapper>
    
    {/* Add to Patient Dialog */}
    {showPatientDialog && (
      <Dialog open={showPatientDialog} onOpenChange={setShowPatientDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Patient Timeline</DialogTitle>
          <DialogDescription>
            Save this calculation to a patient&apos;s progress timeline
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="patient-id">Patient Identifier</Label>
            <Input
              id="patient-id"
              placeholder="Enter patient ID (will be encrypted)"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use a consistent identifier like MRN or initials + DOB
            </p>
          </div>
          <div>
            <Label htmlFor="notes">Clinical Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any relevant clinical notes..."
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setShowPatientDialog(false);
            setPatientId('');
            setClinicalNotes('');
          }}>
            Cancel
          </Button>
          <Button onClick={() => {
            if (!patientId.trim()) {
              toast({
                title: "Error",
                description: "Please enter a patient identifier",
                variant: "destructive"
              });
              return;
            }
            
            const encryptedId = encryptPatientId(patientId);
            let patientRecord = findPatientRecordByPatientId(encryptedId);
            
            // Create new record if doesn't exist
            if (!patientRecord) {
              patientRecord = createPatientRecord(patientId);
            }
            
            // Add timeline entry
            if (selectedTool && calculationResult && lastInputs) {
              const updatedRecord = addTimelineEntry(
                patientRecord,
                selectedTool,
                calculationResult,
                lastInputs,
                clinicalNotes || undefined
              );
              
              savePatientRecord(updatedRecord);
              
              toast({
                title: "Added to Patient Timeline",
                description: "The calculation has been saved to the patient's progress timeline",
              });
              
              setShowPatientDialog(false);
              setPatientId('');
              setClinicalNotes('');
            }
          }}>
            Add to Timeline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    )}
    </>
  );
}

export default function Page() {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <SkinScorePageContent />
      </Suspense>
    );
  }

    