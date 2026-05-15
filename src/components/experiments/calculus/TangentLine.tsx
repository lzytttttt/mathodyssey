'use client';

import { useMemo } from 'react';
import type { Bounds } from '@/lib/math/coordinate';
import { mathToSvg, lineEquationFromTwoPoints } from '@/lib/math/coordinate';

interface TangentLineProps {
  point: { x: number; y: number };
  slope: number;
  bounds: Bounds;
  svgW: number;
  svgH: number;
  pad: number;
  lineColor?: string;
  pointColor?: string;
  showPoint?: boolean;
  showLabel?: boolean;
}

const DEFAULT_RED = '#ef4444';

/**
 * Pure display component that renders a tangent line at a point on a curve.
 * No state management, no experiment data, no derivative computation.
 * Receives point + slope, computes visible segment within bounds, renders SVG.
 */
export default function TangentLine({
  point,
  slope,
  bounds,
  svgW,
  svgH,
  pad,
  lineColor = DEFAULT_RED,
  pointColor = DEFAULT_RED,
  showPoint = true,
  showLabel = true,
}: TangentLineProps) {
  // Tangent line: y = slope * (t - point.x) + point.y
  // = slope * t + (point.y - slope * point.x)
  const intercept = point.y - slope * point.x;

  // --- Clipped line segment within bounds ---
  const lineSegment = useMemo(() => {
    // Use a point far to the left and right on the tangent line
    const p1 = { x: bounds.xMin - 100, y: slope * (bounds.xMin - 100) + intercept };
    const p2 = { x: bounds.xMax + 100, y: slope * (bounds.xMax + 100) + intercept };
    const lineEq = lineEquationFromTwoPoints(p1, p2);

    if (lineEq.kind === 'indeterminate') return null;

    if (lineEq.kind === 'vertical') {
      const top = mathToSvg({ x: lineEq.x, y: bounds.yMax }, bounds, svgW, svgH, pad);
      const bottom = mathToSvg({ x: lineEq.x, y: bounds.yMin }, bounds, svgW, svgH, pad);
      return { x1: top.x, y1: top.y, x2: bottom.x, y2: bottom.y };
    }

    const m = lineEq.slope;
    const b = lineEq.intercept;
    const candidates: { x: number; y: number }[] = [];

    // Intersections with x bounds
    const yAtMinX = m * bounds.xMin + b;
    const yAtMaxX = m * bounds.xMax + b;
    if (yAtMinX >= bounds.yMin && yAtMinX <= bounds.yMax) {
      candidates.push({ x: bounds.xMin, y: yAtMinX });
    }
    if (yAtMaxX >= bounds.yMin && yAtMaxX <= bounds.yMax) {
      candidates.push({ x: bounds.xMax, y: yAtMaxX });
    }

    // Intersections with y bounds
    if (m !== 0) {
      const xAtMinY = (bounds.yMin - b) / m;
      const xAtMaxY = (bounds.yMax - b) / m;
      if (xAtMinY >= bounds.xMin && xAtMinY <= bounds.xMax) {
        candidates.push({ x: xAtMinY, y: bounds.yMin });
      }
      if (xAtMaxY >= bounds.xMin && xAtMaxY <= bounds.xMax) {
        candidates.push({ x: xAtMaxY, y: bounds.yMax });
      }
    }

    // Deduplicate
    const unique = candidates.filter((c, i, arr) =>
      arr.findIndex((d) => Math.abs(d.x - c.x) < 0.01 && Math.abs(d.y - c.y) < 0.01) === i
    );

    if (unique.length < 2) return null;

    unique.sort((a, b) => a.x - b.x);
    const svg1 = mathToSvg(unique[0], bounds, svgW, svgH, pad);
    const svg2 = mathToSvg(unique[unique.length - 1], bounds, svgW, svgH, pad);
    return { x1: svg1.x, y1: svg1.y, x2: svg2.x, y2: svg2.y };
  }, [slope, intercept, bounds, svgW, svgH, pad]);

  // --- SVG position of the tangent point ---
  const svgPoint = useMemo(
    () => mathToSvg(point, bounds, svgW, svgH, pad),
    [point, bounds, svgW, svgH, pad]
  );

  return (
    <g>
      {/* Tangent line */}
      {lineSegment && (
        <line
          x1={lineSegment.x1}
          y1={lineSegment.y1}
          x2={lineSegment.x2}
          y2={lineSegment.y2}
          stroke={lineColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.85}
        />
      )}

      {/* Tangent point */}
      {showPoint && (
        <>
          <circle
            cx={svgPoint.x}
            cy={svgPoint.y}
            r={5}
            fill={pointColor}
            stroke="white"
            strokeWidth={2}
          />
          {showLabel && (
            <text
              x={svgPoint.x + 10}
              y={svgPoint.y + 16}
              textAnchor="start"
              fontSize={11}
              fontWeight={600}
              fill={pointColor}
            >
              切线
            </text>
          )}
        </>
      )}
    </g>
  );
}
