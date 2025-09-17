import type { LucideIcon } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import type { ZodSchema } from 'zod';

export type InputOption = {
  value: string | number;
  label: string;
};

export type InputType = 'number' | 'select' | 'checkbox' | 'radio' | 'text' | 'textarea';

export type InputValue = string | number | boolean | null | undefined;

export type InputConfig = {
  id: string;
  label: string;
  type: InputType;
  options?: InputOption[];
  defaultValue?: InputValue;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  validation?: ZodSchema<InputValue>;
  description?: string;
};

export type InputGroupConfig = {
  id: string;
  title: string;
  inputs: InputConfig[];
  gridCols?: 1 | 2 | 3 | 4; // Number of columns for the inputs within this group
  description?: string;
};

export type FormSectionConfig = InputConfig | InputGroupConfig;

// Type guards for FormSectionConfig based on actual structural differences
export function isInputConfig(section: FormSectionConfig): section is InputConfig {
  // InputConfig has 'type' and 'label' but not 'title' or 'inputs'
  return 'type' in section && 'label' in section && !('title' in section) && !('inputs' in section);
}

export function isInputGroupConfig(section: FormSectionConfig): section is InputGroupConfig {
  // InputGroupConfig has 'title' and 'inputs' array
  return 'title' in section && 'inputs' in section && Array.isArray(section.inputs);
}

type ToolDetailPrimitive = string | number | boolean | null | undefined;

export type ToolDetails = {
  [key: string]: ToolDetailPrimitive | ToolDetails | Array<ToolDetailPrimitive>;
};

export type CalculationResult = {
  score: number | string;
  interpretation: string;
  details?: ToolDetails;
};

export type Tool = {
  id: string;
  name: string;
  acronym?: string;
  description: string;
  condition: string;
  keywords: string[];
  sourceType: 'Research' | 'Clinical Guideline' | 'Expert Consensus';
  icon?: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
  formSections: FormSectionConfig[]; // Changed from inputs: InputConfig[]
  calculationLogic: (inputs: Record<string, InputValue>) => CalculationResult;
  references?: string[];
  displayType?: 'staticList';
  rationale?: string;
  clinicalPerformance?: string;
};
