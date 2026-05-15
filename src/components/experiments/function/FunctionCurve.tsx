'use client';

import { useMemo } from 'react';
import type { Bounds } from '@/lib/math/coordinate';
import { mathToSvg } from '@/lib/math/coordinate';
import type { FunctionParams } from '@/lib/math/functions';
import { sampleCurve, filterValidSegments } from '@/lib/math/functions';

interface FunctionCurveProps {
  params: FunctionParams;
  bounds: Bounds;
  svgW: number;
  svgH: number;
  pad: number;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
}

/**
 * Pure display component that renders a function curve as SVG paths.
 * No state management, no experiment data, no CoordinateGrid.
 * Receives function params and coordinate system props, outputs SVG <path> elements.
 */
export default function FunctionCurve({
  params,
  bounds,
  svgW,
  svgH,
  pad,
  stroke = '#3b82f6',
  strokeWidth = 2.5,
  className,
}: FunctionCurveProps) {
  const segments = useMemo(() => {
    const points = sampleCurve(params, bounds.xMin, bounds.xMax);
    return filterValidSegments(points);
  }, [params, bounds]);

  const paths = useMemo(() => {
    return segments.map((seg) => {
      const d = seg
        .map((p, j) => {
          const svg = mathToSvg(p, bounds, svgW, svgH, pad);
          return `${j === 0 ? 'M' : 'L'} ${svg.x.toFixed(1)} ${svg.y.toFixed(1)}`;
        })
        .join(' ');
      return d;
    });
  }, [segments, bounds, svgW, svgH, pad]);

  return (
    <g className={className}>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}
