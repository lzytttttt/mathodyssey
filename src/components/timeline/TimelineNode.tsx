'use client';

import Link from 'next/link';
import type { TimelineNode } from '@/types/timeline';
import { colors, gradients } from '@/styles/tokens';

interface TimelineNodeProps {
  node: TimelineNode;
  x: number;
  y: number;
}

export default function TimelineNodeComponent({ node, x, y }: TimelineNodeProps) {
  const eraColor = colors.era[node.era] || '#6b7280';
  const eraGradient = gradients[node.era] || [eraColor, eraColor];

  return (
    <Link href={`/timeline/${node.id}`}>
      <g className="cursor-pointer">
        {/* Pulse ring animation */}
        <circle
          cx={x}
          cy={y}
          r={14}
          fill="none"
          stroke={eraColor}
          strokeWidth="1"
          opacity="0.2"
        >
          <animate
            attributeName="r"
            values="10;18;10"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0;0.3"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Node dot with gradient */}
        <defs>
          <radialGradient id={`node-grad-${node.id}`}>
            <stop offset="0%" stopColor={eraGradient[0]} />
            <stop offset="100%" stopColor={eraGradient[1]} />
          </radialGradient>
        </defs>
        <circle
          cx={x}
          cy={y}
          r={8}
          fill={`url(#node-grad-${node.id})`}
          stroke="var(--bg-primary, white)"
          strokeWidth="3"
        />

        {/* Connection line - dashed gradient */}
        <line
          x1={x}
          y1={y - 12}
          x2={x}
          y2={y - 40}
          stroke={eraColor}
          strokeWidth="1.5"
          strokeDasharray="3 2"
          opacity="0.6"
        />

        {/* Title card - glass style */}
        <foreignObject
          x={x - 85}
          y={y - 120}
          width={170}
          height={72}
        >
          <div
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              background: 'var(--glass-bg, rgba(255,255,255,0.85))',
              borderRadius: '10px',
              padding: '8px 10px',
              boxShadow: '0 4px 12px var(--shadow-color, rgba(0,0,0,0.08))',
              border: `1.5px solid ${eraColor}40`,
              textAlign: 'center',
              fontSize: '12px',
              lineHeight: '1.35',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-primary, #1c1917)' }}>
              {node.title}
            </div>
            <div style={{ color: 'var(--text-muted, #737373)', marginTop: '3px', fontSize: '10px' }}>
              {node.timePeriod.display}
            </div>
          </div>
        </foreignObject>
      </g>
    </Link>
  );
}
