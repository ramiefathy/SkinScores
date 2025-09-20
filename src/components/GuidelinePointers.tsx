import * as React from 'react';
import { Typography, Link, Stack } from '@mui/material';

export default function GuidelinePointers({ items }:{ items:{ title:string; url:string }[] }){
  if (!items?.length) return null;
  return (
    <Stack spacing={0.5} sx={{mt:1}}>
      <Typography variant="caption" sx={{opacity:0.8}}>Guidelines & methodology:</Typography>
      {items.map((g,i)=>(
        <Link key={i} href={g.url} target="_blank" rel="noreferrer">{g.title}</Link>
      ))}
    </Stack>
  );
}
