
"use client";

import React, { useEffect, Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useSearchParams } from 'next/navigation';
import { useToolContext } from '@/hooks/useToolContext';
import { ToolForm } from '@/components/dermscore/ToolForm';
import { ResultsDisplay } from '@/components/dermscore/ResultsDisplay';
import { HomePage } from '@/components/layout/HomePage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, CheckSquare, List, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdBanner } from '@/components/AdBanner';
import { PageWrapper } from '@/components/layout/PageWrapper';
import type { Tool, InputConfig } from '@/lib/types';
import { toolData } from '@/lib/tools';


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
  } = useToolContext();
  const searchParams = useSearchParams();

  useEffect(() => {
    const toolIdFromQuery = searchParams.get('toolId');
    if (toolIdFromQuery) {
      if (toolIdFromQuery !== selectedTool?.id) {
          const tool = toolData.find(t => t.id === toolIdFromQuery);
          setSelectedTool(tool || null);
      }
    } else {
      if (selectedTool) {
          setSelectedTool(null);
      }
    }
  }, [searchParams, selectedTool, setSelectedTool]);


  const handleCalculate = (inputs: Record<string, any>) => {
    if (selectedTool && selectedTool.calculationLogic && selectedTool.displayType !== 'staticList') {
      const result = selectedTool.calculationLogic(inputs);
      setCalculationResult(result);
      const resultsElement = document.getElementById('results-section');
      resultsElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  if (!selectedTool) {
    return <HomePage />;
  }

  const badgeProps = selectedTool ? getSourceTypeBadgeProps(selectedTool.sourceType) : {};

  return (
    <PageWrapper>
        <div className="space-y-8">
        {selectedTool.displayType !== 'staticList' && (
          <Card className="shadow-xl border">
            <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2"><CheckSquare className="text-primary h-7 w-7"/>Scoring Inputs</CardTitle>
            </CardHeader>
            <ToolForm tool={selectedTool} onCalculate={handleCalculate} />
          </Card>
        )}
        
        {selectedTool.displayType === 'staticList' && (
           <Card className="shadow-xl border">
            <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2"><List className="text-primary h-7 w-7"/>Classification Levels</CardTitle>
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
              <ResultsDisplay result={calculationResult} tool={selectedTool} />
          )}
        </div>
        
        <Card className="shadow-xl border mt-8">
            <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2"><Info className="text-primary h-7 w-7"/>Details & References</CardTitle>
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
  );
}

export default function Page() {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <SkinScorePageContent />
      </Suspense>
    );
  }
