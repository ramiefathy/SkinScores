import { redirect } from 'next/navigation';
import { toolData } from '@/lib/tools';

interface ToolPageProps {
  params: Promise<{
    toolId: string;
  }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { toolId } = await params;
  
  // Check if the tool exists
  const toolExists = toolData.some(tool => tool.id === toolId);
  
  if (!toolExists) {
    // If tool doesn't exist, redirect to tools page
    redirect('/tools');
  }
  
  // Redirect to home page with toolId query parameter
  redirect(`/?toolId=${toolId}`);
}