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
    <div className="min-h-screen bg-stone-50">
      {/* Scene description */}
      <div className="bg-white border-b border-stone-200 p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-stone-700 text-base leading-relaxed">
            {experiment.scene.description}
          </p>
          <p className="mt-2 text-sm font-medium text-blue-700">
            目标：{experiment.scene.goal}
          </p>
        </div>
      </div>

      {/* Interactive canvas area */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {children}
        </div>
      </div>

      {/* Result panel */}
      {resultPanel && (
        <div className="max-w-4xl mx-auto px-4 pb-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            {resultPanel}
          </div>
        </div>
      )}

      {/* Guidance */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">探索引导</h3>
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
