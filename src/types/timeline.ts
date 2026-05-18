/** 时代枚举 */
export type Era =
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
export type Difficulty = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

/** 概念类别 */
export type ConceptCategory =
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
export type EducationLevel =
  | 'elementary'
  | 'middle-school'
  | 'high-school'
  | 'college-intro';

/** 可信度等级 */
export type Credibility = 'A' | 'B' | 'C' | 'D' | 'E';

/** 实验类型 */
export type ExperimentType =
  | 'geometry-drag'
  | 'parameter-slider'
  | 'number-line'
  | 'simulation'
  | 'graph-exploration'
  | 'coordinate-plotter'
  | 'tangent-tracker'
  | 'proof-builder';

/** 时间范围 */
export interface TimePeriod {
  start: number;
  end: number | null;
  display: string;
}

/** 地理位置 */
export interface Location {
  name: string;
  modernName: string;
  longitude: number;
  latitude: number;
}

/** 关键人物 */
export interface KeyFigure {
  name: string;
  lifespan: string;
  bio: string;
  credibility: Credibility;
}

/** 历史叙述 */
export interface Narrative {
  hook: string;
  context: string;
  problem: string;
  discovery: string;
  credibility: Credibility;
  sources?: string[];
}

/** 数学概念 */
export interface MathConcept {
  name: string;
  definition: string;
  category: ConceptCategory;
  formula?: string;
  illustration?: string;
  educationLevel: EducationLevel;
  details?: string;
}

/** 学习目标 */
export interface LearningObjective {
  description: string;
  level: 'remember' | 'understand' | 'apply' | 'analyze' | 'create';
  experimentId?: string;
}

/** 概念关系 */
export interface ConceptRelation {
  nodeId: string;
  relationType: 'prerequisite' | 'leads-to' | 'related' | 'generalizes' | 'specializes';
  description: string;
}

/** 实验控件 */
export interface ExperimentControl {
  id: string;
  type: 'slider' | 'draggable-point' | 'draggable-shape' | 'button' | 'toggle' | 'input';
  label: string;
  initialValue: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
}

/** 实验约束 */
export interface ExperimentConstraint {
  description: string;
  condition: string;
}

/** 实验交互 */
export interface ExperimentInteraction {
  controls: ExperimentControl[];
  constraints?: ExperimentConstraint[];
}

/** 实验场景 */
export interface ExperimentScene {
  description: string;
  goal: string;
  initialState: Record<string, number | string | boolean>;
}

/** 实验引导 */
export interface ExperimentGuidance {
  hints: string[];
  discoveries: string[];
  completionCriteria: string;
}

/** 互动实验 */
export interface Experiment {
  id: string;
  title: string;
  description: string;
  type: ExperimentType;
  scene: ExperimentScene;
  interaction: ExperimentInteraction;
  guidance: ExperimentGuidance;
  estimatedMinutes: number;
}

/** 挑战问题 */
export interface Challenge {
  id: string;
  question: string;
  type: 'historical-recreation' | 'concept-application' | 'exploration' | 'cross-era';
  options?: string[];
  answer: string;
  explanation: string;
  hints: string[];
  difficulty: Difficulty;
}

/** 参考资料 */
export interface Reference {
  title: string;
  author: string;
  year: number;
  type: 'book' | 'paper' | 'article' | 'website';
  url?: string;
}

/** 视觉素材 */
export interface Visual {
  id: string;
  type: 'illustration' | 'diagram' | 'photo' | 'svg';
  description: string;
  src: string;
  alt: string;
}

/** Timeline Node - 完整的节点数据结构 */
export interface TimelineNode {
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

/** 时代信息 */
export interface EraInfo {
  id: Era;
  name: string;
  startYear: number;
  endYear: number;
}

/** 时间轴状态 */
export interface TimelineState {
  viewportStart: number;
  viewportEnd: number;
  zoomLevel: number;
  selectedNodeId: string | null;
}
