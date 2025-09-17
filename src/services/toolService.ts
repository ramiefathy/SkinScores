import {
  toolMetadata as rawMetadata,
  type ToolMetadata as RawToolMetadata,
} from '../tools/tool-metadata';
import { loadTool } from '../tools/lazy-loader';
import { toLazyLoaderId, fromLazyLoaderId } from '../tools/tool-id-mapper';
import type { Tool } from '../tools/types';

export type ToolListItem = RawToolMetadata & {
  loaderId: string;
  slug: string;
};

const computeSlug = (id: string) =>
  toLazyLoaderId(id).replace(/_/g, '-').replace(/--+/g, '-').toLowerCase();

const toolList: ToolListItem[] = rawMetadata.map((entry) => {
  const loaderId = toLazyLoaderId(entry.id);
  return {
    ...entry,
    loaderId,
    slug: computeSlug(entry.id),
  };
});

const slugToItemMap = new Map(toolList.map((item) => [item.slug, item]));
const idToItemMap = new Map(toolList.map((item) => [fromLazyLoaderId(item.loaderId), item]));

export const getAllToolMetadata = (): ToolListItem[] => [...toolList];

export const findToolMetadataBySlug = (slug: string): ToolListItem | undefined =>
  slugToItemMap.get(slug);

export const findToolMetadataById = (id: string): ToolListItem | undefined =>
  idToItemMap.get(id) ?? slugToItemMap.get(computeSlug(id));

export const loadToolById = async (id: string): Promise<Tool | null> => loadTool(id);

export const loadToolBySlug = async (
  slug: string,
): Promise<{ tool: Tool; metadata: ToolListItem } | null> => {
  const metadata = findToolMetadataBySlug(slug);
  if (!metadata) return null;
  const tool = await loadTool(metadata.id);
  if (!tool) return null;
  return { tool, metadata };
};

export const loadAllTools = async () => {
  const entries = await Promise.all(
    toolList.map(async (item) => {
      const tool = await loadTool(item.id);
      return tool ? { metadata: item, tool } : null;
    }),
  );
  return entries.filter((entry): entry is { metadata: ToolListItem; tool: Tool } => Boolean(entry));
};
