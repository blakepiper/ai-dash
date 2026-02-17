import React, { useState } from 'react';
import { LLMProviderType } from '../config';
import { createProvider } from '../config/llm';
import { FileUpload } from './FileUpload';
import { UploadedDataset } from '../types';
import { Zap, Key, Database, CheckCircle, AlertTriangle, ArrowRight, ArrowLeft, SkipForward } from 'lucide-react';

interface SetupWizardProps {
  onComplete: (config: {
    llmProvider: LLMProviderType;
    llmApiKey?: string;
    llmModel?: string;
  }) => void;
  onSkip: () => void;
  onDatasetUploaded?: (dataset: UploadedDataset) => void;
}

const MODELS: Record<string, string[]> = {
  openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'],
  anthropic: ['claude-sonnet-4-5-20250929', 'claude-haiku-4-5-20251001', 'claude-opus-4-6'],
};

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete, onSkip, onDatasetUploaded }) => {
  const [step, setStep] = useState(0);
  const [provider, setProvider] = useState<LLMProviderType>('mock');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const p = createProvider({ provider, apiKey, model });
      const ok = await p.testConnection();
      setTestResult(ok);
    } catch {
      setTestResult(false);
    } finally {
      setTesting(false);
    }
  };

  const handleComplete = () => {
    onComplete({
      llmProvider: provider,
      llmApiKey: provider !== 'mock' ? apiKey : undefined,
      llmModel: provider !== 'mock' ? (model || undefined) : undefined,
    });
  };

  const canProceed = () => {
    if (step === 1 && provider !== 'mock' && !apiKey.trim()) return false;
    return true;
  };

  const steps = [
    { label: 'Welcome', icon: <Zap size={18} /> },
    { label: 'API Key', icon: <Key size={18} /> },
    { label: 'Data', icon: <Database size={18} /> },
    { label: 'Done', icon: <CheckCircle size={18} /> },
  ];

  return (
    <div className="setup-overlay">
      <div className="setup-card">
        <div className="setup-steps">
          {steps.map((s, i) => (
            <div key={i} className={`setup-step ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
              {s.icon}
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="setup-content">
          {step === 0 && (
            <div className="setup-step-content">
              <h2>Welcome to AI Dash</h2>
              <p>Let's set up your analytics dashboard. Choose your AI provider:</p>
              <div className="setup-radio-group">
                {(['mock', 'openai', 'anthropic'] as LLMProviderType[]).map((p) => (
                  <label key={p} className={`setup-radio ${provider === p ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="provider"
                      value={p}
                      checked={provider === p}
                      onChange={() => { setProvider(p); setApiKey(''); setModel(''); setTestResult(null); }}
                    />
                    <span className="setup-radio-label">
                      {p === 'mock' ? 'Mock AI (Demo Mode)' : p === 'openai' ? 'OpenAI' : 'Anthropic'}
                    </span>
                    <span className="setup-radio-desc">
                      {p === 'mock' ? 'Pre-configured responses, no API key needed'
                        : p === 'openai' ? 'GPT-4o and other OpenAI models'
                        : 'Claude models via Anthropic API'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="setup-step-content">
              <h2>Configure {provider === 'mock' ? 'Mock AI' : provider === 'openai' ? 'OpenAI' : 'Anthropic'}</h2>
              {provider === 'mock' ? (
                <p>No configuration needed. Mock AI uses pre-configured pattern matching.</p>
              ) : (
                <>
                  <div className="setup-warning">
                    <AlertTriangle size={16} />
                    <span>API keys are stored in your browser's localStorage. This is for personal/internal use only.</span>
                  </div>
                  <div className="setup-field">
                    <label htmlFor="api-key">API Key</label>
                    <input
                      id="api-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => { setApiKey(e.target.value); setTestResult(null); }}
                      placeholder={provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                    />
                  </div>
                  <div className="setup-field">
                    <label htmlFor="model">Model</label>
                    <select
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                    >
                      <option value="">Default</option>
                      {(MODELS[provider] || []).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="setup-test-button"
                    onClick={handleTestConnection}
                    disabled={testing || !apiKey.trim()}
                  >
                    {testing ? 'Testing...' : 'Test Connection'}
                  </button>
                  {testResult === true && <p className="setup-test-success">Connection successful!</p>}
                  {testResult === false && <p className="setup-test-error">Connection failed. Check your API key.</p>}
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="setup-step-content">
              <h2>Data Source</h2>
              <p>You can use the built-in demo data or upload your own CSV/Excel files.</p>
              {onDatasetUploaded && (
                <div style={{ marginTop: 16 }}>
                  <FileUpload onDatasetUploaded={onDatasetUploaded} />
                </div>
              )}
              <p className="setup-hint">You can always upload more files later from the main view.</p>
            </div>
          )}

          {step === 3 && (
            <div className="setup-step-content">
              <h2>You're all set!</h2>
              <div className="setup-summary">
                <div className="setup-summary-row">
                  <span>AI Provider:</span>
                  <strong>{provider === 'mock' ? 'Mock AI' : provider === 'openai' ? 'OpenAI' : 'Anthropic'}</strong>
                </div>
                {provider !== 'mock' && model && (
                  <div className="setup-summary-row">
                    <span>Model:</span>
                    <strong>{model}</strong>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="setup-actions">
          {step > 0 && (
            <button className="setup-back-button" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={16} />
              Back
            </button>
          )}
          <button className="setup-skip-button" onClick={onSkip}>
            <SkipForward size={16} />
            Skip Setup
          </button>
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <button
              className="setup-next-button"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight size={16} />
            </button>
          ) : (
            <button className="setup-finish-button" onClick={handleComplete}>
              Start Using AI Dash
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
