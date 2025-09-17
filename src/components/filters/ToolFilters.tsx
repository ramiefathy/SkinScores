import React from 'react';
import {
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Paper,
  Slider,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from 'react';
import { ToolFilters as ToolFiltersType } from '../../hooks/useToolFilters';

interface ToolFiltersProps {
  filters: ToolFiltersType;
  categories: Array<{ name: string; count: number }>;
  onCategoryToggle: (category: string) => void;
  onComplexityToggle: (level: 'basic' | 'intermediate' | 'advanced') => void;
  onTimeRangeChange: (range: { min: number; max: number }) => void;
  onSortChange: (sort: ToolFiltersType['sortBy']) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const complexityOptions = [
  { value: 'basic', label: 'Basic', color: '#5A8A5A' },
  { value: 'intermediate', label: 'Intermediate', color: '#CC8800' },
  { value: 'advanced', label: 'Advanced', color: '#CC4444' },
];

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'complexity', label: 'Complexity' },
  { value: 'time', label: 'Time Required' },
];

export const ToolFilters: React.FC<ToolFiltersProps> = ({
  filters,
  categories,
  onCategoryToggle,
  onComplexityToggle,
  onTimeRangeChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState(!isMobile);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 8);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Filter Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={expanded ? 3 : 0}>
        <Box display="flex" alignItems="center" gap={1}>
          <FilterListIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
          {hasActiveFilters && (
            <Chip
              label="Active"
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {hasActiveFilters && (
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={onClearFilters}
              sx={{ mr: 1 }}
            >
              Clear All
            </Button>
          )}
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse filters' : 'Expand filters'}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
          {/* Categories */}
          <Box flex={1}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 1.5, fontSize: '0.875rem', fontWeight: 600 }}>
                Categories
              </FormLabel>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {visibleCategories.map(({ name, count }) => (
                  <Chip
                    key={name}
                    label={`${name} (${count})`}
                    onClick={() => onCategoryToggle(name)}
                    color={filters.categories.includes(name) ? 'primary' : 'default'}
                    variant={filters.categories.includes(name) ? 'filled' : 'outlined'}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: filters.categories.includes(name)
                          ? 'primary.dark'
                          : 'action.hover',
                      },
                    }}
                  />
                ))}
                {categories.length > 8 && (
                  <Button
                    size="small"
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    sx={{ ml: 0.5 }}
                  >
                    {showAllCategories ? 'Show Less' : `+${categories.length - 8} More`}
                  </Button>
                )}
              </Box>
            </FormControl>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
          <Divider sx={{ display: { xs: 'block', md: 'none' }, my: 1 }} />

          {/* Complexity & Time */}
          <Box minWidth={{ xs: 'auto', md: 300 }}>
            {/* Complexity */}
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend" sx={{ mb: 1.5, fontSize: '0.875rem', fontWeight: 600 }}>
                Complexity Level
              </FormLabel>
              <Box display="flex" gap={1}>
                {complexityOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    onClick={() => onComplexityToggle(option.value as any)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: filters.complexity.includes(option.value as any)
                        ? `${option.color}22`
                        : 'transparent',
                      color: filters.complexity.includes(option.value as any)
                        ? option.color
                        : 'text.secondary',
                      border: `1px solid ${
                        filters.complexity.includes(option.value as any)
                          ? option.color
                          : 'divider'
                      }`,
                      '&:hover': {
                        backgroundColor: `${option.color}33`,
                      },
                    }}
                  />
                ))}
              </Box>
            </FormControl>

            {/* Time Range */}
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                Time Required: {filters.timeRange.min}-{filters.timeRange.max} minutes
              </FormLabel>
              <Slider
                value={[filters.timeRange.min, filters.timeRange.max]}
                onChange={(_, value) => {
                  const [min, max] = value as number[];
                  onTimeRangeChange({ min, max });
                }}
                valueLabelDisplay="auto"
                min={0}
                max={30}
                marks={[
                  { value: 0, label: '0' },
                  { value: 10, label: '10' },
                  { value: 20, label: '20' },
                  { value: 30, label: '30+' },
                ]}
                sx={{ mt: 2, mb: 1 }}
              />
            </FormControl>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
          <Divider sx={{ display: { xs: 'block', md: 'none' }, my: 1 }} />

          {/* Sort By */}
          <Box minWidth={{ xs: 'auto', md: 200 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 1.5, fontSize: '0.875rem', fontWeight: 600 }}>
                Sort By
              </FormLabel>
              <FormGroup>
                {sortOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Switch
                        checked={filters.sortBy === option.value}
                        onChange={() => onSortChange(option.value as any)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" color={filters.sortBy === option.value ? 'primary' : 'text.secondary'}>
                        {option.label}
                      </Typography>
                    }
                    sx={{ mb: 0.5 }}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};