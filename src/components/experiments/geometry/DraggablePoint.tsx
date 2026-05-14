'use client';

import { useCallback, useRef, useState } from 'react';

interface DraggablePointProps {
  /** Current x position in SVG coordinates */
  x: number;
  /** Current y position in SVG coordinates */
  y: number;
  /** Callback when position changes */
  onMove: (x: number, y: number) => void;
  /** SVG ref for coordinate conversion */
  svgRef: React.RefObject<SVGSVGElement | null>;
  /** Visual radius */
  radius?: number;
  /** Fill color */
  color?: string;
  /** Label displayed near the point */
  label?: string;
  /** Constraint: x bounds */
  minX?: number;
  maxX?: number;
  /** Constraint: y bounds */
  minY?: number;
  maxY?: number;
  /** If true, only allow vertical movement */
  verticalOnly?: boolean;
  /** If true, only allow horizontal movement */
  horizontalOnly?: boolean;
}

/**
 * A draggable SVG circle that converts pointer events to SVG coordinates.
 * Uses pointer capture for reliable drag behavior.
 */
export default function DraggablePoint({
  x,
  y,
  onMove,
  svgRef,
  radius = 10,
  color = '#3b82f6',
  label,
  minX,
  maxX,
  minY,
  maxY,
  verticalOnly = false,
  horizontalOnly = false,
}: DraggablePointProps) {
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef({ dx: 0, dy: 0 });

  const getSVGPoint = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return { x: clientX, y: clientY };
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: clientX, y: clientY };
      const svgPt = pt.matrixTransform(ctm.inverse());
      return { x: svgPt.x, y: svgPt.y };
    },
    [svgRef]
  );

  const clamp = useCallback(
    (val: number, min?: number, max?: number) => {
      if (min !== undefined && val < min) return min;
      if (max !== undefined && val > max) return max;
      return val;
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);
      const pt = getSVGPoint(e.clientX, e.clientY);
      offsetRef.current = { dx: x - pt.x, dy: y - pt.y };
      setIsDragging(true);
    },
    [x, y, getSVGPoint]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const pt = getSVGPoint(e.clientX, e.clientY);
      const newX = verticalOnly ? x : clamp(pt.x + offsetRef.current.dx, minX, maxX);
      const newY = horizontalOnly ? y : clamp(pt.y + offsetRef.current.dy, minY, maxY);
      onMove(newX, newY);
    },
    [isDragging, getSVGPoint, x, y, onMove, minX, maxX, minY, maxY, verticalOnly, horizontalOnly, clamp]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <g>
      {/* Invisible larger hit area */}
      <circle
        cx={x}
        cy={y}
        r={radius * 2.5}
        fill="transparent"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
      {/* Visible circle */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={isDragging ? '#2563eb' : color}
        stroke="white"
        strokeWidth={2}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          filter: isDragging ? 'drop-shadow(0 0 4px rgba(37,99,235,0.5))' : 'none',
          transition: 'filter 0.15s',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
      {/* Label */}
      {label && (
        <text
          x={x}
          y={y - radius - 8}
          textAnchor="middle"
          fontSize={12}
          fill={isDragging ? '#2563eb' : '#57534e'}
          fontWeight={500}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {label}
        </text>
      )}
    </g>
  );
}
