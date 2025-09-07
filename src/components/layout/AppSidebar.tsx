
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
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import {
  History,
  Activity,
  GitCompare,
  FileText,
  Users,
  Star,
  Search,
} from 'lucide-react';
import type { Tool } from '@/lib/types';
import { PremiumInput } from '../ui/input-premium';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToolContext } from '@/hooks/useToolContext';

export function AppSidebar() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { groupedTools, recentToolDetails } = useToolContext();
  
  const selectedToolId = React.useMemo(() => {
    return searchParams.get('toolId');
  }, [searchParams]);

  const filteredTools = React.useMemo(() => {
    if (!searchTerm) {
      return groupedTools;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered: Record<string, Tool[]> = {};
    for (const condition in groupedTools) {
      const matchingTools = groupedTools[condition].filter(tool =>
        tool.name.toLowerCase().includes(lowerSearchTerm) ||
        (tool.acronym && tool.acronym.toLowerCase().includes(lowerSearchTerm)) ||
        tool.condition.toLowerCase().includes(lowerSearchTerm) ||
        (tool.keywords && tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchTerm)))
      );
      if (matchingTools.length > 0) {
        filtered[condition] = matchingTools;
      }
    }
    return filtered;
  }, [searchTerm, groupedTools]);


  return (
    <>

      <SidebarContent>
        <div className="p-2">
            <PremiumInput
                placeholder="Filter tools..."
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="h-4 w-4" />}
            />
        </div>

        <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === '/' && !selectedToolId} asChild>
                    <Link href="/">Home</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === '/tools'} asChild>
                    <Link href="/tools">Browse All Tools</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === '/history'} asChild>
                    <Link href="/history" className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        Calculation History
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === '/compare'} asChild>
                    <Link href="/compare" className="flex items-center gap-2">
                        <GitCompare className="h-4 w-4" />
                        Compare Calculations
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === '/templates'} asChild>
                    <Link href="/templates" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        My Templates
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === '/patients'} asChild>
                    <Link href="/patients" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Patient Progress
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
    
            {recentToolDetails.length > 0 && !searchTerm && (
                <SidebarGroup>
                    <SidebarGroupLabel className="font-headline text-base">Recently Used</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenuSub>
                        {recentToolDetails.map((tool) => (
                            <SidebarMenuItem key={tool.id}>
                                <SidebarMenuSubButton isActive={selectedToolId === tool.id} asChild>
                                    <Link href={`/?toolId=${tool.id}`} className="block leading-normal">{tool.name}</Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuItem>
                        ))}
                        </SidebarMenuSub>
                    </SidebarGroupContent>
                </SidebarGroup>
            )}
            
            <div className="px-2">
                <Accordion type="multiple" className="w-full">
                    {Object.entries(filteredTools).sort((a,b) => a[0].localeCompare(b[0])).map(([condition, tools]) => (
                        <AccordionItem value={condition} key={condition} className="border-none">
                            <AccordionTrigger className="py-3 px-2 text-base font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md hover:no-underline font-headline">
                                {condition}
                            </AccordionTrigger>
                            <AccordionContent className="pl-4 pt-1 pb-1">
                                 <SidebarMenuSub>
                                    {tools.sort((a,b) => a.name.localeCompare(b.name)).map(tool => (
                                        <SidebarMenuItem key={tool.id}>
                                            <SidebarMenuSubButton isActive={selectedToolId === tool.id} asChild>
                                                <Link href={`/?toolId=${tool.id}`} className="block leading-normal">{tool.name}</Link>
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
            <SidebarMenuButton asChild>
                <Link href="/analytics">
                    <Activity className="h-4 w-4 mr-2" />
                    Analytics
                </Link>
            </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </>
  );
}
