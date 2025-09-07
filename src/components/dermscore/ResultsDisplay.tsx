import React from 'react';
import type { CalculationResult, Tool } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ListOrdered, ClipboardCopy, Save, Printer, Download, FileText, Share2, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCalculationHistory } from '@/hooks/useCalculationHistory';
import { useAnalyticsContext } from '@/contexts/AnalyticsContext';
import { exportToCSV, exportToPDF, type ExportData } from '@/lib/export-utils';
import { ShareDialog } from '@/components/share/ShareDialog';
import { SeverityIndicator } from '@/components/ui/severity-indicator';
import { getSeverityConfig, getSeverityRecommendation } from '@/lib/severity-configs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const formatValueForDisplay = (value: any): string => {
  if (value === null || value === undefined) {
    return "N/A";
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    // For objects, we might want a specific summary or indicate it's complex
    // For now, let's just show [Object] to avoid overly long strings in simple display
    // The recursive display logic will handle showing its contents.
    return "[Object]";
  }
  return String(value);
};

const formatDetailsForCopyText = (details: Record<string, any>, indentLevel = 0): string => {
  let detailsString = '';
  const indent = '  '.repeat(indentLevel);
  for (const [key, value] of Object.entries(details)) {
    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (value === null || value === undefined) {
        detailsString += `${indent}${formattedKey}: N/A\n`;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      detailsString += `${indent}${formattedKey}:\n`;
      detailsString += formatDetailsForCopyText(value as Record<string, any>, indentLevel + 1);
    } else {
      detailsString += `${indent}${formattedKey}: ${String(value)}\n`;
    }
  }
  return detailsString;
};

const formatDetailsForHtmlTable = (details: Record<string, any>, isNested: boolean = false): string => {
  if (!details || Object.keys(details).length === 0) return '';

  let htmlString = isNested ? '<table style="width: 100%; border-collapse: collapse; margin-left: 15px;"><tbody>' : '';

  for (const [key, value] of Object.entries(details)) {
    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    htmlString += `<tr style="border: 1px solid #ddd;">`;
    htmlString += `<td style="padding: 8px; border: 1px solid #ddd; vertical-align: top; font-weight: bold;">${formattedKey}</td>`;
    if (value === null || value === undefined) {
      htmlString += `<td style="padding: 8px; border: 1px solid #ddd;">N/A</td>`;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      htmlString += `<td style="padding: 8px; border: 1px solid #ddd;">${formatDetailsForHtmlTable(value as Record<string, any>, true)}</td>`;
    } else {
      htmlString += `<td style="padding: 8px; border: 1px solid #ddd;">${String(value)}</td>`;
    }
    htmlString += `</tr>`;
  }
  htmlString += isNested ? '</tbody></table>' : '';
  return htmlString;
};


interface ResultsDisplayProps {
  result: CalculationResult;
  tool: Tool;
  inputs?: Record<string, any>;
  preferences?: any;
  onAddToPatient?: () => void;
}

export function ResultsDisplay({ result, tool, inputs, preferences, onAddToPatient }: ResultsDisplayProps) {
  const { toast } = useToast();
  const { saveCalculation } = useCalculationHistory();
  const { trackExport } = useAnalyticsContext();
  const [showShareDialog, setShowShareDialog] = React.useState(false);

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print Dialog Opened",
      description: "Your calculation results are ready to print.",
    });
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    if (!inputs) return;
    
    const exportData: ExportData = {
      tool: {
        name: tool.name,
        condition: tool.condition,
        sourceType: tool.sourceType,
      },
      result,
      inputs,
      metadata: {
        timestamp: new Date().toISOString(),
        exportFormat: format,
      },
    };

    if (format === 'csv') {
      exportToCSV(exportData);
      trackExport('csv', tool.name);
      toast({
        title: "CSV Exported",
        description: "Results have been exported as CSV file.",
      });
    } else {
      exportToPDF(exportData);
      trackExport('pdf', tool.name);
      toast({
        title: "PDF Export",
        description: "Opening PDF preview for printing/saving.",
      });
    }
  };

  const handleCopyToClipboard = async () => {
    const dateTime = new Date().toLocaleString();

    // Plain Text Version
    let reportStringText = `SkinScores Report\n`;
    reportStringText += `Tool: ${tool.name}${tool.acronym ? ` (${tool.acronym})` : ''}\n`;
    reportStringText += `Date & Time: ${dateTime}\n`;
    reportStringText += `--------------------------------------------------\n`;
    reportStringText += `SCORE: ${String(result.score)}\n`;
    reportStringText += `INTERPRETATION: ${result.interpretation}\n`;

    if (result.details && Object.keys(result.details).length > 0) {
      reportStringText += `--------------------------------------------------\n`;
      reportStringText += `DETAILS:\n`;
      reportStringText += formatDetailsForCopyText(result.details);
    }
    reportStringText += `--------------------------------------------------\n`;
    reportStringText += `Calculated with SkinScores\n`;

    // HTML Version
    let reportStringHtml = `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ccc; padding: 15px; max-width: 800px;">
        <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">SkinScore Report</h2>
        <p><strong>Tool:</strong> ${tool.name}${tool.acronym ? ` (${tool.acronym})` : ''}</p>
        <p><strong>Date & Time:</strong> ${dateTime}</p>
        <hr style="margin: 15px 0;" />
        <p><strong>SCORE:</strong> <span style="font-size: 1.5em; font-weight: bold;">${String(result.score)}</span></p>
        <p><strong>INTERPRETATION:</strong></p>
        <p style="background-color: #f9f9f9; border: 1px solid #eee; padding: 10px; border-radius: 4px;">${result.interpretation}</p>
    `;

    if (result.details && Object.keys(result.details).length > 0) {
      reportStringHtml += `
        <hr style="margin: 15px 0;" />
        <h3 style="color: #555;">DETAILS:</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; margin-top: 10px;">
          <tbody>
            ${formatDetailsForHtmlTable(result.details)}
          </tbody>
        </table>
      `;
    }
    reportStringHtml += `
        <hr style="margin: 15px 0;" />
        <p style="font-size: 0.9em; color: #777;">Calculated with SkinScore</p>
      </div>
    `;

    // Check if we have clipboard permissions and handle accordingly
    if (navigator.clipboard && window.isSecureContext) {
      try {
        // Try the advanced clipboard API first
        if (navigator.clipboard.write && typeof ClipboardItem !== 'undefined') {
          const plainBlob = new Blob([reportStringText], { type: 'text/plain' });
          const htmlBlob = new Blob([reportStringHtml], { type: 'text/html' });
          const clipboardItem = new ClipboardItem({
            'text/plain': plainBlob,
            'text/html': htmlBlob,
          });
          await navigator.clipboard.write([clipboardItem]);
          toast({
            title: "Results Copied",
            description: "Formatted results (HTML and plain text) have been copied to your clipboard.",
          });
        } else {
          // Fallback to writeText
          await navigator.clipboard.writeText(reportStringText);
          toast({
            title: "Results Copied",
            description: "Plain text results copied to clipboard.",
          });
        }
      } catch (err) {
        console.error('Failed to copy results: ', err);
        // Fallback to older execCommand method
        const textArea = document.createElement('textarea');
        textArea.value = reportStringText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          toast({
            title: "Results Copied",
            description: "Results copied to clipboard.",
          });
        } catch (execErr) {
          toast({
            title: "Copy Failed",
            description: "Could not copy results. Please copy manually.",
            variant: "destructive",
          });
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } else {
      // No clipboard API available
      toast({
        title: "Copy Not Available",
        description: "Clipboard access is not available in this context.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
    <Card className="bg-accent/10 border-accent shadow-xl print-content print-card">
      {/* Print-only header */}
      <div className="hidden print:block print-header">
        <h1>SkinScores Clinical Calculation Report</h1>
        <div className="meta">
          <p>Tool: {tool.name}</p>
          {typeof window !== 'undefined' && (
            <p>Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
          )}
          <p>Generated by: SkinScores Clinical Tools</p>
        </div>
      </div>
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-7 w-7 text-accent-foreground" />
          <CardTitle className="text-3xl font-headline text-accent-foreground">Calculation Results</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyToClipboard} className="shrink-0">
            <ClipboardCopy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          {inputs && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowShareDialog(true)}
              className="shrink-0"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
          {inputs && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                saveCalculation(tool, result, inputs);
                toast({
                  title: "Calculation Saved",
                  description: "This calculation has been saved to your history.",
                });
              }}
              className="shrink-0"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
          {onAddToPatient && inputs && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAddToPatient}
              className="shrink-0"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add to Patient
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="shrink-0 no-print"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          {inputs && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="shrink-0 no-print"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-0">
        {/* Enhanced Visual Severity Indicator */}
        {typeof result.score === 'number' && preferences?.showSeverityIndicators !== false && (
          <SeverityIndicator
            score={result.score}
            {...getSeverityConfig(tool.id)}
            showProgress={true}
            showNumeric={true}
            showInterpretation={false}
            className="mb-6"
          />
        )}
        
        {/* Original Score Display - now integrated with severity indicator */}
        {typeof result.score !== 'number' && (
          <div>
            <p className="text-base font-medium text-muted-foreground mb-0.5">Result</p>
            <p className="text-3xl font-bold text-primary">{String(result.score)}</p>
          </div>
        )}
        
        {/* Clinical Interpretation with Enhanced Context */}
        <div className="space-y-3">
          <div>
            <p className="text-base font-medium text-muted-foreground mb-0.5">Clinical Interpretation</p>
            <p className="text-lg leading-relaxed">{result.interpretation}</p>
          </div>
          
          {/* Contextual Recommendations based on score */}
          {typeof result.score === 'number' && preferences?.showSeverityIndicators !== false && (
            <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
              <h4 className="text-base font-semibold mb-2 text-primary">Recommended Next Steps</h4>
              <p className="text-base text-muted-foreground leading-relaxed">
                {getSeverityRecommendation(
                  (result.score / getSeverityConfig(tool.id).maxScore) * 100,
                  tool.id
                )}
              </p>
            </div>
          )}
        </div>

        {result.details && Object.keys(result.details).length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-1.5">
              <ListOrdered className="h-5 w-5 text-muted-foreground" />
              <p className="text-base font-medium text-muted-foreground">Details</p>
            </div>
            <ul className="list-none pl-1 text-base space-y-1.5">
              {Object.entries(result.details).map(([key, value]) => (
                <li key={key} className="pt-1.5 pb-1">
                  <div className="font-semibold text-foreground/90">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</div>
                  {typeof value === 'object' && value !== null && !Array.isArray(value) ? (
                    <div className="pl-4 mt-1 space-y-0.5"> {/* Level 1 indent */}
                      {Object.entries(value as Record<string, any>).map(([subKey, subValue]) => (
                        <div key={subKey} className="pt-0.5">
                          <div className="font-medium text-muted-foreground">
                            {subKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                          </div>
                          {typeof subValue === 'object' && subValue !== null && !Array.isArray(subValue) ? (
                             <div className="pl-4 space-y-0.5"> {/* Level 2 indent */}
                              {Object.entries(subValue as Record<string, string | number | undefined | null | Record<string, any>>).map(([subSubKey, subSubValue]) => (
                                (subSubValue !== undefined && subSubValue !== null && String(subSubValue).trim() !== '') || typeof subSubValue === 'number' ? (
                                  <div key={subSubKey} className="flex text-xs">
                                    <span className="font-normal text-muted-foreground/80 w-auto max-w-[180px] shrink-0 pr-1.5">
                                      {subSubKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                    </span>
                                     {typeof subSubValue === 'object' && subSubValue !== null && !Array.isArray(subSubValue) ?
                                        Object.entries(subSubValue as Record<string, any>).map(([deepKey, deepValue]) => (
                                            <div key={deepKey} className="pl-4 text-xs">
                                                <span className="font-normal text-muted-foreground/80 w-auto max-w-[180px] shrink-0 pr-1.5">
                                                    {deepKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                                </span>
                                                <span className="text-foreground/90 break-words">{formatValueForDisplay(deepValue)}</span>
                                            </div>
                                        )).reduce((acc, curr, idx, arr) => acc.concat(curr, idx < arr.length -1 ? <br /> : []), [] as (JSX.Element | null)[])
                                        :
                                        <span className="text-foreground/90 break-words">{formatValueForDisplay(subSubValue)}</span>
                                    }
                                  </div>
                                ) : null
                              ))}
                            </div>
                          ) : (
                            <div className="pl-4 text-foreground/90 break-words">{formatValueForDisplay(subValue)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pl-4 mt-0.5 text-foreground break-words">{formatValueForDisplay(value)}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <CardDescription className="text-xs pt-3">
          Note: This calculation is for informational purposes only and should not replace professional medical advice.
          All data is processed locally and not stored or transmitted.
        </CardDescription>
      </CardContent>
    </Card>
    
    {inputs && (
      <ShareDialog 
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        tool={tool}
        inputs={inputs}
        result={result}
      />
    )}
    </>
  );
}
