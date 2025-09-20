import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { AlertTriangle } from 'lucide-react';
import { getValidationSchema } from './toolValidation';
import { aldenCompute, type AldenInput } from './alden.full';

const timeDelayOptions: InputOption[] = [
  { value: 'excluded', label: 'Index day or after (Excluded): -3 points' },
  { value: 'unlikely', label: '>56 days (Unlikely): -1 point' },
  { value: 'likely', label: '1-4 days (Likely): +1 point' },
  { value: 'compatible', label: '29-56 days (Compatible): +2 points' },
  { value: 'suggestive', label: '5-28 days (Suggestive): +3 points' },
];

const drugPresentOptions: InputOption[] = [
  { value: 'definite', label: 'Definite (drug present at index): 0 points' },
  { value: 'doubtful', label: 'Doubtful: -1 point' },
  { value: 'excluded', label: 'Excluded (drug stopped before index): -3 points' },
];

const prechallengeOptions: InputOption[] = [
  { value: 'negative', label: 'Previous exposure without reaction: -2 points' },
  { value: 'none_unknown', label: 'No known previous exposure: 0 points' },
  { value: 'pos_unspecific', label: 'Other reaction after similar drug: +1 point' },
  { value: 'pos_specific_drug', label: 'SJS/TEN after similar drug OR other reaction after same drug: +2 points' },
  { value: 'pos_specific_drug_disease', label: 'SJS/TEN after same drug: +4 points' },
];

const dechallengeOptions: InputOption[] = [
  { value: 'drug_stopped', label: 'Drug stopped (at index or before progression): 0 points' },
  { value: 'continued_or_unknown', label: 'Drug continued or unknown: -2 points' },
];

const drugNotorietyOptions: InputOption[] = [
  { value: 'strongly_associated', label: 'Strongly associated (high-risk): +3 points' },
  { value: 'associated', label: 'Associated (definite risk): +2 points' },
  { value: 'suspected', label: 'Suspected association: +1 point' },
  { value: 'unknown', label: 'Unknown association: 0 points' },
  { value: 'not_suspected', label: 'Drug not known to cause SJS/TEN: -1 point' },
  { value: 'intermediate', label: 'Intermediate (based on other scores): -1 to +1 point' },
];

const otherCausesOptions: InputOption[] = [
  { value: 'none', label: 'Other causes excluded: 0 points' },
  { value: 'present_intermediate_or_higher', label: 'Other cause present (probable/definite): -1 point' },
];

const aldenFormSections: FormSectionConfig[] = [
  {
    id: 'delayCategory',
    label: '1. Time Delay from Initial Drug Intake to Onset',
    type: 'select',
    options: timeDelayOptions,
    defaultValue: 'unknown',
    validation: getValidationSchema('select', timeDelayOptions),
    description: 'Select the time interval from drug initiation to symptom onset.',
  } as InputConfig,
  {
    id: 'drugPresent',
    label: '2. Drug Present in Body (Based on Half-life)',
    type: 'select',
    options: drugPresentOptions,
    defaultValue: 'definite',
    validation: getValidationSchema('select', drugPresentOptions),
    description: 'Assess drug presence on index day based on half-life, kidney/liver function, and pharmacokinetics.',
  } as InputConfig,
  {
    id: 'prechallenge',
    label: '3. Prechallenge/Rechallenge',
    type: 'select',
    options: prechallengeOptions,
    defaultValue: 'none_unknown',
    validation: getValidationSchema('select', prechallengeOptions),
    description: 'Previous exposure history to the same drug.',
  } as InputConfig,
  {
    id: 'dechallenge',
    label: '4. Dechallenge',
    type: 'select',
    options: dechallengeOptions,
    defaultValue: 'drug_stopped',
    validation: getValidationSchema('select', dechallengeOptions),
    description: 'Whether drug was stopped and timing relative to symptom progression.',
  } as InputConfig,
  {
    id: 'notoriety',
    label: '5. Drug Notoriety (Based on EuroSCAR Data)',
    type: 'select',
    options: drugNotorietyOptions,
    defaultValue: 'unknown',
    validation: getValidationSchema('select', drugNotorietyOptions),
    description: 'Drug association with SJS/TEN from epidemiological studies. High-risk drugs include allopurinol, carbamazepine, phenytoin, lamotrigine, sulfamethoxazole, nevirapine.',
  } as InputConfig,
  {
    id: 'otherCauses',
    label: '6. Other Etiologic Causes',
    type: 'select',
    options: otherCausesOptions,
    defaultValue: 'none',
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
    // Map inputs to AldenInput type
    const aldenInput: AldenInput = {
      delayCategory: inputs.delayCategory as AldenInput['delayCategory'],
      delayPrevReaction: inputs.delayPrevReaction === 'true' || inputs.delayPrevReaction === true,
      drugPresent: inputs.drugPresent as AldenInput['drugPresent'],
      prechallenge: inputs.prechallenge as AldenInput['prechallenge'],
      dechallenge: inputs.dechallenge as AldenInput['dechallenge'],
      notoriety: inputs.notoriety as AldenInput['notoriety'],
      otherCauses: inputs.otherCauses as AldenInput['otherCauses'],
    };

    // Use the aldenCompute function from the full implementation
    const result = aldenCompute(aldenInput);

    const causalityLevel = result.category.charAt(0).toUpperCase() + result.category.slice(1);

    const interpretation = `ALDEN Score: ${result.score} (Range: -12 to +10). Drug Causality: ${causalityLevel}.

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
      score: result.score,
      interpretation,
      details: {
        'Time Delay': result.details.delay,
        'Drug Present': result.details.drug_present,
        'Prechallenge': result.details.prechallenge,
        'Dechallenge': result.details.dechallenge,
        'Drug Notoriety': result.details.notoriety,
        'Other Causes': result.details.other_causes,
        'Total ALDEN Score': result.score,
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