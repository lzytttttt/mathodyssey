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
      <div>
        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          <span>{showHints ? '▼' : '▶'}</span>
          提示 ({hints.length})
        </button>
        {showHints && (
          <ul className="mt-2 space-y-1 pl-6">
            {hints.map((hint, i) => (
              <li
                key={i}
                className="text-sm text-stone-600 list-disc"
              >
                {hint}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Discoveries */}
      <div>
        <button
          onClick={() => setShowDiscoveries(!showDiscoveries)}
          className="flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
        >
          <span>{showDiscoveries ? '▼' : '▶'}</span>
          你可以发现 ({discoveries.length})
        </button>
        {showDiscoveries && (
          <ul className="mt-2 space-y-1 pl-6">
            {discoveries.map((d, i) => (
              <li
                key={i}
                className="text-sm text-stone-600 list-disc"
              >
                {d}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Completion criteria */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs font-medium text-amber-700 mb-1">完成标准</p>
        <p className="text-sm text-amber-800">{completionCriteria}</p>
      </div>
    </div>
  );
}
