import { useState } from 'react';
import { LLMProviderType, saveRuntimeConfig } from '../config';
import { resetProvider } from '../services/aiService';

const SETUP_KEY = 'ai-dash-setup';

export interface SetupState {
  isComplete: boolean;
  currentStep: number;
  llmProvider?: LLMProviderType;
  llmApiKey?: string;
  llmModel?: string;
}

function loadSetupState(): SetupState {
  try {
    const stored = localStorage.getItem(SETUP_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return { isComplete: false, currentStep: 0 };
}

export function useSetupState() {
  const [setupState, setSetupState] = useState<SetupState>(loadSetupState);

  const completeSetup = (config: {
    llmProvider: LLMProviderType;
    llmApiKey?: string;
    llmModel?: string;
  }) => {
    const state: SetupState = {
      isComplete: true,
      currentStep: 4,
      ...config,
    };
    localStorage.setItem(SETUP_KEY, JSON.stringify(state));
    setSetupState(state);

    saveRuntimeConfig({
      llm: {
        provider: config.llmProvider,
        apiKey: config.llmApiKey,
        model: config.llmModel,
      },
    });
    resetProvider();
  };

  const skipSetup = () => {
    const state: SetupState = { isComplete: true, currentStep: 4 };
    localStorage.setItem(SETUP_KEY, JSON.stringify(state));
    setSetupState(state);
  };

  const resetSetup = () => {
    localStorage.removeItem(SETUP_KEY);
    setSetupState({ isComplete: false, currentStep: 0 });
  };

  return { setupState, completeSetup, skipSetup, resetSetup };
}
