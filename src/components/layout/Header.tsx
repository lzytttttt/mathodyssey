'use client';

import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import ProgressBar from '@/components/ui/ProgressBar';

export default function Header() {
  const { theme, toggleTheme, visitedNodes } = useProgress();
  const progressPercent = visitedNodes.length > 0
    ? Math.round((visitedNodes.length / 12) * 100)
    : 0;

  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold gradient-text">MathOdyssey</span>
            <span className="text-sm text-[var(--text-muted)] hidden sm:inline">
              数学的发现之旅
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm"
            >
              时间轴
            </Link>
            <Link
              href="/about"
              className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm"
            >
              关于
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
              aria-label="切换主题"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </div>
      {/* Progress bar */}
      {progressPercent > 0 && (
        <div className="px-4">
          <ProgressBar value={progressPercent} size="xs" />
        </div>
      )}
    </header>
  );
}
