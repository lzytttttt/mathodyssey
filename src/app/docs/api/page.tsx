import type { Metadata } from 'next';
import Card from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'API 参考',
  description:
    'MathOdyssey 数据加载函数 API 参考：getAllNodes、getNodeById、getNodesByEra 等接口说明。',
  alternates: {
    canonical: 'https://mathodyssey.com/docs/api',
  },
};

const apis = [
  {
    module: 'lib/data/nodes',
    desc: '节点数据加载模块。所有函数返回 Promise，数据通过 dynamic import 按需加载。',
    functions: [
      {
        name: 'getAllNodes',
        signature: '(): Promise<TimelineNode[]>',
        desc: '获取所有节点，按时间顺序排序。',
        returns: 'TimelineNode[] — 12 个节点的数组，按 timePeriod.start 升序排列',
        example: 'const nodes = await getAllNodes();',
      },
      {
        name: 'getNodeById',
        signature: '(id: string): Promise<TimelineNode | null>',
        desc: '根据节点 ID 获取单个节点。ID 不存在时返回 null。',
        returns: 'TimelineNode | null',
        example: 'const node = await getNodeById("pythagoras-theorem");',
      },
      {
        name: 'getNodesByEra',
        signature: '(era: Era): Promise<TimelineNode[]>',
        desc: '获取指定时代的所有节点。',
        returns: 'TimelineNode[] — 该时代的节点数组',
        example: 'const greekNodes = await getNodesByEra("ancient-greece");',
      },
      {
        name: 'getAllNodeIds',
        signature: '(): string[]',
        desc: '获取所有节点 ID 列表（同步）。用于 generateStaticParams。',
        returns: 'string[] — 节点 ID 数组',
        example: 'const ids = getAllNodeIds(); // ["egypt-land-measurement", ...]',
      },
    ],
  },
  {
    module: 'lib/experiments/registry',
    desc: '实验组件注册表。管理 15 个实验的动态加载映射。',
    functions: [
      {
        name: 'hasExperimentComponent',
        signature: '(experimentId: string): boolean',
        desc: '检查指定实验是否有对应的交互组件。',
        returns: 'boolean',
        example: 'if (hasExperimentComponent("pythagoras-area-proof")) { ... }',
      },
      {
        name: 'loadExperimentComponent',
        signature: '(experimentId: string): Promise<ComponentType | null>',
        desc: '加载指定实验的 React 组件。通过 dynamic import 按需加载。',
        returns: 'ComponentType<ExperimentComponentProps> | null',
        example: 'const Comp = await loadExperimentComponent("pythagoras-area-proof");',
      },
      {
        name: 'getRegisteredExperimentIds',
        signature: '(): string[]',
        desc: '获取所有已注册的实验 ID 列表。',
        returns: 'string[]',
        example: 'const ids = getRegisteredExperimentIds(); // 15 个 ID',
      },
    ],
  },
  {
    module: 'lib/data/eras',
    desc: '时代数据模块。提供 12 个时代的元信息。',
    functions: [
      {
        name: 'eras',
        signature: 'EraInfo[]',
        desc: '时代信息数组（同步导出）。每个元素包含 id、name、startYear、endYear。',
        returns: 'EraInfo[]',
        example: 'import { eras } from "@/lib/data/eras";',
      },
    ],
  },
  {
    module: 'lib/challenges/validation',
    desc: '挑战题验证模块。纯函数，无副作用。',
    functions: [
      {
        name: 'validateAnswer',
        signature: '(userAnswer: string, correctAnswer: string): ValidationResult',
        desc: '验证用户答案。策略：精确匹配 → 数值容差 → 文本兜底。',
        returns: '{ isCorrect: boolean; normalizedUser: string; normalizedCorrect: string }',
        example: 'const result = validateAnswer("13", "13"); // { isCorrect: true, ... }',
      },
    ],
  },
  {
    module: 'lib/math/*',
    desc: '数学计算纯函数模块。无 DOM/React 依赖，可独立测试。',
    functions: [
      {
        name: 'geometry.ts',
        signature: '',
        desc: '几何计算：pythagoreanHypotenuse、squareOnEdgeAwayFromPoint、regularPolygonVertices、archimedesApproximation',
        returns: '',
        example: 'import { pythagoreanHypotenuse } from "@/lib/math/geometry";',
      },
      {
        name: 'algebra.ts',
        signature: '',
        desc: '代数计算：solveChickenRabbit、completingSquareParts、solveQuadraticByCompletingSquare',
        returns: '',
        example: 'import { solveChickenRabbit } from "@/lib/math/algebra";',
      },
      {
        name: 'calculus.ts',
        signature: '',
        desc: '微积分：averageRateOfChange、secantLineEquation、numericalDerivative、riemannSum、exactIntegral',
        returns: '',
        example: 'import { riemannSum } from "@/lib/math/calculus";',
      },
      {
        name: 'functions.ts',
        signature: '',
        desc: '函数工具：evaluateFunction、sampleCurve、findFunctionFeatures、filterValidSegments',
        returns: '',
        example: 'import { evaluateFunction } from "@/lib/math/functions";',
      },
      {
        name: 'coordinate.ts',
        signature: '',
        desc: '坐标计算：screenToMath、mathToScreen、distance、slope、lineEquationFromTwoPoints',
        returns: '',
        example: 'import { distance } from "@/lib/math/coordinate";',
      },
      {
        name: 'graph.ts',
        signature: '',
        desc: '图论：vertexDegree、hasEulerPath、isValidPath、traverseEdge',
        returns: '',
        example: 'import { hasEulerPath } from "@/lib/math/graph";',
      },
      {
        name: 'proof.ts',
        signature: '',
        desc: '证明系统：PROOF_ITEMS、canSelectItem、getSelectableItems、isProofComplete',
        returns: '',
        example: 'import { canSelectItem } from "@/lib/math/proof";',
      },
    ],
  },
];

export default function APIReferencePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            API 参考
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            MathOdyssey 数据加载函数和工具模块参考
          </p>
        </div>

        {/* 目录 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">模块目录</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {apis.map((api) => (
              <a
                key={api.module}
                href={`#${api.module.replace(/[/.]/g, '-')}`}
                className="text-sm text-[var(--accent-primary)] hover:underline"
              >
                <code className="text-xs">{api.module}</code>
              </a>
            ))}
          </div>
        </Card>

        {/* API 说明 */}
        {apis.map((api) => (
          <Card
            key={api.module}
            variant="glass"
            className="p-6"
            id={api.module.replace(/[/.]/g, '-')}
          >
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
              <code className="text-base">{api.module}</code>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">{api.desc}</p>

            <div className="space-y-6">
              {api.functions.map((fn) => (
                <div
                  key={fn.name}
                  className="p-4 rounded-lg bg-[var(--bg-secondary)]"
                >
                  <h3 className="font-medium text-[var(--text-primary)] mb-1">
                    {fn.name}
                  </h3>
                  {fn.signature && (
                    <code className="block text-xs text-[var(--accent-primary)] mb-2">
                      {fn.signature}
                    </code>
                  )}
                  <p className="text-sm text-[var(--text-secondary)] mb-2">{fn.desc}</p>
                  {fn.returns && (
                    <p className="text-xs text-[var(--text-muted)] mb-2">
                      返回：{fn.returns}
                    </p>
                  )}
                  {fn.example && (
                    <pre className="text-xs p-2 rounded bg-[var(--bg-primary)] text-[var(--text-muted)] overflow-x-auto">
                      {fn.example}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* 类型来源 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            类型定义
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            所有 TypeScript 类型定义位于{' '}
            <code className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-secondary)]">
              src/types/timeline.ts
            </code>
            。完整字段说明请参考{' '}
            <a href="/docs/data" className="text-[var(--accent-primary)] hover:underline">
              数据结构文档
            </a>
            。
          </p>
        </Card>
      </div>
    </div>
  );
}
