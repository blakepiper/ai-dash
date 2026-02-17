import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { UploadedDataset } from '../types';
import { parseFile } from '../utils/fileParsing';

interface FileUploadProps {
  onDatasetUploaded: (dataset: UploadedDataset) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDatasetUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setSuccess(null);
    setIsProcessing(true);

    try {
      const dataset = await parseFile(file);
      onDatasetUploaded(dataset);
      setSuccess(`Uploaded "${dataset.name}" (${dataset.rows.length} rows, ${dataset.columns.length} columns)`);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setIsProcessing(false);
    }
  }, [onDatasetUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = '';
  }, [handleFile]);

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-zone ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload data file"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        {isProcessing ? (
          <>
            <FileSpreadsheet size={32} />
            <p className="file-upload-text">Processing file...</p>
          </>
        ) : (
          <>
            <Upload size={32} />
            <p className="file-upload-text">
              Drop a CSV or Excel file here, or click to browse
            </p>
            <p className="file-upload-hint">.csv, .xlsx, .xls supported</p>
          </>
        )}
      </div>

      {error && (
        <div className="file-upload-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="file-upload-success">
          <CheckCircle size={14} />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};
