import React from 'react';
import { View } from '../types';
import { Home, Plus, X } from 'lucide-react';

interface TabBarProps {
  views: View[];
  activeViewId: string;
  onSelectView: (viewId: string) => void;
  onNewView: () => void;
  onCloseView: (viewId: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  views,
  activeViewId,
  onSelectView,
  onNewView,
  onCloseView,
}) => {
  const handleClose = (e: React.MouseEvent, view: View) => {
    e.stopPropagation();
    if (view.messages.length > 0) {
      if (!window.confirm(`Close "${view.name}"? Messages in this tab will be lost.`)) {
        return;
      }
    }
    onCloseView(view.id);
  };

  return (
    <div className="tab-bar" role="tablist" aria-label="Analysis views">
      <div className="tabs-container">
        {views.map((view) => (
          <div
            key={view.id}
            className={`tab ${view.id === activeViewId ? 'active' : ''}`}
            onClick={() => onSelectView(view.id)}
            role="tab"
            aria-selected={view.id === activeViewId}
            tabIndex={view.id === activeViewId ? 0 : -1}
          >
            {view.name === 'Home' && <Home size={16} />}
            <span className="tab-name">{view.name}</span>
            {view.name !== 'Home' && (
              <button
                className="close-tab-button"
                onClick={(e) => handleClose(e, view)}
                title="Close tab"
                aria-label={`Close ${view.name}`}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      <button className="new-tab-button" onClick={onNewView} title="New view">
        <Plus size={18} />
        New View
      </button>
    </div>
  );
};
