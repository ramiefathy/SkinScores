"use client";

import React from 'react';
import { ToolForm } from './ToolForm';
import { customFormRegistry } from './customFormRegistry';
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
  
  if (CustomForm) {
    console.log('Using custom form component from registry for tool:', tool.id);
    return <CustomForm tool={tool} onCalculate={onCalculate} />;
  }
  
  // Otherwise use the default ToolForm
  console.log('Using default ToolForm for tool:', tool.id);
  return <ToolForm tool={tool} onCalculate={onCalculate} />;
}