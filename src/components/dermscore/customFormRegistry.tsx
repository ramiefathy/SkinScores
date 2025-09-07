import { ComponentType } from 'react';
import { PasiFormWithBodyMapping } from '@/components/tools/PasiFormWithBodyMapping';
import { EasiFormWithBodyMapping } from '@/components/tools/EasiFormWithBodyMapping';
import { ScoradFormWithBodyMapping } from '@/components/tools/ScoradFormWithBodyMapping';
import { DlqiFormWithVisualScales } from '@/components/tools/DlqiFormWithVisualScales';

// Map of tool IDs to their custom form components
export const customFormRegistry: Record<string, ComponentType<any>> = {
  pasi: PasiFormWithBodyMapping,
  easi: EasiFormWithBodyMapping,
  scorad: ScoradFormWithBodyMapping,
  dlqi: DlqiFormWithVisualScales,
};