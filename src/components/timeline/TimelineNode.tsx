'use client';

import Link from 'next/link';
import type { TimelineNode } from '@/types/timeline';
import { colors } from '@/styles/tokens';

interface TimelineNodeProps {
  node: TimelineNode;
  x: number;
  y: number;
}

export default function TimelineNodeComponent({ node, x, y }: TimelineNodeProps) {
  const eraColor = colors.era[node.era] || '#6b7280';

  return (
    <Link href={`/timeline/${node.id}`}>
      <g className="cursor-pointer">
        {/* 节点圆点 */}
        <circle
          cx={x}
          cy={y}
          r={8}
          fill={eraColor}
          stroke="white"
          strokeWidth="3"
        />

        {/* 连接线 */}
        <line
          x1={x}
          y1={y - 12}
          x2={x}
          y2={y - 40}
          stroke={eraColor}
          strokeWidth="2"
        />

        {/* 标题卡片 */}
        <foreignObject
          x={x - 80}
          y={y - 120}
          width={160}
          height={70}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '8px',
              padding: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: `2px solid ${eraColor}`,
              textAlign: 'center',
              fontSize: '12px',
              lineHeight: '1.3',
            }}
          >
            <div style={{ fontWeight: 600, color: '#1c1917' }}>
              {node.title}
            </div>
            <div style={{ color: '#737373', marginTop: '2px', fontSize: '10px' }}>
              {node.timePeriod.display}
            </div>
          </div>
        </foreignObject>
      </g>
    </Link>
  );
}
