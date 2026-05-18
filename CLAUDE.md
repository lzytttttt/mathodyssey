# CLAUDE.md — Claude Code 协作规范

## 项目简介

MathOdyssey 是一个以数学史为主线的可视化学习平台。用户沿着历史时间轴探索数学概念的诞生过程，通过互动工具亲手体验数学如何被发明出来。

核心理念：数学不是需要记忆的公式，而是人类在解决真实问题过程中逐步发明的思维工具。

## 项目目标

1. 降低数学学习的门槛，让用户通过历史故事和动手操作建立数学直觉
2. 展示数学概念之间的历史和逻辑联系
3. 提供一种全新的数学学习方式：发现问题 → 探索 → 发现规律 → 理解概念

## 当前阶段

**Phase 4 已完成，准备进入 Phase 5**

- Phase 0（项目初始化）：✅ 全部完成
- Phase 1（MVP 原型）：✅ 全部完成（12 节点 + 时间轴 + 4 个实验）
- Phase 1.5（移动端适配）：✅ 全部完成
- Phase 2（从几何到代数）：✅ 全部完成（5 个实验 + 2 个新范式）
- Phase 3（从坐标到变化）：✅ 全部完成（4 个实验 + 微积分基础设施）
- Phase 4（从证明到结构）：✅ 全部完成（2 个实验 + 挑战题系统 + 12/12 覆盖）

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14+ (App Router) | 应用框架 |
| TypeScript | 5.0+ | 类型安全 |
| React | 18+ | UI 框架 |
| Tailwind CSS | 3.4+ | 样式系统 |
| KaTeX | 最新 | 数学公式渲染 |
| D3.js | 最新 | 数据驱动可视化 |
| Framer Motion | 最新 | 动画 |
| Zustand | 最新 | 状态管理 |

## 目录结构说明

```
MathOdyssey/
├── src/
│   ├── app/              # Next.js App Router 页面
│   ├── components/       # React 组件
│   │   ├── ui/           # 基础 UI 组件（Button, Card, Modal...）
│   │   ├── layout/       # 布局组件（Header, Footer...）
│   │   ├── timeline/     # 时间轴组件
│   │   ├── experiments/  # 互动实验组件
│   │   ├── content/      # 内容展示组件
│   │   └── math/         # 数学公式组件
│   ├── lib/              # 工具函数
│   ├── hooks/            # 自定义 Hooks
│   ├── types/            # TypeScript 类型
│   └── styles/           # 样式
├── data/                 # 内容数据（JSON）
│   ├── schema/           # JSON Schema
│   ├── nodes/            # 时间轴节点数据
│   ├── experiments/      # 实验配置数据
│   ├── concepts/         # 概念关系数据
│   └── challenges/       # 挑战问题数据
├── docs/                 # 项目文档
│   ├── product/          # 产品文档
│   ├── content/          # 内容文档
│   ├── engineering/      # 技术文档
│   └── project/          # 项目管理文档
├── public/               # 静态资源
└── CLAUDE.md             # 本文件
```

## 开发原则

### 基本原则

1. **文档先行**：不要在没有更新文档的情况下直接写功能
2. **MVP 聚焦**：不要随意扩大 MVP 范围，严格遵守 roadmap 中的阶段划分
3. **内容与代码分离**：数学内容存在 JSON 文件中，不要硬编码在组件里
4. **实验独立**：互动实验组件不包含历史叙述，通过 props 接收配置
5. **渐进增强**：先实现核心功能，再添加增强效果
6. **类型安全**：所有数据结构使用 TypeScript 类型约束

### 设计原则

1. **用户是探索者**：设计交互时，让用户主动操作，而不是被动观看
2. **发现优先**：先让用户自己发现规律，再给出数学解释
3. **视觉化**：抽象概念必须通过图形、动画变得可见
4. **历史驱动**：每个概念从历史问题出发，不是从定义出发

## 内容原则

1. **历史叙述是引子，互动实验是核心**
2. **每个节点聚焦一个核心数学概念**
3. **难度标注要准确**（L1-L5 五级）
4. **历史事实标注可信度**（A-E 五级）
5. **公式使用 LaTeX 格式**
6. **内容面向学习者，不是面向数学史专家**

## 组件设计原则

1. **单一职责**：每个组件只做一件事
2. **数据驱动**：通过 props 接收数据，不自行加载
3. **可组合**：小组件组合成大组件
4. **无内容依赖**：组件不硬编码数学内容
5. **响应式**：支持桌面和平板

### 组件分层

```
页面层 (Pages)       → 组合布局和功能组件
功能层 (Features)    → 实现特定功能的复合组件
业务层 (Business)    → 处理业务逻辑的组件
基础层 (UI)          → 通用、无业务逻辑的 UI 组件
```

层间依赖：页面 → 功能 → 业务 → 基础，不可反向依赖。

## 可视化设计原则

1. **SVG 用于几何实验**：精确、可交互、DOM 事件支持好
2. **Canvas 用于高性能场景**：大量元素、粒子效果
3. **D3 用于数据可视化**：图表、力导向图
4. **Framer Motion 用于动画**：声明式、React 集成好
5. **视口裁剪**：只渲染可见区域，优化性能

## 每次改代码前必须阅读的文档

| 场景 | 必读文档 |
|------|----------|
| 写任何功能代码 | `docs/product/vision.md`（理解项目目标） |
| 修改数据结构 | `docs/content/timeline-node-schema.md`（Schema 定义） |
| 写互动实验 | `docs/content/content-system.md`（实验设计规范） |
| 修改路由 | `docs/engineering/technical-architecture.md`（路由设计） |
| 修改组件 | `docs/engineering/technical-architecture.md`（组件分层） |
| 添加新节点 | `docs/content/mvp-nodes.md`（节点规划） |
| 做技术决策 | `docs/project/decision-log.md`（已有决策） |
| 规划新功能 | `docs/project/backlog.md`（任务管理） |

## 每次完成任务后必须更新的文档

| 完成内容 | 需更新的文档 |
|----------|-------------|
| 完成一个 Feature | `docs/project/backlog.md`（更新状态） |
| 做了技术决策 | `docs/project/decision-log.md`（记录决策） |
| 完成一个 Phase | `docs/project/roadmap.md`（更新进度） |
| 修改数据结构 | `docs/content/timeline-node-schema.md`（更新 Schema） |
| 添加新节点 | `docs/content/mvp-nodes.md`（更新节点列表） |
| 做了架构变更 | `docs/engineering/technical-architecture.md`（更新架构） |

## 不允许做的事情

1. **不要在没有更新文档的情况下直接写功能**
2. **不要随意扩大 MVP 范围**
3. **不要把数学内容硬编码在组件里**
4. **不要把互动实验和历史内容强耦合**
5. **不要用临时 Demo 代码污染长期架构**
6. **不要跳过 TypeScript 类型定义**
7. **不要引入未经评估的第三方库**
8. **不要在组件中直接读取 JSON 文件**（通过 lib/data 层）
9. **不要在实验组件中包含历史叙述**
10. **不要在没有参考来源的情况下编造历史事实**

## 代码风格

### 通用规则

- 使用 TypeScript 严格模式
- 使用 ESLint + Prettier 格式化代码
- 使用单引号、分号、2 空格缩进
- 每行不超过 100 字符
- 使用有意义的变量名，避免缩写

### React 规则

- 优先使用函数组件和 Hooks
- 使用 React Server Components（RSC）处理静态内容
- 使用 Client Components 处理交互内容
- 组件文件使用 PascalCase 命名
- 自定义 Hook 使用 `use` 前缀

### 文件命名

| 类型 | 命名规范 | 示例 |
|------|----------|------|
| 组件 | PascalCase.tsx | `TimelineCanvas.tsx` |
| Hook | camelCase.ts | `useTimeline.ts` |
| 工具函数 | camelCase.ts | `geometry.ts` |
| 类型定义 | camelCase.ts | `timeline.ts` |
| 数据文件 | kebab-case.json | `pythagoras-theorem.json` |
| 页面文件 | page.tsx | `app/timeline/[nodeId]/page.tsx` |
| 布局文件 | layout.tsx | `app/layout.tsx` |

## 命名规范

### 变量和函数

- 使用 camelCase：`timelinePosition`, `handleNodeClick`
- 布尔值使用 `is/has/should` 前缀：`isCompleted`, `hasError`
- 事件处理函数使用 `handle` 前缀：`handleDrag`, `handleZoom`
- 回调函数使用 `on` 前缀：`onNodeClick`, `onComplete`

### 组件

- 使用 PascalCase：`TimelineCanvas`, `ExperimentContainer`
- 容器组件使用 `Container` 后缀：`ExperimentContainer`
- 展示组件使用描述性名称：`NodeCard`, `FormulaDisplay`

### 类型和接口

- 使用 PascalCase：`TimelineNode`, `Experiment`
- 接口不使用 `I` 前缀
- 类型使用 `type` 关键字，接口使用 `interface` 关键字

### CSS 类名

- 使用 Tailwind CSS 实用类
- 条件类名使用 `clsx` 或模板字符串

### 数据文件

- 使用 kebab-case：`pythagoras-theorem.json`
- ID 使用 kebab-case：`pythagoras-theorem`
- 时代使用 kebab-case：`ancient-greece`

## 提交前自检清单

在每次提交代码前，检查以下内容：

### 文档
- [ ] 是否更新了相关文档？（backlog、roadmap、decision-log）
- [ ] 是否阅读了相关文档？（vision、schema、architecture）

### 代码质量
- [ ] `npm run lint` 是否通过？
- [ ] `npm run build` 是否通过？
- [ ] TypeScript 类型是否完整？
- [ ] 是否有 `any` 类型？（应避免）

### 架构
- [ ] 组件是否遵循分层原则？
- [ ] 是否有内容硬编码在组件中？
- [ ] 实验组件是否独立于历史叙述？
- [ ] 数据是否通过 lib/data 层加载？

### 功能
- [ ] 功能是否在 MVP 范围内？
- [ ] 是否引入了未经评估的依赖？
- [ ] 交互是否流畅？
- [ ] 响应式布局是否正常？

### 内容
- [ ] 数学公式是否正确？
- [ ] 历史事实是否有参考来源？
- [ ] 难度标注是否准确？
- [ ] 可信度标注是否完整？
