"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Fuse from 'fuse.js';
import { toolMetadata, type ToolMetadata } from '@/lib/tools/tool-metadata';
import { useRouter } from 'next/navigation';
import { useToolContext } from '@/hooks/useToolContext';
import { useAnalyticsContext } from '@/contexts/AnalyticsContext';

interface SearchResult {
  item: ToolMetadata;
  score?: number;
  matches?: readonly any[];
}

interface SearchFilter {
  specialty?: string[];
  condition?: string[];
  complexity?: ('simple' | 'moderate' | 'complex')[];
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  filters: SearchFilter;
  setFilters: (filters: SearchFilter) => void;
  recentSearches: string[];
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
  suggestions: string[];
  performSearch: (searchQuery: string) => void;
  selectResult: (tool: ToolMetadata) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const RECENT_SEARCHES_KEY = 'skinscores_recent_searches';
const MAX_RECENT_SEARCHES = 5;

// Fuse.js options for fuzzy search
const fuseOptions = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.3,
  keys: [
    { name: 'name', weight: 3 },
    { name: 'id', weight: 2 },
    { name: 'condition', weight: 2 },
    { name: 'description', weight: 1 },
    { name: 'category', weight: 0.5 },
  ],
};

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { handleToolSelect } = useToolContext();
  const { trackSearch, trackFilterApplied } = useAnalyticsContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilter>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Initialize Fuse instance with proper typing
  const fuse = React.useMemo(() => new Fuse<ToolMetadata>(toolMetadata, fuseOptions), []);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load recent searches:', e);
      }
    }
  }, []);

  // Generate suggestions based on query
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const queryLower = query.toLowerCase();
    const allTerms = new Set<string>();

    // Add tool names and conditions
    toolMetadata.forEach((tool: ToolMetadata) => {
      if (tool.name.toLowerCase().includes(queryLower)) {
        allTerms.add(tool.name);
      }
      if (tool.condition && tool.condition.toLowerCase().includes(queryLower)) {
        allTerms.add(tool.condition);
      }
      // Check if name contains acronym-like pattern
      const acronym = tool.name.match(/^[A-Z]+(?:[a-z]|$)/);
      if (acronym && acronym[0].toLowerCase().includes(queryLower)) {
        allTerms.add(tool.name);
      }
    });

    // Add specialty terms
    const specialties = ['dermatology', 'oncology', 'pediatrics', 'cosmetic'];
    specialties.forEach(specialty => {
      if (specialty.includes(queryLower)) {
        allTerms.add(specialty);
      }
    });

    setSuggestions(Array.from(allTerms).slice(0, 5));
  }, [query]);

  const addRecentSearch = useCallback((search: string) => {
    if (!search.trim()) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== search.toLowerCase());
      const updated = [search, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // Perform fuzzy search
    let searchResults = fuse.search(searchQuery);

    // Apply filters
    if (filters.specialty?.length) {
      searchResults = searchResults.filter(result =>
        filters.specialty?.some(s => 
          result.item.category?.toLowerCase().includes(s.toLowerCase())
        )
      );
    }

    if (filters.condition?.length) {
      searchResults = searchResults.filter(result =>
        filters.condition?.some(c => 
          result.item.condition?.toLowerCase().includes(c.toLowerCase())
        )
      );
    }

    // Note: complexity filtering would need to be based on metadata or removed
    // since we don't have formSections in metadata

    setResults(searchResults);
    
    // Add to recent searches and track analytics if not empty
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
      trackSearch(searchQuery, searchResults.length);
    }
    
    // Track filter usage
    if (Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([type, values]) => {
        if (values && values.length > 0) {
          trackFilterApplied(type, values);
        }
      });
    }
  }, [fuse, filters, addRecentSearch, trackSearch, trackFilterApplied]);

  // Perform search when query or filters change
  useEffect(() => {
    performSearch(query);
  }, [query, filters, performSearch]);

  const selectResult = useCallback((tool: ToolMetadata) => {
    handleToolSelect(tool.id);
    setIsOpen(false);
    setQuery('');
    router.push(`/?toolId=${tool.id}`);
  }, [handleToolSelect, router]);

  const value: SearchContextType = {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    filters,
    setFilters,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    suggestions,
    performSearch,
    selectResult,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}