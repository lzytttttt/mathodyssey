import type { Metadata } from 'next';
import Card from '@/components/ui/Card';

export const metadata: Metadata = {
  title: '数据结构',
  description:
    'MathOdyssey 数据结构文档：TimelineNode、Experiment、Challenge 等核心类型的完整字段说明。',
  alternates: {
    canonical: 'https://mathodyssey.com/docs/data',
  },
};

const sections = [
  {
    id: 'timeline-node',
    title: 'TimelineNode — 时间轴节点',
    desc: '平台的核心数据结构，每个节点代表数学史上的一个关键时刻。',
    fields: [
      { name: 'id', type: 'string', required: true, desc: '唯一标识符，kebab-case，如 pythagoras-theorem' },
      { name: 'title', type: 'string', required: true, desc: '节点标题' },
      { name: 'subtitle', type: 'string', required: false, desc: '节点副标题' },
      { name: 'era', type: 'Era', required: true, desc: '所属时代，如 ancient-greece、early-modern' },
      { name: 'timePeriod', type: 'TimePeriod', required: true, desc: '时间范围（start/end/display）' },
      { name: 'location', type: 'Location', required: false, desc: '地理位置（name/modernName/经纬度）' },
      { name: 'historicalProblem', type: 'string', required: true, desc: '该节点要解决的历史问题，用于 SEO description' },
      { name: 'narrative', type: 'Narrative', required: true, desc: '历史叙述（hook/context/problem/discovery/credibility）' },
      { name: 'keyFigures', type: 'KeyFigure[]', required: false, desc: '关键人物列表' },
      { name: 'mathConcepts', type: 'MathConcept[]', required: true, desc: '数学概念列表' },
      { name: 'learningObjectives', type: 'LearningObjective[]', required: true, desc: '学习目标列表' },
      { name: 'difficulty', type: 'Difficulty', required: true, desc: '难度等级 L1-L5' },
      { name: 'prerequisites', type: 'string[]', required: false, desc: '前置节点 ID 列表' },
      { name: 'experiments', type: 'Experiment[]', required: true, desc: '互动实验列表' },
      { name: 'challenges', type: 'Challenge[]', required: false, desc: '挑战问题列表' },
      { name: 'modernConnections', type: 'string[]', required: true, desc: '现代应用场景' },
      { name: 'relatedConcepts', type: 'ConceptRelation[]', required: false, desc: '与其他节点的概念关系' },
      { name: 'references', type: 'Reference[]', required: false, desc: '参考资料列表' },
      { name: 'tags', type: 'string[]', required: false, desc: '标签列表' },
    ],
  },
  {
    id: 'experiment',
    title: 'Experiment — 互动实验',
    desc: '节点内的互动实验配置，定义实验的场景、交互和引导。',
    fields: [
      { name: 'id', type: 'string', required: true, desc: '唯一标识符，如 pythagoras-area-proof' },
      { name: 'title', type: 'string', required: true, desc: '实验标题' },
      { name: 'description', type: 'string', required: true, desc: '实验描述' },
      { name: 'type', type: 'ExperimentType', required: true, desc: '实验类型（8 种）' },
      { name: 'scene', type: 'ExperimentScene', required: true, desc: '实验场景（description/goal/initialState）' },
      { name: 'interaction', type: 'ExperimentInteraction', required: true, desc: '交互配置（controls/constraints）' },
      { name: 'guidance', type: 'ExperimentGuidance', required: true, desc: '引导配置（hints/discoveries/completionCriteria）' },
      { name: 'estimatedMinutes', type: 'number', required: true, desc: '预估完成时间（分钟）' },
    ],
  },
  {
    id: 'challenge',
    title: 'Challenge — 挑战问题',
    desc: '节点底部的验证性问题，支持多种答案格式。',
    fields: [
      { name: 'id', type: 'string', required: true, desc: '唯一标识符' },
      { name: 'question', type: 'string', required: true, desc: '题目文本' },
      { name: 'type', type: 'string', required: true, desc: '题目类型：historical-recreation / concept-application / exploration / cross-era' },
      { name: 'options', type: 'string[]', required: false, desc: '选择题选项（如有）' },
      { name: 'answer', type: 'string', required: true, desc: '标准答案' },
      { name: 'explanation', type: 'string', required: true, desc: '答案解析' },
      { name: 'hints', type: 'string[]', required: true, desc: '提示列表' },
      { name: 'difficulty', type: 'Difficulty', required: true, desc: '难度等级 L1-L5' },
    ],
  },
  {
    id: 'math-concept',
    title: 'MathConcept — 数学概念',
    desc: '节点涉及的数学概念，包含定义、公式和教育等级。',
    fields: [
      { name: 'name', type: 'string', required: true, desc: '概念名称' },
      { name: 'definition', type: 'string', required: true, desc: '概念定义' },
      { name: 'category', type: 'ConceptCategory', required: true, desc: '概念类别（geometry/algebra/calculus 等 13 种）' },
      { name: 'formula', type: 'string', required: false, desc: '相关公式（LaTeX 格式）' },
      { name: 'educationLevel', type: 'EducationLevel', required: true, desc: '教育阶段：elementary / middle-school / high-school / college-intro' },
      { name: 'details', type: 'string', required: false, desc: '详细说明' },
    ],
  },
  {
    id: 'enums',
    title: '枚举类型',
    desc: '项目中使用的枚举和联合类型。',
    fields: [
      { name: 'Era', type: 'union', required: true, desc: "12 种时代：ancient-egypt | ancient-babylon | ancient-greece | ancient-china | ancient-india | islamic-golden-age | early-modern | 18th-century 等" },
      { name: 'Difficulty', type: 'union', required: true, desc: '5 级难度：L1（入门）| L2 | L3 | L4 | L5（专家）' },
      { name: 'ExperimentType', type: 'union', required: true, desc: '8 种实验类型：geometry-drag | parameter-slider | number-line | simulation | graph-exploration | coordinate-plotter | tangent-tracker | proof-builder' },
      { name: 'ConceptCategory', type: 'union', required: true, desc: '13 种概念类别：geometry | algebra | number-theory | calculus | probability | statistics | trigonometry | analysis | topology | logic | combinatorics | graph-theory | linear-algebra' },
      { name: 'Credibility', type: 'union', required: true, desc: '5 级可信度：A（最高）→ E（最低）' },
    ],
  },
];

export default function DataStructurePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            数据结构文档
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            MathOdyssey 核心数据类型的完整字段说明
          </p>
        </div>

        {/* 目录 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">目录</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm text-[var(--accent-primary)] hover:underline"
              >
                {s.title}
              </a>
            ))}
          </div>
        </Card>

        {/* 数据结构说明 */}
        {sections.map((section) => (
          <Card key={section.id} variant="glass" className="p-6" id={section.id}>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              {section.title}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4">{section.desc}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left py-2 pr-4 font-medium text-[var(--text-primary)]">字段</th>
                    <th className="text-left py-2 pr-4 font-medium text-[var(--text-primary)]">类型</th>
                    <th className="text-left py-2 pr-4 font-medium text-[var(--text-primary)]">必填</th>
                    <th className="text-left py-2 font-medium text-[var(--text-primary)]">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {section.fields.map((field) => (
                    <tr
                      key={field.name}
                      className="border-b border-[var(--border-light)] last:border-0"
                    >
                      <td className="py-2 pr-4">
                        <code className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--accent-primary)]">
                          {field.name}
                        </code>
                      </td>
                      <td className="py-2 pr-4 text-[var(--text-muted)]">
                        <code className="text-xs">{field.type}</code>
                      </td>
                      <td className="py-2 pr-4">
                        {field.required ? (
                          <span className="text-xs text-red-500">必填</span>
                        ) : (
                          <span className="text-xs text-[var(--text-muted)]">可选</span>
                        )}
                      </td>
                      <td className="py-2 text-[var(--text-secondary)]">{field.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}

        {/* JSON 示例 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            JSON 文件结构示例
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            节点数据存储在 <code className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-secondary)]">data/nodes/</code> 目录下，
            按时代分子目录，文件名为节点 ID（kebab-case）。
          </p>
          <pre className="text-xs p-4 rounded-lg bg-[var(--bg-secondary)] overflow-x-auto text-[var(--text-secondary)]">
{`data/nodes/
├── ancient-egypt/
│   └── egypt-land-measurement.json
├── ancient-babylon/
│   └── babylon-base60.json
├── ancient-greece/
│   ├── pythagoras-theorem.json
│   ├── euclid-axioms.json
│   └── archimedes-area.json
├── ancient-china/
│   └── china-chicken-rabbit.json
├── ancient-india/
│   └── brahmagupta-zero.json
├── islamic-golden-age/
│   └── al-khwarizmi-algebra.json
├── early-modern/
│   ├── descartes-coordinates.json
│   ├── newton-leibniz-calculus.json
│   └── pascal-fermat-probability.json
└── 18th-century/
    └── euler-graph-theory.json`}
          </pre>
        </Card>
      </div>
    </div>
  );
}
