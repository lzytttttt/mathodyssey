import Card from '@/components/ui/Card';
import type { Narrative } from '@/types/timeline';

interface NarrativeCardProps {
  narrative: Narrative;
}

export default function NarrativeCard({ narrative }: NarrativeCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">历史故事</h3>
      <div className="space-y-4 text-stone-700 leading-relaxed">
        <p className="text-lg font-medium text-blue-700 italic">
          {narrative.hook}
        </p>
        <p>{narrative.context}</p>
        <p className="font-medium">{narrative.problem}</p>
        <p>{narrative.discovery}</p>
      </div>
      {narrative.sources && narrative.sources.length > 0 && (
        <div className="mt-4 pt-4 border-t border-stone-200">
          <p className="text-sm text-stone-500">
            参考来源：{narrative.sources.join('、')}
          </p>
        </div>
      )}
    </Card>
  );
}
