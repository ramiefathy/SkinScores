import type { Tool, InputConfig, FormSectionConfig, InputOption } from './types';
import { Camera } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const facialGradeOptions: InputOption[] = [
  { value: 0, label: 'Grade 0 - No acne' },
  { value: 1, label: 'Grade 1 - Very mild (few comedones)' },
  { value: 2, label: 'Grade 2 - Mild (scattered comedones, few papules)' },
  { value: 3, label: 'Grade 3 - Mild-moderate (comedones, some papules)' },
  { value: 4, label: 'Grade 4 - Moderate (many comedones/papules, few pustules)' },
  { value: 5, label: 'Grade 5 - Moderate (comedones, papules, some pustules)' },
  { value: 6, label: 'Grade 6 - Moderate-severe (numerous papules/pustules)' },
  { value: 7, label: 'Grade 7 - Severe (numerous papules/pustules, some nodules)' },
  { value: 8, label: 'Grade 8 - Severe (many papules/pustules, nodules)' },
  { value: 9, label: 'Grade 9 - Severe (predominantly nodular, extensive)' },
  { value: 10, label: 'Grade 10 - Very severe (nodular, cystic, extensive)' },
  { value: 11, label: 'Grade 11 - Very severe (confluent nodular/cystic)' },
  { value: 12, label: 'Grade 12 - Extremely severe (extensive confluent nodular)' },
];

const backGradeOptions: InputOption[] = [
  { value: 0, label: 'Grade 0 - No acne' },
  { value: 1, label: 'Grade 1 - Very mild' },
  { value: 2, label: 'Grade 2 - Mild' },
  { value: 3, label: 'Grade 3 - Mild-moderate' },
  { value: 4, label: 'Grade 4 - Moderate' },
  { value: 5, label: 'Grade 5 - Moderate-severe' },
  { value: 6, label: 'Grade 6 - Severe' },
  { value: 7, label: 'Grade 7 - Very severe' },
  { value: 8, label: 'Grade 8 - Extremely severe' },
];

const chestGradeOptions: InputOption[] = [
  { value: 0, label: 'Grade 0 - No acne' },
  { value: 1, label: 'Grade 1 - Very mild' },
  { value: 2, label: 'Grade 2 - Mild' },
  { value: 3, label: 'Grade 3 - Mild-moderate' },
  { value: 4, label: 'Grade 4 - Moderate' },
  { value: 5, label: 'Grade 5 - Moderate-severe' },
  { value: 6, label: 'Grade 6 - Severe' },
  { value: 7, label: 'Grade 7 - Very severe' },
  { value: 8, label: 'Grade 8 - Extremely severe' },
];

const lesionTypeOptions: InputOption[] = [
  { value: 'inflammatory', label: 'Inflammatory (papules, pustules, nodules)' },
  { value: 'noninflammatory', label: 'Noninflammatory (comedones)' },
  { value: 'mixed', label: 'Mixed (both types equally present)' },
];

const leedsRevisedFormSections: FormSectionConfig[] = [
  {
    id: 'facial_grade',
    label: 'Facial Acne Grade (1-12)',
    type: 'select',
    options: facialGradeOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', facialGradeOptions),
    description: 'Compare patient to photographic standards (12 grades for face).',
  } as InputConfig,
  {
    id: 'back_grade',
    label: 'Back Acne Grade (0-8)',
    type: 'select',
    options: backGradeOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', backGradeOptions),
    description: 'Compare to photographic standards (8 grades for back).',
  } as InputConfig,
  {
    id: 'chest_grade',
    label: 'Chest Acne Grade (0-8)',
    type: 'select',
    options: chestGradeOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', chestGradeOptions),
    description: 'Compare to photographic standards (8 grades for chest).',
  } as InputConfig,
  {
    id: 'lesion_type',
    label: 'Predominant Lesion Type',
    type: 'select',
    options: lesionTypeOptions,
    defaultValue: 'inflammatory',
    validation: getValidationSchema('select', lesionTypeOptions),
    description: 'Identify the predominant type of acne lesions.',
  } as InputConfig,
];

export const leedsRevisedTool: Tool = {
  id: 'leedsRevised',
  name: 'Leeds Revised Acne Grading System',
  acronym: 'LRAGS',
  condition: 'Acne Vulgaris',
  keywords: [
    'leeds',
    'lrags',
    'acne',
    'photographic grading',
    'facial acne',
    'back acne',
    'chest acne',
  ],
  description:
    'The Leeds Revised Acne Grading System (1998) uses photographic standards to grade acne severity. It provides 12 grades for facial acne and 8 grades each for back and chest acne, with separate assessment for inflammatory vs noninflammatory lesions.',
  sourceType: 'Research',
  icon: Camera,
  rationale:
    '**Photographic-Based Grading:**\n- Developed from >1000 photographs by expert panel\n- Color photographs (improvement from original B&W)\n- Standardized visual references for consistency\n\n**Grading Structure:**\n- **Face:** 12 grades (0-12) - most detailed\n- **Back:** 8 grades (0-8)\n- **Chest:** 8 grades (0-8)\n\n**Assessment Criteria:**\n- Extent of inflammation\n- Range and size of inflamed lesions\n- Associated erythema\n- Separate scoring for noninflammatory lesions\n\n**Severity Categories (Face):**\n- Grades 0-3: None to mild\n- Grades 4-6: Moderate\n- Grades 7-9: Severe\n- Grades 10-12: Very severe to extremely severe\n\n**Advantages:**\n- Quick assessment (~3 minutes)\n- High reliability (Cronbach α >0.8)\n- Validated for clinical trials\n- Differentiates lesion types',
  clinicalPerformance:
    'The LRAGS demonstrates excellent psychometric properties with significant cross-sectional validity (p<0.012 face, p<0.001 back/chest) and longitudinal validity (p<0.0001 all regions). Reliability is strong with Cronbach\'s alpha >0.8 for both intraobserver and interobserver assessments for inflammatory lesions across all regions. The system is practical with 89.5% of physicians finding it easy to use and mean administration time of only 3.12 minutes. The photographic standards were selected from over 1000 photographs by an expert panel of three dermatologists and four acne assessors, ensuring clinical relevance. The revised version significantly improves upon the original Leeds technique by using color photographs instead of black and white, simplifying the grading system, and providing separate assessment for noninflammatory lesions. Validation studies confirm its applicability in clinical trials and routine practice. The tool shows good correlation with other acne severity measures and treatment outcomes.',
  formSections: leedsRevisedFormSections,
  calculationLogic: (inputs) => {
    const facialGrade = Number(inputs.facial_grade) || 0;
    const backGrade = Number(inputs.back_grade) || 0;
    const chestGrade = Number(inputs.chest_grade) || 0;
    const lesionType = String(inputs.lesion_type || 'inflammatory');

    // Calculate composite score (weighted by region importance)
    const compositeScore = facialGrade + (backGrade * 0.75) + (chestGrade * 0.75);

    // Determine overall severity based on highest regional grade
    const maxGrade = Math.max(facialGrade, backGrade, chestGrade);
    let overallSeverity = '';
    let treatmentRecommendation = '';

    if (maxGrade === 0) {
      overallSeverity = 'No acne';
      treatmentRecommendation = 'No treatment required';
    } else if (maxGrade <= 3) {
      overallSeverity = 'Mild acne';
      treatmentRecommendation = 'Topical therapy: retinoids, benzoyl peroxide, or combination';
    } else if (maxGrade <= 6) {
      overallSeverity = 'Moderate acne';
      treatmentRecommendation = lesionType === 'inflammatory'
        ? 'Topical combination therapy + consider oral antibiotics'
        : 'Topical retinoids + benzoyl peroxide, consider oral therapy if unresponsive';
    } else if (maxGrade <= 9) {
      overallSeverity = 'Severe acne';
      treatmentRecommendation = 'Oral antibiotics + topical therapy, consider isotretinoin if treatment-resistant';
    } else {
      overallSeverity = 'Very severe acne';
      treatmentRecommendation = 'Consider isotretinoin as first-line therapy, aggressive combination treatment';
    }

    // Regional assessment
    const regionalAssessment = [];
    if (facialGrade > 0) regionalAssessment.push(`Face: Grade ${facialGrade}`);
    if (backGrade > 0) regionalAssessment.push(`Back: Grade ${backGrade}`);
    if (chestGrade > 0) regionalAssessment.push(`Chest: Grade ${chestGrade}`);

    const interpretation = `Leeds Revised Acne Assessment

**Regional Grades:**
- Face: ${facialGrade}/12
- Back: ${backGrade}/8
- Chest: ${chestGrade}/8

**Overall Severity:** ${overallSeverity}
**Predominant Lesion Type:** ${lesionType.charAt(0).toUpperCase() + lesionType.slice(1)}

**Affected Regions:** ${regionalAssessment.length > 0 ? regionalAssessment.join(', ') : 'No active acne'}

**Interpretation:**
${facialGrade >= 7 ? 'Severe facial involvement - consider psychological impact and scarring risk\n' : ''}${backGrade >= 6 || chestGrade >= 6 ? 'Significant truncal involvement - systemic therapy likely needed\n' : ''}${lesionType === 'noninflammatory' ? 'Predominantly comedonal - focus on retinoid therapy\n' : lesionType === 'inflammatory' ? 'Inflammatory predominant - anti-inflammatory approach needed\n' : ''}

**Treatment Recommendation:**
${treatmentRecommendation}

**Clinical Notes:**
- Photographic comparison ensures standardized assessment
- Consider photographing patient for treatment monitoring
- Reassess after 8-12 weeks of therapy
- Leeds grading correlates well with quality of life impact`;

    return {
      score: compositeScore,
      interpretation,
      details: {
        'Facial_Grade': facialGrade,
        'Back_Grade': backGrade,
        'Chest_Grade': chestGrade,
        'Composite_Score': Math.round(compositeScore * 10) / 10,
        'Overall_Severity': overallSeverity,
        'Predominant_Lesion_Type': lesionType,
        'Max_Regional_Grade': maxGrade,
        'Affected_Regions': regionalAssessment.join(', ') || 'None',
      },
    };
  },
  references: [
    'O\'Brien SC, Lewis JB, Cunliffe WJ. The Leeds revised acne grading system. J Dermatol Treat. 1998;9(4):215-220.',
    'Burke BM, Cunliffe WJ. The assessment of acne vulgaris--the Leeds technique. Br J Dermatol. 1984;111(1):83-92.',
    'Barbaric J, Abbott R, Posadzki P, et al. Light therapies for acne. Cochrane Database Syst Rev. 2016;9(9):CD007917.',
    'Ramli R, Malik AS, Hani AF, Jamil A. Acne analysis, grading and computational assessment methods: an overview. Skin Res Technol. 2012;18(1):1-14.',
    'Agnew T, Furber G, Leach M, Segal L. A Comprehensive Critique and Review of Published Measures of Acne Severity. J Clin Aesthet Dermatol. 2016;9(7):40-52.',
  ],
};