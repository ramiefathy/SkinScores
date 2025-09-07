import React from 'react';
import { Info, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TooltipFieldProps {
  children: React.ReactNode;
  tooltip?: string;
  examples?: string[];
  references?: {
    mild?: string;
    moderate?: string; 
    severe?: string;
    [key: string]: string | undefined;
  };
  helpType?: 'info' | 'help';
  className?: string;
}

export function TooltipField({ 
  children, 
  tooltip, 
  examples,
  references,
  helpType = 'help',
  className 
}: TooltipFieldProps) {
  if (!tooltip && !examples && !references) {
    return <>{children}</>;
  }

  const HelpIcon = helpType === 'info' ? Info : HelpCircle;
  
  return (
    <TooltipProvider>
      <div className={cn("relative group", className)}>
        {children}
        <div className="inline-flex items-center ml-1.5">
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent focus:ring-0"
              >
                <HelpIcon className="h-3.5 w-3.5 text-muted-foreground hover:text-primary transition-colors" />
                <span className="sr-only">Help</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              side="right" 
              align="start"
              className="max-w-sm p-4 space-y-2 z-50"
            >
              {tooltip && (
                <p className="text-sm leading-relaxed">{tooltip}</p>
              )}
              
              {examples && examples.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium mb-1">Examples:</p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {examples.map((example, idx) => (
                      <li key={idx} className="pl-3 relative">
                        <span className="absolute left-0">•</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {references && Object.keys(references).length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium mb-1">Reference Guide:</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {Object.entries(references).map(([level, description]) => 
                      description && (
                        <div key={level} className="flex gap-2">
                          <span className="font-medium capitalize min-w-[60px]">
                            {level}:
                          </span>
                          <span className="flex-1">{description}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}