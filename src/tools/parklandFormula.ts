import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { Droplets } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const parklandFormSections: FormSectionConfig[] = [
  {
    id: 'parkland_inputs',
    title: 'Parkland Formula Inputs',
    gridCols: 1,
    inputs: [
      {
        id: 'weight_kg',
        label: 'Patient Weight (kg)',
        type: 'number',
        min: 0,
        defaultValue: 70,
        validation: getValidationSchema('number', [], 0),
      },
      {
        id: 'tbsa',
        label: 'Total Body Surface Area Burned (%)',
        type: 'number',
        min: 0,
        max: 100,
        defaultValue: 20,
        description: 'Only include partial- (2nd degree) and full-thickness (3rd degree) burns.',
        validation: getValidationSchema('number', [], 0, 100),
      },
    ],
  },
];

export const parklandFormulaTool: Tool = {
  id: 'parkland_formula',
  name: 'Parkland Formula for Burn Fluid Resuscitation',
  acronym: 'Parkland Formula',
  description:
    'A formula to estimate the initial 24-hour fluid requirement for severe burn patients (>20% TBSA in adults, >10% in children). Formula: Total Fluid (mL) = 4 mL × Body Weight (kg) × %TBSA Burned.',
  condition: 'Burns',
  keywords: ['parkland formula', 'burns', 'fluid resuscitation', 'tbsa', 'critical care'],
  sourceType: 'Clinical Guideline',
  icon: Droplets,
  formSections: parklandFormSections,
  calculationLogic: (inputs) => {
    const weight = Number(inputs.weight_kg) || 0;
    const tbsa = Number(inputs.tbsa) || 0;

    const totalFluidMl = 4 * weight * tbsa;
    const first8hFluid = totalFluidMl / 2;
    const next16hFluid = totalFluidMl / 2;
    const first8hRate = first8hFluid / 8;
    const next16hRate = next16hFluid / 16;

    const score = parseFloat(totalFluidMl.toFixed(1)); // Use total fluid as the primary 'score'

    const interpretation =
      `Total fluid required in first 24 hours: ${totalFluidMl.toFixed(1)} mL.\n` +
      `First 8 hours (from time of injury, NOT admission): ${first8hFluid.toFixed(1)} mL (at ${first8hRate.toFixed(1)} mL/hr).\n` +
      `Next 16 hours: ${next16hFluid.toFixed(1)} mL (at ${next16hRate.toFixed(1)} mL/hr).\n` +
      `This is an estimate; fluid resuscitation should be titrated based on clinical response (e.g., urine output ~0.5-1 mL/kg/h in adults).`;

    return {
      score,
      interpretation,
      details: {
        'Total Fluid in 24h (mL)': parseFloat(totalFluidMl.toFixed(1)),
        'Fluid in First 8h (mL)': parseFloat(first8hFluid.toFixed(1)),
        'Infusion Rate First 8h (mL/hr)': parseFloat(first8hRate.toFixed(1)),
        'Fluid in Next 16h (mL)': parseFloat(next16hFluid.toFixed(1)),
        'Infusion Rate Next 16h (mL/hr)': parseFloat(next16hRate.toFixed(1)),
      },
    };
  },
  references: [
    'Baxter CR, Shires T. Physiological response to crystalloid resuscitation of severe burns. Ann N Y Acad Sci. 1968;150(3):874-94.',
  ],
};
