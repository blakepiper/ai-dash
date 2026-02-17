import React, { useState, KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { exampleQueries } from '../services/aiService';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  disabled?: boolean;
}

export const QueryInput: React.FC<QueryInputProps> = ({ onSubmit, disabled }) => {
  const [query, setQuery] = useState('');
  const [showExamples, setShowExamples] = useState(true);

  const handleSubmit = () => {
    if (query.trim() && !disabled) {
      onSubmit(query.trim());
      setQuery('');
      setShowExamples(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleExampleClick = (example: string) => {
    onSubmit(example);
    setShowExamples(false);
  };

  return (
    <div className="query-input-container">
      {showExamples && (
        <div className="example-queries">
          <div className="examples-header">
            <Sparkles size={16} />
            <span>Try asking...</span>
          </div>
          <div className="examples-grid">
            {exampleQueries.map((example, idx) => (
              <button
                key={idx}
                className="example-button"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="input-box">
        <textarea
          className="query-textarea"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question or request a visualization..."
          disabled={disabled}
          rows={1}
          aria-label="Query input"
        />
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={!query.trim() || disabled}
          title="Send query"
          aria-label="Send query"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
