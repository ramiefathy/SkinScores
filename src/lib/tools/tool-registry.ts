import type { Tool } from '../types';
import { toolLoaders, loadTool } from './lazy-loader';

// Metadata for all tools (lightweight info for listing)
export interface ToolMetadata {
  id: string;
  name: string;
  acronym?: string;
  condition: string;
  keywords: string[];
}

// This will be populated as tools are loaded
const toolRegistry: Map<string, Tool> = new Map();

// Hardcoded metadata to avoid loading all tools at once
export const toolMetadata: ToolMetadata[] = [
  { id: 'aas', name: 'Allergic Asthma Score (AAS)', condition: 'Asthma / Allergic Conditions', keywords: ['aas', 'allergic asthma', 'asthma severity'] },
  { id: 'abcde_melanoma', name: 'ABCDE Rule for Melanoma', condition: 'Melanoma', keywords: ['abcde', 'melanoma', 'screening', 'dermoscopy', 'mnemonic'] },
  { id: 'absis', name: 'Autoinflammatory Bullous Skin (ABSIS) Score', condition: 'Autoimmune Blistering Diseases', keywords: ['absis', 'pemphigoid', 'bullous pemphigoid', 'autoimmune'] },
  { id: 'acne_qol', name: 'Acne Quality of Life Scale (Acne-QoL)', condition: 'Acne Vulgaris', keywords: ['acne qol', 'quality of life', 'patient reported outcome'] },
  { id: 'alt70', name: 'At Least 70 mm Absolute Length (ALT-70)', condition: 'Alopecia Areata', keywords: ['alt70', 'alopecia areata', 'hair loss', 'severity'] },
  { id: 'pasi', name: 'Psoriasis Area and Severity Index (PASI)', acronym: 'PASI', condition: 'Psoriasis / Psoriatic Arthritis', keywords: ['pasi', 'psoriasis', 'plaque psoriasis', 'severity', 'index', 'psoriatic arthritis'] },
  { id: 'dlqi', name: 'Dermatology Life Quality Index (DLQI)', acronym: 'DLQI', condition: 'Quality of Life', keywords: ['dlqi', 'quality of life', 'qol', 'patient reported outcome'] },
  { id: 'easi', name: 'Eczema Area and Severity Index (EASI)', acronym: 'EASI', condition: 'Atopic Dermatitis / Eczema', keywords: ['easi', 'atopic dermatitis', 'ad', 'eczema', 'severity', 'area', 'HOME initiative'] },
  { id: 'scorad', name: 'SCORing Atopic Dermatitis (SCORAD)', acronym: 'SCORAD', condition: 'Atopic Dermatitis / Eczema', keywords: ['scorad', 'atopic dermatitis', 'eczema', 'severity', 'objective scorad'] },
];

// Get tool by ID (loads if needed)
export async function getToolById(id: string): Promise<Tool | null> {
  // Check registry first
  if (toolRegistry.has(id)) {
    return toolRegistry.get(id)!;
  }

  // Load the tool
  const tool = await loadTool(id);
  if (tool) {
    toolRegistry.set(id, tool);
  }
  return tool;
}

// Get all tool metadata without loading tools
export function getAllToolMetadata(): ToolMetadata[] {
  return toolMetadata;
}

// Get tools by condition (loads only needed tools)
export async function getToolsByCondition(condition: string): Promise<Tool[]> {
  const metadata = toolMetadata.filter(m => m.condition === condition);
  const tools = await Promise.all(metadata.map(m => getToolById(m.id)));
  return tools.filter((t): t is Tool => t !== null);
}

// Search tools by keyword (loads only matching tools)
export async function searchTools(query: string): Promise<Tool[]> {
  const lowerQuery = query.toLowerCase();
  const matches = toolMetadata.filter(m => 
    m.name.toLowerCase().includes(lowerQuery) ||
    (m.acronym && m.acronym.toLowerCase().includes(lowerQuery)) ||
    m.condition.toLowerCase().includes(lowerQuery) ||
    m.keywords.some(k => k.toLowerCase().includes(lowerQuery))
  );
  
  const tools = await Promise.all(matches.map(m => getToolById(m.id)));
  return tools.filter((t): t is Tool => t !== null);
}

// Preload popular tools
export function preloadPopularTools() {
  const popularIds = ['pasi', 'dlqi', 'abcde_melanoma', 'easi', 'scorad'];
  popularIds.forEach(id => {
    if (!toolRegistry.has(id)) {
      loadTool(id).then(tool => {
        if (tool) toolRegistry.set(id, tool);
      });
    }
  });
}