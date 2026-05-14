# Phase 1 就绪审查

- 日期：2026-05-14
- 审查范围：项目全部文档体系（12 个文件）
- 目的：评估是否具备进入 Phase 1 MVP 开发的条件

---

## 审查结论

**可以进入 Phase 1 开发，但有 4 个问题必须在写第一行业务代码前修复。**

文档体系整体质量高、结构完整、思路清晰。核心问题是部分文档之间存在不一致，如果不修复会导致开发过程中产生歧义和返工。

---

## 一、文档间不一致问题

### 问题 1（必须修复）：MVP 实验数量与路线图矛盾

**现象：**

| 文档 | 描述 |
|------|------|
| `roadmap.md` Phase 1 | "基础互动实验（4 类）：几何、代数、概率、微积分各 1 个" — 共 4 个实验 |
| `mvp-nodes.md` | 12 个节点每个都有实验描述 — 共 12+ 个实验 |
| `backlog.md` 开发顺序 | 实验任务在"第四批（Phase 2 实验）" — Phase 1 不含实验 |

**矛盾点：**
- roadmap 说 Phase 1 有 4 个实验，但 backlog 把所有实验放在 Phase 2
- mvp-nodes.md 给 12 个节点都设计了实验，但 Phase 1 只实现 4 个
- 那另外 8 个节点在 Phase 1 是"有内容但无实验"的状态吗？

**必须明确：** Phase 1 的 12 个节点是否都包含实验？如果是，哪 4 个是"高质量完整实验"，哪 8 个是"基础占位实验"？如果不是，那 8 个没有实验的节点如何展示？

**建议修复：** 在 roadmap.md 中明确 Phase 1 的实验策略，例如：
- Phase 1：4 个节点有完整互动实验，其余 8 个节点只有内容卡片（历史叙述 + 数学概念 + 学习目标），实验入口标记为"即将推出"
- Phase 2：补全所有 12 个节点的实验

---

### 问题 2（必须修复）：挑战问题存储位置矛盾

**现象：**

| 文档 | 描述 |
|------|------|
| `timeline-node-schema.md` | `TimelineNode.challenges: Challenge[]` — 挑战问题内嵌在节点数据中 |
| `technical-architecture.md` 数据目录 | `data/challenges/challenge-bank.json` — 挑战问题独立存储 |
| `roadmap.md` Phase 1 | "基础挑战问题：每个节点 2-3 道题" |

**矛盾点：**
- 如果挑战问题内嵌在节点 JSON 中，为什么还需要 `challenge-bank.json`？
- 如果有独立的题库文件，节点中的 `challenges` 字段是冗余的吗？

**必须明确：** 挑战问题的权威数据源在哪里？

**建议修复：** MVP 阶段采用内嵌方案（challenges 字段在节点 JSON 中），删除 `data/challenges/` 目录规划。未来如果需要独立题库（如随机出题、跨节点组卷），再引入 `challenge-bank.json` 作为扩展。

---

### 问题 3（必须修复）：实验类型枚举与实际节点不匹配

**现象：**

| 文档 | 实验类型 |
|------|----------|
| `timeline-node-schema.md` ExperimentType | `geometry-drag`, `parameter-slider`, `simulation`, `number-line`, `graph-exploration`, `axiom-builder`, `proof-walkthrough` — 7 种 |
| `mvp-nodes.md` 实际实验 | SVG 拖拽(5), 滑块/控件(3), 数轴操作(1), 模拟器(1), 路径探索(1), 公理构建(1) — 6 种 |

**不匹配：**
- Schema 定义了 `proof-walkthrough` 类型，但 MVP 节点中没有使用
- Schema 没有明确的"模拟器"类型对应 mvp-nodes 中的"掷骰子模拟器"
- `parameter-slider` 和"滑块/控件"对应关系不明确

**建议修复：** 对齐 ExperimentType 枚举与实际使用的实验类型。MVP 阶段只定义实际使用的类型，不预留未使用的类型。

---

### 问题 4（必须修复）：content-system.md 与 schema 不一致

**现象：**

| 文档 | 接口 |
|------|------|
| `content-system.md` | 定义了 `ConceptMapping` 接口（historicalEvent, mathConcept, whyConnected, modernForm, curriculumMapping） |
| `timeline-node-schema.md` | TimelineNode 中没有 `ConceptMapping`，只有 `relatedConcepts: ConceptRelation[]` |
| `content-system.md` | 定义了 `ExperimentStructure`（scene, interaction, discovery, interpretation） |
| `timeline-node-schema.md` | 定义了 `Experiment`（id, title, description, type, scene, interaction, guidance, estimatedMinutes） |

**不匹配：**
- `ConceptMapping` 在 content-system.md 中定义，但没有出现在 schema 中
- `ExperimentStructure` 和 `Experiment` 接口字段不同（discovery vs guidance, interpretation vs 无）
- 说明 content-system.md 和 timeline-node-schema.md 是独立编写的，未交叉验证

**建议修复：** 以 `timeline-node-schema.md` 为权威来源，更新 `content-system.md` 中的接口定义，确保一致。`ConceptMapping` 如果是辅助概念而非数据结构，应明确说明。

---

## 二、MVP 范围过大风险

### 风险 1：12 个节点的内容编写量大

每个节点需要：
- 历史叙述（hook + context + problem + discovery，200-400 字）
- 2-3 个数学概念（名称、定义、公式、分类）
- 3-5 个学习目标
- 1-2 个互动实验（含场景、交互、引导配置）
- 2-3 个挑战问题（含答案、解析、提示）
- 现代连接、标签、参考资料

**估算：** 每个节点约 1000-2000 字内容 + 实验配置。12 个节点 = 12000-24000 字内容。

**风险：** 内容编写可能成为瓶颈，尤其是历史叙述需要学术准确性。

**建议：** Phase 1 先完成 4 个核心节点的完整内容（含实验），其余 8 个节点先完成基础内容（不含实验），在 Phase 2 补全。

### 风险 2：部分实验实现复杂度高

| 实验 | 复杂度 | 风险 |
|------|--------|------|
| 欧几里得公理构建器 | 高 | 需要实现逻辑推理引擎 |
| 坐标探索器（方程→图像） | 高 | 需要函数解析和图像渲染 |
| 七桥探索器 | 中 | 需要图论路径检测 |
| 切线追踪器 | 中 | 需要微积分计算 |

**建议：** Phase 1 优先实现低复杂度实验（丈量土地、毕达哥拉斯面积、进制转换、掷骰子），高复杂度实验推到 Phase 2。

### 风险 3：挑战问题需要学术审核

挑战问题需要：
- 数学正确性
- 历史准确性
- 难度适当性
- 提示的有效性

**建议：** Phase 1 每个节点只做 2 道基础挑战问题，不做自动评分，只做展示。

---

## 三、技术架构不清晰之处

### 不清晰 1：时间轴缩放算法未定义

**问题：** 时间跨度从公元前 3000 年到现代（约 5000 年），但 12 个节点集中在公元前 2000 年到公元 18 世纪。如何设计比例尺？

- 线性缩放：古代节点挤在一起，现代节点间距过大
- 对数缩放：不同时代间距更均匀，但不直观
- 分段缩放：不同时代使用不同比例

**建议：** 在 technical-architecture.md 中补充时间轴比例尺设计，至少说明采用哪种策略。

### 不清晰 2：移动端响应策略未定义

**问题：** roadmap.md 说"响应式设计：支持桌面和平板"，但没有说明：
- 时间轴在平板上如何操作？（触摸缩放/平移）
- 节点详情页在平板上是单列还是双列？
- 互动实验在触摸屏上如何交互？（拖拽 vs 点击）

**建议：** 在 technical-architecture.md 中补充移动端适配策略。

### 不清晰 3：数据加载方式未明确

**问题：** technical-architecture.md 提到 `lib/data/nodes.ts` 用于"节点数据加载"，但没有说明：
- 是在 Server Component 中直接 `import` JSON 文件？
- 还是通过 `fetch` 从 API 路由获取？
- 还是在构建时静态导入？

对于 Next.js App Router，这会影响：
- 是否需要 API 路由
- 数据是否被打包到客户端 bundle 中
- SSR 还是 SSG

**建议：** 明确数据加载方式。推荐在 Server Component 中直接 `import` JSON（构建时静态导入），不需要 API 路由。

### 不清晰 4：实验组件注册机制未定义

**问题：** 架构说"实验组件通过 experimentId 加载对应配置"，但没有说明：
- 如何从 `experimentId` 映射到具体的 React 组件？
- 是硬编码映射表？还是动态导入？
- 新增实验时是否需要修改代码？

**建议：** 定义实验注册机制，例如：

```typescript
// lib/experiments/registry.ts
const experimentRegistry: Record<string, React.ComponentType<ExperimentProps>> = {
  'pythagoras-area-proof': PythagorasAreaProof,
  'dice-simulation': DiceSimulation,
  // ...
};
```

### 不清晰 5：Headless UI 的角色不明确

**问题：** technical-architecture.md 列出 Headless UI 作为依赖，但没有说明：
- 哪些组件使用 Headless UI？
- 是必须依赖还是可选？
- MVP 阶段是否需要？

**建议：** MVP 阶段不引入 Headless UI，自行实现简单的 UI 组件。Phase 2+ 根据需要引入。

---

## 四、Schema 可扩展性问题

### 问题 1：Era 枚举硬编码

Era 是一个硬编码的字符串联合类型。新增时代（如"前哥伦布美洲"）需要修改类型定义。

**建议：** MVP 阶段可以接受硬编码（12 个时代足够）。Phase 3+ 考虑改为从配置文件加载。

### 问题 2：无 Schema 版本号

TimelineNode 没有 `schemaVersion` 字段。未来如果 Schema 变更，无法自动迁移旧数据。

**建议：** 在 TimelineNode 中添加 `schemaVersion: number` 字段，当前值为 `1`。

### 问题 3：实验数据内嵌 vs 分离

当前实验数据内嵌在节点 JSON 中（`experiments: Experiment[]`）。如果多个节点共享同一个实验（如"面积验证"可用于多个几何节点），会有数据冗余。

**建议：** MVP 阶段接受内嵌（简单直接）。Phase 3+ 如果需要共享实验，引入实验 ID 引用机制。

### 问题 4：Challenge 类型不支持交互式题目

Challenge 的 `answer` 字段是 `string` 类型，只支持文本答案。不支持：
- 拖拽排序
- 图形选择
- 交互式验证

**建议：** MVP 阶段只支持文本答案和选择题。Phase 3+ 扩展 Challenge 类型。

### 问题 5：无国际化支持

所有文本字段（title, narrative, mathConcepts 等）都是单语言字符串。未来多语言需要重构整个数据结构。

**建议：** MVP 阶段只支持中文，不考虑国际化。Phase 5+ 如果需要多语言，采用"每种语言一个 JSON 文件"的策略（如 `pythagoras-theorem.zh.json`, `pythagoras-theorem.en.json`）。

### 问题 6：Visual 接口过于简单

Visual 只有 `src: string`，没有结构化的元数据（如宽高比、许可证、alt 文本的多语言版本）。

**建议：** MVP 阶段足够。Phase 3+ 扩展。

---

## 五、额外建议

### 建议 1：补充 glossary.md（术语表）

项目涉及大量数学术语和历史术语，建议建立术语表确保一致性。例如：
- "穷竭法" vs "穷举法"
- "面积完成法" vs "配方法"
- "欧几里得" vs "欧基里德"（译名统一）

**优先级：** 低，可在 Phase 1 内容编写时逐步积累。

### 建议 2：补充 content-style-guide.md（内容风格指南）

content-system.md 定义了结构和规范，但缺乏具体的写作风格指南：
- 叙述的语气（严肃 vs 轻松？学术 vs 口语？）
- 句子长度限制
- 专有名词处理规则
- 图片/插图的使用规范

**优先级：** 中，建议在 Phase 1 内容编写前补充。

### 建议 3：明确 Next.js 版本策略

技术栈写"Next.js 14+"，但 Next.js 15 已发布。是否使用最新版本？App Router 在不同版本间有差异。

**建议：** 明确使用 Next.js 15（最新稳定版），除非有兼容性问题。

---

## 六、Phase 0 完成度检查

| 交付物 | 状态 | 备注 |
|--------|------|------|
| 项目愿景文档 | ✅ 完成 | 内容完整、清晰 |
| 产品架构文档 | ✅ 完成 | 需微调实验分类 |
| 内容体系文档 | ⚠️ 需修复 | 与 schema 有不一致 |
| 技术架构文档 | ⚠️ 需补充 | 缺少缩放算法、移动端策略、数据加载方式 |
| 项目路线图 | ⚠️ 需修复 | Phase 1 实验范围不明确 |
| 任务管理文档 | ⚠️ 需修复 | Phase 分配与路线图不一致 |
| 决策记录 | ✅ 完成 | 5 个决策记录清晰 |
| ADR | ✅ 完成 | ADR-0001 内容完整 |
| 数据 Schema | ✅ 完成 | 类型定义完整 |
| MVP 节点规划 | ✅ 完成 | 12 个节点规划详细 |
| CLAUDE.md | ✅ 完成 | 协作规范清晰 |
| README.md | ✅ 完成 | 项目说明完整 |

---

## 七、必须在 Phase 1 开始前修复的问题清单

| 编号 | 问题 | 严重程度 | 涉及文档 | 修复方式 |
|------|------|----------|----------|----------|
| FIX-1 | Phase 1 实验范围不明确 | 必须修复 | roadmap.md, backlog.md | 明确 Phase 1 有 4 个完整实验，其余 8 个节点无实验 |
| FIX-2 | 挑战问题存储位置矛盾 | 必须修复 | technical-architecture.md | MVP 采用内嵌方案，删除 challenge-bank.json |
| FIX-3 | ExperimentType 与实际节点不匹配 | 必须修复 | timeline-node-schema.md | 对齐枚举与实际使用 |
| FIX-4 | content-system.md 与 schema 不一致 | 必须修复 | content-system.md | 以 schema 为权威，更新 content-system.md |

---

## 八、建议在 Phase 1 开始前补充的内容

| 编号 | 内容 | 优先级 | 涉及文档 |
|------|------|--------|----------|
| SUP-1 | 时间轴比例尺设计 | 高 | technical-architecture.md |
| SUP-2 | 移动端适配策略 | 高 | technical-architecture.md |
| SUP-3 | 数据加载方式说明 | 高 | technical-architecture.md |
| SUP-4 | 实验组件注册机制 | 高 | technical-architecture.md |
| SUP-5 | 内容风格指南 | 中 | 新建 content-style-guide.md |
| SUP-6 | Schema 版本号字段 | 低 | timeline-node-schema.md |

---

## 九、最终判断

**可以进入 Phase 1 开发。**

前提条件：完成 FIX-1 ~ FIX-4 的修复（预计 1-2 小时文档工作量）。

修复后，项目具备以下条件：
- ✅ 清晰的项目愿景和目标用户
- ✅ 完整的产品架构和用户路径
- ✅ 可操作的内容 Schema 和编写规范
- ✅ 明确的技术栈和目录结构
- ✅ 可执行的路线图和任务分解
- ✅ 5 个关键决策有据可查
- ✅ 12 个 MVP 节点有详细规划
- ✅ Claude Code 协作规范完整

Phase 1 的第一个开发任务：T-01-01-01（创建 Next.js 14 项目）。
