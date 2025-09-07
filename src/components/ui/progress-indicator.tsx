"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: number;
  className?: string;
}

export function ProgressIndicator({ steps, currentStep, className }: ProgressIndicatorProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex flex-col items-center"
              >
                {/* Step indicator */}
                <motion.div
                  animate={{
                    scale: isActive ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isActive ? Infinity : 0,
                  }}
                  className={cn(
                    "relative h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted && "bg-primary text-primary-foreground",
                    isActive && "bg-primary/20 border-2 border-primary",
                    !isCompleted && !isActive && "bg-muted border-2 border-muted-foreground/20"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted && (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                      >
                        <Check className="h-6 w-6" />
                      </motion.div>
                    )}
                    {isActive && (
                      <motion.div
                        key="loader"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="h-6 w-6 text-primary" />
                      </motion.div>
                    )}
                    {!isCompleted && !isActive && (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Step label */}
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className={cn(
                    "absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors",
                    isActive && "text-primary",
                    isCompleted && "text-primary",
                    !isCompleted && !isActive && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </motion.span>
              </motion.div>

              {/* Connecting line */}
              {!isLast && (
                <div className="relative flex-1 h-[2px] mx-3">
                  <div className="absolute inset-0 bg-muted" />
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: isCompleted ? "100%" : "0%"
                    }}
                    transition={{ 
                      duration: 0.5,
                      delay: isCompleted ? index * 0.1 : 0
                    }}
                    className="absolute inset-0 bg-primary"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// Circular progress for calculation
export function CircularProgress({ 
  value, 
  size = 120, 
  strokeWidth = 8,
  className 
}: { 
  value: number; 
  size?: number; 
  strokeWidth?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--premium-purple))" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-2xl font-bold">{value}%</div>
          <div className="text-xs text-muted-foreground">Complete</div>
        </motion.div>
      </div>
    </div>
  );
}

// Form completion indicator
export function FormCompletionBar({ 
  filledFields, 
  totalFields,
  className 
}: { 
  filledFields: number; 
  totalFields: number;
  className?: string;
}) {
  const percentage = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
  
  return (
    <motion.div 
      className={cn("w-full", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Form Progress</span>
        <span className="text-sm font-medium">
          {filledFields} / {totalFields} fields
        </span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-[hsl(var(--premium-purple))]"
          initial={{ width: "0%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        {percentage === 100 && (
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
            }}
          />
        )}
      </div>
    </motion.div>
  );
}