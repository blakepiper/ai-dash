import React, { useState, useRef } from 'react';
import { ChartRenderer } from './ChartRenderer';
import { ResponseMessage } from '../types';
import { Download, Image, Info, Copy, Check, Sparkles, Pin } from 'lucide-react';
import html2canvas from 'html2canvas';
import { ChartData } from '../types';

interface ResponseCardProps {
  response: ResponseMessage;
  onFollowUp?: (query: string) => void;
  onPin?: (chart: ChartData, messageId: string) => void;
}

export const ResponseCard: React.FC<ResponseCardProps> = ({ response, onFollowUp, onPin }) => {
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [copied, setCopied] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = `chart-${response.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadCSV = () => {
    if (!response.chart || response.chart.data.length === 0) return;

    const data = response.chart.data;
    const keys = Object.keys(data[0]);

    const escapeCSV = (value: unknown): string => {
      const str = String(value ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csv = [
      keys.map(escapeCSV).join(','),
      ...data.map(row => keys.map(key => escapeCSV(row[key])).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `data-${response.id}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    const textToCopy = response.text || response.explanation;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="response-card">
      {/* Chart Section */}
      {response.chart && (
        <div ref={chartRef} className="response-chart">
          <ChartRenderer chart={response.chart} />
        </div>
      )}

      {/* Text Response Section */}
      {response.text && (
        <div className="response-text">
          <p style={{ whiteSpace: 'pre-line' }}>{response.text}</p>
        </div>
      )}

      {/* Explanation Section */}
      <div className="response-explanation">
        <div className="explanation-header">
          <Info size={16} />
          <strong>Insights</strong>
        </div>
        <p>{response.explanation}</p>
      </div>

      {/* Action Buttons */}
      <div className="response-actions">
        <button
          className="action-button"
          onClick={() => setShowInterpretation(!showInterpretation)}
          title="Show how AI interpreted this query"
        >
          <Info size={16} />
          {showInterpretation ? 'Hide Details' : 'Show Details'}
        </button>

        {response.chart && (
          <>
            <button
              className="action-button"
              onClick={handleDownloadImage}
              title="Download chart as image"
            >
              <Image size={16} />
              Download Chart
            </button>
            <button
              className="action-button"
              onClick={handleDownloadCSV}
              title="Export data as CSV"
            >
              <Download size={16} />
              Export CSV
            </button>
            {onPin && (
              <button
                className="action-button"
                onClick={() => onPin(response.chart!, response.id)}
                title="Pin chart to side panel"
              >
                <Pin size={16} />
                Pin Chart
              </button>
            )}
          </>
        )}

        <button
          className="action-button"
          onClick={handleCopyText}
          title="Copy explanation text"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Text'}
        </button>
      </div>

      {/* Follow-Up Suggestions */}
      {response.followUpSuggestions && response.followUpSuggestions.length > 0 && onFollowUp && (
        <div className="follow-up-suggestions">
          <div className="follow-up-label">
            <Sparkles size={14} />
            <span>Follow up</span>
          </div>
          <div className="follow-up-chips">
            {response.followUpSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="follow-up-chip"
                onClick={() => onFollowUp(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interpretation Details */}
      {showInterpretation && (
        <div className="interpretation-panel">
          <div className="interpretation-section">
            <h4>Query Interpretation</h4>
            <p>{response.interpretation.intent}</p>
          </div>

          <div className="interpretation-section">
            <h4>Entities Identified</h4>
            <div className="entity-tags">
              {response.interpretation.entities.map((entity, idx) => (
                <span key={idx} className="entity-tag">
                  {entity}
                </span>
              ))}
            </div>
          </div>

          <div className="interpretation-section">
            <h4>Data Source</h4>
            <code>{response.interpretation.dataSource}</code>
          </div>

          <div className="interpretation-section">
            <h4>Assumptions Made</h4>
            <ul>
              {response.interpretation.assumptions.map((assumption, idx) => (
                <li key={idx}>{assumption}</li>
              ))}
            </ul>
          </div>

          {response.chart && (
            <div className="interpretation-section">
              <h4>Chart Configuration</h4>
              <pre className="code-block">
                {JSON.stringify(
                  {
                    type: response.chart.type,
                    xAxis: response.chart.xKey,
                    yAxis: response.chart.yKey,
                    dataPoints: response.chart.data.length,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
