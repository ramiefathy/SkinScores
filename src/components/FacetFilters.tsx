import * as React from 'react';
import { TOOL_FACETS } from '../services/tool-facets';
import { Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export type FacetState = { disease?:string; setting?:string; input?:string; time?:string };

export default function FacetFilters({ value, onChange }:{ value:FacetState, onChange:(v:FacetState)=>void }){
  const uniq = (k: keyof NonNullable<typeof TOOL_FACETS[number]['facets']>) => Array.from(new Set(TOOL_FACETS.map((t: any) => t.facets[k]).filter(Boolean))).sort();
  const upd = (p: Partial<FacetState>) => onChange({ ...value, ...p });
  return (
    <Stack direction="row" spacing={2} sx={{ my: 1 }}>
      <FormControl size="small"><InputLabel>Disease</InputLabel>
        <Select label="Disease" value={value.disease||''} onChange={e=>upd({disease: e.target.value||undefined})} displayEmpty>
          <MenuItem value="">All</MenuItem>
          {uniq('disease').map((x: any) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl size="small"><InputLabel>Setting</InputLabel>
        <Select label="Setting" value={value.setting||''} onChange={e=>upd({setting: e.target.value||undefined})} displayEmpty>
          <MenuItem value="">All</MenuItem>
          {uniq('setting').map((x: any) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl size="small"><InputLabel>Input</InputLabel>
        <Select label="Input" value={value.input||''} onChange={e=>upd({input: e.target.value||undefined})} displayEmpty>
          <MenuItem value="">All</MenuItem>
          {uniq('input').map((x: any) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl size="small"><InputLabel>Time</InputLabel>
        <Select label="Time" value={value.time||''} onChange={e=>upd({time: e.target.value||undefined})} displayEmpty>
          <MenuItem value="">All</MenuItem>
          {uniq('time').map((x: any) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
        </Select>
      </FormControl>
    </Stack>
  );
}
