'use client';

import { useMemo } from 'react';
import type { Bounds } from '@/lib/math/coordinate';
import { mathToSvg, lineEquationFromTwoPoints } from '@/lib/math/coordinate';

interface SecantLineProps {
  pointA: { x: number; y: number };
  pointB: { x: number; y: number };
  bounds: Bounds;
  svgW: number;
  svgH: number;
  pad: number;
  lineColor?: string;
  pointAColor?: string;
  pointBColor?: string;
  showDeltaTriangle?: boolean;
  showLabels?: boolean;
}

const STONE = '#78716c';

/**
 * Pure display component that renders a secant line through two curve points.
 * No state management, no experiment data.
 * Renders: secant line (clipped to bounds) + two points + delta triangle.
 *
 * Designed for reuse: Phase 3.3 Tangent Tracker can pass the same point
 * as both pointA/pointB to degenerate, or use a subset of this rendering.
 */
export default function SecantLine({
  pointA,
  pointB,
  bounds,
  svgW,
  svgH,
  pad,
  lineColor = '#a8a29e',
  pointAColor = '#3b82f6',
  pointBColor = '#f59e0b',
  showDeltaTriangle = true,
  showLabels = true,
}: SecantLineProps) {
  const isCoincident =
    pointA.x === pointB.x && pointA.y === pointB.y;

  // --- SVG positions ---
  const svgA = useMemo(
    () => mathToSvg(pointA, bounds, svgW, svgH, pad),
    [pointA, bounds, svgW, svgH, pad]
  );
  const svgB = useMemo(
    () => mathToSvg(pointB, bounds, svgW, svgH, pad),
    [pointB, bounds, svgW, svgH, pad]
  );

  // Delta corner: (B.x, A.y) in math space
  const deltaCorner = useMemo(
    () => mathToSvg({ x: pointB.x, y: pointA.y }, bounds, svgW, svgH, pad),
    [pointA.y, pointB.x, bounds, svgW, svgH, pad]
  );

  // --- Secant line clipped to bounds ---
  const lineSegment = useMemo(() => {
    if (isCoincident) return null;

    const lineEq = lineEquationFromTwoPoints(pointA, pointB);

    if (lineEq.kind === 'vertical') {
      const top = mathToSvg({ x: lineEq.x, y: bounds.yMax }, bounds, svgW, svgH, pad);
      const bottom = mathToSvg({ x: lineEq.x, y: bounds.yMin }, bounds, svgW, svgH, pad);
      return { x1: top.x, y1: top.y, x2: bottom.x, y2: bottom.y };
    }

    if (lineEq.kind === 'normal') {
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
      const p1 = mathToSvg(unique[0], bounds, svgW, svgH, pad);
      const p2 = mathToSvg(unique[unique.length - 1], bounds, svgW, svgH, pad);
      return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    }

    return null;
  }, [pointA, pointB, isCoincident, bounds, svgW, svgH, pad]);

  // --- Angle marker size ---
  const ANGLE_SIZE = 8;

  // --- Delta values ---
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  const hasHorizontalDelta = showDeltaTriangle && !isCoincident && dx !== 0;
  const hasVerticalDelta = showDeltaTriangle && !isCoincident && dy !== 0;
  const hasAngleMarker = showDeltaTriangle && !isCoincident && dx !== 0 && dy !== 0;

  return (
    <g>
      {/* Secant line */}
      {lineSegment && (
        <line
          x1={lineSegment.x1}
          y1={lineSegment.y1}
          x2={lineSegment.x2}
          y2={lineSegment.y2}
          stroke={lineColor}
          strokeWidth={2}
          strokeLinecap="round"
        />
      )}

      {/* Delta triangle: horizontal leg (Δx) */}
      {hasHorizontalDelta && (
        <>
          <line
            x1={svgA.x}
            y1={svgA.y}
            x2={deltaCorner.x}
            y2={deltaCorner.y}
            stroke={pointAColor}
            strokeWidth={1.5}
            strokeDasharray="5 3"
            opacity={0.7}
          />
          {showLabels && (
            <text
              x={(svgA.x + deltaCorner.x) / 2}
              y={svgA.y - 8}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill={pointAColor}
            >
              Δx={fmtNum(dx)}
            </text>
          )}
        </>
      )}

      {/* Delta triangle: vertical leg (Δy) */}
      {hasVerticalDelta && (
        <>
          <line
            x1={deltaCorner.x}
            y1={deltaCorner.y}
            x2={svgB.x}
            y2={svgB.y}
            stroke={pointBColor}
            strokeWidth={1.5}
            strokeDasharray="5 3"
            opacity={0.7}
          />
          {showLabels && (
            <text
              x={svgB.x + 14}
              y={(deltaCorner.y + svgB.y) / 2 + 4}
              textAnchor="start"
              fontSize={11}
              fontWeight={600}
              fill={pointBColor}
            >
              Δy={fmtNum(dy)}
            </text>
          )}
        </>
      )}

      {/* Right angle marker at delta corner */}
      {hasAngleMarker && (
        <path
          d={`M ${deltaCorner.x + (dx > 0 ? -ANGLE_SIZE : ANGLE_SIZE)} ${deltaCorner.y}
              L ${deltaCorner.x + (dx > 0 ? -ANGLE_SIZE : ANGLE_SIZE)} ${deltaCorner.y + (dy > 0 ? ANGLE_SIZE : -ANGLE_SIZE)}
              L ${deltaCorner.x} ${deltaCorner.y + (dy > 0 ? ANGLE_SIZE : -ANGLE_SIZE)}`}
          fill="none"
          stroke={STONE}
          strokeWidth={1}
        />
      )}

      {/* Point A */}
      <circle
        cx={svgA.x}
        cy={svgA.y}
        r={6}
        fill={pointAColor}
        stroke="white"
        strokeWidth={2}
      />
      {showLabels && (
        <text
          x={svgA.x - 10}
          y={svgA.y - 12}
          textAnchor="end"
          fontSize={12}
          fontWeight={600}
          fill={pointAColor}
        >
          A({fmtNum(pointA.x)}, {fmtNum(pointA.y)})
        </text>
      )}

      {/* Point B (skip if coincident) */}
      {!isCoincident && (
        <>
          <circle
            cx={svgB.x}
            cy={svgB.y}
            r={6}
            fill={pointBColor}
            stroke="white"
            strokeWidth={2}
          />
          {showLabels && (
            <text
              x={svgB.x + 10}
              y={svgB.y - 12}
              textAnchor="start"
              fontSize={12}
              fontWeight={600}
              fill={pointBColor}
            >
              B({fmtNum(pointB.x)}, {fmtNum(pointB.y)})
            </text>
          )}
        </>
      )}
    </g>
  );
}

function fmtNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(2)).toString();
}
