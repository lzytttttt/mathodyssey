'use client';

import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { colors } from '@/styles/tokens';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass' | 'glow';
  era?: string;
  /** Disable hover lift animation */
  noHover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', era, noHover = false, style, ...props }, ref) => {
    const eraColor = era ? colors.era[era] : undefined;

    return (
      <motion.div
        ref={ref}
        whileHover={noHover ? undefined : { y: -2, transition: { duration: 0.2 } }}
        className={clsx(
          'rounded-xl transition-shadow duration-300',
          {
            'bg-white dark:bg-white/[0.04] border border-stone-200 dark:border-white/[0.08] shadow-sm':
              variant === 'default',
            'border border-stone-200 dark:border-white/[0.08]':
              variant === 'bordered',
            'shadow-md bg-white dark:bg-white/[0.04]': variant === 'elevated',
            'backdrop-blur-xl bg-white/80 dark:bg-white/[0.05] border border-white/20 dark:border-white/[0.08] shadow-lg':
              variant === 'glass',
            'bg-white dark:bg-white/[0.04] border border-stone-200/50 dark:border-white/[0.06] shadow-lg shadow-indigo-500/[0.06]':
              variant === 'glow',
          },
          className
        )}
        style={{
          ...(eraColor ? { borderLeft: `3px solid ${eraColor}` } : {}),
          ...(style || {}),
        }}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export default Card;
