import type { Tool, InputConfig, FormSectionConfig } from './types';
import { Droplets } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const hdssFormSection: FormSectionConfig = {
  id: 'hdss_severity',
  label: 'How would you rate the severity of your hyperhidrosis?',
  type: 'select',
  options: [
    {
      value: 1,
      label: '1 - My sweating is never noticeable and never interferes with my daily activities'
    },
    {
      value: 2,
      label: '2 - My sweating is tolerable but sometimes interferes with my daily activities'
    },
    {
      value: 3,
      label: '3 - My sweating is barely tolerable and frequently interferes with my daily activities'
    },
    {
      value: 4,
      label: '4 - My sweating is intolerable and always interferes with my daily activities'
    },
  ],
  defaultValue: 2,
  validation: getValidationSchema('select'),
  description: 'Single-item assessment of hyperhidrosis severity based on functional impact on daily activities.',
} as InputConfig;

export const hdssTool: Tool = {
  id: 'hdss',
  name: 'Hyperhidrosis Disease Severity Scale',
  acronym: 'HDSS',
  condition: 'Hyperhidrosis',
  keywords: [
    'hdss',
    'hyperhidrosis',
    'excessive sweating',
    'severity scale',
    'daily activities',
    'axillary',
    'palmar',
    'plantar',
  ],
  description:
    'The HDSS is a validated single-item scale that assesses hyperhidrosis severity based on functional interference with daily activities. It is widely used in clinical practice and research to evaluate treatment need and monitor response.',
  sourceType: 'Research',
  icon: Droplets,
  rationale:
    '**Purpose:** Quick assessment of hyperhidrosis severity and functional impact\n\n**Severity Classification:**\n- **Mild to Moderate (Score 1-2):** Sweating tolerable, sometimes interferes\n- **Severe (Score 3-4):** Sweating barely tolerable to intolerable, frequently/always interferes\n\n**Clinical Significance:**\n- Scores 3-4 warrant medical intervention\n- Used as inclusion criteria for clinical trials\n- Strong correlation with objective sweat measurements\n\n**Treatment Response:**\n- **1-point improvement:** Associated with 50% sweat reduction\n- **2-point improvement:** Associated with 80% sweat reduction\n- Clinical success: Reduction from 3-4 to 1-2\n\n**Botulinum Toxin Efficacy:**\n- 75% achieve ≥2-point improvement\n- Placebo response: 25%\n- Effect duration: 197-205 days\n\n**Clinical Applications:**\n- Primary/focal hyperhidrosis assessment\n- Treatment decision making\n- Insurance authorization\n- Treatment monitoring',
  clinicalPerformance:
    'The HDSS demonstrates substantial test-retest reliability (κ = 0.732) and good internal consistency (r = 0.82, p < 0.05). Construct validity is well-established with DLQI and HHIQ correlations (r = 0.35-0.77, p < 0.001) and moderate convergent validity with HidroQoL (r = 0.425, p < 0.001). The scale shows strong criterion validity with gravimetric sweat measurements, where 50% sweat reduction corresponds to 1-point improvement and 80% reduction to 2-point improvement. The tool demonstrates acceptable responsiveness to treatment changes. In botulinum toxin trials, 75% of patients achieved clinically meaningful improvement (≥2 points) compared to 25% placebo response. International validation includes Arabic (κ = 0.732) and Brazilian Portuguese versions. While simple and quick to administer, limitations include single-item structure that cannot capture the broad scope of disease impact, making it less sensitive than multi-item scales like HidroQoL.',
  formSections: [hdssFormSection],
  calculationLogic: (inputs) => {
    const score = Number(inputs.hdss_severity) || 2;

    let severityCategory = '';
    let treatmentRecommendation = '';

    if (score <= 2) {
      severityCategory = 'Mild to Moderate Hyperhidrosis';
      treatmentRecommendation = 'Consider conservative management, topical antiperspirants, or patient education. Medical treatment optional.';
    } else {
      severityCategory = 'Severe Hyperhidrosis';
      treatmentRecommendation = 'Active treatment warranted. Consider: botulinum toxin injections, iontophoresis, oral medications, or surgical options (sympathectomy).';
    }

    const functionalImpact = [
      '',
      'Never noticeable, never interferes',
      'Tolerable, sometimes interferes',
      'Barely tolerable, frequently interferes',
      'Intolerable, always interferes',
    ][score];

    const interpretation = `HDSS Score: ${score} (Range: 1-4). Severity: ${severityCategory}.

**Functional Impact:** ${functionalImpact}

**Clinical Interpretation:**
- Scores 1-2: Mild to moderate symptoms
- Scores 3-4: Severe symptoms requiring medical intervention

**Treatment Recommendation:**
${treatmentRecommendation}

**Treatment Response Benchmarks:**
- 1-point improvement = 50% sweat reduction
- 2-point improvement = 80% sweat reduction
- Target: Reduce from 3-4 to 1-2 (clinical success)

**Note:** HDSS correlates strongly with objective gravimetric measurements and quality of life measures. Consider comprehensive evaluation for treatment planning.`;

    return {
      score,
      interpretation,
      details: {
        'HDSS_Score': score,
        'Severity_Category': severityCategory,
        'Functional_Impact': functionalImpact,
        'Clinical_Threshold': 'Score ≥3 indicates severe hyperhidrosis',
        'Treatment_Indicated': score >= 3 ? 'Yes' : 'Optional/Conservative',
      },
    };
  },
  references: [
    'Kowalski JW, Eadie N, Dagget S, Lai PY. Validity and reliability of the hyperhidrosis disease severity scale (HDSS). J Am Acad Dermatol. 2004;51(4):S51.',
    'Solish N, Bertucci V, Dansereau A, et al. A comprehensive approach to the recognition, diagnosis, and severity-based treatment of focal hyperhidrosis: recommendations of the Canadian Hyperhidrosis Advisory Committee. Dermatol Surg. 2007;33(8):908-23.',
    'Hamm H, Naumann MK, Kowalski JW, et al. Primary focal hyperhidrosis: disease characteristics and functional impairment. Dermatology. 2006;212(4):343-53.',
    'Grabell DA, Hebert AA. Current and emerging medical therapies for primary hyperhidrosis. Dermatol Ther (Heidelb). 2017;7(1):25-36.',
    'Strutton DR, Kowalski JW, Glaser DA, Stang PE. US prevalence of hyperhidrosis and impact on individuals with axillary hyperhidrosis: results from a national survey. J Am Acad Dermatol. 2004;51(2):241-8.',
  ],
};