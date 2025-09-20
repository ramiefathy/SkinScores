export type Interpretation = {
  statement: string;
  bands?: { label:string; range:string }[];
  next?: string[];
  limitations?: string[];
  citations?: { title:string; url:string }[];
};

export function interpret(toolId:string, result:any): Interpretation {
  switch(toolId){
    case 'alden':
      return {
        statement: `ALDEN ${result.score} → ${result.category}`,
        bands: [
          { label:'Very probable', range:'≥6' },
          { label:'Probable', range:'4–5' },
          { label:'Possible', range:'2–3' },
          { label:'Unlikely', range:'0–1' },
          { label:'Very unlikely', range:'<0' }
        ],
        next: ['Stop all suspected drugs', 'Consult burn/derm + pharmacy', 'Document allergy and counsel'],
        limitations: ['Requires timing, PK, organ function and notoriety assessment; not a substitute for clinical judgement'],
        citations: [
          { title:'Sassolas 2010 – ALDEN Table 5', url:'https://toxibul.fr/wp-content/uploads/2020/06/algorithm-for-assessment-of-drug-causality-in-stevens%E2%80%93johnson-syndrome-and-toxic-epidermal-necrolysis.pdf' }
        ]
      };
    case 'regiscar':
      return {
        statement: `RegiSCAR ${result.score} → ${result.category}`,
        bands: [
          { label:'Definite', range:'>5' },
          { label:'Probable', range:'4–5' },
          { label:'Possible', range:'2–3' },
          { label:'No case', range:'<2' }
        ],
        next: ['Stop culprit drug', 'Assess organ involvement and monitor labs', 'Supportive care ± systemic therapy per guideline'],
        limitations: ['Requires workup to exclude alternative diagnoses and longitudinal follow‑up'],
        citations: [
          { title:'Kardaun 2013 – Br J Dermatol', url:'https://pubmed.ncbi.nlm.nih.gov/23855313/' }
        ]
      };
    default:
      return { statement: '' };
  }
}
