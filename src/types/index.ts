export type ResponseType = 'chart' | 'text' | 'mixed';

export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'funnel' | 'scatter' | 'kpi' | 'stackedBar' | 'table' | 'treemap';

export interface KPIData {
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'flat';
  changePercent?: number;
  comparisonLabel?: string;
}

export interface ChartData {
  type: ChartType;
  data: Record<string, string | number>[];
  xKey?: string;
  yKey?: string | string[];
  title: string;
  kpiData?: KPIData;
  stackKeys?: string[];
}

export interface QueryInterpretation {
  intent: string;
  entities: string[];
  dataSource: string;
  assumptions: string[];
}

export interface ResponseMessage {
  id: string;
  type: ResponseType;
  chart?: ChartData;
  text?: string;
  explanation: string;
  interpretation: QueryInterpretation;
  followUpSuggestions?: string[];
  timestamp: Date;
}

export interface ConversationMessage {
  id: string;
  userQuery: string;
  response: ResponseMessage;
  timestamp: Date;
}

export interface PinnedChart {
  id: string;
  chart: ChartData;
  pinnedAt: Date;
  sourceMessageId: string;
}

export interface ViewContext {
  text?: string;
  files?: UploadedDataset[];
}

export interface View {
  id: string;
  name: string;
  messages: ConversationMessage[];
  pinnedCharts?: PinnedChart[];
  context?: ViewContext;
  createdAt: Date;
}

export interface ColumnMeta {
  name: string;
  type: 'string' | 'number' | 'date';
  sampleValues: (string | number)[];
}

export interface UploadedDataset {
  id: string;
  name: string;
  columns: ColumnMeta[];
  rows: Record<string, string | number>[];
  source: 'upload';
  uploadedAt: Date;
}

export interface StorySection {
  type: 'heading' | 'text' | 'chart' | 'insight';
  content: string;
  chart?: ChartData;
}

export interface DataStory {
  title: string;
  generatedAt: Date;
  sections: StorySection[];
}

export interface Workflow {
  id: string;
  name: string;
  queries: string[];
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  name: string;
  views: View[];
  datasets?: UploadedDataset[];
  lastAccessed: Date;
}
