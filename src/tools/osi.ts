import type { Tool, InputConfig, FormSectionConfig } from './types';
import { FileSearch } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const osiFormSections: FormSectionConfig[] = [
  {
    id: 'area_involvement',
    label: 'Area of Nail Plate Involvement',
    type: 'select',
    options: [
      { value: 0, label: '0 - No involvement (0%)' },
      { value: 1, label: '1 - Minimal involvement (1-10%)' },
      { value: 2, label: '2 - Mild involvement (11-25%)' },
      { value: 3, label: '3 - Moderate involvement (26-50%)' },
      { value: 4, label: '4 - Significant involvement (51-75%)' },
      { value: 5, label: '5 - Extensive involvement (>75%)' },
    ],
    defaultValue: 0,
    validation: getValidationSchema('select'),
    description: 'Percentage of nail plate affected by onychomycosis.',
  } as InputConfig,
  {
    id: 'proximity_matrix',
    label: 'Proximity to Nail Matrix',
    type: 'select',
    options: [
      { value: 1, label: '1 - Distal involvement only (>2/3 from matrix)' },
      { value: 2, label: '2 - Distal to mid-nail (1/2 to 2/3 from matrix)' },
      { value: 3, label: '3 - Mid-nail involvement (1/3 to 1/2 from matrix)' },
      { value: 4, label: '4 - Proximal involvement (1/4 to 1/3 from matrix)' },
      { value: 5, label: '5 - Very close to matrix (<1/4 from matrix)' },
    ],
    defaultValue: 1,
    validation: getValidationSchema('select'),
    description: 'How close the infection extends toward the proximal nail fold/matrix.',
  } as InputConfig,
  {
    id: 'dermatophytoma',
    label: 'Presence of Dermatophytoma',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
    description: 'Fungal mass/patch with thickened, dense fungal elements.',
  } as InputConfig,
  {
    id: 'subungual_hyperkeratosis',
    label: 'Subungual Hyperkeratosis >2mm',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
    description: 'Thickened keratotic debris under the nail plate exceeding 2mm.',
  } as InputConfig,
  {
    id: 'longitudinal_streaks',
    label: 'Longitudinal Streaks/Spikes',
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
    description: 'Linear streaks or spike pattern extending longitudinally.',
  } as InputConfig,
];

export const osiTool: Tool = {
  id: 'osi',
  name: 'Onychomycosis Severity Index',
  acronym: 'OSI',
  condition: 'Onychomycosis',
  keywords: [
    'osi',
    'onychomycosis',
    'nail fungus',
    'dermatophyte',
    'nail infection',
    'severity index',
    'tinea unguium',
  ],
  description:
    'The OSI is a validated tool for grading onychomycosis severity based on area of involvement, proximity to matrix, and additional clinical features. It provides objective severity stratification for treatment planning and monitoring.',
  sourceType: 'Research',
  icon: FileSearch,
  rationale:
    '**Formula: OSI = (Area × Proximity) + Additional Features**\n\n**Components:**\n1. **Area of Involvement (0-5):** % of nail affected\n   - 0: No involvement\n   - 1: 1-10%\n   - 2: 11-25%\n   - 3: 26-50%\n   - 4: 51-75%\n   - 5: >75%\n\n2. **Proximity to Matrix (1-5):** Distance from proximal fold\n   - 1: Distal only\n   - 5: Very close to matrix\n\n3. **Additional Features (+10 if present):**\n   - Dermatophytoma\n   - Subungual hyperkeratosis >2mm\n   - Longitudinal streaks\n\n**Maximum Score: 35** (5×5 + 10)\n\n**Clinical Significance:**\n- Matrix proximity affects treatment difficulty\n- Dermatophytoma indicates dense fungal mass\n- Higher scores predict poorer treatment response',
  clinicalPerformance:
    'The OSI demonstrates excellent inter-observer reliability regardless of clinician experience level (ICC = 0.889-0.96). In the original validation by Carney et al. (2011), Phase 1 with 37 dermatologists showed Cronbach\'s α = 0.99 and ICC = 0.95. Phase 2 validation at two centers showed similar results: University of Alabama (α = 0.99, ICC = 0.96) and Oregon Dermatology Center (α = 0.98, ICC = 0.93). The tool has been successfully validated in diverse populations including Brazilian cohorts (2024). OSI effectively stratifies patients into meaningful severity categories that correlate with treatment outcomes. Complete cure is defined as OSI = 0 with negative mycology, while clinical success includes <10% involvement. The 48-week assessment timepoint allows for near-complete nail outgrowth. The tool\'s simplicity (multiplication-based calculation) makes it practical for routine clinical use while maintaining high reproducibility. OSI is superior to more complex scoring systems due to its focus on key prognostic factors.',
  formSections: osiFormSections,
  calculationLogic: (inputs) => {
    const area = Number(inputs.area_involvement) || 0;
    const proximity = Number(inputs.proximity_matrix) || 1;

    let additionalFeatures = 0;
    if (inputs.dermatophytoma || inputs.subungual_hyperkeratosis || inputs.longitudinal_streaks) {
      additionalFeatures = 10;
    }

    const baseScore = area * proximity;
    const totalScore = baseScore + additionalFeatures;

    let severityCategory = '';
    let treatmentGuidance = '';

    if (totalScore === 0) {
      severityCategory = 'Clinically Cured/No Disease';
      treatmentGuidance = 'No treatment needed. Confirm with negative mycology.';
    } else if (totalScore <= 5) {
      severityCategory = 'Mild Onychomycosis';
      treatmentGuidance = 'Consider topical therapy (efinaconazole, tavaborole). May respond to ciclopirox lacquer.';
    } else if (totalScore <= 15) {
      severityCategory = 'Moderate Onychomycosis';
      treatmentGuidance = 'Oral therapy recommended (terbinafine, itraconazole). Consider combination with topical agents.';
    } else {
      severityCategory = 'Severe Onychomycosis';
      treatmentGuidance = 'Oral therapy essential. Consider pulse therapy, combination treatment, or nail avulsion. Poor prognosis without aggressive treatment.';
    }

    const featuresPresent = [];
    if (inputs.dermatophytoma) featuresPresent.push('Dermatophytoma');
    if (inputs.subungual_hyperkeratosis) featuresPresent.push('Hyperkeratosis >2mm');
    if (inputs.longitudinal_streaks) featuresPresent.push('Longitudinal streaks');

    const interpretation = `OSI Score: ${totalScore} (Range: 0-35). Severity: ${severityCategory}.

**Score Calculation:**
- Area (${area}) × Proximity (${proximity}) = ${baseScore}
- Additional features: ${additionalFeatures > 0 ? `+10 (${featuresPresent.join(', ')})` : 'None'}
- Total OSI: ${totalScore}

**Severity Classification:**
- 0: Cured/No disease
- 1-5: Mild onychomycosis
- 6-15: Moderate onychomycosis
- 16-35: Severe onychomycosis

**Treatment Guidance:**
${treatmentGuidance}

**Prognostic Factors:**
- Matrix proximity (score ${proximity}): ${proximity >= 4 ? 'Poor prognosis - very proximal involvement' : proximity >= 2 ? 'Moderate prognosis' : 'Good prognosis - distal involvement'}
- Additional features: ${featuresPresent.length > 0 ? 'Present - indicates resistant disease' : 'Absent - better treatment response expected'}

**Treatment Response Monitoring:**
- Complete cure: OSI = 0 + negative mycology
- Clinical success: <10% involvement
- Assess at 48 weeks for complete nail outgrowth`;

    return {
      score: totalScore,
      interpretation,
      details: {
        'Area_Score': area,
        'Proximity_Score': proximity,
        'Base_Score': baseScore,
        'Additional_Features': additionalFeatures,
        'Total_OSI': totalScore,
        'Severity_Category': severityCategory,
        'Dermatophytoma': inputs.dermatophytoma ? 'Present' : 'Absent',
        'Hyperkeratosis_>2mm': inputs.subungual_hyperkeratosis ? 'Present' : 'Absent',
        'Longitudinal_Streaks': inputs.longitudinal_streaks ? 'Present' : 'Absent',
      },
    };
  },
  references: [
    'Carney C, Tosti A, Daniel R, et al. A new classification system for grading the severity of onychomycosis: Onychomycosis Severity Index. Arch Dermatol. 2011;147(11):1277-1282.',
    'Gupta AK, Versteeg SG, Shear NH. Onychomycosis in the 21st Century: An Update on Diagnosis, Epidemiology, and Treatment. J Cutan Med Surg. 2017;21(6):525-539.',
    'Lipner SR, Scher RK. Onychomycosis: Clinical overview and diagnosis. J Am Acad Dermatol. 2019;80(4):835-851.',
    'Elewski BE, Rich P, Pollak R, et al. Efinaconazole 10% solution in the treatment of toenail onychomycosis: Two phase III multicenter, randomized, double-blind studies. J Am Acad Dermatol. 2013;68(4):600-608.',
    'Gupta AK, Stec N, Summerbell RC, et al. Onychomycosis: a review. J Eur Acad Dermatol Venereol. 2020;34(9):1972-1990.',
  ],
};