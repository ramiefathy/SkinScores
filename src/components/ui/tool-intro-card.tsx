import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Clock, Users, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tool } from '@/lib/types';

interface ToolIntroCardProps {
  tool: Tool;
  onStart?: () => void;
  className?: string;
}

export function ToolIntroCard({ tool, onStart, className }: ToolIntroCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  // Determine who should use this tool
  const getUserType = () => {
    const name = tool.name.toLowerCase();
    const description = tool.description.toLowerCase();
    
    if (name.includes('patient') || description.includes('patient-reported') || 
        description.includes('self-administered') || name.includes('dlqi') || 
        name.includes('poem')) {
      return 'Patients';
    } else if (description.includes('clinician') || description.includes('physician')) {
      return 'Healthcare Professionals';
    }
    return 'Patients & Clinicians';
  };

  // Estimate completion time based on number of inputs
  const getEstimatedTime = () => {
    const inputCount = tool.formSections.reduce((total, section) => {
      if ('inputs' in section) {
        return total + section.inputs.length;
      }
      return total + 1;
    }, 0);

    if (inputCount <= 5) return '1-2 minutes';
    if (inputCount <= 15) return '2-5 minutes';
    if (inputCount <= 30) return '5-10 minutes';
    return '10-15 minutes';
  };

  // Get key purpose in simple language
  const getSimplePurpose = () => {
    const condition = tool.condition.toLowerCase();
    const name = tool.name.toLowerCase();
    
    if (name.includes('quality') || name.includes('qol') || name.includes('dlqi')) {
      return 'Measures how your skin condition affects your daily life';
    } else if (name.includes('severity') || name.includes('pasi') || name.includes('scorad')) {
      return 'Assesses how severe your skin condition is';
    } else if (name.includes('activity') || name.includes('aas')) {
      return 'Tracks disease activity and symptoms over time';
    } else if (name.includes('classification') || name.includes('fitzpatrick')) {
      return 'Categorizes your skin type or condition';
    }
    return 'Evaluates and monitors your skin condition';
  };

  return (
    <Card className={cn("border-2 border-primary/20 shadow-lg", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              About This Tool
            </CardTitle>
            <h2 className="text-2xl font-bold">{tool.name}</h2>
            {tool.acronym && (
              <Badge variant="secondary" className="mt-1">{tool.acronym}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Facts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">What it measures</p>
              <p className="text-sm text-muted-foreground">{getSimplePurpose()}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Who should use it</p>
              <p className="text-sm text-muted-foreground">{getUserType()}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Time needed</p>
              <p className="text-sm text-muted-foreground">{getEstimatedTime()}</p>
            </div>
          </div>
        </div>

        {/* Clinical Context */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h3 className="text-sm font-semibold">Clinical Context</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tool.description.split('.')[0]}.
          </p>
          
          {/* Expandable detailed information */}
          {expanded && (
            <div className="pt-3 space-y-3 border-t mt-3">
              {tool.rationale && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Why use this tool?</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.rationale.split('.').slice(0, 2).join('.')}.
                  </p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-semibold mb-1">How it works</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This assessment includes {tool.formSections.length} section{tool.formSections.length > 1 ? 's' : ''} 
                  {' '}covering different aspects of your condition. Your responses are combined using a validated 
                  formula to produce a score that helps track your condition over time.
                </p>
              </div>
              
              {tool.sourceType && (
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm font-medium">Evidence Base:</span>
                  <Badge variant="outline">{tool.sourceType}</Badge>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground"
          >
            {expanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Learn More
              </>
            )}
          </Button>
          
          {onStart && (
            <Button onClick={onStart} size="lg" className="font-semibold">
              Start Assessment
            </Button>
          )}
        </div>

        {/* Important Note */}
        <CardDescription className="text-xs italic pt-2 border-t">
          Note: This tool provides standardized measurements to track your condition. 
          Always consult with your healthcare provider for diagnosis and treatment decisions.
        </CardDescription>
      </CardContent>
    </Card>
  );
}