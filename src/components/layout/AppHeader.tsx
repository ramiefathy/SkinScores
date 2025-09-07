"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/theme-provider';
import { WorkspaceSelector } from '@/components/workspaces/WorkspaceSelector';
import { toolData } from '@/lib/tools';
import type { Tool } from '@/lib/types';
import { 
  Search, 
  Plus, 
  User, 
  Settings, 
  HelpCircle,
  Moon,
  Sun,
  Command,
  Keyboard,
  ChevronDown,
  Calculator,
  RotateCcw
} from 'lucide-react';
import { getCurrentWorkspace } from '@/lib/workspaces';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MeshGradient } from '@paper-design/shaders-react';

export function AppHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const tools = toolData;
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuHovered, setUserMenuHovered] = useState(false);
  
  const currentToolId = searchParams.get('toolId');
  const currentTool = tools.find((t: Tool) => t.id === currentToolId);
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(null);
  
  React.useEffect(() => {
    setCurrentWorkspace(getCurrentWorkspace());
  }, []);

  const handleToolChange = (toolId: string) => {
    router.push(`/?toolId=${toolId}`);
  };

  const handleNewCalculation = () => {
    if (currentToolId) {
      // Refresh the current page to reset the form
      router.refresh();
    } else {
      router.push('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-24 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center px-8 gap-8">
        {/* Logo and Title with Paper Shaders */}
        <Link href="/" className="flex items-center gap-4 shrink-0 group">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-lg overflow-hidden">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity">
              <MeshGradient
                speed={0.2}
                colors={['#6ba3d0', '#a78bfa', '#60a5fa', '#c7d2fe']}
                className="w-full h-full"
              />
            </div>
            <Calculator className="h-8 w-8 text-white relative z-10" />
          </div>
          <div className="hidden sm:block">
            <motion.h1 
              className="text-4xl font-bold font-headline"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-gradient-premium">SkinScores</span>
            </motion.h1>
            <p className="text-lg text-muted-foreground">Clinical Scoring Tools</p>
          </div>
        </Link>

        {/* Tool Selector with integrated reset button */}
        <div className="flex gap-2 flex-1 max-w-lg">
          <Select value={currentToolId || ''} onValueChange={handleToolChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a clinical scoring tool...">
                {currentTool ? (
                  <span className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {currentTool.condition}
                    </Badge>
                    <span className="truncate">{currentTool.name}</span>
                  </span>
                ) : (
                  "Select a clinical scoring tool..."
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[400px]">
              {Object.entries(
                tools.reduce((acc: Record<string, Tool[]>, tool: Tool) => {
                  if (!acc[tool.condition]) acc[tool.condition] = [];
                  acc[tool.condition].push(tool);
                  return acc;
                }, {} as Record<string, typeof tools>)
              )
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([condition, conditionTools]) => (
                  <div key={condition}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      {condition}
                    </div>
                    {conditionTools
                      .sort((a: Tool, b: Tool) => a.name.localeCompare(b.name))
                      .map((tool) => (
                        <SelectItem key={tool.id} value={tool.id}>
                          <div className="flex items-center gap-2">
                            <span>{tool.name}</span>
                            {tool.acronym && (
                              <Badge variant="outline" className="text-xs">
                                {tool.acronym}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                  </div>
                ))}
            </SelectContent>
          </Select>
          
          {/* Reset Button - only show when a tool is selected */}
          {currentToolId && (
            <Button
              variant="outline"
              size="default"
              onClick={handleNewCalculation}
              className="shrink-0"
              title="Reset current form"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Global Search */}
        <Button
          variant="outline"
          size="default"
          onClick={() => {
            const event = new CustomEvent('openCommandPalette');
            window.dispatchEvent(event);
          }}
          className="shrink-0"
        >
          <Search className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-2">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* Workspace Dropdown - Desktop */}
        <div className="w-48 shrink-0 hidden lg:block">
          <WorkspaceSelector />
        </div>

        {/* User Menu with Morphing Effect */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="relative"
              onMouseEnter={() => setUserMenuHovered(true)}
              onMouseLeave={() => setUserMenuHovered(false)}
            >
              <AnimatePresence mode="wait">
                {!userMenuHovered ? (
                  <motion.button
                    key="icon"
                    initial={{ scale: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="shrink-0 h-10 w-10 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="h-5 w-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    key="expanded"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 25,
                      duration: 0.3 
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-[hsl(var(--premium-purple))] text-white rounded-full font-medium flex items-center gap-2 shadow-lg"
                  >
                    <User className="h-4 w-4" />
                    Account
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Show workspace selector in mobile menu */}
            <div className="lg:hidden p-2">
              <WorkspaceSelector />
            </div>
            <DropdownMenuSeparator className="lg:hidden" />
            
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark Mode
                </>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => {
                const event = new CustomEvent('showKeyboardShortcuts');
                window.dispatchEvent(event);
              }}
            >
              <Keyboard className="mr-2 h-4 w-4" />
              Shortcuts
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => router.push('/help')}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Docs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}