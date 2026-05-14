# 技术架构文档

## 推荐技术栈

### 核心框架

| 技术 | 版本 | 用途 | 选型理由 |
|------|------|------|----------|
| Next.js | 14+ (App Router) | 应用框架 | SSR/SSG、文件路由、React Server Components |
| TypeScript | 5.0+ | 类型安全 | 编译时错误检查、IDE 支持、数据结构约束 |
| React | 18+ | UI 框架 | 组件化、生态成熟、可视化库兼容性好 |

### 样式与 UI

| 技术 | 版本 | 用途 | 选型理由 |
|------|------|------|----------|
| Tailwind CSS | 3.4+ | 样式系统 | 实用类优先、响应式支持、与组件配合好 |
| Headless UI | 1.x+ | 无障碍组件 | 提供基础交互组件，样式完全可控 |

### 可视化

| 技术 | 用途 | 选型理由 |
|------|------|----------|
| SVG | 几何实验、时间轴 | 矢量、可交互、适合几何图形 |
| Canvas (2D) | 高性能动画 | 大量元素渲染、粒子效果 |
| D3.js | 数据驱动可视化 | 图表、力导向图、数据绑定 |
| Framer Motion | 动画库 | 声明式动画、React 集成好 |

### 数学渲染

| 技术 | 用途 | 选型理由 |
|------|------|----------|
| KaTeX | 数学公式渲染 | 性能优秀、SSR 支持、体积小 |

### 内容管理

| 技术 | 用途 | 选型理由 |
|------|------|----------|
| JSON 文件 | 结构化内容数据 | 版本控制、类型安全、零外部依赖 |
| gray-matter | JSON 前置数据解析 | 简单易用 |
| Zod | 数据验证 | TypeScript 集成、运行时验证 |

### 开发工具

| 技术 | 用途 |
|------|------|
| ESLint | 代码规范 |
| Prettier | 代码格式化 |
| Husky | Git hooks |
| lint-staged | 暂存文件检查 |

## 前端目录结构

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页（时间轴）
│   ├── globals.css               # 全局样式
│   ├── timeline/
│   │   └── [nodeId]/
│   │       └── page.tsx          # 节点详情页
│   ├── experiments/
│   │   └── [experimentId]/
│   │       └── page.tsx          # 实验独立页
│   ├── graph/
│   │   └── page.tsx              # 概念图谱页
│   └── about/
│       └── page.tsx              # 关于页面
│
├── components/                   # 组件目录
│   ├── ui/                       # 基础 UI 组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Tabs.tsx
│   │   └── Tooltip.tsx
│   ├── layout/                   # 布局组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── PageContainer.tsx
│   ├── timeline/                 # 时间轴组件
│   │   ├── TimelineCanvas.tsx    # 时间轴主画布
│   │   ├── TimelineNode.tsx      # 时间轴上的节点
│   │   ├── TimelineControls.tsx  # 缩放、平移控件
│   │   ├── EraMarker.tsx         # 时代标记
│   │   └── TimelineTooltip.tsx   # 节点提示
│   ├── graph/                    # 概念图谱组件
│   │   ├── GraphCanvas.tsx       # 图谱画布
│   │   ├── GraphNode.tsx         # 图谱节点
│   │   └── GraphEdge.tsx         # 图谱边
│   ├── experiments/              # 互动实验组件
│   │   ├── ExperimentContainer.tsx  # 实验容器
│   │   ├── geometry/             # 几何实验
│   │   │   ├── DraggablePoint.tsx
│   │   │   ├── ShapeRenderer.tsx
│   │   │   └── GeometryCanvas.tsx
│   │   ├── algebra/              # 代数实验
│   │   │   ├── ParameterSlider.tsx
│   │   │   ├── EquationDisplay.tsx
│   │   │   └── AreaCompletion.tsx
│   │   ├── probability/          # 概率实验
│   │   │   ├── DiceSimulator.tsx
│   │   │   ├── CoinFlipper.tsx
│   │   │   └── FrequencyChart.tsx
│   │   └── calculus/             # 微积分实验
│   │       ├── TangentLine.tsx
│   │       ├── LimitVisualizer.tsx
│   │       └── IntegralArea.tsx
│   ├── content/                  # 内容展示组件
│   │   ├── NodeCard.tsx          # 节点摘要卡片
│   │   ├── NarrativeCard.tsx     # 历史叙述卡片
│   │   ├── ConceptCard.tsx       # 概念解释卡片
│   │   ├── ObjectiveCard.tsx     # 学习目标卡片
│   │   ├── ChallengeCard.tsx     # 挑战问题卡片
│   │   └── ExperimentEntry.tsx   # 实验入口卡片
│   └── math/                     # 数学相关组件
│       ├── FormulaDisplay.tsx    # 公式展示
│       ├── MathBlock.tsx         # 块级公式
│       ├── MathInline.tsx        # 行内公式
│       └── NumberLine.tsx        # 数轴
│
├── lib/                          # 工具函数
│   ├── math/                     # 数学工具
│   │   ├── geometry.ts           # 几何计算
│   │   ├── algebra.ts            # 代数计算
│   │   └── statistics.ts         # 统计计算
│   ├── data/                     # 数据工具
│   │   ├── nodes.ts              # 节点数据加载
│   │   ├── experiments.ts        # 实验数据加载
│   │   └── validation.ts         # 数据验证
│   ├── visualization/            # 可视化工具
│   │   ├── svg.ts                # SVG 工具函数
│   │   ├── canvas.ts             # Canvas 工具函数
│   │   └── scales.ts             # 比例尺
│   └── utils.ts                  # 通用工具函数
│
├── hooks/                        # 自定义 Hooks
│   ├── useTimeline.ts            # 时间轴状态
│   ├── useExperiment.ts          # 实验状态
│   ├── useDrag.ts                # 拖拽交互
│   ├── useZoom.ts                # 缩放交互
│   └── useFormula.ts             # 公式渲染
│
├── types/                        # 类型定义
│   ├── timeline.ts               # 时间轴类型
│   ├── node.ts                   # 节点类型
│   ├── experiment.ts             # 实验类型
│   ├── concept.ts                # 概念类型
│   └── challenge.ts              # 挑战问题类型
│
└── styles/                       # 样式
    ├── tokens.ts                 # 设计令牌
    ├── typography.ts             # 排版
    └── animations.ts             # 动画
```

## 数据目录结构

```
data/
├── schema/                       # 数据 Schema
│   ├── timeline-node.schema.json # 节点 JSON Schema
│   ├── experiment.schema.json    # 实验 JSON Schema
│   └── concept.schema.json       # 概念 JSON Schema
│
├── nodes/                        # 时间轴节点数据
│   ├── index.ts                  # 节点索引
│   ├── ancient-egypt/
│   │   └── egypt-land-measurement.json
│   ├── ancient-babylon/
│   │   └── babylon-base60.json
│   ├── ancient-greece/
│   │   ├── pythagoras-theorem.json
│   │   ├── euclid-axioms.json
│   │   └── archimedes-area.json
│   ├── ancient-china/
│   │   └── china-chicken-rabbit.json
│   ├── ancient-india/
│   │   └── brahmagupta-zero.json
│   ├── islamic-golden-age/
│   │   └── al-khwarizmi-algebra.json
│   ├── early-modern/
│   │   ├── descartes-coordinates.json
│   │   ├── newton-leibniz-calculus.json
│   │   └── pascal-fermat-probability.json
│   └── 18th-century/
│       └── euler-graph-theory.json
│
├── experiments/                  # 实验配置数据
│   ├── geometry/
│   │   ├── pythagoras-area-proof.json
│   │   └── euclid-axiom-builder.json
│   ├── algebra/
│   │   ├── egypt-fractions.json
│   │   └── area-completion.json
│   ├── probability/
│   │   └── dice-simulation.json
│   └── calculus/
│       └── tangent-tracker.json
│
├── concepts/                     # 概念关系数据
│   └── concept-graph.json
│
└── paths/                        # 学习路径数据（Phase 4）
    ├── geometry-birth.json
    ├── algebra-evolution.json
    └── calculus-intuition.json

注：MVP 阶段挑战问题内嵌在节点 JSON 的 challenges 字段中，
不使用独立的 challenge-bank.json。未来如需独立题库（随机出题、跨节点组卷），
再引入 data/challenges/ 目录。
```

## 组件分层

### 分层架构

```
┌─────────────────────────────────────────┐
│              页面层 (Pages)              │
│  app/timeline/[nodeId]/page.tsx         │
│  组合布局和功能组件，处理路由和数据加载     │
├─────────────────────────────────────────┤
│            功能层 (Features)             │
│  components/timeline/                   │
│  components/experiments/                │
│  实现特定功能的复合组件                   │
├─────────────────────────────────────────┤
│            业务层 (Business)             │
│  components/content/                    │
│  components/math/                       │
│  处理业务逻辑的组件                       │
├─────────────────────────────────────────┤
│            基础层 (UI)                   │
│  components/ui/                         │
│  通用、无业务逻辑的 UI 组件               │
└─────────────────────────────────────────┘
```

### 层间依赖规则

- 页面层 → 功能层、业务层、基础层
- 功能层 → 业务层、基础层
- 业务层 → 基础层
- 基础层 → 不依赖其他层

### 组件设计原则

1. **单一职责**：每个组件只做一件事
2. **数据驱动**：组件通过 props 接收数据，不自行加载
3. **可组合**：小组件组合成大组件
4. **无内容依赖**：组件不硬编码数学内容

## 可视化模块设计

### 架构

```
┌─────────────────────────────────────────┐
│          应用层 (Application)            │
│  时间轴、概念图谱、互动实验               │
├─────────────────────────────────────────┤
│          组件层 (Components)             │
│  TimelineCanvas, GraphCanvas,           │
│  GeometryCanvas, etc.                   │
├─────────────────────────────────────────┤
│          渲染层 (Rendering)              │
│  SVGRenderer, CanvasRenderer,           │
│  D3Layout, AnimationController          │
├─────────────────────────────────────────┤
│          计算层 (Computation)            │
│  GeometryMath, AlgebraMath,             │
│  StatisticsMath, ScaleFunctions         │
└─────────────────────────────────────────┘
```

### 时间轴可视化

- **技术**：SVG
- **核心交互**：缩放（滚轮）、平移（拖拽）、节点点击
- **渲染策略**：视口裁剪（只渲染可见区域的节点）
- **缩放级别**：远看显示时代分组，近看显示具体节点

### 概念图谱可视化

- **技术**：Canvas + D3 force-directed layout
- **核心交互**：缩放、拖拽节点、点击查看详情
- **布局算法**：力导向布局，节点按时代着色
- **性能优化**：大量节点时使用 Canvas 而非 SVG

### 互动实验可视化

- **几何实验**：SVG（精确、可交互、DOM 事件）
- **函数图像**：Canvas（高性能渲染、像素级控制）
- **概率模拟**：D3 + SVG（数据驱动图表）
- **动画**：Framer Motion（声明式动画、React 集成）

## 内容渲染方案

### 静态内容（RSC）

页面中不涉及交互的内容使用 React Server Components 渲染：
- 历史叙述
- 学习目标
- 参考资料
- 节点元数据

### 动态内容（Client Components）

需要交互的内容使用 Client Components：
- 互动实验
- 挑战问题
- 时间轴
- 概念图谱

### 公式渲染

使用 KaTeX 渲染数学公式：
- 行内公式：`$a^2 + b^2 = c^2$`
- 块级公式：`$$\int_0^1 f(x) dx$$`
- 支持服务端渲染（SSR）

### 内容加载策略

```typescript
// 1. 从 JSON 文件加载节点数据
const nodes = getAllNodes();

// 2. 使用 TypeScript 类型约束
const node: TimelineNode = getNodeById(nodeId);

// 3. 渲染时根据类型分发
<NodeRenderer node={node} />
```

## 路由设计

### 路由表

| 路由 | 页面 | 渲染方式 | 说明 |
|------|------|----------|------|
| `/` | 首页 | RSC + Client | 时间轴主页 |
| `/timeline/[nodeId]` | 节点详情 | RSC + Client | 历史叙述(RSC) + 实验(Client) |
| `/experiments/[experimentId]` | 实验页 | Client | 独立实验页面 |
| `/graph` | 概念图谱 | Client | 知识图谱可视化 |
| `/challenges` | 挑战题库 | RSC | 挑战问题列表 |
| `/about` | 关于 | RSC | 项目介绍 |

### 动态路由

- `/timeline/[nodeId]`：nodeId 对应 `data/nodes/` 下的 JSON 文件名
- `/experiments/[experimentId]`：experimentId 对应实验配置文件名

### 导航结构

```
首页（时间轴）
├── 点击节点 → /timeline/[nodeId]
│   ├── 点击实验 → /experiments/[experimentId]
│   ├── 点击相关节点 → /timeline/[relatedNodeId]
│   └── 返回时间轴 → /
├── 点击图谱 → /graph
│   └── 点击节点 → /timeline/[nodeId]
└── 点击挑战 → /challenges
```

## 状态管理建议

### 状态分类

| 状态类型 | 存储方式 | 示例 |
|----------|----------|------|
| URL 状态 | URL 参数/查询字符串 | 当前节点、筛选条件 |
| 全局 UI 状态 | Zustand store | 时间轴位置、缩放级别 |
| 实验状态 | 组件内部 state | 拖拽位置、滑块值 |
| 用户偏好 | localStorage | 主题、语言设置 |
| 内容数据 | Server Components | 节点数据、概念数据 |

### Zustand Store 设计

```typescript
// stores/timelineStore.ts
interface TimelineStore {
  // 时间轴状态
  viewportStart: number;
  viewportEnd: number;
  zoomLevel: number;
  selectedNodeId: string | null;

  // 操作
  setViewport: (start: number, end: number) => void;
  zoom: (factor: number) => void;
  selectNode: (nodeId: string | null) => void;
}
```

### 实验状态管理

每个实验组件内部管理自己的状态，不使用全局状态。通过 props 接收初始配置，通过回调函数通知外部。

```typescript
interface ExperimentState {
  // 交互状态
  dragPosition: { x: number; y: number };
  sliderValue: number;

  // 发现状态
  discoveries: string[];
  isCompleted: boolean;
}
```

## 公式渲染方案

### KaTeX 集成

```typescript
// components/math/FormulaDisplay.tsx
import katex from 'katex';

interface FormulaDisplayProps {
  formula: string;
  displayMode?: boolean;
}
```

### 使用规范

| 场景 | 格式 | 示例 |
|------|------|------|
| 行内公式 | `$...$` | 勾股定理 $a^2 + b^2 = c^2$ |
| 块级公式 | `$$...$$` | $$\int_0^1 f(x) dx$$ |
| 自定义宏 | 配置文件 | `\RR → \mathbb{R}` |

### 常用 LaTeX 宏

```typescript
const macros = {
  '\\RR': '\\mathbb{R}',
  '\\NN': '\\mathbb{N}',
  '\\ZZ': '\\mathbb{Z}',
  '\\QQ': '\\mathbb{Q}',
  '\\CC': '\\mathbb{C}',
  '\\dx': '\\,dx',
  '\\dy': '\\,dy',
};
```

## 未来接入数据库或 CMS 的扩展方式

### 适配器模式

通过定义标准接口，实现数据源的可替换：

```typescript
// lib/data/adapter.ts
interface ContentAdapter {
  getAllNodes(): Promise<TimelineNode[]>;
  getNodeById(id: string): Promise<TimelineNode | null>;
  getNodesByEra(era: Era): Promise<TimelineNode[]>;
  getExperiments(): Promise<Experiment[]>;
  getConceptGraph(): Promise<ConceptGraph>;
}
```

### 实现方案

| 阶段 | 数据源 | 适配器实现 |
|------|--------|------------|
| MVP | 本地 JSON 文件 | `LocalFileAdapter` |
| Phase 3 | Contentlayer / Velite | `ContentlayerAdapter` |
| Phase 3+ | Headless CMS (Sanity/Strapi) | `CMSAdapter` |
| Phase 4+ | Database (PostgreSQL) | `DatabaseAdapter` |

### 迁移策略

1. MVP 阶段使用 `LocalFileAdapter`，直接读取 JSON 文件
2. Phase 3 引入 `ContentlayerAdapter`，支持 MDX 和内容校验
3. Phase 3+ 可选接入 Headless CMS，通过 `CMSAdapter` 统一接口
4. 所有适配器实现相同的 `ContentAdapter` 接口，应用层代码无需修改

### 环境变量配置

```env
# 数据源选择
CONTENT_SOURCE=local  # local | contentlayer | cms | database

# CMS 配置（Phase 3+）
CMS_PROJECT_ID=xxx
CMS_DATASET=production

# 数据库配置（Phase 4+）
DATABASE_URL=postgresql://...
```
