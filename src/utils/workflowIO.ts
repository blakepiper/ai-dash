import { Workflow } from '../types';

const STORAGE_KEY = 'ai-dash-workflows';

export function loadWorkflows(): Workflow[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored).map((w: any) => ({
        ...w,
        createdAt: new Date(w.createdAt),
      }));
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveWorkflows(workflows: Workflow[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
}

export function exportWorkflow(workflow: Workflow): string {
  return JSON.stringify(workflow, null, 2);
}

export function importWorkflow(json: string): Workflow {
  const parsed = JSON.parse(json);
  return {
    ...parsed,
    createdAt: new Date(parsed.createdAt),
  };
}
