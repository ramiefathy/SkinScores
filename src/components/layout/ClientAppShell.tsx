"use client";

import { AppShell } from './AppShell';

export default function ClientAppShell({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
