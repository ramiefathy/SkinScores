import * as React from 'react';
import { z } from 'zod';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Stack, Typography, Tooltip } from '@mui/material';

export const aldenSchema = z.object({
  delayCategory: z.enum(['suggestive','compatible','likely','unlikely','excluded']),
  delayPrevReaction: z.boolean().optional(),
  drugPresent: z.enum(['definite','doubtful','excluded']),
  prechallenge: z.enum(['pos_specific_drug_disease','pos_specific_drug','pos_unspecific','none_unknown','negative']),
  dechallenge: z.enum(['drug_stopped','continued_or_unknown']),
  notoriety: z.enum(['strongly_associated','associated','suspected','unknown','not_suspected','intermediate']),
  otherCauses: z.enum(['none','present_intermediate_or_higher']),
});
export type AldenInput = z.infer<typeof aldenSchema>;

export function aldenCompute(i:AldenInput){
  const d: Record<string, number> = {};
  d['delay'] = ({suggestive:3, compatible:2, likely:1, unlikely:-1, excluded:-3} as any)[i.delayCategory];
  d['drug_present'] = ({definite:0, doubtful:-1, excluded:-3} as any)[i.drugPresent];
  d['prechallenge'] = ({pos_specific_drug_disease:4, pos_specific_drug:2, pos_unspecific:1, none_unknown:0, negative:-2} as any)[i.prechallenge];
  d['dechallenge'] = i.dechallenge==='drug_stopped'?0:-2;
  let notScore = 0;
  if (i.notoriety==='strongly_associated') notScore = 3;
  else if (i.notoriety==='associated') notScore = 2;
  else if (i.notoriety==='suspected') notScore = 1;
  else if (i.notoriety==='unknown') notScore = 0;
  else if (i.notoriety==='not_suspected') notScore = -1;
  else {
    const base = d['delay'] + d['drug_present'] + d['prechallenge'] + d['dechallenge'];
    notScore = Math.max(-1, Math.min(1, Math.sign(base) * Math.floor(Math.abs(base)/4)));
  }
  d['notoriety'] = notScore;
  d['other_causes'] = i.otherCauses==='none'?0:-1;
  const score = Object.values(d).reduce((a,b)=>a+b,0);
  const category = score>=6? 'very probable' : score>=4? 'probable' : score>=2? 'possible' : score>=0? 'unlikely' : 'very unlikely';
  return { score, category, details: d };
}

export default function AldenFull({ value, onChange }:{ value:AldenInput; onChange:(x:AldenInput)=>void }){
  const update = (p: Partial<AldenInput>) => onChange({ ...value, ...p });
  return (
    <Stack spacing={2}>
      <Typography variant="h6">ALDEN: Drug causality for epidermal necrolysis</Typography>
      <FormControl fullWidth>
        <Tooltip title='Time from first dose to index day'><InputLabel>Latency from first dose</InputLabel></Tooltip>
        <Select label="Latency" value={value.delayCategory} onChange={e=>update({delayCategory: e.target.value as any})}>
          <MenuItem value="suggestive">Suggestive +3 (5–28 d)</MenuItem>
          <MenuItem value="compatible">Compatible +2 (29–56 d)</MenuItem>
          <MenuItem value="likely">Likely +1 (1–4 d)</MenuItem>
          <MenuItem value="unlikely">Unlikely −1 (&gt;56 d)</MenuItem>
          <MenuItem value="excluded">Excluded −3 (on/after index)</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel control={<Checkbox checked={!!value.delayPrevReaction} onChange={e=>update({delayPrevReaction: e.target.checked})}/>} label="Prior reaction to same drug" />
      <FormControl fullWidth>
        <Tooltip title='Consider drug half-life and dosing schedule'><InputLabel>Drug present at index day</InputLabel></Tooltip>
        <Select label="Drug present" value={value.drugPresent} onChange={e=>update({drugPresent: e.target.value as any})}>
          <MenuItem value="definite">Definite 0</MenuItem>
          <MenuItem value="doubtful">Doubtful −1</MenuItem>
          <MenuItem value="excluded">Excluded −3</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <Tooltip title='Prior exposures and their outcomes'><InputLabel>Prechallenge / Rechallenge</InputLabel></Tooltip>
        <Select label="Pre/Rechallenge" value={value.prechallenge} onChange={e=>update({prechallenge: e.target.value as any})}>
          <MenuItem value="pos_specific_drug_disease">SJS/TEN after same drug +4</MenuItem>
          <MenuItem value="pos_specific_drug">SJS/TEN after similar drug OR other reaction after same drug +2</MenuItem>
          <MenuItem value="pos_unspecific">Other reaction after similar drug +1</MenuItem>
          <MenuItem value="none_unknown">No known exposure 0</MenuItem>
          <MenuItem value="negative">Exposure without reaction −2</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <Tooltip title='Response after stopping the drug'><InputLabel>Dechallenge</InputLabel></Tooltip>
        <Select label="Dechallenge" value={value.dechallenge} onChange={e=>update({dechallenge: e.target.value as any})}>
          <MenuItem value="drug_stopped">Drug stopped 0</MenuItem>
          <MenuItem value="continued_or_unknown">Continued or unknown −2</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <Tooltip title='Known association of the drug with SJS/TEN'><InputLabel>Drug notoriety</InputLabel></Tooltip>
        <Select label="Notoriety" value={value.notoriety} onChange={e=>update({notoriety: e.target.value as any})}>
          <MenuItem value="strongly_associated">Strongly associated +3</MenuItem>
          <MenuItem value="associated">Associated +2</MenuItem>
          <MenuItem value="suspected">Suspected +1</MenuItem>
          <MenuItem value="unknown">Unknown 0</MenuItem>
          <MenuItem value="not_suspected">Not suspected −1</MenuItem>
          <MenuItem value="intermediate">Intermediate −1..+1</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <Tooltip title='Exclude infectious and autoimmune mimickers'><InputLabel>Other causes</InputLabel></Tooltip>
        <Select label="Other causes" value={value.otherCauses} onChange={e=>update({otherCauses: e.target.value as any})}>
          <MenuItem value="none">None 0</MenuItem>
          <MenuItem value="present_intermediate_or_higher">Present −1</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
