
"use client";

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toolData } from '@/lib/tools';
import type { Tool, CalculationResult } from '@/lib/types';

const RECENT_TOOLS_STORAGE_KEY = 'skinscore_recently_used_tools';

interface ToolContextType {
  selectedTool: Tool | null;
  setSelectedTool: React.Dispatch<React.SetStateAction<Tool | null>>;
  calculationResult: CalculationResult | null;
  setCalculationResult: React.Dispatch<React.SetStateAction<CalculationResult | null>>;
  popularTools: Tool[];
  groupedTools: Record<string, Tool[]>;
  recentToolDetails: Tool[];
  handleToolSelect: (toolId: string | null) => void;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export function ToolProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);

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

  const handleToolSelect = useCallback((toolId: string | null) => {
    if (toolId) {
        const tool = toolData.find(t => t.id === toolId);
        setSelectedTool(tool || null);
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
        setSelectedTool(null);
        setCalculationResult(null);
        router.push('/', { scroll: false });
    }
    
    document.querySelector('[data-id="page-wrapper-content"]')?.scrollTo(0, 0);

  }, [router]);

  const popularTools: Tool[] = useMemo(() => {
    const popularIds = ['pasi', 'dlqi', 'abcde_melanoma', 'easi', 'scorad'];
    return toolData.filter(tool => popularIds.includes(tool.id));
  }, []);
  
  const groupedTools = useMemo(() => {
    return toolData.reduce((acc, tool) => {
      const condition = tool.condition || 'Other';
      if (!acc[condition]) {
        acc[condition] = [];
      }
      acc[condition].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);
  }, []);

  const recentToolDetails = useMemo(() => {
    return recentlyUsed.map(id => toolData.find(t => t.id === id)).filter(Boolean) as Tool[];
  }, [recentlyUsed]);


  const value = {
    selectedTool,
    setSelectedTool,
    calculationResult,
    setCalculationResult,
    popularTools,
    groupedTools,
    recentToolDetails,
    handleToolSelect,
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
