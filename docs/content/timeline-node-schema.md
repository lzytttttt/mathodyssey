# Timeline Node 数据结构

## 字段说明

### 核心字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 唯一标识符，使用 kebab-case，如 `pythagoras-theorem` |
| title | string | 是 | 节点标题，简洁有力，如"毕达哥拉斯与和谐的几何" |
| subtitle | string | 否 | 副标题，补充说明 |
| era | Era | 是 | 所属时代枚举 |
| timePeriod | TimePeriod | 是 | 时间范围 |
| location | Location | 否 | 地理位置 |
| historicalProblem | string | 是 | 历史问题，一句话描述，用于引导学习 |
| narrative | Narrative | 是 | 历史叙述 |
| keyFigures | KeyFigure[] | 否 | 关键人物 |
| mathConcepts | MathConcept[] | 是 | 数学概念列表 |
| learningObjectives | LearningObjective[] | 是 | 学习目标列表 |
| difficulty | Difficulty | 是 | 难度等级 |
| prerequisites | string[] | 否 | 前置知识节点 ID |
| experiments | Experiment[] | 是 | 互动实验列表 |
| challenges | Challenge[] | 否 | 挑战问题 |
| modernConnections | string[] | 是 | 现代应用连接 |
| relatedConcepts | ConceptRelation[] | 否 | 概念关系 |
| references | Reference[] | 否 | 参考资料 |
| visuals | Visual[] | 否 | 视觉素材 |
| tags | string[] | 否 | 知识点标签 |

## TypeScript 类型定义

### 基础枚举

```typescript
/** 时代枚举 */
type Era =
  | 'ancient-egypt'
  | 'ancient-babylon'
  | 'ancient-greece'
  | 'ancient-china'
  | 'ancient-india'
  | 'islamic-golden-age'
  | 'medieval-europe'
  | 'renaissance'
  | 'early-modern'
  | '18th-century'
  | '19th-century'
  | 'modern';

/** 难度等级 */
type Difficulty = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

/** 概念类别 */
type ConceptCategory =
  | 'geometry'
  | 'algebra'
  | 'number-theory'
  | 'calculus'
  | 'probability'
  | 'statistics'
  | 'trigonometry'
  | 'analysis'
  | 'topology'
  | 'logic'
  | 'combinatorics'
  | 'graph-theory'
  | 'linear-algebra';

/** 学习阶段 */
type EducationLevel =
  | 'elementary'
  | 'middle-school'
  | 'high-school'
  | 'college-intro';

/** 可信度等级 */
type Credibility = 'A' | 'B' | 'C' | 'D' | 'E';

/** 实验类型 */
type ExperimentType =
  | 'geometry-drag'       // 几何拖拽（丈量土地、毕达哥拉斯面积）
  | 'parameter-slider'    // 参数滑块（进制转换、鸡兔同笼、阿基米德逼近）
  | 'number-line'         // 数轴操作（零与负数）
  | 'simulation'          // 模拟器（掷骰子、概率实验）
  | 'graph-exploration'   // 路径探索（七桥问题）
  | 'coordinate-plotter'  // 坐标绘图（笛卡尔坐标系、方程图像）
  | 'tangent-tracker'     // 切线追踪（微积分切线、极限可视化）
  | 'proof-builder';      // 公理证明（欧几里得公理构建器）
```

### 核心接口

```typescript
/** 时间范围 */
interface TimePeriod {
  /** 起始年份，负数表示公元前 */
  start: number;
  /** 结束年份，负数表示公元前，null 表示不明确 */
  end: number | null;
  /** 展示用文本，如"约公元前 530 年" */
  display: string;
}

/** 地理位置 */
interface Location {
  /** 地名 */
  name: string;
  /** 现代地名 */
  modernName: string;
  /** 经度 */
  longitude: number;
  /** 纬度 */
  latitude: number;
}

/** 关键人物 */
interface KeyFigure {
  /** 人名 */
  name: string;
  /** 生卒年份描述 */
  lifespan: string;
  /** 人物简介 */
  bio: string;
  /** 可信度 */
  credibility: Credibility;
}

/** 历史叙述 */
interface Narrative {
  /** 引入段落（1-2 句，吸引注意力） */
  hook: string;
  /** 背景描述（历史情境） */
  context: string;
  /** 问题描述（需要解决的问题） */
  problem: string;
  /** 发现过程（如何解决） */
  discovery: string;
  /** 可信度标注 */
  credibility: Credibility;
  /** 参考来源 */
  sources?: string[];
}

/** 数学概念 */
interface MathConcept {
  /** 概念名称 */
  name: string;
  /** 概念定义 */
  definition: string;
  /** 概念类别 */
  category: ConceptCategory;
  /** 公式（LaTeX 格式） */
  formula?: string;
  /** 图示说明 */
  illustration?: string;
  /** 对应学习阶段 */
  educationLevel: EducationLevel;
  /** 详细说明 */
  details?: string;
}

/** 学习目标 */
interface LearningObjective {
  /** 目标描述 */
  description: string;
  /** 认知层次 */
  level: 'remember' | 'understand' | 'apply' | 'analyze' | 'create';
  /** 对应实验 ID（如有） */
  experimentId?: string;
}

/** 概念关系 */
interface ConceptRelation {
  /** 相关节点 ID */
  nodeId: string;
  /** 关系类型 */
  relationType: 'prerequisite' | 'leads-to' | 'related' | 'generalizes' | 'specializes';
  /** 关系说明 */
  description: string;
}
```

### 实验接口

```typescript
/** 互动实验 */
interface Experiment {
  /** 实验 ID */
  id: string;
  /** 实验名称 */
  title: string;
  /** 实验描述 */
  description: string;
  /** 实验类型 */
  type: ExperimentType;
  /** 场景配置 */
  scene: ExperimentScene;
  /** 交互配置 */
  interaction: ExperimentInteraction;
  /** 引导配置 */
  guidance: ExperimentGuidance;
  /** 预估耗时（分钟） */
  estimatedMinutes: number;
}

/** 实验场景 */
interface ExperimentScene {
  /** 场景描述 */
  description: string;
  /** 探索目标 */
  goal: string;
  /** 初始状态配置 */
  initialState: Record<string, number | string | boolean>;
}

/** 实验交互 */
interface ExperimentInteraction {
  /** 可操作的控件 */
  controls: ExperimentControl[];
  /** 操作约束 */
  constraints?: ExperimentConstraint[];
}

/** 实验控件 */
interface ExperimentControl {
  /** 控件 ID */
  id: string;
  /** 控件类型 */
  type: 'slider' | 'draggable-point' | 'draggable-shape' | 'button' | 'toggle' | 'input';
  /** 控件标签 */
  label: string;
  /** 初始值 */
  initialValue: number | string | boolean;
  /** 取值范围（滑块） */
  min?: number;
  max?: number;
  step?: number;
}

/** 实验约束 */
interface ExperimentConstraint {
  /** 约束描述 */
  description: string;
  /** 约束条件（表达式） */
  condition: string;
}

/** 实验引导 */
interface ExperimentGuidance {
  /** 引导性提示 */
  hints: string[];
  /** 可发现的规律 */
  discoveries: string[];
  /** 完成标准 */
  completionCriteria: string;
}
```

### 挑战问题接口

```typescript
/** 挑战问题 */
interface Challenge {
  /** 问题 ID */
  id: string;
  /** 问题描述 */
  question: string;
  /** 问题类型 */
  type: 'historical-recreation' | 'concept-application' | 'exploration' | 'cross-era';
  /** 选项（选择题） */
  options?: string[];
  /** 正确答案 */
  answer: string;
  /** 答案解析 */
  explanation: string;
  /** 提示列表 */
  hints: string[];
  /** 难度等级 */
  difficulty: Difficulty;
}
```

### 辅助接口

```typescript
/** 参考资料 */
interface Reference {
  /** 标题 */
  title: string;
  /** 作者 */
  author: string;
  /** 年份 */
  year: number;
  /** 类型 */
  type: 'book' | 'paper' | 'article' | 'website';
  /** 链接（如有） */
  url?: string;
}

/** 视觉素材 */
interface Visual {
  /** 素材 ID */
  id: string;
  /** 素材类型 */
  type: 'illustration' | 'diagram' | 'photo' | 'svg';
  /** 描述 */
  description: string;
  /** 文件路径或 URL */
  src: string;
  /** 替代文本 */
  alt: string;
}

/** Timeline Node - 完整的节点数据结构 */
interface TimelineNode {
  id: string;
  title: string;
  subtitle?: string;
  era: Era;
  timePeriod: TimePeriod;
  location?: Location;
  historicalProblem: string;
  narrative: Narrative;
  keyFigures?: KeyFigure[];
  mathConcepts: MathConcept[];
  learningObjectives: LearningObjective[];
  difficulty: Difficulty;
  prerequisites?: string[];
  experiments: Experiment[];
  challenges?: Challenge[];
  modernConnections: string[];
  relatedConcepts?: ConceptRelation[];
  references?: Reference[];
  visuals?: Visual[];
  tags?: string[];
}
```

## JSON 示例

```json
{
  "id": "pythagoras-theorem",
  "title": "毕达哥拉斯与和谐的几何",
  "subtitle": "从琴弦和谐到直角三角形",
  "era": "ancient-greece",
  "timePeriod": {
    "start": -530,
    "end": -495,
    "display": "约公元前 530 年"
  },
  "location": {
    "name": "克罗托内",
    "modernName": "Crotone, 意大利",
    "longitude": 17.1267,
    "latitude": 39.0851
  },
  "historicalProblem": "琴弦长度的整数比产生和谐音，这与直角三角形有什么数学关系？",
  "narrative": {
    "hook": "当毕达哥拉斯路过铁匠铺时，锤子敲击发出的和谐音引起了他的注意。",
    "context": "公元前 6 世纪，毕达哥拉斯在意大利南部建立了学派，他们相信"万物皆数"——宇宙的和谐可以用数学关系来解释。",
    "problem": "学派成员发现，琴弦长度成简单整数比（如 2:1、3:2）时，发出的声音是和谐的。这背后是否有更深的数学规律？",
    "discovery": "在探索数与形的关系过程中，他们发现了直角三角形三边的面积关系：两直角边上的正方形面积之和等于斜边上的正方形面积。",
    "credibility": "B",
    "sources": ["Proclus, Commentary on Euclid's Elements", "Heath, A History of Greek Mathematics"]
  },
  "keyFigures": [
    {
      "name": "毕达哥拉斯",
      "lifespan": "约公元前 570 - 495 年",
      "bio": "古希腊数学家、哲学家，毕达哥拉斯学派创始人。提出了"万物皆数"的哲学思想。",
      "credibility": "B"
    }
  ],
  "mathConcepts": [
    {
      "name": "勾股定理",
      "definition": "直角三角形中，两直角边的平方和等于斜边的平方。",
      "category": "geometry",
      "formula": "a^2 + b^2 = c^2",
      "educationLevel": "middle-school",
      "details": "这是几何学中最基本的定理之一，有超过 400 种不同的证明方法。"
    },
    {
      "name": "比例关系",
      "definition": "两个量之间的比值保持不变的关系。",
      "category": "algebra",
      "formula": "\\frac{a}{b} = \\frac{c}{d}",
      "educationLevel": "middle-school"
    }
  ],
  "learningObjectives": [
    {
      "description": "能陈述勾股定理的数学表达",
      "level": "remember"
    },
    {
      "description": "能用面积法直观解释为什么 a² + b² = c²",
      "level": "understand",
      "experimentId": "pythagoras-area-proof"
    },
    {
      "description": "能在给定直角三角形中计算未知边长",
      "level": "apply"
    },
    {
      "description": "能用勾股定理解决实际距离问题",
      "level": "apply"
    }
  ],
  "difficulty": "L3",
  "prerequisites": ["egypt-land-measurement"],
  "experiments": [
    {
      "id": "pythagoras-area-proof",
      "title": "面积拼图验证",
      "description": "在直角三角形的三边上拖拽正方形，验证面积关系",
      "type": "geometry-drag",
      "scene": {
        "description": "一个直角三角形，三边上各有一个正方形",
        "goal": "通过拖拽验证 a² + b² = c²",
        "initialState": { "a": 3, "b": 4, "c": 5 }
      },
      "interaction": {
        "controls": [
          {
            "id": "point-a",
            "type": "draggable-point",
            "label": "拖拽改变直角边长度",
            "initialValue": 3,
            "min": 1,
            "max": 10
          }
        ]
      },
      "guidance": {
        "hints": [
          "观察三边正方形的面积",
          "试着计算每个正方形的面积",
          "两小正方形面积之和与大正方形面积有什么关系？"
        ],
        "discoveries": [
          "直角边上的两个正方形面积之和等于斜边上的正方形面积",
          "无论三角形大小如何变化，这个关系始终成立"
        ],
        "completionCriteria": "用户发现并陈述 a² + b² = c² 的关系"
      },
      "estimatedMinutes": 10
    }
  ],
  "challenges": [
    {
      "id": "pythagoras-challenge-1",
      "question": "一个直角三角形的两条直角边分别为 5 和 12，斜边长是多少？",
      "type": "concept-application",
      "answer": "13",
      "explanation": "根据勾股定理：c = √(5² + 12²) = √(25 + 144) = √169 = 13",
      "hints": ["使用公式 a² + b² = c²", "先计算 a² + b²", "再开平方根"],
      "difficulty": "L2"
    },
    {
      "id": "pythagoras-challenge-2",
      "question": "一把 5 米长的梯子底部离墙 3 米，梯子顶部能到多高？",
      "type": "concept-application",
      "answer": "4 米",
      "explanation": "梯子、墙壁、地面构成直角三角形。梯子是斜边(5)，底部距离是一条直角边(3)。h = √(5² - 3²) = √(25-9) = √16 = 4",
      "hints": ["画一个图", "梯子是斜边", "已知斜边和一条直角边，求另一条直角边"],
      "difficulty": "L3"
    },
    {
      "id": "pythagoras-challenge-3",
      "question": "如果 a² + b² = c²，三角形一定是直角三角形吗？",
      "type": "cross-era",
      "answer": "是的，这是勾股定理的逆定理",
      "explanation": "勾股定理的逆定理也是成立的：如果三角形三边满足 a² + b² = c²，则该三角形是直角三角形。",
      "hints": ["思考勾股定理的逆命题", "逆命题是否也成立？"],
      "difficulty": "L4"
    }
  ],
  "modernConnections": [
    "两点间距离公式",
    "向量长度计算",
    "建筑和工程中的直角测量",
    "GPS 定位中的距离计算"
  ],
  "relatedConcepts": [
    {
      "nodeId": "egypt-land-measurement",
      "relationType": "prerequisite",
      "description": "古埃及的面积计算是几何学的起点"
    },
    {
      "nodeId": "euclid-axioms",
      "relationType": "leads-to",
      "description": "欧几里得将勾股定理纳入公理化体系"
    },
    {
      "nodeId": "descartes-coordinates",
      "relationType": "generalizes",
      "description": "坐标系中两点距离公式是勾股定理的推广"
    }
  ],
  "references": [
    {
      "title": "A History of Greek Mathematics",
      "author": "Thomas Heath",
      "year": 1921,
      "type": "book"
    }
  ],
  "tags": ["几何", "勾股定理", "直角三角形", "面积", "古希腊", "毕达哥拉斯"]
}
```

## 内容编写规范

### 标题规范
- 使用简洁有力的标题，不超过 20 个字
- 标题应包含人物或地点，增加历史感
- 避免纯技术性标题（如"勾股定理"），使用叙事性标题（如"毕达哥拉斯与和谐的几何"）

### 叙述规范
- **hook**：1-2 句话，引人入胜，设置悬念或场景
- **context**：2-3 句话，介绍历史背景和时代特征
- **problem**：1-2 句话，明确需要解决的问题
- **discovery**：2-3 句话，描述发现过程和关键洞见
- 总字数控制在 200-400 字
- 使用口语化、故事化的语言，避免学术腔

### 概念规范
- 每个概念有清晰的名称、定义和公式
- 公式使用 LaTeX 格式
- 说明概念在现代课程中的对应位置

## 难度标记规范

| 等级 | 标签 | 面向用户 | 适用学段 |
|------|------|----------|----------|
| L1 | 入门 | "轻松入门" | 小学 |
| L2 | 基础 | "打好基础" | 小学高年级 ~ 初中 |
| L3 | 中等 | "循序渐进" | 初中 ~ 高中 |
| L4 | 进阶 | "深入探索" | 高中 ~ 高等数学入门 |
| L5 | 挑战 | "思维挑战" | 高等数学入门 |

## 时代标记规范

| 时代 ID | 中文名称 | 时间范围 |
|---------|----------|----------|
| ancient-egypt | 古埃及 | 约前 3000 - 前 332 |
| ancient-babylon | 古巴比伦 | 约前 2000 - 前 539 |
| ancient-greece | 古希腊 | 约前 600 - 前 300 |
| ancient-china | 古中国 | 约前 100 - 公元 500 |
| ancient-india | 古印度 | 约前 500 - 公元 1200 |
| islamic-golden-age | 伊斯兰黄金时代 | 约 750 - 1258 |
| medieval-europe | 中世纪欧洲 | 约 500 - 1400 |
| renaissance | 文艺复兴 | 约 1400 - 1600 |
| early-modern | 近代早期 | 约 1600 - 1700 |
| 18th-century | 18 世纪 | 1700 - 1800 |
| 19th-century | 19 世纪 | 1800 - 1900 |
| modern | 现代 | 1900 - 至今 |

## 知识点标签规范

### 标签分类

| 类别 | 示例标签 |
|------|----------|
| 数学分支 | 几何、代数、数论、微积分、概率、统计、三角、拓扑 |
| 概念类型 | 公理、定理、公式、方法、思想、工具 |
| 应用领域 | 测量、天文、建筑、音乐、物理、金融 |
| 思维方法 | 证明、归纳、演绎、类比、穷举、逼近 |
| 历史文化 | 古埃及、古希腊、古中国、古印度、伊斯兰、欧洲 |

### 标签使用规则
- 每个节点 3-8 个标签
- 至少包含 1 个数学分支标签
- 至少包含 1 个历史文化标签
- 标签应有助于搜索和筛选

## 互动实验绑定规范

### 绑定规则

1. **每个节点至少绑定 1 个实验**
2. **实验 ID 必须在节点的 experiments 数组中声明**
3. **学习目标中的 experimentId 必须引用有效的实验 ID**
4. **实验组件通过 experimentId 加载对应配置**

### 实验 ID 命名规范

格式：`{node-id}-{experiment-type}`

示例：
- `pythagoras-area-proof`（毕达哥拉斯 - 面积证明）
- `archimedes-polygon-approximation`（阿基米德 - 多边形逼近）
- `pascal-dice-simulation`（帕斯卡 - 掷骰子模拟）

### 实验与内容的关系

```
TimelineNode
├── experiments: Experiment[]     ← 实验配置数据
│   └── id: string               ← 实验唯一标识
├── learningObjectives: [...]
│   └── experimentId: string     ← 引用实验 ID
└── 页面渲染时
    └── <ExperimentComponent id={experiment.id} />  ← 加载实验组件
```

实验组件是独立的 React 组件，通过 `experimentId` 加载对应的配置数据。实验组件不包含历史叙述内容，只负责交互逻辑和可视化。
