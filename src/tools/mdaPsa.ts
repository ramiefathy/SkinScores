import type { Tool, InputConfig, FormSectionConfig } from './types';
import { Target } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const mdaPsaFormSections: FormSectionConfig[] = [
  {
    id: 'tender_joints',
    label: 'Tender Joint Count (68 joints)',
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 68,
    step: 1,
    validation: getValidationSchema('number'),
    description: 'Number of tender joints out of 68 assessed. MDA criteria: ≤1 tender joint.',
  } as InputConfig,
  {
    id: 'swollen_joints',
    label: 'Swollen Joint Count (66 joints)',
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 66,
    step: 1,
    validation: getValidationSchema('number'),
    description: 'Number of swollen joints out of 66 assessed. MDA criteria: ≤1 swollen joint.',
  } as InputConfig,
  {
    id: 'pasi_score',
    label: 'PASI Score',
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 72,
    step: 0.1,
    validation: getValidationSchema('number'),
    description: 'Psoriasis Area and Severity Index score (0-72). MDA criteria: PASI ≤1.',
  } as InputConfig,
  {
    id: 'bsa_percentage',
    label: 'BSA Percentage (%)',
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 0.1,
    validation: getValidationSchema('number'),
    description: 'Body Surface Area affected by psoriasis. MDA criteria: BSA ≤3%.',
  } as InputConfig,
  {
    id: 'patient_pain_vas',
    label: 'Patient Pain VAS (0-100 mm)',
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
    validation: getValidationSchema('number'),
    description: 'Patient assessment of pain on 100mm visual analog scale. MDA criteria: ≤15mm.',
  } as InputConfig,
  {
    id: 'patient_global_vas',
    label: 'Patient Global Disease Activity VAS (0-100 mm)',
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
    validation: getValidationSchema('number'),
    description: 'Patient global assessment of disease activity. MDA criteria: ≤20mm.',
  } as InputConfig,
  {
    id: 'haq_di',
    label: 'HAQ-DI Score',
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 3,
    step: 0.125,
    validation: getValidationSchema('number'),
    description: 'Health Assessment Questionnaire Disability Index (0-3). MDA criteria: ≤0.5.',
  } as InputConfig,
  {
    id: 'entheseal_points',
    label: 'Tender Entheseal Points',
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 18,
    step: 1,
    validation: getValidationSchema('number'),
    description: 'Number of tender entheseal sites. MDA criteria: ≤1 tender entheseal point.',
  } as InputConfig,
];

export const mdaPsaTool: Tool = {
  id: 'mdaPsa',
  name: 'Minimal Disease Activity in Psoriatic Arthritis',
  acronym: 'MDA',
  condition: 'Psoriatic Arthritis',
  keywords: [
    'mda',
    'minimal disease activity',
    'psa',
    'psoriatic arthritis',
    'composite measure',
    'treat to target',
    'remission',
    'vlda',
  ],
  description:
    'The Minimal Disease Activity (MDA) criteria define a target state of low disease activity in psoriatic arthritis. Patients must meet 5 of 7 criteria to achieve MDA. Meeting all 7 criteria indicates Very Low Disease Activity (VLDA).',
  sourceType: 'Research',
  icon: Target,
  rationale:
    '**MDA Criteria (must meet 5 of 7):**\n1. Tender joint count ≤1 (of 68)\n2. Swollen joint count ≤1 (of 66)\n3. PASI ≤1 OR BSA ≤3%\n4. Patient pain VAS ≤15mm\n5. Patient global VAS ≤20mm\n6. HAQ-DI ≤0.5\n7. Tender entheseal points ≤1\n\n**Clinical Significance:**\n- **MDA:** 5/7 criteria met - Target state of low disease activity\n- **VLDA:** 7/7 criteria met - Remission-like state\n- **Near-MDA:** 4/7 criteria - Close to target\n\n**Treatment Implications:**\n- MDA achievement associated with better outcomes\n- 96% of MDA achievers show no radiographic progression\n- Superior quality of life and functional outcomes\n- Validated treatment target in guidelines\n\n**Advantages:**\n- Comprehensive assessment of all PsA domains\n- Binary outcome (achieved/not achieved)\n- Easy to use in clinical practice\n- Strong prognostic value',
  clinicalPerformance:
    'MDA demonstrates excellent psychometric properties with sensitivity ~91.4% and specificity ~98.7% for identifying low disease activity states. The criteria show strong predictive validity with 96% of MDA achievers showing no radiographic progression compared to 58% of non-achievers. In the TICOPA trial, treating to MDA target resulted in significantly better clinical outcomes. The criteria have been validated across multiple cohorts internationally. Studies show that achieving MDA is associated with better patient-reported outcomes, improved work productivity, and reduced healthcare costs. The MDA criteria correlate strongly with composite disease activity indices (DAPSA, CPDAI, PASDAS) but offer the advantage of a clear binary outcome. VLDA achievement represents an even more stringent target associated with true remission-like outcomes. The criteria have been endorsed by GRAPPA, EULAR, and ACR as valid treatment targets.',
  formSections: mdaPsaFormSections,
  calculationLogic: (inputs) => {
    const tenderJoints = Number(inputs.tender_joints) || 0;
    const swollenJoints = Number(inputs.swollen_joints) || 0;
    const pasiScore = Number(inputs.pasi_score) || 0;
    const bsaPercentage = Number(inputs.bsa_percentage) || 0;
    const patientPainVAS = Number(inputs.patient_pain_vas) || 0;
    const patientGlobalVAS = Number(inputs.patient_global_vas) || 0;
    const haqDi = Number(inputs.haq_di) || 0;
    const enthesealPoints = Number(inputs.entheseal_points) || 0;

    // Check each MDA criterion
    const criteria = {
      tenderJoints: tenderJoints <= 1,
      swollenJoints: swollenJoints <= 1,
      skinDisease: pasiScore <= 1 || bsaPercentage <= 3,
      patientPain: patientPainVAS <= 15,
      patientGlobal: patientGlobalVAS <= 20,
      function: haqDi <= 0.5,
      enthesitis: enthesealPoints <= 1,
    };

    // Count met criteria
    const metCriteria = Object.values(criteria).filter(met => met).length;

    // Determine MDA status
    const mdaStatus = metCriteria >= 5 ? 'MDA Achieved' : 'MDA Not Achieved';
    const vldaStatus = metCriteria === 7 ? 'VLDA Achieved' : '';
    const nearMda = metCriteria === 4 ? 'Near-MDA (4/7 criteria)' : '';

    // Clinical interpretation
    let clinicalSignificance = '';
    let treatmentRecommendation = '';

    if (metCriteria === 7) {
      clinicalSignificance = 'Patient has achieved Very Low Disease Activity (VLDA) - a remission-like state with excellent prognosis.';
      treatmentRecommendation = 'Maintain current therapy. Consider cautious tapering of biologics/DMARDs if sustained VLDA >6 months.';
    } else if (metCriteria >= 5) {
      clinicalSignificance = 'Patient has achieved Minimal Disease Activity (MDA) - the recommended treatment target for PsA.';
      treatmentRecommendation = 'Continue current effective therapy. Monitor for sustained MDA. Consider treatment optimization if not achieving VLDA.';
    } else if (metCriteria === 4) {
      clinicalSignificance = 'Patient is near-MDA with 4/7 criteria met. Close to achieving treatment target.';
      treatmentRecommendation = 'Optimize current therapy or consider treatment escalation. Focus on domains not meeting criteria.';
    } else {
      clinicalSignificance = 'Patient has not achieved MDA. Active disease requiring treatment optimization.';
      treatmentRecommendation = 'Treatment escalation indicated. Consider adding/switching DMARD or biologic therapy based on predominant disease manifestations.';
    }

    // Domain-specific feedback
    const domainFeedback = [];
    if (!criteria.tenderJoints) domainFeedback.push(`Tender joints: ${tenderJoints} (target ≤1)`);
    if (!criteria.swollenJoints) domainFeedback.push(`Swollen joints: ${swollenJoints} (target ≤1)`);
    if (!criteria.skinDisease) domainFeedback.push(`Skin: PASI ${pasiScore}, BSA ${bsaPercentage}% (target PASI ≤1 or BSA ≤3%)`);
    if (!criteria.patientPain) domainFeedback.push(`Pain VAS: ${patientPainVAS}mm (target ≤15mm)`);
    if (!criteria.patientGlobal) domainFeedback.push(`Patient global: ${patientGlobalVAS}mm (target ≤20mm)`);
    if (!criteria.function) domainFeedback.push(`HAQ-DI: ${haqDi} (target ≤0.5)`);
    if (!criteria.enthesitis) domainFeedback.push(`Entheseal points: ${enthesealPoints} (target ≤1)`);

    const interpretation = `**MDA Assessment: ${metCriteria}/7 criteria met**

**Status:** ${vldaStatus || mdaStatus} ${nearMda ? `(${nearMda})` : ''}

**Criteria Met:**
- Tender joints ≤1: ${criteria.tenderJoints ? '✓' : '✗'} (${tenderJoints})
- Swollen joints ≤1: ${criteria.swollenJoints ? '✓' : '✗'} (${swollenJoints})
- PASI ≤1 or BSA ≤3%: ${criteria.skinDisease ? '✓' : '✗'} (PASI: ${pasiScore}, BSA: ${bsaPercentage}%)
- Patient pain ≤15mm: ${criteria.patientPain ? '✓' : '✗'} (${patientPainVAS}mm)
- Patient global ≤20mm: ${criteria.patientGlobal ? '✓' : '✗'} (${patientGlobalVAS}mm)
- HAQ-DI ≤0.5: ${criteria.function ? '✓' : '✗'} (${haqDi})
- Entheseal points ≤1: ${criteria.enthesitis ? '✓' : '✗'} (${enthesealPoints})

**Clinical Significance:**
${clinicalSignificance}

**Treatment Recommendations:**
${treatmentRecommendation}

${domainFeedback.length > 0 ? `**Domains Not Meeting Criteria:**\n${domainFeedback.map(f => `- ${f}`).join('\n')}` : ''}

**Prognostic Information:**
- MDA achievers: 96% show no radiographic progression
- VLDA achievers: Superior long-term outcomes
- Sustained MDA/VLDA associated with better QoL and function`;

    return {
      score: metCriteria,
      interpretation,
      details: {
        'Criteria_Met': `${metCriteria}/7`,
        'MDA_Status': mdaStatus,
        'VLDA_Status': vldaStatus || 'Not Achieved',
        'Tender_Joints': `${tenderJoints} (${criteria.tenderJoints ? 'Met' : 'Not Met'})`,
        'Swollen_Joints': `${swollenJoints} (${criteria.swollenJoints ? 'Met' : 'Not Met'})`,
        'Skin_Criteria': criteria.skinDisease ? 'Met' : 'Not Met',
        'Patient_Pain': `${patientPainVAS}mm (${criteria.patientPain ? 'Met' : 'Not Met'})`,
        'Patient_Global': `${patientGlobalVAS}mm (${criteria.patientGlobal ? 'Met' : 'Not Met'})`,
        'HAQ_DI': `${haqDi} (${criteria.function ? 'Met' : 'Not Met'})`,
        'Enthesitis': `${enthesealPoints} (${criteria.enthesitis ? 'Met' : 'Not Met'})`,
      },
    };
  },
  references: [
    'Coates LC, Fransen J, Helliwell PS. Defining minimal disease activity in psoriatic arthritis: a proposed objective target for treatment. Ann Rheum Dis. 2010;69(1):48-53.',
    'Coates LC, Helliwell PS. Validation of minimal disease activity criteria for psoriatic arthritis using interventional trial data. Arthritis Care Res. 2010;62(7):965-9.',
    'Gossec L, McGonagle D, Korotaeva T, et al. Minimal disease activity as a treatment target in psoriatic arthritis: a review of the literature. J Rheumatol. 2018;45(1):6-13.',
    'Queiro R, Cañete JD, Montilla C, et al. Very low disease activity, DAPSA remission, and impact of disease in a Spanish population with psoriatic arthritis. J Rheumatol. 2019;46(7):710-715.',
    'Wervers K, Vis M, Tchetverikov I, et al. Burden of psoriatic arthritis according to different definitions of disease activity: comparing minimal disease activity and the disease activity index for psoriatic arthritis. Arthritis Care Res. 2018;70(12):1764-1770.',
  ],
};