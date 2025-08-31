
"use client";

import * as React from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { AppHeader } from './AppHeader';

export function PageWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isMobile } = useSidebar();
    
    return (
        <div className="flex h-full flex-col">
            <AppHeader />
            <main data-id="page-wrapper-content" className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
