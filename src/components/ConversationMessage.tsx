import React from 'react';
import { ConversationMessage as ConversationMessageType, ChartData } from '../types';
import { ResponseCard } from './ResponseCard';
import { User } from 'lucide-react';

interface ConversationMessageProps {
  message: ConversationMessageType;
  onFollowUp?: (query: string) => void;
  onPin?: (chart: ChartData, messageId: string) => void;
}

export const ConversationMessage: React.FC<ConversationMessageProps> = ({ message, onFollowUp, onPin }) => {
  return (
    <div className="conversation-message">
      {/* User Query */}
      <div className="user-query">
        <div className="query-header">
          <User size={18} />
          <span className="query-label">You asked:</span>
        </div>
        <div className="query-text">{message.userQuery}</div>
      </div>

      {/* AI Response */}
      <div className="ai-response">
        <ResponseCard response={message.response} onFollowUp={onFollowUp} onPin={onPin} />
      </div>
    </div>
  );
};
