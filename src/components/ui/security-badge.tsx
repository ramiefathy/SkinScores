"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SecurityBadgeProps {
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

const securityFeatures = [
  { icon: Lock, text: 'End-to-End Encrypted', color: 'text-green-600' },
  { icon: Eye, text: 'Zero Server Storage', color: 'text-blue-600' },
  { icon: ShieldCheck, text: 'HIPAA Compliant', color: 'text-purple-600' },
];

export function SecurityBadge({ variant = 'default', className }: SecurityBadgeProps) {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800",
          className
        )}
      >
        <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
        <span className="text-sm font-medium text-green-700 dark:text-green-300">
          Secure & Private
        </span>
      </motion.div>
    );
  }

  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex flex-wrap items-center gap-4 text-sm",
          className
        )}
      >
        {securityFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-1.5"
            >
              <Icon className={cn("h-4 w-4", feature.color)} />
              <span className="text-muted-foreground">{feature.text}</span>
            </motion.div>
          );
        })}
      </motion.div>
    );
  }

  // Default variant - full security card
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-lg border bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-900/10 dark:to-blue-900/10 p-4",
        className
      )}
    >
      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
          </motion.div>
          <h4 className="font-semibold text-sm">Your Data is Protected</h4>
        </div>
        
        <div className="space-y-2">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <Icon className={cn("h-3.5 w-3.5", feature.color)} />
                <span className="text-xs text-muted-foreground">{feature.text}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export function FloatingSecurityBadge({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        "fixed bottom-4 right-4 z-50",
        className
      )}
    >
      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <SecurityBadge variant="compact" className="shadow-lg" />
      </motion.div>
    </motion.div>
  );
}