import React, { Component } from 'react';
import type { ReactNode } from 'react';
import s from './ErrorBoundary.module.scss';

interface ErrorBoundaryProps {
  children: ReactNode;
  reloadFn?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    const { reloadFn } = this.props;

    if (this.state.hasError) {
      return (
        <div className={s.errorBoundary}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Error:</summary>
            {this.state.error?.message}
          </details>
          <button
            onClick={() => (reloadFn ? reloadFn() : window.location.reload())}
            className={s.reloadButton}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
