"use client";

import React, { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { PremiumButton } from '@/components/ui/button-premium';
import { Input } from '@/components/ui/input';
import { TemplateCard, TemplateGallery } from '@/components/ui/template-card';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Search, Filter, Sparkles, Grid3x3, List } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getTemplates, deleteTemplate } from '@/lib/templates';
import { useToast } from '@/hooks/use-toast';

export default function TemplatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [templates, setTemplates] = useState(getTemplates());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleDeleteTemplate = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the template "${name}"?`)) {
      if (deleteTemplate(id)) {
        toast({
          title: "Template Deleted",
          description: `"${name}" has been removed from your templates.`,
        });
        setTemplates(getTemplates());
      }
    }
  };

  const handleLoadTemplate = (template: any) => {
    router.push(`/?toolId=${template.toolId}&templateId=${template.id}`);
    toast({
      title: "Template Loaded",
      description: `Loading "${template.name}" template...`,
    });
  };

  // Filter templates based on search
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group templates by tool
  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.toolId]) {
      acc[template.toolId] = [];
    }
    acc[template.toolId].push(template);
    return acc;
  }, {} as Record<string, typeof templates>);

  return (
    <PageWrapper>
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/3 right-1/3 w-[600px] h-[600px] bg-gradient-radial from-[hsl(var(--premium-purple))]/10 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <FileText className="h-6 w-6" />
            </motion.div>
            <span className="text-sm font-medium uppercase tracking-wider font-accent">Templates</span>
          </div>
          <h1 className="text-4xl font-bold font-headline">My Calculation Templates</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Save and reuse common calculation parameters for faster workflow
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <div className="p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border bg-muted/50 p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                
                <PremiumButton onClick={() => router.push('/')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </PremiumButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Templates */}
        <AnimatePresence mode="wait">
          {filteredTemplates.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GlassCard>
                <div className="text-center py-16">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [-5, 5, -5]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">
                    {searchQuery ? 'No templates found' : 'No Templates Yet'}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {searchQuery 
                      ? 'Try adjusting your search terms'
                      : 'Save templates from any calculation to quickly reuse common parameters.'
                    }
                  </p>
                  <PremiumButton onClick={() => router.push('/')}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start a Calculation
                  </PremiumButton>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="templates"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {Object.entries(groupedTemplates).map(([toolId, toolTemplates], groupIndex) => (
                <motion.div
                  key={toolId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-semibold capitalize">
                      {toolId.replace(/_/g, ' ')}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                    <span className="text-sm text-muted-foreground">
                      {toolTemplates.length} template{toolTemplates.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <TemplateGallery>
                    {toolTemplates.map((template, index) => (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TemplateCard
                          template={template}
                          onLoad={() => handleLoadTemplate(template)}
                          onDelete={() => handleDeleteTemplate(template.id, template.name)}
                        />
                      </motion.div>
                    ))}
                  </TemplateGallery>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}