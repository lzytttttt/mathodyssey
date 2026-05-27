import type { Metadata } from 'next';
import Link from 'next/link';
import Card from '@/components/ui/Card';

export const metadata: Metadata = {
  title: '使用指南',
  description:
    'MathOdyssey 使用指南：了解如何通过时间轴探索数学史，操作互动实验，完成挑战问题。',
  alternates: {
    canonical: 'https://mathodyssey.com/guide',
  },
};

export default function GuidePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            使用指南
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            如何使用 MathOdyssey 探索数学的发现之旅
          </p>
        </div>

        {/* 快速开始 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            🚀 快速开始
          </h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              MathOdyssey 以历史时间轴为核心，带您从古埃及走到 18 世纪，体验数学概念如何被发明出来。
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>在首页浏览时间轴，找到感兴趣的历史节点</li>
              <li>点击节点进入详情页，阅读历史故事</li>
              <li>尝试互动实验，亲手操作发现数学规律</li>
              <li>完成挑战问题，检验你的理解</li>
            </ol>
          </div>
        </Card>

        {/* 时间轴操作 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            🗺️ 时间轴操作
          </h2>
          <div className="space-y-4 text-[var(--text-secondary)]">
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">桌面端</h3>
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                <li><strong>拖拽平移</strong>：按住鼠标左键拖动</li>
                <li><strong>滚轮缩放</strong>：滚动鼠标滚轮</li>
                <li><strong>点击节点</strong>：单击节点标记进入详情</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">移动端</h3>
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                <li><strong>单指拖动</strong>：滑动屏幕平移时间轴</li>
                <li><strong>双指缩放</strong>：两指捏合缩放</li>
                <li><strong>点击节点</strong>：轻触节点标记进入详情</li>
              </ul>
            </div>
            <p className="text-sm">
              顶部导航栏可以按时代快速筛选节点。
            </p>
          </div>
        </Card>

        {/* 互动实验 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            🔬 互动实验
          </h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>每个节点的互动实验是学习的核心。实验类型包括：</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: '📐', name: '几何拖拽', desc: '拖拽点和图形，观察几何关系变化' },
                { icon: '🎛️', name: '参数滑块', desc: '调整参数值，观察数学规律' },
                { icon: '📊', name: '模拟实验', desc: '运行随机模拟，发现概率规律' },
                { icon: '📈', name: '函数探索', desc: '操作函数图像，理解变化率' },
                { icon: '🔗', name: '图论探索', desc: '在图上行走，发现路径规律' },
                { icon: '📝', name: '证明构建', desc: '选择公设，逐步推导定理' },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-start gap-2 p-3 rounded-lg bg-[var(--bg-secondary)]"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="font-medium text-[var(--text-primary)] text-sm">
                      {item.name}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm">
              实验页面有操作提示面板，点击「提示」按钮查看引导。
            </p>
          </div>
        </Card>

        {/* 挑战问题 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            ⚡ 挑战问题
          </h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>每个节点底部有 2 道挑战问题，帮助检验你对数学概念的理解。</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
              <li>输入答案后点击「提交」查看结果</li>
              <li>答错可以重试，不限次数</li>
              <li>支持数值、分数、文本等多种答案格式</li>
              <li>查看解析了解解题思路</li>
            </ul>
          </div>
        </Card>

        {/* 学习路径建议 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            🛤️ 学习路径建议
          </h2>
          <div className="space-y-4 text-[var(--text-secondary)]">
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">按难度</h3>
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                <li><strong>入门</strong>：古埃及丈量土地 → 巴比伦六十进制 → 毕达哥拉斯定理</li>
                <li><strong>进阶</strong>：鸡兔同笼 → 面积完成法 → 坐标探索</li>
                <li><strong>深入</strong>：函数探索 → 割线与切线 → 面积累积</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">按历史线索</h3>
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                <li><strong>几何之路</strong>：丈量土地 → 毕达哥拉斯 → 欧几里得 → 阿基米德</li>
                <li><strong>代数之路</strong>：六十进制 → 鸡兔同笼 → 花拉子密 → 笛卡尔</li>
                <li><strong>分析之路</strong>：坐标系 → 函数探索 → 割线 → 切线 → 积分</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-white hover:opacity-90 transition-opacity"
          >
            开始探索 →
          </Link>
        </div>
      </div>
    </div>
  );
}
