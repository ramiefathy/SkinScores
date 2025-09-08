import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // This is a server component. It renders the client-side AppShell,
  // which contains all the providers and interactive layout.
  return <>{children}</>;
}
