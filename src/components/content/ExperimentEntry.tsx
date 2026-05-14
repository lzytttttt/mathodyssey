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
};

export default function ExperimentEntry({ experiments }: ExperimentEntryProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">互动实验</h3>
      <div className="space-y-4">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
          >
            <div>
              <h4 className="font-medium text-stone-800">{exp.title}</h4>
              <p className="text-sm text-stone-600 mt-1">{exp.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  {typeLabels[exp.type] || exp.type}
                </span>
                <span className="text-xs text-stone-500">
                  约 {exp.estimatedMinutes} 分钟
                </span>
              </div>
            </div>
            <Link href={`/experiments/${exp.id}`}>
              <Button variant="primary" size="sm">
                开始实验
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </Card>
  );
}
