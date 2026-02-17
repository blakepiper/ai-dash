export interface DatasetSchema {
  name: string;
  fields: Array<{ name: string; type: string }>;
}

export interface DataSourceAdapter {
  listDatasets(): Promise<string[]>;
  queryDataset(name: string, filters?: Record<string, unknown>): Promise<Record<string, unknown>[]>;
  getSchema(name: string): Promise<DatasetSchema | null>;
}
