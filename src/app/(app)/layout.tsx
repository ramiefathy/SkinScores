import React from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // This is a server component. It renders the client-side AppShell,
  // which contains all the providers and interactive layout.
  return <AppShell>{children}</AppShell>;
}
