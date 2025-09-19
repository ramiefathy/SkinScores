import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { Activity } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const aectResponseOptions: InputOption[] = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'A little' },
  { value: 2, label: 'Somewhat' },
  { value: 3, label: 'A lot' },
  { value: 4, label: 'Very much/Completely' },
];

const frequencyOptions: InputOption[] = [
  { value: 4, label: 'Never' },
  { value: 3, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 1, label: 'Often' },
  { value: 0, label: 'Very often' },
];

const unpredictabilityOptions: InputOption[] = [
  { value: 4, label: 'Not unpredictable at all' },
  { value: 3, label: 'A little unpredictable' },
  { value: 2, label: 'Somewhat unpredictable' },
  { value: 1, label: 'Very unpredictable' },
  { value: 0, label: 'Extremely unpredictable' },
];

const controlOptions: InputOption[] = [
  { value: 0, label: 'Not controlled at all' },
  { value: 1, label: 'Poorly controlled' },
  { value: 2, label: 'Somewhat controlled' },
  { value: 3, label: 'Well controlled' },
  { value: 4, label: 'Completely controlled' },
];

const aectFormSections: FormSectionConfig[] = [
  {
    id: 'aect_q1',
    label: 'Q1: Over the past 4 weeks, how often have you had angioedema attacks?',
    type: 'select',
    options: frequencyOptions,
    defaultValue: 2,
    validation: getValidationSchema('select', frequencyOptions),
    description: 'Frequency of angioedema episodes in the past 4 weeks.',
  } as InputConfig,
  {
    id: 'aect_q2',
    label: 'Q2: Over the past 4 weeks, how much has angioedema affected your quality of life?',
    type: 'select',
    options: aectResponseOptions,
    defaultValue: 2,
    validation: getValidationSchema('select', aectResponseOptions),
    description: 'Impact on daily activities and overall quality of life.',
  } as InputConfig,
  {
    id: 'aect_q3',
    label: 'Q3: Over the past 4 weeks, how unpredictable have your angioedema attacks been?',
    type: 'select',
    options: unpredictabilityOptions,
    defaultValue: 2,
    validation: getValidationSchema('select', unpredictabilityOptions),
    description: 'Predictability of when attacks will occur.',
  } as InputConfig,
  {
    id: 'aect_q4',
    label: 'Q4: Over the past 4 weeks, how well has your angioedema been controlled by your therapy?',
    type: 'select',
    options: controlOptions,
    defaultValue: 2,
    validation: getValidationSchema('select', controlOptions),
    description: 'Effectiveness of current treatment in controlling symptoms.',
  } as InputConfig,
];

export const aectTool: Tool = {
  id: 'aect',
  name: 'Angioedema Control Test',
  acronym: 'AECT',
  condition: 'Recurrent Angioedema',
  keywords: [
    'aect',
    'angioedema',
    'control test',
    'hereditary angioedema',
    'hae',
    'bradykinin',
    'histamine',
    'disease control',
  ],
  description:
    'The AECT is a validated 4-item patient-reported outcome measure that assesses disease control in patients with recurrent angioedema. It evaluates attack frequency, quality of life impact, unpredictability, and treatment effectiveness over the past 4 weeks.',
  sourceType: 'Research',
  icon: Activity,
  rationale:
    '**Purpose:** First validated tool specifically for assessing angioedema control\n\n**The 4 AECT Domains:**\n1. **Frequency** of angioedema attacks\n2. **Quality of life** impairment\n3. **Unpredictability** of attacks\n4. **Treatment effectiveness**\n\n**Time Frame:** 4-week recall period (3-month version also available)\n\n**Score Range:** 0-16 points\n- Higher scores = Better disease control\n- 16 points = Complete control\n- 0 points = Poor control\n\n**Clinical Utility:**\n- Quick assessment (<2 minutes)\n- Guides treatment decisions\n- Monitors treatment response\n- Standardized across providers\n\n**Applicable to:**\n- Hereditary angioedema (HAE)\n- Acquired angioedema\n- Idiopathic recurrent angioedema\n- ACE inhibitor-induced angioedema (chronic)',
  clinicalPerformance:
    'The AECT demonstrates excellent psychometric properties with Cronbach\'s alpha >0.85 (excellent internal consistency) and intraclass correlation coefficient >0.9 (excellent test-retest reliability). The primary cutoff value of ≥10 points for well-controlled disease shows 76% sensitivity and 84% specificity, providing optimal balance for clinical decision-making. The minimal clinically important difference (MCID) is 3 points, helping clinicians assess meaningful treatment response. The tool shows high convergent validity with disease control anchors, angioedema frequency measures, and quality of life instruments (AE-QoL). It successfully discriminates between patients with different levels of disease control (known-groups validity). International validation has been completed, including Chinese populations. The AECT complements other tools: while AAS measures disease activity (symptoms) and AE-QoL measures quality of life impact, AECT uniquely measures disease control.',
  formSections: aectFormSections,
  calculationLogic: (inputs) => {
    const q1 = Number(inputs.aect_q1) || 0;
    const q2 = Number(inputs.aect_q2) || 0;
    const q3 = Number(inputs.aect_q3) || 0;
    const q4 = Number(inputs.aect_q4) || 0;

    const totalScore = q1 + q2 + q3 + q4;

    const controlStatus = totalScore >= 10 ? 'Well-controlled' : 'Poorly controlled';

    const interpretation = `AECT Score: ${totalScore} (Range: 0-16). Disease Control: ${controlStatus}.

**Score Interpretation:**
- ≥10 points: Well-controlled angioedema
- <10 points: Poorly controlled angioedema

**Clinical Significance:**
- 3-point improvement = Minimal clinically important difference (MCID)
- Higher scores indicate better disease control
- Score 16 = Complete disease control

**Clinical Actions Based on Score:**
${totalScore >= 10
  ? '- Continue current treatment regimen\n- Monitor at regular intervals\n- Consider dose optimization if score 10-12'
  : '- Review and optimize current therapy\n- Consider treatment escalation\n- Evaluate adherence and triggers\n- Consider prophylactic therapy if not already prescribed'}

**Note:** AECT measures disease control (how well managed), complementing AAS (disease activity) and AE-QoL (quality of life impact).`;

    return {
      score: totalScore,
      interpretation,
      details: {
        'Q1_Frequency': q1,
        'Q2_Quality_of_Life': q2,
        'Q3_Unpredictability': q3,
        'Q4_Treatment_Control': q4,
        'Total_AECT_Score': totalScore,
        'Control_Status': controlStatus,
        'Well_Controlled_Threshold': '≥10',
        'MCID': '3 points',
      },
    };
  },
  references: [
    'Weller K, Donoso T, Magerl M, et al. Development of the Angioedema Control Test - A patient-reported outcome measure that assesses disease control in patients with recurrent angioedema. Allergy. 2020;75(3):695-706.',
    'Weller K, Maurer M, Fridman M, et al. Validation of the Angioedema Control Test (AECT)-A Patient-Reported Outcome Instrument for Assessing Angioedema Control. J Allergy Clin Immunol Pract. 2020;8(6):2050-2057.',
    'Weller K, Groffik A, Magerl M, et al. Sensitivity to change and minimal clinically important difference of the angioedema control test. Clin Exp Allergy. 2023;53(10):1053-1061.',
    'Maurer M, Magerl M, Betschel S, et al. The international WAO/EAACI guideline for the management of hereditary angioedema - The 2021 revision and update. Allergy. 2022;77(7):1961-1990.',
    'Buttgereit T, Vera C, Weller K, et al. Comparison of the Angioedema Control Test (AECT) and the Angioedema Quality of Life Questionnaire (AE-QoL) for assessing disease control in patients with hereditary angioedema. J Allergy Clin Immunol Pract. 2022;10(8):2110-2117.',
  ],
};