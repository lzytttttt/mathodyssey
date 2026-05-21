import Card from '@/components/ui/Card';
import FormulaDisplay from '@/components/math/FormulaDisplay';
import type { MathConcept } from '@/types/timeline';
import { colors } from '@/styles/tokens';

interface ConceptCardProps {
  concepts: MathConcept[];
  era?: string;
}

export default function ConceptCard({ concepts, era }: ConceptCardProps) {
  const eraColor = era ? colors.era[era] || '#6366f1' : '#6366f1';

  return (
    <Card variant="glass" era={era} className="p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">📐 数学概念</h3>
      <div className="space-y-5">
        {concepts.map((concept, index) => (
          <div
            key={index}
            className="border-l-3 pl-4 py-1"
            style={{ borderColor: `${eraColor}60` }}
          >
            <h4 className="font-semibold text-[var(--text-primary)]">{concept.name}</h4>
            <p className="text-[var(--text-secondary)] mt-1">{concept.definition}</p>
            {concept.formula && (
              <div className="mt-2 bg-[var(--bg-secondary)] rounded-lg p-3 inline-block">
                <FormulaDisplay formula={concept.formula} displayMode />
              </div>
            )}
            {concept.details && (
              <p className="text-sm text-[var(--text-muted)] mt-2">{concept.details}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
