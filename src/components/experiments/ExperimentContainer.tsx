'use client';

import type { ReactNode } from 'react';
import type { Experiment } from '@/types/timeline';
import GuidancePanel from './GuidancePanel';

interface ExperimentContainerProps {
  experiment: Experiment;
  nodeTitle?: string;
  children: ReactNode;
  resultPanel?: ReactNode;
}

/**
 * Unified layout for all interactive experiments.
 * Renders: scene description → interactive canvas → result panel → guidance.
 */
export default function ExperimentContainer({
  experiment,
  children,
  resultPanel,
}: ExperimentContainerProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Scene description */}
      <div className="border-b border-[var(--border-color)] p-6 bg-[var(--bg-card)]">
        <div className="max-w-5xl mx-auto flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center text-lg">
            📖
          </div>
          <div>
            <p className="text-[var(--text-primary)] text-base leading-relaxed">
              {experiment.scene.description}
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--accent-primary)]">
              🎯 目标：{experiment.scene.goal}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive canvas area */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="rounded-xl border border-[var(--border-color)] overflow-hidden bg-[var(--bg-card)] shadow-sm">
          {children}
        </div>
      </div>

      {/* Result panel */}
      {resultPanel && (
        <div className="max-w-5xl mx-auto px-4 pb-6">
          <div className="rounded-xl border border-[var(--border-color)] p-6 bg-[var(--bg-card)] shadow-sm">
            {resultPanel}
          </div>
        </div>
      )}

      {/* Guidance */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="rounded-xl border border-[var(--border-color)] p-6 bg-[var(--bg-card)] shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center text-sm">
              💡
            </span>
            探索引导
          </h3>
          <GuidancePanel
            hints={experiment.guidance.hints}
            discoveries={experiment.guidance.discoveries}
            completionCriteria={experiment.guidance.completionCriteria}
          />
        </div>
      </div>
    </div>
  );
}
