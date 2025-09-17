// Tool complexity and time estimates mapping
// This can be expanded with actual data from usage patterns

export interface ToolComplexityData {
  complexity: 'basic' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
}

// Default complexity mapping based on number of inputs and calculations
export const toolComplexityMap: Record<string, ToolComplexityData> = {
  // Basic tools (few inputs, simple calculations)
  'nrs-pruritus': { complexity: 'basic', estimatedTime: 2 },
  'vas-pruritus': { complexity: 'basic', estimatedTime: 2 },
  'dlqi': { complexity: 'basic', estimatedTime: 3 },
  'poem': { complexity: 'basic', estimatedTime: 3 },
  'iga-acne': { complexity: 'basic', estimatedTime: 2 },
  'iga-ad': { complexity: 'basic', estimatedTime: 2 },
  'iga-rosacea': { complexity: 'basic', estimatedTime: 2 },

  // Intermediate tools (moderate inputs, some calculations)
  'pasi': { complexity: 'intermediate', estimatedTime: 5 },
  'scorad': { complexity: 'intermediate', estimatedTime: 7 },
  'easi': { complexity: 'intermediate', estimatedTime: 5 },
  'cdlqi': { complexity: 'intermediate', estimatedTime: 4 },
  'skindex-29': { complexity: 'intermediate', estimatedTime: 5 },
  'bsa': { complexity: 'intermediate', estimatedTime: 3 },
  'hurley-staging-hs': { complexity: 'intermediate', estimatedTime: 3 },

  // Advanced tools (many inputs, complex calculations)
  'clasi': { complexity: 'advanced', estimatedTime: 10 },
  'sledai-skin': { complexity: 'advanced', estimatedTime: 12 },
  'bvas-skin': { complexity: 'advanced', estimatedTime: 15 },
  'sasi': { complexity: 'advanced', estimatedTime: 10 },
  'vida': { complexity: 'advanced', estimatedTime: 8 },
  'napsi': { complexity: 'advanced', estimatedTime: 10 },
  'mfg-score': { complexity: 'advanced', estimatedTime: 8 },

  // Default for tools not explicitly listed
  'default': { complexity: 'basic', estimatedTime: 5 },
};

// Helper function to get complexity data for a tool
export const getToolComplexity = (toolSlug: string): ToolComplexityData => {
  return toolComplexityMap[toolSlug] || toolComplexityMap['default'];
};