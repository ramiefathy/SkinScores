"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SettingsGroupProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsGroup({ icon: Icon, title, description, children, className }: SettingsGroupProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <GlassCard hover className={cn("overflow-hidden", className)}>
        <CardHeader className="relative">
          {/* Animated gradient background on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-[hsl(var(--premium-purple))]/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <CardTitle className="flex items-center gap-3 relative z-10">
            {/* Animated icon */}
            <motion.div
              className="relative"
              animate={{
                rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-5 w-5 text-primary" />
              
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/30 blur-md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isHovered ? 0.8 : 0,
                  scale: isHovered ? 1.5 : 0.8
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            
            <span className="font-headline">{title}</span>
          </CardTitle>
          <CardDescription className="relative z-10">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          {children}
        </CardContent>
      </GlassCard>
    </motion.div>
  );
}