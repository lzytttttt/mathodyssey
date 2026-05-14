# Phase 1.1 互动实验架构质量审查报告

- 审查日期：2026-05-14
- 审查范围：实验系统基座 + Shadow Measurement Lab
- 审查结论：**架构稳定，可以进入 Phase 1.2**

---

## 1. 当前架构优点

### 1.1 注册表模式清晰可扩展

`src/lib/experiments/registry.ts` 采用静态 map + 动态 import 的方式，新增实验只需添加一行映射。查找逻辑为 O(1)，无运行时扫描。后续 12 个实验也不会导致文件膨胀。

### 1.2 容器职责单一

`ExperimentContainer.tsx` 仅负责布局（场景描述 → children → 结果面板 → 引导面板），不管理任何状态。实验组件通过 `children` 和 `resultPanel` 插槽注入内容，容器与实验逻辑完全解耦。

### 1.3 计算逻辑已分离

`src/lib/math/geometry.ts` 中的 `shadowLength`、`similarTriangleHeight`、`computeShadowData` 均为纯函数，无 DOM 依赖，可独立测试。MeasurementLab 调用这些函数而非自行计算。

### 1.4 DraggablePoint 可复用

`DraggablePoint.tsx` 接收 `svgRef`、`onMove`、约束边界等 props，不绑定任何实验逻辑。支持 `verticalOnly`/`horizontalOnly` 约束，可直接用于毕达哥拉斯面积验证实验。

### 1.5 数据驱动的引导系统

hints、discoveries、completionCriteria 全部从 JSON 配置读取，GuidancePanel 组件不包含任何实验特定内容。

### 1.6 移动端/桌面端双通道

SVG 拖拽（桌面）+ slider 控件（移动端/精确输入）共享同一组 state，不存在状态冲突。

---

## 2. 当前架构风险

### 2.1 useDrag Hook 未被使用（低风险）

`src/hooks/useDrag.ts` 已实现但未被任何组件引用。DraggablePoint 自行实现了指针处理逻辑，两者功能重叠。

**影响**：Dead code，增加维护负担但不影响运行。
**建议**：保留 useDrag 供后续非 SVG 拖拽场景使用（如 Canvas），暂不删除。后续实验如果 DraggablePoint 不能满足需求，再统一到 useDrag。

### 2.2 SVG 坐标转换逻辑重复（低风险）

DraggablePoint 和 useDrag 各自实现了 `getSVGPoint`（`createSVGPoint` + `getScreenCTM().inverse()`）。逻辑完全相同，约 10 行代码。

**影响**：如果 SVG 坐标转换 API 变更，需要改两处。
**建议**：暂不抽取。等第三个实验需要此逻辑时，再提取为 `src/lib/visualization/svg.ts` 工具函数。

### 2.3 MeasurementLab 中存在中文文案硬编码（中风险）

SVG 中的标签文字（`"拖动调角度"`、`"拖动调标杆"`、`"太阳角度"`、`"标杆高度"` 等）直接写在组件中，未从 JSON 配置读取。

**影响**：违反 CLAUDE.md "不允许把数学内容硬编码在组件中"原则。但如果后续需要国际化，这些 UI 文案应属于组件层而非数据层。
**建议**：当前 MVP 阶段可接受。这些是 UI 标签而非数学内容。如果后续需要多语言支持，应抽取为 i18n 资源文件，而非放入 JSON 数据。

### 2.4 buildingHeight 硬编码为 200（中风险）

`const buildingHeight = 200` 在 MeasurementLab 中硬编码，虽然 JSON 的 `initialState` 中也定义了 `buildingHeight: 200`，但组件并未从 `experiment.scene.initialState` 读取。

**影响**：修改 JSON 配置不会影响实际渲染。
**建议**：这是需要修复的问题。组件应该从 `experiment.scene.initialState.buildingHeight` 读取初始值。

### 2.5 动态 LaTeX 公式拼接（低风险）

```typescript
formula={`h = ${stickHeight} \\times \\frac{${buildingShadow.toFixed(1)}}{${stickShadow.toFixed(1)}} = ${calculatedHeight.toFixed(1)}`}
```

模板字符串拼接 LaTeX 在当前场景可用，但如果数值包含特殊字符（如负号、多位小数），可能导致 LaTeX 解析错误。

**影响**：当前实验中数值均为正数且 toFixed(1)，风险极低。
**建议**：暂不处理。后续如果公式更复杂，考虑创建一个安全的 LaTeX 模板工具函数。

---

## 3. 必须立即修复的问题

### 3.1 ~~`nodeTitle` prop 类型不一致~~ — 已修复

registry 接口中 `nodeTitle: string`（必填），ExperimentContainer 中 `nodeTitle?: string`（可选），MeasurementLab 接收但未使用。

**修复**：将 registry 和 MeasurementLab 中的 `nodeTitle` 改为可选或移除。已完成。

### 3.2 ~~MeasurementLab 未使用 `similarTriangleHeight` 函数~~ — 已修复

组件内联了 `stickHeight * (buildingShadow / stickShadow)` 而非调用 `geometry.ts` 中已有的 `similarTriangleHeight`。

**修复**：改为调用 `similarTriangleHeight(stickHeight, stickShadow, buildingShadow)`。已完成。

### 3.3 ~~buildingHeight 未从 JSON 配置读取~~ — 已修复

组件原先硬编码 `buildingHeight = 200`，已改为从 `experiment.scene.initialState` 读取 `sunAngle`、`stickHeight`、`buildingHeight` 三个初始值，建立"组件从 JSON 读取初始状态"的正确模式。

---

## 4. 可以延后处理的问题

| 问题 | 延后理由 | 触发条件 |
|------|----------|----------|
| useDrag 与 DraggablePoint 功能重叠 | 当前只有 1 个实验使用拖拽 | 第 3 个实验需要拖拽时统一 |
| SVG 坐标转换逻辑重复 | 仅 10 行，变更概率低 | SVG API 变更或第 3 处使用 |
| LaTeX 动态拼接安全性 | 当前数值范围安全 | 出现负数或复杂表达式 |
| GuidancePanel 标题 "探索引导" 硬编码 | MVP 阶段单语言 | 需要多语言支持 |
| `computeShadowData` 未被使用 | MeasurementLab 分步调用更清晰 | 需要批量计算时 |

---

## 5. 对第二个实验"毕达哥拉斯面积验证"的影响

### 可直接复用

- `ExperimentContainer` — 布局完全适用
- `GuidancePanel` — 引导面板直接复用
- `DraggablePoint` — 拖拽正方形顶点，`verticalOnly`/`horizontalOnly` 约束可用
- `FormulaDisplay` — 渲染 a² + b² = c²
- `registry.ts` — 添加一行映射即可
- `geometry.ts` — 需要新增 `pythagoreanDistance` 等函数

### 需要注意

1. **初始状态读取模式**：在修复 3.3 后，第二个实验应从 `experiment.scene.initialState` 读取初始值（如 `a: 3, b: 4`），而非硬编码。
2. **新组件需求**：需要 `ShapeRenderer`（渲染正方形）或直接在组件内用 SVG `<rect>` + 旋转。不需要单独的 ShapeRenderer 组件 — 直接用 SVG 基础元素即可。
3. **SVG 坐标系**：毕达哥拉斯实验的坐标系与影子测高不同，DraggablePoint 需要支持 2D 自由拖拽（非仅垂直/水平），当前已支持。

---

## 6. 是否建议继续进入 Phase 1.2

**建议：是。**

当前架构满足以下条件：
- 注册表可扩展 ✅
- 容器职责单一 ✅
- 计算逻辑分离 ✅
- 拖拽组件可复用 ✅
- 数据驱动引导 ✅
- build + lint 通过 ✅

在修复 buildingHeight 读取问题后，可以立即开始第二个实验。

---

## 7. 已修复的问题清单

| 问题 | 修复内容 |
|------|----------|
| `nodeTitle` prop 类型不一致 | registry 改为可选，MeasurementLab 移除该 prop |
| MeasurementLab 内联计算 | 改为调用 `similarTriangleHeight()` |
| 实验页面传递无用 nodeTitle | 移除 `nodeTitle={node.title}` |
| buildingHeight 硬编码 | 改为从 `experiment.scene.initialState` 读取 |

## 8. 建议在 Phase 1.2 开始前修复

所有阻塞问题已修复，无剩余必须修复项。

---

## 9. 验证结果

- `npm run lint`：0 errors, 0 warnings ✅
- `npm run build`：17 pages 全部生成 ✅
