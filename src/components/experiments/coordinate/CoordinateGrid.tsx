'use client';

import { useMemo } from 'react';
import type { Bounds } from '@/lib/math/coordinate';
import { mathToSvg } from '@/lib/math/coordinate';

interface CoordinateGridProps {
  bounds: Bounds;
  svgW: number;
  svgH: number;
  pad: number;
  showQuadrantColors?: boolean;
}

const GRID_COLOR = '#e7e5e4';
const AXIS_COLOR = '#44403c';
const LABEL_COLOR = '#78716c';
const QUADRANT_COLORS = [
  'rgba(59,130,246,0.04)',  // Q1 - blue
  'rgba(16,185,129,0.04)',  // Q2 - green
  'rgba(245,158,11,0.04)',  // Q3 - amber
  'rgba(139,92,246,0.04)',  // Q4 - purple
];

/**
 * Pure display component for a coordinate grid.
 * Renders grid lines, axes, tick labels, and optional quadrant coloring.
 * No interaction logic — no drag state, no experiment data.
 */
export default function CoordinateGrid({
  bounds,
  svgW,
  svgH,
  pad,
  showQuadrantColors = false,
}: CoordinateGridProps) {
  const origin = useMemo(
    () => mathToSvg({ x: 0, y: 0 }, bounds, svgW, svgH, pad),
    [bounds, svgW, svgH, pad]
  );

  const axisTop = useMemo(
    () => mathToSvg({ x: 0, y: bounds.yMax }, bounds, svgW, svgH, pad),
    [bounds, svgW, svgH, pad]
  );

  const axisBottom = useMemo(
    () => mathToSvg({ x: 0, y: bounds.yMin }, bounds, svgW, svgH, pad),
    [bounds, svgW, svgH, pad]
  );

  const axisLeft = useMemo(
    () => mathToSvg({ x: bounds.xMin, y: 0 }, bounds, svgW, svgH, pad),
    [bounds, svgW, svgH, pad]
  );

  const axisRight = useMemo(
    () => mathToSvg({ x: bounds.xMax, y: 0 }, bounds, svgW, svgH, pad),
    [bounds, svgW, svgH, pad]
  );

  // Generate grid lines and labels
  const gridElements = useMemo(() => {
    const lines: React.ReactNode[] = [];
    const labels: React.ReactNode[] = [];

    for (let x = bounds.xMin; x <= bounds.xMax; x++) {
      const p = mathToSvg({ x, y: 0 }, bounds, svgW, svgH, pad);
      const isZero = x === 0;
      const isEven = x % 2 === 0;

      // Vertical grid line
      if (!isZero) {
        const pTop = mathToSvg({ x, y: bounds.yMax }, bounds, svgW, svgH, pad);
        const pBottom = mathToSvg({ x, y: bounds.yMin }, bounds, svgW, svgH, pad);
        lines.push(
          <line
            key={`gv-${x}`}
            x1={pTop.x}
            y1={pTop.y}
            x2={pBottom.x}
            y2={pBottom.y}
            stroke={GRID_COLOR}
            strokeWidth={0.5}
          />
        );
      }

      // X-axis tick and label
      if (isEven && x !== 0) {
        lines.push(
          <line
            key={`tx-${x}`}
            x1={p.x}
            y1={origin.y - 4}
            x2={p.x}
            y2={origin.y + 4}
            stroke={AXIS_COLOR}
            strokeWidth={1}
          />
        );
        labels.push(
          <text
            key={`lx-${x}`}
            x={p.x}
            y={origin.y + 18}
            textAnchor="middle"
            fontSize={11}
            fill={LABEL_COLOR}
          >
            {x}
          </text>
        );
      }
    }

    for (let y = bounds.yMin; y <= bounds.yMax; y++) {
      const p = mathToSvg({ x: 0, y }, bounds, svgW, svgH, pad);
      const isZero = y === 0;
      const isEven = y % 2 === 0;

      // Horizontal grid line
      if (!isZero) {
        const pLeft = mathToSvg({ x: bounds.xMin, y }, bounds, svgW, svgH, pad);
        const pRight = mathToSvg({ x: bounds.xMax, y }, bounds, svgW, svgH, pad);
        lines.push(
          <line
            key={`gh-${y}`}
            x1={pLeft.x}
            y1={pLeft.y}
            x2={pRight.x}
            y2={pRight.y}
            stroke={GRID_COLOR}
            strokeWidth={0.5}
          />
        );
      }

      // Y-axis tick and label
      if (isEven && y !== 0) {
        lines.push(
          <line
            key={`ty-${y}`}
            x1={origin.x - 4}
            y1={p.y}
            x2={origin.x + 4}
            y2={p.y}
            stroke={AXIS_COLOR}
            strokeWidth={1}
          />
        );
        labels.push(
          <text
            key={`ly-${y}`}
            x={origin.x - 12}
            y={p.y + 4}
            textAnchor="end"
            fontSize={11}
            fill={LABEL_COLOR}
          >
            {y}
          </text>
        );
      }
    }

    return { lines, labels };
  }, [bounds, svgW, svgH, pad, origin]);

  // Quadrant coloring
  const quadrantRects = useMemo(() => {
    if (!showQuadrantColors) return null;

    const quadrants = [
      { xRange: [0, bounds.xMax] as [number, number], yRange: [0, bounds.yMax] as [number, number] },
      { xRange: [bounds.xMin, 0] as [number, number], yRange: [0, bounds.yMax] as [number, number] },
      { xRange: [bounds.xMin, 0] as [number, number], yRange: [bounds.yMin, 0] as [number, number] },
      { xRange: [0, bounds.xMax] as [number, number], yRange: [bounds.yMin, 0] as [number, number] },
    ];

    return quadrants.map((q, i) => {
      const topLeft = mathToSvg(
        { x: q.xRange[0], y: q.yRange[1] },
        bounds, svgW, svgH, pad
      );
      const bottomRight = mathToSvg(
        { x: q.xRange[1], y: q.yRange[0] },
        bounds, svgW, svgH, pad
      );
      return (
        <rect
          key={`q${i + 1}`}
          x={topLeft.x}
          y={topLeft.y}
          width={bottomRight.x - topLeft.x}
          height={bottomRight.y - topLeft.y}
          fill={QUADRANT_COLORS[i]}
        />
      );
    });
  }, [showQuadrantColors, bounds, svgW, svgH, pad]);

  return (
    <g>
      {/* Quadrant backgrounds */}
      {quadrantRects}

      {/* Grid lines and labels */}
      {gridElements.lines}
      {gridElements.labels}

      {/* Origin label */}
      <text
        x={origin.x - 10}
        y={origin.y + 16}
        textAnchor="end"
        fontSize={11}
        fontWeight={600}
        fill={AXIS_COLOR}
      >
        0
      </text>

      {/* X-axis */}
      <line
        x1={axisLeft.x - 8}
        y1={origin.y}
        x2={axisRight.x + 8}
        y2={origin.y}
        stroke={AXIS_COLOR}
        strokeWidth={1.5}
      />
      <polygon
        points={`${axisRight.x + 8},${origin.y} ${axisRight.x},${origin.y - 4} ${axisRight.x},${origin.y + 4}`}
        fill={AXIS_COLOR}
      />
      <text
        x={axisRight.x + 14}
        y={origin.y + 4}
        fontSize={13}
        fontWeight={600}
        fill={AXIS_COLOR}
      >
        x
      </text>

      {/* Y-axis */}
      <line
        x1={origin.x}
        y1={axisTop.y - 8}
        x2={origin.x}
        y2={axisBottom.y + 8}
        stroke={AXIS_COLOR}
        strokeWidth={1.5}
      />
      <polygon
        points={`${origin.x},${axisTop.y - 8} ${origin.x - 4},${axisTop.y} ${origin.x + 4},${axisTop.y}`}
        fill={AXIS_COLOR}
      />
      <text
        x={origin.x + 10}
        y={axisTop.y - 4}
        fontSize={13}
        fontWeight={600}
        fill={AXIS_COLOR}
      >
        y
      </text>
    </g>
  );
}
