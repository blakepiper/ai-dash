import Papa from 'papaparse';
import { UploadedDataset, ColumnMeta } from '../types';
import { generateId } from './id';

const MAX_STORED_ROWS = 1000;

export function inferColumns(
  fields: string[],
  data: Record<string, unknown>[]
): ColumnMeta[] {
  const sampleSize = Math.min(data.length, 10);
  return fields.map((name) => {
    const samples = data.slice(0, sampleSize).map((row) => row[name]);
    const nonNull = samples.filter((v) => v != null && v !== '');

    let type: ColumnMeta['type'] = 'string';
    if (nonNull.length > 0) {
      const allNumbers = nonNull.every(
        (v) => typeof v === 'number' || (typeof v === 'string' && !isNaN(Number(v)) && v.trim() !== '')
      );
      if (allNumbers) {
        type = 'number';
      } else {
        const allDates = nonNull.every((v) => {
          const d = new Date(String(v));
          return !isNaN(d.getTime()) && String(v).length > 4;
        });
        if (allDates) type = 'date';
      }
    }

    return {
      name,
      type,
      sampleValues: nonNull.slice(0, 3).map((v) =>
        type === 'number' ? Number(v) : String(v)
      ),
    };
  });
}

export function parseCSV(file: File): Promise<UploadedDataset> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          reject(new Error(`CSV parse error: ${results.errors[0].message}`));
          return;
        }
        const fields = results.meta.fields || [];
        const data = results.data as Record<string, string | number>[];
        const rows = data.slice(0, MAX_STORED_ROWS);

        resolve({
          id: generateId(),
          name: file.name.replace(/\.[^.]+$/, ''),
          columns: inferColumns(fields, data),
          rows,
          source: 'upload',
          uploadedAt: new Date(),
        });
      },
      error: (error) => reject(new Error(`CSV parse error: ${error.message}`)),
    });
  });
}

export async function parseExcel(file: File): Promise<UploadedDataset> {
  // Dynamic import — xlsx is only loaded when an Excel file is detected
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const XLSX = await import(/* webpackChunkName: "xlsx" */ 'xlsx');
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet) as Record<string, string | number>[];

  if (data.length === 0) {
    throw new Error('Excel file is empty or has no data rows');
  }

  const fields = Object.keys(data[0]);
  const rows = data.slice(0, MAX_STORED_ROWS);

  return {
    id: generateId(),
    name: file.name.replace(/\.[^.]+$/, ''),
    columns: inferColumns(fields, data),
    rows,
    source: 'upload',
    uploadedAt: new Date(),
  };
}

export function parseFile(file: File): Promise<UploadedDataset> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'csv') return parseCSV(file);
  if (ext === 'xlsx' || ext === 'xls') return parseExcel(file);
  return Promise.reject(new Error(`Unsupported file type: .${ext}`));
}
