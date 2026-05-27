'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            组件加载出错
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            {this.state.error?.message || '发生了未知错误'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 text-sm rounded-lg bg-[var(--accent-primary)] text-white hover:opacity-90 transition-opacity"
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
