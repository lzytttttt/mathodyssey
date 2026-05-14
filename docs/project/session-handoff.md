# 会话交接文档

## 当前项目阶段

**Phase 2 Planning 已完成，准备进入 Phase 2 Wave 1**

- Phase 0（项目初始化）：✅ 全部完成
- Phase 1（MVP 原型）：✅ 全部完成（基础框架 + 4 个互动实验）
- Phase 1.5（移动端适配）：✅ 全部完成（时间轴触摸交互 + 版权声明）
- **Phase 2 Planning**：✅ 已完成（主线确定、5 个实验规划、文档同步）
- 下一里程碑：Phase 2 Wave 1（鸡兔同笼 + 多边形逼近）

---

## 已完成内容

### 项目基础设施（Phase 0）
- [x] Next.js 16 项目初始化（App Router + TypeScript + Tailwind CSS）
- [x] ESLint 配置，`npm run lint` 通过
- [x] 核心依赖安装：KaTeX, D3, Framer Motion, Zustand, clsx
- [x] 目录结构符合 `docs/engineering/technical-architecture.md` 规范

### 类型与数据层
- [x] TypeScript 类型定义 `src/types/timeline.ts`（完整 TimelineNode 体系）
- [x] 设计令牌 `src/styles/tokens.ts`（颜色、字体、间距）
- [x] 数据加载函数 `src/lib/data/nodes.ts`（动态 import）
- [x] 时代数据 `src/lib/data/eras.ts`

### UI 组件
- [x] 布局组件：Header, Footer
- [x] 基础组件：Button, Card
- [x] 数学组件：FormulaDisplay（KaTeX 集成）
- [x] 内容组件：NarrativeCard, ConceptCard, ObjectiveCard, ChallengeCard, ExperimentEntry, NodeCard

### 时间轴系统
- [x] TimelineCanvas（SVG 画布 + 拖拽平移 + 滚轮缩放）
- [x] TimelineNode（节点标记 + 点击跳转）
- [x] EraMarker（时代背景着色）

### 内容数据
- [x] 12 个节点 JSON 文件（全部通过 build 验证）

### 页面
- [x] 首页 `src/app/page.tsx`（时间轴 + 节点卡片网格）
- [x] 节点详情页 `src/app/timeline/[nodeId]/page.tsx`（SSG + generateStaticParams）
- [x] 实验页面 `src/app/experiments/[experimentId]/page.tsx`（registry 动态加载）
- [x] 关于页面 `src/app/about/page.tsx`

### 互动实验系统（Phase 1.1 + 1.2）
- [x] 实验注册表 `src/lib/experiments/registry.ts`（experimentId → 组件映射）
- [x] 实验容器 `src/components/experiments/ExperimentContainer.tsx`（统一布局）
- [x] 引导面板 `src/components/experiments/GuidancePanel.tsx`（提示/发现/完成标准）
- [x] SVG 拖拽组件 `src/components/experiments/geometry/DraggablePoint.tsx`（Pointer Events）
- [x] useDrag Hook `src/hooks/useDrag.ts`（SVG 坐标转换 + 边界约束）
- [x] 几何计算函数 `src/lib/math/geometry.ts`（纯函数：阴影长度、相似三角形、勾股定理、正方形顶点）
- [x] 数值系统计算函数 `src/lib/math/numberSystems.ts`（纯函数：进制转换、位值拆解、HMS 转换）
- [x] Shadow Measurement Lab `src/components/experiments/geometry/MeasurementLab.tsx`
  - SVG 画布：太阳、标杆、建筑、影子、光线
  - 可拖拽：太阳高度角、标杆高度
  - 滑块控件：移动端兼容
  - 实时计算：影子长度、相似三角形比例、建筑高度
  - 公式展示：KaTeX 渲染比例公式
  - 引导面板：提示、发现、完成标准
- [x] Pythagorean Area Proof Lab `src/components/experiments/geometry/PythagorasProof.tsx`
  - SVG 画布：直角三角形 + 三条边外侧正方形
  - 可拖拽：a、b 两条直角边
  - 滑块控件：移动端兼容
  - 实时计算：a²、b²、c²，自动验证 a²+b²=c²
  - 正方形方向：`squareOnEdgeAwayFromPoint` 向量叉积自动判断
  - 公式展示：KaTeX 渲染勾股定理
  - 引导面板：提示、发现、完成标准
- [x] Babylonian Base Conversion Lab `src/components/experiments/number-system/BabylonianBaseLab.tsx`
  - Slider + 数字输入：0-10000 范围，双向同步
  - 60 进制表示：高位在前格式（如 1;2;3）
  - 位值拆解：可视化条 + 等式展示
  - 现代连接：时间（小时:分:秒）、角度（度:分:秒）
  - 因数展示：60 的 12 个因数
  - 位值可视化组件 `PlaceValueBlocks.tsx`
- [x] Pascal Dice Simulation Lab `src/components/experiments/probability/PascalDiceLab.tsx`
  - 掷骰子模拟：1/10/100 次批量操作 + 重置
  - 骰子面渲染：SVG 标准点数布局 `DiceFace.tsx`
  - 频率图表：div 柱状图 + 理论概率虚线标记 `FrequencyChart.tsx`
  - 大数定律验证：频率随试验次数趋向理论概率
  - 结果面板：解释 7 最常见的组合原理（6/36）

### 验证结果
- [x] `npm run build` 通过（17 个页面全部生成）
- [x] `npm run lint` 通过（0 errors, 0 warnings）

### 时间轴移动端适配（Phase 1.5）
- [x] useTimelinePanZoom hook `src/hooks/useTimelinePanZoom.ts`
  - Pointer Events 统一处理鼠标和触摸
  - 单指拖拽平移（setPointerCapture + 边界约束）
  - 双指 pinch 缩放（距离比计算 + 中点缩放）
  - 桌面端滚轮缩放
  - 点击 vs 拖拽区分（5px 阈值）
  - touch-action: none 防止浏览器默认手势
  - 纯函数分离：clampZoom、calculatePinchDistance、calculatePanDelta
- [x] TimelineCanvas 重构为使用 hook
- [x] 版权声明：Footer + README + LICENSE（Apache 2.0）

### 验证结果（Phase 1.5）
- [x] `npm run build` 通过（17 个页面全部生成）
- [x] `npm run lint` 通过（0 errors, 0 warnings）

---

## 未完成内容

| 任务 | 优先级 | 预估工作量 | 说明 |
|------|--------|-----------|------|
| Phase 2 Wave 1：鸡兔同笼 + 多边形逼近 | P0 | 中 | slider 复用模式 |
| Phase 2 Wave 2：面积完成法 | P0 | 中 | geometry-drag 复用模式 |
| Phase 2 Wave 3：数轴运算 + 坐标探索器 | P1 | 高 | 2 个新范式 |
| Husky + lint-staged | P2 | 低 | 提交时自动检查 |

---

## 下一步优先任务

### 1. Phase 2 Wave 1：Slider 复用（P0）

1. **鸡兔同笼假设法**（china-chicken-rabbit-lab）— parameter-slider
   - 复用 BabylonianBaseLab 的 slider 模式
   - 新增 algebra.ts 纯函数模块
   - 动物图标可视化 + 结果面板
2. **多边形逼近圆**（archimedes-polygon-approximation）— parameter-slider
   - 复用 slider 模式 + SVG 多边形渲染
   - 扩展 geometry.ts 添加多边形面积函数
   - 圆 + 内接正多边形 + 面积对比

### 2. Phase 2 Wave 2：几何代数（P0）

3. **面积完成法**（al-khwarizmi-area-completion）— geometry-drag
   - 复用 PythagorasProof 的 SVG + DraggablePoint
   - x² + bx 的几何分解 + 拖拽拼合

### 3. Phase 2 Wave 3：新范式（P1）

4. **数轴运算**（brahmagupta-number-line）— number-line（新范式）
   - 新建 NumberLine.tsx 基础组件
   - 小人跳跃动画 + 运算可视化
5. **坐标探索器**（descartes-coordinate-explorer）— coordinate-plotter（新范式）
   - 新建 CoordinatePlane.tsx 基础组件
   - Phase 3 微积分实验的前置架构

---

## 当前关键约束

1. **不允许把数学内容硬编码在组件中** — 所有内容从 JSON 数据加载
2. **不允许一次性扩大 MVP** — 严格遵守 Phase 1 范围（4 个实验）
3. **实验逻辑需要可复用** — 基础交互组件（DraggablePoint, Slider 等）应设计为通用组件
4. **每次开发后必须更新文档** — backlog.md, roadmap.md, decision-log.md
5. **实验组件不包含历史叙述** — 通过 props 接收配置，只负责交互逻辑和可视化
6. **遵循组件分层原则** — 页面 → 功能 → 业务 → 基础，不可反向依赖

---

## 下次继续时应该阅读的文件

### 必读（按顺序）
1. `docs/project/session-handoff.md` — 本文件，了解当前状态
2. `docs/project/phase-2-planning.md` — Phase 2 完整规划（主线、实验、波次、架构）
3. `docs/content/timeline-node-schema.md` — 实验数据结构定义
4. `docs/content/content-system.md` — 实验设计规范（第 138-218 行）
5. `docs/project/backlog.md` — 任务列表和依赖关系（F-04-06 ~ F-04-10）

### 参考
6. `CLAUDE.md` — 开发原则和约束
7. `docs/project/roadmap.md` — Phase 2 验收标准
8. `docs/project/decision-log.md` — 已有技术决策（特别是 DEC-012 Phase 2 主线选择）
9. `docs/project/phase-1-final-review.md` — Phase 1 最终审查报告

### 代码（Wave 1 参考）
10. `src/components/experiments/number-system/BabylonianBaseLab.tsx` — slider 实验参考模式（鸡兔同笼复用）
11. `src/lib/math/numberSystems.ts` — 纯函数模块参考模式
12. `src/lib/math/geometry.ts` — 几何计算纯函数（多边形逼近扩展）
13. `src/components/experiments/ExperimentContainer.tsx` — 实验容器
14. `src/lib/experiments/registry.ts` — 实验注册表（Wave 1 需新增 2 条）
15. `data/nodes/ancient-china/china-chicken-rabbit.json` — 鸡兔同笼实验配置
16. `data/nodes/ancient-greece/archimedes-area.json` — 多边形逼近实验配置

---

## 技术决策记录

| 决策 ID | 内容 | 日期 |
|---------|------|------|
| DEC-001 | 采用时间轴作为主交互 | 2026-05-14 |
| DEC-002 | 第一版聚焦 MVP | 2026-05-14 |
| DEC-003 | 使用结构化内容数据 | 2026-05-14 |
| DEC-004 | 互动实验先轻后重 | 2026-05-14 |
| DEC-005 | 技术栈选择 Next.js + TypeScript + React | 2026-05-14 |
| DEC-006 | 采用动态 import 加载 JSON 数据 | 2026-05-14 |
| DEC-007 | 实验架构：注册表 + 容器 + 按类型分目录 | 2026-05-14 |
| DEC-008 | 几何渲染辅助函数放入 lib/math/geometry.ts | 2026-05-14 |
| DEC-009 | 数值系统实验归入 number-system 目录 | 2026-05-14 |
| DEC-010 | 概率实验归入 probability 目录，纯函数独立为 probability.ts | 2026-05-14 |
| DEC-011 | 时间轴交互采用 Pointer Events 统一鼠标和触摸 | 2026-05-14 |
| DEC-012 | Phase 2 主线选择"从几何到代数"，5 个实验 | 2026-05-14 |
| DEC-013 | Phase 2 暂不进入微积分和图论（前置架构未就绪） | 2026-05-14 |

---

## 文件变更摘要（Phase 1.1 ~ 1.5）

### 新增文件（Phase 1.5）

```
src/
├── hooks/
│   └── useTimelinePanZoom.ts       # 时间轴平移/缩放 Hook（Pointer Events）
└── LICENSE                          # Apache 2.0 许可证
```

### 修改文件（Phase 1.5）

- `src/components/timeline/TimelineCanvas.tsx` — 重构为使用 useTimelinePanZoom hook
- `src/components/layout/Footer.tsx` — 添加 Apache 2.0 版权声明
- `README.md` — 添加版权和许可证章节
- `docs/project/decision-log.md` — 新增 DEC-011
- `docs/project/backlog.md` — 新增 F-02-06、更新 T-02-01-07 状态
- `docs/project/roadmap.md` — 新增 Phase 1.5 章节、更新移动端验收
- `docs/project/session-handoff.md` — Phase 1.5 状态更新

### 新增文件（Phase 1.1 ~ 1.4）（15 个）

```
src/
├── components/experiments/
│   ├── ExperimentContainer.tsx     # 实验统一容器
│   ├── GuidancePanel.tsx           # 引导面板
│   ├── geometry/
│   │   ├── DraggablePoint.tsx      # 可拖拽 SVG 点
│   │   ├── MeasurementLab.tsx      # 影子测高实验
│   │   └── PythagorasProof.tsx     # 勾股定理面积验证实验
│   ├── number-system/
│   │   ├── BabylonianBaseLab.tsx   # 巴比伦进制转换实验
│   │   └── PlaceValueBlocks.tsx    # 位值可视化条组件
│   └── probability/
│       ├── PascalDiceLab.tsx       # 掷骰子模拟实验
│       ├── DiceFace.tsx            # SVG 骰子面组件
│       └── FrequencyChart.tsx      # 频率柱状图组件
├── hooks/
│   └── useDrag.ts                  # SVG 拖拽 Hook
└── lib/
    ├── experiments/
    │   └── registry.ts             # 实验注册表
    └── math/
        ├── geometry.ts             # 几何计算纯函数
        ├── numberSystems.ts        # 进制转换纯函数
        └── probability.ts          # 概率统计纯函数
```

### 修改文件

- `src/app/experiments/[experimentId]/page.tsx` — 改造为 registry 动态加载
- `src/lib/experiments/registry.ts` — 注册 4 个实验组件
- `data/nodes/ancient-egypt/egypt-land-measurement.json` — 更新实验配置为影子测高
- `data/nodes/ancient-greece/pythagoras-theorem.json` — 补充 b 边 draggable-point 控件
- `docs/project/backlog.md` — 新增 F-04-00、更新 F-04-01~03 状态
- `docs/project/roadmap.md` — 更新 Phase 1 实验进度（4/4）
- `docs/project/decision-log.md` — 新增 DEC-007~010
- `docs/project/session-handoff.md` — Phase 1 完成状态更新
