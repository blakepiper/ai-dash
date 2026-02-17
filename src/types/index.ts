export type ResponseType = 'chart' | 'text' | 'mixed';

export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'funnel';

export interface ChartData {
  type: ChartType;
  data: Record<string, string | number>[];
  xKey?: string;
  yKey?: string | string[];
  title: string;
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
  timestamp: Date;
}

export interface ConversationMessage {
  id: string;
  userQuery: string;
  response: ResponseMessage;
  timestamp: Date;
}

export interface View {
  id: string;
  name: string;
  messages: ConversationMessage[];
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  name: string;
  views: View[];
  lastAccessed: Date;
}
