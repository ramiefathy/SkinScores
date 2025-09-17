import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from './types';
import { Activity } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const bradenOptions: Record<string, InputOption[]> = {
  sensory: [
    { value: 1, label: '1: Completely Limited' },
    { value: 2, label: '2: Very Limited' },
    { value: 3, label: '3: Slightly Limited' },
    { value: 4, label: '4: No Impairment' },
  ],
  moisture: [
    { value: 1, label: '1: Constantly Moist' },
    { value: 2, label: '2: Often Moist' },
    { value: 3, label: '3: Occasionally Moist' },
    { value: 4, label: '4: Rarely Moist' },
  ],
  activity: [
    { value: 1, label: '1: Bedfast' },
    { value: 2, label: '2: Chairfast' },
    { value: 3, label: '3: Walks Occasionally' },
    { value: 4, label: '4: Walks Frequently' },
  ],
  mobility: [
    { value: 1, label: '1: Completely Immobile' },
    { value: 2, label: '2: Very Limited' },
    { value: 3, label: '3: Slightly Limited' },
    { value: 4, label: '4: No Limitation' },
  ],
  nutrition: [
    { value: 1, label: '1: Very Poor' },
    { value: 2, label: '2: Probably Inadequate' },
    { value: 3, label: '3: Adequate' },
    { value: 4, label: '4: Excellent' },
  ],
  friction: [
    { value: 1, label: '1: Problem' },
    { value: 2, label: '2: Potential Problem' },
    { value: 3, label: '3: No Apparent Problem' },
  ],
};

const bradenFormSections: FormSectionConfig[] = [
  {
    id: 'sensory',
    label: 'Sensory Perception',
    type: 'select',
    options: bradenOptions.sensory,
    defaultValue: 4,
    validation: getValidationSchema('select', bradenOptions.sensory),
  },
  {
    id: 'moisture',
    label: 'Moisture',
    type: 'select',
    options: bradenOptions.moisture,
    defaultValue: 4,
    validation: getValidationSchema('select', bradenOptions.moisture),
  },
  {
    id: 'activity',
    label: 'Activity',
    type: 'select',
    options: bradenOptions.activity,
    defaultValue: 4,
    validation: getValidationSchema('select', bradenOptions.activity),
  },
  {
    id: 'mobility',
    label: 'Mobility',
    type: 'select',
    options: bradenOptions.mobility,
    defaultValue: 4,
    validation: getValidationSchema('select', bradenOptions.mobility),
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    type: 'select',
    options: bradenOptions.nutrition,
    defaultValue: 4,
    validation: getValidationSchema('select', bradenOptions.nutrition),
  },
  {
    id: 'friction',
    label: 'Friction & Shear',
    type: 'select',
    options: bradenOptions.friction,
    defaultValue: 3,
    validation: getValidationSchema('select', bradenOptions.friction),
  },
];

export const bradenScaleTool: Tool = {
  id: 'braden_scale',
  name: 'Braden Scale for Predicting Pressure Ulcer Risk',
  acronym: 'Braden Scale',
  description:
    "A tool to assess a patient's risk of developing pressure ulcers. It evaluates six factors: sensory perception, moisture, activity, mobility, nutrition, and friction/shear. Scores range from 6 to 23, with lower scores indicating higher risk.",
  condition: 'Chronic Wounds, Pressure Ulcers',
  keywords: ['braden scale', 'pressure ulcer', 'pressure sore', 'risk assessment'],
  sourceType: 'Clinical Guideline',
  icon: Activity,
  formSections: bradenFormSections,
  calculationLogic: (inputs) => {
    const score = Object.keys(bradenOptions).reduce(
      (acc, key) => acc + (Number(inputs[key]) || 0),
      0,
    );

    let riskLevel = '';
    if (score >= 19) riskLevel = 'No Risk';
    else if (score >= 15) riskLevel = 'Mild Risk';
    else if (score >= 13) riskLevel = 'Moderate Risk';
    else if (score >= 10) riskLevel = 'High Risk';
    else riskLevel = 'Very High Risk';

    const interpretation = `Total Braden Score: ${score} (Range: 6-23). Risk Level: ${riskLevel}.\nRisk Categories: ≤9 Very High; 10-12 High; 13-14 Moderate; 15-18 Mild; ≥19 No Risk.\nLower scores indicate a higher risk for developing pressure ulcers.`;

    return {
      score,
      interpretation,
      details: {
        'Sensory Perception': inputs.sensory,
        Moisture: inputs.moisture,
        Activity: inputs.activity,
        Mobility: inputs.mobility,
        Nutrition: inputs.nutrition,
        'Friction & Shear': inputs.friction,
        'Total Score': score,
        'Risk Category': riskLevel,
      },
    };
  },
  references: [
    'Bergstrom N, Braden BJ, Laguzza A, Holman V. The Braden Scale for Predicting Pressure Sore Risk. Nurs Res. 1987 Jul-Aug;36(4):205-10.',
  ],
};
