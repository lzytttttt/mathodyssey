/**
 * Graph theory pure functions for Euler Bridge Explorer and future graph experiments.
 * No React / DOM / SVG dependencies.
 */

// ─── Types ──────────────────────────────────────────────────────────

/** Graph vertex */
export interface GraphVertex {
  id: string;
  label: string;
  x: number;
  y: number;
}

/** Graph edge (supports multi-edges between same vertex pair) */
export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

/** Graph */
export interface Graph {
  vertices: GraphVertex[];
  edges: GraphEdge[];
}

/** One step in a trail (path that doesn't repeat edges) */
export interface TrailStep {
  edgeId: string;
  fromVertex: string;
  toVertex: string;
}

/** Euler path existence check result */
export interface EulerPathResult {
  exists: boolean;
  oddDegreeCount: number;
  oddDegreeVertices: string[];
  reason: string;
}

/** Trail validation result */
export interface TrailValidation {
  valid: boolean;
  usedEdgeCount: number;
  totalEdgeCount: number;
  isComplete: boolean;
  isStuck: boolean;
  reason?: string;
}

// ─── Degree functions ───────────────────────────────────────────────

/** Degree of a single vertex (counts each edge touching the vertex). */
export function vertexDegree(graph: Graph, vertexId: string): number {
  return graph.edges.filter(
    (e) => e.from === vertexId || e.to === vertexId
  ).length;
}

/** Degree map for every vertex. */
export function allVertexDegrees(graph: Graph): Record<string, number> {
  const degrees: Record<string, number> = {};
  for (const v of graph.vertices) {
    degrees[v.id] = 0;
  }
  for (const e of graph.edges) {
    degrees[e.from] = (degrees[e.from] ?? 0) + 1;
    degrees[e.to] = (degrees[e.to] ?? 0) + 1;
  }
  return degrees;
}

/** IDs of vertices whose degree is odd. */
export function oddDegreeVertices(graph: Graph): string[] {
  const degrees = allVertexDegrees(graph);
  return Object.keys(degrees).filter((id) => degrees[id] % 2 !== 0);
}

// ─── Euler path / circuit existence ─────────────────────────────────

/**
 * Check whether the graph has an Euler path.
 * Condition: odd-degree vertex count is 0 or 2.
 */
export function hasEulerPath(graph: Graph): EulerPathResult {
  const odd = oddDegreeVertices(graph);
  const count = odd.length;

  if (count === 0) {
    return {
      exists: true,
      oddDegreeCount: 0,
      oddDegreeVertices: odd,
      reason: '所有顶点度数为偶数，存在欧拉回路（也是欧拉路径）。',
    };
  }
  if (count === 2) {
    return {
      exists: true,
      oddDegreeCount: 2,
      oddDegreeVertices: odd,
      reason: `恰好 2 个奇数度顶点（${odd.join('、')}），存在欧拉路径，但必须从其中一个出发。`,
    };
  }
  return {
    exists: false,
    oddDegreeCount: count,
    oddDegreeVertices: odd,
    reason: `有 ${count} 个奇数度顶点（${odd.join('、')}），不满足欧拉路径条件（需要 0 或 2 个）。`,
  };
}

/**
 * Check whether the graph has an Euler circuit.
 * Condition: all vertex degrees are even and graph is connected.
 * (Connectivity check is omitted — assumed for Königsberg-style graphs.)
 */
export function hasEulerCircuit(graph: Graph): {
  exists: boolean;
  reason: string;
} {
  const odd = oddDegreeVertices(graph);
  if (odd.length === 0) {
    return {
      exists: true,
      reason: '所有顶点度数为偶数，存在欧拉回路。',
    };
  }
  return {
    exists: false,
    reason: `有 ${odd.length} 个奇数度顶点，不满足欧拉回路条件（需要 0 个）。`,
  };
}

// ─── Edge queries ───────────────────────────────────────────────────

/** All edges touching the given vertex. */
export function adjacentEdges(graph: Graph, vertexId: string): GraphEdge[] {
  return graph.edges.filter(
    (e) => e.from === vertexId || e.to === vertexId
  );
}

/**
 * Edges adjacent to vertexId that are NOT in usedEdgeIds.
 * These are the edges the user can currently choose.
 */
export function availableEdges(
  graph: Graph,
  vertexId: string,
  usedEdgeIds: string[]
): GraphEdge[] {
  const usedSet = new Set(usedEdgeIds);
  return adjacentEdges(graph, vertexId).filter((e) => !usedSet.has(e.id));
}

// ─── Trail operations ───────────────────────────────────────────────

/**
 * Given the current vertex and an edge to traverse, return the vertex
 * on the other end. Throws if the edge doesn't touch currentVertex.
 */
export function traverseEdge(
  graph: Graph,
  currentVertexId: string,
  edgeId: string
): string {
  const edge = graph.edges.find((e) => e.id === edgeId);
  if (!edge) {
    throw new Error(`Edge ${edgeId} not found in graph.`);
  }
  if (edge.from === currentVertexId) return edge.to;
  if (edge.to === currentVertexId) return edge.from;
  throw new Error(
    `Edge ${edgeId} (${edge.from}-${edge.to}) does not touch vertex ${currentVertexId}.`
  );
}

/** Whether every edge in the graph has been used. */
export function isTrailComplete(
  graph: Graph,
  usedEdgeIds: string[]
): boolean {
  return usedEdgeIds.length === graph.edges.length;
}

/** Whether the current vertex has no unused edges. */
export function isStuck(
  graph: Graph,
  currentVertexId: string,
  usedEdgeIds: string[]
): boolean {
  return availableEdges(graph, currentVertexId, usedEdgeIds).length === 0;
}

/**
 * Validate a trail (sequence of edge IDs).
 * Returns whether the trail is legal, how many edges are used,
 * whether it's complete, and whether the final vertex is stuck.
 */
export function validateTrail(
  graph: Graph,
  edgeSequence: string[]
): TrailValidation {
  const totalEdgeCount = graph.edges.length;
  const usedEdgeCount = edgeSequence.length;

  // Check for duplicate edges
  const seen = new Set<string>();
  for (const eid of edgeSequence) {
    if (seen.has(eid)) {
      return {
        valid: false,
        usedEdgeCount,
        totalEdgeCount,
        isComplete: false,
        isStuck: false,
        reason: `边 ${eid} 被重复使用。`,
      };
    }
    seen.add(eid);
  }

  // Check edge continuity: each edge must touch the endpoint of the previous one
  let currentVertex: string | null = null;
  for (const eid of edgeSequence) {
    const edge = graph.edges.find((e) => e.id === eid);
    if (!edge) {
      return {
        valid: false,
        usedEdgeCount,
        totalEdgeCount,
        isComplete: false,
        isStuck: false,
        reason: `边 ${eid} 不存在。`,
      };
    }
    if (currentVertex === null) {
      // First edge — we don't know the start vertex, so accept either end
      currentVertex = edge.from;
    }
    if (edge.from === currentVertex) {
      currentVertex = edge.to;
    } else if (edge.to === currentVertex) {
      currentVertex = edge.from;
    } else {
      return {
        valid: false,
        usedEdgeCount,
        totalEdgeCount,
        isComplete: false,
        isStuck: false,
        reason: `边 ${eid} 不与当前位置 ${currentVertex} 相连。`,
      };
    }
  }

  const isComplete = usedEdgeCount === totalEdgeCount;
  const isStuckAtEnd =
    currentVertex !== null &&
    availableEdges(graph, currentVertex, edgeSequence).length === 0;

  return {
    valid: true,
    usedEdgeCount,
    totalEdgeCount,
    isComplete,
    isStuck: isStuckAtEnd,
  };
}
