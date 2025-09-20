import { smartFetch, smartRequest } from './epic';
import { LOINC, observationNumeric } from '../fhir/observations';

export async function fetchLab(loinc: {system:string, code:string}, patientId?: string){
  const q = new URLSearchParams({ code: `${loinc.system}|${loinc.code}` });
  const bundle = await smartFetch(`Observation?${q.toString()}`);
  const obs = bundle.entry?.[0]?.resource;
  const v = obs?.valueQuantity?.value;
  return typeof v === 'number' ? v : undefined;
}

export async function writeObservationNumeric({ system, code, display, value, unit, toolId, toolVersion }:{
  system:string, code:string, display:string, value:number, unit:string, toolId:string, toolVersion:string
}){
  // In a real app: POST to /Observation
  const body = observationNumeric({ system, code, display, value, unit, toolId, toolVersion });
  const created = await smartRequest('Observation', { method:'POST', body: JSON.stringify(body) });
  return created;
}

// Convenience
export const Prefill = { BUN: () => fetchLab(LOINC.BUN), GLUCOSE: () => fetchLab(LOINC.GLUCOSE), BICARB: () => fetchLab(LOINC.BICARB) };
