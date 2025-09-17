import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { HeartPulse } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const dapsaFormSections: FormSectionConfig[] = [
  {
    id: 'dapsa_group',
    title: 'DAPSA Components',
    gridCols: 1,
    inputs: [
      {
        id: 'tender_joints',
        label: 'Tender Joint Count (0-68)',
        type: 'number',
        min: 0,
        max: 68,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 68),
      },
      {
        id: 'swollen_joints',
        label: 'Swollen Joint Count (0-66)',
        type: 'number',
        min: 0,
        max: 66,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 66),
      },
      {
        id: 'patient_pain',
        label: 'Patient Pain Assessment (VAS, 0-10 cm)',
        type: 'number',
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 10),
      },
      {
        id: 'patient_global',
        label: 'Patient Global Assessment of Disease Activity (VAS, 0-10 cm)',
        type: 'number',
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 10),
      },
      {
        id: 'crp',
        label: 'C-Reactive Protein (CRP, mg/dL)',
        type: 'number',
        min: 0,
        defaultValue: 0,
        description: 'Enter CRP in mg/dL. Excluded for cDAPSA.',
        validation: getValidationSchema('number', [], 0),
      },
    ],
  },
];

export const dapsaTool: Tool = {
  id: 'dapsa',
  name: 'Disease Activity in Psoriatic Arthritis (DAPSA)',
  acronym: 'DAPSA',
  description:
    'A tool to measure disease activity in the joint domain of Psoriatic Arthritis. It is a simple sum of five components: tender joint count (68), swollen joint count (66), C-Reactive Protein (CRP), and patient assessments of pain and disease activity (0-10 VAS). A clinical version (cDAPSA) excludes CRP.',
  condition: 'Psoriasis / Psoriatic Arthritis',
  keywords: ['dapsa', 'cdapsa', 'psoriatic arthritis', 'psa', 'disease activity'],
  sourceType: 'Clinical Guideline',
  icon: HeartPulse,
  formSections: dapsaFormSections,
  calculationLogic: (inputs) => {
    const tenderJoints = Number(inputs.tender_joints) || 0;
    const swollenJoints = Number(inputs.swollen_joints) || 0;
    const crp = Number(inputs.crp) || 0;
    const patientPain = Number(inputs.patient_pain) || 0;
    const patientGlobal = Number(inputs.patient_global) || 0;

    const dapsaScore = tenderJoints + swollenJoints + crp + patientPain + patientGlobal;
    const cDapsaScore = tenderJoints + swollenJoints + patientPain + patientGlobal;

    let dapsaCategory = '';
    if (dapsaScore <= 4) dapsaCategory = 'Remission';
    else if (dapsaScore <= 14) dapsaCategory = 'Low Disease Activity';
    else if (dapsaScore <= 28) dapsaCategory = 'Moderate Disease Activity';
    else dapsaCategory = 'High Disease Activity';

    let cDapsaCategory = '';
    if (cDapsaScore <= 4) cDapsaCategory = 'Remission';
    else if (cDapsaScore <= 13) cDapsaCategory = 'Low Disease Activity';
    else if (cDapsaScore <= 27) cDapsaCategory = 'Moderate Disease Activity';
    else cDapsaCategory = 'High Disease Activity';

    const interpretation =
      `DAPSA Score: ${dapsaScore.toFixed(1)} (${dapsaCategory}).\n` +
      `Clinical DAPSA (cDAPSA) Score: ${cDapsaScore.toFixed(1)} (${cDapsaCategory}).`;

    return {
      score: dapsaScore.toFixed(1),
      interpretation,
      details: {
        'DAPSA Score': dapsaScore.toFixed(1),
        'DAPSA Category': dapsaCategory,
        'cDAPSA Score': cDapsaScore.toFixed(1),
        'cDAPSA Category': cDapsaCategory,
        'Tender Joints (68)': tenderJoints,
        'Swollen Joints (66)': swollenJoints,
        'Patient Pain (0-10)': patientPain,
        'Patient Global (0-10)': patientGlobal,
        'CRP (mg/dL)': crp,
      },
    };
  },
  references: [
    'Schoels M, Aletaha D, Alasti F, Smolen JS. Disease activity in psoriatic arthritis (PsA): a comparison of the composite indices. Ann Rheum Dis. 2010;69(8):1441-7.',
    'Schoels MM, Aletaha D, Funovits J, et al. Application of the DAREA/DAPSA score for assessment of disease activity in psoriatic arthritis. Ann Rheum Dis. 2010;69(8):1441-7.',
    'Schoels M, et al. Disease activity in psoriatic arthritis (PsA): a comparison of the composite indices. Ann Rheum Dis 2016;75:811–818.',
  ],
};
