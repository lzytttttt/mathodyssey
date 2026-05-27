'use client';

import type { ComponentType } from 'react';
import type { Experiment } from '@/types/timeline';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

interface ExperimentWrapperProps {
  Component: ComponentType<{ experiment: Experiment }>;
  experiment: Experiment;
}

function ExperimentFallback() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="glass rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          实验加载出错
        </h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          互动实验组件发生了错误，请刷新页面重试
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm rounded-lg bg-[var(--accent-primary)] text-white hover:opacity-90 transition-opacity"
        >
          刷新页面
        </button>
      </div>
    </div>
  );
}

export default function ExperimentWrapper({
  Component,
  experiment,
}: ExperimentWrapperProps) {
  return (
    <ErrorBoundary fallback={<ExperimentFallback />}>
      <Component experiment={experiment} />
    </ErrorBoundary>
  );
}
