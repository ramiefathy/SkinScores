import React, { memo } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';
import { Box } from '@mui/material';

const headerColors = ['#6B4C8A22', '#8B6CAA22', '#D4826A22', '#E4A28A22'];

export const HeaderShader = memo(() => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        },
      }}
    >
      <MeshGradient
        colors={headerColors}
        speed={0.2}
        distortion={0.6}
        swirl={0.15}
        style={{
          position: 'absolute',
          inset: 0,
          transform: 'scale(1.1)',
        }}
      />
    </Box>
  );
});

HeaderShader.displayName = 'HeaderShader';