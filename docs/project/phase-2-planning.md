# Phase 2 Planning: 从几何到代数

## 1. 数学史主线

### 叙事弧线："人类如何从几何走向代数"

Phase 1 讲述了数学的起源——人类用身体丈量土地、发现和谐比例、发明进制、面对不确定性。Phase 2 要回答的问题是：

**人类如何从"看图说话"进化到"用符号思考"？**

这条弧线横跨 1800 年（公元前 300 年 → 公元 1600 年），覆盖五个关键转折点：

```
欧几里得          阿基米德          花拉子米          婆罗摩笈多          笛卡尔
(前 300)         (前 250)         (820)           (628)            (1637)
   │                │                │                │                │
   ▼                ▼                ▼                ▼                ▼
 "什么是证明？"  "如何计算曲面？"  "如何用符号解方程？" "负数是什么？"    "代数与几何如何统一？"
   │                │                │                │                │
   ▼                ▼                ▼                ▼                ▼
 公理化方法       逼近思想          代数符号          数系扩展          坐标几何
```

### 为什么是这条弧线

1. **延续 Phase 1**：Phase 1 从"测量"出发（埃及、巴比伦），Phase 2 自然推进到"证明"和"抽象"
2. **为 Phase 3 铺路**：坐标几何是微积分的前置知识，没有坐标系就无法可视化函数和导数
3. **体现平台价值**：面积完成法、坐标探索器这类实验，只有交互式平台才能让用户"亲手发现"代数恒等式的几何含义
4. **跨文化叙事**：希腊（证明）→ 伊斯兰（代数）→ 印度（数系）→ 法国（坐标），展示数学是全人类的发明

---

## 2. 实验选择

### 候选范围

8 个待实现节点中，按以下维度评估：

| 节点 | 实验 ID | 类型 | 复用性 | 叙事价值 | 新范式 | 实现难度 |
|------|---------|------|--------|----------|--------|----------|
| euclid-axioms | euclid-axiom-builder | parameter-slider | 高（slider） | 高（证明的诞生） | 否 | 中 |
| archimedes-area | archimedes-polygon-approximation | parameter-slider | 高（slider） | 中（逼近思想） | 否 | 低 |
| china-chicken-rabbit | china-chicken-rabbit-lab | parameter-slider | 高（slider） | 高（假设→代数） | 否 | 低 |
| al-khwarizmi-algebra | al-khwarizmi-area-completion | geometry-drag | 高（SVG+slider） | 极高（代数诞生） | 否 | 中 |
| brahmagupta-zero | brahmagupta-number-line | number-line | 中 | 高（数系扩展） | **是** | 中 |
| descartes-coordinates | descartes-coordinate-explorer | coordinate-plotter | 低（全新） | 极高（几何代数统一） | **是** | 高 |
| newton-leibniz-calculus | newton-tangent-tracker | tangent-tracker | 低（需函数曲线） | 高 | **是** | 高 |
| euler-graph-theory | euler-bridge-explorer | graph-exploration | 低（全新） | 中 | **是** | 高 |

### Phase 2 选择：5 个实验

| # | 实验 | 节点 | 类型 | 核心能力 | 优先级 |
|---|------|------|------|----------|--------|
| 1 | 鸡兔同笼假设法 | china-chicken-rabbit | parameter-slider | slider 可视化 + 假设推理 | P0 |
| 2 | 面积完成法 | al-khwarizmi-algebra | geometry-drag | SVG 几何分解 + 配方发现 | P0 |
| 3 | 多边形逼近 | archimedes-area | parameter-slider | slider + 极限直觉 | P0 |
| 4 | 数轴上的运算 | brahmagupta-zero | number-line | **新范式** + 负数直觉 | P1 |
| 5 | 坐标探索器 | descartes-coordinates | coordinate-plotter | **新范式** + 几何代数统一 | P1 |

### 不在 Phase 2 范围的实验

| 实验 | 推迟原因 |
|------|----------|
| euclid-axiom-builder | toggle 交互模式需要独立设计，且"公理推导"的反馈机制复杂 |
| newton-tangent-tracker | 需要先建立函数曲线渲染能力（coordinate-plotter 是前置） |
| euler-bridge-explorer | 图论交互范式全新，与"代数诞生"主线关联较弱 |

这 3 个实验放入 Phase 3（微积分与抽象结构）。

---

## 3. 实验详细设计

### 实验 1：鸡兔同笼假设法

**节点**：china-chicken-rabbit（古中国，《孙子算经》，约公元 400 年）

**数学故事**：笼中有鸡和兔共 35 只，脚共 94 只。假设全部是鸡，脚数少了多少？每把一只鸡换成兔，脚数增加几只？

**核心概念**：假设法 → 线性方程 → 代数思维的萌芽

**交互设计**：
- 滑块：假设全为鸡（0）→ 全为兔（35），实时调整
- 可视化：笼中动物图标（鸡 2 脚 / 兔 4 脚），随滑块变化
- 结果面板：假设脚数 vs 实际脚数 → 差值 → 每换一只差 2 → 兔的数量

**复用能力**：BabylonianBaseLab 的 slider 模式、数值显示模式

**引导发现**：
- 提示 1：试试假设全部是鸡，总脚数是多少？
- 提示 2：脚数差了几只？每把一只鸡换成兔，脚数怎么变？
- 发现：差值 ÷ 2 = 兔的数量，这就是"假设法"的核心

**难度**：L2 | **预计时间**：8 分钟

---

### 实验 2：面积完成法

**节点**：al-khwarizmi-algebra（伊斯兰黄金时代，花拉子米，公元 820 年）

**数学故事**：花拉子米在《代数学》中用几何方法解方程。x² + 10x 如何变成一个完整正方形？在四角各补一块，面积就是 (x+5)²。

**核心概念**：配方法的几何本质 → 代数恒等式的可视化

**交互设计**：
- SVG 画布：x² 正方形 + 四条边上的矩形（面积 = bx）
- 滑块：调整 x 的值（1~8），矩形宽度随之变化
- 可拖拽：用户拖动矩形块到四角，拼成大正方形
- 结果面板：补上的小正方形面积 = (b/2)²，大正方形边长 = x + b/2
- 公式展示：x² + bx = (x + b/2)² - (b/2)²

**复用能力**：PythagorasProof 的 SVG 几何渲染 + DraggablePoint 拖拽模式

**引导发现**：
- 提示 1：x² 是一个正方形，bx 是四条边上的矩形
- 提示 2：试试把矩形放到四角，能拼成什么形状？
- 发现：四角各缺一个小正方形！补上后总面积 = (x + b/2)²

**难度**：L3 | **预计时间**：12 分钟

**特殊价值**：这是 Phase 2 最能体现平台价值的实验——只有在交互式几何环境中，用户才能"亲手"发现配方法的几何含义。教科书上只能静态展示，这里是动态拼合。

---

### 实验 3：多边形逼近圆

**节点**：archimedes-area（古希腊，阿基米德，约公元前 250 年）

**数学故事**：阿基米德用圆内接正多边形逼近圆。边数越多，多边形面积越接近 πr²。他用 96 边形算出了 π 的范围：3.1408 < π < 3.1429。

**核心概念**：极限思想的雏形 → 以直代曲 → π 的计算

**交互设计**：
- SVG 画布：圆 + 内接正多边形（动态生成）
- 滑块：边数 3 → 128，实时更新多边形
- 结果面板：多边形面积 vs 圆面积（πr²），误差百分比
- 特效：边数增加时，多边形逐渐"贴合"圆弧（动画过渡）

**复用能力**：slider 模式 + SVG 多边形渲染

**引导发现**：
- 提示 1：正三角形的面积比圆小多少？
- 提示 2：试试把边数加到 6、12、24……面积怎么变？
- 发现：边数越多，面积越接近 3.14 × r²。这就是 π！

**难度**：L2 | **预计时间**：8 分钟

**叙事意义**：连接 Phase 1（埃及丈量）和 Phase 3（牛顿微积分）——阿基米德的逼近思想是 2000 年后微积分的种子。

---

### 实验 4：数轴上的运算

**节点**：brahmagupta-zero（古印度，婆罗摩笈多，公元 628 年）

**数学故事**：婆罗摩笈多首次系统定义了负数和零的运算规则。5 + (-3) = 2，在数轴上就是从 5 向左走 3 步。

**核心概念**：负数的直觉理解 → 数轴上的加减运算 → 数系扩展

**交互设计**：
- 数轴：-10 到 +10，刻度清晰，零点醒目
- 输入/按钮：输入运算表达式（如 5 + (-3)），或点击按钮选择操作数和运算符
- 动画：小人在数轴上跳跃——从起点出发，正数向右走，负数向左走
- 结果面板：运算过程的分步展示 + 最终结果

**新架构需求**：`number-line` 类型，需要新建 `NumberLine.tsx` 基础组件

**引导发现**：
- 提示 1：试试 3 + 5，小人怎么走？
- 提示 2：试试 3 + (-5)，小人往哪走？走到哪？
- 发现：加负数 = 向左走。减法呢？5 - 3 和 5 + (-3) 结果一样！

**难度**：L1 | **预计时间**：6 分钟

---

### 实验 5：坐标探索器

**节点**：descartes-coordinates（法国，笛卡尔，1637 年）

**数学故事**：笛卡尔躺在床上看苍蝇飞，想到用两条数轴定位平面上的点。几何图形可以用代数方程描述，代数方程可以用几何图形展示。

**核心概念**：坐标系 → 点与数对的对应 → 几何与代数的统一

**交互设计**：
- 坐标平面：x 轴 + y 轴 + 网格线 + 刻度
- 可拖拽点：用户在平面上拖动一个点，实时显示 (x, y) 坐标
- 关联展示：点移动时，右侧同步显示 x 和 y 的数值变化
- 进阶：显示几条预设直线（如 y = x, y = 2x + 1），拖拽点观察何时落在直线上
- 结果面板：点到原点的距离 = √(x² + y²)（连接毕达哥拉斯定理）

**新架构需求**：`coordinate-plotter` 类型，需要新建 `CoordinatePlane.tsx` 基础组件

**引导发现**：
- 提示 1：拖动点到 (3, 4)，x 和 y 分别是多少？
- 提示 2：让点沿着 y = x 移动，x 和 y 有什么关系？
- 发现：每条直线都是一个方程！几何图形可以用代数描述。

**难度**：L3 | **预计时间**：10 分钟

**特殊价值**：这是连接古代数学和近代数学的枢纽实验。坐标系是函数图像、微积分、线性代数的基础。Phase 3 的切线追踪器将复用此处建立的坐标平面组件。

---

## 4. 实施波次

### Wave 1：Slider 三连（复用现有模式）

| 实验 | 新增代码 | 复用 | 预估工时 |
|------|----------|------|----------|
| china-chicken-rabbit-lab | 动物图标可视化 + 结果面板 | BabylonianBaseLab slider 模式 | 低 |
| archimedes-polygon-approximation | SVG 多边形渲染 + 面积计算 | slider 模式 | 低-中 |

**验证标准**：slider 交互流畅、数值实时更新、引导面板正常

### Wave 2：几何代数（复用 SVG 模式）

| 实验 | 新增代码 | 复用 | 预估工时 |
|------|----------|------|----------|
| al-khwarizmi-area-completion | 几何分解渲染 + 拖拽拼合逻辑 | PythagorasProof 的 SVG + DraggablePoint | 中 |

**验证标准**：拖拽拼合流畅、面积计算正确、公式展示清晰

### Wave 3：新范式（number-line + coordinate-plotter）

| 实验 | 新增代码 | 复用 | 预估工时 |
|------|----------|------|----------|
| brahmagupta-number-line | `NumberLine.tsx` 基础组件 + 运算动画 | — | 中 |
| descartes-coordinate-explorer | `CoordinatePlane.tsx` 基础组件 + 拖拽点 | DraggablePoint | 高 |

**验证标准**：新组件响应式、触摸兼容、动画流畅

### 依赖关系

```
Wave 1 (slider) ──→ 可并行，无依赖
Wave 2 (geometry) ──→ 依赖 Wave 1 完成（验证流程跑通）
Wave 3 (new types) ──→ 可与 Wave 2 并行，但 coordinate-plotter 为 Phase 3 前置
```

---

## 5. 新增架构需求

### 5.1 新增组件

| 组件 | 目录 | 用途 | 后续复用 |
|------|------|------|----------|
| NumberLine.tsx | `experiments/number-system/` | 可交互数轴 | 负数运算、不等式 |
| CoordinatePlane.tsx | `experiments/coordinate/` | 笛卡尔坐标平面 | **Phase 3 所有函数实验** |
| FunctionCurve.tsx | `experiments/coordinate/` | 函数曲线渲染 | 切线追踪、极限可视化 |

### 5.2 新增纯函数模块

| 模块 | 目录 | 函数 |
|------|------|------|
| algebra.ts | `src/lib/math/` | chickenRabbitSolve、areaCompletion、completingSquare |
| coordinate.ts | `src/lib/math/` | pointOnLine、distanceToOrigin、lineEquation |

### 5.3 目录扩展

```
src/components/experiments/
├── geometry/          # 已有 2 个实验
├── number-system/     # 已有 1 个实验 + 新增 NumberLine
├── probability/       # 已有 1 个实验
└── coordinate/        # 新增目录（Phase 2 + Phase 3 基础）
```

### 5.4 Registry 扩展

新增 5 条映射：

```typescript
'china-chicken-rabbit-lab': () => import('...ChickenRabbitLab'),
'archimedes-polygon-approximation': () => import('...ArchimedesApproxLab'),
'al-khwarizmi-area-completion': () => import('...AreaCompletionLab'),
'brahmagupta-number-line': () => import('...NumberLineLab'),
'descartes-coordinate-explorer': () => import('...CoordinateExplorerLab'),
```

---

## 6. 最能体现平台价值的实验

| 排名 | 实验 | 原因 |
|------|------|------|
| 1 | 面积完成法 | 配方法的几何含义只能通过"亲手拼合"发现，教科书无法替代 |
| 2 | 坐标探索器 | "拖动点看坐标变化"是建立坐标直觉的最佳方式 |
| 3 | 多边形逼近 | "边数越多越接近圆"的极限直觉，动画比文字有效 100 倍 |
| 4 | 鸡兔同笼 | 假设法的推理过程通过滑块可视化，比纯算式更易理解 |
| 5 | 数轴运算 | 负数加减的"方向感"需要动态演示，静态数轴不够 |

---

## 7. Phase 2 验收标准

### 功能验收

- [ ] 12 个节点中 9 个有完整互动实验（Phase 1 的 4 个 + Phase 2 的 5 个）
- [ ] 剩余 3 个节点（euclid-axioms、newton-leibniz-calculus、euler-graph-theory）详情页显示"即将推出"
- [ ] 所有实验可通过 `/experiments/[experimentId]` 路径访问
- [ ] 所有实验在桌面和移动端可正常操作

### 架构验收

- [ ] 2 个新范式（number-line、coordinate-plotter）组件化完成
- [ ] 新组件遵循 ExperimentContainer 统一布局
- [ ] 纯函数模块（algebra.ts、coordinate.ts）无 DOM/React 依赖
- [ ] 注册表更新到 9 个实验

### 质量验收

- [ ] `npm run lint` 通过（0 errors, 0 warnings）
- [ ] `npm run build` 通过（22+ pages）
- [ ] TypeScript 严格模式，无 `any` 类型
- [ ] 数学公式正确渲染

### 叙事验收

- [ ] 5 个实验按时间顺序排列，呈现"几何→代数→坐标"的演进
- [ ] 每个实验的引导面板帮助用户发现数学规律
- [ ] 实验之间有概念连接（如面积完成法连接毕达哥拉斯、坐标系连接面积完成法）

---

## 8. Roadmap 更新建议

```diff
Phase 2：核心互动实验

  交付物：
- | 几何实验（1 个）     | 欧几里得公理构建器              | P0 |
- | 代数实验（2 个）     | 鸡兔同笼假设法、面积完成法      | P0 |
- | 微积分实验（2 个）   | 切线追踪器、极限可视化          | P1 |
- | 阿基米德逼近实验     | 多边形逼近圆                    | P1 |
- | 七桥探索实验         | 路径探索                        | P1 |
- | 零与负数实验         | 数轴操作                        | P1 |
+ | 代数实验（1 个）     | 鸡兔同笼假设法（slider）        | P0 |
+ | 几何-代数实验（1 个）| 面积完成法（geometry-drag）      | P0 |
+ | 逼近实验（1 个）     | 多边形逼近圆（slider）          | P0 |
+ | 数系实验（1 个）     | 数轴上的运算（number-line 新范式）| P1 |
+ | 坐标实验（1 个）     | 坐标探索器（coordinate-plotter 新范式）| P1 |
+ | 新架构组件           | NumberLine、CoordinatePlane     | P0 |
```

---

## 9. Backlog 更新建议

### 新增 Feature

| Feature ID | 名称 | 优先级 | 说明 |
|------------|------|--------|------|
| F-04-06 | 鸡兔同笼实验 | P0 | parameter-slider，复用 slider 模式 |
| F-04-07 | 面积完成法实验 | P0 | geometry-drag，复用 SVG + DraggablePoint |
| F-04-08 | 多边形逼近实验 | P0 | parameter-slider，复用 slider 模式 |
| F-04-09 | 数轴运算实验 | P1 | number-line，新建 NumberLine 组件 |
| F-04-10 | 坐标探索器实验 | P1 | coordinate-plotter，新建 CoordinatePlane 组件 |

### 新增 Task（关键任务）

| Task ID | 描述 | 依赖 | 复杂度 |
|---------|------|------|--------|
| T-04-06-01 | 实现鸡兔同笼假设法实验 | T-04-02-01 | 中 |
| T-04-07-01 | 实现面积完成法实验 | T-04-01-02 | 中-高 |
| T-04-08-01 | 实现多边形逼近实验 | T-04-02-01 | 中 |
| T-04-09-01 | 实现 NumberLine 基础组件 | 无 | 中 |
| T-04-09-02 | 实现数轴运算实验 | T-04-09-01 | 中 |
| T-04-10-01 | 实现 CoordinatePlane 基础组件 | 无 | 高 |
| T-04-10-02 | 实现坐标探索器实验 | T-04-10-01 | 高 |
| T-04-10-03 | 实现 FunctionCurve 渲染 | T-04-10-01 | 高 |

---

## 10. Phase 2 完成后的状态

| 指标 | Phase 1 完成时 | Phase 2 完成后 |
|------|---------------|---------------|
| 有实验的节点 | 4/12 (33%) | 9/12 (75%) |
| 实验类型覆盖 | 3/7 (43%) | 5/7 (71%) |
| 范式 | geometry-drag, parameter-slider, simulation | + number-line, coordinate-plotter |
| 数学史覆盖 | 古代（测量、比例） | + 古典（证明、代数、数系、坐标） |
| 纯函数模块 | 3 个 | 5 个（+algebra, +coordinate） |
| 为 Phase 3 铺路 | — | coordinate-plotter 是函数图像/微积分的前置 |

Phase 3（微积分与抽象结构）将在此基础上实现：
- newton-tangent-tracker（复用 CoordinatePlane + FunctionCurve）
- archimedes 相关的极限可视化
- euler-bridge-explorer（graph-exploration 新范式）
- euclid-axiom-builder（axiomatic-reasoning 新范式）
