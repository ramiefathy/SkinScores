import type { Tool, InputConfig, FormSectionConfig, InputGroupConfig } from './types';
import { ShieldHalf } from 'lucide-react'; // Or another icon like Atom or LayoutList
import { getValidationSchema } from './toolValidation';

const bodyRegionsMswat = [
  { id: 'head', name: 'Head', bsaPercent: 7 },
  { id: 'neck', name: 'Neck', bsaPercent: 2 },
  { id: 'anterior_trunk', name: 'Anterior Trunk', bsaPercent: 13 },
  { id: 'arms', name: 'Arms', bsaPercent: 8 },
  { id: 'forearms', name: 'Forearms', bsaPercent: 6 },
  { id: 'hands', name: 'Hands', bsaPercent: 5 },
  { id: 'posterior_trunk', name: 'Posterior Trunk', bsaPercent: 13 },
  { id: 'buttocks', name: 'Buttocks', bsaPercent: 5 },
  { id: 'thighs', name: 'Thighs', bsaPercent: 19 },
  { id: 'legs', name: 'Legs', bsaPercent: 14 },
  { id: 'feet', name: 'Feet', bsaPercent: 7 },
  { id: 'groin', name: 'Groin', bsaPercent: 1 },
];

const mswatFormSections: FormSectionConfig[] = bodyRegionsMswat.map(
  (region) =>
    ({
      id: `mswat_group_${region.id}`,
      title: `${region.name} (Total ${region.bsaPercent}% BSA)`,
      gridCols: 3, // For Patch, Plaque, Tumor inputs
      description: `Enter the % of total body surface area (BSA) covered by each lesion type on the ${region.name}. Each input is capped at ${region.bsaPercent}%. The sum of Patch, Plaque, and Tumor BSA for this region should not exceed ${region.bsaPercent}%.`,
      inputs: [
        {
          id: `patch_bsa_${region.id}`,
          label: 'Patch BSA (%)',
          type: 'number',
          min: 0,
          max: region.bsaPercent,
          step: 0.1,
          defaultValue: 0,
          validation: getValidationSchema('number', [], 0, region.bsaPercent),
          description: `Patch on ${region.name}`,
        },
        {
          id: `plaque_bsa_${region.id}`,
          label: 'Plaque BSA (%)',
          type: 'number',
          min: 0,
          max: region.bsaPercent,
          step: 0.1,
          defaultValue: 0,
          validation: getValidationSchema('number', [], 0, region.bsaPercent),
          description: `Plaque on ${region.name}`,
        },
        {
          id: `tumor_bsa_${region.id}`,
          label: 'Tumor/Ulcer BSA (%)',
          type: 'number',
          min: 0,
          max: region.bsaPercent,
          step: 0.1,
          defaultValue: 0,
          validation: getValidationSchema('number', [], 0, region.bsaPercent),
          description: `Tumor/Ulcer on ${region.name}`,
        },
      ],
    }) as InputGroupConfig,
);

export const mswatTool: Tool = {
  id: 'mswat',
  name: 'Modified Severity-Weighted Assessment Tool (mSWAT)',
  acronym: 'mSWAT',
  condition: 'Cutaneous T-Cell Lymphoma (CTCL)',
  keywords: [
    'mswat',
    'ctcl',
    'mycosis fungoides',
    'sezary syndrome',
    'skin severity',
    'body surface area',
  ],
  description:
    'The modified Severity-Weighted Assessment Tool (mSWAT) is a validated, clinician-reported index for quantifying skin disease burden in mycosis fungoides and Sézary syndrome. The mSWAT divides the body into 12 regions (head, neck, anterior trunk, arms, forearms, hands, posterior trunk, buttocks, thighs, legs, feet, groin), each with a defined percentage of total body surface area (BSA). For each region, the percentage of BSA involved by patch, plaque, and tumor lesions is estimated separately. Each lesion type is assigned a weighting factor: patch ×1, plaque ×2, tumor ×4. The total mSWAT score is the sum of weighted scores for all lesion types and all regions.',
  sourceType: 'Clinical Guideline',
  icon: ShieldHalf,
  rationale:
    '**Formula: mSWAT = Σ (BSA × Weight)**\nWhere: Patch BSA × 1 + Plaque BSA × 2 + Tumor/Ulcer BSA × 4\n\n**Lesion Type Definitions:**\n- **Patch:** Flat, erythematous lesions (weight = 1)\n- **Plaque:** Elevated, infiltrated lesions >1cm (weight = 2)  \n- **Tumor/Ulcer:** Nodular lesions >1cm or ulcerated areas (weight = 4)\n\n**Body Regions (12 total):**\nHead (7%), Neck (2%), Anterior trunk (13%), Arms (8%), Forearms (6%), Hands (5%), Posterior trunk (13%), Buttocks (5%), Thighs (19%), Legs (14%), Feet (7%), Groin (1%)\n\n**Clinical Context:**\n- Developed for MF/SS by International Society for Cutaneous Lymphomas (ISCL)\n- Maximum theoretical score: 400 (100% BSA with tumors × 4)\n- Typical range in practice: 0-200\n- Response criteria: mSWAT-50 = ≥50% reduction from baseline\n\n**Example Calculation:**\nPatient with 10% patch on trunk, 5% plaque on arms, 2% tumor on leg:\nmSWAT = (10×1) + (5×2) + (2×4) = 10 + 10 + 8 = 28',
  clinicalPerformance:
    'The mSWAT demonstrates excellent inter-rater reliability (weighted κ = 0.82-0.89) and strong correlation with physician global assessment (r = 0.83), total skin score, and overall stage. It is more sensitive to change than simple BSA measurements and has been adopted as the standard outcome measure for MF/SS trials by ISCL/USCLC/EORTC consensus. The tool shows good responsiveness to treatment, with mSWAT-50 (≥50% reduction) established as a meaningful clinical response threshold. Studies report high concordance between experienced raters (ICC > 0.9) but lower agreement for patch vs plaque distinction among novice assessors. Training improves reliability significantly. The mSWAT correlates moderately with quality of life measures (Skindex-29, FACT-G) and strongly with other disease burden assessments. Limitations include subjectivity in lesion type classification and potential underestimation of erythrodermic involvement. Digital photography and standardized lighting improve reproducibility.',
  formSections: mswatFormSections,
  calculationLogic: (inputs) => {
    let totalPatchBSA = 0;
    let totalPlaqueBSA = 0;
    let totalTumorBSA = 0;
    const regionalInputs: Record<
      string,
      {
        patch: number;
        plaque: number;
        tumor: number;
        regional_total_bsa_involved: number;
        region_max_bsa: number;
        note?: string;
      }
    > = {};

    bodyRegionsMswat.forEach((region) => {
      const patchForRegion = Number(inputs[`patch_bsa_${region.id}`]) || 0;
      const plaqueForRegion = Number(inputs[`plaque_bsa_${region.id}`]) || 0;
      const tumorForRegion = Number(inputs[`tumor_bsa_${region.id}`]) || 0;

      const regionalSum = patchForRegion + plaqueForRegion + tumorForRegion;
      let note;
      if (regionalSum > region.bsaPercent) {
        note = `Warning: Sum of lesion BSA (${regionalSum.toFixed(1)}%) for ${region.name} exceeds its max BSA contribution (${region.bsaPercent}%). Calculations will use entered values.`;
      }

      regionalInputs[region.name] = {
        patch: patchForRegion,
        plaque: plaqueForRegion,
        tumor: tumorForRegion,
        regional_total_bsa_involved: parseFloat(regionalSum.toFixed(1)),
        region_max_bsa: region.bsaPercent,
      };
      if (note) {
        regionalInputs[region.name].note = note;
      }

      totalPatchBSA += patchForRegion;
      totalPlaqueBSA += plaqueForRegion;
      totalTumorBSA += tumorForRegion;
    });

    const weightedPatchScore = totalPatchBSA * 1;
    const weightedPlaqueScore = totalPlaqueBSA * 2;
    const weightedTumorScore = totalTumorBSA * 4;

    const finalMSWATScore = weightedPatchScore + weightedPlaqueScore + weightedTumorScore;
    const totalBSAInvolvedByLesions = totalPatchBSA + totalPlaqueBSA + totalTumorBSA;

    const interpretation =
      `Total mSWAT Score: ${finalMSWATScore.toFixed(1)} (Range: 0-400). ` +
      `Breakdown: Patch BSA ${totalPatchBSA.toFixed(1)}% × 1 = ${weightedPatchScore.toFixed(1)}; ` +
      `Plaque BSA ${totalPlaqueBSA.toFixed(1)}% × 2 = ${weightedPlaqueScore.toFixed(1)}; ` +
      `Tumor/Ulcer BSA ${totalTumorBSA.toFixed(1)}% × 4 = ${weightedTumorScore.toFixed(1)}. ` +
      `Total BSA involved: ${totalBSAInvolvedByLesions.toFixed(1)}%.\n\n` +
      `**Response Criteria:** mSWAT-50 = ≥50% reduction from baseline (partial response in ISCL/EORTC criteria).\n` +
      `**Clinical Context:** Higher scores indicate greater tumor burden and more advanced disease.`;

    return {
      score: parseFloat(finalMSWATScore.toFixed(1)),
      interpretation,
      details: {
        Regional_BSA_Inputs: regionalInputs,
        Subtotal_Lesion_BSA: {
          Patch: parseFloat(totalPatchBSA.toFixed(1)),
          Plaque: parseFloat(totalPlaqueBSA.toFixed(1)),
          Tumor_Ulcer: parseFloat(totalTumorBSA.toFixed(1)),
        },
        Weighting_Factors: {
          Patch: 'x1',
          Plaque: 'x2',
          Tumor_Ulcer: 'x4',
        },
        Subtotal_Lesion_BSA_x_Weighting_Factor: {
          Patch: parseFloat(weightedPatchScore.toFixed(1)),
          Plaque: parseFloat(weightedPlaqueScore.toFixed(1)),
          Tumor_Ulcer: parseFloat(weightedTumorScore.toFixed(1)),
        },
        Total_mSWAT_Score: parseFloat(finalMSWATScore.toFixed(1)),
        Overall_BSA_Involved_By_Lesions: parseFloat(totalBSAInvolvedByLesions.toFixed(1)),
      },
    };
  },
  references: [
    'Olsen EA, Whittaker S, Kim YH, et al. Clinical end points and response criteria in mycosis fungoides and Sézary syndrome: a consensus statement of the International Society for Cutaneous Lymphomas, the United States Cutaneous Lymphoma Consortium, and the Cutaneous Lymphoma Task Force of the European Organisation for Research and Treatment of Cancer. J Clin Oncol. 2011;29(18):2598-607. doi:10.1200/JCO.2010.32.0630.',
  ],
};
