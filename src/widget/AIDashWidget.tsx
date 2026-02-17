import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ConversationMessage as ConversationMessageType, ResponseMessage } from '../types';
import { ConversationMessage } from '../components/ConversationMessage';
import { QueryInput } from '../components/QueryInput';
import { processQueryAsync } from '../services/aiService';
import { saveRuntimeConfig } from '../config';
import { resetProvider } from '../services/aiService';
import { generateId } from '../utils/id';
import { WidgetConfig, defaultWidgetConfig } from './WidgetConfig';

interface AIDashWidgetProps {
  config?: WidgetConfig;
}

export const AIDashWidget: React.FC<AIDashWidgetProps> = ({ config: userConfig }) => {
  const config = { ...defaultWidgetConfig, ...userConfig };
  const [messages, setMessages] = useState<ConversationMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (config.llmProvider && config.llmProvider !== 'mock') {
      saveRuntimeConfig({
        llm: {
          provider: config.llmProvider,
          apiKey: config.apiKey,
          model: config.model,
        },
      });
      resetProvider();
    }
  }, [config.llmProvider, config.apiKey, config.model]);

  useEffect(() => {
    if (config.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (config.theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [config.theme]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = useCallback(async (query: string) => {
    setIsLoading(true);
    const lastMessage = messages[messages.length - 1];

    let response: ResponseMessage;
    try {
      response = await processQueryAsync(query, lastMessage?.response);
    } catch (error) {
      response = {
        id: generateId(),
        type: 'text',
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        explanation: 'An error occurred.',
        interpretation: { intent: 'Error', entities: [], dataSource: 'N/A', assumptions: [] },
        timestamp: new Date(),
      };
    }

    const newMessage: ConversationMessageType = {
      id: generateId(),
      userQuery: query,
      response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(false);
  }, [messages]);

  return (
    <div
      className="ai-dash-widget"
      style={{
        height: config.height,
        width: config.width,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg-card)',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {messages.map((msg) => (
          <ConversationMessage
            key={msg.id}
            message={msg}
            onFollowUp={handleSubmit}
          />
        ))}
        {isLoading && (
          <div className="thinking-indicator">
            <div className="thinking-dots">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
            <span className="thinking-text">Analyzing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ borderTop: '1px solid var(--color-border)', padding: '12px' }}>
        <QueryInput onSubmit={handleSubmit} disabled={isLoading} />
      </div>
    </div>
  );
};
