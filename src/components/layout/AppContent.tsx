
"use client";

import React, { Suspense } from 'react';
import { Providers } from '@/components/layout/Providers';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function AppContent({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            <Suspense fallback={<LoadingSpinner />}>
                {children}
            </Suspense>
        </Providers>
    )
}
