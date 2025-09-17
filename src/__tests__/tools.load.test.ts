import { describe, expect, it } from 'vitest';
import { getAllToolMetadata, loadToolById } from '../services/toolService';

describe('tool catalogue', () => {
  it('loads and validates every tool definition', async () => {
    const metadata = getAllToolMetadata();
    const tools = await Promise.all(metadata.map((item) => loadToolById(item.id)));

    tools.forEach((tool) => {
      expect(tool).not.toBeNull();
      if (!tool) return;
      expect(Array.isArray(tool.formSections)).toBe(true);
      expect(tool.formSections.length).toBeGreaterThan(0);
    });
  }, 20000);
});
