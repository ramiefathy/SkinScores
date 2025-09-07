"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg";
  hover?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, blur = "md", hover = false, ...props }, ref) => {
    const blurClass = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
    }[blur];

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-lg border border-white/20",
          "bg-gradient-to-br from-white/10 to-white/5",
          blurClass,
          "shadow-lg",
          hover && "transition-all hover:shadow-xl hover:border-white/30 hover:bg-white/15",
          className
        )}
        whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
        {...props}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 via-transparent to-[hsl(var(--premium-purple))]/5 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">{children}</div>
        
        {/* Light reflection effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };