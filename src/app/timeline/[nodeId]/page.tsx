import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getNodeById, getAllNodeIds, getAllNodes } from '@/lib/data/nodes';
import { eras } from '@/lib/data/eras';
import { gradients } from '@/styles/tokens';
import NodeHero from '@/components/content/NodeHero';
import SectionNav from '@/components/content/SectionNav';
import NarrativeCard from '@/components/content/NarrativeCard';
import ConceptCard from '@/components/content/ConceptCard';
import ObjectiveCard from '@/components/content/ObjectiveCard';
import ExperimentEntry from '@/components/content/ExperimentEntry';
import ChallengeQuiz from '@/components/challenges/ChallengeQuiz';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { DIFFICULTY_LABELS } from '@/lib/challenges/constants';

interface PageProps {
  params: Promise<{ nodeId: string }>;
}

export async function generateStaticParams() {
  const ids = getAllNodeIds();
  return ids.map((nodeId) => ({ nodeId }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { nodeId } = await params;
  const node = await getNodeById(nodeId);
  if (!node) return { title: '未找到节点' };

  const eraInfo = eras.find((e) => e.id === node.era);
  const eraName = eraInfo?.name || node.era;

  const description = node.historicalProblem.length > 160
    ? node.historicalProblem.substring(0, 157) + '...'
    : node.historicalProblem;

  return {
    title: node.title,
    description,
    keywords: [
      node.title,
      ...node.mathConcepts.map((c) => c.name),
      node.era,
      '数学史',
      '互动实验',
    ],
    openGraph: {
      title: `${node.title} — MathOdyssey`,
      description,
      type: 'article',
      url: `https://mathodyssey.com/timeline/${nodeId}`,
      siteName: 'MathOdyssey',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(node.title)}&era=${encodeURIComponent(eraName)}`,
          width: 1200,
          height: 630,
          alt: node.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${node.title} — MathOdyssey`,
      description,
    },
    alternates: {
      canonical: `https://mathodyssey.com/timeline/${nodeId}`,
    },
  };
}

export default async function NodeDetailPage({ params }: PageProps) {
  const { nodeId } = await params;
  const node = await getNodeById(nodeId);
  if (!node) notFound();

  const allNodes = await getAllNodes();
  const currentIndex = allNodes.findIndex((n) => n.id === nodeId);
  const prevNode = currentIndex > 0 ? allNodes[currentIndex - 1] : null;
  const nextNode = currentIndex < allNodes.length - 1 ? allNodes[currentIndex + 1] : null;

  const eraInfo = eras.find((e) => e.id === node.era);
  const eraName = eraInfo?.name || node.era;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: node.title,
    description: node.historicalProblem,
    url: `https://mathodyssey.com/timeline/${nodeId}`,
    educationalLevel: 'K12',
    learningResourceType: 'Interactive Resource',
    teaches: node.mathConcepts.map((c) => c.name),
    inLanguage: 'zh-CN',
    isPartOf: {
      '@type': 'WebSite',
      name: 'MathOdyssey',
      url: 'https://mathodyssey.com',
    },
  };

  // Build sections list for SectionNav
  const sections = [
    { id: 'narrative', label: '历史故事', icon: '📜' },
    ...(node.keyFigures && node.keyFigures.length > 0
      ? [{ id: 'figures', label: '关键人物', icon: '👤' }]
      : []),
    { id: 'concepts', label: '数学概念', icon: '📐' },
    { id: 'objectives', label: '学习目标', icon: '🎯' },
    { id: 'experiments', label: '互动实验', icon: '🔬' },
    ...(node.challenges && node.challenges.length > 0
      ? [{ id: 'challenges', label: '挑战问题', icon: '⚡' }]
      : []),
    ...(node.modernConnections.length > 0
      ? [{ id: 'connections', label: '现代连接', icon: '🔗' }]
      : []),
  ];

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 顶部导航 */}
      <div className="border-b border-[var(--border-color)] py-3 px-4 bg-[var(--bg-card)]">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-[var(--accent-primary)] hover:opacity-80 text-sm transition-opacity">
            ← 返回时间轴
          </Link>
          <span className="text-[var(--text-muted)]">·</span>
          <span className="text-sm text-[var(--text-muted)]">
            {currentIndex + 1} / {allNodes.length}
          </span>
        </div>
      </div>

      {/* Section navigation */}
      <SectionNav sections={sections} />

      {/* Node Hero */}
      <NodeHero
        title={node.title}
        subtitle={node.subtitle}
        era={node.era}
        eraName={eraName}
        timePeriodDisplay={node.timePeriod.display}
        difficulty={node.difficulty}
        difficultyLabel={DIFFICULTY_LABELS[node.difficulty]}
        historicalProblem={node.historicalProblem}
      />

      {/* 内容区域 */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* 历史叙述 */}
        <div id="narrative">
          <NarrativeCard narrative={node.narrative} era={node.era} />
        </div>

        {/* 关键人物 */}
        {node.keyFigures && node.keyFigures.length > 0 && (
          <div id="figures">
            <Card variant="glass" era={node.era} className="p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">👤 关键人物</h3>
              <div className="space-y-4">
                {node.keyFigures.map((figure, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${
                          gradients[node.era]?.[0] || '#6366f1'
                        }, ${
                          gradients[node.era]?.[1] || '#4f46e5'
                        })`,
                      }}
                    >
                      {figure.name[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)]">{figure.name}</h4>
                      <p className="text-sm text-[var(--text-muted)]">{figure.lifespan}</p>
                      <p className="text-[var(--text-secondary)] mt-1">{figure.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 数学概念 */}
        <div id="concepts">
          <ConceptCard concepts={node.mathConcepts} era={node.era} />
        </div>

        {/* 学习目标 */}
        <div id="objectives">
          <ObjectiveCard objectives={node.learningObjectives} />
        </div>

        {/* 互动实验 */}
        <div id="experiments">
          <ExperimentEntry experiments={node.experiments} nodeId={node.id} />
        </div>

        {/* 挑战问题 */}
        {node.challenges && node.challenges.length > 0 && (
          <div id="challenges">
            <ChallengeQuiz challenges={node.challenges} />
          </div>
        )}

        {/* 现代连接 */}
        {node.modernConnections.length > 0 && (
          <div id="connections">
            <Card variant="glass" era={node.era} className="p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">🔗 现代连接</h3>
              <ul className="space-y-2">
                {node.modernConnections.map((connection, index) => (
                  <li key={index} className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] opacity-60" />
                    {connection}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {/* 参考资料 */}
        {node.references && node.references.length > 0 && (
          <Card variant="default" className="p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">📚 参考资料</h3>
            <ul className="space-y-2">
              {node.references.map((ref, index) => (
                <li key={index} className="text-sm text-[var(--text-secondary)]">
                  {ref.author}, <em>{ref.title}</em>, {ref.year}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* 底部导航 */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
          {prevNode ? (
            <Link href={`/timeline/${prevNode.id}`}>
              <Button variant="ghost" size="sm">
                ← {prevNode.title}
              </Button>
            </Link>
          ) : (
            <div />
          )}
          {nextNode ? (
            <Link href={`/timeline/${nextNode.id}`}>
              <Button variant="ghost" size="sm">
                {nextNode.title} →
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
