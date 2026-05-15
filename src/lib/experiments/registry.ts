import type { ComponentType } from 'react';
import type { Experiment } from '@/types/timeline';

export interface ExperimentComponentProps {
  experiment: Experiment;
  nodeTitle?: string;
}

type ExperimentComponentLoader = () => Promise<{
  default: ComponentType<ExperimentComponentProps>;
}>;

/**
 * Static registry mapping experiment IDs to their component loaders.
 * Each entry is a dynamic import — the component is only loaded when needed.
 *
 * To add a new experiment:
 * 1. Create the component in src/components/experiments/{type}/
 * 2. Add an entry here mapping its experimentId to the dynamic import
 */
const registry: Record<string, ExperimentComponentLoader> = {
  'egypt-land-measurement-lab': () =>
    import('@/components/experiments/geometry/MeasurementLab').then(
      (m) => ({ default: m.default })
    ),
  'pythagoras-area-proof': () =>
    import('@/components/experiments/geometry/PythagorasProof').then(
      (m) => ({ default: m.default })
    ),
  'babylon-base60-converter': () =>
    import('@/components/experiments/number-system/BabylonianBaseLab').then(
      (m) => ({ default: m.default })
    ),
  'pascal-dice-simulation': () =>
    import('@/components/experiments/probability/PascalDiceLab').then(
      (m) => ({ default: m.default })
    ),
  'archimedes-polygon-approximation': () =>
    import('@/components/experiments/geometry/ArchimedesPolygonLab').then(
      (m) => ({ default: m.default })
    ),
  'china-chicken-rabbit-lab': () =>
    import('@/components/experiments/algebra/ChickenRabbitLab').then(
      (m) => ({ default: m.default })
    ),
  'al-khwarizmi-area-completion': () =>
    import('@/components/experiments/algebra/CompletingSquareLab').then(
      (m) => ({ default: m.default })
    ),
  'brahmagupta-number-line': () =>
    import('@/components/experiments/number-line/NegativeNumberLineLab').then(
      (m) => ({ default: m.default })
    ),
  'descartes-coordinate-explorer': () =>
    import('@/components/experiments/coordinate/CartesianExplorerLab').then(
      (m) => ({ default: m.default })
    ),
};

/**
 * Check if a component is registered for the given experiment ID.
 */
export function hasExperimentComponent(experimentId: string): boolean {
  return experimentId in registry;
}

/**
 * Load the component for the given experiment ID.
 * Returns null if no component is registered.
 */
export async function loadExperimentComponent(
  experimentId: string
): Promise<ComponentType<ExperimentComponentProps> | null> {
  const loader = registry[experimentId];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

/**
 * List all registered experiment IDs.
 */
export function getRegisteredExperimentIds(): string[] {
  return Object.keys(registry);
}
