import { DataSourceAdapter, DatasetSchema } from '../config/dataSources';
import salesData from '../data/sales.json';
import customersData from '../data/customers.json';
import analyticsData from '../data/analytics.json';
import inventoryData from '../data/inventory.json';

const datasets: Record<string, Record<string, unknown>> = {
  sales: salesData as any,
  customers: customersData as any,
  analytics: analyticsData as any,
  inventory: inventoryData as any,
};

function getFieldsFromData(data: unknown[]): Array<{ name: string; type: string }> {
  if (!Array.isArray(data) || data.length === 0) return [];
  const first = data[0] as Record<string, unknown>;
  return Object.entries(first).map(([name, value]) => ({
    name,
    type: typeof value,
  }));
}

export function createJsonAdapter(): DataSourceAdapter {
  return {
    async listDatasets() {
      return Object.keys(datasets);
    },

    async queryDataset(name: string, filters?: Record<string, unknown>) {
      const ds = datasets[name];
      if (!ds) return [];

      // Flatten: return all arrays found in the dataset
      const allArrays = Object.values(ds).filter(Array.isArray);
      let results = allArrays.flat() as Record<string, unknown>[];

      if (filters) {
        results = results.filter((row) =>
          Object.entries(filters).every(([key, value]) => row[key] === value)
        );
      }

      return results;
    },

    async getSchema(name: string) {
      const ds = datasets[name];
      if (!ds) return null;

      const firstArray = Object.values(ds).find(Array.isArray) as unknown[] | undefined;
      if (!firstArray) return null;

      return {
        name,
        fields: getFieldsFromData(firstArray),
      };
    },
  };
}
