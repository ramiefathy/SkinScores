"use client";

import React, { useEffect, useRef } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calculator, Clock, Filter, Hash, Search, Sparkles, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CommandPalette() {
  const {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    filters,
    setFilters,
    recentSearches,
    clearRecentSearches,
    suggestions,
    selectResult,
  } = useSearch();

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  const handleSelect = (toolId: string) => {
    const tool = results.find(r => r.item.id === toolId)?.item;
    if (tool) {
      selectResult(tool);
    }
  };

  const getComplexityBadge = (tool: any) => {
    const sectionCount = tool.formSections?.length || 0;
    const complexity = sectionCount <= 3 ? 'Simple' : 
                      sectionCount <= 6 ? 'Moderate' : 'Complex';
    const variant = complexity === 'Simple' ? 'default' : 
                   complexity === 'Moderate' ? 'secondary' : 'destructive';
    return <Badge variant={variant} className="ml-2 text-xs">{complexity}</Badge>;
  };

  const highlightMatch = (text: string, matches: any[]) => {
    if (!matches || matches.length === 0) return text;
    
    // Sort matches by index
    const sortedMatches = [...matches].sort((a, b) => a.indices[0][0] - b.indices[0][0]);
    
    let lastIndex = 0;
    const parts: React.ReactNode[] = [];
    
    sortedMatches.forEach((match, i) => {
      const [start, end] = match.indices[0];
      
      // Add text before match
      if (start > lastIndex) {
        parts.push(text.slice(lastIndex, start));
      }
      
      // Add highlighted match
      parts.push(
        <mark key={i} className="bg-primary/20 text-primary font-semibold">
          {text.slice(start, end + 1)}
        </mark>
      );
      
      lastIndex = end + 1;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    
    return <>{parts}</>;
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <Command className="rounded-lg border shadow-md">
        <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, conditions, or keywords..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="ml-2 rounded-sm opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <CommandList>
          <ScrollArea className="h-[400px]">
            {/* Suggestions */}
            {suggestions.length > 0 && !results.length && (
              <>
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      onSelect={() => setQuery(suggestion)}
                      className="cursor-pointer"
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-muted-foreground" />
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && !query && (
              <>
                <CommandGroup 
                  heading={
                    <div className="flex items-center justify-between">
                      <span>Recent Searches</span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  }
                >
                  {recentSearches.map((search) => (
                    <CommandItem
                      key={search}
                      onSelect={() => setQuery(search)}
                      className="cursor-pointer"
                    >
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {search}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* Search Results */}
            {query && results.length > 0 && (
              <CommandGroup heading={`Found ${results.length} tools`}>
                {results.map((result) => {
                  const nameMatch = result.matches?.find(m => m.key === 'name');
                  const conditionMatch = result.matches?.find(m => m.key === 'condition');
                  
                  return (
                    <CommandItem
                      key={result.item.id}
                      value={result.item.id}
                      onSelect={handleSelect}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calculator className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="font-medium">
                              {nameMatch ? highlightMatch(result.item.name, nameMatch.matches) : result.item.name}
                            </span>
                            {result.item.acronym && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({result.item.acronym})
                              </span>
                            )}
                          </div>
                          {getComplexityBadge(result.item)}
                        </div>
                        <div className="ml-6 text-sm text-muted-foreground">
                          {conditionMatch ? highlightMatch(result.item.condition, conditionMatch.matches) : result.item.condition}
                        </div>
                        {result.score !== undefined && (
                          <div className="ml-6 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Match: {Math.round((1 - result.score) * 100)}%
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {/* Empty State */}
            {query && results.length === 0 && (
              <CommandEmpty>
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No tools found for &quot;{query}&quot;</p>
                  <p className="text-xs text-muted-foreground mt-1">Try different keywords or check filters</p>
                </div>
              </CommandEmpty>
            )}

            {/* Quick Actions */}
            {!query && (
              <CommandGroup heading="Quick Actions">
                <CommandItem
                  onSelect={() => {
                    setIsOpen(false);
                    // Navigate to all tools
                    window.location.href = '/tools';
                  }}
                  className="cursor-pointer"
                >
                  <Hash className="mr-2 h-4 w-4" />
                  Browse All Tools
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setIsOpen(false);
                    // Open filters dialog
                    // TODO: Implement filters dialog
                  }}
                  className="cursor-pointer"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </CommandItem>
              </CommandGroup>
            )}
          </ScrollArea>
        </CommandList>
        
        <div className="border-t px-4 py-2">
          <p className="text-xs text-muted-foreground">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
            {' '}to open • {' '}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">↑↓</span>
            </kbd>
            {' '}to navigate • {' '}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">↵</span>
            </kbd>
            {' '}to select • {' '}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">ESC</span>
            </kbd>
            {' '}to close
          </p>
        </div>
      </Command>
    </CommandDialog>
  );
}