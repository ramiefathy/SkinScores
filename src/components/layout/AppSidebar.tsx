
"use client"

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  LayoutGrid,
  Search,
} from 'lucide-react';
import { toolData } from '@/lib/tools';
import type { Tool } from '@/lib/types';
import { Input } from '../ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const RECENT_TOOLS_STORAGE_KEY = 'skinscore_recently_used_tools';

export function AppSidebar() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [recentlyUsed, setRecentlyUsed] = React.useState<string[]>([]);
  
  const selectedToolId = React.useMemo(() => {
    return searchParams.get('toolId');
  }, [searchParams]);

  React.useEffect(() => {
    const getRecentTools = () => {
      const stored = localStorage.getItem(RECENT_TOOLS_STORAGE_KEY);
      if (stored) {
        setRecentlyUsed(JSON.parse(stored));
      }
    };
    getRecentTools();

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', getRecentTools);

    return () => {
      window.removeEventListener('storage', getRecentTools);
    };
  }, []);


  const groupedTools = React.useMemo(() => {
    let tools = toolData;
    if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        tools = toolData.filter(tool =>
            tool.name.toLowerCase().includes(lowerSearchTerm) ||
            (tool.acronym && tool.acronym.toLowerCase().includes(lowerSearchTerm)) ||
            tool.condition.toLowerCase().includes(lowerSearchTerm) ||
            (tool.keywords && tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchTerm)))
        );
    }

    return tools.reduce((acc, tool) => {
      const condition = tool.condition || 'Other';
      if (!acc[condition]) {
        acc[condition] = [];
      }
      acc[condition].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);
  }, [searchTerm]);

  const recentToolDetails = React.useMemo(() => {
    return recentlyUsed.map(id => toolData.find(t => t.id === id)).filter(Boolean) as Tool[];
  }, [recentlyUsed]);


  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <div className="group-data-[collapsible=icon]:hidden">
                <h1 className="text-3xl font-bold text-sidebar-primary">SkinScores</h1>
                <p className="text-xs text-sidebar-foreground/70">Clinical Scoring Tools</p>
            </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="p-2 space-y-4">
            <div className="relative group-data-[collapsible=icon]:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                <Input
                    placeholder="Search tools..."
                    className="pl-8 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:h-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname === '/' && !selectedToolId}>
              <Link href="/">Home</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname === '/tools'}>
                <Link href="/tools">Browse All Tools</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        {recentToolDetails.length > 0 && !searchTerm && (
            <SidebarGroup>
                <SidebarGroupLabel>Recently Used</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenuSub>
                    {recentToolDetails.map((tool) => (
                        <SidebarMenuItem key={tool.id}>
                            <SidebarMenuSubButton isActive={selectedToolId === tool.id}>
                                <Link href={`/?toolId=${tool.id}`}>{tool.name}</Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenuSub>
                </SidebarGroupContent>
            </SidebarGroup>
        )}
        
        <div className="px-2">
            <Accordion type="multiple" className="w-full">
                {Object.entries(groupedTools).sort((a,b) => a[0].localeCompare(b[0])).map(([condition, tools]) => (
                    <AccordionItem value={condition} key={condition} className="border-none">
                        <AccordionTrigger className="py-2 px-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md hover:no-underline">
                            {condition}
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 pt-1 pb-1">
                             <SidebarMenuSub>
                                {tools.sort((a,b) => a.name.localeCompare(b.name)).map(tool => (
                                    <SidebarMenuItem key={tool.id}>
                                        <SidebarMenuSubButton isActive={selectedToolId === tool.id}>
                                            <Link href={`/?toolId=${tool.id}`}>{tool.name}</Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenuSub>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>


        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2 space-y-1">
            <SidebarMenuButton>
                <Link href="#">Settings</Link>
            </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </>
  );
}
