
"use client";

import * as React from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

export function PageWrapper({
    children,
    title,
    description
}: {
    children: React.ReactNode;
    title: string;
    description?: string;
}) {
    const { isMobile } = useSidebar();
    
    return (
        <div className="flex h-full flex-col">
            <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
                {isMobile && <SidebarTrigger />}
                <div className="flex-1">
                    <h1 className="text-lg font-semibold tracking-tight truncate pr-4">{title}</h1>
                    {description && <p className="text-xs text-muted-foreground truncate pr-4 hidden sm:block">{description}</p>}
                </div>
            </header>
            <main data-id="page-wrapper-content" className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
