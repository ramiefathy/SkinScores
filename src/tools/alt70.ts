import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { ShieldCheck } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const alt70Options: InputOption[] = [
  { value: 1, label: 'Yes' },
  { value: 0, label: 'No' },
];

const alt70FormSections: FormSectionConfig[] = [
  {
    id: 'alt70_asymmetry',
    label: 'Asymmetry (unilateral involvement) (3 points)',
    type: 'select',
    options: alt70Options,
    defaultValue: 0,
    validation: getValidationSchema('select', alt70Options),
  },
  {
    id: 'alt70_age',
    label: 'Age >= 70 years (2 points)',
    type: 'select',
    options: alt70Options,
    defaultValue: 0,
    validation: getValidationSchema('select', alt70Options),
  },
  {
    id: 'alt70_leukocytosis',
    label: 'Leukocytosis (WBC >= 10,000/μL) (1 point)',
    type: 'select',
    options: alt70Options,
    defaultValue: 0,
    validation: getValidationSchema('select', alt70Options),
  },
  {
    id: 'alt70_tachycardia',
    label: 'Tachycardia (HR >= 90 bpm) (1 point)',
    type: 'select',
    options: alt70Options,
    defaultValue: 0,
    validation: getValidationSchema('select', alt70Options),
  },
];

export const alt70Tool: Tool = {
  id: 'alt70',
  name: 'ALT-70 Score for Cellulitis',
  acronym: 'ALT-70',
  description:
    'A rapid emergency department tool to distinguish lower extremity cellulitis from pseudocellulitis based on four criteria: Asymmetry, Leukocytosis, Tachycardia, and Age >= 70. This tool does not apply in cases of trauma, ulcers, or abscesses.',
  condition: 'Cellulitis',
  keywords: ['alt-70', 'cellulitis', 'pseudocellulitis', 'prediction', 'lower extremity'],
  sourceType: 'Research',
  icon: ShieldCheck,
  formSections: alt70FormSections,
  calculationLogic: (inputs) => {
    const asymmetry = (Number(inputs.alt70_asymmetry) || 0) * 3;
    const age = (Number(inputs.alt70_age) || 0) * 2;
    const leukocytosis = (Number(inputs.alt70_leukocytosis) || 0) * 1;
    const tachycardia = (Number(inputs.alt70_tachycardia) || 0) * 1;

    const score = asymmetry + leukocytosis + tachycardia + age;

    let interpretation = `ALT-70 Score: ${score} (Range: 0-7). `;
    if (score <= 2) {
      interpretation += 'Cellulitis Unlikely (≥83% chance of pseudocellulitis).';
    } else if (score <= 4) {
      interpretation += 'Indeterminate (~72% chance). Suggest consultation.';
    } else {
      interpretation += 'Cellulitis Likely (≥82% chance of cellulitis). Treat empirically.';
    }

    return {
      score,
      interpretation,
      details: {
        Asymmetry_Score: asymmetry,
        Age_Score: age,
        Leukocytosis_Score: leukocytosis,
        Tachycardia_Score: tachycardia,
        Total_Score: score,
        Likelihood_Category:
          score <= 2 ? 'Unlikely Cellulitis' : score <= 4 ? 'Indeterminate' : 'Likely Cellulitis',
      },
    };
  },
  references: [
    'Raff AB, Kroshinsky D. Cellulitis: A Review. JAMA. 2016;316(3):325–337.',
    'Weng QY, Raff AB, Cohen JM, et al. Development and Validation of a Novel Model for the Diagnosis of Cellulitis. JAMA Dermatol. 2017;153(3):295-300.',
    'Parsons L, MacVane C, et al. Prospective Validation of the ALT-70 Cellulitis Severity Score. J Am Acad Dermatol. 2021;84(4):1167-1169.',
  ],
};
