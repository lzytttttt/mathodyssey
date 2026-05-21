import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Experiment } from '@/types/timeline';

interface ExperimentEntryProps {
  experiments: Experiment[];
  nodeId: string;
}

const typeLabels: Record<string, string> = {
  'geometry-drag': '几何拖拽',
  'parameter-slider': '参数滑块',
  'number-line': '数轴操作',
  'simulation': '模拟器',
  'graph-exploration': '路径探索',
  'coordinate-plotter': '坐标绘图',
  'tangent-tracker': '切线追踪',
  'proof-builder': '证明构建',
};

const typeIcons: Record<string, string> = {
  'geometry-drag': '📐',
  'parameter-slider': '🎚️',
  'number-line': '📏',
  'simulation': '🎲',
  'graph-exploration': '🕸️',
  'coordinate-plotter': '📊',
  'tangent-tracker': '📈',
  'proof-builder': '🧱',
};

export default function ExperimentEntry({ experiments }: ExperimentEntryProps) {
  return (
    <Card variant="glass" className="p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">🔬 互动实验</h3>
      <div className="space-y-3">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] hover:border-[var(--accent-primary)]/30 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{typeIcons[exp.type] || '🔬'}</span>
                <h4 className="font-medium text-[var(--text-primary)]">{exp.title}</h4>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-1">{exp.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-2 py-0.5 rounded-full">
                  {typeLabels[exp.type] || exp.type}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  ⏱ 约 {exp.estimatedMinutes} 分钟
                </span>
              </div>
            </div>
            <Link href={`/experiments/${exp.id}`} className="ml-4 flex-shrink-0">
              <Button variant="gradient" size="sm">
                开始实验
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </Card>
  );
}
