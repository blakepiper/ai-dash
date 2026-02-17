import React from 'react';
import { ChartRenderer } from './ChartRenderer';
import { PinnedChart } from '../types';
import { PinOff, X } from 'lucide-react';

interface PinnedPanelProps {
  pinnedCharts: PinnedChart[];
  onUnpin: (id: string) => void;
  onClose: () => void;
}

export const PinnedPanel: React.FC<PinnedPanelProps> = ({ pinnedCharts, onUnpin, onClose }) => {
  if (pinnedCharts.length === 0) return null;

  return (
    <div className="pinned-panel">
      <div className="pinned-panel-header">
        <h3>Pinned Charts</h3>
        <button className="pinned-panel-close" onClick={onClose} title="Close panel">
          <X size={16} />
        </button>
      </div>
      <div className="pinned-panel-content">
        {pinnedCharts.map((pinned) => (
          <div key={pinned.id} className="pinned-chart-card">
            <ChartRenderer chart={pinned.chart} />
            <button
              className="unpin-button"
              onClick={() => onUnpin(pinned.id)}
              title="Unpin chart"
            >
              <PinOff size={14} />
              Unpin
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
