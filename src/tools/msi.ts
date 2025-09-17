import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { Palette } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const msiFormSections: FormSectionConfig[] = [
  {
    id: 'msi_left_face_group',
    title: 'Left Face (Multiplier: 0.4)',
    gridCols: 2,
    inputs: [
      {
        id: 'left_area',
        label: 'Area (a) (0-6)',
        type: 'number',
        min: 0,
        max: 6,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 6),
      },
      {
        id: 'left_pigmentation',
        label: 'Pigmentation (p) (0-4)',
        type: 'number',
        min: 0,
        max: 4,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 4),
      },
    ],
  },
  {
    id: 'msi_right_face_group',
    title: 'Right Face (Multiplier: 0.4)',
    gridCols: 2,
    inputs: [
      {
        id: 'right_area',
        label: 'Area (a) (0-6)',
        type: 'number',
        min: 0,
        max: 6,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 6),
      },
      {
        id: 'right_pigmentation',
        label: 'Pigmentation (p) (0-4)',
        type: 'number',
        min: 0,
        max: 4,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 4),
      },
    ],
  },
  {
    id: 'msi_nose_group',
    title: 'Nose (Multiplier: 0.2)',
    gridCols: 2,
    inputs: [
      {
        id: 'nose_area',
        label: 'Area (a) (0-6)',
        type: 'number',
        min: 0,
        max: 6,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 6),
      },
      {
        id: 'nose_pigmentation',
        label: 'Pigmentation (p) (0-4)',
        type: 'number',
        min: 0,
        max: 4,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 4),
      },
    ],
  },
];

export const msiTool: Tool = {
  id: 'msi',
  name: 'Melasma Severity Index',
  acronym: 'MSI',
  description:
    'Designed as a simpler, more practical office-based tool to assess severity and monitor treatment response in melasma. The formula is: MSI = 0.4·(a x p²)L + 0.4·(a x p²)R + 0.2·(a x p²)Nose, where a = area (0-6) and p = pigmentation (0-4).',
  condition: 'Melasma',
  keywords: ['msi', 'melasma', 'severity', 'pigmentation'],
  sourceType: 'Research',
  icon: Palette,
  formSections: msiFormSections,
  calculationLogic: (inputs) => {
    const leftArea = Number(inputs.left_area) || 0;
    const leftPigmentation = Number(inputs.left_pigmentation) || 0;
    const rightArea = Number(inputs.right_area) || 0;
    const rightPigmentation = Number(inputs.right_pigmentation) || 0;
    const noseArea = Number(inputs.nose_area) || 0;
    const nosePigmentation = Number(inputs.nose_pigmentation) || 0;

    const leftScore = 0.4 * (leftArea * Math.pow(leftPigmentation, 2));
    const rightScore = 0.4 * (rightArea * Math.pow(rightPigmentation, 2));
    const noseScore = 0.2 * (noseArea * Math.pow(nosePigmentation, 2));

    const totalScore = leftScore + rightScore + noseScore;
    const score = parseFloat(totalScore.toFixed(2));

    const interpretation = `Total MSI Score: ${score}. Higher scores indicate greater melasma severity. This tool is a simpler office-based alternative to the MASI.`;

    return {
      score,
      interpretation,
      details: {
        'Left Face Score': parseFloat(leftScore.toFixed(2)),
        'Right Face Score': parseFloat(rightScore.toFixed(2)),
        'Nose Score': parseFloat(noseScore.toFixed(2)),
        'Total Score': score,
      },
    };
  },
  references: [
    'Lakshmi C. Proposing a melasma severity index (MSI). Indian J Dermatol. 2010;55(4):381-2. doi: 10.4103/0019-5154.74569. PMID: 21220892.',
  ],
};
