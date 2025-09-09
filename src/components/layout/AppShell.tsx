
"use client";

import React, { useEffect, Suspense } from 'react';
import { SidebarProvider, SidebarInset, Sidebar } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { KeyboardShortcutsProvider } from '@/components/layout/KeyboardShortcutsProvider';
import { CommandPalette } from '@/components/search/CommandPalette';
import { initializeDefaultTemplates } from '@/lib/default-templates';
import ErrorBoundary from '@/components/ui/error-boundary';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ToolProvider } from '@/hooks/useToolContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';

// This component is a "use client" entry point that wraps the entire
// interactive application shell, including all providers.
export function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize default templates on first load
    initializeDefaultTemplates();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system">
        <AnalyticsProvider>
          <ToolProvider>
            <SearchProvider>
              <KeyboardShortcutsProvider>
                <SidebarProvider>
                  <Suspense fallback={<div className="h-24" />}>
                    <AppHeader />
                  </Suspense>
                  <Sidebar collapsible="icon" className="pt-24">
                    <Suspense fallback={<div className="w-full" />}>
                      <AppSidebar />
                    </Suspense>
                  </Sidebar>
                  <SidebarInset className="pt-24">
                    <ErrorBoundary>
                      {children}
                    </ErrorBoundary>
                  </SidebarInset>
                  <CommandPalette />
                </SidebarProvider>
              </KeyboardShortcutsProvider>
              <Toaster />
            </SearchProvider>
          </ToolProvider>
        </AnalyticsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
