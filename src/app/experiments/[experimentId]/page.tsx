import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllNodes } from '@/lib/data/nodes';
import { colors, gradients, eraIcons } from '@/styles/tokens';
import {
  hasExperimentComponent,
  loadExperimentComponent,
} from '@/lib/experiments/registry';
import ExperimentWrapper from '@/components/experiments/ExperimentWrapper';

interface PageProps {
  params: Promise<{ experimentId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { experimentId } = await params;
  const nodes = await getAllNodes();
  const experiment = nodes
    .flatMap((n) => n.experiments)
    .find((e) => e.id === experimentId);
  if (!experiment) return { title: '未找到实验' };

  const description = experiment.description.length > 160
    ? experiment.description.substring(0, 157) + '...'
    : experiment.description;

  return {
    title: experiment.title,
    description,
    openGraph: {
      title: `${experiment.title} — MathOdyssey`,
      description,
      type: 'website',
      url: `https://mathodyssey.com/experiments/${experimentId}`,
      siteName: 'MathOdyssey',
    },
    alternates: {
      canonical: `https://mathodyssey.com/experiments/${experimentId}`,
    },
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

  const eraColor = colors.era[node.era] || '#6366f1';
  const eraGradient = gradients[node.era] || [eraColor, eraColor];
  const eraIcon = eraIcons[node.era] || '🔬';

  // Check if we have an interactive component for this experiment
  if (hasExperimentComponent(experimentId)) {
    const ExperimentComponent = await loadExperimentComponent(experimentId);
    if (ExperimentComponent) {
      return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
          {/* Top navigation */}
          <div className="glass-strong border-b border-[var(--border-color)] py-3 px-4 sticky top-0 z-30">
            <div className="max-w-5xl mx-auto flex items-center gap-4">
              <Link
                href={`/timeline/${node.id}`}
                className="text-[var(--accent-primary)] hover:opacity-80 text-sm transition-opacity"
              >
                ← 返回节点
              </Link>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-sm text-[var(--text-muted)]">
                {eraIcon} {node.title}
              </span>
            </div>
          </div>

          {/* Experiment header */}
          <div
            className="py-8 px-4 border-b border-[var(--border-color)]"
            style={{
              background: `linear-gradient(135deg, ${eraGradient[0]}12 0%, ${eraGradient[1]}06 100%)`,
            }}
          >
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full text-white font-medium"
                  style={{
                    background: `linear-gradient(135deg, ${eraGradient[0]}, ${eraGradient[1]})`,
                  }}
                >
                  🔬 互动实验
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  ⏱ 约 {experiment.estimatedMinutes} 分钟
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                {experiment.title}
              </h1>
              <p className="text-[var(--text-secondary)] mt-2">
                {experiment.description}
              </p>
            </div>
          </div>

          {/* Interactive experiment */}
          <ExperimentWrapper Component={ExperimentComponent} experiment={experiment} />
        </div>
      );
    }
  }

  // Fallback: show config-only view for experiments without components
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="glass-strong border-b border-[var(--border-color)] py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href={`/timeline/${node.id}`}
            className="text-[var(--accent-primary)] hover:opacity-80 text-sm transition-opacity"
          >
            ← 返回节点
          </Link>
          <span className="text-[var(--text-muted)]">·</span>
          <span className="text-sm text-[var(--text-muted)]">{node.title}</span>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            {experiment.title}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-4">
            {experiment.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
            <span>⏱ 预估时间：{experiment.estimatedMinutes} 分钟</span>
            <span>📋 类型：{experiment.type}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="p-8 glass rounded-xl text-center">
          <div className="text-4xl mb-4">🚧</div>
          <p className="text-lg text-[var(--text-primary)] mb-2 font-medium">
            互动实验即将推出
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            该实验正在开发中，敬请期待
          </p>
        </div>
      </div>
    </div>
  );
}
