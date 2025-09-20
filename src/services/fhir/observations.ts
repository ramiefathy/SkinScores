export type Observation = any;
export function observationNumeric(opts: { system:string, code:string, display:string, value:number, unit:string, toolId:string, toolVersion:string }){
  return {
    resourceType: 'Observation',
    status: 'final',
    code: { coding: [{ system: opts.system, code: opts.code, display: opts.display }], text: opts.display },
    valueQuantity: { value: opts.value, unit: opts.unit },
    extension: [{ url:'https://skinscores.com/fhir/tool', valueString: `${opts.toolId}@${opts.toolVersion}` }]
  };
}
export const LOINC = {
  BUN: { system:'http://loinc.org', code:'3094-0', display:'Urea nitrogen [Mass/volume] in Serum or Plasma' },
  GLUCOSE: { system:'http://loinc.org', code:'2345-7', display:'Glucose [Mass/volume] in Serum or Plasma' },
  BICARB: { system:'http://loinc.org', code:'1963-8', display:'Bicarbonate [Moles/volume] in Serum or Plasma' }
};
