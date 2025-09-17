import React, { memo } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';
import { Box } from '@mui/material';

const backgroundColors = ['#F5F0FA', '#E8D8F0', '#D8C8E8', '#C8B8D8'];

export const BackgroundShader = memo(() => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    >
      <MeshGradient
        colors={backgroundColors}
        speed={0.4}
        distortion={0.8}
        swirl={0.2}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.35,
        }}
      />
    </Box>
  );
});

BackgroundShader.displayName = 'BackgroundShader';