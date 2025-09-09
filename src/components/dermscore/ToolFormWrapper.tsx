"use client";

import React from 'react';
import { ToolForm } from './ToolForm';
import { customFormRegistry } from './customFormRegistry';
import ErrorBoundary from '@/components/ui/error-boundary';
import type { Tool } from '@/lib/types';

interface ToolFormWrapperProps {
  tool: Tool;
  onCalculate: (inputs: Record<string, any>) => void;
}

export function ToolFormWrapper({ tool, onCalculate }: ToolFormWrapperProps) {
  console.log('ToolFormWrapper rendering for tool:', tool.id);
  console.log('Checking customFormRegistry for tool:', tool.id);
  
  // Check if the tool has a custom form component in the registry
  const CustomForm = customFormRegistry[tool.id];
  
  return (
    <ErrorBoundary>
      {CustomForm ? (
        <>
          {console.log('Using custom form component from registry for tool:', tool.id)}
          <CustomForm tool={tool} onCalculate={onCalculate} />
        </>
      ) : (
        <>
          {console.log('Using default ToolForm for tool:', tool.id)}
          <ToolForm tool={tool} onCalculate={onCalculate} />
        </>
      )}
    </ErrorBoundary>
  );
}