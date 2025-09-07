
import React from 'react';
import { AppContent } from '@/components/layout/AppContent';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppContent>
      {children}
    </AppContent>
  );
}
