import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from './types';
import { Users } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

// The 9 body areas assessed in modified Ferriman-Gallwey
const bodyAreas = [
  { id: 'upper_lip', name: 'Upper Lip', description: 'Terminal hair above the lip' },
  { id: 'chin', name: 'Chin', description: 'Terminal hair over the chin area' },
  { id: 'chest', name: 'Chest', description: 'Hair between breasts or around nipples' },
  { id: 'upper_back', name: 'Upper Back', description: 'Terminal hair on upper back' },
  { id: 'lower_back', name: 'Lower Back', description: 'Terminal hair on lower back' },
  { id: 'upper_abdomen', name: 'Upper Abdomen', description: 'Hair between chest and navel' },
  { id: 'lower_abdomen', name: 'Lower Abdomen', description: 'Hair between navel and pubic area' },
  { id: 'upper_arms', name: 'Upper Arms', description: 'Coarse hair on upper arms' },
  { id: 'thighs', name: 'Thighs', description: 'Terminal hair on inner and upper thighs' },
];

const scoringOptions: InputOption[] = [
  { value: 0, label: '0 - No terminal hair' },
  { value: 1, label: '1 - Minimal terminal hair (sparse)' },
  { value: 2, label: '2 - More than minimal (moderate)' },
  { value: 3, label: '3 - Marked terminal hair (considerable)' },
  { value: 4, label: '4 - Extensive hair growth (male pattern)' },
];

const ferrimanGallweyFormSections: FormSectionConfig[] = bodyAreas.map(
  (area) =>
    ({
      id: `fg_${area.id}`,
      label: area.name,
      type: 'select',
      options: scoringOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', scoringOptions, 0, 4),
      description: area.description,
    }) as InputConfig,
);

export const ferrimanGallweyTool: Tool = {
  id: 'ferrimanGallwey',
  name: 'Modified Ferriman-Gallwey Score',
  acronym: 'mFG',
  condition: 'Hirsutism',
  keywords: [
    'ferriman-gallwey',
    'mfg',
    'hirsutism',
    'excess hair',
    'hyperandrogenism',
    'pcos',
    'terminal hair',
    'androgenic alopecia',
  ],
  description:
    'The modified Ferriman-Gallwey (mFG) score is the gold standard clinical tool for assessing hirsutism in women. It evaluates terminal hair growth in 9 androgen-sensitive body areas, each scored from 0-4.',
  sourceType: 'Clinical Guideline',
  icon: Users,
  rationale:
    '**Scoring System:**\n- 9 body areas assessed (reduced from original 11)\n- Each area scored 0-4 based on terminal hair density\n- Total score: 0-36 (9 areas × 4 max)\n\n**Grading Scale:**\n- 0 = No terminal hair\n- 1 = Minimal/sparse terminal hair\n- 2 = More than minimal (moderate)\n- 3 = Marked terminal hair\n- 4 = Extensive (male pattern) growth\n\n**Diagnostic Thresholds:**\n- **≥8:** Clinically significant hirsutism (traditional)\n- **8-16:** Mild hirsutism\n- **17-24:** Moderate hirsutism\n- **>24:** Severe hirsutism\n\n**Ethnic Variations (Cutoffs):**\n- Caucasian/Turkish: ≥8\n- Filipino: ≥7\n- South Indian: ≥5\n- Asian: Generally lower baseline\n- Mediterranean: Higher baseline\n\n**Most Diagnostic Areas (% in hirsute women):**\n- Chin: 97.4%\n- Thighs: 96.5%\n- Upper lip: 94.7%\n- Lower abdomen: 92.1%',
  clinicalPerformance:
    'The mFG score demonstrates good diagnostic accuracy for PCOS detection with sensitivity 76-93% and specificity 52-70% (AUC = 0.893 for simplified version). Inter-observer reliability shows good concordance between trained examiners, though single examiner assessment is preferred. Self-assessment performance shows 85% sensitivity, 90% specificity, and 88.9% overall accuracy with cutoff of 5. The score correlates significantly with biochemical hyperandrogenism: androstenedione (p=0.034) and DHEAS (p=0.012), but not with total testosterone, free testosterone, or SHBG. For detecting elevated testosterone, mFG >13 shows 100% sensitivity and 82.6% specificity. There is significant association with metabolic syndrome: 65.2% of patients with score ≥8 have metabolic syndrome vs. 37.7% with score <8 (p=0.019). Patient vs. clinician scoring shows patients tend to score higher (mean 15.1 vs 12.0 in PCOS). Limitations include subjective visual assessment, difficulty evaluating after cosmetic hair removal, and need for population-specific cutoffs.',
  formSections: [
    {
      id: 'fg_assessment_group',
      title: 'Terminal Hair Assessment (9 Body Areas)',
      description:
        'For each body area, assess the density of terminal (coarse, pigmented) hair. Score from 0 (none) to 4 (extensive/male pattern).',
      gridCols: 2,
      inputs: ferrimanGallweyFormSections as InputConfig[],
    },
  ],
  calculationLogic: (inputs) => {
    let totalScore = 0;
    const areaScores: Record<string, number> = {};

    bodyAreas.forEach((area) => {
      const score = Number(inputs[`fg_${area.id}`]) || 0;
      totalScore += score;
      areaScores[area.name] = score;
    });

    let severityCategory = '';
    let clinicalSignificance = '';

    if (totalScore < 8) {
      severityCategory = 'No hirsutism';
      clinicalSignificance = 'Below clinical threshold';
    } else if (totalScore <= 16) {
      severityCategory = 'Mild hirsutism';
      clinicalSignificance = 'Clinically significant';
    } else if (totalScore <= 24) {
      severityCategory = 'Moderate hirsutism';
      clinicalSignificance = 'Significant hyperandrogenism likely';
    } else {
      severityCategory = 'Severe hirsutism';
      clinicalSignificance = 'Severe hyperandrogenism, comprehensive evaluation needed';
    }

    const interpretation = `Modified Ferriman-Gallwey Score: ${totalScore} (Range: 0-36). ${severityCategory}.

**Clinical Significance:** ${clinicalSignificance}

**Severity Classification:**
- <8: No hirsutism
- 8-16: Mild hirsutism
- 17-24: Moderate hirsutism
- >24: Severe hirsutism

**Ethnic Considerations:**
Traditional cutoff ≥8 based on Caucasian populations. Consider lower thresholds for:
- Asian populations: ≥5-7
- Higher baseline expected in Mediterranean populations

**Clinical Correlations:**
- Score ≥8: Evaluate for PCOS, measure androgens
- Score ≥13: High likelihood of elevated testosterone
- Score ≥17: Consider comprehensive endocrine evaluation

**Most Diagnostic Areas to Monitor:**
Chin (${areaScores['Chin']}), Thighs (${areaScores['Thighs']}), Upper Lip (${areaScores['Upper Lip']}), Lower Abdomen (${areaScores['Lower Abdomen']})

**Note:** Assessment may be affected by cosmetic hair removal. Consider patient distress and quality of life impact regardless of score.`;

    return {
      score: totalScore,
      interpretation,
      details: {
        'Total_mFG_Score': totalScore,
        'Severity_Category': severityCategory,
        ...areaScores,
        'Clinical_Threshold_Met': totalScore >= 8 ? 'Yes' : 'No',
        'Metabolic_Syndrome_Risk': totalScore >= 8 ? 'Increased (65.2% prevalence)' : 'Lower (37.7% prevalence)',
      },
    };
  },
  references: [
    'Ferriman D, Gallwey JD. Clinical assessment of body hair growth in women. J Clin Endocrinol Metab. 1961;21:1440-7.',
    'Yildiz BO, Bolour S, Woods K, et al. Visually scoring hirsutism. Hum Reprod Update. 2010;16(1):51-64.',
    'Escobar-Morreale HF, Carmina E, Dewailly D, et al. Epidemiology, diagnosis and management of hirsutism: a consensus statement by the Androgen Excess and Polycystic Ovary Syndrome Society. Hum Reprod Update. 2012;18(2):146-70.',
    'DeUgarte CM, Woods KS, Bartolucci AA, Azziz R. Degree of facial and body terminal hair growth in unselected black and white women: toward a populational definition of hirsutism. J Clin Endocrinol Metab. 2006;91(4):1345-50.',
    'Cook H, Brennan K, Azziz R. Reanalyzing the modified Ferriman-Gallwey score: is there a simpler method for assessing the extent of hirsutism? Fertil Steril. 2011;96(5):1266-70.',
  ],
};