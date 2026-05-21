'use client';

import { colors, gradients, eraIcons } from '@/styles/tokens';
import { motion } from 'framer-motion';

interface NodeHeroProps {
  title: string;
  subtitle?: string;
  era: string;
  eraName: string;
  timePeriodDisplay: string;
  difficulty: string;
  difficultyLabel: string;
  historicalProblem: string;
  estimatedMinutes?: number;
}

export default function NodeHero({
  title,
  subtitle,
  era,
  eraName,
  timePeriodDisplay,
  difficulty,
  difficultyLabel,
  historicalProblem,
  estimatedMinutes,
}: NodeHeroProps) {
  const eraColor = colors.era[era] || '#6b7280';
  const eraGradient = gradients[era] || [eraColor, eraColor];
  const eraIcon = eraIcons[era] || '📐';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${eraGradient[0]}15 0%, ${eraGradient[1]}08 50%, transparent 100%)`,
      }}
    >
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${eraColor} 1px, transparent 1px),
                           radial-gradient(circle at 80% 20%, ${eraColor} 1px, transparent 1px)`,
          backgroundSize: '60px 60px, 80px 80px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 py-10 md:py-14">
        {/* Meta badges row */}
        <motion.div
          className="flex flex-wrap items-center gap-3 mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Era badge */}
          <span
            className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full text-white font-medium"
            style={{
              background: `linear-gradient(135deg, ${eraGradient[0]}, ${eraGradient[1]})`,
            }}
          >
            <span>{eraIcon}</span>
            <span>{eraName}</span>
          </span>

          {/* Time period */}
          <span className="text-sm text-stone-500 dark:text-stone-400">
            {timePeriodDisplay}
          </span>

          {/* Difficulty badge */}
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              backgroundColor: colors.difficulty[difficulty] + '15',
              color: colors.difficulty[difficulty],
            }}
          >
            {difficultyLabel}
          </span>

          {/* Estimated time */}
          {estimatedMinutes && (
            <span className="text-xs text-stone-400 dark:text-stone-500">
              ⏱ 约 {estimatedMinutes} 分钟
            </span>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            className="text-lg text-stone-500 dark:text-stone-400 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Historical problem quote */}
        <motion.blockquote
          className="relative pl-5 py-3 my-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Gradient left border */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
            style={{
              background: `linear-gradient(180deg, ${eraGradient[0]}, ${eraGradient[1]})`,
            }}
          />
          <p className="text-lg md:text-xl text-stone-700 dark:text-stone-300 italic leading-relaxed">
            &ldquo;{historicalProblem}&rdquo;
          </p>
        </motion.blockquote>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-stone-50 dark:from-[#0a0a1a] to-transparent" />
    </div>
  );
}
