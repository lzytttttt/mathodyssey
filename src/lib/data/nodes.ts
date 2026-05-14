import type { TimelineNode, Era } from '@/types/timeline';

// Node data imports - will be populated as JSON files are created
const nodeModules: Record<string, () => Promise<{ default: TimelineNode }>> = {
  'egypt-land-measurement': () => import('../../../data/nodes/ancient-egypt/egypt-land-measurement.json').then(m => ({ default: m.default as unknown as TimelineNode })),
  'babylon-base60': () => import('../../../data/nodes/ancient-babylon/babylon-base60.json').then(m => ({ default: m.default as unknown as TimelineNode })),
  'pythagoras-theorem': () => import('../../../data/nodes/ancient-greece/pythagoras-theorem.json').then(m => ({ default: m.default as unknown as TimelineNode })),
  'euclid-axioms': () => import('../../../data/nodes/ancient-greece/euclid-axioms.json').then(m => ({ default: m.default as unknown as TimelineNode })),
  'archimedes-area': () => import('../../../data/nodes/ancient-greece/archimedes-area.json').then(m => ({ default: m.default as unknown as TimelineNode })),
  'china-chicken-rabbit': () => import('../../../data/nodes/ancient-china/china-chicken-rabbit.json').then(m => ({ default: m.default as unknown as TimelineNode })),
  'brahmagupta-zero': () => import('../../../data/nodes/ancient-india/brahmagupta-zero.json').then(m => ({ default: m.default as unknown as TimelineNode })),
  'al-khwarizmi-algebra': () => import('../../../data/nodes/islamic-golden-age/al-khwarizmi-algebra.json').then(m => ({ default: m.default as unknown as TimelineNode })),
  'descartes-coordinates': () => import('../../../data/nodes/early-modern/descartes-coordinates.json').then(m => ({ default: m.default as unknown as TimelineNode })),
  'newton-leibniz-calculus': () => import('../../../data/nodes/early-modern/newton-leibniz-calculus.json').then(m => ({ default: m.default as unknown as TimelineNode })),
  'pascal-fermat-probability': () => import('../../../data/nodes/early-modern/pascal-fermat-probability.json').then(m => ({ default: m.default as unknown as TimelineNode })),
  'euler-graph-theory': () => import('../../../data/nodes/18th-century/euler-graph-theory.json').then(m => ({ default: m.default as unknown as TimelineNode })),
};

/** 获取所有节点 */
export async function getAllNodes(): Promise<TimelineNode[]> {
  const nodes: TimelineNode[] = [];
  for (const loader of Object.values(nodeModules)) {
    const mod = await loader();
    nodes.push(mod.default);
  }
  return nodes.sort((a, b) => a.timePeriod.start - b.timePeriod.start);
}

/** 根据 ID 获取节点 */
export async function getNodeById(id: string): Promise<TimelineNode | null> {
  const loader = nodeModules[id];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

/** 根据时代获取节点 */
export async function getNodesByEra(era: Era): Promise<TimelineNode[]> {
  const allNodes = await getAllNodes();
  return allNodes.filter(node => node.era === era);
}

/** 获取所有节点 ID */
export function getAllNodeIds(): string[] {
  return Object.keys(nodeModules);
}
