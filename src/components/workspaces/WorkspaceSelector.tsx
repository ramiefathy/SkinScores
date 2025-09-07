"use client";

import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, ChevronDown, Plus, Settings, LogOut, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  getWorkspaces,
  getCurrentWorkspace,
  setCurrentWorkspace,
  createWorkspace,
  type Workspace,
} from '@/lib/workspaces';

export function WorkspaceSelector() {
  const { toast } = useToast();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = () => {
    const ws = getWorkspaces();
    setWorkspaces(ws);
    
    const current = getCurrentWorkspace();
    setCurrentWorkspaceState(current);
    
    // Initialize default workspace if none exists
    if (ws.length === 0) {
      const defaultWs = createWorkspace('My Workspace', 'Personal workspace');
      setWorkspaces([defaultWs]);
      setCurrentWorkspaceState(defaultWs);
    }
  };

  const handleSwitchWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace.id);
    setCurrentWorkspaceState(workspace);
    
    toast({
      title: "Workspace Switched",
      description: `Now working in "${workspace.name}"`,
    });
    
    // Reload the page to apply workspace context
    window.location.reload();
  };

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a workspace name.",
        variant: "destructive",
      });
      return;
    }

    const workspace = createWorkspace(
      newWorkspaceName,
      newWorkspaceDescription || undefined
    );

    setNewWorkspaceName('');
    setNewWorkspaceDescription('');
    setShowCreateDialog(false);
    
    toast({
      title: "Workspace Created",
      description: `"${workspace.name}" has been created successfully.`,
    });
    
    loadWorkspaces();
    handleSwitchWorkspace(workspace);
  };

  if (!currentWorkspace) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span className="truncate">{currentWorkspace.name}</span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[240px]">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => handleSwitchWorkspace(workspace)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span className="truncate">{workspace.name}</span>
                {workspace.id === currentWorkspace.id && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Current
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => setShowCreateDialog(true)}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Workspace
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => {
              toast({
                title: "Coming Soon",
                description: "Workspace settings will be available soon.",
              });
            }}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            Workspace Settings
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => {
              toast({
                title: "Coming Soon",
                description: "Team member management will be available soon.",
              });
            }}
            className="cursor-pointer"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Manage Members
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>
              Create a workspace to organize calculations and collaborate with your team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="e.g., Clinic Team, Research Project"
              />
            </div>
            
            <div>
              <Label htmlFor="workspace-description">Description (Optional)</Label>
              <Textarea
                id="workspace-description"
                value={newWorkspaceDescription}
                onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                placeholder="Describe the purpose of this workspace..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkspace}>
              Create Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}