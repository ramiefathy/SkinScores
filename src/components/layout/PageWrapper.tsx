
"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { AppHeader } from './AppHeader';

export function PageWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isMobile } = useSidebar();
    
    return (
        <div className="flex h-full flex-col">
            <AppHeader />
            <motion.main 
                data-id="page-wrapper-content" 
                className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {children}
            </motion.main>
        </div>
    );
}
