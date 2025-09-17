import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from './types';
import { ListChecks } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const yesNoOptions: InputOption[] = [
  { value: 1, label: 'Yes' },
  { value: 0, label: 'No' },
];

const casparFormSections: FormSectionConfig[] = [
  {
    id: 'caspar_entry',
    label: 'Does the patient have inflammatory articular disease (joint, spine, or entheseal)?',
    type: 'select',
    options: yesNoOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', yesNoOptions),
  },
  {
    id: 'caspar_criteria_group',
    title: 'CASPAR Criteria (score >= 3 needed)',
    gridCols: 1,
    inputs: [
      {
        id: 'current_psoriasis',
        label: 'Current Psoriasis (2 points)',
        type: 'select',
        options: yesNoOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', yesNoOptions),
      },
      {
        id: 'personal_hx_psoriasis',
        label: 'Personal History of Psoriasis (1 point)',
        type: 'select',
        options: yesNoOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', yesNoOptions),
      },
      {
        id: 'family_hx_psoriasis',
        label: 'Family History of Psoriasis (1 point)',
        type: 'select',
        options: yesNoOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', yesNoOptions),
      },
      {
        id: 'nail_lesions',
        label: 'Nail lesions (onycholysis, pitting, hyperkeratosis) (1 point)',
        type: 'select',
        options: yesNoOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', yesNoOptions),
      },
      {
        id: 'rf_negative',
        label: 'Negative rheumatoid factor (1 point)',
        type: 'select',
        options: yesNoOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', yesNoOptions),
      },
      {
        id: 'dactylitis',
        label: 'Dactylitis (current or past) (1 point)',
        type: 'select',
        options: yesNoOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', yesNoOptions),
      },
      {
        id: 'radiological_evidence',
        label: 'Radiological evidence of juxta-articular new bone formation (1 point)',
        type: 'select',
        options: yesNoOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', yesNoOptions),
      },
    ],
  },
];

export const casparCriteriaTool: Tool = {
  id: 'caspar_criteria',
  name: 'CASPAR Criteria for Psoriatic Arthritis',
  acronym: 'CASPAR',
  description:
    'Classification criteria to identify Psoriatic Arthritis (PsA) in research and clinical studies. Requires inflammatory articular disease plus a score of at least 3 from five categories: psoriasis, nail lesions, negative RF, dactylitis, and radiological evidence.',
  condition: 'Psoriasis / Psoriatic Arthritis',
  keywords: [
    'caspar',
    'psoriatic arthritis',
    'psa',
    'classification criteria',
    'dactylitis',
    'nail psoriasis',
  ],
  sourceType: 'Clinical Guideline',
  icon: ListChecks,
  formSections: casparFormSections,
  calculationLogic: (inputs) => {
    const entryCriterion = Number(inputs.caspar_entry) === 1;

    let psoriasisScore = 0;
    if (Number(inputs.current_psoriasis)) {
      psoriasisScore = 2;
    } else if (Number(inputs.personal_hx_psoriasis) || Number(inputs.family_hx_psoriasis)) {
      psoriasisScore = 1;
    }

    const nailScore = Number(inputs.nail_lesions) || 0;
    const rfScore = Number(inputs.rf_negative) || 0;
    const dactylitisScore = Number(inputs.dactylitis) || 0;
    const radioScore = Number(inputs.radiological_evidence) || 0;

    const totalScore = psoriasisScore + nailScore + rfScore + dactylitisScore + radioScore;
    const meetsCriteria = entryCriterion && totalScore >= 3;
    const score = meetsCriteria ? 1 : 0; // 1 for Met, 0 for Not Met

    let interpretation = `CASPAR Criteria Status: ${meetsCriteria ? 'Met' : 'Not Met'}.\n`;
    interpretation += `Entry criterion (inflammatory articular disease) is ${entryCriterion ? 'MET' : 'NOT MET'}.\n`;
    interpretation += `Score from other criteria: ${totalScore} (Requires ≥3).\n`;
    if (meetsCriteria) {
      interpretation +=
        'The criteria for Psoriatic Arthritis are met (Sensitivity ~91.4%, Specificity ~98.7%).';
    } else {
      interpretation += 'The criteria for Psoriatic Arthritis are not met.';
    }

    return {
      score,
      interpretation,
      details: {
        'Inflammatory Articular Disease Present': entryCriterion ? 'Yes' : 'No',
        'Psoriasis Score': psoriasisScore,
        'Nail Lesions Score': nailScore,
        'Negative RF Score': rfScore,
        'Dactylitis Score': dactylitisScore,
        'Radiological Evidence Score': radioScore,
        'Total Score': totalScore,
        'Criteria Met': meetsCriteria ? 'Yes' : 'No',
      },
    };
  },
  references: [
    'Taylor W, Gladman D, Helliwell P, et al. Classification criteria for psoriatic arthritis: development of new criteria from a large international study. Arthritis Rheum. 2006;54(8):2665-73.',
  ],
};
