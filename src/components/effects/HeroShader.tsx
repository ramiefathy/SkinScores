import React, { memo } from 'react';
import { Box } from '@mui/material';

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
        backgroundImage:
          'radial-gradient(circle at 10% 20%, rgba(107, 70, 193, 0.25), transparent 60%),' +
          'radial-gradient(circle at 65% 15%, rgba(139, 108, 170, 0.2), transparent 65%),' +
          'radial-gradient(circle at 85% 70%, rgba(212, 130, 106, 0.18), transparent 70%)',
        backgroundSize: '140% 140%',
        backgroundPosition: '0% 50%',
        animation: 'heroShift 25s ease-in-out infinite',
        '@keyframes heroShift': {
          '0%': { backgroundPosition: '0% 40%' },
          '50%': { backgroundPosition: '100% 60%' },
          '100%': { backgroundPosition: '0% 40%' },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(250, 250, 248, 0.6) 45%, rgba(250, 250, 248, 0.95) 100%)',
        }}
      />
    </Box>
  );
});

HeroShader.displayName = 'HeroShader';
