import React, { memo } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';
import { Box } from '@mui/material';

const heroColors = ['#6B4C8A', '#8B6CAA', '#D4826A', '#E4A28A'];

export const HeroShader = memo(() => {
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
      }}
    >
      <MeshGradient
        colors={heroColors}
        speed={0.3}
        distortion={1.2}
        swirl={0.35}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(250, 250, 248, 0.5) 50%, rgba(250, 250, 248, 0.9) 100%)',
        }}
      />
    </Box>
  );
});

HeroShader.displayName = 'HeroShader';