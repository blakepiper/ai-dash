import React from 'react';
import { DataStory as DataStoryType } from '../types';
import { ChartRenderer } from './ChartRenderer';
import { format } from 'date-fns';
import { FileText, X } from 'lucide-react';

interface DataStoryProps {
  story: DataStoryType;
  onClose: () => void;
}

export const DataStoryView: React.FC<DataStoryProps> = ({ story, onClose }) => {
  return (
    <div className="data-story-overlay">
      <div className="data-story">
        <div className="data-story-header">
          <div className="data-story-header-left">
            <FileText size={20} />
            <h2>{story.title}</h2>
          </div>
          <button className="data-story-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="data-story-meta">
          Generated {format(story.generatedAt, 'MMM d, yyyy h:mm a')}
        </p>

        <div className="data-story-content">
          {story.sections.map((section, i) => {
            switch (section.type) {
              case 'heading':
                return <h3 key={i} className="data-story-heading">{section.content}</h3>;
              case 'text':
                return <p key={i} className="data-story-text">{section.content}</p>;
              case 'chart':
                return section.chart ? (
                  <div key={i} className="data-story-chart">
                    <ChartRenderer chart={section.chart} />
                  </div>
                ) : null;
              case 'insight':
                return (
                  <div key={i} className="data-story-insight">
                    <strong>Insight:</strong> {section.content}
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};
