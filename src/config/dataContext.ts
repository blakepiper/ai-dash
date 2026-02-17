export interface DataContextColumn {
  name: string;
  type: string;
  description: string;
  businessTerm?: string;
}

export interface DataContextDataset {
  name: string;
  description: string;
  columns: DataContextColumn[];
}

export interface DataContext {
  datasets: DataContextDataset[];
  glossary: Record<string, string>;
}

let cachedContext: DataContext | null = null;

export async function getDataContext(): Promise<DataContext | null> {
  if (cachedContext) return cachedContext;

  try {
    const res = await fetch('/data-context.json');
    if (!res.ok) return null;
    cachedContext = await res.json();
    return cachedContext;
  } catch {
    return null;
  }
}

export function clearDataContextCache(): void {
  cachedContext = null;
}
