"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PremiumInputProps extends InputProps {
  icon?: React.ReactNode;
}

const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ className, icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      if (props.onChange) {
        props.onChange(e);
      }
    };
    
    return (
      <div className="relative">
        {/* Focus glow effect */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-md opacity-0 pointer-events-none",
            "bg-gradient-to-r from-primary/20 via-[hsl(var(--premium-purple))]/20 to-primary/20"
          )}
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Icon with animation */}
        {icon && (
          <motion.div
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
            animate={{
              x: isFocused ? -2 : 0,
              color: isFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </motion.div>
        )}
        
        <Input
          ref={ref}
          className={cn(
            "relative transition-all duration-200",
            isFocused && "shadow-md border-primary",
            hasValue && "border-primary/50",
            icon && "pl-10",
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          {...props}
        />
        
        {/* Underline animation */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-[hsl(var(--premium-purple))]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ originX: 0.5 }}
        />
      </div>
    );
  }
);

PremiumInput.displayName = "PremiumInput";

export { PremiumInput };