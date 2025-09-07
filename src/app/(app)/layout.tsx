
import React, { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AppContent } from '@/components/layout/AppContent';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AppContent>
        {children}
      </AppContent>
    </Suspense>
  );
}
