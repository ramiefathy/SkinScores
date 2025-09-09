"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Share2, Calculator, Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import { getSharedCalculation, type ShareableCalculation } from '@/lib/share-utils';
import { ResultsDisplay } from '@/components/dermscore/ResultsDisplay';
import { SecurityBadge, FloatingSecurityBadge } from '@/components/ui/security-badge';
import { motion } from 'framer-motion';
import { loadTool } from '@/lib/tools';
import type { Tool } from '@/lib/types';
import { format } from 'date-fns';
import { useToolContext } from '@/hooks/useToolContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

function SharePageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleToolSelect } = useToolContext();
  
  const shareId = params.id as string;
  const encodedData = searchParams.get('data') || undefined;
  
  const [loading, setLoading] = useState(true);
  const [sharedCalc, setSharedCalc] = useState<ShareableCalculation | null>(null);
  const [tool, setTool] = useState<Tool | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedCalculation = async () => {
      try {
        const calc = getSharedCalculation(shareId, encodedData);
        
        if (!calc) {
          setError('This share link has expired or is invalid.');
          setLoading(false);
          return;
        }

        // Check expiration
        if (calc.expiresAt && new Date(calc.expiresAt) < new Date()) {
          setError('This share link has expired.');
          setLoading(false);
          return;
        }

        // Load the tool
        const foundTool = await loadTool(calc.toolId);
        if (!foundTool) {
          setError('The tool used for this calculation is no longer available.');
          setLoading(false);
          return;
        }

        setSharedCalc(calc);
        setTool(foundTool);
      } catch (err) {
        console.error('Error loading shared calculation:', err);
        setError('Failed to load the shared calculation.');
      } finally {
        setLoading(false);
      }
    };

    loadSharedCalculation();
  }, [shareId, encodedData]);

  const handleUseThisTool = () => {
    if (!tool) return;
    handleToolSelect(tool.id);
    router.push(`/?toolId=${tool.id}`);
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </PageWrapper>
    );
  }

  if (error || !sharedCalc || !tool) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to Load Calculation</AlertTitle>
            <AlertDescription>
              {error || 'The shared calculation could not be loaded.'}
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 text-center">
            <Button onClick={() => router.push('/')}>
              Go to Home
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <FloatingSecurityBadge />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 text-muted-foreground mb-2">
            <Share2 className="h-5 w-5" />
            <span className="text-sm font-medium">Shared Calculation</span>
          </div>
          <h1 className="text-3xl font-bold">{tool.name}</h1>
          <p className="text-muted-foreground mt-2">
            Shared on {format(new Date(sharedCalc.createdAt), 'PPP')}
          </p>
        </motion.div>

        {/* Security Information Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <SecurityBadge className="max-w-md mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Input Values</CardTitle>
              <CardDescription>
                The values that were used for this calculation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(sharedCalc.inputs).map(([key, value], index) => (
                  <motion.div 
                    key={key} 
                    className="flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <span className="font-medium text-sm">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-sm">{String(value)}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <ResultsDisplay 
          result={sharedCalc.result} 
          tool={tool}
          inputs={sharedCalc.inputs}
        />

        {sharedCalc.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{sharedCalc.notes}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => router.push('/')}>
            <Calculator className="mr-2 h-4 w-4" />
            Browse All Tools
          </Button>
          <Button onClick={handleUseThisTool}>
            Use This Tool
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Separator className="my-8" />

        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-sm text-muted-foreground">
            <p>This calculation was performed using SkinScores Clinical Tools.</p>
            <p className="mt-1">
              Share expires on {format(new Date(sharedCalc.expiresAt!), 'PPP')}
            </p>
          </div>
          
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="inline-block"
          >
            <SecurityBadge variant="compact" className="shadow-sm" />
          </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SharePageContent />
    </Suspense>
  );
}