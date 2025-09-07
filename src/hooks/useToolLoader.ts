'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Tool } from '@/lib/types';
import { loadTool, preloadTool } from '@/lib/tools/lazy-loader';

interface UseToolLoaderResult {
  tool: Tool | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/**
 * Hook for lazy loading tools with proper error handling and loading states
 */
export function useToolLoader(toolId: string | null): UseToolLoaderResult {
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!toolId) {
      setTool(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loadedTool = await loadTool(toolId);
      if (loadedTool) {
        setTool(loadedTool);
        setError(null);
      } else {
        setError(`Tool "${toolId}" not found`);
        setTool(null);
      }
    } catch (err) {
      console.error('Failed to load tool:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tool');
      setTool(null);
    } finally {
      setLoading(false);
    }
  }, [toolId]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    tool,
    loading,
    error,
    reload: load
  };
}

/**
 * Hook for preloading multiple tools (useful for search/list views)
 */
export function useToolPreloader(toolIds: string[]) {
  useEffect(() => {
    toolIds.forEach(toolId => preloadTool(toolId));
  }, [toolIds]);
}

/**
 * Hook to get all available tool IDs without loading the tools
 */
export function useAllToolIds(): string[] {
  const [toolIds, setToolIds] = useState<string[]>([]);
  
  useEffect(() => {
    // Dynamically import to avoid circular dependencies
    import('@/lib/tools/tool-id-mapper').then(({ getAllToolIds }) => {
      setToolIds(getAllToolIds());
    });
  }, []);
  
  return toolIds;
}