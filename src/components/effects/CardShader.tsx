import React, { memo } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';
import { Box } from '@mui/material';

interface CardShaderProps {
  visible: boolean;
  colors?: string[];
}

const defaultColors = ['#6B4C8A11', '#8B6CAA11', '#D4826A11', '#E4A28A11'];

export const CardShader = memo<CardShaderProps>(({ visible, colors = defaultColors }) => {
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
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        borderRadius: 'inherit',
      }}
    >
      <MeshGradient
        colors={colors}
        speed={0.8}
        distortion={0.4}
        swirl={0.1}
        style={{
          position: 'absolute',
          inset: 0,
        }}
      />
    </Box>
  );
});

CardShader.displayName = 'CardShader';