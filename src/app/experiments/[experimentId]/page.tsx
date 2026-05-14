import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllNodes } from '@/lib/data/nodes';
import {
  hasExperimentComponent,
  loadExperimentComponent,
} from '@/lib/experiments/registry';

interface PageProps {
  params: Promise<{ experimentId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { experimentId } = await params;
  const nodes = await getAllNodes();
  const experiment = nodes
    .flatMap((n) => n.experiments)
    .find((e) => e.id === experimentId);
  if (!experiment) return { title: '未找到实验' };
  return {
    title: `${experiment.title} — MathOdyssey`,
    description: experiment.description,
  };
}

export default async function ExperimentPage({ params }: PageProps) {
  const { experimentId } = await params;
  const nodes = await getAllNodes();
  const node = nodes.find((n) =>
    n.experiments.some((e) => e.id === experimentId)
  );
  if (!node) notFound();

  const experiment = node.experiments.find((e) => e.id === experimentId);
  if (!experiment) notFound();

  // Check if we have an interactive component for this experiment
  if (hasExperimentComponent(experimentId)) {
    const ExperimentComponent = await loadExperimentComponent(experimentId);
    if (ExperimentComponent) {
      return (
        <div>
          {/* Top navigation */}
          <div className="bg-white border-b border-stone-200 py-3 px-4">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <Link
                href={`/timeline/${node.id}`}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                ← 返回节点
              </Link>
              <span className="text-stone-400">|</span>
              <span className="text-stone-600 text-sm">{node.title}</span>
            </div>
          </div>

          {/* Experiment header */}
          <div className="bg-white py-6 px-4 border-b border-stone-100">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-stone-800">
                {experiment.title}
              </h1>
              <p className="text-stone-600 mt-1">{experiment.description}</p>
            </div>
          </div>

          {/* Interactive experiment */}
          <ExperimentComponent experiment={experiment} />
        </div>
      );
    }
  }

  // Fallback: show config-only view for experiments without components
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200 py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href={`/timeline/${node.id}`}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← 返回节点
          </Link>
          <span className="text-stone-400">|</span>
          <span className="text-stone-600 text-sm">{node.title}</span>
        </div>
      </div>

      <div className="bg-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">
            {experiment.title}
          </h1>
          <p className="text-lg text-stone-600 mb-4">
            {experiment.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-stone-500">
            <span>预估时间：{experiment.estimatedMinutes} 分钟</span>
            <span>类型：{experiment.type}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="text-center py-8">
            <p className="text-lg text-blue-700 mb-2">互动实验即将推出</p>
            <p className="text-sm text-blue-600">
              该实验正在开发中，敬请期待
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
