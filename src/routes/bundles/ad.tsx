import * as React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import LinkedCalculators from '../../components/LinkedCalculators';

export default function Bundle_AD() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Atopic Dermatitis Bundle</Typography>
      <Stack spacing={1}>
        <Typography>Pre‑selected tools:</Typography>
        <ul>
          <li><a href='/calculators/easi'>EASI</a></li>
          <li><a href='/calculators/adct'>ADCT</a></li>
          <li><a href='/calculators/dlqi'>DLQI</a></li>
        </ul>
        <LinkedCalculators links={[
          {id:'easi', label:'Open EASI'}, {id:'adct', label:'Open ADCT'}, {id:'dlqi', label:'Open DLQI'}
        ]} />
      </Stack>
    </Box>
  );
}
