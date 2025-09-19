import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { Calculator } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const gagsLesionGradeOptions: InputOption[] = [
  { value: 0, label: '0 - No lesions' },
  { value: 1, label: '1 - Comedones' }, // Simplified for selection
  { value: 2, label: '2 - Papules' },
  { value: 3, label: '3 - Pustules' },
  { value: 4, label: '4 - Nodules' },
];

const gagsLocations = [
  { id: 'forehead', name: 'Forehead', factor: 2 },
  { id: 'r_cheek', name: 'Right Cheek', factor: 2 },
  { id: 'l_cheek', name: 'Left Cheek', factor: 2 },
  { id: 'nose', name: 'Nose', factor: 1 },
  { id: 'chin', name: 'Chin', factor: 1 },
  { id: 'chest_upper_back', name: 'Chest & Upper Back', factor: 3 },
];

const gagsFormSections: FormSectionConfig[] = gagsLocations.map(
  (loc) =>
    ({
      id: `gags_${loc.id}`,
      label: `${loc.name} - Predominant Lesion Grade (Factor x${loc.factor})`,
      type: 'select',
      options: gagsLesionGradeOptions,
      defaultValue: 0,
      description:
        'Select most severe lesion type: 0=None, 1=Comedones, 2=Papules, 3=Pustules, 4=Nodules.',
      validation: getValidationSchema('select', gagsLesionGradeOptions, 0, 4),
    }) as InputConfig,
);

export const gagsTool: Tool = {
  id: 'gags',
  name: 'Global Acne Grading System (GAGS)',
  acronym: 'GAGS',
  condition: 'Acne Vulgaris',
  keywords: ['gags', 'acne', 'acne vulgaris', 'global acne grading system', 'severity'],
  description:
    'The Global Acne Grading System (GAGS) is a quantitative, composite scoring system designed to provide a standardized, reproducible measure of acne severity by incorporating both the type and distribution of lesions across different anatomical regions.',
  sourceType: 'Clinical Guideline',
  icon: Calculator,
  rationale:
    '**Formula: GAGS = Σ (Grade × Regional Factor)**\n\n**Grading System (Most Severe Lesion Type):**\n- 0 = No lesions\n- 1 = Comedones (non-inflammatory)\n- 2 = Papules (inflammatory, <5mm)\n- 3 = Pustules (inflammatory with pus)\n- 4 = Nodules (deep inflammatory, >5mm)\n\n**Regional Factors (Based on Surface Area & Cosmetic Impact):**\n- Forehead: Factor 2\n- Right cheek: Factor 2\n- Left cheek: Factor 2\n- Nose: Factor 1\n- Chin: Factor 1\n- Chest & Upper back: Factor 3 (largest area)\n\n**Maximum Score: 44** (All regions with nodules)\n\n**Example Calculation:**\nPatient with papules on forehead (2×2=4), pustules on right cheek (3×2=6), comedones on nose (1×1=1):\nGAGS = 4 + 6 + 1 = 11 (Mild acne)\n\n**Clinical Advantage:** GAGS considers both lesion severity AND anatomical distribution, capturing the cosmetic and psychological impact better than simple lesion counts.',
  clinicalPerformance:
    'The GAGS shows good inter-rater reliability (κ = 0.65-0.82) and intra-rater reliability (κ = 0.78-0.91) across multiple studies. It correlates well with traditional lesion counting (r = 0.73-0.86) while being significantly faster to perform (mean 90 seconds vs 5-10 minutes for counting). The GAGS has moderate to strong correlation with quality of life measures including the Cardiff Acne Disability Index (r = 0.59) and DLQI (r = 0.62). Studies demonstrate good responsiveness to treatment, with statistically significant score reductions observed after 8-12 weeks of therapy. The tool performs particularly well in distinguishing mild from moderate-severe acne (AUC = 0.88-0.92) but shows more variability at severity boundaries. In comparative analyses with other grading systems (Leeds, IGA, Comprehensive Acne Severity Scale), GAGS showed comparable or superior reliability. A limitation is potential ceiling effect in very severe nodulocystic acne. Training with photographic standards improves inter-rater agreement by approximately 20%. The simplified assessment makes it practical for busy clinical settings while maintaining adequate precision for research applications.',
  formSections: gagsFormSections,
  calculationLogic: (inputs) => {
    let totalScore = 0;
    const locationScores: Record<string, { grade: number; factor: number; score: number }> = {};
    gagsLocations.forEach((loc) => {
      const grade = Number(inputs[`gags_${loc.id}`]) || 0;
      const locationScore = grade * loc.factor;
      totalScore += locationScore;
      locationScores[loc.name] = { grade, factor: loc.factor, score: locationScore };
    });

    let severityInterpretationText = '';
    if (totalScore === 0) severityInterpretationText = 'Clear';
    else if (totalScore <= 18) severityInterpretationText = 'Mild';
    else if (totalScore <= 30) severityInterpretationText = 'Moderate';
    else if (totalScore <= 38) severityInterpretationText = 'Severe';
    else severityInterpretationText = 'Very Severe';

    const interpretation = `Total GAGS Score: ${totalScore} (Range: 0-44). Severity: ${severityInterpretationText} acne.\n\n**Severity Bands:**\n- 0 = Clear\n- 1-18 = Mild acne\n- 19-30 = Moderate acne\n- 31-38 = Severe acne\n- ≥39 = Very severe acne\n\n**Clinical Notes:** Higher scores indicate more severe inflammatory lesions and/or wider anatomical distribution. Consider treatment escalation for scores >18.`;
    return {
      score: totalScore,
      interpretation,
      details: {
        Regional_Scores: locationScores,
        Total_GAGS_Score: totalScore,
        Severity_Category: severityInterpretationText,
      },
    };
  },
  references: [
    'Reynolds RV, Yeung H, Cheng CE, et al. Guidelines of Care for the Management of Acne Vulgaris. Journal of the American Academy of Dermatology. 2024;90(5):1006.e1-1006.e30. doi:10.1016/j.jaad.2023.12.017.',
    'Bernardis E, Shou H, Barbieri JS, et al. Development and Initial Validation of a Multidimensional Acne Global Grading System Integrating Primary Lesions and Secondary Changes. JAMA Dermatology. 2020;156(3):296-302. doi:10.1001/jamadermatol.2019.4668.',
    'Ramli R, Malik AS, Hani AF, Jamil A. Acne Analysis, Grading and Computational Assessment Methods: An Overview. Skin Research and Technology. 2012;18(1):1-14. doi:10.1111/j.1600-0846.2011.00542.x.',
    'Barratt H, Hamilton F, Car J, et al. Outcome Measures in Acne Vulgaris: Systematic Review. The British Journal of Dermatology. 2009;160(1):132-6. doi:10.1111/j.1365-2133.2008.08819.x.',
    'Becker M, Wild T, Zouboulis CC. Objective Assessment of Acne. Clinics in Dermatology. 2017 Mar - Apr;35(2):147-155. doi:10.1016/j.clindermatol.2016.10.006.',
  ],
};
