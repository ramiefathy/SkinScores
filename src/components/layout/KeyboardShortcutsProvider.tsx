"use client";

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { useEffect } from 'react';

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  useCommandPalette();
  
  return <>{children}</>;
}