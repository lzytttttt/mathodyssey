import { getAllNodes } from '@/lib/data/nodes';
import TimelineCanvas from '@/components/timeline/TimelineCanvas';
import NodeCard from '@/components/content/NodeCard';

export default async function HomePage() {
  const nodes = await getAllNodes();

  return (
    <div className="min-h-screen">
      {/* Hero 区域 */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-stone-800 mb-4">
            数学的发现之旅
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            沿着历史时间轴探索数学概念的诞生过程，通过互动实验亲手体验数学如何被发明出来。
          </p>
        </div>
      </section>

      {/* 时间轴 */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <TimelineCanvas nodes={nodes} />
        </div>
      </section>

      {/* 节点卡片网格 */}
      <section className="py-8 px-4 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">
            探索数学史节点
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {nodes.map((node) => (
              <NodeCard key={node.id} node={node} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
