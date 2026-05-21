import Card from '@/components/ui/Card';
import type { LearningObjective } from '@/types/timeline';

interface ObjectiveCardProps {
  objectives: LearningObjective[];
}

const levelLabels: Record<string, string> = {
  remember: '记忆',
  understand: '理解',
  apply: '应用',
  analyze: '分析',
  create: '创造',
};

const levelColors: Record<string, string> = {
  remember: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  understand: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  apply: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  analyze: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  create: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

export default function ObjectiveCard({ objectives }: ObjectiveCardProps) {
  return (
    <Card variant="glass" className="p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">🎯 学习目标</h3>
      <ul className="space-y-3">
        {objectives.map((obj, index) => (
          <li key={index} className="flex items-start gap-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${levelColors[obj.level] || ''}`}
            >
              {levelLabels[obj.level]}
            </span>
            <span className="text-[var(--text-secondary)]">{obj.description}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
