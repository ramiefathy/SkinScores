"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SplitScreenLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  initialSplit?: number; // percentage for left panel (0-100)
  minSize?: number; // minimum percentage for panels
  className?: string;
}

export function SplitScreenLayout({
  leftPanel,
  rightPanel,
  leftTitle,
  rightTitle,
  initialSplit = 50,
  minSize = 20,
  className
}: SplitScreenLayoutProps) {
  const [split, setSplit] = useState(initialSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    // Apply constraints
    const newSplit = Math.min(Math.max(percentage, minSize), 100 - minSize);
    setSplit(newSplit);
  }, [isDragging, minSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-full w-full overflow-hidden rounded-lg border bg-background",
        isDragging && "select-none",
        className
      )}
    >
      {/* Left Panel */}
      <motion.div
        style={{ width: `${split}%` }}
        className="relative flex flex-col overflow-hidden"
        animate={{ width: `${split}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {leftTitle && (
          <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/50">
            <h3 className="text-sm font-semibold">{leftTitle}</h3>
            <span className="text-xs text-muted-foreground">{Math.round(split)}%</span>
          </div>
        )}
        <div className="flex-1 overflow-auto p-4">
          {leftPanel}
        </div>
      </motion.div>

      {/* Divider */}
      <div
        className={cn(
          "relative z-20 flex w-1 cursor-col-resize items-center justify-center bg-border",
          "hover:bg-primary/20 transition-colors",
          isDragging && "bg-primary/30"
        )}
        onMouseDown={handleMouseDown}
      >
        <motion.div
          animate={{
            scale: isDragging ? 1.2 : 1,
            opacity: isDragging ? 1 : 0.7
          }}
          whileHover={{ opacity: 1 }}
          className="absolute flex h-12 w-6 items-center justify-center rounded bg-background border shadow-sm"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </div>

      {/* Right Panel */}
      <motion.div
        style={{ width: `${100 - split}%` }}
        className="relative flex flex-col overflow-hidden"
        animate={{ width: `${100 - split}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {rightTitle && (
          <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/50">
            <h3 className="text-sm font-semibold">{rightTitle}</h3>
            <span className="text-xs text-muted-foreground">{Math.round(100 - split)}%</span>
          </div>
        )}
        <div className="flex-1 overflow-auto p-4">
          {rightPanel}
        </div>
      </motion.div>
    </div>
  );
}

// Comparison indicator component
export function ComparisonIndicator({
  value1,
  value2,
  label,
  format = (v) => String(v),
}: {
  value1: any;
  value2: any;
  label: string;
  format?: (value: any) => string;
}) {
  const isDifferent = value1 !== value2;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg transition-colors",
        isDifferent ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" : "bg-muted/50"
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <span className={cn("text-sm", !isDifferent && "text-muted-foreground")}>
          {format(value1)}
        </span>
        {isDifferent && (
          <>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
            >
              ≠
            </motion.span>
            <span className="text-sm">
              {format(value2)}
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}