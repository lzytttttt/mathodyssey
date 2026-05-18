'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Experiment } from '@/types/timeline';
import type { Graph, GraphVertex, GraphEdge, TrailStep } from '@/lib/math/graph';
import {
  allVertexDegrees,
  oddDegreeVertices,
  hasEulerPath,
  availableEdges,
  traverseEdge,
  isStuck,
  isTrailComplete,
} from '@/lib/math/graph';
import ExperimentContainer from '../ExperimentContainer';
import GraphCanvas from './GraphCanvas';

// ─── Königsberg bridge graph (hardcoded topology) ───────────────────

const VERTICES: GraphVertex[] = [
  { id: 'A', label: '北岸', x: 300, y: 65 },
  { id: 'B', label: '西岛', x: 130, y: 220 },
  { id: 'C', label: '东岛', x: 470, y: 220 },
  { id: 'D', label: '南岸', x: 300, y: 385 },
];

const EDGES: GraphEdge[] = [
  { id: 'e1', from: 'A', to: 'B', label: '桥①' },
  { id: 'e2', from: 'A', to: 'B', label: '桥②' },
  { id: 'e3', from: 'A', to: 'C', label: '桥③' },
  { id: 'e4', from: 'A', to: 'C', label: '桥④' },
  { id: 'e5', from: 'A', to: 'D', label: '桥⑤' },
  { id: 'e6', from: 'B', to: 'D', label: '桥⑥' },
  { id: 'e7', from: 'C', to: 'D', label: '桥⑦' },
];

const KONIGSBERG_GRAPH: Graph = { vertices: VERTICES, edges: EDGES };

const VERTEX_LABELS: Record<string, string> = { A: '北岸', B: '西岛', C: '东岛', D: '南岸' };

// ─── Component ──────────────────────────────────────────────────────

interface EulerBridgeLabProps {
  experiment: Experiment;
}

export default function EulerBridgeLab({ experiment }: EulerBridgeLabProps) {
  const graph = KONIGSBERG_GRAPH;

  // State
  const [currentVertex, setCurrentVertex] = useState<string | null>(null);
  const [usedEdges, setUsedEdges] = useState<string[]>([]);
  const [trail, setTrail] = useState<TrailStep[]>([]);
  const [showJudgment, setShowJudgment] = useState(false);
  const [hasTried, setHasTried] = useState(false);

  // Derived
  const degrees = useMemo(() => allVertexDegrees(graph), [graph]);
  const oddVerts = useMemo(() => oddDegreeVertices(graph), [graph]);
  const eulerResult = useMemo(() => hasEulerPath(graph), [graph]);

  const available = useMemo(
    () =>
      currentVertex
        ? availableEdges(graph, currentVertex, usedEdges)
        : [],
    [graph, currentVertex, usedEdges]
  );
  const availableIds = useMemo(
    () => available.map((e) => e.id),
    [available]
  );

  const stuck = useMemo(
    () =>
      currentVertex !== null &&
      usedEdges.length > 0 &&
      isStuck(graph, currentVertex, usedEdges),
    [graph, currentVertex, usedEdges]
  );
  const complete = useMemo(
    () => isTrailComplete(graph, usedEdges),
    [graph, usedEdges]
  );

  // Handlers
  const handleVertexClick = useCallback((vertexId: string) => {
    setCurrentVertex(vertexId);
    setHasTried(true);
  }, []);

  const handleEdgeClick = useCallback(
    (edgeId: string) => {
      if (!currentVertex) return;
      if (usedEdges.includes(edgeId)) return;

      try {
        const nextVertex = traverseEdge(graph, currentVertex, edgeId);
        const step: TrailStep = {
          edgeId,
          fromVertex: currentVertex,
          toVertex: nextVertex,
        };
        setUsedEdges((prev) => [...prev, edgeId]);
        setTrail((prev) => [...prev, step]);
        setCurrentVertex(nextVertex);
        setHasTried(true);
      } catch {
        // Edge doesn't touch current vertex — ignore
      }
    },
    [graph, currentVertex, usedEdges]
  );

  const reset = useCallback(() => {
    setCurrentVertex(null);
    setUsedEdges([]);
    setTrail([]);
    setShowJudgment(false);
    setHasTried(false);
  }, []);

  const undo = useCallback(() => {
    if (trail.length === 0) return;
    const lastStep = trail[trail.length - 1];
    setUsedEdges((prev) => prev.slice(0, -1));
    setTrail((prev) => prev.slice(0, -1));
    setCurrentVertex(lastStep.fromVertex);
  }, [trail]);

  // ─── Result panel ───────────────────────────────────────────────

  const resultPanel = showJudgment ? (
    <JudgmentPanel
      degrees={degrees}
      oddVerts={oddVerts}
      eulerResult={eulerResult}
    />
  ) : hasTried ? (
    <ProgressPanel
      usedCount={usedEdges.length}
      totalCount={graph.edges.length}
      stuck={stuck}
      complete={complete}
      onViewJudgment={() => setShowJudgment(true)}
    />
  ) : (
    <IntroPanel />
  );

  // ─── Status bar ─────────────────────────────────────────────────

  const statusBar = (
    <div className="px-6 py-3 bg-stone-50 border-b border-stone-100 flex items-center justify-between text-sm">
      <div className="flex items-center gap-4">
        <span className="text-stone-500">
          当前位置：
          <span className="font-semibold text-stone-800">
            {currentVertex
              ? `${VERTEX_LABELS[currentVertex]} (${currentVertex})`
              : '未选择'}
          </span>
        </span>
        <span className="text-stone-400">|</span>
        <span className="text-stone-500">
          已走：
          <span className="font-semibold text-blue-700">
            {usedEdges.length}
          </span>
          /{graph.edges.length} 桥
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={trail.length === 0}
          className="px-3 py-1.5 text-sm rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          撤销
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 text-sm rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors"
        >
          重置
        </button>
      </div>
    </div>
  );

  // ─── Trail display ──────────────────────────────────────────────

  const trailDisplay =
    trail.length > 0 ? (
      <div className="px-6 py-3 bg-white border-b border-stone-100">
        <p className="text-xs text-stone-500 mb-1">路径</p>
        <p className="text-sm text-stone-700 font-mono leading-relaxed">
          {VERTEX_LABELS[trail[0].fromVertex]}
          {trail.map((step, i) => {
            const edge = graph.edges.find((e) => e.id === step.edgeId);
            return (
              <span key={i}>
                {' '}
                →({edge?.label ?? step.edgeId})→{' '}
                {VERTEX_LABELS[step.toVertex]}
              </span>
            );
          })}
        </p>
      </div>
    ) : null;

  // ─── Stuck alert ────────────────────────────────────────────────

  const stuckAlert =
    stuck && !showJudgment ? (
      <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
        <p className="text-sm font-semibold text-amber-800 mb-1">
          ⚠ 此路不通！
        </p>
        <p className="text-sm text-amber-700">
          你在 {VERTEX_LABELS[currentVertex!]} ({currentVertex})，但这里的{' '}
          {degrees[currentVertex!]} 座桥都已走过。
          你只走了 {usedEdges.length}/{graph.edges.length} 桥，还有{' '}
          {graph.edges.length - usedEdges.length} 座桥没走。
        </p>
        <div className="mt-3">
          <button
            onClick={() => setShowJudgment(true)}
            className="px-4 py-1.5 text-sm rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
          >
            查看欧拉判定
          </button>
        </div>
      </div>
    ) : null;

  return (
    <ExperimentContainer experiment={experiment} resultPanel={resultPanel}>
      {statusBar}
      {stuckAlert}

      {/* SVG Canvas */}
      <div className="p-4">
        <GraphCanvas
          graph={graph}
          usedEdgeIds={usedEdges}
          currentVertexId={currentVertex}
          availableEdgeIds={availableIds}
          oddDegreeVertexIds={showJudgment ? oddVerts : []}
          showDegrees={showJudgment}
          degrees={degrees}
          onEdgeClick={handleEdgeClick}
          onVertexClick={handleVertexClick}
        />
      </div>

      {trailDisplay}

      {/* Instruction */}
      <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 text-center">
        <p className="text-xs text-stone-400">
          {!currentVertex
            ? '点击一个区域选择起点'
            : stuck || complete
              ? '查看判定或重置再试'
              : '点击蓝色高亮的桥前进'}
        </p>
      </div>
    </ExperimentContainer>
  );
}

// ─── Sub-panels ─────────────────────────────────────────────────────

function IntroPanel() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">
          从地图到图
        </h4>
        <p className="text-sm text-blue-700 leading-relaxed">
          1736 年，欧拉面对柯尼斯堡七桥问题时，做了一件前所未有的事：
          他把地图抽象成了<strong>图</strong>。
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-white rounded-lg border border-blue-100">
            <p className="font-medium text-blue-800">4 块陆地</p>
            <p className="text-blue-600">→ 4 个<strong>顶点</strong></p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-blue-100">
            <p className="font-medium text-blue-800">7 座桥</p>
            <p className="text-blue-600">→ 7 条<strong>边</strong></p>
          </div>
        </div>
      </div>
      <p className="text-sm text-stone-500 text-center">
        先在图上尝试走走看，然后再思考为什么。
      </p>
    </div>
  );
}

function ProgressPanel({
  usedCount,
  totalCount,
  stuck,
  complete,
  onViewJudgment,
}: {
  usedCount: number;
  totalCount: number;
  stuck: boolean;
  complete: boolean;
  onViewJudgment: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone-700">进度</span>
          <span className="text-sm font-mono text-stone-600">
            {usedCount}/{totalCount} 桥
          </span>
        </div>
        <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${(usedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>
      {stuck && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700">
            你被卡住了——当前顶点没有可走的桥。
            试试换个起点重来，或者直接查看欧拉的判定。
          </p>
        </div>
      )}
      {complete && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">
            你走完了所有 {totalCount} 座桥！看看欧拉怎么说。
          </p>
        </div>
      )}
      <div className="text-center">
        <button
          onClick={onViewJudgment}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          查看欧拉判定
        </button>
      </div>
    </div>
  );
}

function JudgmentPanel({
  degrees,
  oddVerts,
  eulerResult,
}: {
  degrees: Record<string, number>;
  oddVerts: string[];
  eulerResult: { exists: boolean; oddDegreeCount: number; reason: string };
}) {
  return (
    <div className="space-y-4">
      {/* Degree table */}
      <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
        <h4 className="text-sm font-semibold text-stone-800 mb-3">
          每个区域的度数
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(degrees).map(([id, deg]) => {
            const isOdd = oddVerts.includes(id);
            return (
              <div
                key={id}
                className={`p-3 rounded-lg border text-sm ${
                  isOdd
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-stone-200'
                }`}
              >
                <span className="font-medium text-stone-700">
                  {VERTEX_LABELS[id]} ({id})
                </span>
                <span className="float-right font-mono font-semibold">
                  {deg} 度
                  {isOdd && (
                    <span className="text-red-600 ml-1">← 奇数</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Euler judgment */}
      <div
        className={`p-4 rounded-lg border ${
          eulerResult.exists
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}
      >
        <h4
          className={`text-sm font-semibold mb-2 ${
            eulerResult.exists ? 'text-green-800' : 'text-red-800'
          }`}
        >
          欧拉判定
        </h4>
        <p
          className={`text-sm leading-relaxed ${
            eulerResult.exists ? 'text-green-700' : 'text-red-700'
          }`}
        >
          奇数度顶点：<strong>{eulerResult.oddDegreeCount}</strong> 个
          {eulerResult.exists ? ' ✓' : ' ✗'}
        </p>
        <p
          className={`text-sm mt-1 ${
            eulerResult.exists ? 'text-green-700' : 'text-red-700'
          }`}
        >
          欧拉路径存在条件：奇数度顶点数为 0 或 2。
        </p>
        <p
          className={`text-sm mt-2 font-medium ${
            eulerResult.exists ? 'text-green-800' : 'text-red-800'
          }`}
        >
          结论：{eulerResult.reason}
        </p>
      </div>

      {/* Key insight */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">
          关键洞察
        </h4>
        <p className="text-sm text-blue-700 leading-relaxed">
          这不是路线技巧问题，而是<strong>结构问题</strong>。
          4 个奇数度顶点决定了：无论你怎么走，都不可能一次走完所有桥。
        </p>
        <p className="text-sm text-blue-700 leading-relaxed mt-2">
          欧拉的天才不在于找到走法，而在于他发现：
          把地图抽象成图之后，问题变成了纯粹的结构问题——
          只需要数一数每个顶点有几条边（度数），就能判断是否存在一笔走完的路径。
          这就是<strong>图论</strong>的诞生。
        </p>
      </div>
    </div>
  );
}
