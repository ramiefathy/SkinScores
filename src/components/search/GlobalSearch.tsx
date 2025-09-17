import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  Chip,
  Paper,
  InputAdornment,
  CircularProgress,
  ListItem,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useToolsMetadata } from '../../hooks/useTools';
import { debounce } from '../../utils/debounce';
import type { SxProps, Theme } from '@mui/material/styles';

interface SearchResult {
  item: {
    id: string;
    name: string;
    slug: string;
    description: string;
    condition?: string;
    keywords?: string[];
    acronym?: string;
  };
  refIndex: number;
  score?: number;
}

const RECENT_SEARCHES_KEY = 'skinscores_recent_searches';
const MAX_RECENT_SEARCHES = 5;

type GlobalSearchProps = {
  autoFocus?: boolean;
  sx?: SxProps<Theme>;
  onSelect?: () => void;
};

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ autoFocus = false, sx, onSelect }) => {
  const navigate = useNavigate();
  const { data: tools = [], isLoading } = useToolsMetadata();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const fuseRef = useRef<Fuse<any>>();

  // Initialize Fuse.js search index
  useEffect(() => {
    if (tools.length > 0) {
      fuseRef.current = new Fuse(tools, {
        keys: [
          { name: 'name', weight: 0.4 },
          { name: 'condition', weight: 0.3 },
          { name: 'keywords', weight: 0.2 },
          { name: 'description', weight: 0.05 },
          { name: 'acronym', weight: 0.05 },
        ],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2,
      });
    }
  }, [tools]);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Debounced search function
  const performSearch = useCallback(
    debounce((searchTerm: string) => {
      if (!fuseRef.current || searchTerm.length < 2) {
        setOptions([]);
        return;
      }

      const results = fuseRef.current.search(searchTerm);
      setOptions(results.slice(0, 8)); // Limit to 8 results
    }, 300),
    []
  );

  const handleInputChange = (event: React.SyntheticEvent, value: string) => {
    setInputValue(value);
    performSearch(value);
  };

  const handleSelect = (event: React.SyntheticEvent, value: SearchResult | null) => {
    if (value?.item) {
      // Save to recent searches
      const updated = [value.item.name, ...recentSearches.filter(s => s !== value.item.name)].slice(0, MAX_RECENT_SEARCHES);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));

      // Navigate to tool
      navigate(`/calculators/${value.item.slug}`);
      setInputValue('');
      setOpen(false);
      onSelect?.();
    }
  };

  const renderOption = (props: any, option: SearchResult) => {
    const { item } = option;
    const relevanceScore = option.score ? (1 - option.score) * 100 : 0;

    return (
      <ListItem {...props} component="li">
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1">{item.name}</Typography>
              {item.acronym && (
                <Typography variant="caption" color="text.secondary">
                  ({item.acronym})
                </Typography>
              )}
              {relevanceScore > 80 && (
                <Chip
                  label="Best match"
                  size="small"
                  color="primary"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Box>
          }
          secondary={
            <Box>
              {item.condition && (
                <Typography variant="caption" color="primary">
                  {item.condition}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" display="block">
                {item.description.substring(0, 100)}...
              </Typography>
            </Box>
          }
        />
      </ListItem>
    );
  };

  return (
    <Autocomplete
      sx={[
        {
          width: { xs: 200, sm: 300, md: 400 },
          '& .MuiInputBase-root': {
            height: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
            },
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      getOptionLabel={(option) => option.item?.name || ''}
      renderOption={renderOption}
      filterOptions={(x) => x} // Disable built-in filtering, we use Fuse.js
      loading={isLoading}
      noOptionsText={
        inputValue.length < 2
          ? "Type to search tools..."
          : "No tools found"
      }
      onChange={handleSelect}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search tools, conditions..."
          variant="outlined"
          size="small"
          autoFocus={autoFocus}
          inputProps={{
            ...params.inputProps,
            'data-global-search-input': true,
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      PaperComponent={(props) => (
        <Paper {...props} elevation={8} sx={{ mt: 1, maxHeight: 400 }}>
          {inputValue.length === 0 && recentSearches.length > 0 && (
            <Box p={2}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Recent searches
              </Typography>
              <Box display="flex" gap={0.5} flexWrap="wrap" mt={1}>
                {recentSearches.map((search) => (
                  <Chip
                    key={search}
                    label={search}
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setInputValue(search);
                      performSearch(search);
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
          {props.children}
        </Paper>
      )}
    />
  );
};
