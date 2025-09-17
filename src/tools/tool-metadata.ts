// Tool metadata for listing/searching without loading implementations
export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  condition?: string;
  category?: string;
  acronym?: string;
  keywords?: string[];
}

// This metadata should be kept in sync with the actual tool definitions
export const toolMetadata: ToolMetadata[] = [
  {
    id: 'aas',
    name: 'AAS',
    description: 'Activity Assessment Score',
    condition: 'Inflammatory Diseases',
  },
  {
    id: 'abcdeMelanoma',
    name: 'ABCDE Melanoma',
    description: 'ABCDE criteria for melanoma detection',
    condition: 'Melanoma',
  },
  {
    id: 'absis',
    name: 'ABSIS',
    description: 'Autoinflammatory Bullous Skin Disorder Intensity Score',
    condition: 'Bullous Disorders',
  },
  {
    id: 'acneQol',
    name: 'Acne-QoL',
    description: 'Acne Quality of Life',
    condition: 'Acne Vulgaris',
  },
  {
    id: 'alt70',
    name: 'ALT-70',
    description: 'Albert 70-item checklist',
    condition: 'General Dermatology',
  },
  {
    id: 'behcetCriteria',
    name: 'Behçet Criteria',
    description: "International Study Group criteria for Behçet's disease",
    condition: 'Vasculitis',
  },
  {
    id: 'bilagSkin',
    name: 'BILAG Skin',
    description: 'British Isles Lupus Assessment Group - Mucocutaneous',
    condition: 'Lupus',
  },
  {
    id: 'bpdai',
    name: 'BPDAI',
    description: 'Bullous Pemphigoid Disease Area Index',
    condition: 'Bullous Disorders',
  },
  {
    id: 'bradenScale',
    name: 'Braden Scale',
    description: 'Pressure injury risk assessment',
    condition: 'Wounds',
  },
  {
    id: 'bvasSkin',
    name: 'BVAS Skin',
    description: 'Birmingham Vasculitis Activity Score - Cutaneous',
    condition: 'Vasculitis',
  },
  {
    id: 'bwat',
    name: 'BWAT',
    description: 'Bates-Jensen Wound Assessment Tool',
    condition: 'Wounds',
  },
  {
    id: 'casparCriteria',
    name: 'CASPAR',
    description: 'Classification criteria for Psoriatic Arthritis',
    condition: 'Psoriasis',
  },
  {
    id: 'cdasi',
    name: 'CDASI',
    description: 'Cutaneous Dermatomyositis Disease Area and Severity Index',
    condition: 'Dermatomyositis',
  },
  {
    id: 'cdlqi',
    name: 'CDLQI',
    description: "Children's Dermatology Life Quality Index",
    condition: 'General Dermatology',
  },
  {
    id: 'ceaRosacea',
    name: 'CEA Rosacea',
    description: 'Clinician Erythema Assessment for Rosacea',
    condition: 'Rosacea',
  },
  {
    id: 'clasi',
    name: 'CLASI',
    description: 'Cutaneous Lupus Erythematosus Disease Area and Severity Index',
    condition: 'Lupus',
  },
  {
    id: 'ctcaeSkin',
    name: 'CTCAE Skin',
    description: 'Common Terminology Criteria for Adverse Events - Skin',
    condition: 'Adverse Events',
  },
  {
    id: 'dapsa',
    name: 'DAPSA',
    description: 'Disease Activity in Psoriatic Arthritis',
    condition: 'Psoriasis',
  },
  {
    id: 'dasi',
    name: 'DASI',
    description: 'Dyshidrotic Eczema Area and Severity Index',
    condition: 'Eczema',
  },
  {
    id: 'dlqi',
    name: 'DLQI',
    description: 'Dermatology Life Quality Index',
    condition: 'General Dermatology',
  },
  {
    id: 'dssi',
    name: 'DSSI',
    description: 'Dermatology-Specific Symptom Intensity',
    condition: 'General Dermatology',
  },
  { id: 'easi', name: 'EASI', description: 'Eczema Area and Severity Index', condition: 'Eczema' },
  {
    id: 'essdaiCutaneous',
    name: 'ESSDAI Cutaneous',
    description: "EULAR Sjögren's Syndrome Disease Activity Index - Cutaneous",
    condition: "Sjögren's Syndrome",
  },
  {
    id: 'fitzpatrickSkinType',
    name: 'Fitzpatrick Skin Type',
    description: 'Skin phototype classification',
    condition: 'General Dermatology',
  },
  { id: 'fiveDItch', name: '5-D Itch', description: '5-D Itch Scale', condition: 'Pruritus' },
  {
    id: 'gags',
    name: 'GAGS',
    description: 'Global Acne Grading System',
    condition: 'Acne Vulgaris',
  },
  { id: 'hecsi', name: 'HECSI', description: 'Hand Eczema Severity Index', condition: 'Eczema' },
  {
    id: 'hiscr',
    name: 'HiSCR',
    description: 'Hidradenitis Suppurativa Clinical Response',
    condition: 'Hidradenitis Suppurativa',
  },
  {
    id: 'hsPga',
    name: 'HS-PGA',
    description: 'Hidradenitis Suppurativa Physician Global Assessment',
    condition: 'Hidradenitis Suppurativa',
  },
  {
    id: 'hurleyStagingHs',
    name: 'Hurley Staging',
    description: 'Hurley Staging for Hidradenitis Suppurativa',
    condition: 'Hidradenitis Suppurativa',
  },
  {
    id: 'igaAcne',
    name: 'IGA Acne',
    description: "Investigator's Global Assessment for Acne",
    condition: 'Acne Vulgaris',
  },
  {
    id: 'igaRosacea',
    name: 'IGA Rosacea',
    description: "Investigator's Global Assessment for Rosacea",
    condition: 'Rosacea',
  },
  {
    id: 'ihs4',
    name: 'IHS4',
    description: 'International Hidradenitis Suppurativa Severity Score System',
    condition: 'Hidradenitis Suppurativa',
  },
  {
    id: 'iimSontheimer2002',
    name: 'IIM Sontheimer 2002',
    description: 'Idiopathic inflammatory myopathies criteria',
    condition: 'Dermatomyositis',
  },
  {
    id: 'issVis',
    name: 'ISS-VIS',
    description: 'Itch Severity Scale - Visual',
    condition: 'Pruritus',
  },
  {
    id: 'loscat',
    name: 'LoSCAT',
    description: 'Localized Scleroderma Cutaneous Assessment Tool',
    condition: 'Morphea',
  },
  {
    id: 'masiMmasi',
    name: 'MASI/mMASI',
    description: 'Melasma Area and Severity Index',
    condition: 'Melasma',
  },
  {
    id: 'melasqol',
    name: 'MELASQOL',
    description: 'Melasma Quality of Life scale',
    condition: 'Melasma',
  },
  {
    id: 'mfgScore',
    name: 'MFG Score',
    description: 'Mycosis Fungoides Global Score',
    condition: 'Cutaneous Lymphoma',
  },
  { id: 'mrss', name: 'mRSS', description: 'Modified Rodnan Skin Score', condition: 'Scleroderma' },
  { id: 'msi', name: 'MSI', description: 'Melasma Severity Index', condition: 'Melasma' },
  {
    id: 'mssHs',
    name: 'MSS-HS',
    description: 'Modified Sartorius Score for Hidradenitis Suppurativa',
    condition: 'Hidradenitis Suppurativa',
  },
  {
    id: 'mswat',
    name: 'mSWAT',
    description: 'Modified Severity-Weighted Assessment Tool',
    condition: 'Cutaneous Lymphoma',
  },
  {
    id: 'nappaClin',
    name: 'NAPPA-CLIN',
    description: 'Nail Assessment in Psoriasis and Psoriatic Arthritis - Clinical',
    condition: 'Psoriasis',
  },
  {
    id: 'napsi',
    name: 'NAPSI',
    description: 'Nail Psoriasis Severity Index',
    condition: 'Psoriasis',
  },
  {
    id: 'nrsPruritus',
    name: 'NRS Pruritus',
    description: 'Numeric Rating Scale for Pruritus',
    condition: 'Pruritus',
  },
  {
    id: 'parklandFormula',
    name: 'Parkland Formula',
    description: 'Fluid resuscitation for burns',
    condition: 'Burns',
  },
  {
    id: 'pasi',
    name: 'PASI',
    description: 'Psoriasis Area and Severity Index',
    condition: 'Psoriasis',
  },
  {
    id: 'pdai',
    name: 'PDAI',
    description: 'Pemphigus Disease Area Index',
    condition: 'Bullous Disorders',
  },
  {
    id: 'pedisClassification',
    name: 'PEDIS',
    description: 'Diabetic foot ulcer classification',
    condition: 'Wounds',
  },
  {
    id: 'pest',
    name: 'PEST',
    description: 'Psoriasis Epidemiology Screening Tool',
    condition: 'Psoriasis',
  },
  {
    id: 'pgDelphi',
    name: 'PG Delphi',
    description: 'Pyoderma Gangrenosum Delphi Consensus',
    condition: 'Pyoderma Gangrenosum',
  },
  {
    id: 'pgParacelsus',
    name: 'PG PARACELSUS',
    description: 'Pyoderma Gangrenosum Assessment of Response to Therapy',
    condition: 'Pyoderma Gangrenosum',
  },
  {
    id: 'pgSu',
    name: 'PG-SU',
    description: 'Pyoderma Gangrenosum Severity and Ulcer',
    condition: 'Pyoderma Gangrenosum',
  },
  {
    id: 'pgaPsoriasis',
    name: 'PGA Psoriasis',
    description: 'Physician Global Assessment for Psoriasis',
    condition: 'Psoriasis',
  },
  { id: 'poem', name: 'POEM', description: 'Patient-Oriented Eczema Measure', condition: 'Eczema' },
  {
    id: 'pssi',
    name: 'PSSI',
    description: 'Psoriasis Scalp Severity Index',
    condition: 'Psoriasis',
  },
  {
    id: 'push',
    name: 'PUSH',
    description: 'Pressure Ulcer Scale for Healing',
    condition: 'Wounds',
  },
  { id: 'salt', name: 'SALT', description: 'Severity of Alopecia Tool', condition: 'Alopecia' },
  {
    id: 'sasi',
    name: 'SASI',
    description: 'Simplified Atopic dermatitis Severity Index',
    condition: 'Eczema',
  },
  {
    id: 'sassad',
    name: 'SASSAD',
    description: 'Six Area, Six Sign Atopic Dermatitis',
    condition: 'Eczema',
  },
  { id: 'scorad', name: 'SCORAD', description: 'Scoring Atopic Dermatitis', condition: 'Eczema' },
  {
    id: 'scorten',
    name: 'SCORTEN',
    description: 'Score of Toxic Epidermal Necrolysis',
    condition: 'Stevens-Johnson Syndrome',
  },
  {
    id: 'scqoli10',
    name: 'SCQoLI-10',
    description: 'Scleroderma Quality of Life Instrument',
    condition: 'Scleroderma',
  },
  {
    id: 'sevenPointChecklist',
    name: '7-Point Checklist',
    description: '7-point checklist for melanoma',
    condition: 'Melanoma',
  },
  {
    id: 'sinbadScore',
    name: 'SINBAD',
    description: 'Site, Ischemia, Neuropathy, Bacterial Infection, Area, Depth',
    condition: 'Wounds',
  },
  {
    id: 'skindex29',
    name: 'Skindex-29',
    description: 'Skin-specific quality of life',
    condition: 'General Dermatology',
  },
  {
    id: 'sledaiSkin',
    name: 'SLEDAI Skin',
    description: 'SLE Disease Activity Index - Mucocutaneous',
    condition: 'Lupus',
  },
  {
    id: 'sliccCriteria',
    name: 'SLICC',
    description: 'Systemic Lupus International Collaborating Clinics criteria',
    condition: 'Lupus',
  },
  {
    id: 'uas7',
    name: 'UAS7',
    description: 'Urticaria Activity Score over 7 days',
    condition: 'Urticaria',
  },
  { id: 'uct', name: 'UCT', description: 'Urticaria Control Test', condition: 'Urticaria' },
  {
    id: 'utWoundClassification',
    name: 'UT Wound',
    description: 'University of Texas Wound Classification',
    condition: 'Wounds',
  },
  { id: 'vasi', name: 'VASI', description: 'Vitiligo Area Scoring Index', condition: 'Vitiligo' },
  {
    id: 'vasPruritus',
    name: 'VAS Pruritus',
    description: 'Visual Analog Scale for Pruritus',
    condition: 'Pruritus',
  },
  { id: 'vida', name: 'VIDA', description: 'Vitiligo Disease Activity', condition: 'Vitiligo' },
  {
    id: 'vigaAd',
    name: 'vIGA-AD',
    description: 'Validated Investigator Global Assessment for Atopic Dermatitis',
    condition: 'Eczema',
  },
  {
    id: 'vitiqol',
    name: 'VitiQoL',
    description: 'Vitiligo-specific Quality of Life instrument',
    condition: 'Vitiligo',
  },
];

// Popular tool IDs
export const popularToolIds = ['pasi', 'dlqi', 'abcdeMelanoma', 'easi', 'scorad'];

// Get grouped tools by condition
export function getGroupedToolMetadata(): Record<string, ToolMetadata[]> {
  return toolMetadata.reduce(
    (acc, tool) => {
      const condition = tool.condition || 'Other';
      if (!acc[condition]) {
        acc[condition] = [];
      }
      acc[condition].push(tool);
      return acc;
    },
    {} as Record<string, ToolMetadata[]>,
  );
}

// Get tool metadata by ID
export function getToolMetadata(toolId: string): ToolMetadata | undefined {
  return toolMetadata.find((tool) => tool.id === toolId);
}

// Get popular tools metadata
export function getPopularToolsMetadata(): ToolMetadata[] {
  return toolMetadata.filter((tool) => popularToolIds.includes(tool.id));
}
