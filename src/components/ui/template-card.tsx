"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PremiumButton } from '@/components/ui/button-premium';
import { 
  FileText, Download, Eye, Trash2, Calendar, 
  Tag, Sparkles, ArrowRight, Clock 
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description?: string;
    toolId: string;
    values: Record<string, any>;
    tags?: string[];
    createdAt: string;
  };
  onLoad: () => void;
  onDelete: () => void;
  className?: string;
}

export function TemplateCard({ template, onLoad, onDelete, className }: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Delay preview to avoid flashing on quick hovers
    setTimeout(() => {
      setIsHovered(current => {
        if (current) setShowPreview(true);
        return current;
      });
    }, 300);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPreview(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn("relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className={cn(
        "h-full transition-all duration-300",
        isHovered && "shadow-xl border-primary/50"
      )}>
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                {template.name}
              </CardTitle>
              {template.description && (
                <CardDescription className="mt-1 line-clamp-2">
                  {template.description}
                </CardDescription>
              )}
            </div>
            <motion.div
              animate={{ rotate: isHovered ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <motion.div 
              className="flex flex-wrap gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {template.tags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="text-xs gap-1 bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(template.createdAt), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {Object.keys(template.values).length} fields
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <PremiumButton 
              className="flex-1 group"
              onClick={onLoad}
              size="sm"
            >
              <Download className="h-4 w-4 mr-2 transition-transform group-hover:translate-y-0.5" />
              Load Template
              <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </PremiumButton>
          </div>
        </CardContent>
      </Card>

      {/* Hover Preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute z-50 -top-4 left-full ml-4 w-80"
          >
            <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-primary">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">Template Preview</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {Object.entries(template.values).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                    >
                      <span className="text-sm font-medium">
                        {key.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {String(value)}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3" />
                    Click to load all values instantly
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Gallery container with masonry layout
export function TemplateGallery({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}