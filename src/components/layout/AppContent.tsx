
"use client";

import React, { Suspense } from 'react';

export function AppContent({ children }: { children: React.ReactNode }) {
    return <Suspense>{children}</Suspense>
}
