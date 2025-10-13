import React from 'react';
import { ChatSession } from '../types';
import { MessageSquare, Plus, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>AI Dash</h2>
        <button className="new-session-button" onClick={onNewSession} title="New session">
          <Plus size={18} />
          New Chat
        </button>
      </div>

      <div className="sidebar-content">
        <div className="sessions-section">
          <h3 className="section-title">Chat History</h3>
          <div className="sessions-list">
            {sessions.length === 0 ? (
              <div className="empty-state">
                <MessageSquare size={32} />
                <p>No chat history yet</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`session-item ${
                    session.id === currentSessionId ? 'active' : ''
                  }`}
                  onClick={() => onSelectSession(session.id)}
                >
                  <div className="session-info">
                    <MessageSquare size={16} />
                    <span className="session-name">{session.name}</span>
                  </div>
                  <div className="session-meta">
                    <Clock size={12} />
                    <span className="session-time">
                      {format(new Date(session.lastAccessed), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="footer-info">
          <p className="footer-note">
            This is a UX prototype demonstrating AI-powered analytics interaction patterns.
          </p>
        </div>
      </div>
    </div>
  );
};
