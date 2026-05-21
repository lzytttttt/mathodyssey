'use client';

import { useState } from 'react';

interface GuidancePanelProps {
  hints: string[];
  discoveries: string[];
  completionCriteria: string;
}

export default function GuidancePanel({
  hints,
  discoveries,
  completionCriteria,
}: GuidancePanelProps) {
  const [showHints, setShowHints] = useState(false);
  const [showDiscoveries, setShowDiscoveries] = useState(false);

  return (
    <div className="space-y-4">
      {/* Hints */}
      <div className="rounded-xl border border-[var(--border-color)] overflow-hidden">
        <button
          onClick={() => setShowHints(!showHints)}
          className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <span className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-xs">
            💡
          </span>
          <span className="text-sm font-medium text-[var(--text-primary)] flex-1">
            提示
          </span>
          <span className="text-xs text-[var(--text-muted)] mr-1">{hints.length}</span>
          <svg
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${showHints ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showHints && (
          <div className="px-4 pb-4 pt-1 border-t border-[var(--border-light)]">
            <ul className="space-y-2">
              {hints.map((hint, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {hint}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Discoveries */}
      <div className="rounded-xl border border-[var(--border-color)] overflow-hidden">
        <button
          onClick={() => setShowDiscoveries(!showDiscoveries)}
          className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <span className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-xs">
            🔍
          </span>
          <span className="text-sm font-medium text-[var(--text-primary)] flex-1">
            你可以发现
          </span>
          <span className="text-xs text-[var(--text-muted)] mr-1">{discoveries.length}</span>
          <svg
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${showDiscoveries ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showDiscoveries && (
          <div className="px-4 pb-4 pt-1 border-t border-[var(--border-light)]">
            <ul className="space-y-2">
              {discoveries.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Completion criteria */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-200/50 dark:border-amber-500/10">
        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-sm">
          🏆
        </span>
        <div>
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-0.5">完成标准</p>
          <p className="text-sm text-[var(--text-secondary)]">{completionCriteria}</p>
        </div>
      </div>
    </div>
  );
}
