import * as React from 'react';
import { z } from 'zod';
import { FormControl, InputLabel, Select, MenuItem, Stack, Typography, Tooltip } from '@mui/material';

export const regiscarSchema = z.object({
  fever: z.enum(['yes','no','unknown']),
  lymphadenopathy: z.enum(['yes','no','unknown']),
  atypicalLymphocytes: z.enum(['yes','no','unknown']),
  eosinophilia: z.enum(['none','mild','marked','unknown']),
  skinExtent50: z.enum(['yes','no','unknown']),
  skinFeatures2of4: z.enum(['yes','no','unknown']),
  biopsySuggestive: z.enum(['yes','no','unknown']),
  organInvolvement: z.enum(['none','one','two_or_more','unknown']),
  resolutionGT15d: z.enum(['yes','no','unknown']),
  altDxExcluded: z.enum(['yes','no','unknown']),
});
export type RegiscarInput = z.infer<typeof regiscarSchema>;

export function regiscarCompute(i:RegiscarInput){
  const m = (v:'yes'|'no'|'unknown', yes:number, no:number, unk:number) => v==='yes'?yes:(v==='no'?no:unk);
  const d: Record<string, number> = {};
  d['fever'] = m(i.fever, 0, -1, -1);
  d['lymphadenopathy'] = m(i.lymphadenopathy, 1, 0, 0);
  d['atypical_lymphocytes'] = m(i.atypicalLymphocytes, 1, 0, 0);
  d['eosinophilia'] = i.eosinophilia==='marked'?2:(i.eosinophilia==='mild'?1:0);
  d['skin_extent_50'] = m(i.skinExtent50, 1, 0, 0);
  d['skin_features_2of4'] = m(i.skinFeatures2of4, 1, -1, 0);
  d['biopsy'] = m(i.biopsySuggestive, 0, -1, 0);
  d['organ_involvement'] = i.organInvolvement==='two_or_more'?2:(i.organInvolvement==='one'?1:0);
  d['resolution_gt_15d'] = m(i.resolutionGT15d, 0, -1, -1);
  d['alt_dx_excluded'] = m(i.altDxExcluded, 1, 0, 0);
  const score = Object.values(d).reduce((a,b)=>a+b,0);
  const category = score>5? 'definite' : score>=4? 'probable' : score>=2? 'possible' : 'no';
  return { score, category, details: d };
}

export default function RegiscarFull({ value, onChange }:{ value:RegiscarInput; onChange:(x:RegiscarInput)=>void }){
  const update = (p: Partial<RegiscarInput>) => onChange({ ...value, ...p });
  return (
    <Stack spacing={2}>
      <Typography variant="h6">RegiSCAR (DRESS)</Typography>
      {['fever','lymphadenopathy','atypicalLymphocytes','eosinophilia','skinExtent50','skinFeatures2of4','biopsySuggestive','organInvolvement','resolutionGT15d','altDxExcluded'].map((k)=>{
        const map:any = {
          fever:['yes','no','unknown'],
          lymphadenopathy:['yes','no','unknown'],
          atypicalLymphocytes:['yes','no','unknown'],
          eosinophilia:['none','mild','marked','unknown'],
          skinExtent50:['yes','no','unknown'],
          skinFeatures2of4:['yes','no','unknown'],
          biopsySuggestive:['yes','no','unknown'],
          organInvolvement:['none','one','two_or_more','unknown'],
          resolutionGT15d:['yes','no','unknown'],
          altDxExcluded:['yes','no','unknown']
        };
        const labels:any = {
          fever:'Fever > 38.5°C', lymphadenopathy:'Lymphadenopathy', atypicalLymphocytes:'Atypical lymphocytes',
          eosinophilia:'Eosinophilia', skinExtent50:'Skin involvement > 50% BSA', skinFeatures2of4:'≥2 of: edema, infiltration, purpura, scaling',
          biopsySuggestive:'Biopsy suggestive', organInvolvement:'Internal organ involvement', resolutionGT15d:'Resolution > 15 days', altDxExcluded:'Alternate diagnoses excluded'
        };
        return (
          <FormControl key={k} fullWidth>
            <Tooltip title={'Criterion: '+labels[k]}><InputLabel>{labels[k]}</InputLabel></Tooltip>
            <Select label={labels[k]} value={(value as any)[k]} onChange={e=>update({ [k]: e.target.value } as any)}>
              {map[k].map((v:string)=>(<MenuItem key={v} value={v}>{v}</MenuItem>))}
            </Select>
          </FormControl>
        );
      })}
    </Stack>
  );
}
