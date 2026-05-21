'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import type { TimelineNode } from '@/types/timeline';
import { colors } from '@/styles/tokens';
import { motion } from 'framer-motion';

interface NodeCardProps {
  node: TimelineNode;
  index?: number;
}

const difficultyLabels: Record<string, string> = {
  L1: '入门',
  L2: '基础',
  L3: '中等',
  L4: '进阶',
  L5: '挑战',
};

export default function NodeCard({ node, index = 0 }: NodeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Link href={`/timeline/${node.id}`}>
        <Card
          variant="glass"
          era={node.era}
          className="p-5 cursor-pointer h-full hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <span
              className="text-xs px-2.5 py-1 rounded-full text-white font-medium"
              style={{
                background: `linear-gradient(135deg, ${colors.era[node.era]}, ${colors.era[node.era]}cc)`,
              }}
            >
              {node.timePeriod.display}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: colors.difficulty[node.difficulty] + '15',
                color: colors.difficulty[node.difficulty],
              }}
            >
              {difficultyLabels[node.difficulty]}
            </span>
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] mb-1.5 text-base">
            {node.title}
          </h3>
          {node.subtitle && (
            <p className="text-sm text-[var(--text-muted)] mb-2">{node.subtitle}</p>
          )}
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {node.historicalProblem}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {node.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[var(--bg-secondary)] text-[var(--text-muted)] px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
