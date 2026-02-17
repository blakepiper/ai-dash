export type LLMProviderType = 'mock' | 'openai' | 'anthropic';

export interface LLMConfig {
  provider: LLMProviderType;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

export interface AppConfig {
  llm: LLMConfig;
}

const RUNTIME_CONFIG_KEY = 'ai-dash-config';

export function loadConfig(): AppConfig {
  return {
    llm: {
      provider: (process.env.REACT_APP_LLM_PROVIDER as LLMProviderType) || 'mock',
      apiKey: process.env.REACT_APP_LLM_API_KEY,
      model: process.env.REACT_APP_LLM_MODEL,
      baseUrl: process.env.REACT_APP_LLM_BASE_URL,
    },
  };
}

export function loadRuntimeConfig(): Partial<AppConfig> | null {
  try {
    const stored = localStorage.getItem(RUNTIME_CONFIG_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Corrupted — ignore
  }
  return null;
}

export function saveRuntimeConfig(config: Partial<AppConfig>): void {
  localStorage.setItem(RUNTIME_CONFIG_KEY, JSON.stringify(config));
}

export function clearRuntimeConfig(): void {
  localStorage.removeItem(RUNTIME_CONFIG_KEY);
}

export function getEffectiveConfig(): AppConfig {
  const base = loadConfig();
  const runtime = loadRuntimeConfig();
  if (!runtime) return base;
  return {
    llm: {
      ...base.llm,
      ...runtime.llm,
    },
  };
}
