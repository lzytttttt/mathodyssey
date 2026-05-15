'use client';

import { useMemo } from 'react';
import type { Bounds } from '@/lib/math/coordinate';
import { mathToSvg } from '@/lib/math/coordinate';
import type { RiemannRectangle } from '@/lib/math/calculus';

interface AreaUnderCurveProps {
  rectangles: RiemannRectangle[];
  bounds: Bounds;
  svgW: number;
  svgH: number;
  pad: number;
  fillColor?: string;
  strokeColor?: string;
  showSamplePoints?: boolean;
}

const FILL = 'rgba(59, 130, 246, 0.25)';
const STROKE = '#3b82f6';
const SAMPLE_COLOR = '#1d4ed8';

/**
 * Pure display component that renders Riemann rectangles and sample points.
 * No state management, no experiment data, no riemannSum computation.
 * Receives pre-computed rectangle geometries, renders SVG rects.
 */
export default function AreaUnderCurve({
  rectangles,
  bounds,
  svgW,
  svgH,
  pad,
  fillColor = FILL,
  strokeColor = STROKE,
  showSamplePoints = true,
}: AreaUnderCurveProps) {
  // Pre-compute SVG positions for all rectangles
  const svgRects = useMemo(() => {
    return rectangles.map((r) => {
      // Rectangle: left-bottom corner at (r.x, 0), width=r.width, height=|r.sampleY|
      // For positive f(x): rect from (x, 0) to (x+width, f(x))
      // SVG y-axis is flipped, so we need top-left corner
      const topLeft = mathToSvg(
        { x: r.x, y: Math.max(r.sampleY, 0) },
        bounds, svgW, svgH, pad
      );
      const bottomRight = mathToSvg(
        { x: r.x + r.width, y: Math.min(r.sampleY, 0) },
        bounds, svgW, svgH, pad
      );
      const samplePt = mathToSvg(
        { x: r.sampleX, y: r.sampleY },
        bounds, svgW, svgH, pad
      );
      return {
        x: topLeft.x,
        y: topLeft.y,
        width: bottomRight.x - topLeft.x,
        height: bottomRight.y - topLeft.y,
        sampleX: samplePt.x,
        sampleY: samplePt.y,
      };
    });
  }, [rectangles, bounds, svgW, svgH, pad]);

  return (
    <g>
      {/* Riemann rectangles */}
      {svgRects.map((r, i) => (
        <g key={i}>
          <rect
            x={r.x}
            y={r.y}
            width={Math.max(r.width, 0)}
            height={Math.max(r.height, 0)}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={1}
            opacity={0.8}
          />
          {/* Sample point */}
          {showSamplePoints && (
            <circle
              cx={r.sampleX}
              cy={r.sampleY}
              r={3}
              fill={SAMPLE_COLOR}
              stroke="white"
              strokeWidth={1}
            />
          )}
        </g>
      ))}
    </g>
  );
}
