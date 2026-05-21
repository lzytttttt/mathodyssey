'use client';

import { clsx } from 'clsx';
import { HTMLAttributes, forwardRef } from 'react';

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress value 0-100 */
  value: number;
  /** Optional segments to show individual node progress */
  segments?: { id: string; completed: boolean }[];
  /** Size variant */
  size?: 'xs' | 'sm' | 'md';
  /** Whether to show the percentage label */
  showLabel?: boolean;
  /** Whether to animate the bar on mount */
  animated?: boolean;
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value,
      segments,
      size = 'sm',
      showLabel = false,
      animated = true,
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.max(0, Math.min(100, value));

    const sizeClasses = {
      xs: 'h-1',
      sm: 'h-2',
      md: 'h-3',
    };

    // Segmented progress bar
    if (segments && segments.length > 0) {
      return (
        <div ref={ref} className={clsx('flex gap-0.5', className)} {...props}>
          {segments.map((segment) => (
            <div
              key={segment.id}
              className={clsx(
                'flex-1 rounded-full transition-all duration-500',
                sizeClasses[size],
                segment.completed
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : 'bg-stone-200 dark:bg-white/10'
              )}
              style={{
                boxShadow: segment.completed
                  ? '0 0 8px rgba(52, 211, 153, 0.3)'
                  : 'none',
              }}
            />
          ))}
        </div>
      );
    }

    // Continuous progress bar
    return (
      <div
        ref={ref}
        className={clsx(
          'relative w-full overflow-hidden rounded-full',
          'bg-stone-200 dark:bg-white/10',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <div
          className={clsx(
            'h-full rounded-full',
            'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500',
            animated && 'transition-all duration-700 ease-out'
          )}
          style={{
            width: `${clampedValue}%`,
            boxShadow:
              clampedValue > 0
                ? '0 0 12px rgba(99, 102, 241, 0.4)'
                : 'none',
          }}
        >
          {/* Shimmer effect */}
          {clampedValue > 0 && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                animation: 'shimmer 2s infinite',
                width: `${clampedValue}%`,
              }}
            />
          )}
        </div>
        {showLabel && clampedValue > 0 && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white mix-blend-difference">
            {clampedValue}%
          </span>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
