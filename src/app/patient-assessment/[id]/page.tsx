"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  Clock,
  FileText,
  Home,
  Lock
} from 'lucide-react';
import { ToolForm } from '@/components/dermscore/ToolForm';
import { ResultsDisplay } from '@/components/dermscore/ResultsDisplay';
import { toolData } from '@/lib/tools';
import {
  validateAndUpdatePatientLink,
  getPatientRecord,
  addTimelineEntry,
  savePatientRecord,
  type PatientLink
} from '@/lib/patient-progress';
import type { Tool, CalculationResult } from '@/lib/types';
import { format } from 'date-fns';

interface CompletedAssessment {
  toolId: string;
  toolName: string;
  result: CalculationResult;
  timestamp: string;
}

export default function PatientAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const linkId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState<PatientLink | null>(null);
  const [patientRecord, setPatientRecord] = useState<any>(null);
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);
  const [completedAssessments, setCompletedAssessments] = useState<CompletedAssessment[]>([]);
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validate and load the link
    const loadLink = async () => {
      try {
        const validLink = validateAndUpdatePatientLink(linkId);
        
        if (!validLink) {
          setError('This link has expired or is no longer valid.');
          setLoading(false);
          return;
        }

        setLink(validLink);
        
        // Load patient record
        const record = getPatientRecord(validLink.patientRecordId);
        if (!record) {
          setError('Patient record not found.');
          setLoading(false);
          return;
        }
        
        setPatientRecord(record);
        setLoading(false);
      } catch (err) {
        setError('Failed to load assessment.');
        setLoading(false);
      }
    };

    loadLink();
  }, [linkId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Access Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push('/')} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Main Site
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!link || !patientRecord) return null;

  // Get tools for this assessment
  const assessmentTools = link.toolIds.map(id => toolData.find(t => t.id === id)).filter(Boolean) as Tool[];
  const currentTool = assessmentTools[selectedToolIndex];
  const isLastTool = selectedToolIndex === assessmentTools.length - 1;
  const allCompleted = completedAssessments.length === assessmentTools.length;

  const handleCalculate = (inputs: Record<string, any>) => {
    if (!currentTool) return;
    
    // Calculate result
    const result = currentTool.calculationLogic(inputs);
    setCurrentResult(result);
    
    // Add to completed assessments
    const completed: CompletedAssessment = {
      toolId: currentTool.id,
      toolName: currentTool.name,
      result,
      timestamp: new Date().toISOString()
    };
    
    setCompletedAssessments([...completedAssessments, completed]);
    
    // Save to patient record
    const updatedRecord = addTimelineEntry(
      patientRecord,
      currentTool,
      result,
      inputs,
      'Self-assessment via secure link'
    );
    savePatientRecord(updatedRecord);
    setPatientRecord(updatedRecord);
  };

  const handleNext = () => {
    if (selectedToolIndex < assessmentTools.length - 1) {
      setSelectedToolIndex(selectedToolIndex + 1);
      setCurrentResult(null);
    }
  };

  const handleFinish = () => {
    // Show completion screen
    setSelectedToolIndex(assessmentTools.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Patient Self-Assessment</h1>
              <p className="text-sm text-muted-foreground">
                Complete the following assessments requested by your healthcare provider
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Secure & Private</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2">
            {assessmentTools.map((tool, index) => (
              <React.Fragment key={tool.id}>
                <div
                  className={`flex items-center gap-2 ${
                    index <= selectedToolIndex ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < completedAssessments.length
                        ? 'bg-primary text-primary-foreground'
                        : index === selectedToolIndex
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted'
                    }`}
                  >
                    {index < completedAssessments.length ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-sm hidden sm:inline">{tool.acronym || tool.name}</span>
                </div>
                {index < assessmentTools.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      index < completedAssessments.length ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {allCompleted ? (
          // Completion screen
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
              <CardDescription>
                Thank you for completing your self-assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>What happens next?</AlertTitle>
                <AlertDescription>
                  Your results have been securely saved and will be reviewed by your healthcare provider
                  at your next appointment.
                </AlertDescription>
              </Alert>

              <div>
                <h3 className="font-semibold mb-3">Completed Assessments:</h3>
                <div className="space-y-2">
                  {completedAssessments.map((assessment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{assessment.toolName}</p>
                          <p className="text-sm text-muted-foreground">
                            Score: {assessment.result.score}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {format(new Date(assessment.timestamp), 'h:mm a')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-2">Important Reminders:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• These results do not replace professional medical advice</li>
                  <li>• Contact your healthcare provider if you have concerns</li>
                  <li>• Bring these results to your next appointment</li>
                </ul>
              </div>

              <Button onClick={() => window.close()} className="w-full">
                Close This Page
              </Button>
            </CardContent>
          </Card>
        ) : currentTool ? (
          // Active assessment
          <Tabs value={currentResult ? "results" : "form"} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form" disabled={!!currentResult}>
                Assessment Form
              </TabsTrigger>
              <TabsTrigger value="results" disabled={!currentResult}>
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="form">
              <Card>
                <CardHeader>
                  <CardTitle>{currentTool.name}</CardTitle>
                  <CardDescription>{currentTool.description}</CardDescription>
                </CardHeader>
                <ToolForm tool={currentTool} onCalculate={handleCalculate} />
              </Card>
            </TabsContent>

            <TabsContent value="results">
              {currentResult && (
                <div className="space-y-4">
                  <ResultsDisplay 
                    result={currentResult} 
                    tool={currentTool} 
                    preferences={{ showSeverityIndicators: true }}
                  />
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentResult(null)}>
                      Retake Assessment
                    </Button>
                    {isLastTool ? (
                      <Button onClick={handleFinish}>
                        Finish All Assessments
                      </Button>
                    ) : (
                      <Button onClick={handleNext}>
                        Next Assessment
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : null}
      </div>

      {/* Footer */}
      <div className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-center text-muted-foreground">
            Powered by SkinScores • Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}