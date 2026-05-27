import type { Metadata } from 'next';
import Link from 'next/link';
import Card from '@/components/ui/Card';

export const metadata: Metadata = {
  title: '关于',
  description:
    'MathOdyssey 是一个以数学史为主线的可视化学习平台，通过历史故事和互动实验帮助用户理解数学概念。',
  alternates: {
    canonical: 'https://mathodyssey.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            关于 MathOdyssey
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            让数学成为一场发现之旅
          </p>
        </div>

        {/* 理念 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            我们的理念
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            数学不是一组需要记忆的公式，而是人类在解决真实问题过程中逐步发明的思维工具。
            MathOdyssey 沿着历史时间轴探索不同文明如何面对具体问题，通过亲手操作互动工具，
            体验数学概念如何被「发明」出来。
          </p>
        </Card>

        {/* 学习模式 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            学习模式
          </h2>
          <div className="space-y-4">
            {[
              { step: '1', title: '发现问题', desc: '面对一个历史情境中的真实问题' },
              { step: '2', title: '探索试错', desc: '通过互动工具尝试不同的方法' },
              { step: '3', title: '发现规律', desc: '在操作过程中自己发现数学关系' },
              { step: '4', title: '理解概念', desc: '将发现的规律提炼为数学概念' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[var(--accent-primary)] bg-opacity-10 flex items-center justify-center text-[var(--accent-primary)] font-bold text-sm flex-shrink-0">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 覆盖范围 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            覆盖范围
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            目前平台覆盖从古埃及（约公元前 2000 年）到 18 世纪的数学史，包含 12 个精选节点和 15 个互动实验：
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              '古埃及丈量土地',
              '巴比伦六十进制',
              '毕达哥拉斯定理',
              '欧几里得公理',
              '阿基米德穷竭法',
              '中国鸡兔同笼',
              '婆罗摩笈多与零',
              '花拉子密的代数',
              '笛卡尔坐标系',
              '牛顿与莱布尼茨微积分',
              '帕斯卡与费马概率论',
              '欧拉图论',
            ].map((name) => (
              <div
                key={name}
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                {name}
              </div>
            ))}
          </div>
        </Card>

        {/* 技术栈 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            技术栈
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: 'Next.js', desc: '应用框架' },
              { name: 'TypeScript', desc: '类型安全' },
              { name: 'React', desc: 'UI 框架' },
              { name: 'Tailwind CSS', desc: '样式系统' },
              { name: 'KaTeX', desc: '数学公式' },
              { name: 'SVG / Canvas', desc: '可视化' },
            ].map((tech) => (
              <div
                key={tech.name}
                className="p-3 rounded-lg bg-[var(--bg-secondary)] text-center"
              >
                <div className="font-medium text-[var(--text-primary)] text-sm">
                  {tech.name}
                </div>
                <div className="text-xs text-[var(--text-muted)]">{tech.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 开源信息 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            开源信息
          </h2>
          <div className="space-y-2 text-[var(--text-secondary)] text-sm">
            <p>
              MathOdyssey 采用{' '}
              <a
                href="https://www.apache.org/licenses/LICENSE-2.0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-primary)] hover:underline"
              >
                Apache License 2.0
              </a>{' '}
              开源许可证。
            </p>
            <p>
              欢迎贡献代码、报告问题或提出建议。
            </p>
          </div>
        </Card>

        {/* 快速链接 */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/guide"
            className="px-4 py-2 text-sm rounded-lg bg-[var(--accent-primary)] text-white hover:opacity-90 transition-opacity"
          >
            使用指南
          </Link>
          <Link
            href="/guide/teacher"
            className="px-4 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            教师指南
          </Link>
          <Link
            href="/faq"
            className="px-4 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            常见问题
          </Link>
        </div>
      </div>
    </div>
  );
}
