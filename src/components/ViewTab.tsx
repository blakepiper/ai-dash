import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { View, UploadedDataset, ChartData, PinnedChart } from '../types';
import { ConversationMessage } from './ConversationMessage';
import { QueryInput } from './QueryInput';
import { FileUpload } from './FileUpload';
import { PinnedPanel } from './PinnedPanel';
import { BarChart3 } from 'lucide-react';
import { generateId } from '../utils/id';

interface ViewTabProps {
  view: View;
  onSubmitQuery: (query: string) => Promise<void> | void;
  isHome?: boolean;
  onDatasetUploaded?: (dataset: UploadedDataset) => void;
  onPinnedChartsChange?: (viewId: string, pinnedCharts: PinnedChart[]) => void;
}

export const ViewTab: React.FC<ViewTabProps> = ({ view, onSubmitQuery, isHome, onDatasetUploaded, onPinnedChartsChange }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPinned, setShowPinned] = useState(true);

  const pinnedCharts = useMemo(() => view.pinnedCharts || [], [view.pinnedCharts]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [view.messages]);

  const handleSubmit = async (query: string) => {
    setIsLoading(true);
    try {
      await onSubmitQuery(query);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePin = useCallback((chart: ChartData, messageId: string) => {
    const newPinned: PinnedChart = {
      id: generateId(),
      chart,
      pinnedAt: new Date(),
      sourceMessageId: messageId,
    };
    onPinnedChartsChange?.(view.id, [...pinnedCharts, newPinned]);
  }, [view.id, pinnedCharts, onPinnedChartsChange]);

  const handleUnpin = useCallback((id: string) => {
    onPinnedChartsChange?.(view.id, pinnedCharts.filter((p) => p.id !== id));
  }, [view.id, pinnedCharts, onPinnedChartsChange]);

  const hasPinned = pinnedCharts.length > 0 && showPinned;

  return (
    <div className={`view-tab ${hasPinned ? 'view-tab-split' : ''}`}>
      <div className="view-tab-main">
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
              {onDatasetUploaded && (
                <div style={{ marginTop: 24, width: '100%', maxWidth: 480 }}>
                  <FileUpload onDatasetUploaded={onDatasetUploaded} />
                </div>
              )}
            </div>
          ) : (
            <div className="messages-container">
              {view.messages.map((message) => (
                <ConversationMessage
                  key={message.id}
                  message={message}
                  onFollowUp={handleSubmit}
                  onPin={onPinnedChartsChange ? handlePin : undefined}
                />
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

      {hasPinned && (
        <PinnedPanel
          pinnedCharts={pinnedCharts}
          onUnpin={handleUnpin}
          onClose={() => setShowPinned(false)}
        />
      )}
    </div>
  );
};
