import { v4 as uuidv4 } from 'uuid';
import type { Tool, CalculationResult } from './types';

export interface PatientTimelineEntry {
  id: string;
  timestamp: string;
  toolId: string;
  toolName: string;
  result: CalculationResult;
  inputs: Record<string, any>;
  notes?: string;
  treatmentNotes?: string;
}

export interface PatientRecord {
  id: string;
  patientId: string; // Encrypted identifier
  createdAt: string;
  lastUpdated: string;
  timeline: PatientTimelineEntry[];
  reminders?: PatientReminder[];
  metadata?: {
    diagnosis?: string;
    treatmentPlan?: string;
    clinicianNotes?: string;
  };
}

export interface PatientReminder {
  id: string;
  patientRecordId: string;
  toolId: string;
  scheduledDate: string;
  status: 'pending' | 'completed' | 'overdue';
  message?: string;
}

export interface PatientLink {
  id: string;
  patientRecordId: string;
  toolIds: string[];
  expiresAt: string;
  accessCount: number;
  maxAccess?: number;
  createdAt: string;
}

// Encryption utilities (simplified for demo - in production use proper crypto)
const ENCRYPTION_KEY = 'skinscores-patient-key'; // In production, use env variable

export function encryptPatientId(patientId: string): string {
  // Simple base64 encoding for demo - use proper encryption in production
  return btoa(`${ENCRYPTION_KEY}:${patientId}`);
}

export function decryptPatientId(encryptedId: string): string {
  try {
    const decoded = atob(encryptedId);
    return decoded.split(':')[1] || '';
  } catch {
    return '';
  }
}

// Patient record management
export function createPatientRecord(patientId: string): PatientRecord {
  return {
    id: uuidv4(),
    patientId: encryptPatientId(patientId),
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    timeline: [],
  };
}

export function addTimelineEntry(
  record: PatientRecord,
  tool: Tool,
  result: CalculationResult,
  inputs: Record<string, any>,
  notes?: string
): PatientRecord {
  const entry: PatientTimelineEntry = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    toolId: tool.id,
    toolName: tool.name,
    result,
    inputs,
    notes,
  };

  return {
    ...record,
    timeline: [...record.timeline, entry],
    lastUpdated: new Date().toISOString(),
  };
}

// Patient link generation
export function generatePatientLink(
  patientRecordId: string,
  toolIds: string[],
  expirationHours: number = 48
): PatientLink {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expirationHours * 60 * 60 * 1000);

  return {
    id: uuidv4(),
    patientRecordId,
    toolIds,
    expiresAt: expiresAt.toISOString(),
    accessCount: 0,
    maxAccess: 5, // Default max access
    createdAt: now.toISOString(),
  };
}

// Local storage management
const PATIENT_RECORDS_KEY = 'skinscores_patient_records';
const PATIENT_LINKS_KEY = 'skinscores_patient_links';

export function savePatientRecord(record: PatientRecord): void {
  const records = getPatientRecords();
  const existingIndex = records.findIndex(r => r.id === record.id);
  
  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }
  
  localStorage.setItem(PATIENT_RECORDS_KEY, JSON.stringify(records));
}

export function getPatientRecords(): PatientRecord[] {
  try {
    const stored = localStorage.getItem(PATIENT_RECORDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getPatientRecord(id: string): PatientRecord | null {
  const records = getPatientRecords();
  return records.find(r => r.id === id) || null;
}

export function findPatientRecordByPatientId(encryptedPatientId: string): PatientRecord | null {
  const records = getPatientRecords();
  return records.find(r => r.patientId === encryptedPatientId) || null;
}

// Link management
export function savePatientLink(link: PatientLink): void {
  const links = getPatientLinks();
  links.push(link);
  localStorage.setItem(PATIENT_LINKS_KEY, JSON.stringify(links));
}

export function getPatientLinks(): PatientLink[] {
  try {
    const stored = localStorage.getItem(PATIENT_LINKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getPatientLink(id: string): PatientLink | null {
  const links = getPatientLinks();
  return links.find(l => l.id === id) || null;
}

export function validateAndUpdatePatientLink(linkId: string): PatientLink | null {
  const links = getPatientLinks();
  const linkIndex = links.findIndex(l => l.id === linkId);
  
  if (linkIndex === -1) return null;
  
  const link = links[linkIndex];
  
  // Check expiration
  if (new Date(link.expiresAt) < new Date()) {
    return null;
  }
  
  // Check access count
  if (link.maxAccess && link.accessCount >= link.maxAccess) {
    return null;
  }
  
  // Update access count
  link.accessCount++;
  links[linkIndex] = link;
  localStorage.setItem(PATIENT_LINKS_KEY, JSON.stringify(links));
  
  return link;
}

// Progress tracking utilities
export function calculateTrend(entries: PatientTimelineEntry[]): {
  trend: 'improving' | 'stable' | 'worsening' | 'insufficient-data';
  changePercent?: number;
} {
  if (entries.length < 2) {
    return { trend: 'insufficient-data' };
  }
  
  // Get numeric scores
  const scores = entries
    .map(e => typeof e.result.score === 'number' ? e.result.score : null)
    .filter(s => s !== null) as number[];
    
  if (scores.length < 2) {
    return { trend: 'insufficient-data' };
  }
  
  // Calculate trend
  const firstScore = scores[0];
  const lastScore = scores[scores.length - 1];
  const changePercent = ((lastScore - firstScore) / firstScore) * 100;
  
  if (Math.abs(changePercent) < 10) {
    return { trend: 'stable', changePercent };
  } else if (changePercent < 0) {
    return { trend: 'improving', changePercent };
  } else {
    return { trend: 'worsening', changePercent };
  }
}

// Export format for sharing
export function exportPatientTimeline(record: PatientRecord): string {
  const data = {
    patientId: decryptPatientId(record.patientId),
    exportDate: new Date().toISOString(),
    timeline: record.timeline.map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString(),
      time: new Date(entry.timestamp).toLocaleTimeString(),
      tool: entry.toolName,
      score: entry.result.score,
      interpretation: entry.result.interpretation,
      notes: entry.notes,
    })),
    trend: calculateTrend(record.timeline),
  };
  
  return JSON.stringify(data, null, 2);
}