import { format } from 'date-fns';
import type { ScoreResultRecord } from '../services/scoreResultService';

type ClipboardParams = {
  result: ScoreResultRecord;
  templateName?: string | null;
};

export const formatResultForClipboard = ({ result, templateName }: ClipboardParams) => {
  const header = templateName ?? result.templateName ?? result.templateId;
  const scoreValue =
    typeof result.score === 'number'
      ? result.score
      : (result.scoreText ?? (result.score !== undefined ? String(result.score) : '—'));
  const label = result.interpretationLabel ?? 'Result';
  const lines = [
    header,
    `Score: ${scoreValue} (${label})`,
    result.interpretationSummary,
    ...(result.copyBlocks ?? []),
  ];
  return lines.filter(Boolean).join('\n');
};

export const buildExportFilename = (identifier: string | undefined, fileFormat: 'csv' | 'text') => {
  const safeId = identifier?.replace(/[^a-z0-9-_]+/gi, '_') ?? 'export';
  const extension = fileFormat === 'csv' ? 'csv' : 'txt';
  const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
  return `${safeId}-${timestamp}.${extension}`;
};
