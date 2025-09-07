import { useEffect } from 'react';
import { useSearch } from '@/contexts/SearchContext';

export function useCommandPalette() {
  const { setIsOpen } = useSearch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Cmd+K (Mac) or Ctrl+K (Windows/Linux) is pressed
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  return {
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}