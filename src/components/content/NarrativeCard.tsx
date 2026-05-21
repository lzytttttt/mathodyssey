import Card from '@/components/ui/Card';
import type { Narrative } from '@/types/timeline';

interface NarrativeCardProps {
  narrative: Narrative;
  era?: string;
}

export default function NarrativeCard({ narrative, era }: NarrativeCardProps) {
  return (
    <Card variant="glass" era={era} className="p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">📜 历史故事</h3>
      <div className="space-y-4 leading-relaxed" style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}>
        {/* Hook - large italic quote */}
        <blockquote className="text-lg font-medium text-[var(--accent-primary)] italic border-l-3 border-[var(--accent-primary)] pl-4 py-1">
          {narrative.hook}
        </blockquote>
        <p className="text-[var(--text-secondary)]">{narrative.context}</p>
        <p className="font-medium text-[var(--text-primary)]">{narrative.problem}</p>
        <p className="text-[var(--text-secondary)]">{narrative.discovery}</p>
      </div>
      {narrative.sources && narrative.sources.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--border-light)]">
          <p className="text-sm text-[var(--text-muted)]">
            参考来源：{narrative.sources.join('、')}
          </p>
        </div>
      )}
    </Card>
  );
}
