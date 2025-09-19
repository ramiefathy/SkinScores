import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { Puzzle } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const fiveDItchOptions: InputOption[] = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

export const fiveDItchTool: Tool = {
  id: 'five_d_itch',
  name: '5-D Itch Scale',
  acronym: '5-D Itch',
  condition: 'Pruritus',
  keywords: [
    '5d itch',
    'pruritus',
    'itch',
    'multidimensional',
    'patient reported',
    'quality of life',
  ],
  description:
    'The 5-D Itch Scale is a multidimensional, patient-reported outcome measure for pruritus. It was developed to capture the intensity, duration, change over time, impact on daily activities, and anatomical distribution of itch, addressing the limitations of unidimensional scales.',
  sourceType: 'Research',
  icon: Puzzle,
  rationale:
    'The 5-D Itch Scale assesses five domains, each scored from 1 (least severe) to 5 (most severe): 1. Duration: Number of days with itch in the past two weeks. 2. Degree: Intensity of itch. 3. Direction: Change in itch over time. 4. Disability: Impact on daily activities (sleep, leisure/social, housework/errands, work/school); the highest score among the four is used. 5. Distribution: Number of body parts affected. The total score is the sum of the five domain scores, ranging from 5 to 25. The scale was developed and validated by Elman et al. in 2010.',
  clinicalPerformance:
    'In the original validation cohort (Elman 2010), the 5-D Itch Scale demonstrated acceptable internal consistency (Cronbach\'s alpha = 0.734) and excellent test-retest reliability (ICC = 0.96, 95% CI: 0.92-0.98, P < 0.0001) measured over a 3-day interval with 50 patients. Subsequent studies in chronic pruritus populations have sometimes reported higher internal consistency values. The instrument correlates strongly with itch severity NRS, Worst Itch NRS, and quality-of-life measures, and is sensitive to longitudinal change over 6-week intervals. Later cross-cultural evaluations (e.g., Cheung 2021) demonstrated comparable performance across ethnic groups, though without establishing population-specific cutoffs. The scale is not diagnostic; sensitivity and specificity are therefore not reported.\n\nValidation and Comparative Studies\nThe 5-D Itch Scale has been validated in 234 patients with chronic pruritus of diverse etiologies, including hepatobiliary disease (n=63), renal failure (n=36), dermatologic disorders (n=56), HIV/AIDS (n=28), and burn injury survivors (n=51). Comparative analyses with other patient-reported measures confirm strong convergent validity. Administration is brief and well tolerated in clinic and research settings. Notably, the 5-D is the first pruritus instrument formally demonstrated to detect changes over time - a critical feature for therapeutic trials.\n\nLimitations and Controversies\nThe instrument depends on patient recall, so responses may be influenced by memory and cultural differences in describing itch. It has limited pediatric validation and may require adaptation for cognitively impaired respondents. Because each domain is weighted equally (simple summation), clinicians should interpret domain-level scores alongside the total to detect nuanced change, especially in mild or waxing-and-waning disease.',
  formSections: [
    {
      id: 'd1_duration',
      label: 'Domain 1: Duration (Total hours itching per day)',
      type: 'select',
      options: [
        { value: 1, label: '1 (<1 hr)' },
        { value: 2, label: '2 (1-3 hrs)' },
        { value: 3, label: '3 (4-6 hrs)' },
        { value: 4, label: '4 (7-12 hrs)' },
        { value: 5, label: '5 (>12 hrs)' },
      ],
      defaultValue: 1,
      validation: getValidationSchema('select', fiveDItchOptions, 1, 5),
    },
    {
      id: 'd2_degree',
      label: 'Domain 2: Degree (Severity of worst itch episode)',
      type: 'select',
      options: [
        { value: 1, label: '1 (Mild)' },
        { value: 2, label: '2 (Mild-Moderate)' },
        { value: 3, label: '3 (Moderate)' },
        { value: 4, label: '4 (Moderate-Severe)' },
        { value: 5, label: '5 (Severe)' },
      ],
      defaultValue: 1,
      validation: getValidationSchema('select', fiveDItchOptions, 1, 5),
    },
    {
      id: 'd3_direction',
      label: 'Domain 3: Direction (Itch getting better or worse over past month)',
      type: 'select',
      options: [
        { value: 1, label: '1 (Much better)' },
        { value: 2, label: '2 (Somewhat better)' },
        { value: 3, label: '3 (No change)' },
        { value: 4, label: '4 (Somewhat worse)' },
        { value: 5, label: '5 (Much worse)' },
      ],
      defaultValue: 3,
      validation: getValidationSchema('select', fiveDItchOptions, 1, 5),
    },
    {
      id: 'd4_disability',
      label: 'Domain 4: Disability (Impact on QoL - sleep, mood, activities)',
      type: 'select',
      options: [
        { value: 1, label: '1 (Not at all)' },
        { value: 2, label: '2 (A little)' },
        { value: 3, label: '3 (Moderately)' },
        { value: 4, label: '4 (A lot)' },
        { value: 5, label: '5 (Very much)' },
      ],
      defaultValue: 1,
      validation: getValidationSchema('select', fiveDItchOptions, 1, 5),
    },
    {
      id: 'd5_distribution',
      label: 'Domain 5: Distribution (Body parts affected)',
      type: 'select',
      options: [
        { value: 1, label: '1 (1-2 parts)' },
        { value: 2, label: '2 (3-5 parts)' },
        { value: 3, label: '3 (6-10 parts)' },
        { value: 4, label: '4 (11-18 parts)' },
        { value: 5, label: '5 (All over/Almost all over)' },
      ],
      defaultValue: 1,
      validation: getValidationSchema('select', fiveDItchOptions, 1, 5),
    },
  ],
  calculationLogic: (inputs) => {
    const d1 = Number(inputs.d1_duration) || 1;
    const d2 = Number(inputs.d2_degree) || 1;
    const d3 = Number(inputs.d3_direction) || 1;
    const d4 = Number(inputs.d4_disability) || 1;
    const d5 = Number(inputs.d5_distribution) || 1;
    const totalScore = d1 + d2 + d3 + d4 + d5;

    const interpretation = `5-D Itch Scale Total Score: ${totalScore} (Range: 5-25). Higher score indicates more severe and impactful pruritus. No universally defined severity bands, used to track change.`;
    return {
      score: totalScore,
      interpretation,
      details: {
        D1_Duration_Score: d1,
        D2_Degree_Score: d2,
        D3_Direction_Score: d3,
        D4_Disability_Score: d4,
        D5_Distribution_Score: d5,
      },
    };
  },
  references: [
    'Elman S, Hynan LS, Gabriel V, Mayo MJ. The 5-D Itch Scale: A New Measure of Pruritus. The British Journal of Dermatology. 2010;162(3):587-93. doi:10.1111/j.1365-2133.2009.09586.x.',
    'Cheung HN, Chan YS, Hsiung NH. Validation of the 5-D Itch Scale in Three Ethnic Groups and Exploring Optimal Cutoff Values Using the Itch Numerical Rating Scale. BioMed Research International. 2021;2021:7640314. doi:10.1155/2021/7640314.',
    'Topp J, Apfelbacher C, Ständer S, Augustin M, Blome C. Measurement Properties of Patient-Reported Outcome Measures for Pruritus: An Updated Systematic Review. The Journal of Investigative Dermatology. 2022;142(2):343-354. doi:10.1016/j.jid.2021.06.032.',
    'Schoch D, Sommer R, Augustin M, Ständer S, Blome C. Patient-Reported Outcome Measures In Pruritus: A Systematic Review of Measurement Properties. The Journal of Investigative Dermatology. 2017;137(10):2069-2077. doi:10.1016/j.jid.2017.05.020.',
    'Patel KR, Singam V, Vakharia PP, et al. Measurement Properties of Three Assessments of Burden Used in Atopic Dermatitis in Adults. The British Journal of Dermatology. 2019;180(5):1083-1089. doi:10.1111/bjd.17243.',
  ],
};
