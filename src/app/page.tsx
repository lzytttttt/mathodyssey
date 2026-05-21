import { getAllNodes } from '@/lib/data/nodes';
import HeroSection from '@/components/layout/HeroSection';
import TimelineCanvas from '@/components/timeline/TimelineCanvas';
import NodeCard from '@/components/content/NodeCard';

export default async function HomePage() {
  const nodes = await getAllNodes();

  return (
    <div className="min-h-screen">
      {/* Hero 区域 */}
      <HeroSection />

      {/* 时间轴 */}
      <section id="timeline" className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 text-center">
            历史时间轴
          </h2>
          <p className="text-sm text-[var(--text-muted)] text-center mb-6">
            滚轮/双指缩放 · 拖拽平移 · 点击节点进入详情
          </p>
          <TimelineCanvas nodes={nodes} />
        </div>
      </section>

      {/* 节点卡片网格 */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 text-center">
            探索数学史节点
          </h2>
          <p className="text-sm text-[var(--text-muted)] text-center mb-8">
            从古埃及到近代，每一个节点都是一段数学发现之旅
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {nodes.map((node, index) => (
              <NodeCard key={node.id} node={node} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
