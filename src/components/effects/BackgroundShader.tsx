import React, { memo } from 'react';
import { Box } from '@mui/material';

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
        backgroundImage:
          'radial-gradient(circle at 15% 20%, rgba(107, 70, 193, 0.08), transparent 55%),' +
          'radial-gradient(circle at 85% 30%, rgba(139, 108, 170, 0.12), transparent 60%),' +
          'radial-gradient(circle at 50% 80%, rgba(212, 130, 106, 0.08), transparent 65%)',
        backgroundSize: '150% 150%',
        backgroundPosition: '0% 50%',
        animation: 'backgroundShift 28s ease-in-out infinite',
        '@keyframes backgroundShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    />
  );
});

BackgroundShader.displayName = 'BackgroundShader';
