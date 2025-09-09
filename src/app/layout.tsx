
import './globals.css';
import React from 'react';
import ClientAppShell from '@/components/layout/ClientAppShell';
import { ScriptWrapper } from '@/components/layout/ScriptWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SkinScores - Medical Assessment Tools',
  description: 'Professional dermatology assessment tools and calculators',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Edu+NSW+ACT+Cursive:wght@400..700&family=Funnel+Display:wght@300..800&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-body antialiased">
        <ScriptWrapper />
        <ClientAppShell>{children}</ClientAppShell>
      </body>
    </html>
  );
}
