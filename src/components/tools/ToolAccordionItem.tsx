'use client';

import React, { useState } from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FileQuestion, ExternalLink, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { loadTool } from '@/lib/tools/lazy-loader';
import type { ToolMetadata } from '@/lib/tools/tool-metadata';
import type { Tool } from '@/lib/types';
import { ToolErrorBoundary } from '@/components/ErrorBoundary';

interface ToolAccordionItemProps {
  toolMetadata: ToolMetadata;
  onUseTool: (toolId: string) => void;
}

export function ToolAccordionItem({ toolMetadata, onUseTool }: ToolAccordionItemProps) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  const handleToggle = () => {
    if (!hasLoaded && !loading) {
      setLoading(true);
      loadTool(toolMetadata.id)
        .then(loadedTool => {
          if (loadedTool) {
            setTool(loadedTool);
            setHasLoaded(true);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  
  const ToolIcon = tool?.icon || FileQuestion;
  
  return (
    <AccordionItem 
      value={toolMetadata.id} 
      className="border bg-card/30 hover:bg-card/60 rounded-md px-3 shadow-sm"
    >
      <AccordionTrigger 
        className="py-3 text-left hover:no-underline"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-3">
          <ToolIcon className="h-5 w-5 text-primary/90 shrink-0"/>
          <span>{toolMetadata.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2 pb-3 space-y-3 text-sm">
        {loading ? (
          <div className="text-muted-foreground">Loading tool details...</div>
        ) : hasLoaded ? (
          <>
            <div>
              <h4 className="font-semibold text-foreground/80 mb-1">Condition:</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">{toolMetadata.condition || 'General'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground/80 mb-1">Purpose:</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">{toolMetadata.description}</p>
            </div>
            {tool && (
              <>
                {tool.rationale && (
                  <div>
                    <h4 className="font-semibold text-foreground/80 mb-1">Rationale:</h4>
                    <p className="text-muted-foreground text-xs italic">{tool.rationale}</p>
                  </div>
                )}
                {tool.clinicalPerformance && (
                  <div>
                    <h4 className="font-semibold text-foreground/80 mb-1">Clinical Performance & Reliability:</h4>
                    <p className="text-muted-foreground text-xs italic">{tool.clinicalPerformance}</p>
                  </div>
                )}
                {tool.references && tool.references.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground/80 mb-1">Key References:</h4>
                    <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1">
                      {tool.references.slice(0, 2).map((ref, index) => (
                        <li key={index}>
                          {ref.startsWith('http') ? (
                            <a 
                              href={ref} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary/90 hover:underline inline-flex items-center gap-1 break-all"
                            >
                              {ref.length > 100 ? ref.substring(0,97) + '...' : ref} 
                              <ExternalLink size={12}/>
                            </a>
                          ) : (
                            <span className="break-all">
                              {ref.length > 100 ? ref.substring(0,97) + '...' : ref}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
            <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onUseTool(toolMetadata.id)} 
                className="mt-2 text-primary hover:text-primary/90 hover:bg-primary/10"
              >
                <Stethoscope className="mr-2 h-4 w-4"/>Use this Tool
              </Button>
            </motion.div>
          </>
        ) : (
          <div className="text-muted-foreground">Click to load tool details...</div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}