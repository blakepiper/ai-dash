import React, { useState } from 'react';
import { ViewContext, UploadedDataset } from '../types';
import { FileUpload } from './FileUpload';
import { ChevronDown, ChevronUp, Paperclip, X } from 'lucide-react';

interface ContextAttachmentProps {
  context?: ViewContext;
  onContextChange: (context: ViewContext | undefined) => void;
}

export const ContextAttachment: React.FC<ContextAttachmentProps> = ({ context, onContextChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTextChange = (text: string) => {
    if (!text.trim() && (!context?.files || context.files.length === 0)) {
      onContextChange(undefined);
    } else {
      onContextChange({ ...context, text: text || undefined });
    }
  };

  const handleFileAdded = (dataset: UploadedDataset) => {
    const files = [...(context?.files || []), dataset];
    onContextChange({ ...context, files });
  };

  const handleRemoveFile = (id: string) => {
    const files = (context?.files || []).filter((f) => f.id !== id);
    if (files.length === 0 && !context?.text) {
      onContextChange(undefined);
    } else {
      onContextChange({ ...context, files: files.length > 0 ? files : undefined });
    }
  };

  const hasContext = !!(context?.text || (context?.files && context.files.length > 0));

  return (
    <div className="context-attachment">
      <button
        className="context-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Paperclip size={14} />
        <span>Context {hasContext ? '(active)' : ''}</span>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isExpanded && (
        <div className="context-panel">
          <textarea
            className="context-textarea"
            placeholder="Add context for this conversation (e.g., 'Focus on Q4 metrics only')"
            value={context?.text || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={3}
          />
          <div className="context-files">
            {context?.files?.map((file) => (
              <div key={file.id} className="context-file-tag">
                <span>{file.name}</span>
                <button onClick={() => handleRemoveFile(file.id)} title="Remove">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <FileUpload onDatasetUploaded={handleFileAdded} />
        </div>
      )}
    </div>
  );
};
