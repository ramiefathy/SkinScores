import { describe, expect, it, vi } from 'vitest';
import { buildExportFilename, formatResultForClipboard } from '../utils/resultFormatting';

const baseResult = {
  id: 'result-1',
  sessionId: 'session-1',
  userId: 'user-1',
  templateId: 'template-1',
  templateSlug: 'template-slug',
  templateName: 'Template Name',
  score: 12,
  interpretationLabel: 'Moderate',
  interpretationSummary: 'Patient shows moderate risk.',
  copyBlocks: ['Line one', 'Line two'],
  createdAt: new Date(),
};

describe('formatResultForClipboard', () => {
  it('constructs multiline summary with template name and copy blocks', () => {
    const text = formatResultForClipboard({ result: baseResult, templateName: 'Custom Template' });
    expect(text).toContain('Custom Template');
    expect(text).toContain('Score: 12 (Moderate)');
    expect(text).toContain('Patient shows moderate risk.');
    expect(text.split('\n')).toHaveLength(5);
  });
});

describe('buildExportFilename', () => {
  it('builds sanitized filename with extension', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-09-16T14:00:00Z'));
    const filename = buildExportFilename('Patient #1', 'csv');
    expect(filename.startsWith('Patient_1-')).toBe(true);
    expect(filename.endsWith('.csv')).toBe(true);
    vi.useRealTimers();
  });

  it('falls back to default identifier', () => {
    const filename = buildExportFilename(undefined, 'text');
    expect(filename.endsWith('.txt')).toBe(true);
  });
});
