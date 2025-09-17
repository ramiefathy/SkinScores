// Tool ID mapping utilities to handle conversions between different formats
// Components use camelCase (e.g., 'abcdeMelanoma') while lazy loader uses underscored (e.g., 'abcde_melanoma')
import { toolLoaders } from './lazy-loader';
const toolIdMap: Record<string, string> = {
  // camelCase -> underscored mapping
  abcdeMelanoma: 'abcde_melanoma',
  acneQol: 'acne_qol',
  behcetCriteria: 'behcet_criteria',
  bilagSkin: 'bilag_skin',
  bradenScale: 'braden_scale',
  bvasSkin: 'bvas_skin',
  casparCriteria: 'caspar_criteria',
  ceaRosacea: 'cea_rosacea',
  ctcaeSkin: 'ctcae_skin',
  essdaiCutaneous: 'essdai_cutaneous',
  fitzpatrickSkinType: 'fitzpatrick_skin_type',
  fiveDItch: '5d_itch',
  hsPga: 'hs_pga',
  hurleyStagingHs: 'hurley_staging_hs',
  igaAcne: 'iga_acne',
  igaRosacea: 'iga_rosacea',
  iimSontheimer2002: 'iim_sontheimer_2002',
  issVis: 'iss_vis',
  masiMmasi: 'masi_mmasi',
  mfgScore: 'mfg_score',
  mssHs: 'mss_hs',
  nappaClin: 'nappa_clin',
  nrsPruritus: 'nrs_pruritus',
  parklandFormula: 'parkland_formula',
  pedisClassification: 'pedis_classification',
  pgDelphi: 'pg_delphi',
  pgParacelsus: 'pg_paracelsus',
  pgSu: 'pg_su',
  pgaPsoriasis: 'pga_psoriasis',
  sevenPointChecklist: 'seven_point_checklist',
  sinbadScore: 'sinbad_score',
  sledaiSkin: 'sledai_skin',
  sliccCriteria: 'slicc_criteria',
  utWoundClassification: 'ut_wound_classification',
  vasPruritus: 'vas_pruritus',
  vigaAd: 'viga_ad',
};

// Create reverse mapping for underscored -> camelCase
const reverseMap: Record<string, string> = Object.entries(toolIdMap).reduce(
  (acc, [camel, underscored]) => ({ ...acc, [underscored]: camel }),
  {},
);

/**
 * Convert tool ID to the format expected by the lazy loader
 */
export function toLazyLoaderId(toolId: string): string {
  // Check if we have a direct mapping
  if (toolIdMap[toolId]) {
    return toolIdMap[toolId];
  }

  // If not in map, assume it's already in the correct format
  // (many tools like 'aas', 'pasi', 'scorad' don't need conversion)
  return toolId;
}

/**
 * Convert lazy loader ID back to component format
 */
export function fromLazyLoaderId(lazyLoaderId: string): string {
  // Check reverse mapping
  if (reverseMap[lazyLoaderId]) {
    return reverseMap[lazyLoaderId];
  }

  // If not in map, return as is
  return lazyLoaderId;
}

/**
 * Get all tool IDs in component format (camelCase)
 */
export function getAllToolIds(): string[] {
  const lazyLoaderIds = Object.keys(toolLoaders);
  return lazyLoaderIds.map((id) => fromLazyLoaderId(id));
}
