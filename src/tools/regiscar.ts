import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { AlertOctagon } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

// Define option arrays first so they can be referenced
const feverOptions: InputOption[] = [
  { value: -1, label: 'No: -1 point' },
  { value: 0, label: 'Yes: 0 points' },
];

const lymphNodeOptions: InputOption[] = [
  { value: 0, label: 'No: 0 points' },
  { value: 1, label: 'Yes: +1 point' },
];

const eosinophiliaOptions: InputOption[] = [
  { value: 0, label: 'No eosinophilia: 0 points' },
  { value: 1, label: '0.7-1.5×10⁹/L OR 10-19.9% if WBC <4×10⁹/L: +1 point' },
  { value: 2, label: '>1.5×10⁹/L OR ≥20% if WBC <4×10⁹/L: +2 points' },
];

const atypicalLymphOptions: InputOption[] = [
  { value: 0, label: 'No: 0 points' },
  { value: 1, label: 'Yes: +1 point' },
];

const skinInvolvementOptions: InputOption[] = [
  { value: -2, label: 'No rash: -2 points' },
  { value: -1, label: 'Rash of unknown extent: -1 point' },
  { value: 0, label: 'Rash covering <50% BSA: 0 points' },
  { value: 1, label: 'Rash covering ≥50% BSA: +1 point' },
];

const skinRashOptions: InputOption[] = [
  { value: -1, label: 'Pustular: -1 point' },
  { value: 0, label: 'Other: 0 points' },
  { value: 1, label: 'At least 2 of: purpuric, infiltrative, facial edema, desquamation: +1 point' },
];

const biopsyOptions: InputOption[] = [
  { value: -1, label: 'None or other diagnosis: -1 point' },
  { value: 1, label: 'Suggestive of DRESS: +1 point' },
];

const organOptions: InputOption[] = [
  { value: 0, label: 'No: 0 points' },
  { value: 0, label: 'One organ: 0 points' },
  { value: 1, label: 'Two or more organs: +1 point' },
];

const resolutionOptions: InputOption[] = [
  { value: -1, label: '<15 days: -1 point' },
  { value: 0, label: '≥15 days or unknown: 0 points' },
];

const exclusionOptions: InputOption[] = [
  { value: -1, label: 'At least one: ALT/AST 3× decrease, eosinophilia 2× decrease, creatinine 1.5× decrease in 3 days: -1 point' },
  { value: 0, label: 'Other patterns or unknown: 0 points' },
];

const regiscarFormSections: FormSectionConfig[] = [
  {
    id: 'fever',
    label: '1. Fever ≥38.5°C',
    type: 'select',
    options: feverOptions,
    defaultValue: -1,
    validation: getValidationSchema('select', feverOptions),
    description: 'Documented fever ≥38.5°C (101.3°F) during the reaction.',
  } as InputConfig,
  {
    id: 'lymph_nodes',
    label: '2. Enlarged Lymph Nodes (≥2 sites, >1cm)',
    type: 'select',
    options: lymphNodeOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', lymphNodeOptions),
    description: 'Enlarged lymph nodes at ≥2 sites with size >1cm.',
  } as InputConfig,
  {
    id: 'eosinophilia',
    label: '3. Eosinophilia',
    type: 'select',
    options: eosinophiliaOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', eosinophiliaOptions),
    description: 'Eosinophil count (use percentage if leukopenia present).',
  } as InputConfig,
  {
    id: 'atypical_lymphocytes',
    label: '4. Atypical Lymphocytes',
    type: 'select',
    options: atypicalLymphOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', atypicalLymphOptions),
    description: 'Presence of atypical lymphocytes on blood smear.',
  } as InputConfig,
  {
    id: 'skin_involvement',
    label: '5. Skin Involvement - Extent of Rash',
    type: 'select',
    options: skinInvolvementOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', skinInvolvementOptions),
    description: 'Extent of skin rash as percentage of body surface area.',
  } as InputConfig,
  {
    id: 'skin_rash',
    label: '6. Skin Rash Morphology',
    type: 'select',
    options: skinRashOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', skinRashOptions),
    description: 'Morphological characteristics of the rash.',
  } as InputConfig,
  {
    id: 'biopsy',
    label: '7. Biopsy Suggesting DRESS',
    type: 'select',
    options: biopsyOptions,
    defaultValue: -1,
    validation: getValidationSchema('select', biopsyOptions),
    description: 'Skin biopsy findings consistent with DRESS.',
  } as InputConfig,
  {
    id: 'organ_involvement',
    label: '8. Organ Involvement',
    type: 'select',
    options: organOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', organOptions),
    description: 'Number of internal organs involved (liver, kidney, lung, muscle, heart, pancreas, other).',
  } as InputConfig,
  {
    id: 'resolution',
    label: '9. Resolution ≥15 Days',
    type: 'select',
    options: resolutionOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', resolutionOptions),
    description: 'Time to resolution after drug withdrawal.',
  } as InputConfig,
  {
    id: 'exclusions',
    label: '10. Exclusion of Other Causes',
    type: 'select',
    options: exclusionOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', exclusionOptions),
    description: 'Rapid improvement suggesting acute viral infection rather than DRESS.',
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
    const fever = Number(inputs.fever) || 0;
    const lymphNodes = Number(inputs.lymph_nodes) || 0;
    const eosinophilia = Number(inputs.eosinophilia) || 0;
    const atypicalLymphocytes = Number(inputs.atypical_lymphocytes) || 0;
    const skinInvolvement = Number(inputs.skin_involvement) || 0;
    const skinRash = Number(inputs.skin_rash) || 0;
    const biopsy = Number(inputs.biopsy) || 0;
    const organInvolvement = Number(inputs.organ_involvement) || 0;
    const resolution = Number(inputs.resolution) || 0;
    const exclusions = Number(inputs.exclusions) || 0;

    const totalScore =
      fever + lymphNodes + eosinophilia + atypicalLymphocytes +
      skinInvolvement + skinRash + biopsy + organInvolvement +
      resolution + exclusions;

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

    // Generate detailed component summary
    const componentDetails = [];
    if (fever !== 0) componentDetails.push(`Fever: ${fever} points`);
    if (lymphNodes !== 0) componentDetails.push(`Lymph nodes: +${lymphNodes}`);
    if (eosinophilia !== 0) componentDetails.push(`Eosinophilia: +${eosinophilia}`);
    if (atypicalLymphocytes !== 0) componentDetails.push(`Atypical lymphocytes: +${atypicalLymphocytes}`);
    if (skinInvolvement !== 0) componentDetails.push(`Skin extent: ${skinInvolvement}`);
    if (skinRash !== 0) componentDetails.push(`Rash morphology: ${skinRash}`);
    if (biopsy !== 0) componentDetails.push(`Biopsy: ${biopsy}`);
    if (organInvolvement !== 0) componentDetails.push(`Organ involvement: +${organInvolvement}`);
    if (resolution !== 0) componentDetails.push(`Resolution time: ${resolution}`);
    if (exclusions !== 0) componentDetails.push(`Exclusion criteria: ${exclusions}`);

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
        'Fever': fever,
        'Lymph_Nodes': lymphNodes,
        'Eosinophilia': eosinophilia,
        'Atypical_Lymphocytes': atypicalLymphocytes,
        'Skin_Involvement': skinInvolvement,
        'Skin_Rash': skinRash,
        'Biopsy': biopsy,
        'Organ_Involvement': organInvolvement,
        'Resolution': resolution,
        'Exclusions': exclusions,
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