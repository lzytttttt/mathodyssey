'use client';

import type { TimelineNode } from '@/types/timeline';
import TimelineNodeComponent from './TimelineNode';
import EraMarker from './EraMarker';
import { eras } from '@/lib/data/eras';
import { useTimelinePanZoom } from '@/hooks/useTimelinePanZoom';

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

  return (
    <div className="relative w-full">
      {/* Zoom/pan hint */}
      <div className="absolute top-4 right-4 z-10 text-xs text-stone-400">
        滚轮/双指缩放 · 拖拽平移
      </div>

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

          {/* Timeline axis line */}
          <line
            x1="0"
            y1={NODE_Y}
            x2={containerWidth}
            y2={NODE_Y}
            stroke="#d4d4d4"
            strokeWidth="2"
          />

          {/* Year tick marks */}
          {Array.from(
            { length: Math.ceil((viewEnd - viewStart) / 500) + 1 },
            (_, i) => {
              const year = Math.ceil(viewStart / 500) * 500 + i * 500;
              if (year < viewStart || year > viewEnd) return null;
              const x = yearToX(year);
              return (
                <g key={year}>
                  <line
                    x1={x}
                    y1={NODE_Y - 10}
                    x2={x}
                    y2={NODE_Y + 10}
                    stroke="#a3a3a3"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={NODE_Y + 30}
                    textAnchor="middle"
                    fill="#737373"
                    fontSize="12"
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
