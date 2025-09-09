"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, QrCode, Link, Share2, Check, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createShareableLink, copyShareLink, type ShareLink } from '@/lib/share-utils';
import { useAnalyticsContext } from '@/contexts/AnalyticsContext';
import { SecurityBadge } from '@/components/ui/security-badge';
import { motion } from 'framer-motion';
import type { Tool, CalculationResult } from '@/lib/types';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool;
  inputs: Record<string, any>;
  result: CalculationResult;
}

export function ShareDialog({ isOpen, onClose, tool, inputs, result }: ShareDialogProps) {
  const { toast } = useToast();
  const { trackEvent } = useAnalyticsContext();
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareLink = useCallback(async () => {
    setLoading(true);
    try {
      const link = await createShareableLink(tool, inputs, result);
      setShareLink(link);
      trackEvent('share_created', {
        toolId: tool.id,
        toolName: tool.name,
        shareId: link.shareId,
      });
    } catch (error) {
      console.error('Failed to create share link:', error);
      toast({
        title: "Error",
        description: "Failed to create share link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [tool, inputs, result, trackEvent, toast]);

  useEffect(() => {
    if (isOpen && !shareLink) {
      generateShareLink();
    }
  }, [isOpen, shareLink, generateShareLink]);

  const handleCopy = async () => {
    if (!shareLink) return;

    const success = await copyShareLink(shareLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link Copied",
        description: "Share link has been copied to your clipboard.",
      });
      trackEvent('share_copied', {
        toolId: tool.id,
        shareId: shareLink.shareId,
      });
    } else {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadQR = () => {
    if (!shareLink?.qrCode) return;

    const link = document.createElement('a');
    link.href = shareLink.qrCode;
    link.download = `${tool.name.replace(/\s+/g, '_')}_QR_Code.png`;
    link.click();

    trackEvent('qr_downloaded', {
      toolId: tool.id,
      shareId: shareLink.shareId,
    });
  };

  const handleShare = async () => {
    if (!shareLink || !navigator.share) {
      handleCopy();
      return;
    }

    try {
      await navigator.share({
        title: `${tool.name} Calculation`,
        text: `Check out my ${tool.name} calculation result`,
        url: shareLink.fullUrl,
      });
      trackEvent('share_native', {
        toolId: tool.id,
        shareId: shareLink.shareId,
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        handleCopy();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Calculation</DialogTitle>
          <DialogDescription>
            Share your {tool.name} calculation with colleagues or save for later reference.
          </DialogDescription>
        </DialogHeader>

        {/* Security Badge */}
        <SecurityBadge variant="compact" className="mx-auto" />

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : shareLink ? (
          <Tabs defaultValue="link" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="link">
                <Link className="h-4 w-4 mr-2" />
                Link
              </TabsTrigger>
              <TabsTrigger value="qr">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={shareLink.fullUrl}
                  readOnly
                  className="flex-1"
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button size="icon" variant="outline" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Alert className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20">
                  <AlertDescription className="flex flex-col gap-2">
                    <span>This link will expire in 30 days for security.</span>
                    <SecurityBadge variant="inline" className="mt-1" />
                  </AlertDescription>
                </Alert>
              </motion.div>

              <div className="flex gap-2">
                <Button onClick={handleShare} className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={handleCopy} disabled={copied}>
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="qr" className="space-y-4">
              {shareLink.qrCode && (
                <>
                  <div className="flex justify-center">
                    <img 
                      src={shareLink.qrCode} 
                      alt="QR Code" 
                      className="border rounded-lg"
                      style={{ maxWidth: '300px' }}
                    />
                  </div>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    Scan this QR code to open the calculation on another device
                  </p>

                  <Button onClick={handleDownloadQR} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Failed to generate share link
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}