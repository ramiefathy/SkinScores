import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { ListChecks } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const sliccOptions: InputOption[] = [
  { value: 1, label: 'Yes' },
  { value: 0, label: 'No' },
];

const sliccClinicalCriteria: InputConfig[] = [
  {
    id: 'acute_cutaneous_lupus',
    label: 'Acute Cutaneous Lupus',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'chronic_cutaneous_lupus',
    label: 'Chronic Cutaneous Lupus',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'oral_ulcers',
    label: 'Oral or Nasal Ulcers',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'nonscarring_alopecia',
    label: 'Nonscarring Alopecia',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'synovitis',
    label: 'Synovitis involving ≥2 joints',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'serositis',
    label: 'Serositis',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'renal',
    label: 'Renal (Urine protein/creatinine ratio or RBC casts)',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'neurologic',
    label: 'Neurologic (Seizures, psychosis, etc.)',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'hemolytic_anemia',
    label: 'Hemolytic Anemia',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'leukopenia',
    label: 'Leukopenia or Lymphopenia',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'thrombocytopenia',
    label: 'Thrombocytopenia',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
];

const sliccImmunologicCriteria: InputConfig[] = [
  {
    id: 'ana',
    label: 'ANA level above lab reference range',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'anti_dsdna',
    label: 'Anti-dsDNA antibody level above lab reference range',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'anti_sm',
    label: 'Anti-Sm',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'antiphospholipid_antibody',
    label: 'Antiphospholipid Antibody positive',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'low_complement',
    label: 'Low Complement (C3, C4, or CH50)',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
  {
    id: 'direct_coombs',
    label: "Direct Coombs' Test (in absence of hemolytic anemia)",
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  },
];

export const sliccCriteriaTool: Tool = {
  id: 'slicc_criteria',
  name: 'SLICC Classification Criteria for SLE',
  acronym: 'SLICC Criteria',
  description:
    'Classification criteria for Systemic Lupus Erythematosus (SLE), primarily for research. Diagnosis requires at least 4 criteria (with at least one clinical and one immunologic) OR biopsy-proven lupus nephritis with positive ANA or anti-dsDNA.',
  condition: 'Lupus',
  keywords: ['slicc', 'lupus', 'sle', 'classification criteria', 'lupus nephritis', 'ana', 'dsdna'],
  sourceType: 'Clinical Guideline',
  icon: ListChecks,
  formSections: [
    {
      id: 'slicc_biopsy_pathway',
      label: 'Is there biopsy-proven lupus nephritis with positive ANA or anti-dsDNA?',
      type: 'select',
      options: sliccOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', sliccOptions),
    },
    {
      id: 'slicc_clinical_group',
      title: 'Clinical Criteria (Select all that apply)',
      gridCols: 1,
      inputs: sliccClinicalCriteria,
    },
    {
      id: 'slicc_immunologic_group',
      title: 'Immunologic Criteria (Select all that apply)',
      gridCols: 1,
      inputs: sliccImmunologicCriteria,
    },
  ],
  calculationLogic: (inputs) => {
    const biopsyPathwayMet = Number(inputs.slicc_biopsy_pathway) === 1;

    const clinicalCount = sliccClinicalCriteria.reduce(
      (sum, crit) => sum + (Number(inputs[crit.id]) || 0),
      0,
    );
    const immunologicCount = sliccImmunologicCriteria.reduce(
      (sum, crit) => sum + (Number(inputs[crit.id]) || 0),
      0,
    );

    const totalCriteria = clinicalCount + immunologicCount;
    const criteriaPathwayMet = totalCriteria >= 4 && clinicalCount >= 1 && immunologicCount >= 1;

    const meetsCriteria = biopsyPathwayMet || criteriaPathwayMet;
    const score = meetsCriteria ? 1 : 0; // 1 for Met, 0 for Not Met

    let interpretation = `SLICC Criteria Status: ${meetsCriteria ? 'Met' : 'Not Met'}.\n`;
    if (biopsyPathwayMet) {
      interpretation += 'Classification met via biopsy-proven lupus nephritis pathway.';
    } else {
      interpretation += `Classification via criteria count: ${totalCriteria} total criteria met (Clinical: ${clinicalCount}, Immunologic: ${immunologicCount}).\n`;
      interpretation += `Requires >= 4 total, with >= 1 clinical AND >= 1 immunologic.`;
    }
    interpretation += `\nPerformance: Sensitivity ~97%, Specificity ~84%.`;

    return {
      score,
      interpretation,
      details: {
        'Biopsy Pathway Met': biopsyPathwayMet ? 'Yes' : 'No',
        'Criteria Pathway Met': criteriaPathwayMet ? 'Yes' : 'No',
        'Clinical Criteria Count': clinicalCount,
        'Immunologic Criteria Count': immunologicCount,
        'Total Criteria Count': totalCriteria,
        'Overall Criteria Met': meetsCriteria ? 'Yes' : 'No',
      },
    };
  },
  references: [
    'Petri M, Orbai AM, Alarcón GS, et al. Derivation and validation of the Systemic Lupus International Collaborating Clinics classification criteria for systemic lupus erythematosus. Arthritis Rheum. 2012;64(8):2677-86.',
  ],
};
