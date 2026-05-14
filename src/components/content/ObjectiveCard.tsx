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
  remember: 'bg-green-100 text-green-700',
  understand: 'bg-blue-100 text-blue-700',
  apply: 'bg-yellow-100 text-yellow-700',
  analyze: 'bg-orange-100 text-orange-700',
  create: 'bg-red-100 text-red-700',
};

export default function ObjectiveCard({ objectives }: ObjectiveCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">学习目标</h3>
      <ul className="space-y-3">
        {objectives.map((obj, index) => (
          <li key={index} className="flex items-start gap-3">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${levelColors[obj.level]}`}
            >
              {levelLabels[obj.level]}
            </span>
            <span className="text-stone-700">{obj.description}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
