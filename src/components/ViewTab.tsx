import React, { useRef, useEffect, useState } from 'react';
import { View } from '../types';
import { ConversationMessage } from './ConversationMessage';
import { QueryInput } from './QueryInput';
import { BarChart3 } from 'lucide-react';

interface ViewTabProps {
  view: View;
  onSubmitQuery: (query: string) => void;
  isHome?: boolean;
}

export const ViewTab: React.FC<ViewTabProps> = ({ view, onSubmitQuery, isHome }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [view.messages]);

  const handleSubmit = (query: string) => {
    setIsLoading(true);
    // Simulate brief processing delay for UX
    setTimeout(() => {
      onSubmitQuery(query);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="view-tab">
      <div className="view-content">
        {view.messages.length === 0 && !isLoading ? (
          <div className="empty-view">
            <BarChart3 size={48} />
            <h2>{isHome ? 'Welcome to AI Dash' : view.name}</h2>
            <p>
              {isHome
                ? 'Ask questions about your data in natural language. I can show you visualizations or answer questions directly.'
                : 'Start asking questions to build your custom dashboard view.'}
            </p>
          </div>
        ) : (
          <div className="messages-container">
            {view.messages.map((message) => (
              <ConversationMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="thinking-indicator">
                <div className="thinking-dots">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
                <span className="thinking-text">Analyzing your query...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="view-input">
        <QueryInput onSubmit={handleSubmit} disabled={isLoading} />
      </div>
    </div>
  );
};
