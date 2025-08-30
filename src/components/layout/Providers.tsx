
"use client";

import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { ToolProvider } from '@/hooks/useToolContext';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToolProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <AppSidebar />
        </Sidebar>
        <SidebarInset>
          {children}
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </ToolProvider>
  );
}
