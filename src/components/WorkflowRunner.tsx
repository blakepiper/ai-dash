import React, { useState, useCallback } from 'react';
import { Workflow } from '../types';
import { Play, Square, CheckCircle, Clock, Loader } from 'lucide-react';

interface WorkflowRunnerProps {
  workflow: Workflow;
  onRunQuery: (query: string) => Promise<void>;
  onClose: () => void;
}

export const WorkflowRunner: React.FC<WorkflowRunnerProps> = ({ workflow, onRunQuery, onClose }) => {
  const [running, setRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [completedCount, setCompletedCount] = useState(0);
  const [cancelled, setCancelled] = useState(false);

  const runWorkflow = useCallback(async () => {
    setRunning(true);
    setCancelled(false);
    setCompletedCount(0);

    for (let i = 0; i < workflow.queries.length; i++) {
      if (cancelled) break;
      setCurrentIndex(i);
      try {
        await onRunQuery(workflow.queries[i]);
      } catch {
        // Continue on error
      }
      setCompletedCount(i + 1);
    }

    setRunning(false);
    setCurrentIndex(-1);
  }, [workflow.queries, onRunQuery, cancelled]);

  const handleCancel = () => {
    setCancelled(true);
    setRunning(false);
  };

  return (
    <div className="workflow-runner">
      <div className="workflow-runner-header">
        <h4>{workflow.name}</h4>
        <button className="workflow-close" onClick={onClose}>&times;</button>
      </div>

      <div className="workflow-queries">
        {workflow.queries.map((query, i) => (
          <div
            key={i}
            className={`workflow-query ${i === currentIndex ? 'active' : ''} ${i < completedCount ? 'completed' : ''}`}
          >
            <span className="workflow-query-icon">
              {i < completedCount ? <CheckCircle size={14} /> :
               i === currentIndex ? <Loader size={14} className="spinning" /> :
               <Clock size={14} />}
            </span>
            <span className="workflow-query-text">{query}</span>
          </div>
        ))}
      </div>

      <div className="workflow-runner-actions">
        {!running ? (
          <button className="workflow-run-button" onClick={runWorkflow}>
            <Play size={14} />
            {completedCount > 0 ? 'Run Again' : 'Run Workflow'}
          </button>
        ) : (
          <button className="workflow-cancel-button" onClick={handleCancel}>
            <Square size={14} />
            Stop
          </button>
        )}
        <span className="workflow-progress">
          {completedCount}/{workflow.queries.length} queries
        </span>
      </div>
    </div>
  );
};
