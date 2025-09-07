
"use client";

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Tool, CalculationResult } from '@/lib/types';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { loadTool } from '@/lib/tools/lazy-loader';
import { 
  getGroupedToolMetadata, 
  getPopularToolsMetadata, 
  getToolMetadata,
  type ToolMetadata 
} from '@/lib/tools/tool-metadata';

const RECENT_TOOLS_STORAGE_KEY = 'skinscore_recently_used_tools';

interface ToolContextType {
  selectedTool: Tool | null;
  setSelectedTool: React.Dispatch<React.SetStateAction<Tool | null>>;
  calculationResult: CalculationResult | null;
  setCalculationResult: React.Dispatch<React.SetStateAction<CalculationResult | null>>;
  popularToolsMetadata: ToolMetadata[];
  groupedToolsMetadata: Record<string, ToolMetadata[]>;
  recentToolsMetadata: ToolMetadata[];
  handleToolSelect: (toolId: string | null) => void;
  loadingTool: boolean;
  toolError: string | null;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export function ToolProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const scrollToTop = useScrollToTop();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [loadingTool, setLoadingTool] = useState(false);
  const [toolError, setToolError] = useState<string | null>(null);

  useEffect(() => {
    const getRecentTools = () => {
        const stored = localStorage.getItem(RECENT_TOOLS_STORAGE_KEY);
        if (stored) {
          setRecentlyUsed(JSON.parse(stored));
        }
      };
      getRecentTools();

      window.addEventListener('storage', getRecentTools);
      return () => {
        window.removeEventListener('storage', getRecentTools);
      };
  }, []);

  const handleToolSelect = useCallback(async (toolId: string | null) => {
    if (toolId) {
      setLoadingTool(true);
      setToolError(null);
      
      try {
        const tool = await loadTool(toolId);
        if (tool) {
          setSelectedTool(tool);
          setCalculationResult(null);

          if (typeof window !== 'undefined') {
            const storedRecent = localStorage.getItem(RECENT_TOOLS_STORAGE_KEY);
            const recentlyUsedTools = storedRecent ? JSON.parse(storedRecent) : [];
            const updatedRecent = [toolId, ...recentlyUsedTools.filter((id: string) => id !== toolId)].slice(0, 5);
            localStorage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify(updatedRecent));
            window.dispatchEvent(new Event('storage'));
          }
          router.push(`/?toolId=${toolId}`, { scroll: false });
        } else {
          setToolError(`Tool "${toolId}" not found`);
          setSelectedTool(null);
        }
      } catch (error) {
        console.error('Failed to load tool:', error);
        setToolError('Failed to load tool');
        setSelectedTool(null);
      } finally {
        setLoadingTool(false);
      }
    } else {
      setSelectedTool(null);
      setCalculationResult(null);
      setToolError(null);
      router.push('/', { scroll: false });
    }
    
    scrollToTop();
  }, [router, scrollToTop]);

  const popularToolsMetadata = useMemo(() => {
    return getPopularToolsMetadata();
  }, []);
  
  const groupedToolsMetadata = useMemo(() => {
    return getGroupedToolMetadata();
  }, []);

  const recentToolsMetadata = useMemo(() => {
    return recentlyUsed
      .map(id => getToolMetadata(id))
      .filter(Boolean) as ToolMetadata[];
  }, [recentlyUsed]);


  const value = {
    selectedTool,
    setSelectedTool,
    calculationResult,
    setCalculationResult,
    popularToolsMetadata,
    groupedToolsMetadata,
    recentToolsMetadata,
    handleToolSelect,
    loadingTool,
    toolError
  };

  return <ToolContext.Provider value={value}>{children}</ToolContext.Provider>;
}

export function useToolContext() {
  const context = useContext(ToolContext);
  if (context === undefined) {
    throw new Error('useToolContext must be used within a ToolProvider');
  }
  return context;
}
