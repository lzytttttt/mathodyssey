import Card from '@/components/ui/Card';
import FormulaDisplay from '@/components/math/FormulaDisplay';
import type { MathConcept } from '@/types/timeline';

interface ConceptCardProps {
  concepts: MathConcept[];
}

export default function ConceptCard({ concepts }: ConceptCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">数学概念</h3>
      <div className="space-y-6">
        {concepts.map((concept, index) => (
          <div key={index} className="border-l-4 border-blue-200 pl-4">
            <h4 className="font-semibold text-stone-800">{concept.name}</h4>
            <p className="text-stone-600 mt-1">{concept.definition}</p>
            {concept.formula && (
              <div className="mt-2 bg-stone-50 rounded-lg p-3 inline-block">
                <FormulaDisplay formula={concept.formula} displayMode />
              </div>
            )}
            {concept.details && (
              <p className="text-sm text-stone-500 mt-2">{concept.details}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
