import { useState, useEffect, useCallback } from 'react';
import type { Tool, CalculationResult } from '@/lib/types';

export interface CalculationHistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  timestamp: string;
  result: CalculationResult;
  inputs: Record<string, any>;
  notes?: string;
}

const HISTORY_KEY = 'skinscores_calculations';
const MAX_HISTORY_ITEMS = 100;

export function useCalculationHistory() {
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch (e) {
        console.error('Failed to load calculation history:', e);
      }
    }
  }, []);

  // Save a new calculation
  const saveCalculation = useCallback((
    tool: Tool,
    result: CalculationResult,
    inputs: Record<string, any>,
    notes?: string
  ) => {
    const timestamp = Date.now();
    const randomSuffix = typeof window !== 'undefined' ? Math.random().toString(36).substr(2, 9) : 'ssr';
    const newItem: CalculationHistoryItem = {
      id: `calc_${timestamp}_${randomSuffix}`,
      toolId: tool.id,
      toolName: tool.name,
      timestamp: new Date().toISOString(),
      result,
      inputs,
      notes,
    };

    setHistory(prev => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });

    return newItem;
  }, []);

  // Update notes for a calculation
  const updateNotes = useCallback((id: string, notes: string) => {
    setHistory(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, notes } : item
      );
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Delete a calculation
  const deleteCalculation = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  // Get calculations for a specific tool
  const getToolHistory = useCallback((toolId: string) => {
    return history.filter(item => item.toolId === toolId);
  }, [history]);

  // Search history
  const searchHistory = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return history.filter(item =>
      item.toolName.toLowerCase().includes(lowerQuery) ||
      item.notes?.toLowerCase().includes(lowerQuery) ||
      JSON.stringify(item.result).toLowerCase().includes(lowerQuery)
    );
  }, [history]);

  return {
    history,
    saveCalculation,
    updateNotes,
    deleteCalculation,
    clearHistory,
    getToolHistory,
    searchHistory,
  };
}