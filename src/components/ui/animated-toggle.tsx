"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedToggleProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function AnimatedToggle({ id, checked, onCheckedChange, className }: AnimatedToggleProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full blur-md",
          checked ? "bg-primary/30" : "bg-muted-foreground/20"
        )}
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.2 : 1
        }}
        transition={{ duration: 0.2 }}
      />
      
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn("relative z-10", className)}
      />
      
      {/* Icon overlay */}
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Check className="w-3 h-3 text-primary-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}