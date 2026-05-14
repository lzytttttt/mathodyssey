import Link from 'next/link';
import Card from '@/components/ui/Card';
import type { TimelineNode } from '@/types/timeline';
import { colors } from '@/styles/tokens';

interface NodeCardProps {
  node: TimelineNode;
}

const difficultyLabels: Record<string, string> = {
  L1: '入门',
  L2: '基础',
  L3: '中等',
  L4: '进阶',
  L5: '挑战',
};

export default function NodeCard({ node }: NodeCardProps) {
  return (
    <Link href={`/timeline/${node.id}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between mb-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: colors.era[node.era] }}
          >
            {node.timePeriod.display}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: colors.difficulty[node.difficulty] + '20',
              color: colors.difficulty[node.difficulty],
            }}
          >
            {difficultyLabels[node.difficulty]}
          </span>
        </div>
        <h3 className="font-semibold text-stone-800 mb-1">{node.title}</h3>
        {node.subtitle && (
          <p className="text-sm text-stone-500 mb-2">{node.subtitle}</p>
        )}
        <p className="text-sm text-stone-600 line-clamp-2">
          {node.historicalProblem}
        </p>
        <div className="flex flex-wrap gap-1 mt-3">
          {node.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>
    </Link>
  );
}
