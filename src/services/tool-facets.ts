export type Facets = { disease:string; setting:string; input:string; time:string; };
export type ToolMetaExt = { id:string; name:string; version:string; facets:Facets; guidelines?:{title:string; url:string}[]; };

export const TOOL_FACETS: ToolMetaExt[] = [
  { id:'alden', name:'ALDEN (EN drug causality)', version:'1.0.0',
    facets:{ disease:'SJS/TEN', setting:'inpatient', input:'clinical+pharm', time:'5–10 min' },
    guidelines:[{ title:'VUMC SJS/TEN Guidelines (2023)', url:'https://www.vumc.org/burn/sites/default/files/public_files/Protocols/SJSTEN%20Guidelines%20-%20February%202023.pdf' }]
  },
  { id:'regiscar', name:'RegiSCAR (DRESS)', version:'1.0.0',
    facets:{ disease:'Drug eruption', setting:'in/outpatient', input:'clinical+lab+path', time:'5–10 min' } }
];
