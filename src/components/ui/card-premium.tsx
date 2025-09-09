"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
  hover?: boolean;
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, gradient = false, hover = true, children, onDrag, onDragEnd, onDragStart, onAnimationStart, onAnimationEnd, onAnimationIteration, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden",
          hover && "cursor-pointer",
          className
        )}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
        {...props}
      >
        {/* Gradient background overlay */}
        {gradient && (
          <motion.div
            className="absolute inset-0 opacity-0 bg-gradient-to-br from-primary/10 via-transparent to-[hsl(var(--premium-purple))]/10"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Glow effect on hover */}
        {hover && (
          <motion.div
            className="absolute inset-0 opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(circle at 50% 50%, hsl(var(--premium-purple) / 0.1) 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>

        {/* Border gradient on hover */}
        {hover && (
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0"
            animate={{ opacity: isHovered ? 0.6 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--premium-purple)))`,
              padding: "1px",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        )}
      </motion.div>
    );
  }
);

PremiumCard.displayName = "PremiumCard";

export { PremiumCard };