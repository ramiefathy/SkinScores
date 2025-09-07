"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface FloatingDateMarkerProps {
  date: string;
  isVisible: boolean;
  className?: string;
}

export function FloatingDateMarker({ date, isVisible, className }: FloatingDateMarkerProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "sticky top-20 z-20 mb-4",
            className
          )}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-primary/40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
            <motion.div
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-[hsl(var(--premium-purple))]/10 backdrop-blur-sm rounded-full border border-primary/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{date}</span>
            </motion.div>
            <motion.div
              className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/20 to-primary/40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}