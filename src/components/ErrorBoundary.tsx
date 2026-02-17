import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
          <h3>Something went wrong</h3>
          <p style={{ marginTop: 8 }}>{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: 12,
              padding: '8px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: 6,
              cursor: 'pointer',
              backgroundColor: '#f5f5f5',
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
