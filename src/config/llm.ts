import { ResponseMessage } from '../types';
import { LLMConfig } from './index';

export interface LLMContext {
  lastResponse?: ResponseMessage;
  availableDatasets?: string[];
}

export interface LLMResponse {
  text?: string;
  chartConfig?: {
    type: string;
    data: Record<string, string | number>[];
    xKey?: string;
    yKey?: string | string[];
    title: string;
  };
  followUpSuggestions?: string[];
  explanation: string;
  interpretation: {
    intent: string;
    entities: string[];
    dataSource: string;
    assumptions: string[];
  };
}

export interface LLMProvider {
  sendQuery(query: string, context?: LLMContext): Promise<LLMResponse>;
  testConnection(): Promise<boolean>;
}

export function createProvider(config: LLMConfig): LLMProvider {
  switch (config.provider) {
    case 'openai': {
      const { createOpenAIProvider } = require('./providers/openai');
      return createOpenAIProvider(config);
    }
    case 'anthropic': {
      const { createAnthropicProvider } = require('./providers/anthropic');
      return createAnthropicProvider(config);
    }
    case 'mock':
    default: {
      const { createMockProvider } = require('../services/mockAI');
      return createMockProvider();
    }
  }
}
