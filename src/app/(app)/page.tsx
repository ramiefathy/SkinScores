"use client";

import React, { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toolData } from '@/lib/tools';
import type { Tool, CalculationResult, InputConfig } from '@/lib/types';
import { ToolForm } from '@/components/dermscore/ToolForm';
import { ResultsDisplay } from '@/components/dermscore/ResultsDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Info, CheckSquare, Zap, ScrollText, List, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdBanner } from '@/components/AdBanner';
import { PageWrapper } from '@/components/layout/PageWrapper';

const RECENT_TOOLS_STORAGE_KEY = 'skinscore_recently_used_tools';


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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectedTool = useMemo(() => {
    return toolData.find(tool => tool.id === selectedToolId) || null;
  }, [selectedToolId]);

  const handleToolSelect = useCallback((toolId: string | null) => {
    const currentUrl = new URL(window.location.href);
    if (toolId) {
      setSelectedToolId(toolId);
      setCalculationResult(null);

      // Update recently used tools in localStorage
      if (typeof window !== 'undefined') {
        const storedRecent = localStorage.getItem(RECENT_TOOLS_STORAGE_KEY);
        const recentlyUsedTools = storedRecent ? JSON.parse(storedRecent) : [];
        const updatedRecent = [toolId, ...recentlyUsedTools.filter((id: string) => id !== toolId)].slice(0, 5);
        localStorage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify(updatedRecent));
        // Dispatch a storage event to notify the sidebar
        window.dispatchEvent(new Event('storage'));
      }
      
      currentUrl.searchParams.set('toolId', toolId);
    } else {
      setSelectedToolId(null);
      setCalculationResult(null);
      currentUrl.searchParams.delete('toolId');
    }
    router.replace(currentUrl.toString(), { scroll: false });
    
    // Scroll to top of content area
    document.querySelector('[data-id="page-wrapper-content"]')?.scrollTo(0, 0);

  }, [router]);
  
  useEffect(() => {
    if (isClient) {
      const toolIdFromQuery = searchParams.get('toolId');
      if (toolIdFromQuery && toolIdFromQuery !== selectedToolId) {
        const toolExists = toolData.some(tool => tool.id === toolIdFromQuery);
        if (toolExists) {
            handleToolSelect(toolIdFromQuery);
        } else {
           const newUrl = new URL(window.location.href);
           newUrl.searchParams.delete('toolId');
           router.replace(newUrl.toString(), { scroll: false });
        }
      } else if (!toolIdFromQuery && selectedToolId) {
        // This case handles when the user navigates from a tool page back to the home page (e.g. by clicking the "Home" button in the sidebar)
        // We deselect the tool.
        handleToolSelect(null);
      }
    }
  }, [isClient, searchParams, selectedToolId, handleToolSelect, router]);

  const handleCalculate = (inputs: Record<string, any>) => {
    if (selectedTool && selectedTool.calculationLogic && selectedTool.displayType !== 'staticList') {
      const result = selectedTool.calculationLogic(inputs);
      setCalculationResult(result);
      if (isClient) {
        const resultsElement = document.getElementById('results-section');
        resultsElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const popularTools: Tool[] = useMemo(() => {
    const popularIds = ['pasi', 'dlqi', 'abcde_melanoma', 'easi', 'scorad'];
    return toolData.filter(tool => popularIds.includes(tool.id));
  }, []);

  const badgeProps = selectedTool ? getSourceTypeBadgeProps(selectedTool.sourceType) : {};

  return (
    <PageWrapper
        title={selectedTool ? selectedTool.name : "SkinScores Home"}
        description={selectedTool ? selectedTool.condition : "Select a clinical scoring tool from the sidebar to begin."}
    >
      <div className="space-y-8">
        {!selectedTool && (
          <Card className="shadow-xl border">
            <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2"><Info className="text-primary h-7 w-7"/>Welcome to SkinScores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-base leading-relaxed">
                Use the sidebar to navigate through categories and select a clinical scoring tool. All calculations are performed locally in your browser, ensuring data privacy.
              </p>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground/90">Popular Tools</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {popularTools.map(tool => {
                    const ToolIcon = tool.icon || Zap;
                    return (
                      <Button
                        key={tool.id}
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-4 text-left"
                        onClick={() => handleToolSelect(tool.id)}
                      >
                        <ToolIcon className="h-5 w-5 mr-3 shrink-0 text-primary/80" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-foreground whitespace-normal break-words">{tool.name}</div>
                          <div className="text-xs text-muted-foreground whitespace-normal break-words">{tool.condition}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTool && selectedTool.displayType !== 'staticList' && (
          <Card className="shadow-xl border">
            <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2"><CheckSquare className="text-primary h-7 w-7"/>Scoring Inputs</CardTitle>
            </CardHeader>
            <ToolForm tool={selectedTool} onCalculate={handleCalculate} />
          </Card>
        )}
        
        {selectedTool && selectedTool.displayType === 'staticList' && (
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
          {calculationResult && selectedTool && selectedTool.displayType !== 'staticList' && (
              <ResultsDisplay result={calculationResult} tool={selectedTool} />
          )}
        </div>
        
        {selectedTool && (
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
        )}

        <AdBanner />
      </div>
    </PageWrapper>
  );
}

export default function SkinScorePage() {
  return (
    <Suspense>
      <SkinScorePageContent />
    </Suspense>
  );
}