import { redirect } from 'next/navigation';
import { getToolMetadata } from '@/lib/tools/tool-metadata';

interface ToolPageProps {
  params: Promise<{
    toolId: string;
  }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { toolId } = await params;
  
  // Check if the tool exists
  const toolExists = getToolMetadata(toolId) !== undefined;
  
  if (!toolExists) {
    // If tool doesn't exist, redirect to tools page
    redirect('/tools');
  }
  
  // Redirect to home page with toolId query parameter
  redirect(`/?toolId=${toolId}`);
}