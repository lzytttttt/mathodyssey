# Phase 2.1：Archimedes Polygon Approximation Lab 设计方案

## 1. 实验类型分析

### JSON 配置中的类型

`archimedes-area.json` 定义 `type: "parameter-slider"`。

### 是否需要新增 experiment type？

**不需要。** 理由：

- 交互模式是 slider 调整参数 → 实时更新可视化，完全符合 `parameter-slider` 定义
- "极限直觉"是数学概念，不是交互范式。同一个 slider 类型可以承载不同的数学体验
- 新增 `limit-intuition` 类型会导致 ExperimentType 膨胀，且其他实验（如坐标探索器）也可能涉及极限直觉
- 现有 7 种 ExperimentType 已足够覆盖，本实验归入 `parameter-slider`

### 与 Phase 1 slider 实验的区别

| 维度 | BabylonianBaseLab | ArchimedesPolygonLab |
|------|-------------------|---------------------|
| 控件 | slider + 数字输入 | slider + 预设按钮 |
| 可视化 | 位值条（div） | SVG 几何图形（圆 + 多边形） |
| 数学核心 | 进制表示 | 逼近与收敛 |
| 反馈模式 | 即时显示数值 | 双界夹逼 + 误差收敛 |

结论：同为 `parameter-slider`，但可视化层完全不同，不复用 BabylonianBaseLab 的 UI 组件。

---

## 2. 交互设计

### 2.1 控件

**主控件：Slider**
- id: `sides-slider`
- min: 6, max: 96, step: 1
- 初始值: 6
- 标记点: 6, 12, 24, 48, 96（slider 下方标注刻度，用户可感知"关键节点"）

**辅助控件：预设按钮组**
- 6 / 12 / 24 / 48 / 96 五个按钮
- 点击直接跳到对应边数
- 高亮当前值对应的按钮
- 这是 JSON 配置中没有的，需要在组件中实现（不破坏 schema，属于 UI 增强）

### 2.2 SVG 画布

**画布尺寸**: 800×600（与 PythagorasProof 一致）

**视觉层次**（从底到顶）：

1. **背景**: 浅色网格（复用 PythagorasProof 的 grid pattern）
2. **圆**: 居中，半径 200px，描边灰色 `#94a3b8`，线宽 2，fill 透明
3. **内接正多边形**: fill `#3b82f6`（蓝）opacity 0.1，stroke `#3b82f6` 线宽 2
4. **外切正多边形**: fill `#ef4444`（红）opacity 0.05，stroke `#ef4444` 线宽 1.5，虚线
5. **标注**: 圆心标记、半径标注、边数标注

**圆心**: (400, 300)（画布正中）

**动画**: 边数变化时，多边形顶点使用 CSS transition 平滑过渡（`transition: all 0.15s ease`），避免跳跃感。

### 2.3 结果面板

分三个区域展示：

**区域 A：π 的上下界（核心）**
```
┌─────────────────────────────────────┐
│  π 的逼近                           │
│                                     │
│  下界（内接）  3.0000  ←→  3.1416  │
│  上界（外切）  3.4641  ←→  3.1416  │
│                                     │
│  ████████████████████░░░░░░░░░░░░░  │ ← 进度条可视化夹逼区间
│  3.0        3.14159        3.5      │
│                                     │
│  当前 n=6: π ∈ [3.000, 3.464]      │
│  区间宽度: 0.4641                   │
└─────────────────────────────────────┘
```

**区域 B：周长数据**
```
┌─────────────────────────────────────┐
│  周长 / 直径                        │
│                                     │
│  内接周长 / d = 3.0000              │
│  外切周长 / d = 3.4641              │
│  π = 3.14159265...                  │
└─────────────────────────────────────┘
```

**区域 C：历史连接**
```
┌─────────────────────────────────────┐
│  阿基米德的结果                      │
│                                     │
│  用 96 边形得到: 3.1408 < π < 3.1429│
│  你的结果:      3.1408 < π < 3.1429 │
│  误差: 0.0008                       │
└─────────────────────────────────────┘
```

### 2.4 引导面板

需要更新 JSON 配置的 guidance：

**hints**（提示，逐步展开）：
1. "从六边形开始，观察内接和外切多边形"
2. "试试把边数增加到 12，图形发生了什么变化？"
3. "注意上下界的区间宽度——边数越多，区间越窄"
4. "试试 96 边形，这是阿基米德当年计算的结果"

**discoveries**（发现）：
1. "内接多边形的周长总是小于圆周长——它是 π 的下界"
2. "外切多边形的周长总是大于圆周长——它是 π 的上界"
3. "边数越多，上下界越接近，区间越来越窄"
4. "阿基米德用 96 边形就得到了 π 的两位小数精度"

**completionCriteria**: "用 96 边形验证上下界区间宽度小于 0.01"

---

## 3. 数学函数设计

### 3.1 函数归属

所有函数放入 `src/lib/math/geometry.ts`。理由：
- 函数是纯几何计算，无 DOM/React 依赖
- `regularPolygonVertices` 是通用几何工具，后续实验（极限可视化）也会复用
- 遵循 DEC-008：几何渲染辅助函数放入 geometry.ts

### 3.2 函数清单

```typescript
/**
 * 计算正 n 边形的顶点坐标。
 * @param n - 边数
 * @param radius - 外接圆半径（顶点到圆心距离）
 * @param center - 圆心坐标 [cx, cy]
 * @param startAngle - 起始角度（弧度），默认 -π/2（从正上方开始）
 * @returns 顶点坐标数组 [[x1,y1], [x2,y2], ...]
 */
export function regularPolygonVertices(
  n: number,
  radius: number,
  center: Point,
  startAngle?: number
): Point[]

/**
 * 计算正 n 边形的周长。
 * @param n - 边数
 * @param radius - 外接圆半径
 * @param isInscribed - true=内接，false=外切
 */
export function regularPolygonPerimeter(
  n: number,
  radius: number,
  isInscribed: boolean
): number

/**
 * 阿基米德逼近：计算正 n 边形对 π 的上下界估计。
 * 内接: 下界 = n * sin(π/n)
 * 外切: 上界 = n * tan(π/n)
 * @returns { lower, upper, inscribedPerimeter, circumscribedPerimeter, intervalWidth }
 */
export function archimedesApproximation(n: number): {
  lower: number;          // π 的下界
  upper: number;          // π 的上界
  inscribedPerimeter: number;   // 内接周长（d=1 时）
  circumscribedPerimeter: number; // 外切周长（d=1 时）
  intervalWidth: number;  // 上界 - 下界
}
```

### 3.3 数学推导

**内接正 n 边形**（顶点在圆上）：
- 每条边对应的圆心角 = 2π/n
- 每条边长 = 2r · sin(π/n)
- 周长 = 2nr · sin(π/n)
- 周长/直径 = n · sin(π/n) → π 的下界

**外切正 n 边形**（边与圆相切）：
- 每条边长 = 2r · tan(π/n)
- 周长 = 2nr · tan(π/n)
- 周长/直径 = n · tan(π/n) → π 的上界

**验证**（n=6）：
- 下界 = 6 · sin(30°) = 6 · 0.5 = 3.000 ✓
- 上界 = 6 · tan(30°) = 6 · 0.5774 = 3.4641 ✓

**验证**（n=96）：
- 下界 = 96 · sin(π/96) ≈ 3.14103 → 3.1408（阿基米德结果）
- 上界 = 96 · tan(π/96) ≈ 3.14271 → 3.1429（阿基米德结果）
- 注：阿基米德用的是 96 边形周长/直径，结果与现代计算一致

### 3.4 不需要新增的函数

| 函数 | 原因 |
|------|------|
| `approximationError` | 用 `Math.abs(upper - lower)` 内联计算即可 |
| `circumscribedPolygonVertices` | 外切多边形顶点可通过内接顶点 + 缩放因子 `1/cos(π/n)` 计算，内联在组件中 |

---

## 4. 组件设计

### 4.1 文件结构

```
src/components/experiments/geometry/
├── ArchimedesPolygonLab.tsx    ← 新增，唯一新文件
├── MeasurementLab.tsx          ← 已有
├── PythagorasProof.tsx         ← 已有
└── DraggablePoint.tsx          ← 已有（本实验不使用）
```

**不新增子组件。** 理由：
- SVG 画布逻辑（圆 + 两个多边形 + 标注）不超过 80 行，不值得拆分
- 结果面板逻辑（数值 + 进度条 + 历史对比）不超过 60 行，不值得拆分
- 预设按钮组是 5 个 `<button>` 元素，不需要独立组件
- 遵循"先保持单组件，避免过早抽象"原则
- 如果 Phase 2 后续实验需要类似的"逼近可视化"模式，再抽取共享组件

### 4.2 组件结构

```typescript
interface ArchimedesPolygonLabProps {
  experiment: Experiment;
}

export default function ArchimedesPolygonLab({ experiment }: ArchimedesPolygonLabProps) {
  // State: sides (number, 6-96)
  // Derived: archimedesApproximation(sides), vertices for inscribed/circumscribed
  // Render: ExperimentContainer → SVG + slider + presets + resultPanel
}
```

### 4.3 关键渲染逻辑

**内接多边形**: `regularPolygonVertices(n, RADIUS, CENTER)` → `<polygon>`

**外切多边形**: 内接顶点 × `1/cos(π/n)` → `<polygon>`（虚线描边）

**圆**: `<circle cx={400} cy={300} r={RADIUS} />`

**标注**:
- 圆心小圆点
- 半径线段 + "r" 标签
- "n = 12" 边数标注（画布上方）
- 内接多边形标签 "内接 · π 下界"
- 外切多边形标签 "外切 · π 上界"

### 4.4 响应式

- SVG 使用 `viewBox="0 0 800 600"` + `className="w-full h-auto"`
- 预设按钮组使用 flex wrap
- 结果面板使用 grid 响应式布局

---

## 5. 数据配置分析

### 5.1 JSON 现有配置检查

```json
{
  "id": "archimedes-polygon-approximation",
  "title": "多边形逼近",
  "type": "parameter-slider",
  "scene": {
    "description": "圆内接正多边形，边数从 3 开始逐步增加",
    "goal": "观察多边形面积如何逼近圆面积",
    "initialState": { "sides": 3, "radius": 200 }
  },
  "interaction": {
    "controls": [{ "id": "sides-slider", "type": "slider", "min": 3, "max": 128, "step": 1 }]
  },
  "guidance": {
    "hints": ["从三角形开始，逐步增加边数", "观察多边形面积和圆面积的差距"],
    "discoveries": ["边数越多，多边形越接近圆", "当边数趋向无穷时，多边形面积等于圆面积"],
    "completionCriteria": "用户观察到边数增加时面积趋近 pi*r^2"
  }
}
```

### 5.2 需要更新的字段

| 字段 | 当前值 | 建议更新 | 原因 |
|------|--------|----------|------|
| `scene.description` | "圆内接正多边形，边数从 3 开始逐步增加" | "圆的内接与外切正多边形，边数增加时 π 的上下界逐渐收敛" | 加入外切和上下界概念 |
| `scene.goal` | "观察多边形面积如何逼近圆面积" | "观察内接/外切多边形如何夹逼 π 的值" | 从面积逼近改为 π 逼近 |
| `initialState.sides` | 3 | 6 | 六边形是更有意义的起点 |
| `interaction.controls[0].min` | 3 | 6 | 与 initialState 一致 |
| `guidance.hints` | 2 条 | 4 条 | 加入上下界和阿基米德历史 |
| `guidance.discoveries` | 2 条 | 4 条 | 加入夹逼和历史验证 |
| `guidance.completionCriteria` | "用户观察到边数增加时面积趋近 pi*r^2" | "用 96 边形验证上下界区间宽度小于 0.01" | 具体、可验证 |

### 5.3 不修改 Schema

- 不新增字段，只更新现有字段的值
- 不新增 controls（预设按钮是 UI 增强，不需要在 JSON 中声明）
- ExperimentType 保持 `parameter-slider`

---

## 6. 复用与新增能力

### 6.1 复用已有能力

| 已有能力 | 来源 | 复用方式 |
|----------|------|----------|
| ExperimentContainer | `experiments/ExperimentContainer.tsx` | 统一布局容器 |
| GuidancePanel | `experiments/GuidancePanel.tsx` | 引导面板（hints + discoveries） |
| FormulaDisplay | `components/math/FormulaDisplay.tsx` | 数学公式渲染 |
| SVG 网格 pattern | PythagorasProof.tsx | 背景网格 |
| slider 模式 | BabylonianBaseLab.tsx | slider + 标记点模式 |
| registry 动态加载 | `lib/experiments/registry.ts` | 注册表模式 |
| Point 类型 | `lib/math/geometry.ts` | 类型复用 |

### 6.2 新增能力

| 新增 | 文件 | 可复用性 |
|------|------|----------|
| `regularPolygonVertices()` | `lib/math/geometry.ts` | 高：任何需要正多边形的场景 |
| `regularPolygonPerimeter()` | `lib/math/geometry.ts` | 高：周长计算 |
| `archimedesApproximation()` | `lib/math/geometry.ts` | 中：π 逼近专用，但计算模式通用 |
| `ArchimedesPolygonLab.tsx` | `experiments/geometry/` | 低：实验专用组件 |

### 6.3 不新增的能力

| 不新增 | 原因 |
|--------|------|
| PolygonCanvas.tsx | 过早抽象，Phase 2 后续实验再评估 |
| BoundsDisplay.tsx | 结果面板逻辑简单，内联在主组件 |
| `lib/math/polygon.ts` | 函数不多，放入现有 geometry.ts |
| 新的 ExperimentType | parameter-slider 已足够 |

---

## 7. 如何避免做成"圆周率计算器"

这是一个关键设计问题。如果用户只是看数字变化，这个实验就退化成了一个 π 计算器。

### 7.1 问题分析

"圆周率计算器"的特征：
- 用户输入 n，输出 π 的近似值
- 核心体验是"看数字"
- 没有几何直觉的建立

"阿基米德逼近实验"的特征：
- 用户通过调整 n，**亲眼看到**多边形"贴合"圆的过程
- 核心体验是"看图形变化 + 理解夹逼"
- 建立"以直代曲"和"上下界收敛"的直觉

### 7.2 设计策略

**策略 1：双多边形可视化**
- 同时显示内接（蓝色）和外切（红色）多边形
- 用户看到的是一个"蓝色在内、红色在外"的夹逼带
- 带的宽度 = 上界 - 下界，随 n 增加而**肉眼可见地变窄**
- 这比单一数字变化更有视觉冲击力

**策略 2：夹逼进度条**
- 在结果面板中用一个横向进度条可视化 [下界, 上界] 区间
- 进度条两端标记 3.0 和 3.5，中间标记 π 的真实值
- 随着 n 增加，区间条**肉眼可见地收缩到 π 附近**
- 这比"下界 3.14103，上界 3.14271"的纯数字更有直觉

**策略 3：历史对比**
- 显示"阿基米德用 96 边形得到 3.1408 < π < 3.1429"
- 用户可以复现这个历史结果，感受到与 2200 年前的数学家"做同一件事"
- 当 n=96 时，显示"恭喜，你得到了和阿基米德一样的结果"

**策略 4：关键节点引导**
- 预设按钮 6/12/24/48/96 引导用户在"有意义的"节点间跳跃
- 每个节点都有对应的变化描述（如"从 6 到 12：区间宽度减半"）
- 避免用户无目的地拖动 slider

**策略 5：误差收敛可视化**
- 在结果面板中显示误差（区间宽度）随 n 增加的变化
- 可以用一个小型表格或文字描述："n=6 时误差 0.46，n=12 时误差 0.12，n=24 时误差 0.03..."
- 让用户理解"收敛速度"的概念

### 7.3 强调"过程"而非"结果"

- 引导面板的 completionCriteria 不是"计算出 π"，而是"验证区间宽度小于 0.01"
- 发现（discoveries）强调的是"为什么"和"怎么变"，而不是"是什么"
- 结果面板的标题是"π 的逼近"而不是"π 的计算"

---

## 8. 文件变更清单

### 8.1 新增文件

| 文件 | 说明 |
|------|------|
| `src/components/experiments/geometry/ArchimedesPolygonLab.tsx` | 实验组件 |

### 8.2 修改文件

| 文件 | 变更 |
|------|------|
| `src/lib/math/geometry.ts` | 新增 `regularPolygonVertices`、`regularPolygonPerimeter`、`archimedesApproximation` |
| `src/lib/experiments/registry.ts` | 新增 `archimedes-polygon-approximation` → `ArchimedesPolygonLab` 映射 |
| `data/nodes/ancient-greece/archimedes-area.json` | 更新 scene.description、scene.goal、initialState.sides、controls.min、guidance |

### 8.3 不修改文件

| 文件 | 原因 |
|------|------|
| `src/types/timeline.ts` | 不新增 ExperimentType |
| `src/components/experiments/ExperimentContainer.tsx` | 容器不变 |
| `src/components/experiments/GuidancePanel.tsx` | 引导面板不变 |

---

## 9. 验证方案

### 9.1 功能验证

| 验证项 | 方法 | 预期结果 |
|--------|------|----------|
| slider 拖动 | 拖动 slider 6→96 | SVG 实时更新，无卡顿 |
| 预设按钮 | 点击 12/24/48/96 | slider 跳转，SVG 更新 |
| 内接多边形 | n=6 时检查 | 正六边形内接于圆 |
| 外切多边形 | n=6 时检查 | 正六边形外切于圆，虚线描边 |
| π 下界 | n=6 | 3.0000 |
| π 上界 | n=6 | 3.4641 |
| 区间宽度 | n=6 | 0.4641 |
| n=96 | 检查上下界 | 3.1408 < π < 3.1429 |
| 引导面板 | 展开提示和发现 | 内容从 JSON 正确加载 |
| 响应式 | 缩小窗口 | SVG 自适应，无溢出 |

### 9.2 数学验证

| 验证项 | 公式 | n=6 | n=12 | n=96 |
|--------|------|-----|------|------|
| 内接周长/d | n·sin(π/n) | 3.0000 | 3.1058 | 3.14103 |
| 外切周长/d | n·tan(π/n) | 3.4641 | 3.2154 | 3.14271 |
| 区间宽度 | upper-lower | 0.4641 | 0.1096 | 0.00168 |

### 9.3 构建验证

- `npm run lint` 通过
- `npm run build` 通过
- 访问 `/experiments/archimedes-polygon-approximation` 正常渲染

---

## 10. 建议实施顺序

1. 在 `geometry.ts` 中新增 3 个纯函数 + 写简单测试验证数学正确性
2. 创建 `ArchimedesPolygonLab.tsx` 组件（SVG + slider + presets + resultPanel）
3. 更新 `registry.ts` 注册新实验
4. 更新 `archimedes-area.json` 的 scene/guidance 字段
5. 运行 lint + build 验证
6. 更新文档（backlog、session-handoff、decision-log）

---

## 11. 待确认问题

1. **slider min 值**: 建议 6（六边形），JSON 当前为 3。是否接受修改？
2. **外切多边形**: JSON 配置中未提及外切，只说"内接"。是否确认增加外切？（建议增加，这是"夹逼"的核心）
3. **预设按钮**: JSON 配置中未声明，是 UI 增强。是否接受？
4. **画布尺寸**: 建议 800×600，与 PythagorasProof 一致。是否调整？
5. **颜色方案**: 内接蓝色、外切红色、圆灰色。是否调整？
