
"use client"

import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToolContext } from '@/hooks/useToolContext';
import { ChevronDown, Search } from 'lucide-react';
import type { Tool } from '@/lib/types';


export function AppHeader({ isMobile }: { isMobile: boolean }) {
    const { 
        selectedTool,
        handleToolSelect, 
        groupedTools, 
        recentToolDetails,
        isClient 
    } = useToolContext();
    const [open, setOpen] = React.useState(false);

    const title = selectedTool ? selectedTool.name : "SkinScores Home";
    const description = selectedTool ? selectedTool.condition : "Select a clinical scoring tool to begin.";

    return (
        <header className="sticky top-0 z-20 flex h-auto min-h-[4rem] items-start gap-2 bg-sidebar px-4 pt-2 pb-2 sm:h-16 sm:items-center sm:px-6 sm:pb-2">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold tracking-tight truncate pr-4">{title}</h1>
                    <p className="text-xs text-muted-foreground truncate pr-4 hidden sm:block">{description}</p>
                </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
                 <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                            <Search className="mr-2 h-4 w-4 shrink-0" />
                             {selectedTool ? selectedTool.name : "Select a tool..."}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                        <Command>
                            <CommandInput placeholder="Search for a tool..." />
                            <CommandList>
                                <CommandEmpty>No tool found.</CommandEmpty>
                                {isClient && recentToolDetails.length > 0 && (
                                    <CommandGroup heading="Recently Used">
                                        {recentToolDetails.map((tool: Tool) => (
                                            <CommandItem
                                                key={tool.id}
                                                value={tool.name}
                                                onSelect={() => {
                                                    handleToolSelect(tool.id);
                                                    setOpen(false);
                                                }}
                                            >
                                                {tool.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}
                                <CommandGroup heading="All Tools">
                                    {Object.entries(groupedTools).map(([condition, tools]) => (
                                        <React.Fragment key={condition}>
                                            <DropdownMenuLabel className="text-xs text-muted-foreground px-2 pt-2">{condition}</DropdownMenuLabel>
                                            {tools.map((tool: Tool) => (
                                                <CommandItem
                                                    key={tool.id}
                                                    value={tool.name}
                                                    onSelect={() => {
                                                        handleToolSelect(tool.id);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {tool.name}
                                                </CommandItem>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Categories <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>Browse by Condition</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {Object.entries(groupedTools).map(([condition, tools]) => (
                                <DropdownMenuItem key={condition} disabled>
                                    {condition} ({tools.length})
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
