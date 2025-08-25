
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Fingerprint } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const nappaClinFormSections: FormSectionConfig[] = Array.from({ length: 4 }, (_, i) => ({
    id: `nappa_nail_${i + 1}_group`,
    title: `Digit ${i + 1}`,
    gridCols: 2,
    inputs: [
        { id: `nail_${i+1}_matrix`, label: "Matrix Score (0-4)", type: 'number', min: 0, max: 4, defaultValue: 0, validation: getValidationSchema('number', [], 0, 4) },
        { id: `nail_${i+1}_bed`, label: "Bed Score (0-4)", type: 'number', min: 0, max: 4, defaultValue: 0, validation: getValidationSchema('number', [], 0, 4) }
    ]
}));

export const nappaClinTool: Tool = {
  id: "nappa_clin",
  name: "NAPPA-CLIN (Nail Assessment in Psoriasis and PsA)",
  acronym: "NAPPA-CLIN",
  description: "A clinician-rated severity index for nail psoriasis, which is a shortened version of NAPSI, assessing only four digits instead of all twenty. It is one of three components of the full NAPPA tool.",
  condition: "Psoriasis / Psoriatic Arthritis",
  keywords: ["nappa", "nappa-clin", "nail psoriasis", "psoriatic arthritis", "napsi"],
  sourceType: 'Research',
  icon: Fingerprint,
  formSections: nappaClinFormSections,
  calculationLogic: (inputs) => {
    let totalScore = 0;
    const details: Record<string, any> = {};

    for (let i = 1; i <= 4; i++) {
        const matrixScore = Number(inputs[`nail_${i}_matrix`]) || 0;
        const bedScore = Number(inputs[`nail_${i}_bed`]) || 0;
        const nailTotal = matrixScore + bedScore;
        totalScore += nailTotal;
        details[`Digit ${i}`] = { Matrix: matrixScore, Bed: bedScore, Total: nailTotal };
    }

    const score = totalScore;
    const interpretation = `Total NAPPA-CLIN Score: ${score} (Range: 0-32). Higher scores indicate more severe nail psoriasis in the four assessed digits. This score shows high correlation with the full 20-digit NAPSI score.`;
    
    return {
      score,
      interpretation,
      details
    };
  },
  references: [
    "Augustin M, Blome C, Costanzo A, et al. Nail Assessment in Psoriasis and Psoriatic Arthritis (NAPPA): development and validation of a new, brief, patient-reported outcome measure. Arch Dermatol Res. 2014;306(6):531-9."
  ]
};
