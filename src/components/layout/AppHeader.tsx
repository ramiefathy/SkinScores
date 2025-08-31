
"use client"

import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useToolContext } from '@/hooks/useToolContext';

export function AppHeader() {
    const { 
        selectedTool,
    } = useToolContext();

    const title = selectedTool ? selectedTool.name : "SkinScores Home";
    const description = selectedTool ? selectedTool.condition : "Select a clinical scoring tool to begin.";

    return (
        <header className="sticky top-0 z-20 flex h-auto min-h-[4rem] items-start gap-2 border-b bg-background px-4 pt-2 pb-2 sm:h-16 sm:items-center sm:px-6 sm:pb-2">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold tracking-tight truncate pr-4">{title}</h1>
                    <p className="text-xs text-muted-foreground truncate pr-4 hidden sm:block">{description}</p>
                </div>
            </div>
            {/* The Popover and DropdownMenu that were previously here are now removed. */}
        </header>
    );
}
