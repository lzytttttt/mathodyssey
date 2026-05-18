/**
 * Proof construction pure functions for Euclid Axiom Builder and future proof experiments.
 * No React / DOM / SVG dependencies.
 */

// ─── Types ──────────────────────────────────────────────────────────

/** Category of a proof item — distinguishes postulates from common notions */
export type ProofItemCategory =
  | 'postulate'
  | 'common-notion'
  | 'definition'
  | 'construction'
  | 'conclusion';

/** A single item in a proof (axiom, definition, construction step, or conclusion) */
export interface ProofItem {
  id: string;
  name: string;
  statement: string;
  category: ProofItemCategory;
  requires: string[];
  euclidRef?: string;
}

/** A step the user has taken */
export interface ProofStep {
  itemId: string;
  order: number;
}

/** The complete proof state */
export interface ProofState {
  selectedItems: string[];
  goalId: string;
}

/** Result of attempting to select an item */
export interface ProofValidationResult {
  valid: boolean;
  reason?: string;
  missingPrereqs?: string[];
}

// ─── Euclid Proposition I.1 database ────────────────────────────────

export const EUCLID_I1_ITEMS: ProofItem[] = [
  // ── Postulates (permitted geometric constructions) ──
  {
    id: 'post-1',
    name: '公设 1',
    statement: '从任意一点到任意一点可以画一条直线',
    category: 'postulate',
    requires: [],
    euclidRef: 'Postulate 1',
  },
  {
    id: 'post-2',
    name: '公设 2',
    statement: '有限直线可以继续延长',
    category: 'postulate',
    requires: [],
    euclidRef: 'Postulate 2',
  },
  {
    id: 'post-3',
    name: '公设 3',
    statement: '以任意点为圆心、任意距离为半径可以画圆',
    category: 'postulate',
    requires: [],
    euclidRef: 'Postulate 3',
  },
  {
    id: 'post-4',
    name: '公设 4',
    statement: '所有直角都相等',
    category: 'postulate',
    requires: [],
    euclidRef: 'Postulate 4',
  },
  {
    id: 'post-5',
    name: '公设 5',
    statement: '平行公设',
    category: 'postulate',
    requires: [],
    euclidRef: 'Postulate 5',
  },
  // ── Common Notions (permitted equality reasoning rules) ──
  {
    id: 'cnc-1',
    name: '公理 1',
    statement: '等于同量的量彼此相等',
    category: 'common-notion',
    requires: [],
    euclidRef: 'Common Notion 1',
  },
  {
    id: 'cnc-2',
    name: '公理 2',
    statement: '等量加等量，其和仍相等',
    category: 'common-notion',
    requires: [],
    euclidRef: 'Common Notion 2',
  },
  {
    id: 'cnc-3',
    name: '公理 3',
    statement: '等量减等量，其差仍相等',
    category: 'common-notion',
    requires: [],
    euclidRef: 'Common Notion 3',
  },
  // ── Definition ──
  {
    id: 'def-eq-tri',
    name: '等边三角形',
    statement: '三条边都相等的三角形是等边三角形',
    category: 'definition',
    requires: [],
    euclidRef: 'Definition 20',
  },
  // ── Construction steps ──
  {
    id: 'step-draw-circle-a',
    name: '画圆 A',
    statement: '以 A 为圆心、AB 为半径画圆',
    category: 'construction',
    requires: ['post-3'],
    euclidRef: 'Prop. I.1, Step 1',
  },
  {
    id: 'step-draw-circle-b',
    name: '画圆 B',
    statement: '以 B 为圆心、BA 为半径画圆',
    category: 'construction',
    requires: ['post-3'],
    euclidRef: 'Prop. I.1, Step 2',
  },
  {
    id: 'step-join-ac',
    name: '连接 AC',
    statement: '连接 A 和交点 C 画线段 AC',
    category: 'construction',
    requires: ['post-1', 'step-draw-circle-a', 'step-draw-circle-b'],
    euclidRef: 'Prop. I.1, Step 3',
  },
  {
    id: 'step-join-bc',
    name: '连接 BC',
    statement: '连接 B 和交点 C 画线段 BC',
    category: 'construction',
    requires: ['post-1', 'step-draw-circle-a', 'step-draw-circle-b'],
    euclidRef: 'Prop. I.1, Step 4',
  },
  // ── Conclusion ──
  {
    id: 'conclusion',
    name: '△ABC 是等边三角形',
    statement:
      'AC = AB（圆 A 半径），BC = BA（圆 B 半径），AB = BA，根据公理 1 得 AC = AB = BC，由等边三角形定义得 △ABC 是等边三角形',
    category: 'conclusion',
    requires: ['def-eq-tri', 'cnc-1', 'step-join-ac', 'step-join-bc'],
    euclidRef: 'Prop. I.1, Q.E.D.',
  },
];

// ─── Pure functions ─────────────────────────────────────────────────

/** Get all proof items for a given goal. Currently only supports Euclid I.1. */
export function getProofItems(goalId: string): ProofItem[] {
  if (goalId === 'conclusion') return EUCLID_I1_ITEMS;
  return EUCLID_I1_ITEMS;
}

/** Get a single item by ID. */
export function getItemById(
  itemId: string,
  items: ProofItem[]
): ProofItem | undefined {
  return items.find((i) => i.id === itemId);
}

/** Check if a specific item can be selected given current state. */
export function canSelectItem(
  state: ProofState,
  itemId: string,
  items: ProofItem[]
): ProofValidationResult {
  if (state.selectedItems.includes(itemId)) {
    return { valid: false, reason: '已选择' };
  }

  const item = items.find((i) => i.id === itemId);
  if (!item) {
    return { valid: false, reason: `未知项目：${itemId}` };
  }

  const missing = item.requires.filter(
    (reqId) => !state.selectedItems.includes(reqId)
  );

  if (missing.length > 0) {
    const missingNames = missing
      .map((id) => items.find((i) => i.id === id)?.name ?? id)
      .join('、');
    return {
      valid: false,
      reason: `需要先选择：${missingNames}`,
      missingPrereqs: missing,
    };
  }

  return { valid: true };
}

/** Get all items currently available for selection. */
export function getAvailableItems(
  state: ProofState,
  items: ProofItem[]
): ProofItem[] {
  return items.filter(
    (item) => canSelectItem(state, item.id, items).valid
  );
}

/** Check if the proof is complete (conclusion selected). */
export function isProofComplete(
  state: ProofState,
  items: ProofItem[]
): boolean {
  const conclusion = items.find((i) => i.category === 'conclusion');
  if (!conclusion) return false;
  return state.selectedItems.includes(conclusion.id);
}

/** Build the ordered proof chain from selected items. */
export function buildProofChain(
  state: ProofState,
  items: ProofItem[]
): ProofItem[] {
  return state.selectedItems
    .map((id) => items.find((i) => i.id === id))
    .filter((item): item is ProofItem => item !== undefined);
}

/** Get items not yet selected. */
export function getRemainingItems(
  state: ProofState,
  items: ProofItem[]
): ProofItem[] {
  return items.filter((i) => !state.selectedItems.includes(i.id));
}

/** Get direct prerequisite IDs for an item. */
export function getDirectPrereqs(
  itemId: string,
  items: ProofItem[]
): string[] {
  const item = items.find((i) => i.id === itemId);
  return item?.requires ?? [];
}

/** Count how many selected items were actually needed for the proof. */
export function countNecessaryItems(
  state: ProofState,
  items: ProofItem[]
): { total: number; necessary: number; extra: number } {
  const total = state.selectedItems.length;

  // BFS from conclusion to find all transitively required items
  const conclusion = items.find((i) => i.category === 'conclusion');
  if (!conclusion || !state.selectedItems.includes(conclusion.id)) {
    return { total, necessary: 0, extra: total };
  }

  const necessary = new Set<string>();
  const queue = [conclusion.id];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (necessary.has(current)) continue;
    necessary.add(current);

    const item = items.find((i) => i.id === current);
    if (item) {
      for (const req of item.requires) {
        if (state.selectedItems.includes(req)) {
          queue.push(req);
        }
      }
    }
  }

  return { total, necessary: necessary.size, extra: total - necessary.size };
}
