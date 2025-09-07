import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface SeverityLevel {
  label: string;
  color: string;
  bgColor: string;
  icon?: React.ElementType;
  min: number;
  max: number;
}

interface SeverityIndicatorProps {
  score: number;
  maxScore: number;
  minScore?: number;
  levels?: SeverityLevel[];
  showProgress?: boolean;
  showNumeric?: boolean;
  showInterpretation?: boolean;
  interpretation?: string;
  className?: string;
}

// Default severity levels for common scales
const defaultLevels: SeverityLevel[] = [
  { label: 'None/Minimal', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2, min: 0, max: 20 },
  { label: 'Mild', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Info, min: 20, max: 40 },
  { label: 'Moderate', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertTriangle, min: 40, max: 60 },
  { label: 'Severe', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle, min: 60, max: 80 },
  { label: 'Very Severe', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: XCircle, min: 80, max: 100 },
];

export function SeverityIndicator({
  score,
  maxScore,
  minScore = 0,
  levels = defaultLevels,
  showProgress = true,
  showNumeric = true,
  showInterpretation = true,
  interpretation,
  className
}: SeverityIndicatorProps) {
  // Normalize score to 0-100 scale for consistent display
  const normalizedScore = ((score - minScore) / (maxScore - minScore)) * 100;
  
  // Find the appropriate severity level
  const currentLevel = levels.find(level => 
    normalizedScore >= level.min && normalizedScore < level.max
  ) || levels[levels.length - 1];
  
  const Icon = currentLevel.icon;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Score and Badge Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showNumeric && (
            <div className="text-center">
              <div className="text-3xl font-bold">{score}</div>
              <div className="text-xs text-muted-foreground">
                of {maxScore} max
              </div>
            </div>
          )}
          
          {/* Severity Badge */}
          <Badge 
            variant="outline" 
            className={cn(
              "px-3 py-1.5 font-medium border-2",
              currentLevel.color,
              currentLevel.bgColor,
              "border-current"
            )}
          >
            {Icon && <Icon className="mr-1.5 h-4 w-4" />}
            {currentLevel.label}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="space-y-2">
          <div className="relative">
            <Progress 
              value={normalizedScore} 
              className="h-3"
              indicatorClassName={cn(
                normalizedScore < 20 && "bg-green-500",
                normalizedScore >= 20 && normalizedScore < 40 && "bg-yellow-500",
                normalizedScore >= 40 && normalizedScore < 60 && "bg-orange-500",
                normalizedScore >= 60 && normalizedScore < 80 && "bg-red-500",
                normalizedScore >= 80 && "bg-purple-500"
              )}
            />
            {/* Level markers */}
            <div className="absolute inset-0 flex justify-between pointer-events-none">
              {levels.map((level, idx) => (
                <div
                  key={idx}
                  className="h-full border-l border-muted-foreground/20"
                  style={{ left: `${level.min}%` }}
                />
              ))}
            </div>
          </div>
          
          {/* Level labels */}
          <div className="relative h-4">
            {levels.map((level, idx) => (
              <div
                key={idx}
                className="absolute text-[10px] text-muted-foreground -translate-x-1/2"
                style={{ left: `${(level.min + level.max) / 2}%` }}
              >
                {level.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clinical Interpretation */}
      {showInterpretation && interpretation && (
        <div className="rounded-lg bg-muted/50 p-3 border">
          <h4 className="text-sm font-medium mb-1 flex items-center gap-1.5">
            <Info className="h-4 w-4" />
            Clinical Interpretation
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {interpretation}
          </p>
        </div>
      )}

      {/* Contextual Recommendations */}
      <div className={cn(
        "rounded-lg p-3 border-2",
        currentLevel.bgColor,
        "border-current",
        currentLevel.color
      )}>
        <h4 className="text-sm font-medium mb-1">Recommended Action</h4>
        <p className="text-sm opacity-90">
          {normalizedScore < 20 && "Continue current management. Monitor for any changes."}
          {normalizedScore >= 20 && normalizedScore < 40 && "Consider discussing symptom management with your healthcare provider."}
          {normalizedScore >= 40 && normalizedScore < 60 && "Schedule an appointment with your healthcare provider to review treatment options."}
          {normalizedScore >= 60 && normalizedScore < 80 && "Prompt medical evaluation recommended. Your symptoms indicate significant impact."}
          {normalizedScore >= 80 && "Urgent medical attention advised. Please contact your healthcare provider immediately."}
        </p>
      </div>
    </div>
  );
}