import type { Tool, InputConfig, FormSectionConfig } from './types';
import { Stethoscope } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const vssFormSections: FormSectionConfig[] = [
  {
    id: 'vss_pigmentation',
    label: 'Pigmentation',
    type: 'select',
    options: [
      { value: 0, label: '0 - Normal (color closely resembles skin color over rest of body)' },
      { value: 1, label: '1 - Hypopigmentation' },
      { value: 2, label: '2 - Hyperpigmentation' },
    ],
    defaultValue: 0,
    validation: getValidationSchema('select'),
    description: 'Assessment of scar color compared to normal skin.',
  } as InputConfig,
  {
    id: 'vss_vascularity',
    label: 'Vascularity',
    type: 'select',
    options: [
      { value: 0, label: '0 - Normal (color closely resembles skin over rest of body)' },
      { value: 1, label: '1 - Pink' },
      { value: 2, label: '2 - Red' },
      { value: 3, label: '3 - Purple' },
    ],
    defaultValue: 0,
    validation: getValidationSchema('select'),
    description: 'Presence of blood vessels causing color changes (test with pressure).',
  } as InputConfig,
  {
    id: 'vss_pliability',
    label: 'Pliability',
    type: 'select',
    options: [
      { value: 0, label: '0 - Normal (skin moves easily, no resistance)' },
      { value: 1, label: '1 - Supple (minimal resistance)' },
      { value: 2, label: '2 - Yielding (moderate resistance)' },
      { value: 3, label: '3 - Firm (marked resistance, moves as a solid unit)' },
      { value: 4, label: '4 - Banding (rope-like tissue, blanches with extension)' },
      { value: 5, label: '5 - Contracture (permanent shortening causing deformity)' },
    ],
    defaultValue: 0,
    validation: getValidationSchema('select'),
    description: 'Flexibility/stiffness of scar tissue when moved or stretched.',
  } as InputConfig,
  {
    id: 'vss_height',
    label: 'Height (Thickness)',
    type: 'select',
    options: [
      { value: 0, label: '0 - Flat (normal height)' },
      { value: 1, label: '1 - <2mm' },
      { value: 2, label: '2 - 2-5mm' },
      { value: 3, label: '3 - >5mm' },
    ],
    defaultValue: 0,
    validation: getValidationSchema('select'),
    description: 'Elevation/thickness of scar above surrounding skin.',
  } as InputConfig,
];

export const vancouverScarTool: Tool = {
  id: 'vancouverScar',
  name: 'Vancouver Scar Scale',
  acronym: 'VSS',
  condition: 'Scar Assessment',
  keywords: [
    'vancouver',
    'vss',
    'scar',
    'burn scar',
    'hypertrophic scar',
    'keloid',
    'pigmentation',
    'vascularity',
  ],
  description:
    'The Vancouver Scar Scale (VSS) evaluates burn scars and hypertrophic scars using four parameters: pigmentation, vascularity, pliability, and height. Developed in 1990, it remains one of the most widely used scar assessment tools.',
  sourceType: 'Clinical Guideline',
  icon: Stethoscope,
  rationale:
    '**The 4 VSS Parameters:**\n1. **Pigmentation (0-2):** Color variation from normal skin\n2. **Vascularity (0-3):** Blood vessel appearance/redness\n3. **Pliability (0-5):** Flexibility and resistance to movement\n4. **Height (0-3):** Thickness/elevation above skin\n\n**Total Score: 0-13**\n- Higher scores indicate more severe scarring\n- Score 0 = Normal skin\n- Score 13 = Most severe scarring\n\n**Clinical Significance:**\n- **Height ≥1:** 99.5% sensitive, 85.9% specific for hypertrophic scar\n- Height parameter has highest diagnostic value (AUC 0.97)\n- Vascularity AUC 0.78, Pigmentation AUC 0.72\n\n**Hypertrophic Scar Definition:**\n- Traditional cutoff: Total VSS ≥5\n- Height-based: Height score ≥1\n- Clinical: Raised, red, firm scar within wound boundaries\n\n**Applications:**\n- Burn scar assessment (original validation)\n- Surgical scar evaluation\n- Treatment monitoring\n- Research outcome measure',
  clinicalPerformance:
    'The VSS demonstrates variable reliability with inter-rater agreement ranging from "indeterminate" to "moderate" across studies. Recent validation shows fair to good agreement (ICC 0.65-0.73) for "best" scar areas and excellent agreement (ICC 0.85-0.88) for "worst" areas. Individual parameter reliability: Pliability (κ=0.53), Pigmentation (κ=0.54), Vascularity (κ=0.49), Height (κ=0.47), all p<0.0001. The height parameter shows exceptional diagnostic performance (AUC 0.97) for hypertrophic scar identification, significantly outperforming vascularity (AUC 0.78) and pigmentation (AUC 0.72). Height ≥1 provides 99.5% sensitivity and 85.9% specificity for hypertrophic scarring. Dermoscopy validation shows strong correlation between objective redness measurements and VSS vascularity scores (r=0.625). Modified versions (mVSS) linked with TBSA show improved reliability. Despite widespread use, the VSS has limitations including subjective assessment, lack of standardized protocols, and validation primarily for burn scars while being applied to other scar types.',
  formSections: vssFormSections,
  calculationLogic: (inputs) => {
    const pigmentation = Number(inputs.vss_pigmentation) || 0;
    const vascularity = Number(inputs.vss_vascularity) || 0;
    const pliability = Number(inputs.vss_pliability) || 0;
    const height = Number(inputs.vss_height) || 0;

    const totalScore = pigmentation + vascularity + pliability + height;

    let scarType = '';
    let clinicalSignificance = '';

    // Determine scar type based on height (most diagnostic parameter)
    if (height === 0 && totalScore === 0) {
      scarType = 'Normal skin';
      clinicalSignificance = 'No scarring detected';
    } else if (height >= 1) {
      scarType = 'Hypertrophic scar';
      clinicalSignificance = 'Raised scar consistent with hypertrophic scarring (99.5% sensitivity)';
    } else if (totalScore >= 5) {
      scarType = 'Abnormal scar (traditional cutoff)';
      clinicalSignificance = 'Meets traditional VSS threshold for abnormal scarring';
    } else {
      scarType = 'Mild scarring';
      clinicalSignificance = 'Minor scar changes without hypertrophic features';
    }

    // Determine treatment recommendations
    let treatmentGuidance = '';
    if (totalScore === 0) {
      treatmentGuidance = 'No treatment required';
    } else if (totalScore <= 4) {
      treatmentGuidance = 'Conservative management: moisturization, sun protection, massage';
    } else if (totalScore <= 8) {
      treatmentGuidance = 'Active treatment indicated: silicone sheets/gel, pressure therapy, consider laser therapy';
    } else {
      treatmentGuidance = 'Aggressive treatment warranted: combination therapy (silicone, pressure, laser, steroids), consider surgical revision';
    }

    const interpretation = `VSS Total Score: ${totalScore}/13. Scar Type: ${scarType}.

**Component Scores:**
- Pigmentation: ${pigmentation}/2
- Vascularity: ${vascularity}/3
- Pliability: ${pliability}/5
- Height: ${height}/3

**Clinical Significance:**
${clinicalSignificance}

**Severity Classification:**
- 0: Normal skin
- 1-4: Mild scarring
- 5-8: Moderate scarring
- 9-13: Severe scarring

**Treatment Recommendations:**
${treatmentGuidance}

**Key Diagnostic Indicator:**
Height score ${height >= 1 ? '≥1 indicates hypertrophic scar (99.5% sensitive, 85.9% specific)' : '= 0 suggests no hypertrophic features'}

**Note:** VSS was validated for burn scars. Consider POSAS for comprehensive patient-reported outcomes alongside clinical assessment.`;

    return {
      score: totalScore,
      interpretation,
      details: {
        'Total_VSS_Score': totalScore,
        'Pigmentation': pigmentation,
        'Vascularity': vascularity,
        'Pliability': pliability,
        'Height': height,
        'Scar_Type': scarType,
        'Hypertrophic_Scar': height >= 1 ? 'Yes' : 'No',
        'Severity_Category': totalScore === 0 ? 'Normal' : totalScore <= 4 ? 'Mild' : totalScore <= 8 ? 'Moderate' : 'Severe',
      },
    };
  },
  references: [
    'Sullivan T, Smith J, Kermode J, et al. Rating the burn scar. J Burn Care Rehabil. 1990;11(3):256-60.',
    'Baryza MJ, Baryza GA. The Vancouver Scar Scale: an administration tool and its interrater reliability. J Burn Care Rehabil. 1995;16(5):535-8.',
    'Tyack Z, Simons M, Spinks A, Wasiak J. A systematic review of the quality of burn scar rating scales for clinical and research use. Burns. 2012;38(1):6-18.',
    'Forbes-Duchart L, Marshall S, Strock A, Cooper JE. Determination of inter-rater reliability in pediatric burn scar assessment using a modified version of the Vancouver Scar Scale. J Burn Care Res. 2007;28(3):460-7.',
    'Nedelec B, Shankowsky HA, Tredget EE. Rating the resolving hypertrophic scar: comparison of the Vancouver Scar Scale and scar volume. J Burn Care Rehabil. 2000;21(3):205-12.',
  ],
};