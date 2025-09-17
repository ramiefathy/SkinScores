import type { Tool } from './types';
import { loadTool } from './lazy-loader';
import { toolMetadata, type ToolMetadata } from './tool-metadata';
import { toLazyLoaderId } from './tool-id-mapper';

// Re-export ToolMetadata type from tool-metadata.ts
export type { ToolMetadata };

// Get tool by ID (delegates to lazy-loader which handles caching)
export async function getToolById(id: string): Promise<Tool | null> {
  // Simply delegate to loadTool which already handles caching
  return loadTool(id);
}

// Get all tool metadata without loading tools
export function getAllToolMetadata(): ToolMetadata[] {
  return toolMetadata;
}

// Get tools by condition (loads only needed tools)
export async function getToolsByCondition(condition: string): Promise<Tool[]> {
  const metadata = toolMetadata.filter((m) => m.condition === condition);
  const tools = await Promise.all(metadata.map((m) => getToolById(m.id)));
  return tools.filter((t): t is Tool => t !== null);
}

// Search tools by keyword (loads only matching tools)
export async function searchTools(query: string): Promise<Tool[]> {
  const lowerQuery = query.toLowerCase();
  const matches = toolMetadata.filter(
    (m) =>
      m.name.toLowerCase().includes(lowerQuery) ||
      (m.acronym && m.acronym.toLowerCase().includes(lowerQuery)) ||
      (m.condition && m.condition.toLowerCase().includes(lowerQuery)) ||
      (m.keywords && m.keywords.some((k) => k.toLowerCase().includes(lowerQuery))),
  );

  const tools = await Promise.all(matches.map((m) => getToolById(m.id)));
  return tools.filter((t): t is Tool => t !== null);
}

// Preload popular tools
export function preloadPopularTools() {
  const popularIds = ['pasi', 'dlqi', 'abcdeMelanoma', 'easi', 'scorad'];
  // Simply trigger loading, lazy-loader will cache them
  popularIds.forEach((id) => {
    loadTool(id).catch((error) => {
      console.error(`Failed to preload tool ${id}:`, error);
    });
  });
}
