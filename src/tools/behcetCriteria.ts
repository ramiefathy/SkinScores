import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { ListChecks } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const behcetOptions: InputOption[] = [
  { value: 1, label: 'Yes' },
  { value: 0, label: 'No' },
];

const behcetFormSections: FormSectionConfig[] = [
  {
    id: 'behcet_required',
    label: 'Recurrent oral ulceration (≥3 times in one 12-month period)',
    type: 'select',
    options: behcetOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', behcetOptions),
  },
  {
    id: 'behcet_additional_group',
    title: 'Plus at least two of the following:',
    gridCols: 1,
    inputs: [
      {
        id: 'behcet_genital',
        label: 'Recurrent genital ulceration',
        type: 'select',
        options: behcetOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', behcetOptions),
      },
      {
        id: 'behcet_eye',
        label: 'Eye lesions (e.g., uveitis, retinal vasculitis)',
        type: 'select',
        options: behcetOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', behcetOptions),
      },
      {
        id: 'behcet_skin',
        label: 'Skin lesions (e.g., erythema nodosum, pseudofolliculitis, papulopustules)',
        type: 'select',
        options: behcetOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', behcetOptions),
      },
      {
        id: 'behcet_pathergy',
        label: 'Positive pathergy test',
        type: 'select',
        options: behcetOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', behcetOptions),
      },
    ],
  },
];

export const behcetCriteriaTool: Tool = {
  id: 'behcet_criteria',
  name: "Behçet's Disease International Study Group Criteria",
  acronym: "ISG Criteria for Behçet's",
  description:
    'Diagnostic/classification criteria for Behçet’s disease. Requires recurrent oral ulceration (at least 3 times in 12 months) plus any two of the following: recurrent genital ulceration, eye lesions, skin lesions, or a positive pathergy test.',
  condition: 'Vasculitis',
  keywords: ['behcet', "behcet's", 'vasculitis', 'diagnostic criteria', 'pathergy', 'uveitis'],
  sourceType: 'Clinical Guideline',
  icon: ListChecks,
  formSections: behcetFormSections,
  calculationLogic: (inputs) => {
    const oralUlceration = Number(inputs.behcet_required) || 0;
    const additionalCriteriaCount =
      (Number(inputs.behcet_genital) || 0) +
      (Number(inputs.behcet_eye) || 0) +
      (Number(inputs.behcet_skin) || 0) +
      (Number(inputs.behcet_pathergy) || 0);

    const meetsCriteria = oralUlceration === 1 && additionalCriteriaCount >= 2;
    const score = meetsCriteria ? 1 : 0; // 1 for Met, 0 for Not Met

    let interpretation = `Diagnosis of Behçet's Disease: ${meetsCriteria ? 'Criteria Met' : 'Criteria Not Met'}.\n`;
    interpretation += `Requires recurrent oral ulceration (Present: ${oralUlceration === 1 ? 'Yes' : 'No'}) AND at least 2 other criteria (Present: ${additionalCriteriaCount}).\n`;
    interpretation += `Performance: Sensitivity ~91%, Specificity ~96%.`;

    return {
      score,
      interpretation,
      details: {
        'Recurrent oral ulceration': oralUlceration === 1 ? 'Present' : 'Absent',
        'Recurrent genital ulceration':
          (Number(inputs.behcet_genital) || 0) === 1 ? 'Present' : 'Absent',
        'Eye lesions': (Number(inputs.behcet_eye) || 0) === 1 ? 'Present' : 'Absent',
        'Skin lesions': (Number(inputs.behcet_skin) || 0) === 1 ? 'Present' : 'Absent',
        'Positive pathergy test':
          (Number(inputs.behcet_pathergy) || 0) === 1 ? 'Present' : 'Absent',
        'Additional Criteria Count': additionalCriteriaCount,
        'Diagnosis Status': meetsCriteria ? 'Criteria Met' : 'Criteria Not Met',
      },
    };
  },
  references: [
    "International Study Group for Behçet's Disease. Criteria for diagnosis of Behçet's disease. Lancet. 1990;335(8697):1078-80.",
  ],
};
