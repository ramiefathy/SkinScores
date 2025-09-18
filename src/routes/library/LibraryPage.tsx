import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  Button,
  Chip,
  Paper,
  Skeleton,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Stack,
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import CategoryIcon from '@mui/icons-material/Category';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAllTools } from '../../hooks/useTools';
import ToolCard from '../../components/tools/ToolCard';
import { getToolComplexity, type ToolComplexityData } from '../../tools/tool-complexity';
import type { Tool } from '../../tools/types';
import type { ToolListItem } from '../../services/toolService';
import { useToolFilters } from '../../hooks/useToolFilters';
import { ToolFilters } from '../../components/filters/ToolFilters';
import { debounce } from '../../utils/debounce';

type ViewMode = 'grid' | 'list';

type LibraryTool = {
  id: string;
  name: string;
  slug: string;
  description: string;
  condition?: string;
  keywords?: string[];
} & ToolComplexityData;

const LibraryPage = () => {
  const { data: toolEntries = [], isLoading } = useAllTools();
  const {
    filters,
    updateFilter,
    toggleCategory,
    toggleComplexity,
    clearFilters,
    hasActiveFilters,
  } = useToolFilters();
  const [searchValue, setSearchValue] = useState(filters.searchQuery);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Update search value when URL changes
  useEffect(() => {
    setSearchValue(filters.searchQuery);
  }, [filters.searchQuery]);

  // Debounced search update
  const updateSearch = useMemo(
    () =>
      debounce((value: string) => {
        updateFilter('searchQuery', value);
      }, 300),
    [updateFilter],
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    updateSearch(value);
  };

  // Calculate categories with counts
  const categoriesWithCounts = useMemo(() => {
    const categoryMap = new Map<string, number>();
    toolEntries.forEach(({ metadata }: { metadata: ToolListItem; tool: Tool }) => {
      const category = metadata.condition || 'Other';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [toolEntries]);

  // Filter and sort tools
  const filteredTools = useMemo<LibraryTool[]>(() => {
    const query = filters.searchQuery.trim().toLowerCase();
    const results: LibraryTool[] = [];

    toolEntries.forEach(({ metadata, tool }: { metadata: ToolListItem; tool: Tool }) => {
      if (!metadata || !tool) {
        return;
      }

      const complexityData = getToolComplexity(metadata.slug);
      const toolCategory = metadata.condition ?? 'Other';

      if (filters.categories.length > 0 && !filters.categories.includes(toolCategory)) {
        return;
      }

      if (
        filters.complexity.length > 0 &&
        !filters.complexity.includes(complexityData.complexity)
      ) {
        return;
      }

      if (
        complexityData.estimatedTime < filters.timeRange.min ||
        complexityData.estimatedTime > filters.timeRange.max
      ) {
        return;
      }

      if (query) {
        const searchableText = [
          metadata.name,
          metadata.description ?? '',
          metadata.condition ?? '',
          ...(tool.keywords ?? []),
        ]
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(query)) {
          return;
        }
      }

      results.push({
        id: metadata.id,
        name: metadata.name,
        slug: metadata.slug,
        description: tool?.description ?? metadata.description ?? '',
        condition: metadata.condition,
        keywords: tool?.keywords,
        ...complexityData,
      });
    });

    const complexityOrder: Record<ToolComplexityData['complexity'], number> = {
      basic: 0,
      intermediate: 1,
      advanced: 2,
    };

    switch (filters.sortBy) {
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'complexity':
        results.sort(
          (a, b) =>
            complexityOrder[a.complexity] - complexityOrder[b.complexity] ||
            a.name.localeCompare(b.name),
        );
        break;
      case 'time':
        results.sort((a, b) => a.estimatedTime - b.estimatedTime || a.name.localeCompare(b.name));
        break;
      case 'popularity':
        // Placeholder until usage telemetry is available
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return results;
  }, [toolEntries, filters]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Clinical Scoring Tools
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse our comprehensive library of validated dermatology assessment tools
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search tools by name, condition, or keywords..."
          value={searchValue}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchValue('');
                    updateFilter('searchQuery', '');
                  }}
                  aria-label="Clear search"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Filters */}
      <ToolFilters
        filters={filters}
        categories={categoriesWithCounts}
        onCategoryToggle={toggleCategory}
        onComplexityToggle={toggleComplexity}
        onTimeRangeChange={(range) => updateFilter('timeRange', range)}
        onSortChange={(sort) => updateFilter('sortBy', sort)}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          {filteredTools.length} {filteredTools.length === 1 ? 'Tool' : 'Tools'}
          {hasActiveFilters && ' (filtered)'}
        </Typography>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && setViewMode(newMode)}
          size="small"
        >
          <ToggleButton value="grid" aria-label="Grid view">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="List view">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Results */}
      {filteredTools.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <CategoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No tools found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Try adjusting your search or filters
          </Typography>
          {hasActiveFilters && (
            <Button variant="outlined" onClick={clearFilters}>
              Clear All Filters
            </Button>
          )}
        </Paper>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {filteredTools.map((tool) => (
                <Grid item xs={12} sm={6} md={4} key={tool.id}>
                  <ToolCard {...tool} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer component={Paper} aria-label="Clinical tools list view">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tool</TableCell>
                    <TableCell>Condition</TableCell>
                    <TableCell>Complexity</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Keywords</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTools.map((tool) => (
                    <TableRow key={tool.id} hover>
                      <TableCell
                        sx={{
                          maxWidth: 360,
                          '&:focus-within': {
                            outline: (theme) => `2px solid ${theme.palette.primary.main}`,
                            outlineOffset: 2,
                          },
                        }}
                      >
                        <Link
                          component={RouterLink}
                          to={`/calculators/${tool.slug}`}
                          underline="hover"
                          color="inherit"
                          sx={{ fontWeight: 600, display: 'inline-flex' }}
                          aria-label={`Open ${tool.name} calculator`}
                        >
                          {tool.name}
                        </Link>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {tool.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {tool.condition ? (
                          <Chip
                            label={tool.condition}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {tool.complexity ? (
                          <Chip
                            label={`${tool.complexity.charAt(0).toUpperCase()}${tool.complexity.slice(1)}`}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          ~{tool.estimatedTime} min
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                          {(tool.keywords ?? []).slice(0, 3).map((keyword: string) => (
                            <Chip key={keyword} label={keyword} size="small" variant="outlined" />
                          ))}
                          {tool.keywords && tool.keywords.length > 3 && (
                            <Typography variant="caption" color="text.secondary">
                              +{tool.keywords.length - 3} more
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          component={RouterLink}
                          to={`/calculators/${tool.slug}`}
                          aria-label={`Open ${tool.name} calculator`}
                        >
                          Open
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Container>
  );
};

export default LibraryPage;
