import type { Metadata } from 'next';
import Card from '@/components/ui/Card';

export const metadata: Metadata = {
  title: '贡献指南',
  description:
    'MathOdyssey 贡献指南：如何添加新节点、新实验、新挑战题。',
  alternates: {
    canonical: 'https://mathodyssey.com/contribute',
  },
};

export default function ContributePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            贡献指南
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            如何为 MathOdyssey 添加新内容和功能
          </p>
        </div>

        {/* GitHub */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            🔗 GitHub 仓库
          </h2>
          <div className="space-y-3 text-[var(--text-secondary)] text-sm">
            <p>
              项目开源地址：
              <a
                href="https://github.com/lzytttttt/mathodyssey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-primary)] hover:underline ml-1"
              >
                github.com/lzytttttt/mathodyssey
              </a>
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/lzytttttt/mathodyssey"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-sm hover:opacity-90 transition-opacity"
              >
                Star / Fork
              </a>
              <a
                href="https://github.com/lzytttttt/mathodyssey/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                提交 Issue
              </a>
              <a
                href="https://github.com/lzytttttt/mathodyssey/pulls"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                提交 PR
              </a>
            </div>
            <p className="text-[var(--text-muted)]">
              欢迎通过 Issue 报告问题或提出建议，通过 Pull Request 贡献代码。
            </p>
          </div>
        </Card>

        {/* 概述 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            项目结构
          </h2>
          <pre className="text-xs p-4 rounded-lg bg-[var(--bg-secondary)] overflow-x-auto text-[var(--text-secondary)]">
{`MathOdyssey/
├── data/nodes/           # 节点 JSON 数据（内容）
├── src/
│   ├── app/              # Next.js 页面路由
│   ├── components/       # React 组件
│   │   ├── experiments/  # 互动实验组件
│   │   ├── content/      # 内容展示组件
│   │   └── ui/           # 基础 UI 组件
│   ├── lib/
│   │   ├── data/         # 数据加载函数
│   │   ├── math/         # 数学计算纯函数
│   │   └── experiments/  # 实验注册表
│   └── types/            # TypeScript 类型
└── docs/                 # 项目文档`}
          </pre>
        </Card>

        {/* 添加新节点 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            📄 添加新节点
          </h2>
          <div className="space-y-4 text-[var(--text-secondary)] text-sm">
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li>
                <strong>创建 JSON 文件</strong>
                <br />
                在 <code className="text-xs px-1 py-0.5 rounded bg-[var(--bg-secondary)]">data/nodes/{'{era}'}/</code> 下创建{' '}
                <code className="text-xs px-1 py-0.5 rounded bg-[var(--bg-secondary)]">{'{node-id}'}.json</code>
                <br />
                <span className="text-[var(--text-muted)]">
                  文件名即节点 ID，使用 kebab-case，如 <code className="text-xs">new-euler-identity.json</code>
                </span>
              </li>
              <li>
                <strong>填写 JSON 内容</strong>
                <br />
                参考{' '}
                <a href="/docs/data" className="text-[var(--accent-primary)] hover:underline">
                  数据结构文档
                </a>{' '}
                中的 TimelineNode 字段说明。必填字段：id、title、era、timePeriod、historicalProblem、narrative、mathConcepts、learningObjectives、difficulty、experiments、modernConnections。
              </li>
              <li>
                <strong>注册节点</strong>
                <br />
                在 <code className="text-xs px-1 py-0.5 rounded bg-[var(--bg-secondary)]">src/lib/data/nodes.ts</code> 的{' '}
                <code className="text-xs px-1 py-0.5 rounded bg-[var(--bg-secondary)]">nodeModules</code> 对象中添加条目：
                <pre className="mt-2 p-2 rounded bg-[var(--bg-primary)] text-xs text-[var(--text-muted)]">
{`'new-euler-identity': () =>
  import('../../data/nodes/18th-century/new-euler-identity.json')
    .then(m => ({ default: m.default as unknown as TimelineNode })),`}
                </pre>
              </li>
              <li>
                <strong>验证</strong>
                <br />
                运行 <code className="text-xs px-1 py-0.5 rounded bg-[var(--bg-secondary)]">npm run build</code> 确认无报错。
              </li>
            </ol>
          </div>
        </Card>

        {/* 添加新实验 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            🔬 添加新实验
          </h2>
          <div className="space-y-4 text-[var(--text-secondary)] text-sm">
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li>
                <strong>确定实验类型</strong>
                <br />
                选择已有的 ExperimentType（geometry-drag、parameter-slider、number-line、simulation、graph-exploration、coordinate-plotter、tangent-tracker、proof-builder），或在 <code className="text-xs">src/types/timeline.ts</code> 中新增。
              </li>
              <li>
                <strong>创建纯函数模块（如需要）</strong>
                <br />
                在 <code className="text-xs px-1 py-0.5 rounded bg-[var(--bg-secondary)]">src/lib/math/</code> 下创建计算函数。
                <br />
                <span className="text-[var(--text-muted)]">纯函数无 DOM/React 依赖，可独立测试。</span>
              </li>
              <li>
                <strong>创建实验组件</strong>
                <br />
                在 <code className="text-xs px-1 py-0.5 rounded bg-[var(--bg-secondary)]">src/components/experiments/{'{type}'}/</code> 下创建组件。
                <br />
                组件接收 <code className="text-xs">{'{ experiment: Experiment }'}</code> props，使用 ExperimentContainer 统一布局。
              </li>
              <li>
                <strong>注册到 registry</strong>
                <br />
                在 <code className="text-xs px-1 py-0.5 rounded bg-[var(--bg-secondary)]">src/lib/experiments/registry.ts</code> 中添加动态 import 映射：
                <pre className="mt-2 p-2 rounded bg-[var(--bg-primary)] text-xs text-[var(--text-muted)]">
{`'my-new-experiment': () =>
  import('@/components/experiments/type/MyLab')
    .then(m => ({ default: m.default })),`}
                </pre>
              </li>
              <li>
                <strong>更新节点 JSON</strong>
                <br />
                在对应节点的 JSON 文件中添加 experiment 配置，确保 <code className="text-xs">experiment.id</code> 与 registry 中的 key 一致。
              </li>
              <li>
                <strong>验证</strong>
                <br />
                运行 <code className="text-xs px-1 py-0.5 rounded bg-[var(--bg-secondary)]">npm run lint</code> 和{' '}
                <code className="text-xs px-1 py-0.5 rounded bg-[var(--bg-secondary)]">npm run build</code>。
              </li>
            </ol>
          </div>
        </Card>

        {/* 添加挑战题 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            ⚡ 添加挑战题
          </h2>
          <div className="space-y-4 text-[var(--text-secondary)] text-sm">
            <p>在节点 JSON 的 <code className="text-xs">challenges</code> 数组中添加：</p>
            <pre className="p-4 rounded-lg bg-[var(--bg-secondary)] text-xs overflow-x-auto">
{`{
  "id": "my-challenge-1",
  "question": "题目文本",
  "type": "concept-application",
  "answer": "标准答案",
  "explanation": "答案解析",
  "hints": ["提示1", "提示2"],
  "difficulty": "L2"
}`}
            </pre>
            <div className="space-y-2">
              <p><strong>答案验证规则</strong>（validation.ts）：</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>数值答案：允许 ±1% 或 ±0.01 的容差</li>
                <li>含冒号的答案（如时间）：精确匹配</li>
                <li>文本答案（≥4 字符）：子字符串匹配</li>
                <li>短文本答案：精确匹配</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 提交规范 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            📋 提交规范
          </h2>
          <div className="space-y-3 text-[var(--text-secondary)] text-sm">
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>运行 <code className="text-xs px-1 py-0.5 rounded bg-[var(--bg-secondary)]">npm run lint</code> 确认 0 errors</li>
              <li>运行 <code className="text-xs px-1 py-0.5 rounded bg-[var(--bg-secondary)]">npm run build</code> 确认构建通过</li>
              <li>commit message 使用中文，格式：<code className="text-xs">feat/fix/docs: 简要描述</code></li>
              <li>不要提交 <code className="text-xs">node_modules</code>、<code className="text-xs">.env</code> 等文件</li>
            </ul>
          </div>
        </Card>

        {/* 相关文档 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            📚 相关文档
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: '/docs/data', title: '数据结构', desc: '核心类型字段说明' },
              { href: '/docs/api', title: 'API 参考', desc: '数据加载函数接口' },
              { href: '/guide', title: '使用指南', desc: '平台功能介绍' },
              { href: '/guide/teacher', title: '教师指南', desc: '课堂使用建议' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                <div className="font-medium text-[var(--text-primary)] text-sm">
                  {link.title}
                </div>
                <div className="text-xs text-[var(--text-muted)]">{link.desc}</div>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
