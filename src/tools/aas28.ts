import type { Tool, InputConfig, FormSectionConfig, InputOption } from './types';
import { Calendar } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const activityOptions: InputOption[] = [
  { value: 0, label: '0 - None' },
  { value: 1, label: '1 - Mild (present but not bothersome)' },
  { value: 2, label: '2 - Moderate (bothersome but not disabling)' },
  { value: 3, label: '3 - Severe (disabling, unable to perform activities)' },
];

const performanceOptions: InputOption[] = [
  { value: 0, label: '0 - None' },
  { value: 1, label: '1 - Mild impairment' },
  { value: 2, label: '2 - Moderate impairment' },
  { value: 3, label: '3 - Severe impairment' },
];

const discomfortOptions: InputOption[] = [
  { value: 0, label: '0 - None' },
  { value: 1, label: '1 - Mild' },
  { value: 2, label: '2 - Moderate' },
  { value: 3, label: '3 - Severe' },
];

const disfigurementOptions: InputOption[] = [
  { value: 0, label: '0 - None' },
  { value: 1, label: '1 - Mild (only self-noticed)' },
  { value: 2, label: '2 - Moderate (noticed by others)' },
  { value: 3, label: '3 - Severe (very obvious to others)' },
];

const durationOptions: InputOption[] = [
  { value: 0, label: '0 - No swelling' },
  { value: 1, label: '1 - <6 hours' },
  { value: 2, label: '2 - 6-24 hours' },
  { value: 3, label: '3 - >24 hours' },
];

// Generate form sections for 28 days of daily assessments
const generateDailyFormSections = (): FormSectionConfig[] => {
  const sections: FormSectionConfig[] = [];

  // Instructions section
  sections.push({
    id: 'instructions',
    label: 'Instructions',
    type: 'text',
    description: 'Complete this assessment daily for 28 consecutive days. Score each day based on the most severe angioedema symptoms experienced in the past 24 hours. If no angioedema occurred on a given day, score all items as 0 for that day.',
  } as InputConfig);

  // Generate sections for each day
  for (let day = 1; day <= 28; day++) {
    const dayPrefix = `day${day}`;

    sections.push({
      id: `${dayPrefix}_activity`,
      label: `Day ${day}: Interference with Daily Activities`,
      type: 'select',
      options: activityOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', activityOptions),
      description: day === 1 ? 'How much did angioedema interfere with daily activities?' : undefined,
    } as InputConfig);

    sections.push({
      id: `${dayPrefix}_performance`,
      label: `Day ${day}: Physical Performance`,
      type: 'select',
      options: performanceOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', performanceOptions),
      description: day === 1 ? 'Impact on physical tasks (walking, gripping, swallowing)' : undefined,
    } as InputConfig);

    sections.push({
      id: `${dayPrefix}_discomfort`,
      label: `Day ${day}: Discomfort/Pain`,
      type: 'select',
      options: discomfortOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', discomfortOptions),
      description: day === 1 ? 'Severity of discomfort or pain from swelling' : undefined,
    } as InputConfig);

    sections.push({
      id: `${dayPrefix}_disfigurement`,
      label: `Day ${day}: Disfigurement`,
      type: 'select',
      options: disfigurementOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', disfigurementOptions),
      description: day === 1 ? 'Visibility of swelling to others' : undefined,
    } as InputConfig);

    sections.push({
      id: `${dayPrefix}_duration`,
      label: `Day ${day}: Duration`,
      type: 'select',
      options: durationOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', durationOptions),
      description: day === 1 ? 'Duration of angioedema episode' : undefined,
    } as InputConfig);
  }

  return sections;
};

export const aas28Tool: Tool = {
  id: 'aas28',
  name: 'Angioedema Activity Score - 28 Day',
  acronym: 'AAS28',
  condition: 'Angioedema',
  keywords: [
    'aas28',
    'aas-28',
    'angioedema activity',
    '28 day',
    'monthly assessment',
    'hereditary angioedema',
    'hae',
    'recurrent angioedema',
  ],
  description:
    'The AAS28 is a validated 28-day patient-reported outcome measure for assessing angioedema disease activity. It evaluates daily interference with activities, physical performance, discomfort, disfigurement, and duration of swelling episodes.',
  sourceType: 'Research',
  icon: Calendar,
  rationale:
    '**28-Day Assessment Structure:**\n- Daily completion for 28 consecutive days\n- 5 questions per day, each scored 0-3\n- Maximum daily score: 15 points\n- Total 28-day score range: 0-420\n\n**Five Daily Assessment Domains:**\n1. **Interference with Daily Activities** - Impact on routine tasks\n2. **Physical Performance** - Functional limitations\n3. **Discomfort/Pain** - Symptom severity\n4. **Disfigurement** - Visible swelling\n5. **Duration** - Length of episodes\n\n**Clinical Applications:**\n- Monitor disease activity over time\n- Assess treatment response\n- Clinical trial outcome measure\n- Guide therapy adjustments\n\n**Advantages:**\n- Comprehensive monthly assessment\n- Captures disease variability\n- Validated in multiple languages\n- Correlates with quality of life\n- Recommended by international guidelines',
  clinicalPerformance:
    'The AAS28 demonstrates excellent psychometric properties across multiple validation studies. In the Thai population, internal consistency was excellent (Cronbach α >0.9) with strong convergent validity (r=0.63, p<0.0001) with Patient Global Assessment. Japanese validation showed internal consistency of 0.967 and test-retest reliability ICC of 0.890. The tool effectively differentiates between disease severity levels based on Patient Global Assessment categories (absence, mild, moderate, severe, very severe). Higher AAS28 scores strongly correlate with worse disease activity and quality of life impairment. The instrument has been translated and validated in over 80 languages and is used in 52 countries. It is recommended by EAACI/GA2LEN/EDF/WAO guidelines for angioedema assessment. The 28-day assessment period captures the episodic nature of angioedema better than shorter assessment windows. Practical clinical range observed in studies is 0-228 points rather than theoretical maximum of 420.',
  formSections: generateDailyFormSections(),
  calculationLogic: (inputs) => {
    let totalScore = 0;
    let daysWithActivity = 0;
    let totalEpisodeDays = 0;
    const dailyScores: number[] = [];
    let maxDailyScore = 0;
    let severeActivityDays = 0;
    let moderateActivityDays = 0;
    let mildActivityDays = 0;

    // Calculate scores for each day
    for (let day = 1; day <= 28; day++) {
      const dayPrefix = `day${day}`;
      const activity = Number(inputs[`${dayPrefix}_activity`]) || 0;
      const performance = Number(inputs[`${dayPrefix}_performance`]) || 0;
      const discomfort = Number(inputs[`${dayPrefix}_discomfort`]) || 0;
      const disfigurement = Number(inputs[`${dayPrefix}_disfigurement`]) || 0;
      const duration = Number(inputs[`${dayPrefix}_duration`]) || 0;

      const dailyScore = activity + performance + discomfort + disfigurement + duration;
      dailyScores.push(dailyScore);
      totalScore += dailyScore;

      if (dailyScore > maxDailyScore) {
        maxDailyScore = dailyScore;
      }

      // Count days with angioedema activity
      if (dailyScore > 0) {
        daysWithActivity++;
        totalEpisodeDays++;

        // Categorize activity days
        if (dailyScore >= 10) {
          severeActivityDays++;
        } else if (dailyScore >= 5) {
          moderateActivityDays++;
        } else {
          mildActivityDays++;
        }
      }
    }

    // Calculate average daily score
    const averageDailyScore = totalScore / 28;
    const averageActiveScore = daysWithActivity > 0 ? totalScore / daysWithActivity : 0;

    // Determine disease activity level based on research thresholds
    let activityLevel = '';
    let clinicalSignificance = '';
    let treatmentRecommendation = '';

    if (totalScore === 0) {
      activityLevel = 'No Disease Activity';
      clinicalSignificance = 'No angioedema episodes in the past 28 days.';
      treatmentRecommendation = 'Continue current prophylactic therapy if applicable. Monitor for breakthrough episodes.';
    } else if (totalScore <= 30) {
      activityLevel = 'Mild Disease Activity';
      clinicalSignificance = 'Minimal angioedema activity with low impact on daily life.';
      treatmentRecommendation = 'Current management appears adequate. Consider on-demand therapy for acute episodes.';
    } else if (totalScore <= 60) {
      activityLevel = 'Moderate Disease Activity';
      clinicalSignificance = 'Regular angioedema episodes with moderate impact on quality of life.';
      treatmentRecommendation = 'Consider prophylactic therapy or treatment escalation. Optimize acute episode management.';
    } else if (totalScore <= 100) {
      activityLevel = 'Severe Disease Activity';
      clinicalSignificance = 'Frequent or severe angioedema episodes significantly impacting daily activities.';
      treatmentRecommendation = 'Prophylactic therapy strongly recommended. Consider long-term prophylaxis with C1-INH, lanadelumab, or berotralstat.';
    } else {
      activityLevel = 'Very Severe Disease Activity';
      clinicalSignificance = 'Very frequent or severe angioedema with major functional impairment.';
      treatmentRecommendation = 'Urgent treatment optimization required. Maximize prophylactic therapy. Consider referral to HAE specialist center.';
    }

    // Calculate percentage of days with activity
    const percentDaysActive = ((daysWithActivity / 28) * 100).toFixed(1);

    const interpretation = `**AAS28 Total Score: ${totalScore}/420**

**Disease Activity Level:** ${activityLevel}

**Summary Statistics:**
- Days with angioedema: ${daysWithActivity}/28 (${percentDaysActive}%)
- Days without angioedema: ${28 - daysWithActivity}/28
- Average daily score (all days): ${averageDailyScore.toFixed(1)}
- Average daily score (active days): ${averageActiveScore.toFixed(1)}
- Maximum daily score: ${maxDailyScore}/15

**Activity Distribution:**
- Severe activity days (≥10): ${severeActivityDays}
- Moderate activity days (5-9): ${moderateActivityDays}
- Mild activity days (1-4): ${mildActivityDays}
- No activity days: ${28 - daysWithActivity}

**Clinical Significance:**
${clinicalSignificance}

**Treatment Recommendations:**
${treatmentRecommendation}

**Interpretation Guide:**
- Score 0: No disease activity
- Score 1-30: Mild activity
- Score 31-60: Moderate activity
- Score 61-100: Severe activity
- Score >100: Very severe activity

**Clinical Notes:**
- AAS28 captures month-long disease burden
- Higher scores correlate with QoL impairment
- Serial assessments track treatment response
- Consider alongside attack frequency and severity`;

    return {
      score: totalScore,
      interpretation,
      details: {
        'Total_AAS28_Score': totalScore,
        'Activity_Level': activityLevel,
        'Days_With_Angioedema': daysWithActivity,
        'Percent_Days_Active': `${percentDaysActive}%`,
        'Average_Daily_Score': averageDailyScore.toFixed(1),
        'Maximum_Daily_Score': maxDailyScore,
        'Severe_Days': severeActivityDays,
        'Moderate_Days': moderateActivityDays,
        'Mild_Days': mildActivityDays,
      },
    };
  },
  references: [
    'Weller K, Groffik A, Magerl M, et al. Development, validation, and initial results of the Angioedema Activity Score. Allergy. 2013;68(9):1185-92.',
    'Weller K, Donoso T, Magerl M, et al. Validation of the Angioedema Activity Score across different countries. J Allergy Clin Immunol Pract. 2020;8(6):1980-1986.',
    'Hide M, Horiuchi T, Ohsawa I, et al. Management of hereditary angioedema in Japan: Focus on icatibant for the treatment of acute attacks. Allergol Int. 2021;70(1):45-54.',
    'Kulthanan K, Chularojanamontri L, Rujitharanawong C, et al. Angioedema quality of life questionnaire (AE-QoL) - interpretability and sensitivity to change. J Allergy Clin Immunol Pract. 2019;7(8):2709-2715.',
    'Maurer M, Magerl M, Betschel S, et al. The international WAO/EAACI guideline for the management of hereditary angioedema - The 2021 revision and update. Allergy. 2022;77(7):1961-1990.',
  ],
};