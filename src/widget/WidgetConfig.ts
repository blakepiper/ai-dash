import { LLMProviderType } from '../config';

export interface WidgetConfig {
  llmProvider?: LLMProviderType;
  apiKey?: string;
  model?: string;
  theme?: 'light' | 'dark' | 'auto';
  height?: string;
  width?: string;
  placeholder?: string;
  showExamples?: boolean;
}

export const defaultWidgetConfig: WidgetConfig = {
  llmProvider: 'mock',
  theme: 'auto',
  height: '600px',
  width: '100%',
  placeholder: 'Ask a question about your data...',
  showExamples: true,
};
