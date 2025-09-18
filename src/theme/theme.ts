import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#6B4C8A', // Soft purple - trust, healing, expertise
      dark: '#533A6B',
      light: '#8B6CAA',
    },
    secondary: {
      main: '#D4826A', // Warm terracotta - approachable, human touch
      dark: '#B66A52',
      light: '#E4A28A',
    },
    background: {
      default: '#FAFAF8', // Warm off-white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C2C2C',
      secondary: '#666666',
    },
    success: {
      main: '#5A8A5A', // Muted green
    },
    warning: {
      main: '#CC8800',
    },
    error: {
      main: '#CC4444',
    },
    divider: 'rgba(107, 76, 138, 0.08)', // Purple tint
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(107, 76, 138, 0.06)',
    '0px 2px 4px rgba(107, 76, 138, 0.08)',
    '0px 4px 6px rgba(107, 76, 138, 0.10)',
    '0px 6px 8px rgba(107, 76, 138, 0.12)',
    '0px 8px 10px rgba(107, 76, 138, 0.12)',
    '0px 10px 15px rgba(107, 76, 138, 0.12)',
    '0px 12px 17px rgba(107, 76, 138, 0.12)',
    '0px 14px 21px rgba(107, 76, 138, 0.12)',
    '0px 16px 24px rgba(107, 76, 138, 0.12)',
    '0px 18px 28px rgba(107, 76, 138, 0.12)',
    '0px 20px 32px rgba(107, 76, 138, 0.12)',
    '0px 22px 36px rgba(107, 76, 138, 0.12)',
    '0px 24px 40px rgba(107, 76, 138, 0.14)',
    '0px 26px 44px rgba(107, 76, 138, 0.14)',
    '0px 28px 48px rgba(107, 76, 138, 0.14)',
    '0px 30px 52px rgba(107, 76, 138, 0.14)',
    '0px 32px 56px rgba(107, 76, 138, 0.14)',
    '0px 34px 60px rgba(107, 76, 138, 0.14)',
    '0px 36px 64px rgba(107, 76, 138, 0.14)',
    '0px 38px 68px rgba(107, 76, 138, 0.14)',
    '0px 40px 72px rgba(107, 76, 138, 0.14)',
    '0px 42px 76px rgba(107, 76, 138, 0.14)',
    '0px 44px 80px rgba(107, 76, 138, 0.14)',
    '0px 46px 84px rgba(107, 76, 138, 0.14)',
  ],
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#2C2C2C',
          borderBottom: '1px solid rgba(107, 76, 138, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(107, 76, 138, 0.12)',
          },
        },
        outlined: {
          borderColor: 'rgba(107, 76, 138, 0.20)',
          '&:hover': {
            borderColor: 'rgba(107, 76, 138, 0.30)',
            backgroundColor: 'rgba(107, 76, 138, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(107, 76, 138, 0.08)',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(107, 76, 138, 0.15)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(107, 76, 138, 0.25)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          height: 28,
          fontSize: '0.75rem',
        },
        outlined: {
          borderColor: 'rgba(107, 76, 138, 0.15)',
        },
      },
    },
  },
});
