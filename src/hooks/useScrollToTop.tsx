import { useCallback } from 'react';

export function useScrollToTop() {
  const scrollToTop = useCallback(() => {
    const pageWrapper = document.querySelector('[data-id="page-wrapper-content"]');
    if (pageWrapper) {
      pageWrapper.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return scrollToTop;
}

export function useScrollToElement() {
  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return scrollToElement;
}