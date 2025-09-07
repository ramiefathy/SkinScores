"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VisualAnalogScaleProps {
  id: string;
  label: string;
  leftAnchor?: string;
  rightAnchor?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  showDescriptiveAnchors?: boolean;
  showNumericValue?: boolean;
  colorGradient?: boolean;
  historicalValue?: number;
  className?: string;
}

const defaultDescriptiveAnchors = {
  0: { label: "None", color: "text-green-600" },
  25: { label: "Mild", color: "text-yellow-600" },
  50: { label: "Moderate", color: "text-orange-600" },
  75: { label: "Severe", color: "text-red-600" },
  100: { label: "Extreme", color: "text-red-800" }
};

export function VisualAnalogScale({
  id,
  label,
  leftAnchor = "Not at all",
  rightAnchor = "Extremely",
  value,
  onChange,
  min = 0,
  max = 100,
  showDescriptiveAnchors = true,
  showNumericValue = true,
  colorGradient = true,
  historicalValue,
  className
}: VisualAnalogScaleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const normalizedValue = ((value - min) / (max - min)) * 100;
  const displayValue = hoveredValue !== null ? hoveredValue : value;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateValue(e);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && sliderRef.current) {
      updateValue(e);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const updateValue = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    const newValue = Math.round(min + (percentage / 100) * (max - min));
    
    onChange(newValue);
    setHoveredValue(newValue);
  }, [min, max, onChange]);

  const getDescriptiveAnchor = useCallback((val: number) => {
    const normalized = ((val - min) / (max - min)) * 100;
    const anchors = Object.entries(defaultDescriptiveAnchors);
    
    // Find the closest anchor
    let closest = anchors[0];
    let minDiff = Math.abs(normalized - Number(closest[0]));
    
    for (const anchor of anchors) {
      const diff = Math.abs(normalized - Number(anchor[0]));
      if (diff < minDiff) {
        minDiff = diff;
        closest = anchor;
      }
    }
    
    return closest[1];
  }, [min, max]);

  const currentAnchor = getDescriptiveAnchor(displayValue);

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
    <div className={cn("space-y-3", className)}>
      {/* Label and Value Display */}
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {showNumericValue && (
          <motion.div
            animate={{ scale: isDragging ? 1.1 : 1 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-bold tabular-nums">
              {displayValue}
            </span>
            <span className="text-sm text-muted-foreground">/ {max}</span>
          </motion.div>
        )}
      </div>

      {/* Descriptive Anchor */}
      {showDescriptiveAnchors && (
        <motion.div
          animate={{ opacity: 1 }}
          className={cn(
            "text-center text-lg font-semibold transition-colors",
            currentAnchor.color
          )}
        >
          {currentAnchor.label}
        </motion.div>
      )}

      {/* Scale Container */}
      <div className="relative">
        {/* Historical Value Indicator */}
        {historicalValue !== undefined && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-8 bg-muted-foreground/50"
            style={{ left: `${((historicalValue - min) / (max - min)) * 100}%` }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
              Previous: {historicalValue}
            </div>
          </motion.div>
        )}

        {/* Scale Track */}
        <div
          ref={sliderRef}
          className="relative h-12 bg-muted rounded-lg cursor-pointer overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseEnter={() => setIsDragging(false)}
          onMouseLeave={() => !isDragging && setHoveredValue(null)}
        >
          {/* Color Gradient Background */}
          {colorGradient && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `linear-gradient(to right, 
                  hsl(142, 71%, 45%) 0%, 
                  hsl(61, 70%, 52%) 25%, 
                  hsl(39, 100%, 50%) 50%, 
                  hsl(24, 100%, 50%) 75%, 
                  hsl(0, 84%, 60%) 100%)`
              }}
            />
          )}

          {/* Filled Track */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary/50"
            animate={{ width: `${normalizedValue}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {/* Scale Markers */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            {[0, 25, 50, 75, 100].map((mark) => (
              <div
                key={mark}
                className="w-0.5 h-3 bg-border"
                style={{ opacity: 0.5 }}
              />
            ))}
          </div>

          {/* Draggable Thumb */}
          <motion.div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-background border-2 border-primary rounded-full shadow-lg",
              isDragging && "scale-110"
            )}
            style={{ left: `${normalizedValue}%` }}
            animate={{
              scale: isDragging ? 1.2 : 1,
              x: '-50%'
            }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="absolute inset-1 bg-primary rounded-full"
              animate={{ scale: isDragging ? [1, 0.8, 1] : 1 }}
              transition={{ repeat: isDragging ? Infinity : 0, duration: 0.5 }}
            />
          </motion.div>
        </div>

        {/* Anchor Labels */}
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>{leftAnchor}</span>
          <span>{rightAnchor}</span>
        </div>
      </div>

      {/* Touch-friendly Buttons (Mobile) */}
      <div className="flex md:hidden gap-2 mt-4">
        {[0, 25, 50, 75, 100].map((val) => {
          const scaledVal = min + (val / 100) * (max - min);
          const anchor = getDescriptiveAnchor(scaledVal);
          return (
            <motion.button
              key={val}
              onClick={() => onChange(scaledVal)}
              className={cn(
                "flex-1 p-3 rounded-lg border text-center transition-all",
                value === scaledVal
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted hover:bg-muted/70"
              )}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-lg font-bold">{scaledVal}</div>
              <div className={cn("text-xs", anchor.color)}>
                {anchor.label}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}