"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function RotatingBadge() {
  const text = "HIPAA Compliant • Privacy First • Validated Tools • Clinical Grade • ";
  const radius = 45; // Further reduced from 60
  const fontSize = 12; // Keeping current font size
  const letterSpacing = 4; // Slightly reduced from 5

  return (
    <div className="fixed bottom-4 right-4 w-24 h-24 z-50 hidden lg:block"> {/* Reduced from w-32 h-32 */}
      {/* Circular background with gradient */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-[hsl(var(--premium-purple))]/20 backdrop-blur-sm border border-primary/20"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--premium-purple))] flex items-center justify-center shadow-lg"> {/* Reduced from w-12 h-12 */}
          <svg
            className="w-5 h-5 text-white" /* Reduced from w-6 h-6 */
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
      </div>

      {/* Rotating text */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 96 96" /* Reduced from 128 128 */
        style={{ animation: 'rotate 20s linear infinite' }}
      >
        <defs>
          <path
            id="circle"
            d="M 48,48 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" /* Adjusted for smaller size */
          />
        </defs>
        <text fontSize={fontSize} letterSpacing={letterSpacing} className="fill-muted-foreground font-medium">
          <textPath href="#circle">
            {text}
          </textPath>
        </text>
      </svg>

      <style jsx>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}