import type { Tool } from './types';
import { toLazyLoaderId } from './tool-id-mapper';
import { wrapToolCalculation } from './calculation-wrapper';

// Lazy load individual tools
export const toolLoaders: Record<string, () => Promise<{ default: Tool }>> = {
  aas: () =>
    import(/* webpackChunkName: "tool-aas" */ './aas').then((m) => ({ default: m.aasTool })),
  abcde_melanoma: () =>
    import(/* webpackChunkName: "tool-abcde-melanoma" */ './abcdeMelanoma').then((m) => ({
      default: m.abcdeMelanomaTool,
    })),
  absis: () =>
    import(/* webpackChunkName: "tool-absis" */ './absis').then((m) => ({ default: m.absisTool })),
  acne_qol: () =>
    import(/* webpackChunkName: "tool-acne-qol" */ './acneQol').then((m) => ({
      default: m.acneQolTool,
    })),
  aect: () =>
    import(/* webpackChunkName: "tool-aect" */ './aect').then((m) => ({ default: m.aectTool })),
  alden: () =>
    import(/* webpackChunkName: "tool-alden" */ './alden').then((m) => ({ default: m.aldenTool })),
  alt70: () =>
    import(/* webpackChunkName: "tool-alt70" */ './alt70').then((m) => ({ default: m.alt70Tool })),
  behcet_criteria: () =>
    import(/* webpackChunkName: "tool-behcet-criteria" */ './behcetCriteria').then((m) => ({
      default: m.behcetCriteriaTool,
    })),
  bilag_skin: () =>
    import(/* webpackChunkName: "tool-bilag-skin" */ './bilagSkin').then((m) => ({
      default: m.bilagSkinTool,
    })),
  bpdai: () =>
    import(/* webpackChunkName: "tool-bpdai" */ './bpdai').then((m) => ({ default: m.bpdaiTool })),
  braden_scale: () =>
    import(/* webpackChunkName: "tool-braden-scale" */ './bradenScale').then((m) => ({
      default: m.bradenScaleTool,
    })),
  bvas_skin: () =>
    import(/* webpackChunkName: "tool-bvas-skin" */ './bvasSkin').then((m) => ({
      default: m.bvasSkinTool,
    })),
  bwat: () =>
    import(/* webpackChunkName: "tool-bwat" */ './bwat').then((m) => ({ default: m.bwatTool })),
  caspar_criteria: () =>
    import(/* webpackChunkName: "tool-caspar-criteria" */ './casparCriteria').then((m) => ({
      default: m.casparCriteriaTool,
    })),
  cdasi: () =>
    import(/* webpackChunkName: "tool-cdasi" */ './cdasi').then((m) => ({ default: m.cdasiTool })),
  cdlqi: () =>
    import(/* webpackChunkName: "tool-cdlqi" */ './cdlqi').then((m) => ({ default: m.cdlqiTool })),
  cea_rosacea: () =>
    import(/* webpackChunkName: "tool-cea-rosacea" */ './ceaRosacea').then((m) => ({
      default: m.ceaRosaceaTool,
    })),
  clasi: () =>
    import(/* webpackChunkName: "tool-clasi" */ './clasi').then((m) => ({ default: m.clasiTool })),
  ctcae_skin: () =>
    import(/* webpackChunkName: "tool-ctcae-skin" */ './ctcaeSkin').then((m) => ({
      default: m.ctcaeSkinTool,
    })),
  dapsa: () =>
    import(/* webpackChunkName: "tool-dapsa" */ './dapsa').then((m) => ({ default: m.dapsaTool })),
  dasi: () =>
    import(/* webpackChunkName: "tool-dasi" */ './dasi').then((m) => ({ default: m.dasiTool })),
  dlqi: () =>
    import(/* webpackChunkName: "tool-dlqi" */ './dlqi').then((m) => ({ default: m.dlqiTool })),
  ebdasi: () =>
    import(/* webpackChunkName: "tool-ebdasi" */ './ebdasi').then((m) => ({ default: m.ebdasiTool })),
  dssi: () =>
    import(/* webpackChunkName: "tool-dssi" */ './dssi').then((m) => ({ default: m.dssiTool })),
  easi: () =>
    import(/* webpackChunkName: "tool-easi" */ './easi').then((m) => ({ default: m.easiTool })),
  essdai_cutaneous: () =>
    import(/* webpackChunkName: "tool-essdai-cutaneous" */ './essdaiCutaneous').then((m) => ({
      default: m.essdaiCutaneousTool,
    })),
  ferriman_gallwey: () =>
    import(/* webpackChunkName: "tool-ferriman-gallwey" */ './ferrimanGallwey').then((m) => ({
      default: m.ferrimanGallweyTool,
    })),
  fitzpatrick_skin_type: () =>
    import(/* webpackChunkName: "tool-fitzpatrick-skin-type" */ './fitzpatrickSkinType').then(
      (m) => ({ default: m.fitzpatrickSkinTypeTool }),
    ),
  '5d_itch': () =>
    import(/* webpackChunkName: "tool-5d-itch" */ './fiveDItch').then((m) => ({
      default: m.fiveDItchTool,
    })),
  gags: () =>
    import(/* webpackChunkName: "tool-gags" */ './gags').then((m) => ({ default: m.gagsTool })),
  hdss: () =>
    import(/* webpackChunkName: "tool-hdss" */ './hdss').then((m) => ({ default: m.hdssTool })),
  hecsi: () =>
    import(/* webpackChunkName: "tool-hecsi" */ './hecsi').then((m) => ({ default: m.hecsiTool })),
  hiscr: () =>
    import(/* webpackChunkName: "tool-hiscr" */ './hiscr').then((m) => ({ default: m.hiscrTool })),
  hs_pga: () =>
    import(/* webpackChunkName: "tool-hs-pga" */ './hsPga').then((m) => ({ default: m.hsPgaTool })),
  hurley_staging_hs: () =>
    import(/* webpackChunkName: "tool-hurley-staging-hs" */ './hurleyStagingHs').then((m) => ({
      default: m.hurleyStagingHsTool,
    })),
  iga_acne: () =>
    import(/* webpackChunkName: "tool-iga-acne" */ './igaAcne').then((m) => ({
      default: m.igaAcneTool,
    })),
  iga_rosacea: () =>
    import(/* webpackChunkName: "tool-iga-rosacea" */ './igaRosacea').then((m) => ({
      default: m.igaRosaceaTool,
    })),
  ihs4: () =>
    import(/* webpackChunkName: "tool-ihs4" */ './ihs4').then((m) => ({ default: m.ihs4Tool })),
  iim_sontheimer_2002: () =>
    import(/* webpackChunkName: "tool-iim-sontheimer2002" */ './iimSontheimer2002').then((m) => ({
      default: m.iimSontheimer2002Tool,
    })),
  iss_vis: () =>
    import(/* webpackChunkName: "tool-iss-vis" */ './issVis').then((m) => ({
      default: m.issVisTool,
    })),
  leeds_revised: () =>
    import(/* webpackChunkName: "tool-leeds-revised" */ './leedsRevised').then((m) => ({
      default: m.leedsRevisedTool,
    })),
  loscat: () =>
    import(/* webpackChunkName: "tool-loscat" */ './loscat').then((m) => ({
      default: m.loscatTool,
    })),
  masi_mmasi: () =>
    import(/* webpackChunkName: "tool-masi-mmasi" */ './masiMmasi').then((m) => ({
      default: m.masiMmasiTool,
    })),
  melasqol: () =>
    import(/* webpackChunkName: "tool-melasqol" */ './melasqol').then((m) => ({
      default: m.melasqolTool,
    })),
  mfg_score: () =>
    import(/* webpackChunkName: "tool-mfg-score" */ './mfgScore').then((m) => ({
      default: m.mfgScoreTool,
    })),
  mrss: () =>
    import(/* webpackChunkName: "tool-mrss" */ './mrss').then((m) => ({ default: m.mrssTool })),
  msi: () =>
    import(/* webpackChunkName: "tool-msi" */ './msi').then((m) => ({ default: m.msiTool })),
  mss_hs: () =>
    import(/* webpackChunkName: "tool-mss-hs" */ './mssHs').then((m) => ({ default: m.mssHsTool })),
  mswat: () =>
    import(/* webpackChunkName: "tool-mswat" */ './mswat').then((m) => ({ default: m.mswatTool })),
  nappa_clin: () =>
    import(/* webpackChunkName: "tool-nappa-clin" */ './nappaClin').then((m) => ({
      default: m.nappaClinTool,
    })),
  napsi: () =>
    import(/* webpackChunkName: "tool-napsi" */ './napsi').then((m) => ({ default: m.napsiTool })),
  nrs_pruritus: () =>
    import(/* webpackChunkName: "tool-nrs-pruritus" */ './nrsPruritus').then((m) => ({
      default: m.nrsPruritusTool,
    })),
  osi: () =>
    import(/* webpackChunkName: "tool-osi" */ './osi').then((m) => ({ default: m.osiTool })),
  parkland_formula: () =>
    import(/* webpackChunkName: "tool-parkland-formula" */ './parklandFormula').then((m) => ({
      default: m.parklandFormulaTool,
    })),
  pasi: () =>
    import(/* webpackChunkName: "tool-pasi" */ './pasi').then((m) => ({ default: m.pasiTool })),
  pdai: () =>
    import(/* webpackChunkName: "tool-pdai" */ './pdai').then((m) => ({ default: m.pdaiTool })),
  pga_psoriasis: () =>
    import(/* webpackChunkName: "tool-pga-psoriasis" */ './pgaPsoriasis').then((m) => ({
      default: m.pgaPsoriasisTool,
    })),
  pg_paracelsus: () =>
    import(/* webpackChunkName: "tool-pg-paracelsus" */ './pgParacelsus').then((m) => ({
      default: m.pgParacelsusTool,
    })),
  poem: () =>
    import(/* webpackChunkName: "tool-poem" */ './poem').then((m) => ({ default: m.poemTool })),
  posas: () =>
    import(/* webpackChunkName: "tool-posas" */ './posas').then((m) => ({ default: m.posasTool })),
  // prism: () => import(/* webpackChunkName: "tool-prism" */ './prism').then(m => ({ default: m.prismTool })),
  // pruritus_nrs: () => import(/* webpackChunkName: "tool-pruritus-nrs" */ './pruritusNrs').then(m => ({ default: m.pruritusNrsTool })),
  // psocovid: () => import(/* webpackChunkName: "tool-psocovid" */ './psocovid').then(m => ({ default: m.psocovidTool })),
  // psoriasis_epidemiology_screening: () => import(/* webpackChunkName: "tool-psoriasis-epidemiology-screening" */ './psoriasisEpidemiologyScreening').then(m => ({ default: m.psoriasisEpidemiologyScreeningTool })),
  // pss4_skin: () => import(/* webpackChunkName: "tool-pss4-skin" */ './pss4Skin').then(m => ({ default: m.pss4SkinTool })),
  pssi: () =>
    import(/* webpackChunkName: "tool-pssi" */ './pssi').then((m) => ({ default: m.pssiTool })),
  push: () =>
    import(/* webpackChunkName: "tool-push" */ './push').then((m) => ({ default: m.pushTool })),
  // pva_burn_wounds: () => import(/* webpackChunkName: "tool-pva-burn-wounds" */ './pvaBurnWounds').then(m => ({ default: m.pvaBurnWoundsTool })),
  // resvech2: () => import(/* webpackChunkName: "tool-resvech2" */ './resvech2').then(m => ({ default: m.resvech2Tool })),
  // salt_ii: () => import(/* webpackChunkName: "tool-salt-ii" */ './saltIi').then(m => ({ default: m.saltIiTool })),
  // sapasi: () => import(/* webpackChunkName: "tool-sapasi" */ './sapasi').then(m => ({ default: m.sapasiTool })),
  // sass: () => import(/* webpackChunkName: "tool-sass" */ './sass').then(m => ({ default: m.sassTool })),
  // sccai: () => import(/* webpackChunkName: "tool-sccai" */ './sccai').then(m => ({ default: m.sccaiTool })),
  scorad: () =>
    import(/* webpackChunkName: "tool-scorad" */ './scorad').then((m) => ({
      default: m.scoradTool,
    })),
  // scoring_atopic_dermatitis: () => import(/* webpackChunkName: "tool-scoring-atopic-dermatitis" */ './scoringAtopicDermatitis').then(m => ({ default: m.scoringAtopicDermatitisTool })),
  seven_point_checklist: () =>
    import(/* webpackChunkName: "tool-seven-point-checklist" */ './sevenPointChecklist').then(
      (m) => ({ default: m.sevenPointChecklistTool }),
    ),
  // si: () => import(/* webpackChunkName: "tool-si" */ './si').then(m => ({ default: m.siTool })),
  // skindex_16: () => import(/* webpackChunkName: "tool-skindex16" */ './skindex16').then(m => ({ default: m.skindex16Tool })),
  // sledai_2k_cutaneous: () => import(/* webpackChunkName: "tool-sledai2k-cutaneous" */ './sledai2kCutaneous').then(m => ({ default: m.sledai2kCutaneousTool })),
  // tiss: () => import(/* webpackChunkName: "tool-tiss" */ './tiss').then(m => ({ default: m.tissTool })),
  // tnss: () => import(/* webpackChunkName: "tool-tnss" */ './tnss').then(m => ({ default: m.tnssTool })),
  // topss: () => import(/* webpackChunkName: "tool-topss" */ './topss').then(m => ({ default: m.topssTool })),
  // topss_2: () => import(/* webpackChunkName: "tool-topss2" */ './topss2').then(m => ({ default: m.topss2Tool })),
  pedis_classification: () =>
    import(/* webpackChunkName: "tool-pedis-classification" */ './pedisClassification').then(
      (m) => ({ default: m.pedisClassificationTool }),
    ),
  pest: () =>
    import(/* webpackChunkName: "tool-pest" */ './pest').then((m) => ({ default: m.pestTool })),
  pg_delphi: () =>
    import(/* webpackChunkName: "tool-pg-delphi" */ './pgDelphi').then((m) => ({
      default: m.pgDelphiTool,
    })),
  pg_su: () =>
    import(/* webpackChunkName: "tool-pg-su" */ './pgSu').then((m) => ({ default: m.pgSuTool })),
  regiscar: () =>
    import(/* webpackChunkName: "tool-regiscar" */ './regiscar').then((m) => ({ default: m.regiscarTool })),
  salt: () =>
    import(/* webpackChunkName: "tool-salt" */ './salt').then((m) => ({ default: m.saltTool })),
  sasi: () =>
    import(/* webpackChunkName: "tool-sasi" */ './sasi').then((m) => ({ default: m.sasiTool })),
  sassad: () =>
    import(/* webpackChunkName: "tool-sassad" */ './sassad').then((m) => ({
      default: m.sassadTool,
    })),
  scorten: () =>
    import(/* webpackChunkName: "tool-scorten" */ './scorten').then((m) => ({
      default: m.scortenTool,
    })),
  scqoli10: () =>
    import(/* webpackChunkName: "tool-scqoli10" */ './scqoli10').then((m) => ({
      default: m.scqoli10Tool,
    })),
  sinbad_score: () =>
    import(/* webpackChunkName: "tool-sinbad-score" */ './sinbadScore').then((m) => ({
      default: m.sinbadScoreTool,
    })),
  skindex29: () =>
    import(/* webpackChunkName: "tool-skindex29" */ './skindex29').then((m) => ({
      default: m.skindex29Tool,
    })),
  sledai_skin: () =>
    import(/* webpackChunkName: "tool-sledai-skin" */ './sledaiSkin').then((m) => ({
      default: m.sledaiSkinTool,
    })),
  slicc_criteria: () =>
    import(/* webpackChunkName: "tool-slicc-criteria" */ './sliccCriteria').then((m) => ({
      default: m.sliccCriteriaTool,
    })),
  uas7: () =>
    import(/* webpackChunkName: "tool-uas7" */ './uas7').then((m) => ({ default: m.uas7Tool })),
  uct: () =>
    import(/* webpackChunkName: "tool-uct" */ './uct').then((m) => ({ default: m.uctTool })),
  ut_wound_classification: () =>
    import(/* webpackChunkName: "tool-ut-wound-classification" */ './utWoundClassification').then(
      (m) => ({ default: m.utWoundClassificationTool }),
    ),
  vancouver_scar: () =>
    import(/* webpackChunkName: "tool-vancouver-scar" */ './vancouverScar').then((m) => ({
      default: m.vancouverScarTool,
    })),
  vas_pruritus: () =>
    import(/* webpackChunkName: "tool-vas-pruritus" */ './vasPruritus').then((m) => ({
      default: m.vasPruritusTool,
    })),
  vasi: () =>
    import(/* webpackChunkName: "tool-vasi" */ './vasi').then((m) => ({ default: m.vasiTool })),
  vida: () =>
    import(/* webpackChunkName: "tool-vida" */ './vida').then((m) => ({ default: m.vidaTool })),
  viga_ad: () =>
    import(/* webpackChunkName: "tool-viga-ad" */ './vigaAd').then((m) => ({
      default: m.vigaAdTool,
    })),
  vitiqol: () =>
    import(/* webpackChunkName: "tool-vitiqol" */ './vitiqol').then((m) => ({
      default: m.vitiqolTool,
    })),
};

// Cache for loaded tools
const toolCache: Map<string, Tool> = new Map();

// Retry configuration
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

  // Retry logic for chunk loading failures
  let lastError: unknown;
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      const loadedModule = await loader();
      const tool = loadedModule.default;

      // Validate the loaded tool
      if (!tool || typeof tool !== 'object' || !tool.id) {
        throw new Error(`Invalid tool loaded: ${toolId}`);
      }

      // Wrap tool calculation with error handling
      const wrappedTool = wrapToolCalculation(tool);

      toolCache.set(toolId, wrappedTool);
      return wrappedTool;
    } catch (error) {
      lastError = error;
      console.warn(`Failed to load tool ${toolId} (attempt ${attempt}/${RETRY_ATTEMPTS}):`, error);

      // Check if it's a chunk loading error
      const isChunkError =
        error instanceof Error &&
        (error.message.includes('Loading chunk') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('ChunkLoadError') ||
          error.message.includes('app-pages-internals') ||
          error.message.includes('NetworkError') ||
          error.message.includes('CORS') ||
          error.message.includes('cross-origin'));

      // Check for specific cross-origin errors
      const isCrossOriginError =
        error instanceof Error &&
        (error.message.includes('CORS') ||
          error.message.includes('cross-origin') ||
          error.message.includes('Blocked by CORS policy'));

      if (isCrossOriginError) {
        console.error(
          `Cross-origin error loading tool ${toolId}. Ensure the dev server allows the current domain.`,
        );
      }

      if (isChunkError && attempt < RETRY_ATTEMPTS) {
        // Wait before retrying with exponential backoff
        await sleep(RETRY_DELAY_MS * attempt);

        // Clear webpack cache more thoroughly
        if (typeof window !== 'undefined') {
          try {
            // Clear webpack cache
            if ((window as any).__webpack_require__) {
              const cache = (window as any).__webpack_require__.cache;
              Object.keys(cache).forEach((key) => {
                if (key.includes(lazyLoaderId) || key.includes(toolId)) {
                  delete cache[key];
                }
              });
            }

            // Clear module hot reload cache if available
            if ((window as any).module && (window as any).module.hot) {
              (window as any).module.hot.dispose(() => {
                toolCache.delete(toolId);
              });
            }
          } catch (e) {
            console.warn('Failed to clear webpack cache:', e);
          }
        }

        console.log(`Retrying tool load ${toolId} (attempt ${attempt + 1}/${RETRY_ATTEMPTS})...`);
        continue;
      }

      // If not a chunk error or last attempt, break
      break;
    }
  }

  console.error(`Failed to load tool ${toolId} after ${RETRY_ATTEMPTS} attempts:`, lastError);
  return null;
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
