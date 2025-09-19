import type { Tool, InputConfig, FormSectionConfig, InputGroupConfig } from './types';
import { Layers } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

// The 12 anatomical sites for EBDASI
const ebdasiBodySites = [
  { id: 'head', name: 'Head' },
  { id: 'neck', name: 'Neck' },
  { id: 'chest', name: 'Chest' },
  { id: 'back', name: 'Back' },
  { id: 'abdomen', name: 'Abdomen' },
  { id: 'upper_arms', name: 'Upper Arms' },
  { id: 'forearms', name: 'Forearms' },
  { id: 'hands', name: 'Hands' },
  { id: 'buttocks_groin', name: 'Buttocks/Groin' },
  { id: 'thighs', name: 'Thighs' },
  { id: 'legs', name: 'Legs' },
  { id: 'feet', name: 'Feet' },
];

// Create activity score inputs for each body site
const activityInputs: InputGroupConfig[] = ebdasiBodySites.map((site) => ({
  id: `activity_group_${site.id}`,
  title: site.name,
  gridCols: 1,
  inputs: [
    {
      id: `activity_${site.id}`,
      label: 'Activity Score (0-10)',
      type: 'number',
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 0,
      validation: getValidationSchema('number', [], 0, 10),
      description: 'Score based on blisters, erosions, crusting (0=none, 10=severe)',
    } as InputConfig,
  ],
}));

// Damage components
const damageComponents = [
  'erythema',
  'dyspigmentation',
  'poikiloderma',
  'atrophy',
  'hyperkeratosis',
  'scarring',
  'milia',
];

// Create damage score inputs for each body site
const damageInputs: InputGroupConfig[] = ebdasiBodySites.map((site) => ({
  id: `damage_group_${site.id}`,
  title: site.name,
  gridCols: 3,
  inputs: damageComponents.map((component) => ({
    id: `damage_${site.id}_${component}`,
    label: component.charAt(0).toUpperCase() + component.slice(1),
    type: 'checkbox',
    defaultValue: false,
    validation: getValidationSchema('checkbox'),
  })) as InputConfig[],
}));

const ebdasiFormSections: FormSectionConfig[] = [
  {
    id: 'activity_section',
    title: 'ACTIVITY ASSESSMENT (Reversible Disease Activity)',
    description:
      'For each anatomical site, rate disease activity from 0-10 based on the presence and severity of blisters, erosions, and crusting. 0 = no activity, 10 = most severe activity.',
    gridCols: 3,
    inputs: [],
    groups: activityInputs,
  } as InputGroupConfig,
  {
    id: 'damage_section',
    title: 'DAMAGE ASSESSMENT (Permanent Scarring/Damage)',
    description:
      'For each anatomical site, check all damage features present: erythema, dyspigmentation, poikiloderma, atrophy, hyperkeratosis, scarring, milia.',
    gridCols: 1,
    inputs: [],
    groups: damageInputs,
  } as InputGroupConfig,
  {
    id: 'other_sites',
    title: 'OTHER EPITHELIALIZED SURFACES',
    gridCols: 2,
    inputs: [
      {
        id: 'scalp_activity',
        label: 'Scalp Activity (0-10)',
        type: 'number',
        min: 0,
        max: 10,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 10),
      } as InputConfig,
      {
        id: 'scalp_damage',
        label: 'Scalp Damage (0-10)',
        type: 'number',
        min: 0,
        max: 10,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 10),
      } as InputConfig,
      {
        id: 'mucosa_activity',
        label: 'Mucosa Activity (0-10)',
        type: 'number',
        min: 0,
        max: 10,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 10),
      } as InputConfig,
      {
        id: 'mucosa_damage',
        label: 'Mucosa Damage (0-10)',
        type: 'number',
        min: 0,
        max: 10,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 10),
      } as InputConfig,
      {
        id: 'nails_activity',
        label: 'Nails Activity (0-10)',
        type: 'number',
        min: 0,
        max: 10,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 10),
      } as InputConfig,
      {
        id: 'nails_damage',
        label: 'Nails Damage (0-10)',
        type: 'number',
        min: 0,
        max: 10,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 10),
      } as InputConfig,
    ],
  } as InputGroupConfig,
];

export const ebdasiTool: Tool = {
  id: 'ebdasi',
  name: 'Epidermolysis Bullosa Disease Activity and Scarring Index',
  acronym: 'EBDASI',
  condition: 'Epidermolysis Bullosa',
  keywords: [
    'ebdasi',
    'epidermolysis bullosa',
    'eb',
    'skin fragility',
    'blistering',
    'disease activity',
    'scarring index',
    'damage assessment',
  ],
  description:
    'The EBDASI is a comprehensive 4-page assessment tool that evaluates disease severity in epidermolysis bullosa by separately measuring reversible disease activity and permanent damage/scarring across 12 anatomical sites plus scalp, mucosa, and nails.',
  sourceType: 'Research',
  icon: Layers,
  rationale:
    '**Key Innovation:** Separates reversible activity from permanent damage\n\n**Assessment Structure:**\n- **12 Skin Sites:** Head, neck, chest, back, abdomen, arms, forearms, hands, buttocks/groin, thighs, legs, feet\n- **Additional Sites:** Scalp, mucosa, nails\n- **Two Domains:** Activity (treatable) vs Damage (permanent)\n\n**Activity Score (0-276):**\n- Each site: 0-10 based on blisters, erosions, crusting\n- 12 skin sites × 10 = 120 max\n- Plus scalp, mucosa, nails, other sites\n\n**Damage Score (0-230):**\n- 7 components per site (binary 0/1)\n- Erythema, dyspigmentation, poikiloderma, atrophy, hyperkeratosis, scarring, milia\n\n**Total Score: 0-506**\n\n**Clinical Significance:**\n- ≥9 point reduction in activity = Clinically significant improvement\n- ≥3 point increase in activity = Disease deterioration',
  clinicalPerformance:
    'The EBDASI demonstrates exceptional reliability with interrater ICC = 0.964 (95% CI: 0.929-0.986) and intrarater ICC = 0.994 (95% CI: 0.976-0.998), both superior to BEBS (Birmingham EB Severity) and PGA (Physician Global Assessment). Convergent validity shows strong correlation with PGA (ρ = 0.871), exceeding BEBS (ρ = 0.852). The tool demonstrates superior discriminant validity, particularly effective at distinguishing mild to moderate disease severity where other tools struggle. In comparative studies with iscorEB, EBDASI showed better discrimination between EB types and disease severities. The severity classifications (mild: 0-42, moderate: 43-106, severe: 107-506) were determined using ROC curves. Responsiveness studies confirm the tool detects treatment response with clinically meaningful thresholds established. The separation of activity from damage uniquely enables assessment of treatment-responsive components vs accumulated damage, critical for therapeutic trials and longitudinal monitoring.',
  formSections: ebdasiFormSections,
  calculationLogic: (inputs) => {
    let totalActivityScore = 0;
    let totalDamageScore = 0;
    const siteScores: Record<string, { activity: number; damage: number }> = {};

    // Calculate skin site scores
    ebdasiBodySites.forEach((site) => {
      const activity = Number(inputs[`activity_${site.id}`]) || 0;
      let damage = 0;

      damageComponents.forEach((component) => {
        if (inputs[`damage_${site.id}_${component}`]) {
          damage++;
        }
      });

      totalActivityScore += activity;
      totalDamageScore += damage;
      siteScores[site.name] = { activity, damage };
    });

    // Add other sites
    const scalpActivity = Number(inputs.scalp_activity) || 0;
    const scalpDamage = Number(inputs.scalp_damage) || 0;
    const mucosaActivity = Number(inputs.mucosa_activity) || 0;
    const mucosaDamage = Number(inputs.mucosa_damage) || 0;
    const nailsActivity = Number(inputs.nails_activity) || 0;
    const nailsDamage = Number(inputs.nails_damage) || 0;

    totalActivityScore += scalpActivity + mucosaActivity + nailsActivity;
    totalDamageScore += scalpDamage + mucosaDamage + nailsDamage;

    const totalEBDASI = totalActivityScore + totalDamageScore;

    let severityCategory = '';
    if (totalEBDASI <= 42) severityCategory = 'Mild';
    else if (totalEBDASI <= 106) severityCategory = 'Moderate';
    else severityCategory = 'Severe';

    const interpretation = `Total EBDASI: ${totalEBDASI} (Range: 0-506)
Activity Score: ${totalActivityScore} (Max: 276) - Reversible disease activity
Damage Score: ${totalDamageScore} (Max: 230) - Permanent scarring/damage
Severity: ${severityCategory} EB

**Severity Classification:**
- Mild: 0-42
- Moderate: 43-106
- Severe: 107-506

**Clinical Significance Thresholds:**
- Activity reduction ≥9 points = Clinically significant improvement
- Activity increase ≥3 points = Disease deterioration

**Interpretation Notes:**
- Activity score reflects treatment-responsive disease
- Damage score represents accumulated permanent changes
- Monitor activity score for treatment response
- Higher activity suggests need for treatment optimization

**Clinical Application:** The separation of activity from damage allows clinicians to:
1. Identify treatable disease components
2. Monitor treatment effectiveness
3. Track disease progression
4. Distinguish acute flares from chronic damage`;

    return {
      score: totalEBDASI,
      interpretation,
      details: {
        'Total_EBDASI_Score': totalEBDASI,
        'Activity_Score': totalActivityScore,
        'Damage_Score': totalDamageScore,
        'Severity_Category': severityCategory,
        'Skin_Sites': siteScores,
        'Scalp_Activity': scalpActivity,
        'Scalp_Damage': scalpDamage,
        'Mucosa_Activity': mucosaActivity,
        'Mucosa_Damage': mucosaDamage,
        'Nails_Activity': nailsActivity,
        'Nails_Damage': nailsDamage,
      },
    };
  },
  references: [
    'Loh CCH, Kim J, Su JC, et al. Development, reliability, and validity of a novel Epidermolysis Bullosa Disease Activity and Scarring Index (EBDASI). J Am Acad Dermatol. 2014;70(1):89-97.',
    'Jain SV, Harris AG, Su JC, et al. The Epidermolysis Bullosa Disease Activity and Scarring Index (EBDASI): grading disease severity and assessing responsiveness to clinical change in epidermolysis bullosa. J Eur Acad Dermatol Venereol. 2017;31(4):692-698.',
    'Nyström A, Bruckner-Tuderman L, Kern JS, et al. A comparison study of outcome measures for epidermolysis bullosa: EBDASI and iscorEB. J Eur Acad Dermatol Venereol. 2021;35(1):135-142.',
    'Moss C, Wong A, Davies P. The Birmingham Epidermolysis Bullosa Severity score: development and validation. Br J Dermatol. 2009;160(5):1057-65.',
    'Fine JD, Johnson LB, Weiner M, et al. Assessment of mobility, activities and pain in different subtypes of epidermolysis bullosa. Clin Exp Dermatol. 2004;29(2):122-7.',
  ],
};