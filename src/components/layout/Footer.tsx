'use client';

import { useProgress } from '@/hooks/useProgress';

export default function Footer() {
  const { visitedNodes } = useProgress();

  return (
    <footer className="border-t border-[var(--border-color)] py-10 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3">
          <p className="text-base font-medium gradient-text inline-block">
            MathOdyssey — 让数学成为一场发现之旅
          </p>
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
            数学不是需要记忆的公式，而是人类在解决真实问题过程中逐步发明的思维工具。
          </p>
          {visitedNodes.length > 0 && (
            <p className="text-xs text-[var(--text-muted)]">
              📊 已探索 {visitedNodes.length}/12 个节点
            </p>
          )}
          <p className="text-xs text-[var(--text-muted)] pt-2">
            &copy; 2026 lzytttttt. Licensed under the{' '}
            <a
              href="https://www.apache.org/licenses/LICENSE-2.0"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--accent-primary)] transition-colors"
            >
              Apache License 2.0
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
