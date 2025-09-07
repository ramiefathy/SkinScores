export interface Workspace {
  id: string;
  name: string;
  description?: string;
  members: WorkspaceMember[];
  calculations: string[]; // Calculation IDs
  templates: string[]; // Template IDs
  createdAt: string;
  updatedAt: string;
  settings: WorkspaceSettings;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email?: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface WorkspaceSettings {
  defaultUnits: 'metric' | 'imperial';
  autoShare: boolean;
  requireNotes: boolean;
}

const WORKSPACES_KEY = 'skinscores_workspaces';
const CURRENT_WORKSPACE_KEY = 'skinscores_current_workspace';

// Get all workspaces
export function getWorkspaces(): Workspace[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(WORKSPACES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load workspaces:', e);
    return [];
  }
}

// Get current workspace
export function getCurrentWorkspace(): Workspace | null {
  if (typeof window === 'undefined') return null;
  
  const workspaceId = localStorage.getItem(CURRENT_WORKSPACE_KEY);
  if (!workspaceId) return null;
  
  return getWorkspaces().find(w => w.id === workspaceId) || null;
}

// Set current workspace
export function setCurrentWorkspace(workspaceId: string | null): void {
  if (typeof window === 'undefined') return;
  
  if (workspaceId) {
    localStorage.setItem(CURRENT_WORKSPACE_KEY, workspaceId);
  } else {
    localStorage.removeItem(CURRENT_WORKSPACE_KEY);
  }
}

// Create a new workspace
export function createWorkspace(
  name: string,
  description?: string,
  memberName: string = 'Me'
): Workspace {
  const workspaces = getWorkspaces();
  
  const newWorkspace: Workspace = {
    id: `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    members: [{
      id: `member_${Date.now()}`,
      name: memberName,
      role: 'owner',
      joinedAt: new Date().toISOString(),
    }],
    calculations: [],
    templates: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      defaultUnits: 'metric',
      autoShare: true,
      requireNotes: false,
    },
  };
  
  workspaces.push(newWorkspace);
  localStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces));
  
  // Set as current workspace if it's the first one
  if (workspaces.length === 1) {
    setCurrentWorkspace(newWorkspace.id);
  }
  
  return newWorkspace;
}

// Update workspace
export function updateWorkspace(
  id: string,
  updates: Partial<Omit<Workspace, 'id' | 'createdAt'>>
): Workspace | null {
  const workspaces = getWorkspaces();
  const index = workspaces.findIndex(w => w.id === id);
  
  if (index === -1) return null;
  
  workspaces[index] = {
    ...workspaces[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces));
  return workspaces[index];
}

// Delete workspace
export function deleteWorkspace(id: string): boolean {
  const workspaces = getWorkspaces();
  const filtered = workspaces.filter(w => w.id !== id);
  
  if (filtered.length === workspaces.length) return false;
  
  localStorage.setItem(WORKSPACES_KEY, JSON.stringify(filtered));
  
  // If deleted the current workspace, switch to another
  if (localStorage.getItem(CURRENT_WORKSPACE_KEY) === id) {
    setCurrentWorkspace(filtered[0]?.id || null);
  }
  
  return true;
}

// Add member to workspace
export function addWorkspaceMember(
  workspaceId: string,
  name: string,
  email?: string,
  role: WorkspaceMember['role'] = 'member'
): WorkspaceMember | null {
  const workspace = getWorkspaces().find(w => w.id === workspaceId);
  if (!workspace) return null;
  
  const newMember: WorkspaceMember = {
    id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    role,
    joinedAt: new Date().toISOString(),
  };
  
  workspace.members.push(newMember);
  updateWorkspace(workspaceId, { members: workspace.members });
  
  return newMember;
}

// Remove member from workspace
export function removeWorkspaceMember(
  workspaceId: string,
  memberId: string
): boolean {
  const workspace = getWorkspaces().find(w => w.id === workspaceId);
  if (!workspace) return false;
  
  // Can't remove the owner
  const member = workspace.members.find(m => m.id === memberId);
  if (!member || member.role === 'owner') return false;
  
  workspace.members = workspace.members.filter(m => m.id !== memberId);
  updateWorkspace(workspaceId, { members: workspace.members });
  
  return true;
}

// Add calculation to workspace
export function addCalculationToWorkspace(
  workspaceId: string,
  calculationId: string
): boolean {
  const workspace = getWorkspaces().find(w => w.id === workspaceId);
  if (!workspace) return false;
  
  if (!workspace.calculations.includes(calculationId)) {
    workspace.calculations.push(calculationId);
    updateWorkspace(workspaceId, { calculations: workspace.calculations });
  }
  
  return true;
}

// Add template to workspace
export function addTemplateToWorkspace(
  workspaceId: string,
  templateId: string
): boolean {
  const workspace = getWorkspaces().find(w => w.id === workspaceId);
  if (!workspace) return false;
  
  if (!workspace.templates.includes(templateId)) {
    workspace.templates.push(templateId);
    updateWorkspace(workspaceId, { templates: workspace.templates });
  }
  
  return true;
}

// Initialize default workspace
export function initializeDefaultWorkspace(): Workspace {
  const workspaces = getWorkspaces();
  
  if (workspaces.length === 0) {
    return createWorkspace('My Workspace', 'Default personal workspace');
  }
  
  return workspaces[0];
}