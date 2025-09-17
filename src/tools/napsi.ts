import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { Fingerprint } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const nailCountOptions: InputOption[] = Array.from({ length: 20 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} Nail(s)`,
}));

const napsiFormSections: FormSectionConfig[] = [
  {
    id: 'nail_count',
    label: 'Number of Nails Assessed (1-20)',
    type: 'select',
    options: nailCountOptions,
    defaultValue: 10,
    validation: getValidationSchema('select', nailCountOptions, 1, 20),
  },
  ...(Array.from({ length: 20 }, (_, i) => i + 1).flatMap((nailNum) => [
    {
      id: `nail_${nailNum}_matrix`,
      label: `Nail ${nailNum}: Matrix Score (0-4)`,
      type: 'number',
      min: 0,
      max: 4,
      defaultValue: 0,
      description: 'Quadrants w/ any: Pitting, Leukonychia, Red spots in lunula, Crumbling.',
      validation: getValidationSchema('number', undefined, 0, 4),
    },
    {
      id: `nail_${nailNum}_bed`,
      label: `Nail ${nailNum}: Bed Score (0-4)`,
      type: 'number',
      min: 0,
      max: 4,
      defaultValue: 0,
      description:
        'Quadrants w/ any: Onycholysis, Splinter hemorrhages, Subungual hyperkeratosis, Oil drop discoloration.',
      validation: getValidationSchema('number', undefined, 0, 4),
    },
  ]) as InputConfig[]),
];

export const napsiTool: Tool = {
  id: 'napsi',
  name: 'Nail Psoriasis Severity Index (NAPSI)',
  acronym: 'NAPSI',
  description:
    'The NAPSI (Nail Psoriasis Severity Index) was developed to provide a reproducible, objective, and simple method for evaluating the severity of nail psoriasis, a common and often disabling manifestation of psoriasis.',
  condition: 'Psoriasis / Psoriatic Arthritis',
  keywords: ['napsi', 'psoriasis', 'nail disorders', 'nail', 'severity', 'psoriatic arthritis'],
  sourceType: 'Clinical Guideline',
  icon: Fingerprint,
  rationale:
    'The NAPSI (Nail Psoriasis Severity Index) was developed to provide a reproducible, objective, and simple method for evaluating the severity of nail psoriasis, a common and often disabling manifestation of psoriasis. The rationale for its development was the lack of standardized, quantitative tools to assess nail involvement, which is important for both clinical trials and routine practice. The NAPSI evaluates both nail matrix and nail bed psoriasis by dividing each nail into four quadrants. For each quadrant, the presence or absence of nail matrix features (such as pitting, leukonychia, red spots in the lunula, and crumbling) and nail bed features (such as onycholysis, oil drop/salmon patch dyschromia, splinter hemorrhages, and subungual hyperkeratosis) are scored. Each feature is scored as present (1) or absent (0) in each quadrant, resulting in a maximum score of 8 per nail (4 for matrix, 4 for bed), and a total possible score of 80 for all fingernails. The original reference for the NAPSI is Rich and Scher (2003), who demonstrated its reproducibility and utility in clinical trials for psoriatic nail disease [1].',
  clinicalPerformance:
    'In the original study, the NAPSI was shown to be reproducible and simple to use, facilitating statistical analysis in clinical trials [1]. Subsequent studies have focused on interobserver and intraobserver reliability. Aktan et al. reported moderate to good interobserver reliability among dermatologists, with an intraclass correlation coefficient (ICC) of 0.781 for the total NAPSI score and 0.649 for individual nail scores. Reliability was higher for nail-bed features (ICC 0.869) than for nail-matrix features (ICC 0.584), indicating that certain components of the NAPSI are more consistently assessed than others [2]. Ricardo et al. found that interobserver agreement among dermatologists was moderate (ICC 0.43), but agreement between a convolutional neural network (CNN) and the mean dermatologist score was excellent (ICC 0.81), suggesting that automation may improve reliability [3]. Lubrano et al. demonstrated that expert rheumatologists achieved high interreader reliability (ICC 0.934), but intrareader reliability was variable and generally lower, especially among those with less experience [4]. These findings underscore the importance of training and experience in achieving reliable NAPSI assessments.\n\nSensitivity and specificity are not typically reported for NAPSI, as it is a severity index rather than a diagnostic tool. Its primary psychometric strength lies in its reliability, which is moderate to good among trained users but can be poor in less experienced hands.\n\nValidation and Comparative Studies\nNAPSI is the most commonly used measure for nail psoriasis in clinical trials, but heterogeneity in reporting and lack of standardization remain challenges [5]. Comparative studies have evaluated NAPSI against other nail scoring systems, such as the Nijmegen-Nail psoriasis Activity Index tool (N-NAIL), with some evidence suggesting that N-NAIL may offer better correlation with physician global assessment and higher reliability [6]. However, NAPSI remains the reference standard due to its widespread use and simplicity.\n\nPediatric-specific validation studies for NAPSI are lacking. The American Academy of Dermatology–National Psoriasis Foundation guideline for pediatric psoriasis does not specifically endorse or discuss pediatric validation of the NAPSI, and its psychometric properties in children remain uncharacterized [7].\n\nLimitations and Challenges\nThe main limitations of NAPSI in real-world practice include:\nInterobserver and intraobserver variability\nSubjectivity in assessing certain nail features\nLack of functional or psychosocial assessment\nAbsence of consensus on clinically meaningful change [2-4, 8-9]\n\nThe tool does not distinguish between active and residual changes, which may lead to over- or underestimation of disease activity. Time constraints and lack of standardized training further limit its use in routine practice.\n\nStrategies to Improve Reliability\nImproving the reliability of NAPSI can be achieved through structured training of clinicians, standardization of scoring criteria, and the use of automated or AI-assisted scoring systems [3, 10]. Training interventions, such as academic detailing and audit and feedback, have been shown to enhance interrater reliability [10-11]. Ongoing efforts to harmonize outcome measures and develop core outcome sets for nail psoriasis are expected to address some of these challenges [5].',
  formSections: napsiFormSections,
  calculationLogic: (inputs) => {
    let totalNapsiScore = 0;
    const nailCount = Math.min(Math.max(Number(inputs.nail_count) || 0, 1), 20);
    const perNailScores: Record<string, any> = {};
    for (let i = 1; i <= nailCount; i++) {
      const matrixScore = Number(inputs[`nail_${i}_matrix`]) || 0;
      const bedScore = Number(inputs[`nail_${i}_bed`]) || 0;
      const nailTotal = matrixScore + bedScore;
      totalNapsiScore += nailTotal;
      perNailScores[`Nail ${i}`] = {
        matrix_score: matrixScore,
        bed_score: bedScore,
        total_nail_score: nailTotal,
      };
    }
    const score = totalNapsiScore;
    const interpretation = `Total NAPSI Score (for ${nailCount} nails): ${score} (Max score: ${nailCount * 8}). Higher score indicates more severe nail psoriasis. No universal severity bands defined; used for tracking change.`;
    return { score, interpretation, details: { assessed_nails: nailCount, ...perNailScores } };
  },
  references: [
    'Rich P, Scher RK. Nail Psoriasis Severity Index: A Useful Tool for Evaluation of Nail Psoriasis. Journal of the American Academy of Dermatology. 2003;49(2):206-12. doi:10.1067/s0190-9622(03)00910-1.',
    'Aktan S, Ilknur T, Akin C, Ozkan S. Interobserver Reliability of the Nail Psoriasis Severity Index. Clinical and Experimental Dermatology. 2007;32(2):141-4. doi:10.1111/j.1365-2230.2006.02305.x.',
    'Ricardo JW, Miller R, Iorizzo M, et al. Agreement Between Nail Psoriasis Severity Index Scores by a Convolutional Neural Network and Dermatologists: A Retrospective Study at an Academic New York City Institution. American Journal of Clinical Dermatology. 2025;:10.1007/s40257-025-00934-y. doi:10.1007/s40257-025-00934-y.',
    'Lubrano E, Scrivo R, Cantini F, et al. Is the Nail Psoriasis Severity Index Reliable in the Assessment of Nail Psoriasis by Rheumatologists?. Arthritis Care & Research. 2012;64(3):455-8. doi:10.1002/acr.20691.',
    'Busard CI, Nolte JYC, Pasch MC, Spuls PI. Reporting of Outcomes in Randomized Controlled Trials on Nail Psoriasis: A Systematic Review. The British Journal of Dermatology. 2018;178(3):640-649. doi:10.1111/bjd.15831.',
    'Klaassen KM, van de Kerkhof PC, Bastiaens MT, et al. Scoring Nail Psoriasis. Journal of the American Academy of Dermatology. 2014;70(6):1061-6. doi:10.1016/j.jaad.2014.02.010.',
    'Menter A, Cordoro KM, Davis DMR, et al. Joint American Academy of Dermatology-National Psoriasis Foundation Guidelines of Care for the Management and Treatment of Psoriasis in Pediatric Patients. Journal of the American Academy of Dermatology. 2020;82(1):161-201. doi:10.1016/j.jaad.2019.08.049.',
    'Spuls PI, Lecluse LL, Poulsen ML, et al. How Good Are Clinical Severity and Outcome Measures for Psoriasis?: Quantitative Evaluation in a Systematic Review. The Journal of Investigative Dermatology. 2010;130(4):933-43. doi:10.1038/jid.2009.391.',
    'Gourraud PA, Le Gall C, Puzenat E, et al. Why Statistics Matter: Limited Inter-Rater Agreement Prevents Using the Psoriasis Area and Severity Index as a Unique Determinant of Therapeutic Decision in Psoriasis. The Journal of Investigative Dermatology. 2012;132(9):2171-5. doi:10.1038/jid.2012.124.',
    'Tuijn S, Janssens F, Robben P, van den Bergh H. Reducing Interrater Variability and Improving Health Care: A Meta-Analytical Review. Journal of Evaluation in Clinical Practice. 2012;18(4):887-95. doi:10.1111/j.1365-2753.2011.01705.x.',
    'Chan WV, Pearson TA, Bennett GC, et al. ACC/AHA Special Report: Clinical Practice Guideline Implementation Strategies: A Summary of Systematic Reviews by the NHLBI Implementation Science Work Group: A Report of the American College of Cardiology/American Heart Association Task Force on Clinical Practice Guidelines. Journal of the American College of Cardiology. 2017;69(8):1076-1092. doi:10.1016/j.jacc.2016.11.004.',
  ],
};
