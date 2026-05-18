'use client';

import { useMemo } from 'react';
import type { Graph, GraphEdge } from '@/lib/math/graph';

interface GraphCanvasProps {
  graph: Graph;
  usedEdgeIds: string[];
  currentVertexId: string | null;
  availableEdgeIds: string[];
  oddDegreeVertexIds?: string[];
  showDegrees?: boolean;
  degrees?: Record<string, number>;
  onEdgeClick: (edgeId: string) => void;
  onVertexClick: (vertexId: string) => void;
  svgW?: number;
  svgH?: number;
}

const SVG_W = 600;
const SVG_H = 440;

// Visual constants
const VERTEX_R = 28;
const EDGE_WIDTH = 4;
const EDGE_HOVER_WIDTH = 6;

// Colors
const COL_DEFAULT_EDGE = '#a8a29e';
const COL_AVAILABLE = '#3b82f6';
const COL_USED = '#22c55e';
const COL_CURRENT_VERTEX = '#3b82f6';
const COL_VERTEX_FILL = '#ffffff';
const COL_VERTEX_STROKE = '#57534e';
const COL_ODD_STROKE = '#ef4444';
const COL_LABEL = '#44403c';

// Edge curve offsets for multi-edges (pixels perpendicular to the straight line)
const MULTI_EDGE_OFFSET = 35;

export default function GraphCanvas({
  graph,
  usedEdgeIds,
  currentVertexId,
  availableEdgeIds,
  oddDegreeVertexIds = [],
  showDegrees = false,
  degrees,
  onEdgeClick,
  onVertexClick,
  svgW = SVG_W,
  svgH = SVG_H,
}: GraphCanvasProps) {
  const usedSet = useMemo(() => new Set(usedEdgeIds), [usedEdgeIds]);
  const availableSet = useMemo(
    () => new Set(availableEdgeIds),
    [availableEdgeIds]
  );
  const oddSet = useMemo(
    () => new Set(oddDegreeVertexIds),
    [oddDegreeVertexIds]
  );

  // Build a lookup for vertex positions
  const vertexMap = useMemo(() => {
    const m = new Map<string, { x: number; y: number; label: string }>();
    for (const v of graph.vertices) {
      m.set(v.id, { x: v.x, y: v.y, label: v.label });
    }
    return m;
  }, [graph.vertices]);

  // Detect multi-edges: group edges by their vertex pair (sorted)
  const multiEdgeGroups = useMemo(() => {
    const groups = new Map<string, GraphEdge[]>();
    for (const e of graph.edges) {
      const key = [e.from, e.to].sort().join('-');
      const arr = groups.get(key) ?? [];
      arr.push(e);
      groups.set(key, arr);
    }
    return groups;
  }, [graph.edges]);

  // For each edge, compute whether it's part of a multi-edge group and its index
  const edgeRenderInfo = useMemo(() => {
    const info = new Map<
      string,
      { isMulti: boolean; index: number; groupSize: number }
    >();
    for (const [, edges] of multiEdgeGroups) {
      const isMulti = edges.length > 1;
      edges.forEach((e, i) => {
        info.set(e.id, { isMulti, index: i, groupSize: edges.length });
      });
    }
    return info;
  }, [multiEdgeGroups]);

  /** Compute SVG path for an edge. */
  function edgePath(edge: GraphEdge): string {
    const vFrom = vertexMap.get(edge.from)!;
    const vTo = vertexMap.get(edge.to)!;
    const info = edgeRenderInfo.get(edge.id)!;

    if (!info.isMulti) {
      // Straight line
      return `M ${vFrom.x} ${vFrom.y} L ${vTo.x} ${vTo.y}`;
    }

    // Multi-edge: use quadratic bezier with offset control point
    const mx = (vFrom.x + vTo.x) / 2;
    const my = (vFrom.y + vTo.y) / 2;

    // Perpendicular direction
    const dx = vTo.x - vFrom.x;
    const dy = vTo.y - vFrom.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;

    // Offset: first edge curves one way, second the other
    const sign = info.index === 0 ? -1 : 1;
    const cx = mx + sign * nx * MULTI_EDGE_OFFSET;
    const cy = my + sign * ny * MULTI_EDGE_OFFSET;

    return `M ${vFrom.x} ${vFrom.y} Q ${cx} ${cy} ${vTo.x} ${vTo.y}`;
  }

  /** Edge midpoint for label placement. */
  function edgeMidpoint(edge: GraphEdge): { x: number; y: number } {
    const vFrom = vertexMap.get(edge.from)!;
    const vTo = vertexMap.get(edge.to)!;
    const info = edgeRenderInfo.get(edge.id)!;

    if (!info.isMulti) {
      return { x: (vFrom.x + vTo.x) / 2, y: (vFrom.y + vTo.y) / 2 };
    }

    const mx = (vFrom.x + vTo.x) / 2;
    const my = (vFrom.y + vTo.y) / 2;
    const dx = vTo.x - vFrom.x;
    const dy = vTo.y - vFrom.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;
    const sign = info.index === 0 ? -1 : 1;

    // Place label at 1/3 along the curve (closer to control point)
    const t = 0.35;
    const qx = (1 - t) * (1 - t) * vFrom.x + 2 * (1 - t) * t * (mx + sign * nx * MULTI_EDGE_OFFSET) + t * t * vTo.x;
    const qy = (1 - t) * (1 - t) * vFrom.y + 2 * (1 - t) * t * (my + sign * ny * MULTI_EDGE_OFFSET) + t * t * vTo.y;

    return { x: qx, y: qy };
  }

  function edgeColor(edge: GraphEdge): string {
    if (usedSet.has(edge.id)) return COL_USED;
    if (availableSet.has(edge.id)) return COL_AVAILABLE;
    return COL_DEFAULT_EDGE;
  }

  function edgeDashArray(edge: GraphEdge): string {
    return usedSet.has(edge.id) ? '8 4' : 'none';
  }

  function isClickable(edge: GraphEdge): boolean {
    return availableSet.has(edge.id);
  }

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      className="w-full h-auto"
      style={{ touchAction: 'none' }}
    >
      {/* Background */}
      <rect width={svgW} height={svgH} fill="#fafaf9" rx={12} />

      {/* River hint */}
      <text
        x={svgW / 2}
        y={22}
        textAnchor="middle"
        fontSize={12}
        fill="#a8a29e"
      >
        普雷格尔河
      </text>

      {/* Edges */}
      {graph.edges.map((edge) => {
        const color = edgeColor(edge);
        const dash = edgeDashArray(edge);
        const clickable = isClickable(edge);
        const mid = edgeMidpoint(edge);

        return (
          <g key={edge.id}>
            {/* Invisible wider hit area for clicking */}
            <path
              d={edgePath(edge)}
              fill="none"
              stroke="transparent"
              strokeWidth={20}
              style={{ cursor: clickable ? 'pointer' : 'default' }}
              onClick={() => clickable && onEdgeClick(edge.id)}
            />
            {/* Visible edge */}
            <path
              d={edgePath(edge)}
              fill="none"
              stroke={color}
              strokeWidth={clickable ? EDGE_HOVER_WIDTH : EDGE_WIDTH}
              strokeDasharray={dash}
              strokeLinecap="round"
              style={{
                transition: 'stroke 0.2s, stroke-width 0.2s',
                pointerEvents: 'none',
              }}
            />
            {/* Edge label */}
            {edge.label && (
              <text
                x={mid.x}
                y={mid.y - 6}
                textAnchor="middle"
                fontSize={11}
                fill={usedSet.has(edge.id) ? COL_USED : '#78716c'}
                fontWeight={500}
                style={{ pointerEvents: 'none' }}
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Vertices */}
      {graph.vertices.map((v) => {
        const isCurrent = v.id === currentVertexId;
        const isOdd = oddSet.has(v.id);
        const isClickableVertex = currentVertexId === null;

        const fill = isCurrent ? COL_CURRENT_VERTEX : COL_VERTEX_FILL;
        const stroke = isOdd && showDegrees ? COL_ODD_STROKE : COL_VERTEX_STROKE;
        const strokeWidth = isOdd && showDegrees ? 4 : 3;

        return (
          <g key={v.id}>
            {/* Hit area */}
            <circle
              cx={v.x}
              cy={v.y}
              r={VERTEX_R + 8}
              fill="transparent"
              style={{
                cursor: isClickableVertex ? 'pointer' : 'default',
              }}
              onClick={() => isClickableVertex && onVertexClick(v.id)}
            />
            {/* Vertex circle */}
            <circle
              cx={v.x}
              cy={v.y}
              r={VERTEX_R}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              style={{
                transition: 'fill 0.2s, stroke 0.2s',
                pointerEvents: 'none',
              }}
            />
            {/* Vertex label */}
            <text
              x={v.x}
              y={v.y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={14}
              fontWeight={600}
              fill={isCurrent ? '#ffffff' : COL_LABEL}
              style={{ pointerEvents: 'none' }}
            >
              {v.label}
            </text>
            {/* Degree label (shown when showDegrees is true) */}
            {showDegrees && degrees && (
              <text
                x={v.x}
                y={v.y + VERTEX_R + 16}
                textAnchor="middle"
                fontSize={13}
                fontWeight={600}
                fill={isOdd ? COL_ODD_STROKE : '#78716c'}
                style={{ pointerEvents: 'none' }}
              >
                {degrees[v.id]}度{isOdd ? ' (奇)' : ''}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
