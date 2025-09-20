import * as React from 'react';
import { Stack, Link, Typography } from '@mui/material';

export default function LinkedCalculators(props: { links: { id:string; label:string; params?:Record<string,string|number> }[] }){
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="body2" sx={{opacity:0.8}}>Related tools:</Typography>
      {props.links.map((l, idx)=>(
        <Link key={idx} href={`/calculators/${l.id}${l.params ? ('?'+ new URLSearchParams(l.params as any).toString()):''}`} underline="hover">
          {l.label}
        </Link>
      ))}
    </Stack>
  );
}
