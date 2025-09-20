import * as React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import LinkedCalculators from '../../components/LinkedCalculators';

export default function Bundle_SJS_TEN() {
  const day3Key = 'bundle-sjs-ten-day3';
  const [ack, setAck] = React.useState(localStorage.getItem(day3Key) === '1');
  const dismiss = () => { localStorage.setItem(day3Key, '1'); setAck(true); };
  return (
    <Box>
      <Typography variant="h4" gutterBottom>SJS / TEN Bundle</Typography>
      {!ack && (
        <Box sx={{p:2, border:'1px dashed', mb:2}}>
          <Typography variant="body2"><strong>Reminder:</strong> Recalculate SCORTEN on hospital day 3 to refine prognosis.</Typography>
          <Button onClick={dismiss} size="small">Dismiss</Button>
        </Box>
      )}
      <Stack spacing={1}>
        <Typography>Pre‑selected tools:</Typography>
        <ul>
          <li><a href='/calculators/scorten'>SCORTEN</a></li>
          <li><a href='/calculators/alden'>ALDEN</a></li>
          <li><a href='/calculators/regiscar'>RegiSCAR (DRESS)</a></li>
        </ul>
        <LinkedCalculators links={[
          {id:'scorten', label:'Open SCORTEN'}
        ]} />
      </Stack>
    </Box>
  );
}
