import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNodeById, getAllNodeIds } from '@/lib/data/nodes';
import NarrativeCard from '@/components/content/NarrativeCard';
import ConceptCard from '@/components/content/ConceptCard';
import ObjectiveCard from '@/components/content/ObjectiveCard';
import ExperimentEntry from '@/components/content/ExperimentEntry';
import ChallengeQuiz from '@/components/challenges/ChallengeQuiz';
import Card from '@/components/ui/Card';
import { colors } from '@/styles/tokens';
import { DIFFICULTY_LABELS } from '@/lib/challenges/constants';

interface PageProps {
  params: Promise<{ nodeId: string }>;
}

export async function generateStaticParams() {
  const ids = getAllNodeIds();
  return ids.map((nodeId) => ({ nodeId }));
}

export async function generateMetadata({ params }: PageProps) {
  const { nodeId } = await params;
  const node = await getNodeById(nodeId);
  if (!node) return { title: '未找到节点' };
  return {
    title: `${node.title} — MathOdyssey`,
    description: node.historicalProblem,
  };
}

export default async function NodeDetailPage({ params }: PageProps) {
  const { nodeId } = await params;
  const node = await getNodeById(nodeId);
  if (!node) notFound();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-stone-200 py-3 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← 返回时间轴
          </Link>
        </div>
      </div>

      {/* 节点头部 */}
      <div className="bg-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span
                className="text-xs px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: colors.era[node.era] }}
              >
                {node.timePeriod.display}
              </span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                {DIFFICULTY_LABELS[node.difficulty]}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-stone-800 mb-2">
            {node.title}
          </h1>
          {node.subtitle && (
            <p className="text-lg text-stone-500 mb-4">{node.subtitle}</p>
          )}
          <p className="text-stone-600 text-lg">
            {node.historicalProblem}
          </p>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* 历史叙述 */}
        <NarrativeCard narrative={node.narrative} />

        {/* 关键人物 */}
        {node.keyFigures && node.keyFigures.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">关键人物</h3>
            <div className="space-y-4">
              {node.keyFigures.map((figure, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {figure.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-800">{figure.name}</h4>
                    <p className="text-sm text-stone-500">{figure.lifespan}</p>
                    <p className="text-stone-600 mt-1">{figure.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 数学概念 */}
        <ConceptCard concepts={node.mathConcepts} />

        {/* 学习目标 */}
        <ObjectiveCard objectives={node.learningObjectives} />

        {/* 互动实验 */}
        <ExperimentEntry experiments={node.experiments} nodeId={node.id} />

        {/* 挑战问题 */}
        {node.challenges && node.challenges.length > 0 && (
          <ChallengeQuiz challenges={node.challenges} />
        )}

        {/* 现代连接 */}
        {node.modernConnections.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">现代连接</h3>
            <ul className="space-y-2">
              {node.modernConnections.map((connection, index) => (
                <li key={index} className="flex items-center gap-2 text-stone-600">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  {connection}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* 参考资料 */}
        {node.references && node.references.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">参考资料</h3>
            <ul className="space-y-2">
              {node.references.map((ref, index) => (
                <li key={index} className="text-sm text-stone-600">
                  {ref.author}, <em>{ref.title}</em>, {ref.year}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
