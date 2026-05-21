# Iteration v0.2.0 — UI 与学习体验优化

## 版本信息

| 字段 | 值 |
|------|------|
| 版本号 | 0.2.0 |
| 开始日期 | 2026-05-21 |
| 阶段定位 | Phase 4.5（介于功能完成与产品化之间的体验优化） |
| 前置版本 | 0.1.0（Phase 0-4 全部功能完成） |

## 迭代目标

在 Phase 0-4 功能基础上进行全面 UI 视觉升级和学习体验流程优化，使平台从"功能可用"提升到"视觉惊艳、体验流畅"的水平。

### 核心改进领域

1. **设计系统升级**：暗色主题、glassmorphism、Google Fonts、动画系统
2. **首页重设计**：沉浸式 Hero、数学符号粒子、时代导航、glass 卡片
3. **时间轴增强**：节点动画、渐变轴线、hover 预览
4. **节点详情优化**：侧边导航、章节动画、阅读体验
5. **学习进度系统**：localStorage 持久化、完成标记、全站进度条

## 设计决策

### DEC-034: 默认亮色主题 + 暗色模式切换

**决策**：保留亮色主题作为默认，添加暗色模式切换按钮。

**背景**：暗色主题更具沉浸感，但亮色主题的可读性更好，用户偏好各异。

**方案**：
- 使用 CSS 变量实现主题切换
- localStorage 持久化用户选择
- 通过 HTML `data-theme` 属性切换

### DEC-035: 引入 Google Fonts（Noto Serif SC）

**决策**：通过 `next/font` 引入 Noto Serif SC 用于历史叙述内容。

**背景**：历史叙述需要衬线字体增强沉浸感，中文衬线体选择有限。

**影响**：增加约 200KB 字体加载（通过 next/font 自动优化）。

### DEC-036: Canvas 粒子系统用于 Hero 背景

**决策**：使用 Canvas 2D API 实现数学符号粒子动画。

**背景**：DOM 元素粒子在数量较多时性能不佳，Canvas 可保证 60fps。

**约束**：粒子数量控制在 30-50 个，避免移动端性能问题。

### DEC-037: localStorage 学习进度（无后端）

**决策**：使用 localStorage 存储学习进度，不引入后端/数据库。

**背景**：MVP 阶段不需要用户系统，localStorage 满足个人使用需求。

**数据结构**：
```json
{
  "visitedNodes": ["node-id-1", "node-id-2"],
  "completedExperiments": ["exp-id-1"],
  "challengeScores": { "node-id-1": { "correct": 3, "total": 5 } },
  "theme": "light"
}
```

## 影响范围

### 新增文件（6 个）
- `src/components/layout/HeroSection.tsx`
- `src/components/timeline/EraNavBar.tsx`
- `src/components/content/SectionNav.tsx`
- `src/components/content/NodeHero.tsx`
- `src/hooks/useProgress.ts`
- `src/components/ui/ProgressBar.tsx`

### 修改文件（17 个）
- 设计系统：globals.css, tokens.ts, layout.tsx, Card.tsx, Button.tsx
- 首页：app/page.tsx, NodeCard.tsx
- 时间轴：TimelineCanvas.tsx, TimelineNode.tsx, EraMarker.tsx
- 节点详情：timeline/[nodeId]/page.tsx, NarrativeCard.tsx, ExperimentEntry.tsx, ConceptCard.tsx, ChallengeQuiz.tsx
- 布局：Header.tsx, Footer.tsx

### 不受影响
- 数据结构（types/timeline.ts 不变）
- JSON 内容数据（data/ 目录不变）
- 15 个实验组件（experiments/ 子目录不变）
- 数据加载层（lib/data/ 不变）

## 验收标准

- [ ] `npm run build` 通过
- [ ] `npm run lint` 通过
- [ ] 首页 Hero 动画流畅（≥30fps）
- [ ] 暗色/亮色模式切换正常
- [ ] localStorage 进度持久化工作
- [ ] 移动端布局正常（侧边导航折叠）
- [ ] 所有 12 个节点详情页正常渲染
- [ ] 所有 15 个实验页面正常工作
