# 项目路线图

## 项目阶段划分

MathOdyssey 采用渐进式开发策略，分为 6 个阶段。每个阶段有明确的目标、交付物和验收标准。

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
 基础设施    MVP 原型    互动实验    内容扩展    学习路径    产品化
```

| 阶段 | 名称 | 核心目标 | 预估周期 |
|------|------|----------|----------|
| Phase 0 | 项目初始化 | 建立基础设施和文档体系 | 1-2 周 |
| Phase 1 | MVP 原型 | 验证核心体验 | 4-6 周 |
| Phase 2 | 核心互动实验 | 完善互动体验 | 4-6 周 |
| Phase 3 | 内容体系扩展 | 扩展内容和引入 CMS | 6-8 周 |
| Phase 4 | 学习路径与挑战 | 完善学习系统 | 6-8 周 |
| Phase 5 | 产品化和发布 | 生产就绪 | 4-6 周 |

---

## Phase 0：项目初始化

### 目标
建立项目基础设施、文档体系和开发规范，为后续开发提供清晰的框架。

### 交付物

| 交付物 | 说明 | 状态 |
|--------|------|------|
| 项目文档体系 | vision、architecture、content-system 等文档 | ✅ 完成 |
| 数据 Schema | TimelineNode 类型定义和 JSON Schema | ✅ 完成 |
| MVP 内容规划 | 12 个数学史节点的详细规划 | ✅ 完成 |
| 决策记录 | ADR 和 decision-log | ✅ 完成 |
| 协作规范 | CLAUDE.md 工作规范 | ✅ 完成 |
| Next.js 项目初始化 | TypeScript + Tailwind + ESLint + Prettier | ✅ 完成 |
| 设计系统基础 | 颜色、字体、间距的 Token 定义 | ✅ 完成 |

### 验收标准
- [x] 项目 `npm run dev` 正常启动
- [x] `npm run build` 通过
- [x] `npm run lint` 通过
- [x] 所有文档内容完整、结构清晰
- [x] TypeScript 类型定义与文档一致
- [x] 目录结构符合技术架构文档

---

## Phase 1：MVP 原型

### 目标
实现最小可用产品，验证时间轴 + 互动实验的核心体验。

### 交付物

| 交付物 | 说明 | 优先级 | 状态 |
|--------|------|--------|------|
| 水平时间轴 | 可浏览、可缩放、可点击的时间轴界面 | P0 | ✅ 完成 |
| 节点详情页 | 展示历史叙述、数学概念、学习目标、实验入口 | P0 | ✅ 完成 |
| 12 个节点内容 | JSON 格式的节点数据（历史叙述 + 数学概念 + 学习目标 + 挑战问题） | P0 | ✅ 完成 |
| 实验系统基座 | 注册表、容器、引导面板、拖拽 Hook | P0 | ✅ 完成 |
| 4 个完整互动实验 | 丈量土地(几何)、毕达哥拉斯面积(几何)、进制转换(代数)、掷骰子(概率) | P1 | ✅ 完成 |
| 响应式设计 | 支持桌面和平板 | P1 | 待开始 |
| 基础挑战问题 | 每个节点 2 道题，展示即可，不做自动评分 | P2 | ✅ 完成 |

### Phase 1 实验策略

Phase 1 为 4 个低复杂度节点实现完整互动实验，其余 8 个节点在详情页展示"实验即将推出"占位符。

| 节点 | 实验 | 复杂度 | Phase | 状态 |
|------|------|--------|-------|------|
| egypt-land-measurement | 影子测高（相似三角形） | 中 | Phase 1 | ✅ 完成 |
| pythagoras-theorem | 面积拼图验证 | 中 | Phase 1 | ✅ 完成 |
| babylon-base60 | 进制转换器 | 低 | Phase 1 | ✅ 完成 |
| pascal-fermat-probability | 掷骰子模拟器 | 中 | Phase 1 | ✅ 完成 |
| 其余 8 个节点 | — | — | Phase 2 补全 | — |

### 验收标准
- [x] 用户可以沿时间轴浏览 12 个数学史节点
- [x] 用户可以点击节点查看详情
- [x] 时间轴支持缩放和平移
- [x] 4 个互动实验可运行（丈量土地、毕达哥拉斯、进制转换、掷骰子）
- [x] 其余 8 个节点有完整内容卡片（历史叙述、数学概念、学习目标、挑战问题），实验入口显示"即将推出"
- [x] 桌面和平板上布局正常（桌面 ✅，平板 ✅，手机时间轴 ✅）
- [x] 数学公式正确渲染
- [x] 页面加载时间 < 3 秒

### Phase 1 Final Review

详见 `docs/project/phase-1-final-review.md`。

- 架构复盘：4 实验范式闭环验证通过
- 移动端：桌面/平板 OK，手机时间轴触摸交互待补充（P1）
- 内容一致性：12 节点 JSON 完整，ID 一致
- 质量：lint 0 errors，build 17 pages
- 已修复：scene.description、README、提示文字
- 建议：可进入 Phase 2，但需优先完成时间轴触摸适配

---

## Phase 1.5：时间轴移动端适配

### 目标
修复时间轴移动端触摸交互，解除 Phase 2 前置阻塞。

### 交付物

| 交付物 | 说明 | 状态 |
|--------|------|------|
| useTimelinePanZoom hook | Pointer Events 统一处理平移和缩放 | ✅ 完成 |
| TimelineCanvas 重构 | 使用 hook 替换内联鼠标事件 | ✅ 完成 |
| 版权声明 | Apache 2.0 许可证 + Footer 版权 | ✅ 完成 |

### 验收标准

- [x] 桌面端鼠标拖拽正常
- [x] 桌面端滚轮缩放正常
- [x] 移动端单指拖动平移时间轴
- [x] 移动端双指 pinch 缩放时间轴
- [x] 节点点击仍可进入详情页
- [x] 拖拽不触发节点导航
- [x] 移动端无页面横向滚动
- [x] `npm run lint` 通过
- [x] `npm run build` 通过（17 pages）

### 技术方案

- 使用 Pointer Events（W3C 标准）统一鼠标和触摸
- 单指拖拽：`pointerId` 追踪 + `setPointerCapture`
- 双指缩放：两点距离比计算缩放因子，围绕中点缩放
- 点击 vs 拖拽：移动距离 > 5px 则阻止 click 事件
- `touch-action: 'none'` 防止浏览器默认手势拦截

---

## Phase 2：从几何到代数

### 主线

人类如何从"看图说话"进化到"用符号思考"？Phase 2 沿数学史主线，追踪五个关键转折：公理化方法（欧几里得）→ 逼近思想（阿基米德）→ 代数符号（花拉子米）→ 数系扩展（婆罗摩笈多）→ 坐标几何（笛卡尔）。横跨 1800 年，为 Phase 3 微积分做好架构准备。

### 交付物

| Phase | 交付物 | 类型 | 复用能力 | 优先级 | 状态 |
|-------|--------|------|----------|--------|------|
| 2.1 | 多边形逼近圆 | parameter-slider | slider 模式 + SVG 多边形 | P0 | ✅ 完成 |
| 2.2 | 鸡兔同笼假设法 | parameter-slider | slider 模式 + 动物图标 | P0 | ✅ 完成 |
| 2.3 | 面积完成法 | parameter-slider | slider 模式 + SVG 面积动画 | P0 | ✅ 完成 |
| 2.4 | 数轴上的运算 | number-line（新范式） | number-line 范式 + numberLine.ts | P1 | ✅ 完成 |
| 2.5 | 坐标探索器 | coordinate-plotter（新范式） | DraggablePoint + FormulaDisplay | P1 | ✅ 完成 |

### 新增架构组件

| 组件 | 目录 | 后续复用 |
|------|------|----------|
| NumberLine.tsx | `experiments/number-system/` | 负数运算、不等式 |
| CoordinatePlane.tsx | `experiments/coordinate/` | Phase 3 函数图像、微积分 |
| FunctionCurve.tsx | `experiments/coordinate/` | Phase 3 切线追踪、极限可视化 |

### 验收标准

- [x] 12 个节点中 9 个有完整互动实验（Phase 1 的 4 个 + Phase 2 的 5 个）
- [ ] 剩余 3 个节点（euclid-axioms、newton-leibniz-calculus、euler-graph-theory）显示"即将推出"
- [x] 2 个新范式（number-line、coordinate-plotter）组件化完成
- [x] 新组件遵循 ExperimentContainer 统一布局
- [x] 纯函数模块（algebra.ts、coordinate.ts）无 DOM/React 依赖
- [x] 注册表更新到 9 个实验
- [x] 实验交互流畅，无明显卡顿
- [x] `npm run lint` 通过（0 errors）
- [x] `npm run build` 通过（17 pages）

### Phase 2 Final Review

详见 `docs/project/phase-2-final-review.md`。

- 架构复盘：9 实验通过 registry 接入、复用容器、纯函数分离
- 移动端：时间轴 pan/pinch OK，SVG viewBox 响应式，控件触摸友好
- 内容一致性：12 节点 JSON 完整，9 个实验 ID 一致
- 质量：lint 0 errors，build 17 pages
- 已修复：README.md Phase 2 状态
- 建议：可进入 Phase 3

### Phase 2 不做什么

| 暂缓内容 | 原因 |
|----------|------|
| 欧几里得公理构建器 | toggle 交互模式需独立设计，反馈机制复杂 |
| 牛顿切线追踪器 | 需先建立函数曲线渲染能力（coordinate-plotter 是前置） |
| 欧拉七桥探索 | 图论交互范式全新，与"代数诞生"主线关联较弱 |
| 概念图谱 | 非 MVP 阻塞项，放入 Phase 3+ |

### Phase 3 前置关系

Phase 2 建立的 `CoordinatePlane.tsx` 和 `FunctionCurve.tsx` 是 Phase 3 微积分实验（切线追踪器、极限可视化）的直接前置。Phase 3 将在此基础上实现 tangent-tracker 和 graph-exploration 两种新范式。

---

## Phase 3：从坐标到变化

### 目标

沿着"从坐标到变化"的数学史主线，建立函数可视化和微积分直觉。从笛卡尔坐标自然过渡到函数图像，再从割线斜率（平均变化率）推进到切线斜率（瞬时变化率），最后以面积累积（积分）收尾。

### 主线

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

### 交付物

| Phase | 交付物 | 类型 | 复用能力 | 优先级 | 状态 |
|-------|--------|------|----------|--------|------|
| 3.1 | Function Graph Explorer | parameter-slider | CoordinateGrid + coordinate.ts + Slider | P0 | ✅ 完成 |
| 3.2 | Average Rate of Change Lab | graph-exploration | FunctionCurve + SecantLine + calculus.ts | P0 | ✅ 完成 |
| 3.3 | Tangent Tracker | tangent-tracker | FunctionCurve + SecantLine + TangentLine | P0 | ✅ 完成 |
| 3.4 | Area Accumulation Lab | parameter-slider | FunctionCurve + AreaUnderCurve + calculus.ts | P0 | ✅ 完成 |

### 新增架构组件

| 组件/模块 | 目录 | 后续复用 |
|-----------|------|----------|
| functions.ts | `src/lib/math/` | 所有函数实验 |
| calculus.ts | `src/lib/math/` | 切线追踪、面积累积 |
| FunctionCurve.tsx | `experiments/function/` | Phase 4+ 所有函数实验 |
| SecantLine.tsx | `experiments/calculus/` | 切线追踪器（点+直线模式） |
| TangentLine.tsx | `experiments/calculus/` | 切线渲染（纯展示，接收 point+slope） |
| AreaUnderCurve.tsx | `experiments/calculus/` | 定积分可视化 |

### 节点分配

不新增节点。4 个实验分配到现有节点：

| 节点 | 新增实验 | 节点实验总数 |
|------|----------|-------------|
| descartes-coordinates | Function Graph Explorer + Average Rate of Change Lab | 3 个 |
| newton-leibniz-calculus | Tangent Tracker + Area Accumulation Lab | 2 个 |

### 验收标准

- [x] 12 个节点中 11 个有完整互动实验（Phase 3.4 后：11/12）
- [x] descartes-coordinates 节点有 3 个实验（3/3）
- [x] newton-leibniz-calculus 节点有 2 个实验（Phase 3.4：2/2）
- [x] 剩余 1 个节点（euclid-axioms）显示"即将推出"
- [x] tangent-tracker 范式组件化完成（TangentLine.tsx + TangentTrackerLab.tsx）
- [x] AreaUnderCurve.tsx 面积渲染组件完成
- [x] FunctionCurve.tsx 可渲染函数曲线（linear + quadratic）
- [x] 纯函数模块 functions.ts 无 DOM/React 依赖
- [x] 纯函数模块 calculus.ts 无 DOM/React 依赖
- [x] 注册表更新到 13 个实验（Phase 3.4 新增 1 个）
- [x] 单节点多实验机制验证通过（descartes 有 3 个实验）
- [x] `npm run lint` 通过（0 errors）
- [x] `npm run build` 通过（17 pages）
- [x] TypeScript 严格模式，无 `any` 类型

### Phase 3 不做什么

| 暂缓内容 | 原因 | 推迟到 |
|----------|------|--------|
| euler-bridge-explorer | 属于图论/离散数学，与"函数→变化"主线无关 | Phase 4 |
| euclid-axiom-builder | toggle 交互模式需独立设计 | Phase 4 |
| 大数定律可视化 | simulation 范式已有，与 Phase 3 主线无关 | Phase 4 |
| 微分方程可视化 | 前置能力不足（需先建立导数+积分） | Phase 5 |
| 概念图谱 | 非 MVP 阻塞项 | Phase 5+ |
| 自动化测试 | 纯函数无单元测试 | Phase 5+ |
| CI/CD | 手动 lint/build | Phase 5+ |

### Phase 3 Final Review

详见 `docs/project/phase-3-final-review.md`。

- 架构复盘：13 实验通过 registry 接入、复用容器、纯函数分离
- 移动端：SVG viewBox 响应式，slider 触摸友好，80 矩形无性能问题
- 内容一致性：12 节点 JSON 完整，13 个实验 ID 一致
- 质量：lint 0 errors，build 17 pages
- 已修复：README.md Phase 3 状态
- 建议：可进入 Phase 4

---

## Phase 4：从证明到结构 + 学习验证闭环

### 主线

从连续数学（函数、导数、积分）过渡到离散结构（图论、公理、证明），同时建立"探索→发现→验证"的学习闭环。

### 交付物

| Phase | 交付物 | 类型 | 优先级 | 状态 |
|-------|--------|------|--------|------|
| 4.1 | Euler Bridge Explorer | graph-exploration（图论范式落地） | P0 | ✅ 完成 |
| 4.2 | Euclid Axiom Builder | proof-builder（新范式） | P0 | ✅ 完成 |
| 4.3 | Challenge System MVP | 交互式答题 + 验证 | P0 | ✅ 完成 |

### 验收标准
- [x] 12 个节点中 12 个有完整互动实验（Phase 4.2 后：15 个注册实验，12/12 全覆盖）
- [x] proof-builder 范式组件化完成（ProofBuilderLab.tsx + proof.ts）
- [x] 新增纯函数模块：graph.ts（Phase 4.1）、proof.ts（Phase 4.2）
- [x] 新增 proof-builder ExperimentType
- [x] euclid-axioms 节点实验类型更新为 proof-builder
- [x] 挑战题系统从被动展示升级为交互验证（Phase 4.3）
- [x] 新增纯函数模块：validation.ts（Phase 4.3）
- [x] npm run lint 通过（0 errors）
- [x] npm run build 通过（17 pages）

### Phase 4 Final Review

详见 `docs/project/phase-4-final-review.md`。

- 架构复盘：15 实验通过 registry 接入、复用容器、纯函数分离
- 移动端：SVG viewBox 响应式，触摸交互友好
- 内容一致性：12 节点 JSON 完整，15 个实验 ID 一致，20 道挑战题可交互
- 质量：lint 0 errors，build 17 pages
- 已修复：euler-graph-theory 挑战题答案、page.tsx 常量重复、README/CLAUDE.md 状态
- 建议：可进入 Phase 5

---

## Phase 5：产品化和发布

### 目标
优化性能、完善用户体验、准备生产发布。

### 交付物

| 交付物 | 说明 | 优先级 |
|--------|------|--------|
| 性能优化 | 代码分割、懒加载、CDN | P0 |
| SEO 优化 | 元标签、结构化数据、站点地图 | P0 |
| 监控系统 | 错误追踪、性能监控 | P1 |
| 用户文档 | 使用指南、教师指南 | P1 |
| API 文档 | 数据接口文档 | P2 |
| 生产部署 | 部署流程、监控、备份 | P0 |

### 验收标准
- [ ] Lighthouse 性能分数 > 90
- [ ] SEO 元数据完整
- [ ] 错误监控可用
- [ ] 用户文档完整
- [ ] 生产环境稳定运行

---

## 后续迭代方向

Phase 5 之后，项目进入持续迭代阶段：

| 方向 | 说明 | 优先级 |
|------|------|--------|
| 用户账户 | 注册、登录、进度保存 | 高 |
| 社区功能 | 评论、分享、贡献 | 中 |
| 移动 App | iOS/Android 原生应用 | 低 |
| AI 辅导 | 个性化学习建议 | 中 |
| 多语言 | 英文、日文等 | 低 |
| 课堂模式 | 教师管理功能 | 高 |
| 课程映射 | 对接各国课程标准 | 高 |
| 高级可视化 | 3D、动态模拟 | 中 |
| 离线访问 | PWA 支持 | 低 |

---

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 内容质量不达标 | 影响用户体验和学习效果 | 建立编辑审查流程，参考学术资料 |
| 范围蔓延 | 延期、资源分散 | 严格遵守 MVP 边界，使用 backlog 管理 |
| 技术债务 | 维护成本增加 | 先设计架构，再写代码，定期重构 |
| 历史事实错误 | 损害平台可信度 | 建立可信度标注体系，标注参考来源 |
| 互动实验性能 | 用户体验差 | 选择合适的技术方案，渐进增强 |
