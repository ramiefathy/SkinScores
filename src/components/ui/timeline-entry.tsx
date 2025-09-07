"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Calculator } from 'lucide-react';

interface TimelineEntryProps {
  date: Date;
  toolName: string;
  score: string | number;
  isFirst?: boolean;
  isLast?: boolean;
  delay?: number;
  children?: React.ReactNode;
  className?: string;
}

export function TimelineEntry({ 
  date, 
  toolName, 
  score, 
  isFirst = false, 
  isLast = false, 
  delay = 0, 
  children,
  className 
}: TimelineEntryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      className={cn("relative", className)}
    >
      {/* Timeline dot */}
      <motion.div
        className="absolute left-6 top-6 w-3 h-3 -ml-1.5 bg-primary rounded-full ring-4 ring-background z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
      />
      
      {/* Date marker */}
      <motion.div
        className="absolute -left-20 top-5 text-sm font-medium text-muted-foreground whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
        whileHover={{ scale: 1.05, color: "hsl(var(--primary))" }}
      >
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {date.toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1 text-xs mt-1">
          <Clock className="w-3 h-3" />
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </motion.div>
      
      {/* Content card */}
      <div className="ml-12">
        <GlassCard 
          hover 
          className={cn(
            "p-4",
            isFirst && "mt-0",
            isLast && "mb-0"
          )}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" />
                {toolName}
              </h3>
              <Badge variant="outline" className="mt-1">
                Score: {score}
              </Badge>
            </div>
          </div>
          {children}
        </GlassCard>
      </div>
    </motion.div>
  );
}