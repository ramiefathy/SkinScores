"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Save, FileText, Clock, Tag, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getToolTemplates, 
  saveTemplate, 
  deleteTemplate,
  type CalculationTemplate 
} from '@/lib/templates';
import type { Tool } from '@/lib/types';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TemplatesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool;
  inputs?: Record<string, any>;
  onLoadTemplate: (inputs: Record<string, any>) => void;
  mode?: 'load' | 'save';
}

export function TemplatesDialog({ 
  isOpen, 
  onClose, 
  tool, 
  inputs, 
  onLoadTemplate,
  mode = 'load' 
}: TemplatesDialogProps) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<CalculationTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<CalculationTemplate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Save template form
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateTags, setTemplateTags] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen, tool.id]);
  
  const loadTemplates = () => {
    const toolTemplates = getToolTemplates(tool.id);
    setTemplates(toolTemplates);
  };
  
  const filteredTemplates = templates.filter(t =>
    searchQuery === '' ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleSaveTemplate = () => {
    if (!templateName || !inputs) {
      toast({
        title: "Error",
        description: "Please provide a template name.",
        variant: "destructive",
      });
      return;
    }
    
    const tags = templateTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    saveTemplate(
      templateName,
      templateDescription,
      tool.id,
      inputs,
      tags
    );
    
    toast({
      title: "Template Saved",
      description: `"${templateName}" has been saved successfully.`,
    });
    
    // Reset form
    setTemplateName('');
    setTemplateDescription('');
    setTemplateTags('');
    loadTemplates();
  };
  
  const handleLoadTemplate = (template: CalculationTemplate) => {
    onLoadTemplate(template.inputs);
    toast({
      title: "Template Loaded",
      description: `"${template.name}" has been loaded.`,
    });
    onClose();
  };
  
  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId);
    loadTemplates();
    setDeleteConfirm(null);
    toast({
      title: "Template Deleted",
      description: "The template has been removed.",
    });
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {mode === 'save' ? 'Save as Template' : 'Load Template'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'save' 
                ? `Save your current ${tool.name} inputs as a reusable template.`
                : `Load a saved template for ${tool.name}.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue={mode} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="load">
                <FileText className="h-4 w-4 mr-2" />
                Load Template
              </TabsTrigger>
              <TabsTrigger value="save" disabled={!inputs}>
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="load" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <ScrollArea className="h-[300px] border rounded-lg p-4">
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery 
                      ? 'No templates found matching your search.'
                      : 'No saved templates yet. Create your first template!'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTemplates.map(template => (
                      <div
                        key={template.id}
                        className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{template.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(template.updatedAt), 'MMM d, yyyy')}
                              </span>
                              {template.tags && template.tags.length > 0 && (
                                <>
                                  <Tag className="h-3 w-3 text-muted-foreground ml-2" />
                                  {template.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(template.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              
              {selectedTemplate && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleLoadTemplate(selectedTemplate)}
                    className="flex-1"
                  >
                    Load Template
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="save" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g., Baseline Assessment"
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Describe when to use this template..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-tags">Tags (comma-separated)</Label>
                  <Input
                    id="template-tags"
                    value={templateTags}
                    onChange={(e) => setTemplateTags(e.target.value)}
                    placeholder="e.g., baseline, mild, pediatric"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>
                  Save Template
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the template. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirm && handleDeleteTemplate(deleteConfirm)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}