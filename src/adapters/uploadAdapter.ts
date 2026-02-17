import { DataSourceAdapter, DatasetSchema } from '../config/dataSources';
import { UploadedDataset } from '../types';

export function createUploadAdapter(datasets: UploadedDataset[]): DataSourceAdapter {
  return {
    async listDatasets() {
      return datasets.map((d) => d.name);
    },

    async queryDataset(name: string) {
      const ds = datasets.find((d) => d.name === name);
      return ds ? ds.rows : [];
    },

    async getSchema(name: string) {
      const ds = datasets.find((d) => d.name === name);
      if (!ds) return null;
      return {
        name,
        fields: ds.columns.map((c) => ({ name: c.name, type: c.type })),
      } as DatasetSchema;
    },
  };
}
