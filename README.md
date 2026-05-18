# MathOdyssey — 可视化数学史学习平台

## 项目是什么

MathOdyssey 是一个以数学史为主线的可视化学习平台。用户沿着历史时间轴探索数学概念的诞生过程，通过互动工具亲手体验数学如何被发明出来。

**核心理念**：数学不是需要记忆的公式，而是人类在解决真实问题过程中逐步发明的思维工具。

**核心体验**：用户在不同历史时代中，亲手体验数学概念如何被发明出来。

- 古埃及丈量土地 → 面积、比例、相似三角形
- 巴比伦天文计算 → 角度、60 进制、三角函数前置
- 希腊几何证明 → 公理、证明、欧几里得几何
- 代数符号发展 → 方程、未知数、配方法
- 笛卡尔坐标 → 函数图像、解析几何
- 牛顿和莱布尼茨 → 极限、导数、积分
- 概率论诞生 → 赌博问题、概率树、期望
- 现代计算数学 → 图论、矩阵、优化

## 为什么做

传统数学教育的问题：
1. **只给结论，不给过程**：学生记住公式，但不理解公式是怎么来的
2. **缺乏故事**：数学概念像凭空出现的定义，缺乏人文背景
3. **被动学习**：刷题为主，缺乏主动探索和发现的机会
4. **知识孤立**：知识点之间缺乏联系，学生看不到数学的全貌

MathOdyssey 通过历史故事和互动实验解决这些问题：
- **从问题出发**：每个概念从历史问题引入，而不是从定义开始
- **动手探索**：用户通过操作发现规律，而不是被动接受
- **历史连接**：展示概念之间的演进关系，构建知识网络
- **视觉化**：抽象概念通过图形变得可见和可操作

## 当前阶段

**Phase 4 已完成，准备进入 Phase 5**

- ✅ Phase 0（项目初始化）：文档体系、Schema、Next.js 项目
- ✅ Phase 1（MVP 原型）：12 节点 + 时间轴 + 4 个互动实验
- ✅ Phase 1.5（移动端适配）：时间轴触摸交互 + 版权声明
- ✅ Phase 2（从几何到代数）：5 个实验 + 2 个新范式（number-line、coordinate-plotter）
- ✅ Phase 3（从坐标到变化）：4 个实验 + 函数/微积分基础设施
- ✅ Phase 4（从证明到结构）：2 个实验 + 挑战题系统 + 12/12 节点全覆盖

详见 [项目路线图](docs/project/roadmap.md)。

## 如何启动

### 环境要求

- Node.js 18+
- npm 或 yarn 或 pnpm

### 安装与运行

```bash
# 克隆项目
git clone <repository-url>
cd MathOdyssey

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行代码检查
npm run lint

# 格式化代码
npm run format
```

## 目录结构

```
MathOdyssey/
├── src/                          # 源代码
│   ├── app/                      # Next.js App Router 页面
│   ├── components/               # React 组件
│   │   ├── ui/                   # 基础 UI 组件
│   │   ├── layout/               # 布局组件
│   │   ├── timeline/             # 时间轴组件
│   │   ├── experiments/          # 互动实验组件
│   │   ├── content/              # 内容展示组件
│   │   └── math/                 # 数学公式组件
│   ├── lib/                      # 工具函数
│   ├── hooks/                    # 自定义 Hooks
│   ├── types/                    # TypeScript 类型
│   └── styles/                   # 样式
│
├── data/                         # 内容数据
│   ├── schema/                   # JSON Schema
│   ├── nodes/                    # 时间轴节点数据（按时代分目录）
│   ├── experiments/              # 实验配置数据
│   ├── concepts/                 # 概念关系数据
│   └── challenges/               # 挑战问题数据
│
├── docs/                         # 项目文档
│   ├── product/                  # 产品文档
│   │   ├── vision.md             # 项目愿景
│   │   └── product-architecture.md  # 产品架构
│   ├── content/                  # 内容文档
│   │   ├── content-system.md     # 内容体系
│   │   ├── timeline-node-schema.md  # 数据 Schema
│   │   └── mvp-nodes.md          # MVP 节点规划
│   ├── engineering/              # 技术文档
│   │   └── technical-architecture.md  # 技术架构
│   └── project/                  # 项目管理
│       ├── roadmap.md            # 项目路线图
│       ├── backlog.md            # 任务管理
│       ├── decision-log.md       # 决策记录
│       └── adr/                  # 架构决策记录
│
├── public/                       # 静态资源
├── CLAUDE.md                     # Claude Code 协作规范
└── README.md                     # 本文件
```

## 内容如何维护

### 数据结构

每个数学史节点是一个 JSON 文件，遵循统一的 Schema 定义。详见 [timeline-node-schema.md](docs/content/timeline-node-schema.md)。

```json
{
  "id": "pythagoras-theorem",
  "title": "毕达哥拉斯与和谐的几何",
  "era": "ancient-greece",
  "timePeriod": { "start": -530, "end": -495, "display": "约公元前 530 年" },
  "historicalProblem": "琴弦长度的整数比产生和谐音，这与直角三角形有什么关系？",
  "narrative": { ... },
  "mathConcepts": [ ... ],
  "learningObjectives": [ ... ],
  "experiments": [ ... ],
  "challenges": [ ... ]
}
```

### 添加新节点

1. 在 `data/nodes/{era}/` 下创建新的 JSON 文件
2. 参考 [timeline-node-schema.md](docs/content/timeline-node-schema.md) 填写字段
3. 参考 [content-system.md](docs/content/content-system.md) 的编写规范
4. 验证 JSON 格式和类型正确性
5. 更新 `docs/content/mvp-nodes.md` 或对应的内容规划文档

### 内容质量标准

- 历史叙述标注可信度（A-E 五级）
- 数学公式使用 LaTeX 格式
- 学习目标使用 Bloom 分类法
- 难度标注使用 L1-L5 五级
- 提供参考来源

## 互动实验如何扩展

### 实验架构

每个互动实验是一个独立的 React 组件，通过 `experimentId` 加载对应的配置数据。

```
TimelineNode (JSON)
├── experiments: Experiment[]     ← 实验配置数据
│   └── id: string               ← 实验唯一标识
└── 页面渲染时
    └── <ExperimentComponent id={experiment.id} />  ← 加载实验组件
```

### 添加新实验

1. 在 `data/experiments/{type}/` 下创建实验配置 JSON
2. 在 `src/components/experiments/{type}/` 下创建实验组件
3. 实验组件通过 props 接收配置，不包含历史叙述
4. 在节点 JSON 的 `experiments` 数组中引用实验 ID
5. 参考 [content-system.md](docs/content/content-system.md) 的实验设计规范

### 实验类型

| 类型 | 目录 | 技术 | 示例 | 状态 |
|------|------|------|------|------|
| 几何实验 | `experiments/geometry/` | SVG | 拖拽点、面积验证 | 2 个实验 |
| 数值系统 | `experiments/number-system/` | Slider + 可视化 | 进制转换、数轴运算 | 1 个实验 |
| 概率实验 | `experiments/probability/` | D3 + Canvas | 掷骰子、频率统计 | 1 个实验 |
| 坐标实验 | `experiments/coordinate/` | SVG + 拖拽 | 坐标探索器、函数曲线 | Phase 2 新增 |

## 项目路线图

| 阶段 | 名称 | 核心目标 | 状态 |
|------|------|----------|------|
| Phase 0 | 项目初始化 | 基础设施和文档体系 | ✅ 完成 |
| Phase 1 | MVP 原型 | 12 节点 + 时间轴 + 4 个实验 | ✅ 完成 |
| Phase 1.5 | 移动端适配 | 时间轴触摸交互 | ✅ 完成 |
| Phase 2 | 从几何到代数 | 5 个实验 + 2 个新范式 | ✅ 完成 |
| Phase 3 | 从坐标到变化 | 函数图像 + 变化率 + 切线 + 积分 | ✅ 完成 |
| Phase 4 | 从证明到结构 | 图论 + 公理 + 挑战题 | ✅ 完成 |
| Phase 5 | 产品化和发布 | 性能优化 + SEO + 部署 | ⬜ 待开始 |

详见 [项目路线图](docs/project/roadmap.md)。

## 协作规范

### 开发流程

1. **阅读文档**：开发前阅读相关文档（vision、schema、architecture）
2. **实现功能**：遵循组件分层和代码风格规范
3. **更新文档**：完成后更新 backlog、roadmap、decision-log
4. **自检**：运行 lint、build，检查类型安全和响应式布局
5. **提交**：使用规范的 commit message

### 关键原则

- **文档先行**：不要在没有更新文档的情况下直接写功能
- **MVP 聚焦**：不要随意扩大 MVP 范围
- **内容与代码分离**：数学内容存在 JSON 文件中，不硬编码在组件里
- **实验独立**：互动实验组件不包含历史叙述
- **类型安全**：所有数据结构使用 TypeScript 类型约束

详见 [CLAUDE.md](CLAUDE.md)。

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 16 (App Router) | 应用框架 |
| TypeScript 5.0+ | 类型安全 |
| React 18+ | UI 框架 |
| Tailwind CSS 3.4+ | 样式系统 |
| KaTeX | 数学公式渲染 |
| D3.js | 数据驱动可视化 |
| Framer Motion | 动画 |
| Zustand | 状态管理 |

## 文档索引

| 文档 | 说明 |
|------|------|
| [项目愿景](docs/product/vision.md) | 项目定位、目标用户、核心体验 |
| [产品架构](docs/product/product-architecture.md) | 核心模块、用户路径、系统设计 |
| [内容体系](docs/content/content-system.md) | 节点结构、实验设计、质量标准 |
| [数据 Schema](docs/content/timeline-node-schema.md) | TimelineNode 类型定义 |
| [MVP 节点](docs/content/mvp-nodes.md) | 12 个 MVP 节点的详细规划 |
| [技术架构](docs/engineering/technical-architecture.md) | 技术栈、目录结构、组件分层 |
| [项目路线图](docs/project/roadmap.md) | 阶段划分、交付物、验收标准 |
| [任务管理](docs/project/backlog.md) | Epic、Feature、Task 列表 |
| [决策记录](docs/project/decision-log.md) | 关键决策的背景和理由 |
| [ADR](docs/project/adr/) | 架构决策记录 |
| [协作规范](CLAUDE.md) | Claude Code 工作规范 |

## 版权声明

Copyright 2026 lzytttttt

本项目基于 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) 开源发布。

你可以自由使用、修改和分发本项目的代码，但需遵守 Apache 2.0 协议的条款，包括保留版权声明和许可证副本。详见 [LICENSE](LICENSE) 文件。
