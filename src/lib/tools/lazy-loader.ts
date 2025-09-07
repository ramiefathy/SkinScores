import type { Tool } from '../types';
import { toLazyLoaderId } from './tool-id-mapper';

// Lazy load individual tools
export const toolLoaders: Record<string, () => Promise<{ default: Tool }>> = {
  aas: () => import('./aas').then(m => ({ default: m.aasTool })),
  abcde_melanoma: () => import('./abcdeMelanoma').then(m => ({ default: m.abcdeMelanomaTool })),
  absis: () => import('./absis').then(m => ({ default: m.absisTool })),
  acne_qol: () => import('./acneQol').then(m => ({ default: m.acneQolTool })),
  alt70: () => import('./alt70').then(m => ({ default: m.alt70Tool })),
  behcet_criteria: () => import('./behcetCriteria').then(m => ({ default: m.behcetCriteriaTool })),
  bilag_skin: () => import('./bilagSkin').then(m => ({ default: m.bilagSkinTool })),
  bpdai: () => import('./bpdai').then(m => ({ default: m.bpdaiTool })),
  braden_scale: () => import('./bradenScale').then(m => ({ default: m.bradenScaleTool })),
  bvas_skin: () => import('./bvasSkin').then(m => ({ default: m.bvasSkinTool })),
  bwat: () => import('./bwat').then(m => ({ default: m.bwatTool })),
  caspar_criteria: () => import('./casparCriteria').then(m => ({ default: m.casparCriteriaTool })),
  cdasi: () => import('./cdasi').then(m => ({ default: m.cdasiTool })),
  cdlqi: () => import('./cdlqi').then(m => ({ default: m.cdlqiTool })),
  cea_rosacea: () => import('./ceaRosacea').then(m => ({ default: m.ceaRosaceaTool })),
  clasi: () => import('./clasi').then(m => ({ default: m.clasiTool })),
  ctcae_skin: () => import('./ctcaeSkin').then(m => ({ default: m.ctcaeSkinTool })),
  dapsa: () => import('./dapsa').then(m => ({ default: m.dapsaTool })),
  dasi: () => import('./dasi').then(m => ({ default: m.dasiTool })),
  dlqi: () => import('./dlqi').then(m => ({ default: m.dlqiTool })),
  dssi: () => import('./dssi').then(m => ({ default: m.dssiTool })),
  easi: () => import('./easi').then(m => ({ default: m.easiTool })),
  essdai_cutaneous: () => import('./essdaiCutaneous').then(m => ({ default: m.essdaiCutaneousTool })),
  fitzpatrick_skin_type: () => import('./fitzpatrickSkinType').then(m => ({ default: m.fitzpatrickSkinTypeTool })),
  '5d_itch': () => import('./fiveDItch').then(m => ({ default: m.fiveDItchTool })),
  gags: () => import('./gags').then(m => ({ default: m.gagsTool })),
  hecsi: () => import('./hecsi').then(m => ({ default: m.hecsiTool })),
  hiscr: () => import('./hiscr').then(m => ({ default: m.hiscrTool })),
  hs_pga: () => import('./hsPga').then(m => ({ default: m.hsPgaTool })),
  hurley_staging_hs: () => import('./hurleyStagingHs').then(m => ({ default: m.hurleyStagingHsTool })),
  iga_acne: () => import('./igaAcne').then(m => ({ default: m.igaAcneTool })),
  iga_rosacea: () => import('./igaRosacea').then(m => ({ default: m.igaRosaceaTool })),
  ihs4: () => import('./ihs4').then(m => ({ default: m.ihs4Tool })),
  iim_sontheimer_2002: () => import('./iimSontheimer2002').then(m => ({ default: m.iimSontheimer2002Tool })),
  iss_vis: () => import('./issVis').then(m => ({ default: m.issVisTool })),
  loscat: () => import('./loscat').then(m => ({ default: m.loscatTool })),
  masi_mmasi: () => import('./masiMmasi').then(m => ({ default: m.masiMmasiTool })),
  melasqol: () => import('./melasqol').then(m => ({ default: m.melasqolTool })),
  mfg_score: () => import('./mfgScore').then(m => ({ default: m.mfgScoreTool })),
  mrss: () => import('./mrss').then(m => ({ default: m.mrssTool })),
  msi: () => import('./msi').then(m => ({ default: m.msiTool })),
  mss_hs: () => import('./mssHs').then(m => ({ default: m.mssHsTool })),
  mswat: () => import('./mswat').then(m => ({ default: m.mswatTool })),
  nappa_clin: () => import('./nappaClin').then(m => ({ default: m.nappaClinTool })),
  napsi: () => import('./napsi').then(m => ({ default: m.napsiTool })),
  nrs_pruritus: () => import('./nrsPruritus').then(m => ({ default: m.nrsPruritusTool })),
  parkland_formula: () => import('./parklandFormula').then(m => ({ default: m.parklandFormulaTool })),
  pasi: () => import('./pasi').then(m => ({ default: m.pasiTool })),
  pdai: () => import('./pdai').then(m => ({ default: m.pdaiTool })),
  pga_psoriasis: () => import('./pgaPsoriasis').then(m => ({ default: m.pgaPsoriasisTool })),
  pg_paracelsus: () => import('./pgParacelsus').then(m => ({ default: m.pgParacelsusTool })),
  poem: () => import('./poem').then(m => ({ default: m.poemTool })),
  // prism: () => import('./prism').then(m => ({ default: m.prismTool })),
  // pruritus_nrs: () => import('./pruritusNrs').then(m => ({ default: m.pruritusNrsTool })),
  // psocovid: () => import('./psocovid').then(m => ({ default: m.psocovidTool })),
  // psoriasis_epidemiology_screening: () => import('./psoriasisEpidemiologyScreening').then(m => ({ default: m.psoriasisEpidemiologyScreeningTool })),
  // pss4_skin: () => import('./pss4Skin').then(m => ({ default: m.pss4SkinTool })),
  pssi: () => import('./pssi').then(m => ({ default: m.pssiTool })),
  push: () => import('./push').then(m => ({ default: m.pushTool })),
  // pva_burn_wounds: () => import('./pvaBurnWounds').then(m => ({ default: m.pvaBurnWoundsTool })),
  // resvech2: () => import('./resvech2').then(m => ({ default: m.resvech2Tool })),
  // salt_ii: () => import('./saltIi').then(m => ({ default: m.saltIiTool })),
  // sapasi: () => import('./sapasi').then(m => ({ default: m.sapasiTool })),
  // sass: () => import('./sass').then(m => ({ default: m.sassTool })),
  // sccai: () => import('./sccai').then(m => ({ default: m.sccaiTool })),
  scorad: () => import('./scorad').then(m => ({ default: m.scoradTool })),
  // scoring_atopic_dermatitis: () => import('./scoringAtopicDermatitis').then(m => ({ default: m.scoringAtopicDermatitisTool })),
  seven_point_checklist: () => import('./sevenPointChecklist').then(m => ({ default: m.sevenPointChecklistTool })),
  // si: () => import('./si').then(m => ({ default: m.siTool })),
  // skindex_16: () => import('./skindex16').then(m => ({ default: m.skindex16Tool })),
  // sledai_2k_cutaneous: () => import('./sledai2kCutaneous').then(m => ({ default: m.sledai2kCutaneousTool })),
  // tiss: () => import('./tiss').then(m => ({ default: m.tissTool })),
  // tnss: () => import('./tnss').then(m => ({ default: m.tnssTool })),
  // topss: () => import('./topss').then(m => ({ default: m.topssTool })),
  // topss_2: () => import('./topss2').then(m => ({ default: m.topss2Tool })),
  pedis_classification: () => import('./pedisClassification').then(m => ({ default: m.pedisClassificationTool })),
  pest: () => import('./pest').then(m => ({ default: m.pestTool })),
  pg_delphi: () => import('./pgDelphi').then(m => ({ default: m.pgDelphiTool })),
  pg_su: () => import('./pgSu').then(m => ({ default: m.pgSuTool })),
  salt: () => import('./salt').then(m => ({ default: m.saltTool })),
  sasi: () => import('./sasi').then(m => ({ default: m.sasiTool })),
  sassad: () => import('./sassad').then(m => ({ default: m.sassadTool })),
  scorten: () => import('./scorten').then(m => ({ default: m.scortenTool })),
  scqoli10: () => import('./scqoli10').then(m => ({ default: m.scqoli10Tool })),
  sinbad_score: () => import('./sinbadScore').then(m => ({ default: m.sinbadScoreTool })),
  skindex29: () => import('./skindex29').then(m => ({ default: m.skindex29Tool })),
  sledai_skin: () => import('./sledaiSkin').then(m => ({ default: m.sledaiSkinTool })),
  slicc_criteria: () => import('./sliccCriteria').then(m => ({ default: m.sliccCriteriaTool })),
  uas7: () => import('./uas7').then(m => ({ default: m.uas7Tool })),
  uct: () => import('./uct').then(m => ({ default: m.uctTool })),
  ut_wound_classification: () => import('./utWoundClassification').then(m => ({ default: m.utWoundClassificationTool })),
  vas_pruritus: () => import('./vasPruritus').then(m => ({ default: m.vasPruritusTool })),
  vasi: () => import('./vasi').then(m => ({ default: m.vasiTool })),
  vida: () => import('./vida').then(m => ({ default: m.vidaTool })),
  viga_ad: () => import('./vigaAd').then(m => ({ default: m.vigaAdTool })),
  vitiqol: () => import('./vitiqol').then(m => ({ default: m.vitiqolTool }))
};

// Cache for loaded tools
const toolCache: Map<string, Tool> = new Map();

export async function loadTool(toolId: string): Promise<Tool | null> {
  // Convert to lazy loader format
  const lazyLoaderId = toLazyLoaderId(toolId);
  
  // Check cache first
  if (toolCache.has(toolId)) {
    return toolCache.get(toolId)!;
  }

  // Load tool dynamically
  const loader = toolLoaders[lazyLoaderId];
  if (!loader) {
    console.error(`Tool loader not found for: ${toolId} (tried ${lazyLoaderId})`);
    return null;
  }

  try {
    const loadedModule = await loader();
    const tool = loadedModule.default;
    toolCache.set(toolId, tool);
    return tool;
  } catch (error) {
    console.error(`Failed to load tool ${toolId}:`, error);
    return null;
  }
}

// Preload tools for better performance
export function preloadTool(toolId: string) {
  if (!toolCache.has(toolId)) {
    loadTool(toolId); // Fire and forget
  }
}

// Get all tool IDs without loading them
export function getAllToolIds(): string[] {
  return Object.keys(toolLoaders);
}