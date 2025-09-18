import React, { memo } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';
import { Box } from '@mui/material';

interface CardShaderProps {
  visible: boolean;
  colors?: string[];
}

const defaultColors = ['#6B4C8A11', '#8B6CAA11', '#D4826A11', '#E4A28A11'];

export const CardShader = memo<CardShaderProps>(({ visible, colors = defaultColors }) => {
  // Temporarily disable MeshGradient due to production build issues
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
        opacity: visible ? 0.05 : 0,
        transition: 'opacity 0.3s ease-in-out',
        borderRadius: 'inherit',
        background: visible
          ? `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`
          : 'transparent',
      }}
    />
  );
});

CardShader.displayName = 'CardShader';
