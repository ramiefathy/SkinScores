"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PremiumButtonProps extends ButtonProps {
  pulse?: boolean;
  bounce?: boolean;
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, children, pulse = false, bounce = false, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    
    return (
      <motion.div
        className="relative inline-block"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: bounce ? 1.05 : 1 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20
        }}
      >
        {/* Gradient glow effect on hover */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-md opacity-0",
            "bg-gradient-to-r from-primary/40 via-[hsl(var(--premium-purple))]/40 to-primary/40"
          )}
          animate={{
            opacity: isHovered ? 0.6 : 0,
            scale: isHovered ? 1.1 : 1,
            filter: isHovered ? "blur(8px)" : "blur(0px)"
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Pulse animation */}
        {pulse && (
          <motion.div
            className="absolute inset-0 rounded-md bg-primary/20"
            animate={{
              scale: [1, 1.2, 1.4],
              opacity: [0.4, 0.2, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}
        
        <Button
          ref={ref}
          className={cn(
            "relative z-10 transition-all duration-300",
            isHovered && "shadow-lg",
            className
          )}
          {...props}
        >
          <motion.span
            className="inline-flex items-center gap-2"
            animate={{
              x: isHovered ? 2 : 0,
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {children}
          </motion.span>
        </Button>
      </motion.div>
    );
  }
);

PremiumButton.displayName = "PremiumButton";

export { PremiumButton };