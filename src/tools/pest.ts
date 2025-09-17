import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const pestQuestionOptions: InputOption[] = [
  { value: 1, label: 'Yes' },
  { value: 0, label: 'No' },
];

const pestFormSections: FormSectionConfig[] = [
  {
    id: 'pest_q1_swollen_joint',
    label: 'Have you ever had a swollen joint (or joints)?',
    type: 'select',
    options: pestQuestionOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', pestQuestionOptions, 0, 1),
  },
  {
    id: 'pest_q2_doctor_arthritis',
    label: 'Has a doctor ever told you that you have arthritis?',
    type: 'select',
    options: pestQuestionOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', pestQuestionOptions, 0, 1),
  },
  {
    id: 'pest_q3_nail_pits',
    label: 'Do your fingernails or toenails have holes or pits?',
    type: 'select',
    options: pestQuestionOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', pestQuestionOptions, 0, 1),
  },
  {
    id: 'pest_q4_heel_pain',
    label: 'Have you had pain in your heel?',
    type: 'select',
    options: pestQuestionOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', pestQuestionOptions, 0, 1),
  },
  {
    id: 'pest_q5_dactylitis',
    label:
      'Have you had a finger or toe that was completely swollen and painful for no apparent reason?',
    type: 'select',
    options: pestQuestionOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', pestQuestionOptions, 0, 1),
  },
];

export const pestTool: Tool = {
  id: 'pest',
  name: 'Psoriasis Epidemiology Screening Tool',
  acronym: 'PEST',
  description:
    'The Psoriasis Epidemiology Screening Tool (PEST) was developed to address the underdiagnosis of psoriatic arthritis (PsA) among patients with psoriasis, particularly in non-rheumatology settings.',
  condition: 'Psoriasis / Psoriatic Arthritis',
  keywords: [
    'pest',
    'psoriasis',
    'psoriatic arthritis',
    'screening',
    'questionnaire',
    'arthritis',
    'nail pitting',
  ],
  sourceType: 'Research',
  icon: ClipboardList,
  rationale:
    'The tool was designed to be simple, rapid, and feasible for use by dermatologists and primary care providers to identify patients who may require rheumatologic evaluation. The PEST consists of five yes/no questions and a manikin diagram for patients to indicate joint involvement. Each "yes" response on the PEST scores 1 point, for a total possible score of 0 to 5. A score of ≥3 is considered suggestive of PsA and warrants further rheumatologic assessment.',
  clinicalPerformance:
    "The PEST has demonstrated high sensitivity and moderate specificity.\nOriginal Development: Sensitivity of 0.94 and specificity of 0.78.\nJapanese Cohort: Sensitivity of 93.1% and specificity of 78.9%.\nBrazilian Portuguese Validation: Sensitivity of 84.6% and specificity of 63.3%, with an area under the ROC curve of 0.81 and a Cronbach's alpha of 0.72.\nPediatric Pilot Study: Sensitivity and specificity of 100% for juvenile PsA, outperforming the Early Arthritis for Psoriatic Patients (EARP) questionnaire.\n\nIn primary care, the PEST had a sensitivity of 0.68 and specificity of 0.71, outperforming the PASE and EARP in terms of balanced accuracy.\n\nValidation and Comparative Studies\nThe PEST has been validated in multiple languages and populations, including Japanese and Brazilian Portuguese cohorts, confirming its psychometric properties and clinical utility. Comparative studies in European and North American dermatology clinics have shown that the PEST, PASQ, and ToPAS are all useful for screening, with the PEST offering a favorable trade-off between sensitivity and specificity.\n\nReal-World Implementation\nThe PEST is widely used in dermatology clinics and is increasingly being integrated into electronic health record (EHR) systems to enable automated screening. This integration has been shown to increase clinician adoption and sustained use with minimal impact on visit duration. The PEST is brief, easy to administer, and correlates with patient-reported quality of life, as higher PEST scores are associated with lower Dermatology Life Quality Index (DLQI) scores. Barriers include the potential for over-referral and the need for standardized follow-up protocols.",
  formSections: pestFormSections,
  calculationLogic: (inputs) => {
    const score =
      (Number(inputs.pest_q1_swollen_joint) || 0) +
      (Number(inputs.pest_q2_doctor_arthritis) || 0) +
      (Number(inputs.pest_q3_nail_pits) || 0) +
      (Number(inputs.pest_q4_heel_pain) || 0) +
      (Number(inputs.pest_q5_dactylitis) || 0);

    let interpretation = `PEST Score: ${score} (Range: 0-5). `;
    let recommendation = '';

    if (score >= 3) {
      interpretation +=
        'Suggests an elevated risk of PsA. Consider referral to rheumatology for formal PsA evaluation.';
      recommendation = 'Refer to rheumatology';
    } else {
      interpretation +=
        'Low likelihood of PsA. Continue routine dermatology follow-up and repeat screening periodically.';
      recommendation = 'Continue routine dermatology screening';
    }

    return {
      score,
      interpretation,
      details: {
        Total_PEST_Score: score,
        Referral_Recommendation: recommendation,
        Q1_Swollen_Joint: inputs.pest_q1_swollen_joint,
        Q2_Doctor_Arthritis: inputs.pest_q2_doctor_arthritis,
        Q3_Nail_Pits: inputs.pest_q3_nail_pits,
        Q4_Heel_Pain: inputs.pest_q4_heel_pain,
        Q5_Dactylitis: inputs.pest_q5_dactylitis,
      },
    };
  },
  references: [
    'Helliwell PS. Psoriasis Epidemiology Screening Tool (PEST): A Report From the GRAPPA 2009 Annual Meeting. The Journal of Rheumatology. 2011;38(3):551-2. doi:10.3899/jrheum.101119.',
    'Setoyama A, Sawada Y, Saito-Sasaki N, et al. Psoriasis Epidemiology Screening Tool (PEST) Is Useful for the Detection of Psoriatic Arthritis in the Japanese Population. Scientific Reports. 2021;11(1):16146. doi:10.1038/s41598-021-95620-4.',
    'Mazzotti NG, Palominos PE, Bredemeier M, Kohem CL, Cestari TF. Cross-Cultural Validation and Psychometric Properties of the Brazilian Portuguese Version of the Psoriasis Epidemiology Screening Tool (PEST-bp). Archives of Dermatological Research. 2020;312(3):197-206. doi:10.1007/s00403-019-02013-9.',
    'Gavra H, Tirosh I, Spielman S, et al. Validation of the Psoriasis Epidemiology Screening Tool (PEST) and the New Early Arthritis for Psoriatic Patients (EARP) in Pediatric Population: Pilot Study. Clinical Rheumatology. 2022;41(4):1125-1130. doi:10.1007/s10067-021-06009-7.',
    'Mease PJ, Gladman DD, Helliwell P, et al. Comparative Performance of Psoriatic Arthritis Screening Tools in Patients With Psoriasis in European/North American Dermatology Clinics. Journal of the American Academy of Dermatology. 2014;71(4):649-55. doi:10.1016/j.jaad.2014.05.010.',
    'Karreman MC, Weel AEAM, van der Ven M, et al. Performance of Screening Tools for Psoriatic Arthritis: A Cross-Sectional Study in Primary Care. Rheumatology (Oxford, England). 2017;56(4):597-602. doi:10.1093/rheumatology/kew410.',
    'Zundell MP, Woodbury MJ, Lee K, et al. Report of the Skin Research Workgroups From the IDEOM Breakout at the GRAPPA 2022 Annual Meeting. The Journal of Rheumatology. 2023;50(Suppl 2):47-50. doi:10.3899/jrheum.2023-0528.',
    'Ball GD, Yee D, Zhang AJ, et al. Report of the IDEOM Meeting Adjacent to the GRAPPA 2023 Annual Meeting. The Journal of Rheumatology. 2024;51(Suppl 2):16-18. doi:10.3899/jrheum.2024-0327.',
    'Coylewright M, Keevil JG, Xu K, et al. Pragmatic Study of Clinician Use of a Personalized Patient Decision Aid Integrated Into the Electronic Health Record: An 8-Year Experience. Telemedicine Journal and E-Health : The Official Journal of the American Telemedicine Association. 2020;26(5):597-602. doi:10.1089/tmj.2019.0112.',
  ],
};
