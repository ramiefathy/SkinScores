import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface RecentTool {
  toolId: string;
  toolSlug: string;
  toolName: string;
  lastUsed: string; // ISO date string
  useCount: number;
}

const RECENT_TOOLS_KEY = 'skinscores_recent_tools';
const MAX_RECENT_TOOLS = 5;

export const useRecentTools = () => {
  const { user } = useAuth();
  const [recentTools, setRecentTools] = useState<RecentTool[]>([]);

  // Load recent tools from localStorage
  useEffect(() => {
    const loadRecentTools = () => {
      const key = user ? `${RECENT_TOOLS_KEY}_${user.uid}` : RECENT_TOOLS_KEY;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setRecentTools(parsed);
        } catch (e) {
          console.error('Failed to parse recent tools:', e);
        }
      }
    };

    loadRecentTools();
  }, [user]);

  // Add or update a tool in recent list
  const addRecentTool = useCallback((toolId: string, toolSlug: string, toolName: string) => {
    const key = user ? `${RECENT_TOOLS_KEY}_${user.uid}` : RECENT_TOOLS_KEY;

    setRecentTools(prev => {
      const existing = prev.find(t => t.toolId === toolId);
      const now = new Date().toISOString();

      let updated: RecentTool[];

      if (existing) {
        // Move to front and increment count
        updated = [
          {
            ...existing,
            lastUsed: now,
            useCount: existing.useCount + 1,
          },
          ...prev.filter(t => t.toolId !== toolId),
        ];
      } else {
        // Add new tool to front
        updated = [
          {
            toolId,
            toolSlug,
            toolName,
            lastUsed: now,
            useCount: 1,
          },
          ...prev,
        ];
      }

      // Keep only MAX_RECENT_TOOLS
      updated = updated.slice(0, MAX_RECENT_TOOLS);

      // Save to localStorage
      localStorage.setItem(key, JSON.stringify(updated));

      return updated;
    });
  }, [user]);

  // Clear recent tools
  const clearRecentTools = useCallback(() => {
    const key = user ? `${RECENT_TOOLS_KEY}_${user.uid}` : RECENT_TOOLS_KEY;
    localStorage.removeItem(key);
    setRecentTools([]);
  }, [user]);

  return {
    recentTools,
    addRecentTool,
    clearRecentTools,
  };
};