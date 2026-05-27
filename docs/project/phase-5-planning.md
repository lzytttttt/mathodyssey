# Phase 5 Planning: 产品化和发布

## 总览

Phase 0~4 完成了核心功能开发（12 节点 + 15 实验 + 挑战题系统）。Phase 5 的目标是将项目从"可运行的原型"提升为"可发布的产品"。

```
5.1 P0：性能 + SEO + 部署（产品上线前提）
5.2 P1：监控 + 用户文档（上线后保障）
5.3 P2：API 文档（开发者接入）
5.4    ：Final Review（封版验收）
```

### 当前基线

| 指标 | Phase 5 前 | Phase 5.1 后 |
|------|-----------|-------------|
| 页面数 | 17 | 20（+sitemap.xml, robots.txt, /api/og） |
| 路由 | `/`(SSG), `/timeline/[nodeId]`(SSG), `/experiments/[experimentId]`(Dynamic), `/about`(SSG) | 同左 + `/api/og`(Edge) + `/sitemap.xml`(SSG) + `/robots.txt`(SSG) |
| 实验数 | 15 个注册实验 | 15（不变） |
| 构建时间 | ~3s TypeScript + ~0.5s 静态生成 | ~2.6s TypeScript + ~0.5s 静态生成 |
| Lighthouse | 未测量 | 待测量（部署后） |
| SEO | 仅 layout.tsx 全局 metadata | 全页面 OG 标签 + JSON-LD + sitemap + robots.txt + canonical URL + OG 图片 |
| 性能优化 | d3 未使用但打包、无 optimizePackageImports | 移除 d3(~500KB)、optimizePackageImports(framer-motion, katex) |
| 部署 | 无 CI/CD、无生产环境 | 待配置 |

---

## 5.1 P0：性能优化 + SEO 优化 + 生产部署

### 5.1.1 性能优化

#### 目标

- Lighthouse Performance > 90
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- Total Blocking Time (TBT) < 200ms

#### 任务清单

| Task ID | 描述 | 复杂度 | 说明 |
|---------|------|--------|------|
| T-05-01-01 | 实验组件懒加载 | 中 | 实验页面使用 `React.lazy` + `Suspense`，首屏不加载实验 JS |
| T-05-01-02 | 动态 import 优化 registry | 中 | registry.ts 已用 dynamic import，检查是否所有 15 个实验都走 code splitting |
| T-05-01-03 | KaTeX 按需加载 | 低 | 仅在需要公式的组件中动态 import katex，不在全局 bundle 中 |
| T-05-01-04 | D3 按需导入 | 低 | `import * as d3` 改为 `import { scaleLinear } from 'd3-scale'` 等按需导入 |
| T-05-01-05 | Framer Motion 按需加载 | 低 | 检查是否有非动画页面误引入 framer-motion |
| T-05-01-06 | next.config.ts 优化配置 | 低 | `output: 'export'` 或 `reactStrictMode`、`poweredByHeader: false`、`compress: true` |
| T-05-01-07 | 字体优化 | 低 | 检查 Google Fonts 加载策略（已用 `display: 'swap'`），考虑 `preload` |
| T-05-01-08 | Bundle 分析 | 低 | 安装 `@next/bundle-analyzer`，分析打包体积，找出大依赖 |
| T-05-01-09 | Lighthouse 基线测量 | 低 | 建立性能基线，记录各指标，作为优化参照 |

#### 技术方案

**实验组件懒加载**：
```tsx
// registry.ts 中已使用 dynamic import，但实验页面的 ExperimentComponent
// 需要确保走 Suspense 边界
const ExperimentComponent = React.lazy(() => import(...));
```

**D3 按需导入**：
```tsx
// 当前：import * as d3 from 'd3'  (全量 ~500KB)
// 优化：import { scaleLinear } from 'd3-scale'  (按需 ~10KB)
```

**Bundle 分析**：
```bash
ANALYZE=true npm run build
```

### 5.1.2 SEO 优化

#### 目标

- 每个页面有独立的 `<title>` 和 `<meta description>`
- Open Graph 标签完整（og:title, og:description, og:image）
- 结构化数据（JSON-LD）覆盖关键页面
- 站点地图（sitemap.xml）自动生成
- robots.txt 正确配置

#### 任务清单

| Task ID | 描述 | 复杂度 | 说明 |
|---------|------|--------|------|
| T-05-01-10 | 页面级 Metadata 完善 | 中 | 每个页面的 `generateMetadata` 返回完整 OG 标签 |
| T-05-01-11 | OG 图片生成 | 中 | 为节点页面动态生成 OG 图片（可用 `next/og` 或静态 fallback） |
| T-05-01-12 | JSON-LD 结构化数据 | 中 | 节点页面添加 `Article` 或 `LearningResource` schema |
| T-05-01-13 | sitemap.xml 自动生成 | 低 | 使用 `app/sitemap.ts` 生成站点地图 |
| T-05-01-14 | robots.txt 配置 | 低 | 使用 `app/robots.ts` 配置爬虫规则 |
| T-05-01-15 | Canonical URL | 低 | 每个页面设置 canonical 链接 |
| T-05-01-16 | 首页 Metadata 增强 | 低 | 补充 keywords、author、其他 SEO 字段 |

#### 技术方案

**页面级 Metadata**：
```tsx
// app/timeline/[nodeId]/page.tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const node = await getNodeById(params.nodeId);
  return {
    title: `${node.title} — MathOdyssey`,
    description: node.narrative.substring(0, 160),
    openGraph: {
      title: node.title,
      description: node.narrative.substring(0, 160),
      type: 'article',
      images: [`/api/og?nodeId=${params.nodeId}`],
    },
  };
}
```

**JSON-LD**：
```tsx
// 在页面组件中
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: node.title,
  description: node.narrative.substring(0, 160),
  educationalLevel: 'K12',
  learningResourceType: 'Interactive Resource',
  teaches: node.concepts.map(c => c.name),
};
```

**站点地图**：
```tsx
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  const nodes = getAllNodesSync();
  return [
    { url: 'https://mathodyssey.com', lastModified: new Date() },
    ...nodes.map(node => ({
      url: `https://mathodyssey.com/timeline/${node.id}`,
      lastModified: new Date(),
    })),
  ];
}
```

### 5.1.3 生产部署

#### 目标

- 自动化部署流程（push → build → deploy）
- 生产环境可访问
- HTTPS 启用
- 自定义域名配置

#### 任务清单

| Task ID | 描述 | 复杂度 | 说明 |
|---------|------|--------|------|
| T-05-01-17 | 部署平台选择与配置 | 中 | Vercel（推荐）或 Cloudflare Pages，配置 build 命令 |
| T-05-01-18 | 环境变量配置 | 低 | 区分 development / production 环境变量 |
| T-05-01-19 | 自定义域名配置 | 低 | DNS 配置、HTTPS 证书 |
| T-05-01-20 | CI/CD 流水线 | 中 | GitHub Actions：lint → build → deploy |
| T-05-01-21 | 生产环境健康检查 | 低 | 验证生产环境可访问、功能正常 |

#### 技术方案

**部署平台**：推荐 Vercel（Next.js 原生支持）
- 零配置部署
- 自动 HTTPS
- 边缘 CDN
- Preview Deployments

**GitHub Actions CI/CD**：
```yaml
# .github/workflows/deploy.yml
name: CI/CD
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  # Vercel 自动部署（通过 GitHub integration）
```

### 5.1 验收标准

- [ ] Lighthouse Performance > 90
- [ ] Lighthouse SEO > 95
- [ ] Lighthouse Best Practices > 90
- [ ] Lighthouse Accessibility > 90
- [ ] 每个页面有完整的 OG 标签
- [ ] sitemap.xml 可访问
- [ ] robots.txt 可访问
- [ ] JSON-LD 结构化数据覆盖首页和节点页
- [ ] 生产环境可访问（HTTPS）
- [ ] CI/CD 流水线可运行
- [ ] `npm run lint` 通过（0 errors）
- [ ] `npm run build` 通过

---

## 5.2 P1：监控系统 + 用户文档

### 5.2.1 监控系统

#### 目标

- 错误追踪可用
- 性能监控可用
- 用户行为基础统计

#### 任务清单

| Task ID | 描述 | 复杂度 | 说明 |
|---------|------|--------|------|
| T-05-02-01 | 错误追踪集成 | 中 | 集成 Sentry 或 Vercel Analytics，捕获前端错误 |
| T-05-02-02 | 性能监控集成 | 中 | Vercel Web Vitals 或自建 RUM，追踪 Core Web Vitals |
| T-05-02-03 | 基础访问统计 | 低 | 页面 PV/UV、节点访问热度、实验使用率 |
| T-05-02-04 | 错误边界组件 | 低 | React ErrorBoundary，防止实验组件崩溃影响全局 |

#### 技术方案

**错误追踪**：推荐 Vercel Analytics（零配置）或 Sentry（更详细）

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**ErrorBoundary**：
```tsx
// components/ui/ErrorBoundary.tsx
'use client';
import { Component, type ReactNode } from 'react';

export class ErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
```

### 5.2.2 用户文档

#### 目标

- 使用指南完整（面向学生和自学者）
- 教师指南完整（面向课堂使用）
- 项目介绍页面完善

#### 任务清单

| Task ID | 描述 | 复杂度 | 说明 |
|---------|------|--------|------|
| T-05-02-05 | 使用指南编写 | 中 | 平台功能介绍、学习路径建议、实验操作说明 |
| T-05-02-06 | 教师指南编写 | 中 | 课堂使用建议、各节点教学目标、讨论问题 |
| T-05-02-07 | About 页面完善 | 低 | 项目愿景、团队介绍、技术栈、开源信息 |
| T-05-02-08 | FAQ 页面 | 低 | 常见问题解答 |

#### 内容规划

**使用指南**：
- 平台是什么？（1 分钟介绍）
- 如何开始探索？（时间轴操作指南）
- 实验怎么玩？（交互操作说明）
- 挑战题怎么做？（答题指南）
- 学习路径建议（按难度/按时代）

**教师指南**：
- 课堂使用场景（引入新课、课后探索、小组活动）
- 各节点对应课标知识点
- 讨论问题和延伸活动
- 技术要求和准备工作

### 5.2 验收标准

- [ ] 错误追踪系统可用（能捕获并报告前端错误）
- [ ] 性能监控可用（能看到 Core Web Vitals 数据）
- [ ] ErrorBoundary 包裹实验组件
- [ ] 使用指南页面可访问
- [ ] 教师指南页面可访问
- [ ] About 页面内容完整
- [ ] `npm run lint` 通过
- [ ] `npm run build` 通过

---

## 5.3 P2：API 文档

### 目标

- 数据接口文档完整
- 开发者可基于文档接入数据

### 任务清单

| Task ID | 描述 | 复杂度 | 说明 |
|---------|------|--------|------|
| T-05-03-01 | 数据结构文档 | 中 | TimelineNode、Experiment、Challenge 等类型文档化 |
| T-05-03-02 | API 接口文档 | 中 | 当前为静态站点，文档化数据加载函数接口 |
| T-05-03-03 | 贡献指南 | 低 | 如何添加新节点、新实验、新挑战题 |

### 内容规划

**数据结构文档**：
- TimelineNode 完整字段说明
- Experiment 配置格式
- Challenge 题目格式
- JSON Schema 验证规则

**贡献指南**：
- 如何添加一个新节点（JSON 模板 + 步骤）
- 如何添加一个新实验（注册表 + 组件模板）
- 如何添加挑战题（validation.ts 规则）
- 提交规范和审核流程

### 验收标准

- [ ] 数据结构文档完整
- [ ] 贡献指南可访问
- [ ] `npm run lint` 通过
- [ ] `npm run build` 通过

---

## 5.4 Final Review

### 验收维度

| 维度 | 检查项 |
|------|--------|
| 性能 | Lighthouse 四项指标全部 > 90 |
| SEO | OG 标签、结构化数据、站点地图完整 |
| 部署 | 生产环境可访问、CI/CD 可运行 |
| 监控 | 错误追踪和性能监控可用 |
| 文档 | 使用指南、教师指南、API 文档完整 |
| 质量 | lint 0 errors、build 通过、无 `any` 类型 |
| 内容 | 12 节点 JSON 完整、15 实验 ID 一致、20 挑战题可交互 |
| 移动端 | 响应式布局正常、触摸交互流畅 |

### 任务清单

| Task ID | 描述 | 复杂度 | 说明 |
|---------|------|--------|------|
| T-05-04-01 | Lighthouse 全面审计 | 低 | 四项指标 + 各页面分别测量 |
| T-05-04-02 | 内容一致性检查 | 低 | 12 节点 JSON 完整性、实验 ID 一致性 |
| T-05-04-03 | 移动端可用性检查 | 低 | 时间轴触摸、实验交互、布局响应式 |
| T-05-04-04 | 生产环境验证 | 低 | 生产 URL 可访问、功能正常 |
| T-05-04-05 | 修复已发现问题 | 中 | 根据审计结果修复 |
| T-05-04-06 | 文档封版 | 低 | 创建 phase-5-final-review.md |
| T-05-04-07 | 版本号更新 | 低 | package.json 更新到 v1.0.0 |

### 验收标准

- [ ] Lighthouse Performance > 90
- [ ] Lighthouse SEO > 95
- [ ] Lighthouse Best Practices > 90
- [ ] Lighthouse Accessibility > 90
- [ ] 生产环境可访问（HTTPS）
- [ ] 错误监控可用
- [ ] 用户文档完整
- [ ] `npm run lint` 通过（0 errors）
- [ ] `npm run build` 通过
- [ ] phase-5-final-review.md 创建

---

## 依赖关系

```
5.1 性能优化 ─────────┐
5.1 SEO 优化  ─────────┼──→ 5.1 生产部署 ──→ 5.4 Final Review
5.1 部署配置  ─────────┘         │
                                 ▼
5.2 监控系统 ────────────────→ 5.4 Final Review
5.2 用户文档 ────────────────→ 5.4 Final Review
5.3 API 文档  ───────────────→ 5.4 Final Review
```

- 性能优化和 SEO 优化可并行
- 生产部署依赖性能和 SEO 完成（部署后才能测量 Lighthouse）
- 监控系统在部署后集成
- 用户文档和 API 文档可并行，与技术工作独立
- Final Review 依赖所有前置任务完成

---

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| Lighthouse 分数不达标 | 阻塞发布 | 先建立基线，逐步优化，必要时降级视觉效果 |
| 第三方库体积过大 | 加载慢 | Bundle 分析找出大依赖，按需加载或替换 |
| OG 图片生成复杂 | SEO 不完整 | 先用静态 fallback 图片，后续迭代 |
| 部署平台限制 | 功能受限 | Vercel 免费版够用，备选 Cloudflare Pages |
| 监控服务成本 | 运营成本 | 使用免费层（Vercel Analytics / Sentry free tier） |

---

## 不做什么

| 暂缓内容 | 原因 | 推迟到 |
|----------|------|--------|
| PWA / 离线访问 | 优先级低，增加维护成本 | 后续迭代 |
| 国际化 (i18n) | 内容仅中文，优先做好单语言 | 后续迭代 |
| A/B 测试框架 | 无用户数据，过早优化 | 用户量增长后 |
| 自动化测试 | 纯函数无单元测试 | 后续迭代 |
| 数据库迁移 | JSON 文件足够 | 用户量增长后 |
| 用户账户系统 | MVP 无需个性化 | 后续迭代 |

---

## 附录：Phase 5.1 实施顺序建议

```
第一批（并行）：
  T-05-01-08  Bundle 分析（建立基线）
  T-05-01-09  Lighthouse 基线测量
  T-05-01-14  robots.txt 配置
  T-05-01-13  sitemap.xml 自动生成

第二批（性能优化，并行）：
  T-05-01-04  D3 按需导入
  T-05-01-05  Framer Motion 按需加载
  T-05-01-03  KaTeX 按需加载
  T-05-01-06  next.config.ts 优化配置
  T-05-01-07  字体优化

第三批（SEO，并行）：
  T-05-01-10  页面级 Metadata 完善
  T-05-01-15  Canonical URL
  T-05-01-16  首页 Metadata 增强
  T-05-01-12  JSON-LD 结构化数据
  T-05-01-11  OG 图片生成

第四批（部署）：
  T-05-01-17  部署平台配置
  T-05-01-18  环境变量配置
  T-05-01-19  自定义域名配置
  T-05-01-20  CI/CD 流水线
  T-05-01-21  生产环境健康检查
```
