import * as React from 'react';
import { Box, Typography, Stack } from '@mui/material';

export default function Bundle_EB() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Epidermolysis Bullosa Bundle</Typography>
      <Stack spacing={1}>
        <Typography>Pre‑selected tools:</Typography>
        <ul>
          <li><a href='/calculators/ebdasi'>EBDASI</a></li>
        </ul>
      </Stack>
    </Box>
  );
}
