import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';
import { getFirebaseApp } from './client';

const functionsInstance = getFunctions(getFirebaseApp(), 'us-central1');

if (import.meta.env.MODE === 'development' && window.location.hostname === 'localhost') {
  connectFunctionsEmulator(functionsInstance, '127.0.0.1', 5001);
}

export const callCalculateScore = httpsCallable<
  {
    templateSlug: string;
    inputs: Record<string, unknown>;
    patientRef?: string | null;
    sessionId?: string;
  },
  {
    sessionId: string;
    resultId: string;
    score: number;
    interpretationLabel: string;
    interpretationSummary: string;
    copyBlocks: string[];
  }
>(functionsInstance, 'calculateScore');

export const callGenerateResultExport = httpsCallable<
  { sessionIds: string[] },
  { text: string; csv: string }
>(functionsInstance, 'generateResultExport');

export const callSubmitToolResult = httpsCallable<
  {
    toolId: string;
    toolSlug: string;
    toolName: string;
    inputs: Record<string, unknown>;
    result: {
      score?: number | string | null;
      interpretation: string;
      details?: Record<string, unknown>;
    };
    patientRef?: string | null;
    sessionId?: string;
  },
  {
    sessionId: string;
    resultId: string;
  }
>(functionsInstance, 'submitToolResult');
