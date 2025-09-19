import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { AlertTriangle } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const timeDelayOptions: InputOption[] = [
  { value: -3, label: 'Index day (same day): -3 points' },
  { value: 1, label: '1-4 days: +1 point' },
  { value: 3, label: '5-28 days: +3 points' },
  { value: 2, label: '29-56 days: +2 points' },
  { value: -1, label: '>56 days: -1 point' },
  { value: 3, label: 'Rechallenge 1-4 days: +3 points' },
  { value: 1, label: 'Rechallenge 5-56 days: +1 point' },
];

const drugPresentOptions: InputOption[] = [
  { value: 0, label: 'Drug eliminated: 0 points' },
  { value: 1, label: 'Drug possibly present: +1 point' },
  { value: 2, label: 'Drug definitely present: +2 points' },
];

const prechallengeOptions: InputOption[] = [
  { value: -2, label: 'Previous tolerance to same drug: -2 points' },
  { value: -1, label: 'Previous reaction uncertain: -1 point' },
  { value: 0, label: 'No known previous exposure: 0 points' },
  { value: 1, label: 'Previous reaction to same drug: +1 point' },
  { value: 2, label: 'Positive rechallenge (same reaction): +2 points' },
];

const dechallengeOptions: InputOption[] = [
  { value: -2, label: 'Drug continued, no progression: -2 points' },
  { value: 0, label: 'Drug stopped, uncertain timing: 0 points' },
  { value: 2, label: 'Drug stopped appropriately: +2 points' },
];

const drugNotorietyOptions: InputOption[] = [
  { value: 3, label: 'Strongly associated (high-risk): +3 points' },
  { value: 2, label: 'Associated (definite risk): +2 points' },
  { value: 1, label: 'Possible association: +1 point' },
  { value: 0, label: 'Unknown association: 0 points' },
  { value: -1, label: 'Drug not known to cause SJS/TEN: -1 point' },
];

const otherCausesOptions: InputOption[] = [
  { value: -1, label: 'Other cause highly probable: -1 point' },
  { value: 0, label: 'Other cause possible: 0 points' },
  { value: 1, label: 'Other causes excluded: +1 point' },
];

const aldenFormSections: FormSectionConfig[] = [
  {
    id: 'time_delay',
    label: '1. Time Delay from Initial Drug Intake to Onset',
    type: 'select',
    options: timeDelayOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', timeDelayOptions),
    description: 'Select the time interval from drug initiation to symptom onset. For rechallenge, use the rechallenge-specific options.',
  } as InputConfig,
  {
    id: 'drug_present',
    label: '2. Drug Present in Body (Based on Half-life)',
    type: 'select',
    options: drugPresentOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', drugPresentOptions),
    description: 'Assess drug presence on index day based on half-life, kidney/liver function, and pharmacokinetics.',
  } as InputConfig,
  {
    id: 'prechallenge',
    label: '3. Prechallenge/Rechallenge',
    type: 'select',
    options: prechallengeOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', prechallengeOptions),
    description: 'Previous exposure history to the same drug.',
  } as InputConfig,
  {
    id: 'dechallenge',
    label: '4. Dechallenge',
    type: 'select',
    options: dechallengeOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', dechallengeOptions),
    description: 'Whether drug was stopped and timing relative to symptom progression.',
  } as InputConfig,
  {
    id: 'drug_notoriety',
    label: '5. Drug Notoriety (Based on EuroSCAR Data)',
    type: 'select',
    options: drugNotorietyOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', drugNotorietyOptions),
    description: 'Drug association with SJS/TEN from epidemiological studies. High-risk drugs include allopurinol, carbamazepine, phenytoin, lamotrigine, sulfamethoxazole, nevirapine.',
  } as InputConfig,
  {
    id: 'other_causes',
    label: '6. Other Etiologic Causes',
    type: 'select',
    options: otherCausesOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', otherCausesOptions),
    description: 'Assessment of alternative explanations (infections, other drugs, underlying conditions).',
  } as InputConfig,
];

export const aldenTool: Tool = {
  id: 'alden',
  name: 'Algorithm of Drug Causality for Epidermal Necrolysis (ALDEN)',
  acronym: 'ALDEN',
  condition: 'Stevens-Johnson Syndrome / Toxic Epidermal Necrolysis',
  keywords: [
    'alden',
    'drug causality',
    'sjs',
    'ten',
    'stevens-johnson syndrome',
    'toxic epidermal necrolysis',
    'adverse drug reaction',
    'pharmacovigilance',
  ],
  description:
    'ALDEN is a specialized scoring system to assess drug causality in Stevens-Johnson Syndrome (SJS) and Toxic Epidermal Necrolysis (TEN). It evaluates 6 key parameters to determine the likelihood that a specific drug caused the severe cutaneous adverse reaction.',
  sourceType: 'Clinical Guideline',
  icon: AlertTriangle,
  rationale:
    '**Score Range: -12 to +10 points**\n\n**The 6 ALDEN Parameters:**\n1. **Time delay** from drug intake to onset (optimal: 5-28 days)\n2. **Drug presence** in body based on half-life\n3. **Prechallenge/Rechallenge** history\n4. **Dechallenge** (drug discontinuation timing)\n5. **Drug notoriety** from epidemiological data\n6. **Other etiologic causes** excluded\n\n**High-Risk Drugs (Strongly Associated):**\n- Allopurinol\n- Carbamazepine, Phenytoin, Lamotrigine\n- Sulfamethoxazole/Cotrimoxazole\n- Nevirapine\n- NSAIDs (oxicam type)\n- Phenobarbital\n\n**Clinical Advantage:** ALDEN is 3x more sensitive than general pharmacovigilance methods for identifying culprit drugs in SJS/TEN.',
  clinicalPerformance:
    'The ALDEN score demonstrates strong correlation with epidemiological case-control studies (r = 0.90, P < 0.0001). In validation studies, ALDEN identified probable/very probable causality in 69% of cases vs. 23% with general pharmacovigilance methods (P < 0.001). It showed superior performance (AUC = 0.65) compared to Naranjo scale (AUC = 0.54) and Liverpool ADR tool (AUC = 0.55). Inter-rater reliability remains a limitation (κ = 0.22). When used as gold standard, lymphocyte transformation test showed 86.4% sensitivity and 73.5% specificity for drug identification. ALDEN excludes unlikely drugs more definitively, scoring 64% of medications as "very unlikely" vs. 0% with general methods.',
  formSections: aldenFormSections,
  calculationLogic: (inputs) => {
    const scores = {
      timeDelay: Number(inputs.time_delay) || 0,
      drugPresent: Number(inputs.drug_present) || 0,
      prechallenge: Number(inputs.prechallenge) || 0,
      dechallenge: Number(inputs.dechallenge) || 0,
      drugNotoriety: Number(inputs.drug_notoriety) || 0,
      otherCauses: Number(inputs.other_causes) || 0,
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    let causalityLevel = '';
    if (totalScore >= 6) causalityLevel = 'Very Probable';
    else if (totalScore >= 4) causalityLevel = 'Probable';
    else if (totalScore >= 2) causalityLevel = 'Possible';
    else if (totalScore >= 0) causalityLevel = 'Unlikely';
    else causalityLevel = 'Very Unlikely';

    const interpretation = `ALDEN Score: ${totalScore} (Range: -12 to +10). Drug Causality: ${causalityLevel}.

**Interpretation:**
- ≥6: Very Probable - Strong causal relationship
- 4-5: Probable - Likely causal relationship
- 2-3: Possible - Uncertain causal relationship
- 0-1: Unlikely - Weak causal relationship
- <0: Very Unlikely - No causal relationship

**Clinical Action:**
- Scores ≥4: Focus on this drug as likely culprit
- Scores 2-3: Consider immunological testing
- Scores <2: Look for alternative causes

**Note:** For polypharmacy, calculate ALDEN for each suspect drug and rank by score.`;

    return {
      score: totalScore,
      interpretation,
      details: {
        'Time Delay': scores.timeDelay,
        'Drug Present': scores.drugPresent,
        'Prechallenge': scores.prechallenge,
        'Dechallenge': scores.dechallenge,
        'Drug Notoriety': scores.drugNotoriety,
        'Other Causes': scores.otherCauses,
        'Total ALDEN Score': totalScore,
        'Causality Level': causalityLevel,
      },
    };
  },
  references: [
    'Sassolas B, Haddad C, Mockenhaupt M, et al. ALDEN, an algorithm for assessment of drug causality in Stevens-Johnson Syndrome and toxic epidermal necrolysis: comparison with case-control analysis. Clin Pharmacol Ther. 2010;88(1):60-8.',
    'Bellón T, Lerma V, González-Valle O, et al. Assessment of drug causality in Stevens-Johnson syndrome/toxic epidermal necrolysis: Concordance between lymphocyte transformation test and ALDEN. Allergy. 2020;75(4):956-959.',
    'Hiransuthikul A, Rattananupong T, Klaewsongkram J, et al. Adverse drug reaction causality assessment tools for drug-induced Stevens-Johnson syndrome and toxic epidermal necrolysis: room for improvement. Eur J Clin Pharmacol. 2019;75(9):1219-1226.',
    'Mockenhaupt M. Epidemiology of cutaneous adverse drug reactions. Chem Immunol Allergy. 2012;97:1-17.',
    'Roujeau JC, Mockenhaupt M, Guillaume JC, Revuz J. New evidence supporting cyclosporine efficacy in epidermal necrolysis. J Invest Dermatol. 2017;137(10):2047-2049.',
  ],
};