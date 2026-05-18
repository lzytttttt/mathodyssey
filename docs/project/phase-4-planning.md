# Phase 4 Planning：从证明到结构 + 学习验证闭环

## 规划日期

2026-05-18

---

## 1. Phase 4 主线

### 叙事弧线

Phase 1~3 沿数学史主线推进了"测量 → 抽象 → 变化"三个阶段：

```
Phase 1: 测量（几何直观 + 数值系统 + 概率）
Phase 2: 抽象（从几何到代数：公理化 → 逼近 → 符号 → 数系 → 坐标）
Phase 3: 变化（从坐标到变化：函数 → 变化率 → 切线 → 积分）
```

Phase 4 的数学史主线是**"从证明到结构"**：

```
证明时代（Phase 4 前半）         结构时代（Phase 4 后半）
───────────────────            ────────────────────
欧几里得 (约前 300)             欧拉 (1736)
公理 → 推理 → 定理             节点 → 边 → 路径
逻辑体系                        离散结构
    │                              │
    └─────── Phase 4 统一 ─────────┘
             证明与验证
             挑战与反馈
             学习验证闭环
```

### 核心转变

| 维度 | Phase 3（变化） | Phase 4（证明与结构） |
|------|----------------|----------------------|
| 数学对象 | 函数、曲线、面积 | 公理、定理、图、路径 |
| 思维模式 | 分析、逼近、极限 | 逻辑推理、组合、验证 |
| 关键人物 | 牛顿、莱布尼茨 | 欧几里得、欧拉 |
| 交互范式 | slider → 曲线变化 | 选择 → 逻辑验证 / 点击 → 路径探索 |
| 学习闭环 | 探索 → 发现 | 探索 → 发现 → **验证** |

### 双线并行

Phase 4 有两条并行的线：

1. **内容线**：补齐最后 2 个空槽实验（Euclid + Euler），完成 12/12 节点全覆盖
2. **验证线**：建立交互式挑战题系统，形成"探索→发现→验证"的学习闭环

---

## 2. Phase 4 子阶段划分

```
Phase 4.1：Euler Bridge Explorer（图论 — 结构的诞生）
Phase 4.2：Euclid Axiom Builder（公理 — 证明的诞生）
Phase 4.3：Challenge System MVP（学习验证闭环）
```

### 子阶段依赖关系

```
Phase 4.1 (Euler)          Phase 4.2 (Euclid)
   │                           │
   │  独立，可并行              │
   │                           │
   └──────────┬────────────────┘
              │
              │  4.3 读取节点 JSON 中的 challenge 数据
              │  4.1/4.2 完成后 12/12 节点数据完整
              ▼
       Phase 4.3 (Challenge System MVP)
```

Phase 4.1 和 4.2 可以并行开发（无依赖）。Phase 4.3 依赖前两者的节点数据完整，但不依赖其代码。

---

## 3. Euler Bridge Explorer：Phase 4.1

### 决策：是，应作为 Phase 4.1

理由：
- Euler 七桥是**图论的诞生**，是从连续数学到离散结构的完美过渡点
- `euler-graph-theory.json` 已有完整的实验配置（goal、controls、guidance、discoveries）
- `graph-exploration` 类型已在 ExperimentType 中定义；Phase 3.2 的 Average Rate of Change 使用了该类型但交互本质是函数曲线上的 slider，Euler 七桥才是真正的"图探索"
- 这是 12 个节点中唯一来自 18 世纪的节点，补全它完成时间线完整性

### 数学史节点

| 字段 | 值 |
|------|-----|
| 节点 ID | `euler-graph-theory` |
| 标题 | 柯尼斯堡七桥：图论的诞生 |
| 时代 | `18th-century` |
| 时间 | 1736 年 |
| 核心问题 | 能否一次走遍柯尼斯堡的七座桥，每座桥只走一次？ |
| 核心概念 | 度（degree）、欧拉路径、欧拉回路、奇偶性 |
| 实验 ID | `euler-bridge-explorer` |
| 实验类型 | `graph-exploration`（已存在于 ExperimentType） |

### 交互设计

**核心交互**：用户在柯尼斯堡地图上点击桥来选择路径，系统实时验证路径合法性。

```
┌─────────────────────────────────────┐
│  柯尼斯堡七桥地图（SVG）            │
│                                     │
│    [A] ───桥1─── [B]               │
│     │ ╲           │ ╲              │
│    桥2  桥3      桥4  桥5           │
│     │     ╲       │     ╲          │
│    [C] ───桥6─── [D]               │
│           │                         │
│          桥7                        │
│           │                         │
│    (河流区域)                       │
│                                     │
│  当前位置：B | 已走：2/7 桥         │
│  [重置] [撤销]                      │
└─────────────────────────────────────┘
```

**交互流程**：
1. 用户从任意区域（A/B/C/D）出发
2. 点击与当前位置相连的一座桥
3. 系统将用户移动到桥的另一端，标记桥为"已走过"
4. 如果当前区域没有未走过的桥可用，提示"此路不通"
5. 用户尝试走完所有 7 座桥 → 系统验证是否成功
6. 无论成功与否，引导面板展示：为什么这个问题没有解？

**引导发现**：
- Hint 1：记录你走过的桥和到达的区域
- Hint 2：观察每个区域连接了几座桥
- Hint 3：数一数每个区域的"度"（连接的桥数）
- Hint 4：想想奇数度的区域意味着什么

**关键发现**：
- 每个区域的"度"是关键：A(5)、B(3)、C(3)、D(3)
- 四个区域全是奇数度
- 欧拉路径存在的条件：奇数度顶点数为 0 或 2
- 柯尼斯堡有 4 个奇数度顶点 → 无解

### 需要新增的架构能力

| 能力 | 说明 | 复用前景 |
|------|------|----------|
| `graph.ts` | 图数据结构：Node、Edge、邻接表、度计算、路径验证 | 所有图论实验 |
| `GraphCanvas.tsx` | SVG 图渲染：节点、边、路径高亮、动画 | 所有图论实验 |
| `useGraphPath` hook | 路径追踪状态管理：当前位置、已走路径、可选边 | 路径类实验 |
| `graph-exploration` 范式落地 | 真正的图探索交互（非函数曲线上的 slider） | 后续图论实验 |

### 纯函数模块设计：`graph.ts`

```
// 类型
GraphNode { id: string; label: string; x: number; y: number }
GraphEdge { id: string; from: string; to: string; label?: string }
Graph { nodes: GraphNode[]; edges: GraphEdge[] }

// 函数
degreeOfNode(graph, nodeId) → number
adjacentEdges(graph, nodeId) → GraphEdge[]
hasEulerPath(graph) → { exists: boolean; reason: string }
hasEulerCircuit(graph) → { exists: boolean; reason: string }
validatePath(graph, path) → { valid: boolean; reason: string }
findDeadEnds(graph, visitedEdgeIds) → string[]
formatDegreeSequence(graph) → string
```

---

## 4. Euclid Axiom Builder：Phase 4.2

### 决策：是，应补齐 12/12 节点覆盖

理由：
- `euclid-axioms.json` 已有完整的实验配置
- 补全后达到 12/12 节点全覆盖，是 MVP 的重要里程碑
- 欧几里得公理系统是数学史上的关键转折——从"测量"到"证明"
- 与 Phase 4 的"证明与结构"主线一致：公理 → 推理 → 定理

### 数学史节点

| 字段 | 值 |
|------|-----|
| 节点 ID | `euclid-axioms` |
| 标题 | 《几何原本》：从五个公理出发 |
| 时代 | `ancient-greece` |
| 时间 | 约公元前 300 年 |
| 核心问题 | 如何从少数自明的公理出发，推导出整个几何学？ |
| 核心概念 | 公理、公设、定理、证明、逻辑推理 |
| 实验 ID | `euclid-axiom-builder` |

### ExperimentType 现状与决策

**现状**：`proof-builder` **不存在**于当前 ExperimentType 中。

当前 ExperimentType 定义（`src/types/timeline.ts:46-53`）：
```typescript
export type ExperimentType =
  | 'geometry-drag'
  | 'parameter-slider'
  | 'number-line'
  | 'simulation'
  | 'graph-exploration'
  | 'coordinate-plotter'
  | 'tangent-tracker';
```

**`euclid-axioms.json` 中标注的类型是 `parameter-slider`**，但这不准确。公理构建器的核心交互是**选择公理 → 观察推导 → 验证定理**，不是调整参数。

**决策建议**：新增 `proof-builder` 类型。

理由：
- 语义准确：用户构建证明，不是调整参数
- 与现有 7 种类型无重叠
- 需要修改 `src/types/timeline.ts` 的 ExperimentType 联合类型
- 需要修改 `docs/content/timeline-node-schema.md` 的类型文档
- 需要记录到 `docs/project/decision-log.md`（DEC-029）

**备选方案**：如果不引入新类型，可用 `parameter-slider`（当前 JSON 标注）或 `graph-exploration`（将公理视为节点，推导关系视为边），但语义均不够精确。

### 交互设计

```
┌─────────────────────────────────────────┐
│  目标定理：三角形内角和等于 180°        │
│                                         │
│  ┌─ 可选公理/公设 ─────────────────┐   │
│  │ ☐ 公设 1：两点确定一条直线      │   │
│  │ ☐ 公设 2：线段可以无限延长      │   │
│  │ ☐ 公设 3：以任意点为圆心、任意  │   │
│  │          距离为半径画圆          │   │
│  │ ☐ 公设 4：所有直角都相等        │   │
│  │ ☐ 公设 5：平行公设              │   │
│  │ ☐ 公理 1：等于同量的量相等      │   │
│  │ ☐ 公理 2：等量加等量仍相等      │   │
│  │ ...                             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [验证] → 推导链展示：                  │
│  公设1 + 公设4 → 外角定理              │
│  外角定理 + 公理2 → 内角和定理 ✓       │
│                                         │
│  [重置] [换个定理]                      │
└─────────────────────────────────────────┘
```

**交互流程**：
1. 系统展示一个目标定理（如"三角形内角和 = 180°"）
2. 用户从公设 + 公理列表中勾选需要的前提
3. 点击"验证"，系统检查所选公理是否足以推导目标定理
4. 如果足够：展示推导链（中间定理 → 最终定理），标记成功
5. 如果不够：提示"缺少关键前提"，给出暗示
6. 如果多余：提示"这些公理是足够的，但有些可能不需要"
7. 用户可以"换个定理"尝试不同的目标

**可选目标定理**（由简到难）：
1. 对顶角相等（L1）— 公设 1 + 公理 1
2. 等腰三角形两底角相等（L2）— 公设 1 + 公设 4 + 公理 1
3. 三角形内角和 = 180°（L3）— 公设 1 + 公设 4 + 公理 2
4. 勾股定理（L4）— 更多公理组合

**引导发现**：
- Hint 1：从最基础的公理开始
- Hint 2：想想需要哪些前提才能证明目标定理
- Hint 3：平行公设对三角形内角和至关重要
- Hint 4：试着画一个辅助线——你需要什么公理来保证它的存在？

### 需要新增的架构能力

| 能力 | 说明 | 复用前景 |
|------|------|----------|
| `proof.ts` | 公理/定理依赖图、推导链验证 | 证明类实验 |
| `ProofBuilderLab.tsx` | 公理选择 + 推导链展示 | 证明类实验 |
| `proof-builder` 类型 | 新 ExperimentType（需扩展 timeline.ts） | 证明类实验 |

### 纯函数模块设计：`proof.ts`

```
// 类型
Axiom { id: string; name: string; statement: string }
Theorem { id: string; name: string; statement: string; dependsOn: string[] }
ProofStep { axiomOrTheorem: string; result: string }

// 函数
canDerive(selectedAxioms, targetTheorem, theoremDatabase) → boolean
buildProofChain(selectedAxioms, targetTheorem, theoremDatabase) → ProofStep[]
findMinimalAxioms(targetTheorem, theoremDatabase) → string[]
getDependentTheorems(selectedAxioms, theoremDatabase) → Theorem[]
```

---

## 5. 挑战题系统 MVP：Phase 4.3

### 决策：是，应建立交互式挑战题系统（MVP 版本）

理由：
- 当前的 ChallengeCard 只是"看答案"的被动展示，没有验证和即时反馈
- 挑战题是学习闭环的关键一环：探索 → 发现 → **验证**
- 12 个节点 JSON 中已有 challenges 数据，只需升级 UI 和验证逻辑
- MVP 版本使用组件局部 state，不引入全局状态管理和持久化

### 当前状态

| 组件 | 状态 |
|------|------|
| `Challenge` 类型定义 | ✅ 存在于 `timeline.ts` |
| `ChallengeCard.tsx` | ✅ 被动展示（reveal-based），无交互评分 |
| 节点 JSON 中的 challenges | ✅ 12 个节点均有，每节点 2 题 |
| 答案验证逻辑 | ❌ 不存在 |
| 交互式答题组件 | ❌ 不存在 |

### MVP 范围定义

**Phase 4.3 包含**：

| 内容 | 说明 |
|------|------|
| Challenge 类型扩展 | 新增 `inputType`、`tolerance`、`caseSensitive` 字段（向后兼容） |
| `validation.ts` | 纯函数：答案验证逻辑（multiple-choice / numeric / text） |
| `ChallengeQuiz.tsx` | 交互式答题容器（组件局部 state，无全局 store） |
| 基础输入组件 | MultipleChoiceInput、NumericInput（UI 层） |
| `ChallengeResult.tsx` | 即时反馈展示（正确/错误 + 解释） |
| 与 ChallengeCard 并存 | ChallengeCard 保留为纯展示模式 |

**Phase 4.3 不包含（推迟到 Phase 5）**：

| 内容 | 推迟理由 |
|------|----------|
| `useChallengeStore`（Zustand） | MVP 先用组件局部 state 验证交互模式 |
| localStorage 持久化 | 需要先确定状态结构，MVP 后再加 |
| 跨页面进度追踪 | 需要全局 store + 持久化 |
| `ChallengeProgress` 进度条组件 | 依赖全局进度数据 |
| `/challenges` 独立页面 | MVP 先在节点详情页内验证 |
| 学习路径系统 | 依赖进度追踪，属于 Phase 5 |
| 用户账号 | 需要后端，属于 Phase 5+ |

### 数据层

**数据来源**：继续使用节点 JSON 中的 `challenges` 字段，不引入独立题库。

**Challenge 类型扩展**（向后兼容）：

```typescript
// 现有字段保持不变
interface Challenge {
  id: string;
  question: string;
  type: 'historical-recreation' | 'concept-application' | 'exploration' | 'cross-era';
  options?: string[];      // 现有：选择题选项
  answer: string;           // 现有：正确答案
  explanation: string;      // 现有：解释
  hints: string[];          // 现有：提示列表
  difficulty: Difficulty;   // 现有：难度

  // Phase 4.3 新增（可选，向后兼容）
  inputType?: 'multiple-choice' | 'numeric' | 'text';
  // 默认推断规则：有 options → multiple-choice，否则 → text
  tolerance?: number;       // numeric 类型的容差，默认 0
  caseSensitive?: boolean;  // text 类型是否区分大小写，默认 false
}
```

### 验证逻辑

```typescript
// src/lib/challenges/validation.ts（纯函数，无 DOM/React 依赖）

type UserAnswer = string | number;
type ValidationResult = { correct: boolean; feedback: string };

validateAnswer(challenge: Challenge, userAnswer: UserAnswer): ValidationResult

// 验证规则：
// multiple-choice: 精确匹配 answer 字段
// numeric: |userAnswer - parseFloat(answer)| <= (tolerance ?? 0)
// text: trim + 可选大小写不敏感 + 精确匹配 answer
```

### 答题交互

```
┌─────────────────────────────────────┐
│  挑战 1/2 · L2 · concept-application│
│                                     │
│  在毕达哥拉斯的面积验证实验中，      │
│  如果 a=3, b=4，那么 c² 等于多少？  │
│                                     │
│  ○ 12   ○ 25   ○ 7   ○ 49         │
│                                     │
│  [提交答案]                         │
│                                     │
│  提示（点击展开）                    │
│  > 提示 1：勾股定理公式是什么？      │
│  > 提示 2：a² + b² = ?              │
└─────────────────────────────────────┘
```

提交后（即时反馈）：

```
┌─────────────────────────────────────┐
│  ✓ 正确！                           │
│                                     │
│  a² + b² = 9 + 16 = 25 = c²       │
│                                     │
│  解释：这就是勾股定理的核心——       │
│  直角三角形两直角边的平方和等于      │
│  斜边的平方。                       │
│                                     │
│  [下一题] [再试一次]                │
└─────────────────────────────────────┘
```

### 状态管理（MVP：组件局部 state）

```typescript
// ChallengeQuiz.tsx 内部 useState
const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
const [userAnswer, setUserAnswer] = useState<string | number>('');
const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
const [hintsUsed, setHintsUsed] = useState(0);
const [showExplanation, setShowExplanation] = useState(false);

// 不使用 Zustand，不使用 localStorage
// 答题状态仅在当前页面会话中保留
// 刷新页面后重置
```

### 组件设计

| 组件 | 层级 | 职责 | Phase |
|------|------|------|-------|
| `ChallengeQuiz.tsx` | Feature | 交互式答题容器（局部 state） | 4.3 |
| `MultipleChoiceInput.tsx` | UI | 单选输入 | 4.3 |
| `NumericInput.tsx` | UI | 数值输入 | 4.3 |
| `ChallengeResult.tsx` | UI | 答题结果（正确/错误 + 解释） | 4.3 |

**与现有 ChallengeCard 的关系**：
- ChallengeCard 保留为纯展示模式（reveal-based，不验证答案）
- ChallengeQuiz 是交互模式（接收输入、验证、即时反馈）
- 两者并存，节点详情页可选择使用哪种模式

### 与节点详情页的集成

节点详情页当前使用 `<ChallengeCard challenges={node.challenges} />`。

Phase 4.3 集成方案：
- 将 `<ChallengeCard>` 替换为 `<ChallengeQuiz>`
- ChallengeQuiz 内部管理所有答题状态
- 不修改节点详情页的其他部分
- 不添加进度展示（进度追踪推迟到 Phase 5）

---

## 6. Phase 4 vs Phase 5 边界

### Phase 4 包含（3 个子阶段）

| 子阶段 | 内容 | 关键交付物 |
|--------|------|-----------|
| 4.1 | Euler Bridge Explorer | `graph.ts` + `GraphCanvas.tsx` + 七桥实验 |
| 4.2 | Euclid Axiom Builder | `proof.ts` + `ProofBuilderLab.tsx` + `proof-builder` 类型 |
| 4.3 | Challenge System MVP | `validation.ts` + `ChallengeQuiz.tsx` + 即时反馈 |

### Phase 5 包含

| 内容 | 说明 |
|------|------|
| 学习路径系统 | 预设路径（3~4 条）、`/paths` 页面、路径进度追踪 |
| 挑战题系统增强 | `useChallengeStore`（Zustand）、localStorage 持久化、跨页面进度追踪 |
| `ChallengeProgress` 组件 | 进度条、节点完成状态展示 |
| 自定义学习路径 | 用户创建自己的路径 |
| 进度面板 | 全局学习进度仪表盘 |
| 持久化学习记录 | localStorage → 后续可升级为云端 |

### Phase 5+ 推迟

| 内容 | 推迟理由 |
|------|----------|
| 用户账户系统 | 需要后端服务 |
| 数据库 / 云端同步 | 需要后端架构 |
| 搜索功能 | 非核心学习体验 |
| 社区贡献 | 需要审核流程 |
| AI 辅导 | 需要 LLM 集成 |
| 自动化测试 | 可在功能稳定后补充 |
| CI/CD | 可在发布前补充 |

---

## 7. 新增架构能力总览

### 纯函数模块

| 模块 | 路径 | 职责 | Phase |
|------|------|------|-------|
| `graph.ts` | `src/lib/math/` | 图数据结构、度计算、欧拉路径验证 | 4.1 |
| `proof.ts` | `src/lib/math/` | 公理/定理依赖图、推导链验证 | 4.2 |
| `validation.ts` | `src/lib/challenges/` | 答案验证逻辑（纯函数） | 4.3 |

### 组件

| 组件 | 路径 | 职责 | Phase |
|------|------|------|-------|
| `GraphCanvas.tsx` | `experiments/graph/` | SVG 图渲染（节点+边+路径高亮） | 4.1 |
| `BridgeExplorerLab.tsx` | `experiments/graph/` | 七桥探索实验 | 4.1 |
| `ProofBuilderLab.tsx` | `experiments/proof/` | 公理构建器实验 | 4.2 |
| `ChallengeQuiz.tsx` | `components/challenge/` | 交互式答题容器（局部 state） | 4.3 |
| `MultipleChoiceInput.tsx` | `components/ui/` | 单选输入 | 4.3 |
| `NumericInput.tsx` | `components/ui/` | 数值输入 | 4.3 |
| `ChallengeResult.tsx` | `components/ui/` | 答题结果展示 | 4.3 |

### Hooks

| Hook | 路径 | 职责 | Phase |
|------|------|------|-------|
| `useGraphPath` | `src/hooks/` | 图路径追踪状态 | 4.1 |

### 类型扩展

| 变更 | 文件 | 说明 | Phase |
|------|------|------|-------|
| ExperimentType 扩展 | `src/types/timeline.ts` | 新增 `'proof-builder'` | 4.2 |
| Challenge 类型扩展 | `src/types/timeline.ts` | 新增 `inputType?`、`tolerance?`、`caseSensitive?` | 4.3 |
| euclid-axioms.json 更新 | `data/nodes/ancient-greece/` | experiment.type 从 `parameter-slider` 改为 `proof-builder` | 4.2 |

### 不在 Phase 4 新增

| 能力 | 推迟到 |
|------|--------|
| `useChallengeStore`（Zustand） | Phase 5 |
| `ChallengeProgress` 组件 | Phase 5 |
| `useChallenge` hook | Phase 5 |
| `LearningPath` 类型 | Phase 5 |
| `data/learning-paths.json` | Phase 5 |
| `/paths` 页面 | Phase 5 |

---

## 8. 验收标准

### Phase 4.1：Euler Bridge Explorer

- [ ] `graph.ts` 纯函数模块可用（度计算、欧拉路径验证、路径合法性检查）
- [ ] `GraphCanvas.tsx` 可渲染柯尼斯堡七桥图（4 节点 + 7 边 + 河流区域）
- [ ] `BridgeExplorerLab.tsx` 可运行：点击桥选择路径、实时验证、重置/撤销
- [ ] 引导面板展示：奇数度顶点 → 欧拉路径条件 → 无解原因
- [ ] Registry 注册 `euler-bridge-explorer`（总计 14 个实验）
- [ ] `npm run lint` 通过
- [ ] `npm run build` 通过

### Phase 4.2：Euclid Axiom Builder

- [ ] `proof.ts` 纯函数模块可用（公理/定理依赖图、推导链验证）
- [ ] `ProofBuilderLab.tsx` 可运行：勾选公理、验证目标定理、展示推导链
- [ ] 至少 3 个目标定理可选（对顶角、等腰三角形、内角和）
- [ ] 引导面板展示：公理的独立性、推导的逻辑链
- [ ] ExperimentType 新增 `proof-builder`，记录 DEC-029
- [ ] `euclid-axioms.json` 的 experiment.type 更新为 `proof-builder`
- [ ] Registry 注册 `euclid-axiom-builder`（总计 15 个实验）
- [ ] `npm run lint` 通过
- [ ] `npm run build` 通过
- [ ] **12/12 节点全部有实验**（MVP 里程碑）

### Phase 4.3：Challenge System MVP

- [ ] Challenge 类型扩展完成（`inputType?`、`tolerance?`、`caseSensitive?`，向后兼容）
- [ ] `validation.ts` 纯函数可用（支持 multiple-choice / numeric / text 三种验证）
- [ ] `ChallengeQuiz.tsx` 可运行：展示题目、接收输入、验证答案、即时反馈、解释展示
- [ ] `MultipleChoiceInput.tsx` 和 `NumericInput.tsx` 可用
- [ ] `ChallengeResult.tsx` 可展示正确/错误状态 + 解释
- [ ] 至少 1 个节点的挑战题从 ChallengeCard（reveal 模式）切换为 ChallengeQuiz（交互模式）
- [ ] ChallengeCard 保留不动（纯展示模式仍可用）
- [ ] 不引入 Zustand、不使用 localStorage、不追踪跨页面进度
- [ ] `npm run lint` 通过
- [ ] `npm run build` 通过

### 总体验收

- [ ] 12/12 节点全部有互动实验（15 个注册实验）
- [ ] 挑战题系统从被动展示升级为交互验证（MVP 版本）
- [ ] 2 个新范式落地：graph-exploration（真正的图探索）、proof-builder（公理选择与推导）
- [ ] 3 个新纯函数模块：graph.ts、proof.ts、validation.ts
- [ ] 所有新模块遵循纯函数分离原则（无 DOM/React 依赖）
- [ ] 所有新组件遵循 ExperimentContainer / 组件分层规范
- [ ] `npm run lint` 通过（0 errors）
- [ ] `npm run build` 通过

---

## 9. 技术决策预判

| 编号 | 决策 | 选项 | 建议 |
|------|------|------|------|
| DEC-029 | Euclid 实验类型 | proof-builder（新）vs parameter-slider（现有）vs graph-exploration | proof-builder（语义最准确，需扩展 ExperimentType） |
| DEC-030 | graph.ts 放置位置 | `lib/math/` vs 新建 `lib/graph/` | `lib/math/`（与其他纯函数模块一致） |
| DEC-031 | Challenge MVP 状态管理 | 组件局部 state vs Zustand | 组件局部 state（MVP 验证交互模式，Phase 5 再加全局 store） |
| DEC-032 | Challenge 交互模式 | 替换 ChallengeCard vs 并存 | 并存（ChallengeCard 保留为纯展示模式） |
| DEC-033 | 图渲染技术 | SVG vs Canvas vs D3 | SVG（与现有实验一致，DOM 事件支持好） |
| DEC-034 | validation.ts 放置位置 | `lib/math/` vs `lib/challenges/` | `lib/challenges/`（验证逻辑不是数学纯函数，语义独立） |

---

## 10. 风险与缓解

| 风险 | 影响 | 缓解 |
|------|------|------|
| Euclid 公理构建器交互设计复杂 | 开发周期拉长 | 先做简化版（选择公理 → 验证定理），不做自由证明编辑 |
| 图渲染在移动端性能 | 7 条边 + 动画可能卡顿 | 使用 SVG（非 Canvas），限制动画帧率 |
| 挑战题答案格式多样 | 验证逻辑复杂 | 先支持 3 种基本类型（multiple-choice、numeric、text），不支持公式输入 |
| proof-builder 新类型影响面 | 需修改 type 定义 + JSON + 文档 | 改动范围明确，向后兼容（只新增不删除） |
| Challenge MVP 无持久化 | 用户刷新页面丢失答题状态 | 可接受——MVP 目标是验证交互模式，不是追踪进度 |

---

## 11. 总结

Phase 4 沿"从证明到结构"主线，完成三件事：

1. **Euler Bridge Explorer**（4.1）：图论的诞生，新增 `graph.ts` + `GraphCanvas.tsx`，落地 `graph-exploration` 范式
2. **Euclid Axiom Builder**（4.2）：证明的诞生，新增 `proof.ts` + `ProofBuilderLab.tsx`，引入 `proof-builder` 类型，补齐 12/12 节点全覆盖
3. **Challenge System MVP**（4.3）：学习验证闭环，新增 `validation.ts` + `ChallengeQuiz.tsx`，挑战题从被动展示升级为交互验证

关键里程碑：
- **12/12 节点全部有实验**（15 个注册实验）
- **8 种实验范式**（新增 graph-exploration 落地 + proof-builder 引入）
- **挑战题交互验证**（MVP：组件局部 state，Phase 5 再加持久化和进度追踪）

Phase 5 再考虑：学习路径系统、进度面板、自定义路径、Zustand 全局 store、localStorage 持久化。
