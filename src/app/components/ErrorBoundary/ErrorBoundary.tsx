'use client';

import React from 'react';
import { Component, ReactNode } from 'react';
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
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { reloadFn } = this.props;
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
