import React, { useState, useRef, useEffect } from 'react';
import { ChatSession } from '../types';
import { MessageSquare, Plus, Clock, Trash2, Menu, X, Pencil } from 'lucide-react';
import { format } from 'date-fns';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onRenameSession: (sessionId: string, newName: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onRenameSession,
  onDeleteSession,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startRename = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditValue(session.name);
  };

  const commitRename = () => {
    if (editingId) {
      onRenameSession(editingId, editValue);
      setEditingId(null);
    }
  };

  const cancelRename = () => {
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this chat session? This cannot be undone.')) {
      onDeleteSession(sessionId);
    }
  };

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}
      >
        {collapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      <nav className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`} aria-label="Chat sessions">
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
            <div className="sessions-list" role="listbox" aria-label="Chat sessions">
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
                    onClick={() => {
                      if (editingId !== session.id) onSelectSession(session.id);
                    }}
                    role="option"
                    aria-selected={session.id === currentSessionId}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (editingId) return;
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectSession(session.id);
                      }
                    }}
                  >
                    <div className="session-info">
                      <MessageSquare size={16} />
                      {editingId === session.id ? (
                        <input
                          ref={inputRef}
                          className="session-rename-input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={commitRename}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              commitRename();
                            } else if (e.key === 'Escape') {
                              cancelRename();
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Rename session"
                        />
                      ) : (
                        <span
                          className="session-name"
                          onDoubleClick={(e) => startRename(e, session)}
                        >
                          {session.name}
                        </span>
                      )}
                    </div>
                    <div className="session-meta">
                      <Clock size={12} />
                      <span className="session-time">
                        {format(new Date(session.lastAccessed), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <div className="session-actions">
                      <button
                        className="rename-session-button"
                        onClick={(e) => startRename(e, session)}
                        title="Rename chat"
                        aria-label={`Rename ${session.name}`}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="delete-session-button"
                        onClick={(e) => handleDelete(e, session.id)}
                        title="Delete chat"
                        aria-label={`Delete ${session.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
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
      </nav>
    </>
  );
};
