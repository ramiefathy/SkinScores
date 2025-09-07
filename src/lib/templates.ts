import type { Tool } from '@/lib/types';

export interface CalculationTemplate {
  id: string;
  name: string;
  description: string;
  toolId: string;
  inputs: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
  tags?: string[];
}

const TEMPLATES_KEY = 'skinscores_templates';

// Get all templates
export function getTemplates(): CalculationTemplate[] {
  try {
    const stored = localStorage.getItem(TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load templates:', e);
    return [];
  }
}

// Get templates for a specific tool
export function getToolTemplates(toolId: string): CalculationTemplate[] {
  return getTemplates().filter(t => t.toolId === toolId);
}

// Save a new template
export function saveTemplate(
  name: string,
  description: string,
  toolId: string,
  inputs: Record<string, any>,
  tags?: string[]
): CalculationTemplate {
  const templates = getTemplates();
  
  const newTemplate: CalculationTemplate = {
    id: `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    toolId,
    inputs,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags,
  };
  
  templates.push(newTemplate);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  
  return newTemplate;
}

// Update a template
export function updateTemplate(
  id: string,
  updates: Partial<Omit<CalculationTemplate, 'id' | 'createdAt'>>
): CalculationTemplate | null {
  const templates = getTemplates();
  const index = templates.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  templates[index] = {
    ...templates[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  return templates[index];
}

// Delete a template
export function deleteTemplate(id: string): boolean {
  const templates = getTemplates();
  const filtered = templates.filter(t => t.id !== id);
  
  if (filtered.length === templates.length) return false;
  
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(filtered));
  return true;
}

// Search templates
export function searchTemplates(query: string): CalculationTemplate[] {
  const lowerQuery = query.toLowerCase();
  return getTemplates().filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Default templates for common calculations
export const DEFAULT_TEMPLATES: Record<string, Partial<CalculationTemplate>[]> = {
  'pasi': [
    {
      name: 'Mild Psoriasis',
      description: 'Template for mild psoriasis assessment',
      inputs: {
        head_erythema: 1,
        head_induration: 1,
        head_desquamation: 1,
        head_area: 1,
        trunk_erythema: 1,
        trunk_induration: 1,
        trunk_desquamation: 1,
        trunk_area: 2,
        upper_limbs_erythema: 1,
        upper_limbs_induration: 1,
        upper_limbs_desquamation: 1,
        upper_limbs_area: 1,
        lower_limbs_erythema: 1,
        lower_limbs_induration: 1,
        lower_limbs_desquamation: 1,
        lower_limbs_area: 2,
      },
      tags: ['mild', 'baseline'],
    },
    {
      name: 'Moderate Psoriasis',
      description: 'Template for moderate psoriasis assessment',
      inputs: {
        head_erythema: 2,
        head_induration: 2,
        head_desquamation: 2,
        head_area: 3,
        trunk_erythema: 2,
        trunk_induration: 2,
        trunk_desquamation: 2,
        trunk_area: 4,
        upper_limbs_erythema: 2,
        upper_limbs_induration: 2,
        upper_limbs_desquamation: 2,
        upper_limbs_area: 3,
        lower_limbs_erythema: 2,
        lower_limbs_induration: 2,
        lower_limbs_desquamation: 2,
        lower_limbs_area: 4,
      },
      tags: ['moderate', 'baseline'],
    },
  ],
  'scorad': [
    {
      name: 'Pediatric Eczema - Mild',
      description: 'Common presentation for mild pediatric atopic dermatitis',
      inputs: {
        affected_area: 15,
        erythema: 1,
        edema: 0,
        oozing: 0,
        excoriation: 1,
        lichenification: 0,
        dryness: 2,
        pruritus: 4,
        sleep_loss: 2,
      },
      tags: ['pediatric', 'mild', 'eczema'],
    },
  ],
};

// Initialize default templates on first use
export function initializeDefaultTemplates(): void {
  const existingTemplates = getTemplates();
  
  if (existingTemplates.length === 0) {
    Object.entries(DEFAULT_TEMPLATES).forEach(([toolId, templates]) => {
      templates.forEach(template => {
        saveTemplate(
          template.name!,
          template.description!,
          toolId,
          template.inputs!,
          template.tags
        );
      });
    });
  }
}