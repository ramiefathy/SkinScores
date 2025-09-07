"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemePreviewProps {
  theme: 'light' | 'dark' | 'system';
  className?: string;
}

export function ThemePreview({ theme, className }: ThemePreviewProps) {
  const themes = {
    light: {
      bg: 'bg-white',
      text: 'text-slate-900',
      card: 'bg-slate-100',
      icon: Sun,
      gradient: 'from-yellow-200 to-orange-200'
    },
    dark: {
      bg: 'bg-slate-950',
      text: 'text-slate-100',
      card: 'bg-slate-900',
      icon: Moon,
      gradient: 'from-blue-900 to-purple-900'
    },
    system: {
      bg: 'bg-gradient-to-r from-white to-slate-950',
      text: 'text-slate-600',
      card: 'bg-gradient-to-r from-slate-100 to-slate-900',
      icon: Monitor,
      gradient: 'from-slate-300 to-slate-700'
    }
  };

  const config = themes[theme];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-lg border p-4",
        config.bg,
        className
      )}
    >
      {/* Background gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-20",
        config.gradient
      )} />
      
      {/* Icon */}
      <motion.div
        className="relative z-10 mb-3"
        animate={{ rotate: theme === 'system' ? [0, 180, 360] : 0 }}
        transition={{ duration: 2, repeat: theme === 'system' ? Infinity : 0 }}
      >
        <Icon className={cn("h-8 w-8", config.text)} />
      </motion.div>
      
      {/* Preview elements */}
      <div className="relative z-10 space-y-2">
        <div className={cn("h-2 w-20 rounded", config.card)} />
        <div className={cn("h-2 w-16 rounded", config.card)} />
        <div className="flex gap-2 mt-3">
          <div className={cn("h-6 w-6 rounded", config.card)} />
          <div className={cn("h-6 w-6 rounded", config.card)} />
        </div>
      </div>
      
      {/* Label */}
      <motion.p
        className={cn("mt-4 text-sm font-medium capitalize relative z-10", config.text)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {theme}
      </motion.p>
    </motion.div>
  );
}