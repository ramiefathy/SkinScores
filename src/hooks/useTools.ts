import { useQuery } from '@tanstack/react-query';
import {
  getAllToolMetadata,
  loadAllTools,
  loadToolBySlug,
  type ToolListItem,
} from '../services/toolService';
import type { Tool } from '../tools/types';

export const toolsMetadataQueryKey = ['tools', 'metadata'] as const;
export const toolQueryKey = (slug: string) => ['tools', 'tool', slug] as const;

export const useToolsMetadata = () =>
  useQuery<ToolListItem[]>({
    queryKey: toolsMetadataQueryKey,
    queryFn: async () => getAllToolMetadata(),
    staleTime: Infinity,
  });

export const useTool = (slug?: string) =>
  useQuery<{ tool: Tool; metadata: ToolListItem } | null>({
    queryKey: toolQueryKey(slug ?? 'unknown'),
    queryFn: async () => {
      if (!slug) return null;
      return loadToolBySlug(slug);
    },
    enabled: Boolean(slug),
  });

export const useAllTools = () =>
  useQuery({
    queryKey: ['tools', 'all'],
    queryFn: async () => loadAllTools(),
    staleTime: 1000 * 60 * 10,
  });
