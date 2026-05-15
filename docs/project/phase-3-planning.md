# Phase 3 Planning: 从坐标到变化

## 1. 数学史主线

### 叙事弧线："有了坐标系之后，人类如何描述变化"

Phase 1 讲述数学的起源——丈量土地、发明进制、面对不确定性。Phase 2 追踪"从几何到代数"的演进——公理化、逼近、符号化、数系扩展、坐标几何。

Phase 3 要回答的问题是：

**有了坐标系之后，人类如何从"画出曲线"走向"理解变化"？**

这条弧线横跨约 50 年（1637 → 1684），沿三个关键转折展开：

```
笛卡尔                    牛顿/莱布尼茨
(1637)                    (1665-1684)
   │                           │
   ▼                           ▼
"方程就是曲线"              "变化的数学"
"函数 = 输入→输出"          "瞬间速率 = 切线斜率"
"割线斜率 → 平均变化率"     "面积 = 累积量"
   │                           │
   ▼                           ▼
 函数可视化                  导数 + 积分
 割线与平均变化率
```

### 为什么这个顺序

1. **延续 Phase 2**：Phase 2 以笛卡尔坐标系收尾，Phase 3 自然从"坐标→函数"过渡
2. **教学逻辑**：先看曲线（直观）→ 再理解斜率（局部变化）→ 再理解切线（瞬间变化）→ 最后理解面积（累积）
3. **渐进深化**：平均变化率是瞬时变化率的前置——割线的极限就是切线
4. **最大化平台价值**：函数参数调整、切线追踪、面积累积这类实验，只有交互式平台才能让用户"亲手感受"

### 为什么不直接做牛顿切线追踪器

Phase 2 Final Review 的"下一步"建议中，tangent-tracker 排在第一位。但直接做切线追踪器有三个问题：

1. **缺少函数曲线基础设施**：tangent-tracker 需要先能渲染任意函数曲线（FunctionCurve），而当前 CoordinateGrid 只有坐标网格
2. **用户缺少函数直觉**：如果用户不理解"方程→曲线"的映射关系，切线追踪器的斜率变化就缺乏上下文
3. **教学顺序不对**：平均变化率（割线斜率）是瞬时变化率（切线斜率）的前置概念——先理解"两点之间的平均速率"，再理解"一点的瞬时速率"

因此，Phase 3 的正确顺序是：**函数可视化 → 平均变化率 → 瞬时变化率（切线）→ 面积累积**。

---

## 2. 节点方案评估

### 问题：是否需要新增节点

当前 12 个节点中，3 个有空实验槽：

| 节点 | 现有实验 | 空槽实验 ID | 状态 |
|------|----------|------------|------|
| euclid-axioms | 无 | euclid-axiom-builder | 空槽（推到 Phase 4） |
| newton-leibniz-calculus | 无 | newton-tangent-tracker | 空槽 |
| euler-graph-theory | 无 | euler-bridge-explorer | 空槽（推到 Phase 4） |

Phase 3 计划 4 个实验。如果全部放入现有节点，需要解决一个问题：4 个实验但只有 2 个可用空槽（euclid 和 euler 推迟）。

### 方案 A：不新增节点（推荐）

将 4 个实验分配到现有节点：

| 实验 | 放置节点 | 理由 |
|------|----------|------|
| Function Graph Explorer | descartes-coordinates（第 2 个实验） | 笛卡尔的坐标系是函数可视化的基础，"方程→曲线"是笛卡尔的核心贡献 |
| Average Rate of Change Lab | descartes-coordinates（第 3 个实验） | 割线斜率是坐标平面上的几何操作，与坐标探索器和函数探索器形成递进关系 |
| Tangent Tracker | newton-leibniz-calculus（第 1 个实验） | 切线追踪器是微积分的核心实验，使用节点的空槽 |
| Area Accumulation Lab | newton-leibniz-calculus（第 2 个实验） | 面积累积是积分的核心直觉，与切线追踪器互为对偶 |

**优点**：
- 保持 12 节点结构不变，不增加内容维护负担
- descartes-coordinates 有 3 个实验，形成"坐标→函数→变化率"的完整递进
- newton-leibniz-calculus 有 2 个实验，形成"导数→积分"的微积分对偶
- 不需要创建新的 JSON 节点文件

**缺点**：
- descartes-coordinates 节点有 3 个实验，需要验证 ExperimentContainer 支持多实验入口
- 节点详情页需要展示多个实验入口卡片

**需要的修改**：
- `data/nodes/early-modern/descartes-coordinates.json` — experiments 数组新增 2 个实验配置
- `data/nodes/early-modern/newton-leibniz-calculus.json` — experiments 数组新增 2 个实验配置
- 节点详情页 `src/app/timeline/[nodeId]/page.tsx` — 支持渲染多个实验入口
- 无需创建新节点文件

### 方案 B：新增 1 个节点

新增 `leibniz-calculus` 节点（莱布尼茨与函数的符号，1684 年），专门承载函数可视化实验：

| 实验 | 放置节点 |
|------|----------|
| Function Graph Explorer | leibniz-calculus（新增） |
| Average Rate of Change Lab | leibniz-calculus（第 2 个实验） |
| Tangent Tracker | newton-leibniz-calculus |
| Area Accumulation Lab | newton-leibniz-calculus（第 2 个实验） |

**优点**：
- 每个节点实验数更均衡（最多 2 个）
- 莱布尼茨的 f(x) 符号有独立的历史叙事

**缺点**：
- 破坏 12 节点结构（变为 13 节点）
- 需要创建新的 JSON 节点文件和内容
- 需要更新 mvp-nodes.md、session-handoff.md 等多个文档
- 莱布尼茨和牛顿在同一个时代，叙事重叠

### 推荐：方案 A

理由：
1. descartes-coordinates 的 3 个实验形成清晰的递进：坐标探索→函数可视化→变化率，这是从"静态图形"到"动态变化"的完整弧线
2. 不破坏已有的 12 节点结构
3. 减少内容维护负担
4. ExperimentContainer 已有 `experiments: Experiment[]` 数组支持，技术上可行

---

## 3. Euler 七桥评估

### 方案 A：Phase 3 保留 Euler 七桥

将 Euler 七桥作为 Phase 3 的第 5 个实验。

**优点**：
- 补全 euler-graph-theory 节点的空槽
- 展示从连续数学到离散数学的范式转换
- 为 Phase 4 图论扩展铺路

**缺点**：
- 与 Phase 3 主线"从坐标到变化"关联弱——七桥问题不涉及函数、斜率、切线、面积
- 需要新建 graph.ts 和 GraphCanvas.tsx，增加 Phase 3 的架构复杂度
- 实验数量变为 5 个，与用户明确的 4 个实验不一致

### 方案 B：Phase 3 移除 Euler 七桥（推荐）

将 Euler 七桥推到 Phase 4。

**优点**：
- Phase 3 聚焦"函数→变化→微积分"的纯粹主线
- 减少 Phase 3 的架构负担（不需要 graph.ts 和 GraphCanvas.tsx）
- 4 个实验的范围更可控

**缺点**：
- euler-graph-theory 节点继续空槽

### 推荐：方案 B

理由：
1. Phase 3 主线是"从坐标到变化"，Euler 七桥属于图论和结构数学，不在这个叙事弧线内
2. Phase 4 可以规划"从连续到离散"的新主线，Euler 七桥是该主线的完美起点
3. 减少 Phase 3 的技术风险和开发工时

---

## 4. Phase 3 实验清单（最终方案）

4 个实验，严格围绕"从坐标到变化"主线：

| Phase | 实验 | 节点 | 类型 | 核心概念 |
|-------|------|------|------|----------|
| 3.1 | Function Graph Explorer | descartes-coordinates（第 2 个） | parameter-slider | 函数 = 方程→曲线，参数影响形状 |
| 3.2 | Average Rate of Change Lab | descartes-coordinates（第 3 个） | parameter-slider | 割线斜率 = 平均变化率 |
| 3.3 | Tangent Tracker | newton-leibniz-calculus（第 1 个） | tangent-tracker | 切线斜率 = 瞬时变化率 = 导数 |
| 3.4 | Area Accumulation Lab | newton-leibniz-calculus（第 2 个） | parameter-slider | 曲线下面积 = 累积量 = 积分 |

### 不在 Phase 3 范围的实验

| 实验 | 推迟原因 | 推迟到 |
|------|----------|--------|
| euler-bridge-explorer | 属于图论/离散数学，与"函数→变化"主线无关 | Phase 4 |
| euclid-axiom-builder | toggle 交互模式需独立设计，与 Phase 3 主线关联弱 | Phase 4 |
| 大数定律可视化 | simulation 范式已有，与 Phase 3 主线无关 | Phase 4 |
| 微分方程可视化 | 前置能力不足（需先建立导数+积分） | Phase 5 |

---

## 5. 实验详细设计

### 实验 1：Function Graph Explorer（Phase 3.1）

**节点**：`descartes-coordinates`（第 2 个实验）

**数学故事**：笛卡尔发现，方程不只是数字的关系——它可以画成一条曲线。y=x² 是一条抛物线，y=sin(x) 是一条波浪线。改变方程中的参数，曲线的形状就变了。这就是"函数"的直觉来源。

**核心概念**：函数 = 输入→输出的映射 → 方程决定曲线形状 → 参数改变曲线形态

**交互设计**：
- **函数选择器**：从预设函数列表中选择（线性、二次、三次、正弦、指数）
- **参数滑块**：调整函数参数（如 y=ax²+bx+c 中的 a/b/c），曲线实时更新
- **输入点探索**：在 x 轴上拖动一个点，同步显示对应的 y 值和输出点
- **曲线绘制**：SVG 渲染函数曲线，随参数变化平滑过渡
- **结果面板**：当前方程（KaTeX）、定义域/值域、零点、极值点

**复用能力**：
- CoordinateGrid（坐标网格）→ 直接复用
- coordinate.ts（mathToSvg、svgToMath）→ 直接复用
- Slider 控件 → 复用 BabylonianBaseLab 模式
- FormulaDisplay（KaTeX）→ 直接复用

**新增能力**：
- `src/lib/math/functions.ts` — 函数评估、曲线采样、零点、极值
- `src/components/experiments/function/FunctionCurve.tsx` — 函数曲线渲染
- `src/components/experiments/function/FunctionExplorerLab.tsx` — 实验组件

**引导发现**：
- 提示 1：选择 y=x²，观察曲线形状。把 a 改成 2，曲线怎么变？
- 提示 2：选择 y=sin(x)，调整频率参数，曲线振荡怎么变？
- 发现：每个方程对应一条曲线，参数决定曲线的"姿态"。这就是函数！

**难度**：L2 | **预计时间**：8 分钟

**叙事意义**：Phase 3 的起点。从笛卡尔的"方程=曲线"建立函数直觉，为后续的割线、切线、面积实验提供曲线基础。

---

### 实验 2：Average Rate of Change Lab（Phase 3.2）

**节点**：`descartes-coordinates`（第 3 个实验）

**数学故事**：在曲线上取两个点，连一条直线（割线），这条线的斜率就是两点之间的"平均变化率"。两点越靠近，割线越接近切线——这就是从"平均"到"瞬时"的桥梁。

**核心概念**：割线斜率 = Δy/Δx = 平均变化率 → 两点越近，越接近瞬时变化率

**交互设计**：
- **函数曲线**：从预设函数中选择（与实验 1 相同的函数集）
- **双点拖拽**：在曲线上拖动两个点 A 和 B，实时显示割线
- **割线渲染**：通过 A、B 两点的直线，颜色醒目
- **Δ 三角形**：水平虚线（Δx）+ 垂直虚线（Δy）+ 直角标记（复用 CartesianExplorerLab 的模式）
- **斜率显示**：实时显示 Δy/Δx 的值 + 变化过程
- **逼近动画**：可选——B 点自动向 A 点移动，展示割线趋近切线的过程
- **结果面板**：A/B 坐标、Δx、Δy、平均变化率、与瞬时变化率的对比

**复用能力**：
- FunctionCurve.tsx（Phase 3.1 建立）→ 直接复用
- functions.ts（Phase 3.1 建立）→ 直接复用
- CoordinateGrid → 直接复用
- CartesianExplorerLab 的 Δ 三角形模式 → 直接复用

**新增能力**：
- `src/lib/math/calculus.ts` — 数值导数（用于对比平均变化率与瞬时变化率）
- `src/components/experiments/calculus/SecantLineLab.tsx` — 实验组件

**引导发现**：
- 提示 1：在 y=x² 上取 A(0,0) 和 B(2,4)，割线斜率是多少？
- 提示 2：把 B 移到 (1,1)，斜率变了吗？移到 (0.5, 0.25) 呢？
- 提示 3：试试"逼近动画"，看 B 向 A 靠近时割线怎么变。
- 发现：B 越靠近 A，割线斜率越接近 2x！两点之间是"平均速度"，一点是"瞬时速度"。

**难度**：L2 | **预计时间**：10 分钟

**叙事意义**：这是从"函数"到"导数"的关键桥梁。平均变化率（割线）是瞬时变化率（切线）的近似——当 Δx→0 时，割线变成切线。这个实验让用户"亲手发现"极限的过程。

---

### 实验 3：Tangent Tracker（Phase 3.3）

**节点**：`newton-leibniz-calculus`（第 1 个实验）

**数学故事**：牛顿想知道苹果下落的"瞬间速度"——速度在变，但在极短的时间内可以近似为匀速。在曲线上，这意味着在某一点画一条切线，切线的斜率就是那一瞬间的变化率。

**核心概念**：导数 = 切线斜率 = 瞬时变化率 → 斜率随位置变化 → 导数本身也是函数

**交互设计**：
- **函数曲线**：从预设函数中选择（x²、x³、sin(x)、1/x）
- **可拖拽点**：在曲线上拖动一个点，实时显示该点的切线
- **切线渲染**：通过该点的直线，长度适中，颜色醒目
- **斜率显示**：实时显示切线斜率数值 + dy/dx 符号
- **导数曲线**：可选显示"斜率随 x 变化"的曲线（即导数函数 f'(x)）
- **结果面板**：当前点坐标、斜率值、导数公式（KaTeX）、物理含义

**复用能力**：
- FunctionCurve.tsx → 直接复用
- functions.ts + calculus.ts → 直接复用
- CoordinateGrid → 直接复用
- DraggablePoint → 复用（但需约束在曲线上）

**新增能力**：
- `src/components/experiments/calculus/TangentLine.tsx` — 切线渲染
- `src/components/experiments/calculus/TangentTrackerLab.tsx` — 实验组件

**引导发现**：
- 提示 1：在 y=x² 上拖动点，观察切线斜率。x=0 时斜率是多少？x=2 时呢？
- 提示 2：打开"导数曲线"，看看斜率的变化规律。对 y=x²，导数曲线是什么形状？
- 发现：x=0 时切线水平（斜率=0），x 越大切线越陡。斜率本身也是 x 的函数！对 y=x²，斜率=2x。

**难度**：L3 | **预计时间**：12 分钟

**叙事意义**：Phase 3 的核心实验。与实验 2 的割线对比——割线是两点之间的平均变化率，切线是一点的瞬时变化率。"导数曲线"功能展示 f→f' 的映射，为理解微分铺路。

---

### 实验 4：Area Accumulation Lab（Phase 3.4）

**节点**：`newton-leibniz-calculus`（第 2 个实验）

**数学故事**：牛顿和莱布尼茨面对的另一个问题是：如何求曲线下方的面积？阿基米德用多边形逼近，但微积分的方法更巧妙——把面积看作"从起点开始不断累积"的过程，累积的速率就是函数值本身。

**核心概念**：积分 = 曲线下方面积 = 累积量 → 面积随上限变化 → 面积变化率 = 函数值

**交互设计**：
- **函数曲线**：与切线追踪器相同的函数集
- **可拖拽上限**：在 x 轴上拖动一个点作为积分上限，实时填充曲线下方的面积
- **面积填充**：用半透明色块填充从起点到上限的区域
- **黎曼和可视化**：可选显示矩形分割（左/右/中点），调整矩形数量
- **累积曲线**：可选显示"面积随上限变化"的曲线（即积分函数 F(x)）
- **结果面板**：当前上限、面积值（数值积分）、积分公式（KaTeX）、矩形和误差

**复用能力**：
- FunctionCurve.tsx → 直接复用
- CoordinateGrid → 直接复用
- functions.ts + calculus.ts → 直接复用

**新增能力**：
- `src/components/experiments/calculus/AreaUnderCurve.tsx` — 面积填充 + 黎曼矩形
- `src/components/experiments/calculus/AreaAccumulatorLab.tsx` — 实验组件
- `src/lib/math/calculus.ts` 扩展 — rie  mannSum、numericalIntegration

**引导发现**：
- 提示 1：选择 y=x，从 0 开始累积。上限拖到 1，面积是多少？拖到 2 呢？
- 提示 2：打开"黎曼和"，增加矩形数量。面积值越来越精确？
- 提示 3：打开"累积曲线"，看看面积的增长规律。对 y=x，累积曲线是什么形状？
- 发现：面积的增长速率等于函数值！对 y=x，面积=x²/2。这就是积分。

**难度**：L3 | **预计时间**：12 分钟

**叙事意义**：与切线追踪器互为"对偶"——切线追踪器展示 f→f'（微分），面积累积器展示 f→F（积分）。两者共同构成微积分基本定理的直觉基础。

---

## 6. Phase 结构与依赖关系

### Phase 3.1：函数可视化基础（P0）

| 实验 | 新增代码 | 复用 | 预估工时 |
|------|----------|------|----------|
| Function Graph Explorer | FunctionCurve.tsx + functions.ts | CoordinateGrid + coordinate.ts + Slider | 中 |

**新增基础能力**：
- `src/lib/math/functions.ts` — 函数评估、曲线采样、零点、极值
- `src/components/experiments/function/FunctionCurve.tsx` — 函数曲线渲染
- `src/components/experiments/function/FunctionExplorerLab.tsx` — 实验组件

**验证标准**：函数曲线渲染正确、参数滑块实时更新曲线、零点/极值标注正确

### Phase 3.2：平均变化率（P0，依赖 3.1）

| 实验 | 新增代码 | 复用 | 预估工时 |
|------|----------|------|----------|
| Average Rate of Change Lab | calculus.ts（导数部分）+ SecantLineLab.tsx | FunctionCurve + functions.ts + Δ三角形模式 | 中 |

**新增基础能力**：
- `src/lib/math/calculus.ts` — 数值导数、切线方程
- `src/components/experiments/calculus/SecantLineLab.tsx` — 实验组件

**验证标准**：割线斜率计算正确、逼近动画流畅、与瞬时变化率对比准确

### Phase 3.3：瞬时变化率（P0，依赖 3.1）

| 实验 | 新增代码 | 复用 | 预估工时 |
|------|----------|------|----------|
| Tangent Tracker | TangentLine.tsx + TangentTrackerLab.tsx | FunctionCurve + functions.ts + calculus.ts + DraggablePoint | 中-高 |

**新增基础能力**：
- `src/components/experiments/calculus/TangentLine.tsx` — 切线渲染
- `src/components/experiments/calculus/TangentTrackerLab.tsx` — 实验组件

**验证标准**：切线与曲线相切、斜率计算正确、导数曲线与理论一致

**Phase 3.2 和 3.3 可并行开发**，因为它们都依赖 3.1 但互不依赖。

### Phase 3.4：面积与积分（P0，依赖 3.1）

| 实验 | 新增代码 | 复用 | 预估工时 |
|------|----------|------|----------|
| Area Accumulation Lab | AreaUnderCurve.tsx + AreaAccumulatorLab.tsx + calculus.ts 扩展 | FunctionCurve + functions.ts | 中-高 |

**新增基础能力**：
- `src/components/experiments/calculus/AreaUnderCurve.tsx` — 面积填充 + 黎曼矩形
- `src/components/experiments/calculus/AreaAccumulatorLab.tsx` — 实验组件
- `src/lib/math/calculus.ts` 扩展 — riemannSum、numericalIntegration

**验证标准**：面积填充正确、黎曼和收敛到积分值、累积曲线与理论一致

**Phase 3.2、3.3、3.4 可并行开发**，因为它们都只依赖 3.1。

### 依赖关系图

```
Phase 3.1 (函数可视化)
  ├──→ Phase 3.2 (平均变化率)  ─┐
  ├──→ Phase 3.3 (切线追踪)    ├── 可并行
  └──→ Phase 3.4 (面积累积)   ─┘
```

---

## 7. 最能体现平台价值的实验

| 排名 | 实验 | 原因 |
|------|------|------|
| 1 | Tangent Tracker | "拖动点看斜率变化"是理解导数的最佳方式，教科书只能展示静态切线，这里是动态追踪 |
| 2 | Area Accumulation Lab | "拖动上限看面积增长"把积分从公式变成直觉，黎曼和可视化展示"以直代曲"的过程 |
| 3 | Average Rate of Change Lab | "拖动两点看割线趋近切线"是理解极限和导数的桥梁，比直接给切线更有教学深度 |
| 4 | Function Graph Explorer | "调参数看曲线变化"建立函数直觉，是后续三个实验的基础 |

---

## 8. 复用能力分析

### 已有能力复用

| 能力 | 来源 | Phase 3 用途 |
|------|------|-------------|
| CoordinateGrid.tsx | coordinate/ | 所有 4 个实验的坐标网格 |
| coordinate.ts | lib/math/ | mathToSvg、svgToMath、Point、Bounds |
| DraggablePoint.tsx | geometry/ | 切线追踪器的拖拽点 |
| CartesianExplorerLab Δ三角形 | coordinate/ | 割线实验的 Δx/Δy 展示模式 |
| Slider 控件 | BabylonianBaseLab 等 | 函数参数、积分上限、矩形数量 |
| FormulaDisplay | ui/ | 公式渲染（KaTeX） |
| ExperimentContainer | experiments/ | 统一容器布局 |
| GuidancePanel | experiments/ | 引导面板 |
| useDrag.ts | hooks/ | SVG 拖拽坐标转换 |

### 新增能力

| 能力 | 用途 | 复用前景 |
|------|------|----------|
| functions.ts | 函数评估、曲线采样 | 所有函数实验 |
| FunctionCurve.tsx | 函数曲线渲染 | 切线追踪、面积累积、未来所有函数实验 |
| calculus.ts | 导数、积分、黎曼和 | 切线追踪、面积累积、割线实验 |
| TangentLine.tsx | 切线渲染 | 切线追踪器专用 |
| AreaUnderCurve.tsx | 面积填充 + 黎曼矩形 | 面积累积器专用 |

---

## 9. 新增架构需求

### 9.1 新增纯函数模块

| 模块 | 目录 | 函数 |
|------|------|------|
| functions.ts | `src/lib/math/` | evaluateFunction、sampleCurve、findZeros、findExtrema、clampFunctionBounds |
| calculus.ts | `src/lib/math/` | numericalDerivative、tangentLinePoints、secantLineSlope、riemannSum、numericalIntegration |

### 9.2 新增组件

| 组件 | 目录 | 用途 | 后续复用 |
|------|------|------|----------|
| FunctionCurve.tsx | `experiments/function/` | SVG 函数曲线渲染 | Phase 4+ 所有函数实验 |
| TangentLine.tsx | `experiments/calculus/` | 切线渲染 | 微分方程可视化 |
| AreaUnderCurve.tsx | `experiments/calculus/` | 面积填充 + 黎曼矩形 | 定积分可视化 |

### 9.3 目录扩展

```
src/components/experiments/
├── geometry/          # 已有 3 个实验
├── number-system/     # 已有 1 个实验
├── algebra/           # 已有 2 个实验
├── probability/       # 已有 1 个实验
├── number-line/       # 已有 1 个实验
├── coordinate/        # 已有 1 个实验
├── function/          # 新增（Phase 3.1）
│   ├── FunctionCurve.tsx
│   └── FunctionExplorerLab.tsx
└── calculus/          # 新增（Phase 3.2~3.4）
    ├── TangentLine.tsx
    ├── AreaUnderCurve.tsx
    ├── SecantLineLab.tsx
    ├── TangentTrackerLab.tsx
    └── AreaAccumulatorLab.tsx
```

### 9.4 Registry 扩展

新增 4 条映射：

```typescript
'descartes-function-explorer': () => import('...FunctionExplorerLab'),
'descartes-rate-of-change': () => import('...SecantLineLab'),
'newton-tangent-tracker': () => import('...TangentTrackerLab'),
'newton-area-accumulator': () => import('...AreaAccumulatorLab'),
```

### 9.5 实验类型

| 实验 | ExperimentType | 状态 |
|------|---------------|------|
| Function Graph Explorer | `parameter-slider` | 已有类型 |
| Average Rate of Change Lab | `parameter-slider` | 已有类型 |
| Tangent Tracker | `tangent-tracker` | 已有类型（首次使用） |
| Area Accumulation Lab | `parameter-slider` | 已有类型 |

---

## 10. Phase 3 完成后的状态

| 指标 | Phase 2 完成时 | Phase 3 完成后 |
|------|---------------|---------------|
| 节点总数 | 12 | 12（不变） |
| 有实验的节点 | 9/12 (75%) | 11/12 (92%) |
| 实验总数 | 9 | 13（+4 新增） |
| 实验类型覆盖 | 5/7 (71%) | 6/7 (86%，+tangent-tracker） |
| 范式 | geometry-drag, parameter-slider, simulation, number-line, coordinate-plotter | + tangent-tracker |
| 数学史覆盖 | 古代 → 近代（坐标几何） | + 函数可视化 + 微积分直觉 |
| 纯函数模块 | 6 个 | 8 个（+functions, +calculus） |
| 纯函数总数 | 49 | ~65+ |
| 剩余空槽 | 3 | 2（euclid-axiom-builder, euler-bridge-explorer） |

---

## 11. 验收标准

### 功能验收

- [ ] 12 个节点中 11 个有完整互动实验
- [ ] descartes-coordinates 节点有 3 个实验（坐标探索 + 函数探索 + 变化率）
- [ ] newton-leibniz-calculus 节点有 2 个实验（切线追踪 + 面积累积）
- [ ] 剩余 1 个节点（euclid-axioms）详情页显示"即将推出"
- [ ] 所有实验可通过 `/experiments/[experimentId]` 路径访问
- [ ] 所有实验在桌面和移动端可正常操作

### 架构验收

- [ ] 1 个新范式（tangent-tracker）组件化完成
- [ ] FunctionCurve.tsx 可渲染多种函数类型（多项式、三角、指数）
- [ ] 新组件遵循 ExperimentContainer 统一布局
- [ ] 纯函数模块（functions.ts、calculus.ts）无 DOM/React 依赖
- [ ] 注册表更新到 13 个实验
- [ ] 单节点多实验机制验证通过（descartes 有 3 个、newton 有 2 个）

### 质量验收

- [ ] `npm run lint` 通过（0 errors, 0 warnings）
- [ ] `npm run build` 通过（21+ pages）
- [ ] TypeScript 严格模式，无 `any` 类型
- [ ] 数学公式正确渲染
- [ ] 函数曲线在极端参数下不崩溃（大系数、渐近线）

### 叙事验收

- [ ] 4 个实验按教学顺序排列，呈现"函数→平均变化率→瞬时变化率→面积累积"的渐进
- [ ] Function Graph Explorer 为后续三个实验建立函数直觉
- [ ] Average Rate of Change Lab 为 Tangent Tracker 建立"割线→切线"的极限直觉
- [ ] Tangent Tracker 和 Area Accumulation Lab 共同体现微积分基本定理的两个方向
- [ ] 每个实验的引导面板帮助用户发现数学规律

---

## 12. 风险与缓解

| 风险 | 影响 | 缓解 |
|------|------|------|
| FunctionCurve 渲染性能 | 大范围采样可能导致 SVG 路径过长 | 限制采样范围和密度，使用 path 而非逐点 circle |
| 切线追踪器数值精度 | 数值导数在渐近线附近不稳定 | 添加边界检测，限制可选函数集 |
| 黎曼和矩形数量过多 | 渲染卡顿 | 限制最大矩形数（如 200） |
| 单节点多实验 | 详情页布局需要调整 | 验证 ExperimentContainer 支持多实验入口 |
| descartes 节点 3 个实验 | 实验入口卡片可能拥挤 | 使用紧凑布局或分组展示 |

---

## 13. 决策记录建议

| 决策 ID | 内容 |
|---------|------|
| DEC-018 | Phase 3 主线选择"从坐标到变化"，4 个实验 |
| DEC-019 | 不新增节点，descartes-coordinates 承载函数探索和变化率实验 |
| DEC-020 | newton-leibniz-calculus 节点支持 2 个实验（切线+面积） |
| DEC-021 | 新建 functions.ts 纯函数模块（函数评估+曲线采样） |
| DEC-022 | 新建 calculus.ts 纯函数模块（导数+积分+黎曼和） |
| DEC-023 | FunctionCurve.tsx 复用 CoordinateGrid 坐标系 |
| DEC-024 | Euler 七桥推到 Phase 4，Phase 3 聚焦函数/变化主线 |

---

## 14. Phase 3 不做什么（已确认）

| 暂缓内容 | 原因 | 推迟到 |
|----------|------|--------|
| euler-bridge-explorer | 属于图论/离散数学，与"函数→变化"主线无关 | Phase 4 |
| euclid-axiom-builder | toggle 交互模式需独立设计 | Phase 4 |
| 大数定律可视化 | simulation 范式已有，与 Phase 3 主线无关 | Phase 4 |
| 微分方程可视化 | 前置能力不足（需先建立导数+积分） | Phase 5 |
| 概念图谱 | 非 MVP 阻塞项 | Phase 5+ |
| 自动化测试 | 纯函数无单元测试 | Phase 5+ |
| CI/CD | 手动 lint/build | Phase 5+ |
