# SkinScores UI/UX Detailed Implementation Plan

**Last Updated:** December 19, 2025
**Status:** Phase 2 Complete - Clinical Tools Expansion

## Recent Updates (Dec 17-19, 2025)

### Completed Implementations
- ✅ **12 new clinical tools** added (ALDEN, RegiSCAR, AECT, EBDASI, HDSS, Ferriman-Gallwey, OSI, POSAS, VSS, Leeds Revised, MDA, AAS-28)
- ✅ **8 existing tools enhanced** with formulas and clinical context
- ✅ **CI/CD pipeline fixed** - GitHub Actions permissions resolved
- ✅ **3,584 lines of code** added across 65 files
- ✅ **All tests passing** - 9/9 test suites green
- ✅ **Preview deployment** active and functional

### Current Phase Status
- **Phase 1:** ✅ Complete - Core UI/UX improvements
- **Phase 2:** ✅ Complete - Clinical tools expansion (70+ tools now available)
- **Phase 3:** 🔄 Ready to begin - Performance optimization & advanced features

## Project Context for AI Implementation Agent

### Application Overview

SkinScores is a clinical dermatology scoring application built with:

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query) + Zustand
- **Backend**: Firebase (Firestore, Auth, Cloud Functions)
- **Search**: Fuse.js for fuzzy search
- **Form Handling**: React Hook Form + Zod validation
- **Date Handling**: date-fns

### Current File Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── effects/       # Visual effects (shaders)
│   ├── filters/       # Filter components
│   ├── layout/        # AppShell, NavigationDrawer
│   ├── navigation/    # QuickAccessBar
│   ├── search/        # GlobalSearch
│   └── tools/         # ToolCard
├── hooks/             # Custom React hooks
├── routes/            # Page components
│   ├── analytics/
│   ├── auth/
│   ├── calculators/
│   ├── dashboard/
│   ├── home/
│   ├── library/
│   └── patients/
├── services/          # Business logic
├── theme/             # MUI theme configuration
├── tools/             # Calculator definitions
└── utils/             # Utility functions
```

### Key Design Tokens

- **Primary Color**: #6B4C8A (Soft purple)
- **Secondary Color**: #D4826A (Warm terracotta)
- **Background**: #FAFAF8 (Warm off-white)
- **Text Primary**: #2C2C2C
- **Border Radius**: 8px (buttons), 12px (cards)
- **Font Family**: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto"

### Critical Constraints

1. **DO NOT** modify the calculator logic or data structures in `src/tools/`
2. **DO NOT** change Firebase schema or security rules
3. **MAINTAIN** all existing functionality while enhancing UI/UX
4. **ENSURE** backward compatibility with existing user data
5. **FOLLOW** existing code patterns and conventions

---

## Phase 1: Foundation Improvements (Priority: IMMEDIATE)

### Task 1.1: Enhance Visual Design System

#### File: `src/theme/tokens.ts` (NEW FILE)

```typescript
// Create comprehensive design tokens
export const tokens = {
  elevation: {
    0: 'none',
    1: '0px 2px 4px rgba(107, 76, 138, 0.06)',
    2: '0px 4px 8px rgba(107, 76, 138, 0.08)',
    3: '0px 8px 16px rgba(107, 76, 138, 0.10)',
    4: '0px 16px 32px rgba(107, 76, 138, 0.12)',
    5: '0px 24px 48px rgba(107, 76, 138, 0.14)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #6B4C8A 0%, #8B6CAA 100%)',
    secondary: 'linear-gradient(135deg, #D4826A 0%, #E4A28A 100%)',
    surface: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(250,250,248,0.9) 100%)',
    hero: 'radial-gradient(ellipse at top, rgba(107, 76, 138, 0.1) 0%, transparent 70%)',
  },
  animation: {
    duration: {
      instant: '100ms',
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      enter: 'cubic-bezier(0, 0, 0.2, 1)',
      exit: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },
  categoryColors: {
    Psoriasis: { main: '#8B6CAA', light: '#A586C5', dark: '#6B4C8A' },
    Eczema: { main: '#D4826A', light: '#E4A28A', dark: '#B66A52' },
    Acne: { main: '#5A8A5A', light: '#7AA57A', dark: '#457045' },
    'Skin Cancer': { main: '#CC4444', light: '#DD6666', dark: '#AA3333' },
    Autoimmune: { main: '#4A90E2', light: '#6CA6E8', dark: '#3274C6' },
    Melanoma: { main: '#805099', light: '#9966B3', dark: '#663D80' },
    Rosacea: { main: '#E67E22', light: '#F39C12', dark: '#D35400' },
    Infections: { main: '#E74C3C', light: '#EC7063', dark: '#C0392B' },
    Other: { main: '#95A5A6', light: '#BDC3C7', dark: '#7F8C8D' },
  },
};
```

#### Update: `src/theme/theme.ts`

```typescript
import { tokens } from './tokens';

// Add to existing theme:
declare module '@mui/material/styles' {
  interface Theme {
    tokens: typeof tokens;
  }
  interface ThemeOptions {
    tokens?: typeof tokens;
  }
}

// In createTheme, add:
tokens: tokens,

// Update components with new tokens
components: {
  MuiButton: {
    styleOverrides: {
      root: {
        transition: `all ${tokens.animation.duration.normal} ${tokens.animation.easing.standard}`,
        '&:hover': {
          transform: 'translateY(-1px)',
        },
      },
    },
  },
  // Add focus-visible styles for accessibility
  MuiButtonBase: {
    defaultProps: {
      TouchRippleProps: {
        color: 'primary',
      },
    },
    styleOverrides: {
      root: {
        '&:focus-visible': {
          outline: '2px solid #6B4C8A',
          outlineOffset: '2px',
        },
      },
    },
  },
}
```

### Task 1.2: Implement List View in Library

#### Update: `src/routes/library/LibraryPage.tsx`

Add after line 268 (replacing the TODO comment):

```typescript
{viewMode === 'list' && (
  <Stack spacing={2}>
    {filteredTools.map((tool: any) => (
      <Paper
        key={tool.id}
        elevation={0}
        sx={{
          p: 3,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(107, 76, 138, 0.02)',
            transform: 'translateX(4px)',
          },
        }}
        onClick={() => navigate(`/calculators/${tool.slug}`)}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {tool.name}
              </Typography>
              <Typography variant="body2" color="primary">
                {tool.condition}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2">{tool.estimatedTime}min</Typography>
            </Stack>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Chip
              label={tool.complexity}
              size="small"
              color={
                tool.complexity === 'basic' ? 'success' :
                tool.complexity === 'intermediate' ? 'warning' : 'error'
              }
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(tool.id);
                }}
              >
                {isFavorite(tool.id) ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/calculators/${tool.slug}`);
                }}
              >
                Open
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    ))}
  </Stack>
)}
```

### Task 1.3: Enhanced Search Bar on Homepage

#### Update: `src/routes/home/HomePage.tsx`

Add after line 43 (after the buttons):

```typescript
<Box
  sx={{
    mt: 6,
    width: '100%',
    maxWidth: 600,
    position: 'relative',
    zIndex: 1,
  }}
>
  <GlobalSearch
    variant="hero"
    placeholder="Search by condition, tool name, or symptom..."
    size="large"
  />
  <Box display="flex" gap={1} mt={2} justifyContent="center" flexWrap="wrap">
    <Typography variant="caption" color="text.secondary">
      Popular:
    </Typography>
    {['PASI', 'SCORAD', 'DLQI', 'EASI'].map((term) => (
      <Chip
        key={term}
        label={term}
        size="small"
        variant="outlined"
        onClick={() => navigate(`/library?search=${term}`)}
        sx={{ cursor: 'pointer' }}
      />
    ))}
  </Box>
</Box>
```

#### Update: `src/components/search/GlobalSearch.tsx`

Add prop interface and hero variant styling:

```typescript
interface GlobalSearchProps {
  variant?: 'default' | 'hero';
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  variant = 'default',
  placeholder = "Search tools, conditions...",
  size = 'medium',
}) => {
  // ... existing code ...

  const heroStyles = variant === 'hero' ? {
    width: '100%',
    '& .MuiInputBase-root': {
      height: size === 'large' ? 56 : 48,
      fontSize: size === 'large' ? '1.125rem' : '1rem',
      backgroundColor: 'white',
      boxShadow: '0 4px 20px rgba(107, 76, 138, 0.1)',
      '&:hover': {
        boxShadow: '0 6px 24px rgba(107, 76, 138, 0.15)',
      },
    },
  } : {};

  return (
    <Autocomplete
      sx={{
        ...heroStyles,
        ...(variant === 'default' ? {
          width: { xs: 200, sm: 300, md: 400 },
          // existing styles
        } : {}),
      }}
      // ... rest of component
```

### Task 1.4: Add Loading Skeletons

#### File: `src/components/common/ToolCardSkeleton.tsx` (NEW FILE)

```typescript
import { Card, CardContent, Skeleton, Box } from '@mui/material';

export const ToolCardSkeleton = () => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="rectangular" width={80} height={22} />
      </Box>
      <Skeleton variant="text" width="70%" height={28} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="text" height={16} />
      <Skeleton variant="text" height={16} />
      <Skeleton variant="text" width="80%" height={16} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 'auto' }} />
    </CardContent>
  </Card>
);
```

#### Update loading states throughout the app

Replace existing loading states with appropriate skeletons.

### Task 1.5: Keyboard Navigation System

#### File: `src/components/navigation/CommandPalette.tsx` (NEW FILE)

```typescript
import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Typography,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useToolsMetadata } from '../../hooks/useTools';
import Fuse from 'fuse.js';

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { data: tools = [] } = useToolsMetadata();

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fuzzy search setup
  const fuse = new Fuse(tools, {
    keys: ['name', 'condition', 'keywords'],
    threshold: 0.3,
  });

  const results = query ? fuse.search(query).slice(0, 8) : [];

  const handleSelect = (item: any) => {
    navigate(`/calculators/${item.slug}`);
    setOpen(false);
    setQuery('');
  };

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex].item);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          mt: '10vh',
          maxHeight: '70vh',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <TextField
          fullWidth
          placeholder="Search tools or type a command..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyNavigation}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { fontSize: '1.125rem' },
          }}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
        />
        <List>
          {results.map((result, index) => (
            <ListItem
              key={result.item.id}
              button
              selected={index === selectedIndex}
              onClick={() => handleSelect(result.item)}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(107, 76, 138, 0.08)',
                },
              }}
            >
              <ListItemText
                primary={result.item.name}
                secondary={result.item.condition}
              />
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'grey.50',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            <strong>⌘K</strong> to open • <strong>↑↓</strong> to navigate • <strong>↵</strong> to select • <strong>ESC</strong> to close
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
```

#### Add to `src/App.tsx`:

```typescript
import { CommandPalette } from './components/navigation/CommandPalette';

// Inside App component, add before closing fragment:
<CommandPalette />
```

---

## Phase 2: Enhanced Tool Discovery & Interaction

### Task 2.1: Progress Indicator for Multi-Step Forms

#### File: `src/components/forms/FormProgress.tsx` (NEW FILE)

```typescript
import { Box, LinearProgress, Typography, Stack } from '@mui/material';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  sections: Array<{ title: string; id: string }>;
}

export const FormProgress = ({ currentStep, totalSteps, sections }: FormProgressProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="body2" color="text.secondary">
          Step {currentStep} of {totalSteps}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {Math.round(progress)}% Complete
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            background: (theme) => theme.tokens.gradients.primary,
          },
        }}
      />
      <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
        {sections.map((section, index) => (
          <Typography
            key={section.id}
            variant="caption"
            sx={{
              fontWeight: index < currentStep ? 600 : 400,
              color: index < currentStep ? 'primary.main' : 'text.secondary',
            }}
          >
            {index + 1}. {section.title}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
};
```

#### Update: `src/routes/calculators/CalculatorRunnerPage.tsx`

Add progress tracking:

```typescript
// Add state after line 166:
const [currentSection, setCurrentSection] = useState(0);

// Add section tracking logic:
const formSectionInfo = tool?.formSections.map((section, index) => ({
  title: isInputGroup(section) ? section.title || `Section ${index + 1}` : section.label,
  id: isInputGroup(section) ? section.id : section.id,
})) || [];

// Add before form element (line 276):
{tool?.formSections.length > 1 && (
  <FormProgress
    currentStep={currentSection + 1}
    totalSteps={tool.formSections.length}
    sections={formSectionInfo}
  />
)}
```

### Task 2.2: Visual Input Components

#### File: `src/components/inputs/VisualAnalogScale.tsx` (NEW FILE)

```typescript
import { Box, Slider, Typography, Stack } from '@mui/material';
import { Controller } from 'react-hook-form';

interface VisualAnalogScaleProps {
  control: any;
  name: string;
  label: string;
  min?: number;
  max?: number;
  description?: string;
  error?: boolean;
  helperText?: string;
  labels?: { value: number; label: string }[];
}

export const VisualAnalogScale = ({
  control,
  name,
  label,
  min = 0,
  max = 10,
  description,
  error,
  helperText,
  labels,
}: VisualAnalogScaleProps) => {
  const marks = labels || [
    { value: min, label: String(min) },
    { value: max, label: String(max) },
  ];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box>
          <Typography gutterBottom fontWeight={500}>
            {label}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {description}
            </Typography>
          )}
          <Box sx={{ px: 2, py: 3 }}>
            <Slider
              {...field}
              min={min}
              max={max}
              marks={marks}
              valueLabelDisplay="on"
              sx={{
                '& .MuiSlider-valueLabel': {
                  backgroundColor: 'primary.main',
                },
                '& .MuiSlider-track': {
                  height: 8,
                },
                '& .MuiSlider-rail': {
                  height: 8,
                },
              }}
            />
          </Box>
          {helperText && (
            <Typography
              variant="caption"
              color={error ? 'error' : 'text.secondary'}
            >
              {helperText}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};
```

#### File: `src/components/inputs/BodyDiagram.tsx` (NEW FILE)

```typescript
import { useState } from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { Controller } from 'react-hook-form';

interface BodyDiagramProps {
  control: any;
  name: string;
  label: string;
  description?: string;
  maxSelections?: number;
}

const bodyRegions = [
  { id: 'head', label: 'Head & Neck', x: 50, y: 10 },
  { id: 'chest', label: 'Chest', x: 50, y: 30 },
  { id: 'abdomen', label: 'Abdomen', x: 50, y: 45 },
  { id: 'upperArms', label: 'Upper Arms', x: 25, y: 35 },
  { id: 'lowerArms', label: 'Lower Arms', x: 20, y: 50 },
  { id: 'hands', label: 'Hands', x: 15, y: 60 },
  { id: 'thighs', label: 'Thighs', x: 45, y: 60 },
  { id: 'lowerLegs', label: 'Lower Legs', x: 45, y: 75 },
  { id: 'feet', label: 'Feet', x: 45, y: 90 },
];

export const BodyDiagram = ({
  control,
  name,
  label,
  description,
  maxSelections,
}: BodyDiagramProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => {
        const selectedRegions = field.value || [];

        const toggleRegion = (regionId: string) => {
          if (selectedRegions.includes(regionId)) {
            field.onChange(selectedRegions.filter((id: string) => id !== regionId));
          } else if (!maxSelections || selectedRegions.length < maxSelections) {
            field.onChange([...selectedRegions, regionId]);
          }
        };

        return (
          <Box>
            <Typography gutterBottom fontWeight={500}>
              {label}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {description}
              </Typography>
            )}

            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 300,
                mx: 'auto',
                aspectRatio: '1/1.5',
                backgroundImage: 'url(/body-outline.svg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            >
              {bodyRegions.map((region) => (
                <Box
                  key={region.id}
                  onClick={() => toggleRegion(region.id)}
                  sx={{
                    position: 'absolute',
                    left: `${region.x}%`,
                    top: `${region.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: selectedRegions.includes(region.id)
                      ? 'primary.main'
                      : 'rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translate(-50%, -50%) scale(1.1)',
                    },
                  }}
                />
              ))}
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" mt={2}>
              {selectedRegions.map((regionId: string) => {
                const region = bodyRegions.find((r) => r.id === regionId);
                return region ? (
                  <Chip
                    key={regionId}
                    label={region.label}
                    onDelete={() => toggleRegion(regionId)}
                    color="primary"
                    size="small"
                  />
                ) : null;
              })}
            </Stack>
          </Box>
        );
      }}
    />
  );
};
```

### Task 2.3: Enhanced Result Display

#### File: `src/components/results/ResultCard.tsx` (NEW FILE)

```typescript
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import { format } from 'date-fns';
import { CalculationResult } from '../../tools/types';

interface ResultCardProps {
  result: CalculationResult;
  toolName: string;
  onSave?: () => void;
  onExport?: () => void;
  onShare?: () => void;
}

export const ResultCard = ({
  result,
  toolName,
  onSave,
  onExport,
  onShare,
}: ResultCardProps) => {
  const getSeverityColor = (score: number | string) => {
    if (typeof score !== 'number') return 'primary.main';
    // This should be customized per tool
    if (score < 30) return 'success.main';
    if (score < 70) return 'warning.main';
    return 'error.main';
  };

  const renderScoreVisual = () => {
    if (typeof result.score === 'number') {
      const percentage = Math.min(100, Math.max(0, result.score));
      return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={120}
            thickness={4}
            sx={{
              color: getSeverityColor(result.score),
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h3" component="div" fontWeight={700}>
              {result.score.toFixed(0)}
            </Typography>
          </Box>
        </Box>
      );
    }

    return (
      <Typography variant="h2" fontWeight={700} color="primary">
        {result.score || '—'}
      </Typography>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        background: (theme) => theme.tokens.gradients.surface,
        border: '2px solid',
        borderColor: getSeverityColor(result.score || 0),
      }}
    >
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="overline" color="text.secondary">
              {toolName} Result
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {typeof result.score === 'number' ? `Score: ${result.score}` : result.score}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            {onShare && (
              <IconButton onClick={onShare} size="small">
                <ShareIcon />
              </IconButton>
            )}
            {onExport && (
              <IconButton onClick={onExport} size="small">
                <DownloadIcon />
              </IconButton>
            )}
          </Stack>
        </Box>

        <Box display="flex" justifyContent="center" py={2}>
          {renderScoreVisual()}
        </Box>

        {result.interpretation && (
          <>
            <Divider />
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <InfoIcon fontSize="small" color="primary" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Clinical Interpretation
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {result.interpretation}
              </Typography>
            </Box>
          </>
        )}

        {result.details && Object.keys(result.details).length > 0 && (
          <>
            <Divider />
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Calculation Details
              </Typography>
              <Stack spacing={1}>
                {Object.entries(result.details).map(([key, value]) => (
                  <Box
                    key={key}
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                      py: 0.5,
                      px: 1,
                      borderRadius: 1,
                      backgroundColor: 'rgba(107, 76, 138, 0.04)',
                    }}
                  >
                    <Typography variant="body2">{key}:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {String(value)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Calculated on {format(new Date(), 'PPpp')}
          </Typography>
          {onSave && (
            <Button variant="contained" onClick={onSave}>
              Save Result
            </Button>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};
```

---

## Phase 3: Dashboard & Analytics Enhancements

### Task 3.1: Dashboard Widget System

#### File: `src/components/dashboard/DashboardWidget.tsx` (NEW FILE)

```typescript
import { ReactNode } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';

interface DashboardWidgetProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  actions?: Array<{ label: string; onClick: () => void }>;
  height?: number | string;
}

export const DashboardWidget = ({
  title,
  subtitle,
  icon,
  children,
  actions,
  height = 'auto',
}: DashboardWidgetProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(107, 76, 138, 0.08)',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(107, 76, 138, 0.1)',
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          {icon && (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                backgroundColor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        {actions && actions.length > 0 && (
          <>
            <IconButton
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {actions.map((action, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    action.onClick();
                    setAnchorEl(null);
                  }}
                >
                  {action.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Box>
      <Box flex={1}>{children}</Box>
    </Paper>
  );
};
```

#### File: `src/components/dashboard/ScoreChart.tsx` (NEW FILE)

```typescript
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';

interface ScoreChartProps {
  data: Array<{
    date: Date;
    score: number;
    toolName?: string;
  }>;
  type?: 'line' | 'area' | 'bar';
  height?: number;
}

export const ScoreChart = ({
  data,
  type = 'line',
  height = 300,
}: ScoreChartProps) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      date: format(item.date, 'MMM dd'),
    }));
  }, [data]);

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="score"
              stroke={theme.palette.primary.main}
              fill={theme.palette.primary.light}
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill={theme.palette.primary.main} />
          </BarChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ fill: theme.palette.primary.dark, r: 4 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      {renderChart()}
    </ResponsiveContainer>
  );
};
```

#### Update: `src/routes/dashboard/DashboardPage.tsx`

Replace the existing dashboard with a widget-based layout:

```typescript
import { DashboardWidget } from '../../components/dashboard/DashboardWidget';
import { ScoreChart } from '../../components/dashboard/ScoreChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';

// Add after existing imports and data preparation:

const mockChartData = [
  { date: new Date(2024, 0, 1), score: 45 },
  { date: new Date(2024, 0, 8), score: 52 },
  { date: new Date(2024, 0, 15), score: 48 },
  { date: new Date(2024, 0, 22), score: 35 },
  { date: new Date(2024, 0, 29), score: 32 },
];

return (
  <Box>
    <Typography variant="h4" fontWeight={600} gutterBottom>
      Clinical Dashboard
    </Typography>
    <Typography variant="body1" color="text.secondary" gutterBottom>
      Monitor your scoring activity and patient progress at a glance
    </Typography>

    <Grid container spacing={3} sx={{ mt: 1 }}>
      {/* Quick Stats Row */}
      <Grid item xs={12} sm={6} md={3}>
        <DashboardWidget
          title="Total Sessions"
          subtitle="This month"
          icon={<AssessmentIcon />}
        >
          <Typography variant="h3" fontWeight={700} color="primary">
            {sessions.length}
          </Typography>
          <Typography variant="caption" color="success.main">
            +12% from last month
          </Typography>
        </DashboardWidget>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <DashboardWidget
          title="Active Patients"
          subtitle="With recent scores"
          icon={<PeopleIcon />}
        >
          <Typography variant="h3" fontWeight={700} color="primary">
            24
          </Typography>
          <Typography variant="caption" color="text.secondary">
            3 new this week
          </Typography>
        </DashboardWidget>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <DashboardWidget
          title="Most Used"
          subtitle="This month"
          icon={<StarIcon />}
        >
          <Typography variant="h6" fontWeight={600}>
            PASI Score
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Used 15 times
          </Typography>
        </DashboardWidget>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <DashboardWidget
          title="Avg. Score"
          subtitle="All tools"
          icon={<TrendingUpIcon />}
        >
          <Typography variant="h3" fontWeight={700} color="primary">
            42.5
          </Typography>
          <Typography variant="caption" color="success.main">
            ↓ 5.2 improvement
          </Typography>
        </DashboardWidget>
      </Grid>

      {/* Chart Widget */}
      <Grid item xs={12} md={8}>
        <DashboardWidget
          title="Score Trends"
          subtitle="Patient progress over time"
          height={400}
          actions={[
            { label: 'Change View', onClick: () => {} },
            { label: 'Export Data', onClick: () => {} },
          ]}
        >
          <ScoreChart data={mockChartData} type="area" />
        </DashboardWidget>
      </Grid>

      {/* Recent Sessions */}
      <Grid item xs={12} md={4}>
        <DashboardWidget
          title="Recent Activity"
          subtitle="Latest score sessions"
          height={400}
        >
          {/* Existing recent sessions list code */}
        </DashboardWidget>
      </Grid>
    </Grid>
  </Box>
);
```

---

## Phase 4: Mobile & Accessibility Improvements

### Task 4.1: Touch-Optimized Components

#### Update: `src/theme/theme.ts`

Add mobile-specific overrides:

```typescript
components: {
  // Existing component overrides...

  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        // Existing styles...
        [theme.breakpoints.down('sm')]: {
          minHeight: 48, // Larger touch target
          padding: '12px 24px',
        },
      }),
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        [theme.breakpoints.down('sm')]: {
          padding: 12, // 48px touch target
        },
      }),
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: ({ theme }) => ({
        [theme.breakpoints.down('sm')]: {
          '& .MuiInputBase-input': {
            fontSize: '16px', // Prevent zoom on iOS
            padding: '16px 14px',
          },
        },
      }),
    },
  },
}
```

### Task 4.2: Accessibility Enhancements

#### File: `src/hooks/useAccessibility.ts` (NEW FILE)

```typescript
import { useState, useEffect } from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderAnnouncements: boolean;
}

const STORAGE_KEY = 'skinscores_accessibility';

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    screenReaderAnnouncements: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    // Apply settings to document
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    document.documentElement.classList.toggle('large-text', settings.largeText);
    document.documentElement.classList.toggle('reduced-motion', settings.reducedMotion);
  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
};
```

#### File: `src/styles/accessibility.css` (NEW FILE)

```css
/* High Contrast Mode */
.high-contrast {
  --mui-palette-primary-main: #0066cc;
  --mui-palette-secondary-main: #ff6600;
  --mui-palette-background-default: #ffffff;
  --mui-palette-background-paper: #ffffff;
  --mui-palette-text-primary: #000000;
  --mui-palette-text-secondary: #333333;
}

.high-contrast * {
  border-color: currentColor !important;
}

.high-contrast button,
.high-contrast a {
  text-decoration: underline;
}

/* Large Text Mode */
.large-text {
  font-size: 120%;
}

.large-text .MuiTypography-h1 {
  font-size: 3.5rem;
}
.large-text .MuiTypography-h2 {
  font-size: 2.8rem;
}
.large-text .MuiTypography-h3 {
  font-size: 2.4rem;
}
.large-text .MuiTypography-h4 {
  font-size: 2rem;
}
.large-text .MuiTypography-h5 {
  font-size: 1.6rem;
}
.large-text .MuiTypography-h6 {
  font-size: 1.4rem;
}

/* Reduced Motion */
.reduced-motion * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

/* Focus Indicators */
*:focus-visible {
  outline: 3px solid #0066cc !important;
  outline-offset: 2px !important;
}

/* Skip Navigation Link */
.skip-nav {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.skip-nav:focus {
  position: fixed;
  top: 10px;
  left: 10px;
  width: auto;
  height: auto;
  padding: 16px;
  background: white;
  border: 2px solid black;
  z-index: 10000;
}
```

#### Add to `src/main.tsx`:

```typescript
import './styles/accessibility.css';
```

### Task 4.3: ARIA Labels and Screen Reader Support

#### Update all interactive components with proper ARIA labels:

Example for `src/components/tools/ToolCard.tsx`:

```typescript
<Card
  sx={{ /* existing styles */ }}
  onClick={() => navigate(`/calculators/${slug}`)}
  tabIndex={0}
  role="article"
  aria-label={`${name} calculator for ${condition}. ${complexity} complexity, estimated ${estimatedTime} minutes.`}
  onKeyPress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navigate(`/calculators/${slug}`);
    }
  }}
>
  {/* Add screen reader only text for important information */}
  <Box className="sr-only">
    <Typography>
      {name} - {condition} assessment tool.
      Complexity: {complexity}.
      Estimated time: {estimatedTime} minutes.
      {isFavorite(id) ? 'Favorited' : 'Not favorited'}
    </Typography>
  </Box>

  {/* Update icon button with proper label */}
  <IconButton
    size="small"
    onClick={(e) => {
      e.stopPropagation();
      toggleFavorite(id);
    }}
    aria-label={isFavorite(id) ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
  >
    {/* icon code */}
  </IconButton>
```

---

## Implementation Guidelines

### Order of Implementation

1. **Week 1**: Phase 1 - Foundation (Tasks 1.1-1.5)
2. **Week 2**: Phase 2 - Tool Discovery (Tasks 2.1-2.3)
3. **Week 3**: Phase 3 - Dashboard (Tasks 3.1)
4. **Week 4**: Phase 4 - Mobile & Accessibility (Tasks 4.1-4.3)

### Testing Requirements

1. **Visual Regression**: Test all components in different states
2. **Accessibility**: Run axe-core tests on all pages
3. **Performance**: Ensure Lighthouse scores remain >90
4. **Cross-browser**: Test on Chrome, Safari, Firefox, Edge
5. **Mobile**: Test on iOS Safari and Android Chrome

### Code Quality Standards

1. **TypeScript**: Maintain strict type checking
2. **Linting**: Run `npm run lint` before commits
3. **Formatting**: Use Prettier configuration
4. **Component Structure**: Follow existing patterns
5. **Performance**: Lazy load heavy components

### Deployment Checklist

1. Run all tests: `npm run test`
2. Check type errors: `npm run typecheck`
3. Build production: `npm run build`
4. Test production build locally
5. Deploy to staging first
6. Monitor error rates and performance

This implementation plan provides a systematic approach to addressing all identified UI/UX issues while maintaining code quality and application stability.
