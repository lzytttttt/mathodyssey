# 决策记录

本文件记录 MathOdyssey 项目的关键技术与产品决策。每个决策记录包含背景、选项、取舍和结果。详细的架构决策记录（ADR）存放在 `adr/` 目录。

---

## DEC-001: 采用时间轴作为主交互

- 日期：2026-05-14
- 状态：已决定
- 关联 ADR：无

### 背景

需要选择一个核心交互模式作为平台的主入口和导航方式。用户需要在不同历史时期和数学概念之间进行探索。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 知识图谱 | 展示概念关联、支持非线性探索 | 学习曲线高、信息密度过大 |
| 课程列表 | 结构清晰、易于实现 | 缺乏历史感、像传统教材 |
| 故事线 | 叙事感强、沉浸式体验 | 不易浏览全局、难以选择起点 |
| **水平时间轴** | **符合历史线性演进、直观易懂、支持缩放探索** | **需要处理跨文化并行发展** |

### 取舍

时间轴的线性特性可能无法完美呈现不同文明的并行发展。通过地理位置标记和时代分组来缓解。

### 结果

采用水平时间轴作为主交互。支持缩放、平移、节点点击。后续可补充图谱视图作为辅助。

---

## DEC-002: 第一版聚焦 MVP

- 日期：2026-05-14
- 状态：已决定
- 关联 ADR：无

### 背景

项目是长期工程，需要决定第一版的范围。可选策略包括：完整平台、内容优先、交互优先、最小可用版本。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 完整平台 | 功能全面 | 开发周期长、风险高 |
| 内容优先 | 内容丰富 | 缺乏互动、难以验证体验 |
| 交互优先 | 技术验证 | 缺乏内容、难以展示价值 |
| **最小可用版本** | **快速验证、迭代灵活** | **功能有限、可能影响第一印象** |

### 取舍

MVP 可能导致内容量较少（12 个节点），用户可能觉得平台"内容不够"。需要在节点选择上确保覆盖足够广的时代和概念类型。

### 结果

采用 MVP 策略：12 个精选节点 + 4 类互动实验 + 基础时间轴。快速验证核心假设，通过用户反馈指导后续迭代。

---

## DEC-003: 使用结构化内容数据

- 日期：2026-05-14
- 状态：已决定
- 关联 ADR：[ADR-0001](adr/0001-use-structured-content-data.md)

### 背景

需要选择内容存储和管理方案，平衡开发效率、类型安全和未来可扩展性。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| MDX 文件 | 富文本支持 | 结构不统一、类型检查困难 |
| Headless CMS | 可视化编辑 | 外部依赖、MVP 阶段过重 |
| 数据库 | 查询灵活 | 需要后端服务 |
| **本地 JSON + TypeScript** | **类型安全、零依赖、易迁移** | **无可视化编辑器** |

### 取舍

本地 JSON 方案缺乏可视化编辑界面，非开发者编辑内容需要了解 JSON 格式。通过 JSON Schema 验证和内容编写指南缓解。

### 结果

采用 TypeScript 类型定义 + 本地 JSON 文件。详见 ADR-0001。

---

## DEC-004: 互动实验先轻后重

- 日期：2026-05-14
- 状态：已决定
- 关联 ADR：无

### 背景

互动实验是平台核心价值，但实现复杂度差异很大：从简单的 SVG 拖拽到复杂的物理模拟器。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 轻量交互 (SVG/Canvas) | 开发快、易于迭代 | 交互丰富度有限 |
| 中等复杂度 (D3 + 动画库) | 视觉效果好 | 开发周期中等 |
| 重型模拟 (物理引擎) | 体验沉浸 | 开发周期长、维护成本高 |
| **渐进式方案** | **快速验证、逐步提升** | **初期可能体验不够精致** |

### 取舍

初期轻量交互可能无法完全展现数学实验的精妙之处。需要在交互设计上下功夫，用巧妙的设计弥补技术复杂度的不足。

### 结果

Phase 1 采用 SVG + 简单交互实现基础实验。Phase 2 引入 D3 和动画库增强视觉效果。后续根据用户反馈决定是否引入更复杂的技术。

---

## DEC-005: 技术栈选择 Next.js + TypeScript + React

- 日期：2026-05-14
- 状态：已决定
- 关联 ADR：无

### 背景

需要选择前端技术栈，考虑因素包括：SSR/SSG 支持、生态系统、开发效率、可视化库兼容性、长期维护性。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| Next.js + React | SSR/SSG、生态系统成熟、Vercel 部署便捷 | React 学习曲线 |
| Nuxt.js + Vue | 易上手、模板语法直观 | Vue 可视化生态稍弱 |
| SvelteKit | 性能优秀、语法简洁 | 生态系统较小 |
| Astro | 内容站性能极佳 | 交互能力有限 |

### 取舍

Next.js 的 App Router 模式仍在演进中，可能遇到 breaking changes。但其 SSR/SSG 能力和 React 生态系统是内容型平台的最佳选择。

### 结果

采用 Next.js 14 (App Router) + TypeScript 5.0+ + React 18+。样式使用 Tailwind CSS，可视化使用 SVG/Canvas/D3，公式渲染使用 KaTeX。

---

## DEC-006: 采用动态 import 加载 JSON 数据

- 日期：2026-05-14
- 状态：已决定
- 关联 ADR：无

### 背景

需要选择在 Next.js 中加载节点 JSON 数据的方式。可选方案包括：直接 import、动态 import、fetch API、文件系统读取。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 直接 import | 简单、类型安全 | 打包时全量加载 |
| 动态 import | 按需加载、代码分割 | 需要异步处理 |
| fetch API | 灵活、可对接 API | 需要额外配置 |
| 文件系统读取 | 服务端高效 | 仅限服务端 |

### 取舍

动态 import 方案支持代码分割，每个节点页面只加载需要的数据。虽然需要异步处理，但与 Next.js 的 App Router 和 generateStaticParams 配合良好。

### 结果

采用动态 import 方案。数据加载函数在 `src/lib/data/nodes.ts` 中定义，通过 `import()` 动态加载 JSON 文件。页面使用 `async/await` 获取数据。

---

## DEC-007: 互动实验架构 — 注册表 + 容器 + 按类型分目录

- 日期：2026-05-14
- 状态：已决定
- 关联 ADR：无

### 背景

需要设计互动实验的组件架构，支持 4 种实验类型（geometry-drag、parameter-slider、simulation、tangent-tracker），每种类型有多个实验。需要考虑代码复用、按需加载、类型安全。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 全部放在一个目录 | 简单 | 文件多了难维护 |
| 按 experimentId 分目录 | 每个实验独立 | 共享组件难以复用 |
| **按类型分目录 + 注册表** | **类型内共享组件、按需加载** | **需要维护注册表** |
| 动态文件系统扫描 | 无需手动注册 | SSR 兼容性差、类型不安全 |

### 取舍

注册表方案需要手动维护 experimentId 到组件的映射，但提供了类型安全和明确的依赖关系。按类型分目录（geometry/、algebra/、probability/、calculus/）使得同类型实验可以共享基础组件（如 DraggablePoint）。

### 结果

采用三层架构：
1. **注册表** (`src/lib/experiments/registry.ts`)：experimentId → 动态 import 映射
2. **容器** (`src/components/experiments/ExperimentContainer.tsx`)：统一布局（场景描述 + 画布 + 结果 + 引导）
3. **按类型分目录**：`geometry/`、`algebra/` 等子目录存放具体实验组件

实验页面 (`/experiments/[experimentId]`) 先查注册表，有组件则渲染交互版本，否则显示"即将推出"占位符。

---

## DEC-008: 几何渲染辅助函数放入 lib/math/geometry.ts

- 日期：2026-05-14
- 状态：已决定
- 关联 ADR：无

### 背景

几何实验需要计算正方形顶点（附着在三角形边外侧）。可选方案：内联在组件 JSX 中、放在组件文件顶部、放入公共 geometry.ts。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 内联 JSX | 最简单 | 计算与渲染混杂，不可测试 |
| 组件顶部纯函数 | 局部清晰 | 不可跨组件复用 |
| **lib/math/geometry.ts** | **可复用、可测试、职责清晰** | **需要维护公共模块** |
| 独立 lib/visualization/ 目录 | 关注点分离 | MVP 阶段过度拆分 |

### 取舍

`squareOnEdgeAwayFromPoint` 使用向量叉积自动判断正方形方向，适用于任何三角形场景。放入 geometry.ts 使得后续几何实验（如欧几里得公理构建器）可直接复用，无需复制粘贴。

### 结果

几何计算纯函数（`pythagoreanHypotenuse`、`squareOnEdgeAwayFromPoint` 等）统一放入 `src/lib/math/geometry.ts`。组件只负责渲染和状态管理。

---

## DEC-009: 数值系统实验归入 number-system 目录

- 日期：2026-05-14
- 状态：已决定
- 关联 ADR：无

### 背景

Babylonian Base Conversion Lab 是第一个非几何实验。需要决定其组件目录和数学工具模块的归属。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 放入 geometry/ | 目录少 | 语义不对，进制转换不是几何 |
| 放入 algebra/ | 数学分类准确 | 与鸡兔同笼等代数实验混杂 |
| **新建 number-system/** | **语义清晰，可容纳进制、数轴等** | **多一个目录** |
| 放入通用 experiments/ | 无分类 | 实验多了难找 |

### 取舍

number-system 目录可容纳后续的进制探索（12 进制、2 进制）、数轴操作（零与负数）等实验。algebra/ 目录留给方程、鸡兔同笼等真正的代数实验。

### 结果

- 组件目录：`src/components/experiments/number-system/`
- 数学工具：`src/lib/math/numberSystems.ts`（进制转换纯函数）
- 后续的数轴实验（brahmagupta-zero）也可放入此目录

---

## DEC-010: 概率实验归入 probability 目录，纯函数独立为 probability.ts

- 日期：2026-05-14
- 状态：已决定
- 关联 ADR：无

### 背景

Pascal Dice Simulation Lab 是第一个概率/模拟类型实验。需要决定组件目录和随机/统计函数的归属。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 放入 number-system/ | 目录少 | 语义不对，概率不是数系 |
| 放入 algebra/ | 通用 | 概率与代数差异大 |
| **新建 probability/** | **语义清晰** | **多一个目录** |
| 统计函数放入 geometry.ts | 少建文件 | 语义不对 |

### 取舍

probability 目录可容纳后续的大数定律可视化、概率分布探索等实验。`probability.ts` 中的 `rollDie`、`diceSumDistribution`、`frequencyTable` 等函数是纯数学工具，不应与几何或进制函数混放。

### 结果

- 组件目录：`src/components/experiments/probability/`
- 数学工具：`src/lib/math/probability.ts`（随机模拟 + 统计纯函数）
- 后续概率实验（如大数定律可视化）放入同一目录

---

## DEC-011: 时间轴交互采用 Pointer Events 统一鼠标和触摸

- 日期：2026-05-14
- 状态：已决定
- 关联 ADR：无

### 背景

Phase 1 Final Review 发现 TimelineCanvas 仅使用鼠标事件（onMouseDown/onMouseMove/onMouseUp/onWheel），移动端触摸无法操作时间轴。这是进入 Phase 2 前的 P1 阻塞项。需要选择移动端适配方案。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 分别处理 mouse + touch 事件 | 逻辑直观 | 两套代码、touch 手势需手动解析 |
| Hammer.js / react-use-gesture | 功能丰富 | 引入第三方依赖（违反 CLAUDE.md） |
| **Pointer Events（统一 API）** | **一套代码覆盖鼠标/触摸/触控笔、W3C 标准** | **需处理多指追踪** |

### 取舍

Pointer Events 是 W3C 标准，浏览器支持良好（>96%）。使用 `pointerId` 追踪多个触点，天然支持 pinch-to-zoom。项目已有 `useDrag` hook 使用 Pointer Events，保持一致性。不需要引入第三方库，符合 CLAUDE.md 约束。

### 结果

- 抽取 `useTimelinePanZoom` hook，使用 Pointer Events 处理单指平移和双指缩放
- 保留 `onWheel` 处理桌面端滚轮缩放
- 容器设置 `touch-action: 'none'` 防止浏览器默认手势拦截
- 通过 `setPointerCapture` 确保指针移出容器后仍能接收事件
- 点击 vs 拖拽通过移动距离阈值（5px）区分

---

## DEC-012: Phase 2 主线选择"从几何到代数"

- 日期：2026-05-14
- 状态：已决定
- 关联文档：`docs/project/phase-2-planning.md`

### 背景

Phase 1 完成 4 个实验（丈量土地、毕达哥拉斯面积、进制转换、掷骰子），覆盖 3 种范式（geometry-drag、parameter-slider、simulation）。8 个节点待实现实验。需要决定 Phase 2 的主线和实验选择。

### 选项

| 方案 | 主线 | 实验数 | 优点 | 缺点 |
|------|------|--------|------|------|
| A. 补全所有 8 个 | 无主线 | 8 | 全部完成 | 范围过大、无叙事连贯性 |
| B. 代数诞生 | 几何→代数 | 5 | 叙事连贯、为 Phase 3 铺路 | 暂缓微积分和图论 |
| C. 微积分之路 | 极限→导数 | 4 | 数学深度高 | 前置架构未就绪（需坐标系） |
| D. 跨文化数学 | 各文明代表 | 6 | 覆盖面广 | 叙事散乱、技术跳跃 |

### 取舍

方案 B（代数诞生）的 5 个实验形成清晰的历史弧线：公理化方法 → 逼近思想 → 代数符号 → 数系扩展 → 坐标几何。这条弧线延续 Phase 1 的"测量"主题，推进到"抽象思维"，同时为 Phase 3 微积分建立坐标系基础设施。

方案 A 范围过大，违反 MVP 聚焦原则。方案 C 的微积分实验需要函数曲线渲染能力，而该能力依赖坐标系组件（coordinate-plotter），属于循环依赖。方案 D 叙事散乱，用户体验不佳。

### 结果

- Phase 2 主线确定为"从几何到代数"
- 5 个实验：鸡兔同笼、多边形逼近、面积完成法、数轴运算、坐标探索器
- 3 个实验推迟到 Phase 3：欧几里得公理构建器、牛顿切线追踪器、欧拉七桥探索
- 概念图谱推迟到 Phase 3+

---

## DEC-013: Phase 2 暂不进入微积分和图论

- 日期：2026-05-14
- 状态：已决定
- 关联决策：DEC-012

### 背景

8 个待实现节点中包含微积分（newton-tangent-tracker）和图论（euler-bridge-explorer）实验。需要决定是否在 Phase 2 实现。

### 取舍

**微积分实验（tangent-tracker）**：需要函数曲线渲染能力（FunctionCurve 组件），而 FunctionCurve 依赖坐标平面组件（CoordinatePlane）。CoordinatePlane 是 Phase 3 坐标探索器建立的基础设施。因此 tangent-tracker 的正确顺序是：Phase 2 建立 CoordinatePlane → Phase 3 在此基础上实现 FunctionCurve → Phase 3 实现 tangent-tracker。

**图论实验（euler-bridge-explorer）**：graph-exploration 是全新范式，需要节点-边图的渲染和路径交互。与"从几何到代数"主线关联较弱，且实现复杂度高。

**公理构建器（euclid-axiom-builder）**：toggle 交互模式需要独立设计，"从公理推导定理"的反馈机制复杂，不适合在 Phase 2 与 5 个实验并行开发。

### 结果

- 微积分实验推迟到 Phase 3（CoordinatePlane 建立后）
- 图论实验推迟到 Phase 3（独立新范式）
- 公理构建器推迟到 Phase 3（独立交互设计）
- Phase 2 聚焦 5 个实验，不扩大范围

---

## DEC-014: 新建 algebra.ts 纯函数模块

- 日期：2026-05-14
- 状态：已决定
- 关联决策：DEC-008

### 背景

Phase 2.2 鸡兔同笼实验需要纯函数模块。需要决定函数放在哪个文件。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 放入 geometry.ts | 已有模块，无需新建 | 鸡兔同笼不是几何问题，语义不匹配 |
| 放入 numberSystems.ts | 已有模块 | 已有模块语义是进制/数系，不匹配 |
| 新建 algebra.ts | 语义准确，Phase 2 代数主线专用 | 多一个文件 |

### 结果

新建 `src/lib/math/algebra.ts`。理由：
- 鸡兔同笼是代数问题（方程组），不是几何问题
- Phase 2 叙事主线是"从几何到代数"，algebra.ts 是代数主线的纯函数模块
- Phase 2.3 面积完成法也会往 algebra.ts 添加 `completingSquare` 函数
- 遵循 DEC-008 的按语义分模块原则

---

## DEC-015: 面积完成法归类为 parameter-slider（非 geometry-drag）

- 日期：2026-05-14
- 状态：已决定
- 关联决策：DEC-007、DEC-012

### 背景

Phase 2.3 面积完成法实验（al-khwarizmi-area-completion）的原始规划标注为 `geometry-drag` 类型，暗示使用 PythagorasProof 的 DraggablePoint 拖拽模式。需要确认实际交互范式。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| geometry-drag | 与 PythagorasProof 一致 | 本实验无拖拽交互，命名不准确 |
| **parameter-slider** | **准确反映交互方式（b/c slider）** | **需要更新 JSON 和文档** |

### 取舍

本实验的核心交互是 b/c 两个 slider 控制参数，SVG 自动展示面积分解与补全的动画过渡。没有用户拖拽几何块的操作。`geometry-drag` 应保留给真正有拖拽交互的实验（如 PythagorasProof 拖拽 a/b 边）。

将 type 改为 `parameter-slider` 与 Phase 2.1（Archimedes）、Phase 2.2（Chicken-Rabbit）的交互命名保持一致，三个实验都是 slider 驱动参数变化 → SVG 实时更新。

### 结果

- experiment.type 改为 `parameter-slider`
- 不引入 geometry-drag 的误导性命名
- Phase 2 三个已完成实验（2.1/2.2/2.3）统一为 parameter-slider 类型

---

## DEC-016: number-line 实验类型独立于 parameter-slider

- 日期：2026-05-14
- 状态：已决定
- 关联决策：DEC-007、DEC-012

### 背景

Phase 2.4 数轴运算实验（brahmagupta-number-line）的交互控件是 slider（起点 + 操作数），与 parameter-slider 类似。需要决定是否将其归类为 parameter-slider。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 改为 parameter-slider | 与 Phase 2.1~2.3 一致 | 丢失"数轴"视觉范式语义 |
| **保持 number-line** | **语义准确、Phase 2 规划一致** | **交互控件与 parameter-slider 重叠** |

### 取舍

虽然交互控件都是 slider，但用户心智模型不同：
- parameter-slider：调整参数 → 观察图形变化
- number-line：在数轴上移动 → 理解方向和距离

number-line 的核心视觉是数轴上的位置与移动，强调方向感和距离感。Phase 2 规划将 number-line 列为新范式，应保持一致。后续的负数运算、不等式实验可复用 number-line 范式。

### 结果

- experiment.type 保持 `number-line`
- 不合并到 parameter-slider
- 新建 `src/lib/math/numberLine.ts` 纯函数模块
- 新建 `src/components/experiments/number-line/` 组件目录

---

## DEC-017: 新建 coordinate.ts 纯函数模块 + coordinate/ 组件目录

- 日期：2026-05-15
- 状态：已决定
- 关联决策：DEC-008、DEC-016

### 背景

Phase 2.5 坐标探索器实验需要坐标转换、距离、斜率、直线方程等纯函数。需要决定函数放在哪个文件，组件放在哪个目录。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 放入 geometry.ts | 已有模块 | 坐标转换和代数方程不属于几何渲染辅助，语义不匹配 |
| 放入 numberLine.ts | 已有模块 | 数轴是一维的，坐标平面是二维的，语义不同 |
| 新建 coordinate.ts | 语义准确，Phase 3 函数图像/切线追踪直接复用 | 多一个文件 |

### 结果

- 纯函数模块：`src/lib/math/coordinate.ts`（坐标转换、距离、斜率、方程推导）
- 组件目录：`src/components/experiments/coordinate/`
- 基础组件：`CoordinateGrid.tsx`（纯展示，Phase 3 复用）
- 实验组件：`CartesianExplorerLab.tsx`
- experiment.type 保持 `coordinate-plotter`（DEC-012 已定义）

---

## DEC-018: Phase 3 主线选择"从坐标到变化"

- 日期：2026-05-15
- 状态：已决定
- 关联文档：`docs/project/phase-3-planning.md`

### 背景

Phase 2 完成后，12 个节点中 9 个有实验，3 个空槽（euclid-axioms、newton-leibniz-calculus、euler-graph-theory）。需要决定 Phase 3 的主线和实验选择。

### 选项

| 方案 | 主线 | 实验数 | 优点 | 缺点 |
|------|------|--------|------|------|
| A. 直接做微积分 | 切线+积分 | 3 | 简单直接 | 跳过函数可视化基础，教学顺序不对 |
| B. 从坐标到变化 | 函数→变化率→切线→积分 | 4 | 教学逻辑清晰，渐进深化 | 需要新建函数曲线基础设施 |
| C. 补全所有空槽 | 无主线 | 3+ | 全部完成 | 叙事散乱，范围过大 |
| D. 包含图论 | 函数+图论 | 5 | 覆盖面广 | 图论与函数/变化主线关联弱 |

### 取舍

方案 A 跳过了"函数可视化"和"平均变化率"两个关键教学环节。没有函数曲线基础设施（FunctionCurve），tangent-tracker 无法实现。没有割线斜率的直觉，切线斜率的理解缺乏根基。

方案 B 的 4 个实验形成清晰的教学递进：函数可视化（直观）→ 割线斜率（平均变化率）→ 切线斜率（瞬时变化率）→ 面积累积（积分）。每个实验为下一个建立直觉基础。

方案 C 范围过大，违反 MVP 聚焦原则。方案 D 的图论实验与"函数→变化"主线关联弱。

### 结果

- Phase 3 主线确定为"从坐标到变化"
- 4 个实验：Function Graph Explorer、Average Rate of Change Lab、Tangent Tracker、Area Accumulation Lab
- Euler 七桥探索推迟到 Phase 4
- 欧几里得公理构建器推迟到 Phase 4

---

## DEC-019: 不新增 leibniz-calculus 节点

- 日期：2026-05-15
- 状态：已决定
- 关联决策：DEC-018

### 背景

Phase 3 的 Function Graph Explorer 需要一个放置节点。原方案考虑新增 leibniz-calculus 节点。需要决定是否新增。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 新增 leibniz-calculus 节点 | 每个节点实验数更均衡 | 破坏 12 节点结构，需创建新 JSON + 更新多个文档 |
| **复用 descartes-coordinates** | **保持 12 节点结构，减少维护负担** | **descartes 节点有 3 个实验** |

### 取舍

新增节点需要创建新的 JSON 文件、更新 mvp-nodes.md、session-handoff.md 等多个文档，破坏已有的 12 节点结构。而 descartes-coordinates 节点天然适合承载函数可视化实验——笛卡尔的坐标系是函数可视化的基础，"方程→曲线"是笛卡尔的核心贡献。

descartes-coordinates 的 3 个实验形成清晰递进：坐标探索（Phase 2）→ 函数可视化（Phase 3.1）→ 变化率（Phase 3.2）。这比分散到不同节点更有教学连贯性。

### 结果

- 不新增 leibniz-calculus 节点
- Function Graph Explorer 和 Average Rate of Change Lab 放入 descartes-coordinates 节点
- 保持 12 节点结构不变

---

## DEC-020: Euler 七桥探索推迟到 Phase 4

- 日期：2026-05-15
- 状态：已决定
- 关联决策：DEC-018

### 背景

euler-graph-theory 节点有空槽实验 euler-bridge-explorer。需要决定是否在 Phase 3 实现。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| Phase 3 实现 | 补全空槽，为图论铺路 | 与"函数→变化"主线关联弱，增加架构复杂度 |
| **推迟到 Phase 4** | **Phase 3 聚焦纯粹主线** | **euler 节点继续空槽** |

### 取舍

Euler 七桥属于图论和离散数学，不涉及函数、斜率、切线、面积——与 Phase 3 的"从坐标到变化"主线无关。实现七桥需要新建 graph.ts 和 GraphCanvas.tsx，增加 Phase 3 的架构复杂度。

Phase 4 可以规划"从连续到离散"的新主线，Euler 七桥是该主线的完美起点。

### 结果

- euler-bridge-explorer 推迟到 Phase 4
- Phase 3 聚焦 4 个函数/微积分实验

---

## DEC-021: 新建 functions.ts 纯函数模块

- 日期：2026-05-15
- 状态：已决定
- 关联决策：DEC-008、DEC-018

### 背景

Phase 3.1 Function Graph Explorer 需要函数评估、曲线采样、零点/极值计算等纯函数。需要决定放在哪个文件。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 放入 coordinate.ts | 已有模块 | 坐标转换和函数评估语义不同，coordinate.ts 已有 10 个函数 |
| 放入 geometry.ts | 已有模块 | 函数评估不属于几何渲染辅助 |
| **新建 functions.ts** | **语义准确，独立清晰** | **多一个文件** |

### 结果

- 新建 `src/lib/math/functions.ts`
- 函数：evaluateFunction、sampleCurve、findZeros、findExtrema、clampFunctionBounds
- Phase 3 所有 4 个实验复用此模块

---

## DEC-022: 新建 calculus.ts 纯函数模块

- 日期：2026-05-15
- 状态：已决定
- 关联决策：DEC-018、DEC-021

### 背景

Phase 3.2~3.4 需要数值导数、切线方程、黎曼和、数值积分等微积分计算函数。

### 结果

- 新建 `src/lib/math/calculus.ts`
- 函数：numericalDerivative、tangentLinePoints、secantLineSlope、riemannSum、numericalIntegration
- Phase 3.2（割线斜率）、3.3（切线）、3.4（面积）复用此模块

---

## DEC-023: FunctionCurve.tsx 放入 function/ 目录并复用 CoordinateGrid

- 日期：2026-05-15
- 状态：已决定
- 关联决策：DEC-007、DEC-017、DEC-018

### 背景

Phase 3.1 需要新建函数曲线渲染组件 FunctionCurve.tsx。需要决定组件目录和与 CoordinateGrid 的关系。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 放入 coordinate/ | 与 CoordinateGrid 同目录 | 语义不对，函数曲线不是坐标系基础设施 |
| **新建 function/** | **语义清晰，Phase 3 function/calculus 主线** | **多一个目录** |
| 合并到 CoordinateGrid | 单一组件 | 职责过重，CoordinateGrid 应保持纯网格 |

### 取舍

FunctionCurve 的职责是"将函数参数渲染为 SVG path"，CoordinateGrid 的职责是"渲染坐标网格"。两者组合使用（FunctionCurve 作为 CoordinateGrid 的同级 `<g>` 元素），但职责独立。FunctionCurve 不应包含 CoordinateGrid，也不应管理坐标系参数——这些由父组件（实验组件）负责组合。

function/ 目录可容纳 Phase 3 的所有函数可视化组件（FunctionCurve、FunctionExplorerLab），与 calculus/ 目录（切线、面积）形成清晰分离。

### 结果

- 组件目录：`src/components/experiments/function/`
- FunctionCurve.tsx 是纯展示组件：接收 FunctionParams + bounds，输出 SVG `<path>`
- 不包含 CoordinateGrid，由父组件组合
- 不管理实验 state，不读取 experiment JSON

---

## DEC-024: quadratic a=0 允许退化为 linear

- 日期：2026-05-15
- 状态：已决定
- 关联决策：DEC-021

### 背景

Function Explorer 的 quadratic 模式下，a slider 范围包含 0。当 a=0 时，y=ax²+bx+c 退化为 y=bx+c（线性函数）。需要决定是否允许这种情况。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| a slider 不允许等于 0 | 避免除零等问题 | 用户无法看到二次项消失的退化过程 |
| **允许 a=0，按退化处理** | **用户能看到二次→线性的过渡** | **需要在 findFunctionFeatures 中特殊处理** |

### 结果

- 允许 a=0，findFunctionFeatures 内部检测 a=0 并退化为 linearFeatures(b, c)
- 顶点公式 x=-b/(2a) 不会因除零崩溃（a=0 时不计算顶点）
- 用户可以通过拖动 a 到 0 来观察抛物线变成直线的过程
- 这是更好的教学体验：参数的连续变化 → 曲线的连续变化

---

## DEC-025: calculus.ts 纯函数模块设计

- 日期：2026-05-15
- 状态：已决定
- 关联决策：DEC-018、DEC-021

### 背景

Phase 3.2 Average Rate of Change Lab 需要平均变化率、割线方程等计算函数。需要决定函数放在哪个文件，以及模块的职责边界。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 放入 functions.ts | 已有模块 | functions.ts 已有 7 个函数，且平均变化率语义属于微积分而非函数评估 |
| 放入 coordinate.ts | 已有模块 | 坐标转换和微积分计算语义不同 |
| **新建 calculus.ts** | **语义准确，Phase 3.3/3.4 直接复用** | **多一个文件** |

### 结果

- 新建 `src/lib/math/calculus.ts`
- 函数：averageRateOfChange、secantLineEquation、isValidInterval、formatRateFormulaLatex
- 依赖 functions.ts 的 evaluateFunction 和 coordinate.ts 的 lineEquationFromTwoPoints
- 纯函数，无 React/DOM/SVG 依赖
- Phase 3.3（切线追踪）将在同一文件中添加 numericalDerivative
- Phase 3.4（面积累积）将在同一文件中添加 riemannSum、numericalIntegration

---

## DEC-026: Average Rate of Change Lab 使用 graph-exploration 类型

- 日期：2026-05-15
- 状态：已决定
- 关联决策：DEC-007

### 背景

Phase 3.2 Average Rate of Change Lab 的 experiment.type 需要确定。原始规划标注为 `parameter-slider`，但实验的核心是探索曲线上两点与割线的关系。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| parameter-slider | 与 Phase 3.1 一致 | 语义不准确，本实验的核心不是调参数 |
| **graph-exploration** | **语义准确：探索图形上的关系** | **首次使用该类型** |

### 取舍

`graph-exploration` 已在 ExperimentType 中定义（timeline.ts），但从未被任何实验使用。本实验的核心交互是"探索曲线上两个点与割线的关系"，slider 是辅助手段。使用 `graph-exploration` 更准确地描述了用户心智模型：图形是主体，参数是手段。

### 结果

- experiment.type 使用 `graph-exploration`
- 首次使用该 ExperimentType
- 不修改 ExperimentType 定义

---

## DEC-027: TangentLine.tsx 独立于 SecantLine（切点+斜率 vs 两点连线）

- 日期：2026-05-15
- 状态：已决定
- 关联决策：DEC-025

### 背景

Phase 3.3 需要渲染切线。已有 SecantLine.tsx 渲染割线（通过两点连线）。需要决定是否复用 SecantLine 或新建 TangentLine。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 复用 SecantLine | 少一个文件 | 语义不对：切线是 point+slope，不是两点连线 |
| 新建 TangentLine | 语义准确，接口清晰 | 多一个文件 |

### 取舍

切线的输入是"一个切点 + 一个斜率"，需要从切点向两侧延伸到 bounds 边界。SecantLine 的输入是"两个点"，连线后裁剪到 bounds。虽然都使用 bounds clipping 算法，但接口和语义不同。

TangentLine 接收 `point + slope`，内部计算切线方程 y = slope * (t - x) + y，再裁剪到 bounds。这比"传入两个非常接近的点给 SecantLine"更精确、更清晰。

### 结果

- 新建 `src/components/experiments/calculus/TangentLine.tsx`
- 接口：`point, slope, bounds, svgW, svgH, pad + 颜色/显示 props`
- 纯展示组件，无 state，无 experiment 依赖
- bounds clipping 算法复用 SecantLine 的模式

---

## DEC-028: AreaUnderCurve.tsx 独立组件（矩形渲染 vs 函数曲线渲染）

- 日期：2026-05-15
- 状态：已决定
- 关联决策：DEC-023

### 背景

Phase 3.4 需要渲染黎曼矩形。已有 FunctionCurve.tsx 渲染函数曲线。需要决定是否复用 FunctionCurve 或新建 AreaUnderCurve。

### 选项

| 方案 | 优点 | 缺点 |
|------|------|------|
| 扩展 FunctionCurve | 少一个文件 | 职责过重：曲线渲染 + 矩形渲染混在一起 |
| 新建 AreaUnderCurve | 语义清晰，接口独立 | 多一个文件 |

### 取舍

FunctionCurve 的职责是"将函数参数渲染为 SVG path"。AreaUnderCurve 的职责是"将 Riemann 矩形几何数据渲染为 SVG rects"。两者输入不同：FunctionCurve 接收 FunctionParams，AreaUnderCurve 接收 RiemannRectangle[]。

将两者合并会导致 FunctionCurve 承担过多职责，且矩形渲染逻辑（采样点标记、填充色、边框）与曲线渲染逻辑（path 生成、NaN 断点处理）差异较大。

### 结果

- 新建 `src/components/experiments/calculus/AreaUnderCurve.tsx`
- 接口：`rectangles, bounds, svgW, svgH, pad + 填充/描边/采样点 props`
- 纯展示组件，无 state，无 experiment 依赖
- 不计算 riemannSum，接收预计算数据
