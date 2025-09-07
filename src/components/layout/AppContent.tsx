
"use client";

import React from 'react';
import { Providers } from '@/components/layout/Providers';

export function AppContent({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            {children}
        </Providers>
    )
}
