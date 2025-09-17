// Re-export everything from the lazy loading implementation
// This prevents loading all 75+ tool implementations at once
export * from './index-lazy';

// Note: If you need the old behavior with all tools loaded immediately,
// you can import from './index-old.ts' instead, but this will cause
// chunk loading issues and slow initial page loads.
