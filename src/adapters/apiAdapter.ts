import { DataSourceAdapter, DatasetSchema } from '../config/dataSources';

export function createApiAdapter(baseUrl: string): DataSourceAdapter {
  return {
    async listDatasets() {
      const res = await fetch(`${baseUrl}/datasets`);
      if (!res.ok) throw new Error('Failed to list datasets');
      return res.json();
    },

    async queryDataset(name: string, filters?: Record<string, unknown>) {
      const params = filters ? `?${new URLSearchParams(filters as Record<string, string>)}` : '';
      const res = await fetch(`${baseUrl}/datasets/${encodeURIComponent(name)}${params}`);
      if (!res.ok) throw new Error(`Failed to query dataset: ${name}`);
      return res.json();
    },

    async getSchema(name: string) {
      const res = await fetch(`${baseUrl}/datasets/${encodeURIComponent(name)}/schema`);
      if (!res.ok) return null;
      return res.json() as Promise<DatasetSchema>;
    },
  };
}
