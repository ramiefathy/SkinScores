
"use client";

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { KeyboardShortcutsProvider } from '@/components/layout/KeyboardShortcutsProvider';
import { CommandPalette } from '@/components/search/CommandPalette';
import { initializeDefaultTemplates } from '@/lib/default-templates';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ToolProvider } from '@/hooks/useToolContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';

// Dynamic import for sidebar components to prevent SSR hydration issues with Radix UI
const Sidebar = dynamic(
  () => import('@/components/ui/sidebar').then(mod => mod.Sidebar),
  { ssr: false }
);

const AppSidebar = dynamic(
  () => import('@/components/layout/AppSidebar').then(mod => mod.AppSidebar),
  { ssr: false }
);

// This component is a "use client" entry point that wraps the entire
// interactive application shell, including all providers.
export function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize default templates on first load
    initializeDefaultTemplates();
  }, []);

  return (
    <ThemeProvider defaultTheme="system">
      <AnalyticsProvider>
        <ToolProvider>
          <SearchProvider>
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
            <Toaster />
          </SearchProvider>
        </ToolProvider>
      </AnalyticsProvider>
    </ThemeProvider>
  );
}
