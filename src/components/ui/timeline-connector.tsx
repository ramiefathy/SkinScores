"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimelineConnectorProps {
  isActive?: boolean;
  isLast?: boolean;
  className?: string;
}

export function TimelineConnector({ isActive = false, isLast = false, className }: TimelineConnectorProps) {
  return (
    <div className={cn("absolute left-6 top-12 w-0.5 h-full -ml-px", className)}>
      {/* Base line */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent",
        isLast && "h-12"
      )} />
      
      {/* Animated pulse effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-primary via-primary/50 to-transparent"
          animate={{
            opacity: [0.4, 1, 0.4],
            scaleY: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Pulse dot animation */}
      {isActive && (
        <motion.div
          className="absolute -left-1 top-0 w-2 h-2 bg-primary rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0, 1],
            y: [0, "100%", "200%", "300%", "400%"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
    </div>
  );
}