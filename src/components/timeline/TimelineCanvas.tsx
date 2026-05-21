'use client';

import type { TimelineNode } from '@/types/timeline';
import TimelineNodeComponent from './TimelineNode';
import EraMarker from './EraMarker';
import { eras } from '@/lib/data/eras';
import { useTimelinePanZoom } from '@/hooks/useTimelinePanZoom';
import { colors } from '@/styles/tokens';

interface TimelineCanvasProps {
  nodes: TimelineNode[];
}

const NODE_Y = 200;

export default function TimelineCanvas({ nodes }: TimelineCanvasProps) {
  const {
    viewStart,
    viewEnd,
    containerWidth,
    yearToX,
    containerRef,
    containerProps,
  } = useTimelinePanZoom();

  // Generate visible era markers
  const visibleEras = eras.filter(
    (era) => era.endYear >= viewStart && era.startYear <= viewEnd
  );

  // Smart tick interval based on zoom level
  const yearSpan = viewEnd - viewStart;
  const tickInterval = yearSpan > 2000 ? 500 : yearSpan > 800 ? 200 : 100;

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)]">
      {/* Timeline container */}
      <div ref={containerRef} {...containerProps}>
        <svg width="100%" height="100%">
          {/* Era backgrounds */}
          {visibleEras.map((era) => {
            const x1 = yearToX(Math.max(era.startYear, viewStart));
            const x2 = yearToX(Math.min(era.endYear, viewEnd));
            return (
              <EraMarker
                key={era.id}
                era={era}
                x={x1}
                width={x2 - x1}
              />
            );
          })}

          {/* Timeline gradient axis line */}
          <defs>
            <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {visibleEras.map((era) => {
                const startPct = ((yearToX(Math.max(era.startYear, viewStart))) / containerWidth) * 100;
                const endPct = ((yearToX(Math.min(era.endYear, viewEnd))) / containerWidth) * 100;
                const eraColor = colors.era[era.id] || '#a3a3a3';
                return [
                  <stop key={`${era.id}-start`} offset={`${startPct}%`} stopColor={eraColor} stopOpacity="0.6" />,
                  <stop key={`${era.id}-end`} offset={`${endPct}%`} stopColor={eraColor} stopOpacity="0.6" />,
                ];
              }).flat()}
            </linearGradient>
          </defs>
          <line
            x1="0"
            y1={NODE_Y}
            x2={containerWidth}
            y2={NODE_Y}
            stroke="url(#timeline-gradient)"
            strokeWidth="2"
          />
          {/* Fallback solid line under gradient */}
          <line
            x1="0"
            y1={NODE_Y}
            x2={containerWidth}
            y2={NODE_Y}
            stroke="var(--border-color, #d4d4d4)"
            strokeWidth="1"
            opacity="0.3"
          />

          {/* Year tick marks */}
          {Array.from(
            { length: Math.ceil((viewEnd - viewStart) / tickInterval) + 1 },
            (_, i) => {
              const year = Math.ceil(viewStart / tickInterval) * tickInterval + i * tickInterval;
              if (year < viewStart || year > viewEnd) return null;
              const x = yearToX(year);
              return (
                <g key={year}>
                  <line
                    x1={x}
                    y1={NODE_Y - 8}
                    x2={x}
                    y2={NODE_Y + 8}
                    stroke="var(--text-muted, #a3a3a3)"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  <text
                    x={x}
                    y={NODE_Y + 28}
                    textAnchor="middle"
                    fill="var(--text-muted, #737373)"
                    fontSize="11"
                    fontFamily="var(--font-sans, Inter)"
                  >
                    {year < 0 ? `前${-year}年` : `${year}年`}
                  </text>
                </g>
              );
            }
          )}

          {/* Nodes */}
          {nodes.map((node) => {
            const x = yearToX(node.timePeriod.start);
            if (x < -50 || x > containerWidth + 50) return null;
            return (
              <TimelineNodeComponent
                key={node.id}
                node={node}
                x={x}
                y={NODE_Y}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
