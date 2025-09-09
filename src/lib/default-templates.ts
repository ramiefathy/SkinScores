import { saveTemplate } from './templates';

// Initialize default templates for common calculations
export function initializeDefaultTemplates() {
  const templates = getDefaultTemplates();
  
  // Check if templates already exist
  const existingTemplates = JSON.parse(localStorage.getItem('skinscores_templates') || '[]');
  
  if (existingTemplates.length === 0) {
    templates.forEach(template => {
      saveTemplate(
        template.name,
        template.description,
        template.toolId,
        template.inputs,
        template.tags
      );
    });
  }
}

function getDefaultTemplates() {
  return [
    {
      name: 'Mild Psoriasis Assessment',
      description: 'Template for assessing mild psoriasis with typical distribution',
      toolId: 'pasi',
      inputs: {
        head_erythema: 1,
        head_induration: 1,
        head_desquamation: 1,
        head_area: 10,
        upper_extremities_erythema: 2,
        upper_extremities_induration: 1,
        upper_extremities_desquamation: 1,
        upper_extremities_area: 20,
        trunk_erythema: 1,
        trunk_induration: 1,
        trunk_desquamation: 1,
        trunk_area: 15,
        lower_extremities_erythema: 2,
        lower_extremities_induration: 1,
        lower_extremities_desquamation: 2,
        lower_extremities_area: 25
      },
      tags: ['psoriasis', 'mild', 'common']
    },
    {
      name: 'Moderate Psoriasis Assessment',
      description: 'Template for assessing moderate psoriasis',
      toolId: 'pasi',
      inputs: {
        head_erythema: 2,
        head_induration: 2,
        head_desquamation: 2,
        head_area: 30,
        upper_extremities_erythema: 3,
        upper_extremities_induration: 2,
        upper_extremities_desquamation: 2,
        upper_extremities_area: 40,
        trunk_erythema: 2,
        trunk_induration: 2,
        trunk_desquamation: 2,
        trunk_area: 35,
        lower_extremities_erythema: 3,
        lower_extremities_induration: 2,
        lower_extremities_desquamation: 3,
        lower_extremities_area: 45
      },
      tags: ['psoriasis', 'moderate', 'common']
    },
    {
      name: 'Severe Eczema Assessment',
      description: 'Template for severe atopic dermatitis evaluation',
      toolId: 'easi',
      inputs: {
        head_neck_erythema: 3,
        head_neck_induration: 3,
        head_neck_excoriation: 2,
        head_neck_lichenification: 2,
        head_neck_area: 80,
        upper_extremities_erythema: 3,
        upper_extremities_induration: 2,
        upper_extremities_excoriation: 3,
        upper_extremities_lichenification: 2,
        upper_extremities_area: 70,
        trunk_erythema: 2,
        trunk_induration: 2,
        trunk_excoriation: 2,
        trunk_lichenification: 1,
        trunk_area: 60,
        lower_extremities_erythema: 3,
        lower_extremities_induration: 2,
        lower_extremities_excoriation: 3,
        lower_extremities_lichenification: 3,
        lower_extremities_area: 75
      },
      tags: ['eczema', 'severe', 'atopic dermatitis']
    },
    {
      name: 'Pediatric Eczema - Mild',
      description: 'Template for mild pediatric atopic dermatitis',
      toolId: 'scorad',
      inputs: {
        extent_score: 20,
        erythema: 1,
        edema: 1,
        oozing: 0,
        excoriation: 1,
        lichenification: 0,
        dryness: 2,
        pruritus: 3,
        sleeplessness: 2
      },
      tags: ['pediatric', 'eczema', 'mild', 'SCORAD']
    },
    {
      name: 'Moderate Acne Assessment',
      description: 'Template for moderate acne vulgaris',
      toolId: 'gags',
      inputs: {
        forehead: 2,
        left_cheek: 3,
        right_cheek: 3,
        nose: 1,
        chin: 2,
        chest_upper_back: 2
      },
      tags: ['acne', 'moderate', 'facial']
    },
    {
      name: 'Vitiligo Assessment - Face',
      description: 'Template for facial vitiligo assessment',
      toolId: 'vasi',
      inputs: {
        head_neck_depigmentation: 50,
        head_neck_area: 3,
        upper_extremities_depigmentation: 0,
        upper_extremities_area: 0,
        trunk_depigmentation: 0,
        trunk_area: 0,
        lower_extremities_depigmentation: 0,
        lower_extremities_area: 0
      },
      tags: ['vitiligo', 'facial', 'localized']
    },
    {
      name: 'Moderate Melasma',
      description: 'Template for moderate melasma assessment',
      toolId: 'masiMmasi',
      inputs: {
        forehead_area: 2,
        forehead_darkness: 2,
        forehead_homogeneity: 2,
        right_malar_area: 3,
        right_malar_darkness: 2,
        right_malar_homogeneity: 3,
        left_malar_area: 3,
        left_malar_darkness: 2,
        left_malar_homogeneity: 3,
        chin_area: 1,
        chin_darkness: 1,
        chin_homogeneity: 1
      },
      tags: ['melasma', 'moderate', 'facial pigmentation']
    },
    {
      name: 'Severe Alopecia',
      description: 'Template for severe alopecia areata',
      toolId: 'salt',
      inputs: {
        scalp_left: 90,
        scalp_right: 85,
        scalp_top: 95,
        scalp_back: 80
      },
      tags: ['alopecia', 'severe', 'hair loss']
    }
  ];
}