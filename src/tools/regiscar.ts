import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { AlertOctagon } from 'lucide-react';
import { getValidationSchema } from './toolValidation';
import { regiscarCompute, type RegiscarInput } from './regiscar.full';

// Define option arrays first so they can be referenced
const feverOptions: InputOption[] = [
  { value: 'yes', label: 'Yes (≥38.5°C): 0 points' },
  { value: 'no', label: 'No: -1 point' },
  { value: 'unknown', label: 'Unknown: -1 point' },
];

const lymphNodeOptions: InputOption[] = [
  { value: 'yes', label: 'Yes (≥2 sites, >1cm): +1 point' },
  { value: 'no', label: 'No: 0 points' },
  { value: 'unknown', label: 'Unknown: 0 points' },
];

const eosinophiliaOptions: InputOption[] = [
  { value: 'none', label: 'No eosinophilia: 0 points' },
  { value: 'mild', label: '0.7-1.5×10⁹/L OR 10-19.9% if WBC <4×10⁹/L: +1 point' },
  { value: 'marked', label: '>1.5×10⁹/L OR ≥20% if WBC <4×10⁹/L: +2 points' },
  { value: 'unknown', label: 'Unknown: 0 points' },
];

const atypicalLymphOptions: InputOption[] = [
  { value: 'yes', label: 'Yes: +1 point' },
  { value: 'no', label: 'No: 0 points' },
  { value: 'unknown', label: 'Unknown: 0 points' },
];

const skinExtentOptions: InputOption[] = [
  { value: 'yes', label: 'Yes (≥50% BSA): +1 point' },
  { value: 'no', label: 'No (<50% BSA): 0 points' },
  { value: 'unknown', label: 'Unknown: 0 points' },
];

const skinFeaturesOptions: InputOption[] = [
  { value: 'yes', label: 'Yes (≥2 features): +1 point' },
  { value: 'no', label: 'No (<2 features): -1 point' },
  { value: 'unknown', label: 'Unknown: 0 points' },
];

const biopsyOptions: InputOption[] = [
  { value: 'yes', label: 'Suggestive of DRESS: 0 points' },
  { value: 'no', label: 'Not suggestive/Not done: -1 point' },
  { value: 'unknown', label: 'Unknown: 0 points' },
];

const organOptions: InputOption[] = [
  { value: 'none', label: 'No organ involvement: 0 points' },
  { value: 'one', label: 'One organ involved: +1 point' },
  { value: 'two_or_more', label: 'Two or more organs: +2 points' },
  { value: 'unknown', label: 'Unknown: 0 points' },
];

const resolutionOptions: InputOption[] = [
  { value: 'yes', label: 'Yes (≥15 days): 0 points' },
  { value: 'no', label: 'No (<15 days): -1 point' },
  { value: 'unknown', label: 'Unknown: -1 point' },
];

const altDxOptions: InputOption[] = [
  { value: 'yes', label: 'Yes (excluded): +1 point' },
  { value: 'no', label: 'No (not excluded): 0 points' },
  { value: 'unknown', label: 'Unknown: 0 points' },
];

const regiscarFormSections: FormSectionConfig[] = [
  {
    id: 'fever',
    label: '1. Fever ≥38.5°C',
    type: 'select',
    options: feverOptions,
    defaultValue: 'no',
    validation: getValidationSchema('select', feverOptions),
    description: 'Documented fever ≥38.5°C (101.3°F) during the reaction.',
  } as InputConfig,
  {
    id: 'lymphadenopathy',
    label: '2. Enlarged Lymph Nodes (≥2 sites, >1cm)',
    type: 'select',
    options: lymphNodeOptions,
    defaultValue: 'no',
    validation: getValidationSchema('select', lymphNodeOptions),
    description: 'Enlarged lymph nodes at ≥2 sites with size >1cm.',
  } as InputConfig,
  {
    id: 'atypicalLymphocytes',
    label: '3. Atypical Lymphocytes',
    type: 'select',
    options: atypicalLymphOptions,
    defaultValue: 'no',
    validation: getValidationSchema('select', atypicalLymphOptions),
    description: 'Presence of atypical lymphocytes on blood smear.',
  } as InputConfig,
  {
    id: 'eosinophilia',
    label: '4. Eosinophilia',
    type: 'select',
    options: eosinophiliaOptions,
    defaultValue: 'none',
    validation: getValidationSchema('select', eosinophiliaOptions),
    description: 'Eosinophil count (use percentage if leukopenia present).',
  } as InputConfig,
  {
    id: 'skinExtent50',
    label: '5a. Skin Involvement - Extent >50% BSA',
    type: 'select',
    options: skinExtentOptions,
    defaultValue: 'no',
    validation: getValidationSchema('select', skinExtentOptions),
    description: 'Extent of skin rash as percentage of body surface area.',
  } as InputConfig,
  {
    id: 'skinFeatures2of4',
    label: '5b. Skin Features - At least 2 of 4',
    type: 'select',
    options: skinFeaturesOptions,
    defaultValue: 'no',
    validation: getValidationSchema('select', skinFeaturesOptions),
    description: 'At least 2 of: facial edema, infiltration, purpura, scaling.',
  } as InputConfig,
  {
    id: 'biopsySuggestive',
    label: '5c. Biopsy Suggesting DRESS',
    type: 'select',
    options: biopsyOptions,
    defaultValue: 'no',
    validation: getValidationSchema('select', biopsyOptions),
    description: 'Skin biopsy findings consistent with DRESS.',
  } as InputConfig,
  {
    id: 'organInvolvement',
    label: '6. Organ Involvement',
    type: 'select',
    options: organOptions,
    defaultValue: 'none',
    validation: getValidationSchema('select', organOptions),
    description: 'Number of internal organs involved (liver, kidney, lung, muscle, heart, pancreas, other).',
  } as InputConfig,
  {
    id: 'resolutionGT15d',
    label: '7. Resolution ≥15 Days',
    type: 'select',
    options: resolutionOptions,
    defaultValue: 'unknown',
    validation: getValidationSchema('select', resolutionOptions),
    description: 'Time to resolution after drug withdrawal.',
  } as InputConfig,
  {
    id: 'altDxExcluded',
    label: '8. Alternative Diagnoses Excluded',
    type: 'select',
    options: altDxOptions,
    defaultValue: 'no',
    validation: getValidationSchema('select', altDxOptions),
    description: 'Alternative causes excluded (ANA, blood culture, PCR/serology for HCV, HBV, HHV-6, etc.).',
  } as InputConfig,
];

export const regiscarTool: Tool = {
  id: 'regiscar',
  name: 'RegiSCAR DRESS Validation Score',
  acronym: 'RegiSCAR',
  condition: 'Drug Reaction (DRESS)',
  keywords: [
    'dress',
    'regiscar',
    'drug reaction',
    'eosinophilia',
    'systemic symptoms',
    'drug hypersensitivity',
    'dihs',
  ],
  description:
    'The RegiSCAR scoring system validates the diagnosis of Drug Reaction with Eosinophilia and Systemic Symptoms (DRESS). Score ranges from -4 to 9 points with diagnostic categories based on total score.',
  sourceType: 'Research',
  icon: AlertOctagon,
  rationale:
    '**Scoring System (-4 to 9 points):**\n\n**Positive Criteria:**\n- Fever ≥38.5°C (0 points if present)\n- Enlarged lymph nodes (+1)\n- Eosinophilia (+1 to +2)\n- Atypical lymphocytes (+1)\n- Extensive skin involvement (+1)\n- Specific rash morphology (+1)\n- Biopsy suggesting DRESS (+1)\n- Multiple organ involvement (+1)\n\n**Negative Criteria:**\n- No fever (-1)\n- No rash (-2)\n- Pustular rash (-1)\n- Biopsy showing other diagnosis (-1)\n- Resolution <15 days (-1)\n- Rapid lab improvement (-1)\n\n**Interpretation:**\n- **<2:** No case (DRESS ruled out)\n- **2-3:** Possible DRESS\n- **4-5:** Probable DRESS\n- **≥6:** Definite DRESS',
  clinicalPerformance:
    'The RegiSCAR scoring system has been validated in multiple cohorts with high diagnostic accuracy. In the original validation study, scores ≥6 had 85% sensitivity and 95% specificity for definite DRESS. The scoring system correlates well with expert consensus diagnosis (κ=0.87). Key strengths include systematic evaluation of clinical and laboratory features, accounting for incomplete presentations, and differentiation from other drug reactions. The tool has been adopted internationally and endorsed by dermatology and allergy societies for DRESS diagnosis.',
  formSections: regiscarFormSections,
  calculationLogic: (inputs) => {
    // Map inputs to RegiscarInput type
    const regiscarInput: RegiscarInput = {
      fever: inputs.fever as RegiscarInput['fever'],
      lymphadenopathy: inputs.lymphadenopathy as RegiscarInput['lymphadenopathy'],
      atypicalLymphocytes: inputs.atypicalLymphocytes as RegiscarInput['atypicalLymphocytes'],
      eosinophilia: inputs.eosinophilia as RegiscarInput['eosinophilia'],
      skinExtent50: inputs.skinExtent50 as RegiscarInput['skinExtent50'],
      skinFeatures2of4: inputs.skinFeatures2of4 as RegiscarInput['skinFeatures2of4'],
      biopsySuggestive: inputs.biopsySuggestive as RegiscarInput['biopsySuggestive'],
      organInvolvement: inputs.organInvolvement as RegiscarInput['organInvolvement'],
      resolutionGT15d: inputs.resolutionGT15d as RegiscarInput['resolutionGT15d'],
      altDxExcluded: inputs.altDxExcluded as RegiscarInput['altDxExcluded'],
    };

    // Use the regiscarCompute function from the full implementation
    const result = regiscarCompute(regiscarInput);
    const totalScore = result.score;

    let diagnosisCategory = '';
    let clinicalGuidance = '';
    let managementRecommendation = '';

    if (totalScore < 2) {
      diagnosisCategory = 'No case (DRESS ruled out)';
      clinicalGuidance = 'The clinical presentation does not meet criteria for DRESS syndrome.';
      managementRecommendation = 'Consider alternative diagnoses: simple drug eruption, viral exanthem, or other systemic conditions.';
    } else if (totalScore <= 3) {
      diagnosisCategory = 'Possible DRESS';
      clinicalGuidance = 'Clinical features suggest possible DRESS but do not meet full criteria.';
      managementRecommendation = 'Continue monitoring. Check HHV-6/EBV/CMV reactivation. Consider skin biopsy. May need to re-score if clinical picture evolves.';
    } else if (totalScore <= 5) {
      diagnosisCategory = 'Probable DRESS';
      clinicalGuidance = 'Clinical presentation is consistent with probable DRESS syndrome.';
      managementRecommendation = 'Immediate drug withdrawal. Initiate systemic corticosteroids (0.5-1 mg/kg/day). Monitor organ function closely. Screen for viral reactivation.';
    } else {
      diagnosisCategory = 'Definite DRESS';
      clinicalGuidance = 'The patient meets criteria for definite DRESS syndrome diagnosis.';
      managementRecommendation = 'Urgent management required: Immediate drug withdrawal, systemic corticosteroids (1-2 mg/kg/day), intensive monitoring. Consider pulse steroids or additional immunosuppression if severe organ involvement.';
    }

    // Generate detailed component summary from the result
    const componentDetails = [];
    const d = result.details;
    if (d.fever !== 0) componentDetails.push(`Fever: ${d.fever} points`);
    if (d.lymphadenopathy !== 0) componentDetails.push(`Lymphadenopathy: ${d.lymphadenopathy > 0 ? '+' : ''}${d.lymphadenopathy}`);
    if (d.atypical_lymphocytes !== 0) componentDetails.push(`Atypical lymphocytes: ${d.atypical_lymphocytes > 0 ? '+' : ''}${d.atypical_lymphocytes}`);
    if (d.eosinophilia !== 0) componentDetails.push(`Eosinophilia: ${d.eosinophilia > 0 ? '+' : ''}${d.eosinophilia}`);
    if (d.skin_extent_50 !== 0) componentDetails.push(`Skin extent >50%: ${d.skin_extent_50 > 0 ? '+' : ''}${d.skin_extent_50}`);
    if (d.skin_features_2of4 !== 0) componentDetails.push(`Skin features (2 of 4): ${d.skin_features_2of4 > 0 ? '+' : ''}${d.skin_features_2of4}`);
    if (d.biopsy !== 0) componentDetails.push(`Biopsy: ${d.biopsy > 0 ? '+' : ''}${d.biopsy}`);
    if (d.organ_involvement !== 0) componentDetails.push(`Organ involvement: ${d.organ_involvement > 0 ? '+' : ''}${d.organ_involvement}`);
    if (d.resolution_gt_15d !== 0) componentDetails.push(`Resolution >15 days: ${d.resolution_gt_15d > 0 ? '+' : ''}${d.resolution_gt_15d}`);
    if (d.alt_dx_excluded !== 0) componentDetails.push(`Alt diagnoses excluded: ${d.alt_dx_excluded > 0 ? '+' : ''}${d.alt_dx_excluded}`);

    const interpretation = `**RegiSCAR Score: ${totalScore} points**
**Diagnosis: ${diagnosisCategory}**

**Component Scores:**
${componentDetails.join('\n')}

**Clinical Guidance:**
${clinicalGuidance}

**Management Recommendations:**
${managementRecommendation}

**Important Considerations:**
- Drug culprit identification crucial (use ALDEN algorithm if needed)
- Monitor for complications: myocarditis, hepatitis, nephritis, pneumonitis
- Avoid re-exposure to culprit drug (cross-reactivity possible with related drugs)
- Long-term follow-up needed (autoimmune sequelae reported)
- Family counseling about HLA associations if severe case

**Severity Indicators Requiring ICU:**
- Transaminases >10× ULN
- Creatinine >3 mg/dL
- Lung involvement with hypoxia
- Hemophagocytosis
- Encephalitis`;

    return {
      score: totalScore,
      interpretation,
      details: {
        'Total_Score': totalScore,
        'Diagnosis_Category': diagnosisCategory,
        'Fever': d.fever,
        'Lymphadenopathy': d.lymphadenopathy,
        'Atypical_Lymphocytes': d.atypical_lymphocytes,
        'Eosinophilia': d.eosinophilia,
        'Skin_Extent_>50%': d.skin_extent_50,
        'Skin_Features_2of4': d.skin_features_2of4,
        'Biopsy': d.biopsy,
        'Organ_Involvement': d.organ_involvement,
        'Resolution_>15d': d.resolution_gt_15d,
        'Alt_Dx_Excluded': d.alt_dx_excluded,
      },
    };
  },
  references: [
    'Kardaun SH, Sidoroff A, Valeyrie-Allanore L, et al. Variability in the clinical pattern of cutaneous side-effects of drugs with systemic symptoms: does a DRESS syndrome really exist? Br J Dermatol. 2007;156(3):609-11.',
    'Kardaun SH, Sekula P, Valeyrie-Allanore L, et al. Drug reaction with eosinophilia and systemic symptoms (DRESS): an original multisystem adverse drug reaction. Results from the prospective RegiSCAR study. Br J Dermatol. 2013;169(5):1071-80.',
    'Cacoub P, Musette P, Descamps V, et al. The DRESS syndrome: a literature review. Am J Med. 2011;124(7):588-97.',
    'Husain Z, Reddy BY, Schwartz RA. DRESS syndrome: Part I. Clinical perspectives. J Am Acad Dermatol. 2013;68(5):693.e1-14.',
    'Choudhary S, McLeod M, Torchia D, Romanelli P. Drug Reaction with Eosinophilia and Systemic Symptoms (DRESS) Syndrome. J Clin Aesthet Dermatol. 2013;6(6):31-7.',
  ],
};