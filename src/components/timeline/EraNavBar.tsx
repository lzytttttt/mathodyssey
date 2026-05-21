'use client';

import { motion } from 'framer-motion';
import { eras } from '@/lib/data/eras';
import { colors, eraIcons } from '@/styles/tokens';

interface EraNavBarProps {
  activeEra?: string;
  onEraClick?: (eraId: string) => void;
}

function formatYear(year: number): string {
  if (year < 0) return `前${-year}`;
  return `${year}`;
}

export default function EraNavBar({ activeEra, onEraClick }: EraNavBarProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-3 px-4">
      <motion.div
        className="flex gap-2 min-w-max"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {eras.map((era) => {
          const isActive = activeEra === era.id;
          const eraColor = colors.era[era.id] || '#6b7280';
          const icon = eraIcons[era.id] || '📐';

          return (
            <motion.button
              key={era.id}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
              }}
              onClick={() => onEraClick?.(era.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                backgroundColor: isActive ? eraColor : `${eraColor}15`,
                color: isActive ? '#ffffff' : eraColor,
                border: `1px solid ${eraColor}${isActive ? '' : '30'}`,
                boxShadow: isActive
                  ? `0 2px 8px ${eraColor}40`
                  : 'none',
              }}
            >
              <span>{icon}</span>
              <span>{era.name}</span>
              <span className="opacity-60">
                {formatYear(era.startYear)}-{formatYear(era.endYear)}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
