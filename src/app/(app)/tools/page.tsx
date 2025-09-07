
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toolData } from '@/lib/tools';
import type { Tool } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PremiumCard } from '@/components/ui/card-premium';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PremiumInput } from '@/components/ui/input-premium';
import { FileQuestion, ExternalLink, Stethoscope, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdBanner } from '@/components/AdBanner';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function AllToolsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleUseTool = (toolId: string) => {
    router.push(`/?toolId=${toolId}`);
  };

  const filteredTools = useMemo(() => {
    if (!searchTerm.trim()) {
      return toolData;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return toolData.filter(tool =>
      tool.name.toLowerCase().includes(lowerSearchTerm) ||
      (tool.acronym && tool.acronym.toLowerCase().includes(lowerSearchTerm)) ||
      tool.condition.toLowerCase().includes(lowerSearchTerm) ||
      (tool.keywords && tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchTerm)))
    );
  }, [searchTerm]);

  const groupedToolsForList = useMemo(() => {
    return filteredTools.reduce((acc, tool) => {
      const condition = tool.condition || 'Other';
      if (!acc[condition]) {
        acc[condition] = [];
      }
      acc[condition].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);
  }, [filteredTools]);

  const sortedCategoriesForList = useMemo(() => {
    return Object.entries(groupedToolsForList).sort((a, b) => a[0].localeCompare(b[0]));
  }, [groupedToolsForList]);

  return (
    <PageWrapper>
      {/* Medical cross grid pattern background */}
      <div className="fixed inset-0 -z-10 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="medical-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M15 0v15H0v10h15v15h10V25h15V15H25V0H15z" fill="currentColor" className="text-primary"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#medical-grid)" />
        </svg>
      </div>
        <PremiumCard gradient hover className="shadow-xl border">
          <CardHeader className="relative overflow-hidden">
            <motion.div
              className="absolute top-0 right-0 text-primary/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-32 h-32" />
            </motion.div>
            <CardDescription className="text-lg">
              Use the search bar to filter by name, condition, or keyword. Click on any tool to learn more or select &quot;Use this Tool&quot; to go directly to its calculator page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PremiumInput
              type="search"
              placeholder="Search tools by name, condition, or keyword..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5" />}
            />

            {searchTerm.trim() && filteredTools.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No tools found matching your search criteria.</p>
            )}

            {searchTerm.trim() && filteredTools.length > 0 && (
                 <Accordion type="multiple" className="w-full space-y-2">
                    {filteredTools.sort((a,b) => a.name.localeCompare(b.name)).map(tool => {
                        const ToolIcon = tool.icon || FileQuestion;
                        return (
                            <AccordionItem value={tool.id} key={tool.id} className="border bg-card/30 hover:bg-card/60 rounded-md px-3 shadow-sm">
                                <AccordionTrigger className="py-3 text-left hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <ToolIcon className="h-5 w-5 text-primary/90 shrink-0"/>
                                        <span>{tool.name} {tool.acronym && `(${tool.acronym})`}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-3 space-y-3 text-sm">
                                    <div><h4 className="font-semibold text-foreground/80 mb-1">Condition:</h4><p className="text-muted-foreground text-xs leading-relaxed">{tool.condition}</p></div>
                                    <div><h4 className="font-semibold text-foreground/80 mb-1">Purpose:</h4><p className="text-muted-foreground text-xs leading-relaxed">{tool.description}</p></div>
                                    {tool.rationale && <div><h4 className="font-semibold text-foreground/80 mb-1">Rationale:</h4><p className="text-muted-foreground text-xs italic">{tool.rationale}</p></div>}
                                    {tool.clinicalPerformance && <div><h4 className="font-semibold text-foreground/80 mb-1">Clinical Performance & Reliability:</h4><p className="text-muted-foreground text-xs italic">{tool.clinicalPerformance}</p></div>}
                                    {tool.references && tool.references.length > 0 && (
                                      <div>
                                        <h4 className="font-semibold text-foreground/80 mb-1">Key References:</h4>
                                        <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1">
                                          {tool.references.slice(0, 2).map((ref, index) => (
                                            <li key={index}>
                                              {ref.startsWith('http') ?
                                                <a href={ref} target="_blank" rel="noopener noreferrer" className="text-primary/90 hover:underline inline-flex items-center gap-1 break-all">
                                                  {ref.length > 100 ? ref.substring(0,97) + '...' : ref} <ExternalLink size={12}/>
                                                </a>
                                                : <span className="break-all">{ref.length > 100 ? ref.substring(0,97) + '...' : ref}</span>
                                              }
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.95 }}>
                                      <Button variant="ghost" size="sm" onClick={() => handleUseTool(tool.id)} className="mt-2 text-primary hover:text-primary/90 hover:bg-primary/10">
                                          <Stethoscope className="mr-2 h-4 w-4"/>Use this Tool
                                      </Button>
                                    </motion.div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            )}

            {!searchTerm.trim() && sortedCategoriesForList.map(([condition, conditionTools]) => (
              <div key={condition} className="pt-2">
                <motion.h3 
                  className="text-2xl font-semibold mb-3 text-foreground/90 pb-2 relative font-headline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {condition}
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-[hsl(var(--premium-purple))]"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                </motion.h3>
                <Accordion type="multiple" className="w-full space-y-2">
                  {conditionTools.sort((a,b) => a.name.localeCompare(b.name)).map(tool => {
                      const ToolIcon = tool.icon || FileQuestion;
                      return (
                          <AccordionItem value={tool.id} key={tool.id} className="border bg-card/30 hover:bg-card/60 rounded-md px-3 shadow-sm">
                              <AccordionTrigger className="py-3 text-left hover:no-underline">
                                  <div className="flex items-center gap-3">
                                      <ToolIcon className="h-5 w-5 text-primary/90 shrink-0"/>
                                      <span>{tool.name} {tool.acronym && `(${tool.acronym})`}</span>
                                  </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-2 pb-3 space-y-3 text-sm">
                                  <div><h4 className="font-semibold text-foreground/80 mb-1">Condition:</h4><p className="text-muted-foreground text-xs leading-relaxed">{tool.condition}</p></div>
                                  <div><h4 className="font-semibold text-foreground/80 mb-1">Purpose:</h4><p className="text-muted-foreground text-xs leading-relaxed">{tool.description}</p></div>
                                   {tool.rationale && <div><h4 className="font-semibold text-foreground/80 mb-1">Rationale:</h4><p className="text-muted-foreground text-xs italic">{tool.rationale}</p></div>}
                                   {tool.clinicalPerformance && <div><h4 className="font-semibold text-foreground/80 mb-1">Clinical Performance & Reliability:</h4><p className="text-muted-foreground text-xs italic">{tool.clinicalPerformance}</p></div>}
                                  {tool.references && tool.references.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold text-foreground/80 mb-1">Key References:</h4>
                                      <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1">
                                        {tool.references.slice(0, 2).map((ref, index) => (
                                          <li key={index}>
                                            {ref.startsWith('http') ?
                                              <a href={ref} target="_blank" rel="noopener noreferrer" className="text-primary/90 hover:underline inline-flex items-center gap-1 break-all">
                                                {ref.length > 100 ? ref.substring(0,97) + '...' : ref} <ExternalLink size={12}/>
                                              </a>
                                              : <span className="break-all">{ref.length > 100 ? ref.substring(0,97) + '...' : ref}</span>
                                            }
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="ghost" size="sm" onClick={() => handleUseTool(tool.id)} className="mt-2 text-primary hover:text-primary/90 hover:bg-primary/10">
                                        <Stethoscope className="mr-2 h-4 w-4"/>Use this Tool
                                    </Button>
                                  </motion.div>
                              </AccordionContent>
                          </AccordionItem>
                      )
                  })}
                </Accordion>
              </div>
            ))}
          </CardContent>
        </PremiumCard>
        <AdBanner />
    </PageWrapper>
  );
}
