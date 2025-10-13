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
  return (
    <div className="tab-bar">
      <div className="tabs-container">
        {views.map((view) => (
          <div
            key={view.id}
            className={`tab ${view.id === activeViewId ? 'active' : ''}`}
            onClick={() => onSelectView(view.id)}
          >
            {view.name === 'Home' && <Home size={16} />}
            <span className="tab-name">{view.name}</span>
            {view.name !== 'Home' && (
              <button
                className="close-tab-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseView(view.id);
                }}
                title="Close tab"
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
