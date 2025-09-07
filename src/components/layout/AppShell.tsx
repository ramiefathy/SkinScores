"use client";

import React, { useEffect } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { KeyboardShortcutsProvider } from '@/components/layout/KeyboardShortcutsProvider';
import { CommandPalette } from '@/components/search/CommandPalette';
import { initializeDefaultTemplates } from '@/lib/default-templates';

// This component is a "use client" entry point that wraps the entire
// interactive application shell, including all providers.
export function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize default templates on first load
    initializeDefaultTemplates();
  }, []);

  return (
      <KeyboardShortcutsProvider>
        <SidebarProvider>
          <AppHeader />
          <Sidebar collapsible="icon" className="pt-24">
            <AppSidebar />
          </Sidebar>
          <SidebarInset className="pt-24">
            {children}
          </SidebarInset>
          <CommandPalette />
        </SidebarProvider>
      </KeyboardShortcutsProvider>
  );
}
