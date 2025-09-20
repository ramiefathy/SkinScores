import * as React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function VersionPanel({ version, changes }:{ version:string; changes:string[] }){
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}><Typography>Tool version {version} – What changed?</Typography></AccordionSummary>
      <AccordionDetails>
        <ul>{changes.map((c,i)=>(<li key={i}>{c}</li>))}</ul>
      </AccordionDetails>
    </Accordion>
  );
}
