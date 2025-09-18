import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface ToolFilters {
  categories: string[];
  complexity: ('basic' | 'intermediate' | 'advanced')[];
  timeRange: { min: number; max: number };
  searchQuery: string;
  sortBy: 'name' | 'popularity' | 'complexity' | 'time';
}

export const useToolFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL params
  const filters = useMemo<ToolFilters>(() => {
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const complexity =
      (searchParams.get('complexity')?.split(',').filter(Boolean) as ToolFilters['complexity']) ||
      [];
    const minTime = parseInt(searchParams.get('minTime') || '0');
    const maxTime = parseInt(searchParams.get('maxTime') || '30');
    const searchQuery = searchParams.get('search') || '';
    const sortBy = (searchParams.get('sort') || 'name') as ToolFilters['sortBy'];

    return {
      categories,
      complexity,
      timeRange: { min: minTime, max: maxTime },
      searchQuery,
      sortBy,
    };
  }, [searchParams]);

  // Update a single filter
  const updateFilter = useCallback(
    <K extends keyof ToolFilters>(filterKey: K, value: ToolFilters[K]) => {
      const newParams = new URLSearchParams(searchParams);

      switch (filterKey) {
        case 'categories':
        case 'complexity':
          if ((value as string[]).length > 0) {
            newParams.set(filterKey, (value as string[]).join(','));
          } else {
            newParams.delete(filterKey);
          }
          break;
        case 'timeRange': {
          const range = value as ToolFilters['timeRange'];
          if (range.min > 0) newParams.set('minTime', range.min.toString());
          else newParams.delete('minTime');
          if (range.max < 30) newParams.set('maxTime', range.max.toString());
          else newParams.delete('maxTime');
          break;
        }
        case 'searchQuery':
          if (value) newParams.set('search', value as string);
          else newParams.delete('search');
          break;
        case 'sortBy':
          if (value !== 'name') newParams.set('sort', value as string);
          else newParams.delete('sort');
          break;
      }

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  // Toggle a category filter
  const toggleCategory = useCallback(
    (category: string) => {
      const current = filters.categories;
      const updated = current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category];
      updateFilter('categories', updated);
    },
    [filters.categories, updateFilter],
  );

  // Toggle a complexity filter
  const toggleComplexity = useCallback(
    (level: ToolFilters['complexity'][0]) => {
      const current = filters.complexity;
      const updated = current.includes(level)
        ? current.filter((c) => c !== level)
        : [...current, level];
      updateFilter('complexity', updated);
    },
    [filters.complexity, updateFilter],
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.categories.length > 0 ||
      filters.complexity.length > 0 ||
      filters.timeRange.min > 0 ||
      filters.timeRange.max < 30 ||
      filters.searchQuery !== '' ||
      filters.sortBy !== 'name'
    );
  }, [filters]);

  return {
    filters,
    updateFilter,
    toggleCategory,
    toggleComplexity,
    clearFilters,
    hasActiveFilters,
  };
};
