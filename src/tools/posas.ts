import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from './types';
import { Eye } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

// 1-10 scale options for all parameters
const posasScaleOptions: InputOption[] = [
  { value: 1, label: '1 - Normal skin' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10 - Worst possible' },
];

// Observer Scale parameters
const observerParameters = [
  {
    id: 'vascularity',
    label: 'Vascularity',
    description: 'Presence of blood vessels causing pink/red/purple color (test with pressure)',
  },
  {
    id: 'pigmentation',
    label: 'Pigmentation',
    description: 'Hypo/hyperpigmentation that remains after eliminating vascular color',
  },
  {
    id: 'thickness',
    label: 'Thickness',
    description: 'Scar thickness compared to normal skin (can be hypertrophic or atrophic)',
  },
  {
    id: 'relief',
    label: 'Relief (Surface Roughness)',
    description: 'Surface irregularities, particularly visible after split skin grafting',
  },
  {
    id: 'pliability',
    label: 'Pliability',
    description: 'Suppleness when pinched between thumb and index finger',
  },
  {
    id: 'surface_area',
    label: 'Surface Area',
    description: 'Expansion, contraction, or mixed pattern compared to original wound',
  },
];

// Patient Scale parameters
const patientParameters = [
  {
    id: 'pain',
    label: 'Pain',
    description: 'How painful has your scar been?',
  },
  {
    id: 'itch',
    label: 'Itch',
    description: 'How itchy has your scar been?',
  },
  {
    id: 'color',
    label: 'Color',
    description: 'Is the color of your scar different from normal skin?',
  },
  {
    id: 'stiffness',
    label: 'Stiffness',
    description: 'Is your scar stiffer than normal skin?',
  },
  {
    id: 'thickness',
    label: 'Thickness',
    description: 'Is the thickness of your scar different from normal skin?',
  },
  {
    id: 'irregularity',
    label: 'Surface Irregularity',
    description: 'Is your scar more irregular (bumpy/ridged) than normal skin?',
  },
];

// Create form sections for Observer Scale
const observerFormSections: InputConfig[] = observerParameters.map((param) => ({
  id: `observer_${param.id}`,
  label: param.label,
  type: 'select',
  options: posasScaleOptions,
  defaultValue: 1,
  validation: getValidationSchema('select', posasScaleOptions, 1, 10),
  description: param.description,
}));

// Create form sections for Patient Scale
const patientFormSections: InputConfig[] = patientParameters.map((param) => ({
  id: `patient_${param.id}`,
  label: param.label,
  type: 'select',
  options: posasScaleOptions,
  defaultValue: 1,
  validation: getValidationSchema('select', posasScaleOptions, 1, 10),
  description: param.description,
}));

export const posasTool: Tool = {
  id: 'posas',
  name: 'Patient and Observer Scar Assessment Scale v2.0',
  acronym: 'POSAS',
  condition: 'Scar Assessment',
  keywords: [
    'posas',
    'scar',
    'scar assessment',
    'burn scar',
    'surgical scar',
    'keloid',
    'hypertrophic scar',
    'patient reported',
  ],
  description:
    'POSAS v2.0 is a comprehensive scar assessment tool that combines both observer (clinician) and patient perspectives. Each scale has 6 parameters scored 1-10, providing unique dual-perspective evaluation of scar quality.',
  sourceType: 'Research',
  icon: Eye,
  rationale:
    '**Dual Perspective Assessment:**\n- Observer Scale: Clinical evaluation by healthcare provider\n- Patient Scale: Subjective assessment by patient\n- Both perspectives are essential for comprehensive evaluation\n\n**Scoring (v2.0):**\n- 6 parameters per scale\n- 1-10 points per parameter\n- Score 1 = Normal skin\n- Score 10 = Worst possible scar\n- Total range: 6-60 per scale\n\n**Observer Parameters:**\n1. Vascularity (vascular color)\n2. Pigmentation (color after pressure)\n3. Thickness (vs normal skin)\n4. Relief (surface roughness)\n5. Pliability (suppleness)\n6. Surface area (expansion/contraction)\n\n**Patient Parameters:**\n1. Pain\n2. Itch\n3. Color difference\n4. Stiffness\n5. Thickness difference\n6. Irregularity (bumps/ridges)\n\n**Clinical Significance:**\n- MCID: <0.75 points change per item\n- Higher scores = poorer scar quality\n- Scales analyzed separately (not combined)',
  clinicalPerformance:
    'POSAS v2.0 demonstrates strong psychometric properties with Observer Scale person reliability of 0.82 and Patient Scale reliability of 0.77. Inter-observer reliability is substantial (0.80), with internal consistency showing Cronbach\'s α = 0.77-0.93 across studies. Test-retest reliability is excellent (ICC = 0.74-0.94). Rasch analysis confirms adequate fit for both scales as unidimensional questionnaires. The tool has been successfully validated across multiple scar types (burns, surgery, trauma, acne, keloids) and in multiple languages. In validation studies, n=1,629 observer scores and n=1,427 patient scores demonstrated adequate psychometric properties. The SCAR-Q study (n=731) included 354 surgical, 184 burn, and 199 traumatic scars across four countries. Portuguese validation showed strong internal consistency (r > 0.9), and Turkish validation proved validity for hypertrophic scars. The minimal clinically important difference (MCID) of <0.75 points per item helps interpret meaningful changes. Note that palpation is required for accurate assessment of pliability and thickness, making the tool unsuitable for photographic evaluation.',
  formSections: [
    {
      id: 'observer_section',
      title: 'OBSERVER SCALE (Clinician Assessment)',
      description:
        'Evaluate each parameter compared to normal skin. Score 1 = normal skin, 10 = worst possible scar characteristic.',
      gridCols: 2,
      inputs: observerFormSections,
    } as InputGroupConfig,
    {
      id: 'patient_section',
      title: 'PATIENT SCALE (Patient Self-Assessment)',
      description:
        'Rate your scar for each parameter. Score 1 = like normal skin, 10 = worst imaginable.',
      gridCols: 2,
      inputs: patientFormSections,
    } as InputGroupConfig,
    {
      id: 'overall_opinions',
      title: 'Overall Opinions (Not included in total scores)',
      gridCols: 2,
      inputs: [
        {
          id: 'observer_overall',
          label: 'Observer Overall Opinion',
          type: 'select',
          options: posasScaleOptions,
          defaultValue: 1,
          validation: getValidationSchema('select', posasScaleOptions, 1, 10),
          description: 'Overall scar assessment by observer',
        },
        {
          id: 'patient_overall',
          label: 'Patient Overall Opinion',
          type: 'select',
          options: posasScaleOptions,
          defaultValue: 1,
          validation: getValidationSchema('select', posasScaleOptions, 1, 10),
          description: 'Overall scar assessment by patient',
        },
      ] as InputConfig[],
    } as InputGroupConfig,
  ],
  calculationLogic: (inputs) => {
    // Calculate Observer Scale
    let observerTotal = 0;
    const observerScores: Record<string, number> = {};
    observerParameters.forEach((param) => {
      const score = Number(inputs[`observer_${param.id}`]) || 1;
      observerTotal += score;
      observerScores[param.label] = score;
    });

    // Calculate Patient Scale
    let patientTotal = 0;
    const patientScores: Record<string, number> = {};
    patientParameters.forEach((param) => {
      const score = Number(inputs[`patient_${param.id}`]) || 1;
      patientTotal += score;
      patientScores[param.label] = score;
    });

    const observerOverall = Number(inputs.observer_overall) || 1;
    const patientOverall = Number(inputs.patient_overall) || 1;

    // Determine scar quality categories
    const getQualityCategory = (score: number) => {
      if (score <= 12) return 'Excellent (near normal skin)';
      if (score <= 24) return 'Good';
      if (score <= 36) return 'Fair';
      if (score <= 48) return 'Poor';
      return 'Very poor';
    };

    const observerQuality = getQualityCategory(observerTotal);
    const patientQuality = getQualityCategory(patientTotal);

    const interpretation = `POSAS v2.0 Assessment Complete

**OBSERVER SCALE**
Total Score: ${observerTotal}/60
Quality: ${observerQuality}
Overall Opinion: ${observerOverall}/10

**PATIENT SCALE**
Total Score: ${patientTotal}/60
Quality: ${patientQuality}
Overall Opinion: ${patientOverall}/10

**Interpretation Guidelines:**
- Lower scores indicate better scar quality (6 = normal skin)
- Higher scores indicate poorer scar quality (60 = worst)
- Observer and Patient scales should be interpreted separately
- Overall opinions provide additional clinical context but are not included in totals

**Clinical Significance:**
- MCID: Changes <0.75 points per item are clinically meaningful
- Score 6-12: Excellent quality (near normal)
- Score 13-24: Good quality
- Score 25-36: Fair quality
- Score 37-48: Poor quality
- Score 49-60: Very poor quality

**Clinical Notes:**
${observerTotal > patientTotal
  ? 'Observer scores higher than patient - consider patient adaptation/acceptance'
  : patientTotal > observerTotal
  ? 'Patient scores higher than observer - address patient concerns and symptoms'
  : 'Similar observer and patient perspectives'}

**Treatment Considerations:**
${observerTotal > 36 || patientTotal > 36
  ? 'Poor scar quality - consider active scar management (silicone, pressure, laser, surgery)'
  : observerTotal > 24 || patientTotal > 24
  ? 'Fair scar quality - consider conservative scar management'
  : 'Good to excellent scar quality - routine monitoring'}`;

    return {
      score: observerTotal, // Primary score is Observer total
      interpretation,
      details: {
        'Observer_Total': observerTotal,
        'Observer_Quality': observerQuality,
        'Observer_Overall_Opinion': observerOverall,
        'Observer_Scores': observerScores,
        'Patient_Total': patientTotal,
        'Patient_Quality': patientQuality,
        'Patient_Overall_Opinion': patientOverall,
        'Patient_Scores': patientScores,
        'Score_Discrepancy': Math.abs(observerTotal - patientTotal),
      },
    };
  },
  references: [
    'Draaijers LJ, Tempelman FR, Botman YA, et al. The patient and observer scar assessment scale: a reliable and feasible tool for scar evaluation. Plast Reconstr Surg. 2004;113(7):1960-5.',
    'van de Kar AL, Corion LU, Smeulders MJ, et al. Reliable and feasible evaluation of linear scars by the Patient and Observer Scar Assessment Scale. Plast Reconstr Surg. 2005;116(2):514-22.',
    'Vercelli S, Ferriero G, Sartorio F, et al. How to assess postsurgical scars: a review of outcome measures. Disabil Rehabil. 2009;31(25):2055-63.',
    'Truong PT, Lee JC, Soer B, et al. Reliability and validity testing of the Patient and Observer Scar Assessment Scale in evaluating linear scars after breast cancer surgery. Plast Reconstr Surg. 2007;119(2):487-94.',
    'Nicholas RS, Falvey H, Lemonas P, et al. Patient-related keloid scar assessment and outcome measures. Plast Reconstr Surg. 2012;129(3):648-56.',
  ],
};