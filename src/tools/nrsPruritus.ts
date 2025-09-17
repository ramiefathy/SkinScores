import type { Tool, InputConfig, FormSectionConfig } from './types';
import { CircleDot } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

export const nrsPruritusTool: Tool = {
  id: 'nrs_pruritus',
  name: 'Numeric Rating Scale (NRS) for Pruritus',
  acronym: 'NRS Pruritus',
  condition: 'Pruritus',
  keywords: ['nrs', 'numeric rating scale', 'pruritus', 'itch', 'intensity', 'patient reported'],
  description:
    'The NRS for pruritus is a unidimensional, patient-reported outcome measure designed to quantify the intensity of itch, a subjective and multifactorial symptom prevalent in many dermatological and systemic diseases.',
  sourceType: 'Research',
  icon: CircleDot,
  rationale:
    'The rationale for the NRS was to provide a simple, reliable, and valid tool for both clinical and research settings, allowing for standardized assessment and monitoring of pruritus severity. The NRS typically asks patients to rate their itch intensity over a specified recall period (commonly the past 24 hours) on an 11-point scale from 0 (no itch) to 10 (worst imaginable itch). The original development of the NRS is not attributed to a single publication, as it evolved alongside similar scales such as the Visual Analogue Scale (VAS) and Verbal Rating Scale (VRS). Its psychometric properties and validation in chronic pruritus populations have been robustly established, including in the prospective multicenter study by Phan et al. (2012), which confirmed high reliability and concurrent validity for the NRS, VAS, and VRS in 471 patients with chronic itch. The American Academy of Dermatology, in its joint guidelines with the National Psoriasis Foundation, recognizes the NRS as a valid instrument for pruritus assessment in psoriasis and other dermatoses.',
  clinicalPerformance:
    "Multiple studies have established the NRS as a reliable and valid measure of pruritus intensity. Reich et al. found very good reproducibility (intraclass correlation coefficient [ICC] > 0.8) and strong concurrent validity with other intensity scales such as the Numeric Rating Scale (NRS) and Verbal Rating Scale (VRS). Phan et al. reported high reliability and concurrent validity (r > 0.8, p < 0.01) for the VAS, NRS, and VRS, with high inter-scale correlations and minimal missing data. Jang et al. confirmed strong correlation and similar retest reliability between VAS, NRS, and VRS in a large multicenter study.\n\nSystematic reviews have consistently rated the NRS (horizontal format) as one of the most appropriate patient-reported outcome measures for pruritus, with adequate reliability and validity for use in clinical trials. The NRS is also included in comprehensive pruritus assessment batteries, such as PRURITOOLS, which demonstrated excellent test-retest reliability (ICC 0.84–1) and strong convergent validity with other pruritus measures.\n\nReal-World Practice\nThe NRS has been validated in real-world, multicenter, and practice-based studies across Europe and Asia, confirming its reproducibility and internal consistency in diverse clinical settings and patient populations. The NRS for 'worst itch in the last 24 hours' was found to be the most reproducible and consistent across languages and disease types. In a large German study, both patients and physicians rated the NRS as highly feasible and useful for routine clinical care, supporting its integration into daily workflows. The European Academy of Dermatology and Venereology (EADV) Task Force Pruritus has prioritized the NRS as a primary tool for routine clinical assessment of itch intensity.\n\nSensitivity, Specificity, and Responsiveness\nAs a continuous, subjective measure of symptom intensity, the NRS is not designed for diagnostic sensitivity or specificity. Instead, its clinical performance is evaluated in terms of reliability (test-retest, inter-scale), validity (concurrent, convergent), and responsiveness to change. The NRS has demonstrated high responsiveness in clinical trials and real-world studies, with changes in NRS scores correlating with clinical improvement or worsening of pruritus.\n\nPediatric Populations\nWhile the NRS is feasible and interpretable for older children and adolescents, its use in younger children may be limited by cognitive and developmental factors, necessitating the use of proxy reporting or age-adapted instruments. Recent studies have developed and validated age-appropriate pruritus assessment tools (e.g., ItchyQuant, TweenItchyQoL, PIQ-C) for children, which may be preferable for younger age groups. The NRS has been included in some pediatric studies, but high-quality, pediatric-specific validation remains limited.",
  formSections: [
    {
      id: 'nrs_score',
      label: 'NRS Score (0-10)',
      type: 'number',
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 0,
      description: 'Enter score from 0 (no itch) to 10 (worst imaginable itch).',
      validation: getValidationSchema('number', [], 0, 10),
    },
  ],
  calculationLogic: (inputs) => {
    const score = Number(inputs.nrs_score) || 0;
    let severity = '';
    if (score === 0) severity = 'No itch';
    else if (score <= 3) severity = 'Mild itch';
    else if (score <= 6) severity = 'Moderate itch';
    else if (score <= 8) severity = 'Severe itch';
    else severity = 'Very severe itch';

    const interpretation = `NRS for Pruritus: ${score} (Range 0-10). Severity: ${severity}. (Example severity bands: 0 No itch, 1-3 Mild, 4-6 Moderate, 7-8 Severe, 9-10 Very severe).`;
    return {
      score,
      interpretation,
      details: { Reported_NRS_Score: score, Assessed_Severity: severity },
    };
  },
  references: [
    'Jang YH, Kim SM, Eun DH, et al. Validity and Reliability of Itch Assessment Scales for Chronic Pruritus in Adults: A Prospective Multicenter Study. Journal of the American Academy of Dermatology. 2020;82(1):80-86. doi:10.1016/j.jaad.2019.06.043.',
    'Schoch D, Sommer R, Augustin M, Ständer S, Blome C. Patient-Reported Outcome Measures In Pruritus: A Systematic Review of Measurement Properties. The Journal of Investigative Dermatology. 2017;137(10):2069-2077. doi:10.1016/j.jid.2017.05.020.',
    'Topp J, Apfelbacher C, Ständer S, Augustin M, Blome C. Measurement Properties of Patient-Reported Outcome Measures for Pruritus: An Updated Systematic Review. The Journal of Investigative Dermatology. 2022;142(2):343-354. doi:10.1016/j.jid.2021.06.032.',
    'Pereira MP, Ständer S. Assessment of Severity and Burden of Pruritus. Allergology International : Official Journal of the Japanese Society of Allergology. 2017;66(1):3-7. doi:10.1016/j.alit.2016.08.009.',
    'Storck M, Sandmann S, Bruland P, et al. Pruritus Intensity Scales Across Europe: A Prospective Validation Study. Journal of the European Academy of Dermatology and Venereology : JEADV. 2021;35(5):1176-1185. doi:10.1111/jdv.17111.',
    'Verweyen E, Ständer S, Kreitz K, et al. Validation of a Comprehensive Set of Pruritus Assessment Instruments: The Chronic Pruritus Tools Questionnaire PRURITOOLS. Acta Dermato-Venereologica. 2019;99(7):657-663. doi:10.2340/00015555-3158.',
    'Phan NQ, Blome C, Fritz F, et al. Assessment of Pruritus Intensity: Prospective Study on Validity and Reliability of the Visual Analogue Scale, Numerical Rating Scale and Verbal Rating Scale in 471 Patients With Chronic Pruritus. Acta Dermato-Venereologica. 2012;92(5):502-7. doi:10.2340/00015555-1246.',
    'Ständer S, Zeidler C, Riepe C, et al. European EADV Network on Assessment of Severity and Burden of Pruritus (PruNet): First Meeting on Outcome Tools. Journal of the European Academy of Dermatology and Venereology : JEADV. 2016;30(7):1144-7. doi:10.1111/jdv.13296.',
    'Reich A, Heisig M, Phan NQ, et al. Visual Analogue Scale: Evaluation of the Instrument for the Assessment of Pruritus. Acta Dermato-Venereologica. 2012;92(5):497-501. doi:10.2340/00015555-1265.',
    'Reich A, Bożek A, Janiszewska K, Szepietowski JC. 12-Item Pruritus Severity Scale: Development and Validation of New Itch Severity Questionnaire. BioMed Research International. 2017;2017:3896423. doi:10.1155/2017/3896423.',
    'Ständer S, Blome C, Anastasiadou Z, et al. Dynamic Pruritus Score: Evaluation of the Validity and Reliability of a New Instrument to Assess the Course of Pruritus. Acta Dermato-Venereologica. 2017;97(2):230-234. doi:10.2340/00015555-2494.',
    'Pereira MP, Zeidler C, Szymczak H, et al. Acceptability and Perceived Benefits of Validated Pruritus Assessment Instruments in the Dermatological Office and Clinic: The perspectives of Patients and Physicians. Journal of the European Academy of Dermatology and Venereology : JEADV. 2024;38(10):1973-1981. doi:10.1111/jdv.20148.',
    'Elmets CA, Korman NJ, Prater EF, et al. Joint AAD-NPF Guidelines of Care for the Management and Treatment of Psoriasis With Topical Therapy and Alternative Medicine Modalities for Psoriasis Severity Measures. Journal of the American Academy of Dermatology. 2021;84(2):432-470. doi:10.1016/j.jaad.2020.07.087.',
    'Kimball AB, Naegeli AN, Edson-Heredia E, et al. Psychometric Properties of the Itch Numeric Rating Scale in Patients With Moderate-to-Severe Plaque Psoriasis. The British Journal of Dermatology. 2016;175(1):157-62. doi:10.1111/bjd.14464.',
    'Rams A, Baldasaro J, Bunod L, et al. Assessing Itch Severity: Content Validity and Psychometric Properties of a Patient-Reported Pruritus Numeric Rating Scale in Atopic Dermatitis. Advances in Therapy. 2024;41(4):1512-1525. doi:10.1007/s12325-024-02802-3.',
    'Leshem YA, Chalmers JR, Apfelbacher C, et al. Measuring Atopic Eczema Control and Itch Intensity in Clinical Practice: A Consensus Statement From the Harmonising Outcome Measures for Eczema in Clinical Practice (HOME-CP) Initiative. JAMA Dermatology. 2022;158(12):1429-1435. doi:10.1001/jamadermatol.2022.4211.',
    'Mannix S, Edson-Heredia E, Paller AS, et al. The Experience of Itch in Children With Psoriasis: A Qualitative Exploration of the Itch Numeric Rating Scale. Pediatric Dermatology. 2021;38(2):405-412. doi:10.1111/pde.14403.',
    'Kong HE, Francois S, Smith S, et al. Tools to Study the Severity of Itch in 8- To 17-Year-Old Children: Validation of TweenItchyQoL and ItchyQuant. Pediatric Dermatology. 2021;38(5):1118-1126. doi:10.1111/pde.14662.',
    'Silverberg JI, Leshem YA, Calimlim BM, McDonald J, Litcher-Kelly L. Psychometric Evaluation of the Worst Pruritus Numerical Rating Scale (NRS), Atopic Dermatitis Symptom Scale (ADerm-SS), and Atopic Dermatitis Impact Scale (ADerm-IS). Current Medical Research and Opinion. 2023;39(10):1289-1296. doi:10.1080/03007995.2023.2251883.',
  ],
};
