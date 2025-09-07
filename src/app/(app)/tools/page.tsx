
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toolMetadata, getGroupedToolMetadata, type ToolMetadata } from '@/lib/tools/tool-metadata';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PremiumCard } from '@/components/ui/card-premium';
import { Button } from '@/components/ui/button';
import { Accordion } from "@/components/ui/accordion";
import { PremiumInput } from '@/components/ui/input-premium';
import { FileQuestion, ExternalLink, Stethoscope, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdBanner } from '@/components/AdBanner';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ToolAccordionItem } from '@/components/tools/ToolAccordionItem';

export default function AllToolsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleUseTool = (toolId: string) => {
    router.push(`/?toolId=${toolId}`);
  };

  const filteredTools = useMemo(() => {
    if (!searchTerm.trim()) {
      return toolMetadata;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return toolMetadata.filter(tool =>
      tool.name.toLowerCase().includes(lowerSearchTerm) ||
      tool.id.toLowerCase().includes(lowerSearchTerm) ||
      (tool.condition && tool.condition.toLowerCase().includes(lowerSearchTerm)) ||
      (tool.description && tool.description.toLowerCase().includes(lowerSearchTerm))
    );
  }, [searchTerm]);

  const groupedToolsForList = useMemo(() => {
    if (searchTerm.trim()) {
      return filteredTools.reduce((acc, tool) => {
        const condition = tool.condition || 'Other';
        if (!acc[condition]) {
          acc[condition] = [];
        }
        acc[condition].push(tool);
        return acc;
      }, {} as Record<string, ToolMetadata[]>);
    }
    return getGroupedToolMetadata();
  }, [filteredTools, searchTerm]);

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
                    {filteredTools.sort((a,b) => a.name.localeCompare(b.name)).map(tool => (
                      <ToolAccordionItem 
                        key={tool.id} 
                        toolMetadata={tool} 
                        onUseTool={handleUseTool}
                      />
                    ))}
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
                  {conditionTools.sort((a,b) => a.name.localeCompare(b.name)).map(tool => (
                    <ToolAccordionItem 
                      key={tool.id} 
                      toolMetadata={tool} 
                      onUseTool={handleUseTool}
                    />
                  ))}
                </Accordion>
              </div>
            ))}
          </CardContent>
        </PremiumCard>
        <AdBanner />
    </PageWrapper>
  );
}
