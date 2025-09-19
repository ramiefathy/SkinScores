import React, { memo } from 'react';
import { Box } from '@mui/material';

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
        backgroundImage:
          'radial-gradient(circle at 30% 20%, rgba(107, 70, 193, 0.18), transparent 60%),' +
          'radial-gradient(circle at 70% 0%, rgba(139, 108, 170, 0.15), transparent 60%),' +
          'radial-gradient(circle at 90% 60%, rgba(212, 130, 106, 0.12), transparent 65%)',
        backgroundSize: '160% 160%',
        backgroundPosition: '0% 50%',
        animation: 'headerShift 20s ease-in-out infinite',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        },
        '@keyframes headerShift': {
          '0%': { backgroundPosition: '0% 60%' },
          '50%': { backgroundPosition: '100% 40%' },
          '100%': { backgroundPosition: '0% 60%' },
        },
      }}
    />
  );
});

HeaderShader.displayName = 'HeaderShader';
