import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { AlertOctagon } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const regiscarFormSections: FormSectionConfig[] = [
  {
    id: 'fever',
    label: '1. Fever ≥38.5°C',
    type: 'select',
    options: [
      { value: -1, label: 'No: -1 point' },
      { value: 0, label: 'Yes: 0 points' },
    ],
    defaultValue: -1,
    validation: getValidationSchema('select'),
    description: 'Documented fever ≥38.5°C (101.3°F) during the reaction.',
  } as InputConfig,
  {
    id: 'lymph_nodes',
    label: '2. Enlarged Lymph Nodes (≥2 sites, >1cm)',
    type: 'select',
    options: [
      { value: 0, label: 'No: 0 points' },
      { value: 1, label: 'Yes: +1 point' },
    ],
    defaultValue: 0,
    validation: getValidationSchema('select'),
    description: 'Enlarged lymph nodes at ≥2 sites with size >1cm.',
  } as InputConfig,
  {
    id: 'eosinophilia',
    label: '3. Eosinophilia',
    type: 'select',
    options: [
      { value: 0, label: 'No eosinophilia: 0 points' },
      { value: 1, label: '0.7-1.5×10⁹/L OR 10-19.9% if WBC <4×10⁹/L: +1 point' },
      { value: 2, label: '>1.5×10⁹/L OR ≥20% if WBC <4×10⁹/L: +2 points' },
    ],
    defaultValue: 0,
    validation: getValidationSchema('select'),
    description: 'Eosinophil count (use percentage if leukopenia present).',
  } as InputConfig,
  {
    id: 'atypical_lymphocytes',
    label: '4. Atypical Lymphocytes',
    type: 'select',
    options: [
      { value: 0, label: 'No: 0 points' },
      { value: 1, label: 'Yes: +1 point' },
    ],
    defaultValue: 0,
    validation: getValidationSchema('select'),
    description: 'Presence of atypical lymphocytes on blood smear.',
  } as InputConfig,
  {
    id: 'skin_extent',
    label: '5a. Skin Involvement - Extent',
    type: 'select',
    options: [
      { value: 0, label: '<50% BSA: 0 points' },
      { value: 1, label: '>50% BSA: +1 point' },
    ],
    defaultValue: 0,
    validation: getValidationSchema('select'),
    description: 'Extent of skin rash (body surface area).',
  } as InputConfig,
  {
    id: 'skin_suggestive',
    label: '5b. Skin Involvement - Rash Suggestive of DRESS',
    type: 'select',
    options: [
      { value: 0, label: 'No (0-1 features): 0 points' },
      { value: 1, label: 'Yes (≥2 features): +1 point' },
    ],
    defaultValue: 0,
    validation: getValidationSchema('select'),
    description: 'Features: facial edema, purpura, infiltration, desquamation. Need ≥2 for +1 point.',
  } as InputConfig,
  {
    id: 'skin_biopsy',
    label: '5c. Skin Involvement - Biopsy Suggesting DRESS',
    type: 'select',
    options: [
      { value: -1, label: 'No/Not done: -1 point' },
      { value: 1, label: 'Yes: +1 point' },
    ],
    defaultValue: -1,
    validation: getValidationSchema('select'),
    description: 'Skin biopsy with histological features suggesting DRESS.',
  } as InputConfig,
  {
    id: 'organ_involvement',
    label: '6. Organ Involvement',
    type: 'select',
    options: [
      { value: 0, label: 'No organ involvement: 0 points' },
      { value: 1, label: '1 organ involved: +1 point' },
      { value: 2, label: '≥2 organs involved: +2 points' },
    ],
    defaultValue: 0,
    validation: getValidationSchema('select'),
    description: 'Liver (ALT >2×ULN), kidney (↑creatinine), lung (dyspnea, infiltrates), heart (myocarditis), etc.',
  } as InputConfig,
  {
    id: 'resolution_time',
    label: '7. Resolution ≥15 Days',
    type: 'select',
    options: [
      { value: -1, label: 'No (<15 days): -1 point' },
      { value: 0, label: 'Yes (≥15 days) or Unknown: 0 points' },
    ],
    defaultValue: 0,
    validation: getValidationSchema('select'),
    description: 'Time to resolution of symptoms after drug discontinuation.',
  } as InputConfig,
  {
    id: 'other_causes',
    label: '8. Evaluation of Other Causes',
    type: 'select',
    options: [
      { value: 0, label: '<3 tests done or positive: 0 points' },
      { value: 1, label: '≥3 tests negative: +1 point' },
    ],
    defaultValue: 0,
    validation: getValidationSchema('select'),
    description: 'Tests: ANA, hepatitis serology, blood culture, Mycoplasma/Chlamydia (≥3 must be negative).',
  } as InputConfig,
];

export const regiscarTool: Tool = {
  id: 'regiscar',
  name: 'RegiSCAR DRESS Validation Score',
  acronym: 'RegiSCAR',
  condition: 'Drug Reaction with Eosinophilia and Systemic Symptoms (DRESS)',
  keywords: [
    'regiscar',
    'dress',
    'drug reaction',
    'eosinophilia',
    'systemic symptoms',
    'drug hypersensitivity',
    'dihs',
    'adverse drug reaction',
  ],
  description:
    'The RegiSCAR scoring system is the gold standard for diagnosing DRESS syndrome. It evaluates clinical and laboratory criteria to determine the probability of DRESS diagnosis, ranging from excluded to definite.',
  sourceType: 'Clinical Guideline',
  icon: AlertOctagon,
  rationale:
    '**DRESS Syndrome Features:**\n- Drug reaction with eosinophilia and systemic symptoms\n- Typical onset: 2-8 weeks after drug initiation\n- Mortality: 3.8% (primarily from fulminant hepatitis)\n\n**Key Clinical Features:**\n- Fever, lymphadenopathy\n- Extensive skin rash (often >50% BSA)\n- Hematologic abnormalities (eosinophilia, atypical lymphocytes)\n- Internal organ involvement (liver 70-90%, kidney 10-35%)\n- Prolonged course (≥15 days)\n\n**Common Culprit Drugs:**\n- Anticonvulsants (carbamazepine, phenytoin, lamotrigine)\n- Allopurinol\n- Sulfonamides\n- Minocycline\n- Abacavir\n\n**Viral Reactivation Pattern:**\nHHV-6/EBV (11-16 days) → CMV (23 days)',
  clinicalPerformance:
    'The RegiSCAR score was developed from a prospective multinational registry of 117 validated cases. It shows excellent diagnostic performance with 93.3% of patients qualifying as probable/definite DRESS vs. 77.1% with Bocquet criteria. Recent validation studies report sensitivity of 94.3%, specificity of 60%, PPV of 80.5%, and NPV of 85.7%. The score correlates well with alternative biomarker models (TBSA + eosinophil count + hsCRP) which achieved 96% sensitivity and 100% specificity. Inter-rater reliability is moderate to good. The RegiSCAR system is superior to J-SCAR criteria (which only identified 18.8% of patients as atypical DIHS) for clinical use. Viral reactivation testing (HHV-6, EBV, CMV) is recommended but not required for scoring.',
  formSections: regiscarFormSections,
  calculationLogic: (inputs) => {
    const scores = {
      fever: Number(inputs.fever) || 0,
      lymphNodes: Number(inputs.lymph_nodes) || 0,
      eosinophilia: Number(inputs.eosinophilia) || 0,
      atypicalLymphocytes: Number(inputs.atypical_lymphocytes) || 0,
      skinExtent: Number(inputs.skin_extent) || 0,
      skinSuggestive: Number(inputs.skin_suggestive) || 0,
      skinBiopsy: Number(inputs.skin_biopsy) || 0,
      organInvolvement: Number(inputs.organ_involvement) || 0,
      resolutionTime: Number(inputs.resolution_time) || 0,
      otherCauses: Number(inputs.other_causes) || 0,
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    let diagnosisCategory = '';
    let clinicalAction = '';

    if (totalScore < 2) {
      diagnosisCategory = 'No case (DRESS ruled out)';
      clinicalAction = 'Investigate alternative diagnoses';
    } else if (totalScore <= 3) {
      diagnosisCategory = 'Possible DRESS';
      clinicalAction = 'Consider DRESS, monitor closely, evaluate other causes';
    } else if (totalScore <= 5) {
      diagnosisCategory = 'Probable DRESS';
      clinicalAction = 'Likely DRESS - initiate treatment, stop culprit drug';
    } else {
      diagnosisCategory = 'Definite DRESS';
      clinicalAction = 'Confirmed DRESS - immediate treatment required';
    }

    const interpretation = `RegiSCAR Score: ${totalScore} (Range: -4 to 9). Diagnosis: ${diagnosisCategory}.

**Score Interpretation:**
- <2: No case - DRESS ruled out
- 2-3: Possible DRESS
- 4-5: Probable DRESS
- >5: Definite DRESS

**Clinical Action:** ${clinicalAction}

**Organ Involvement Criteria:**
- Liver: ALT >2×ULN (most common, 70-90%)
- Kidney: ↑creatinine, proteinuria (10-35%)
- Lung: Dyspnea, infiltrates
- Heart: Myocarditis (rare but high mortality)

**Recommended Viral Testing:** HHV-6, EBV, CMV PCR on admission and at 2-3 weeks

**Note:** Score ≥4 warrants DRESS treatment protocols. Consider systemic corticosteroids for organ involvement.`;

    return {
      score: totalScore,
      interpretation,
      details: {
        'Fever': scores.fever,
        'Lymph Nodes': scores.lymphNodes,
        'Eosinophilia': scores.eosinophilia,
        'Atypical Lymphocytes': scores.atypicalLymphocytes,
        'Skin Extent': scores.skinExtent,
        'Skin Suggestive': scores.skinSuggestive,
        'Skin Biopsy': scores.skinBiopsy,
        'Organ Involvement': scores.organInvolvement,
        'Resolution Time': scores.resolutionTime,
        'Other Causes Excluded': scores.otherCauses,
        'Total Score': totalScore,
        'Diagnosis Category': diagnosisCategory,
      },
    };
  },
  references: [
    'Kardaun SH, Sidoroff A, Valeyrie-Allanore L, et al. Variability in the clinical pattern of cutaneous side-effects of drugs with systemic symptoms: does a DRESS syndrome really exist? Br J Dermatol. 2007;156(3):609-11.',
    'Kardaun SH, Sekula P, Valeyrie-Allanore L, et al. Drug reaction with eosinophilia and systemic symptoms (DRESS): an original multisystem adverse drug reaction. Results from the prospective RegiSCAR study. Br J Dermatol. 2013;169(5):1071-80.',
    'Singh A, Jain M, Chhari A, et al. RegiSCAR DRESS validation scoring system and Japanese consensus group criteria for drug-induced hypersensitivity syndrome/drug reaction with eosinophilia and systemic symptoms: A comparative analysis. Indian J Dermatol Venereol Leprol. 2022;88(2):160-167.',
    'Cabañas R, Ramírez E, Sendagorta E, et al. Spanish Guidelines for Diagnosis, Management, Treatment, and Prevention of DRESS Syndrome. J Investig Allergol Clin Immunol. 2020;30(4):229-253.',
    'Cho YT, Yang CW, Chu CY. Drug Reaction with Eosinophilia and Systemic Symptoms (DRESS): An Interplay among Drugs, Viruses, and Immune System. Int J Mol Sci. 2017;18(6):1243.',
  ],
};