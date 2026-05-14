'use client';

import { useState, useCallback, useRef } from 'react';

export interface DragState {
  x: number;
  y: number;
  isDragging: boolean;
}

export interface UseDragOptions {
  /** Initial position */
  initialX?: number;
  initialY?: number;
  /** Bounds constraint */
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  /** Callback on drag move */
  onDrag?: (x: number, y: number) => void;
}

/**
 * Hook for SVG drag interactions.
 * Attaches pointer events to the draggable element.
 * Coordinates are in SVG space (not screen pixels).
 */
export function useDrag(options: UseDragOptions = {}) {
  const {
    initialX = 0,
    initialY = 0,
    minX,
    maxX,
    minY,
    maxY,
    onDrag,
  } = options;

  const [state, setState] = useState<DragState>({
    x: initialX,
    y: initialY,
    isDragging: false,
  });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragOffsetRef = useRef({ dx: 0, dy: 0 });

  const clampX = useCallback(
    (v: number) => {
      if (minX !== undefined && v < minX) return minX;
      if (maxX !== undefined && v > maxX) return maxX;
      return v;
    },
    [minX, maxX]
  );

  const clampY = useCallback(
    (v: number) => {
      if (minY !== undefined && v < minY) return minY;
      if (maxY !== undefined && v > maxY) return maxY;
      return v;
    },
    [minY, maxY]
  );

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
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);
      const pt = getSVGPoint(e.clientX, e.clientY);
      dragOffsetRef.current = {
        dx: state.x - pt.x,
        dy: state.y - pt.y,
      };
      setState((s) => ({ ...s, isDragging: true }));
    },
    [state.x, state.y, getSVGPoint]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!state.isDragging) return;
      const pt = getSVGPoint(e.clientX, e.clientY);
      const newX = clampX(pt.x + dragOffsetRef.current.dx);
      const newY = clampY(pt.y + dragOffsetRef.current.dy);
      setState((s) => ({ ...s, x: newX, y: newY }));
      onDrag?.(newX, newY);
    },
    [state.isDragging, getSVGPoint, clampX, clampY, onDrag]
  );

  const handlePointerUp = useCallback(() => {
    setState((s) => ({ ...s, isDragging: false }));
  }, []);

  // Allow external updates to position
  const setPosition = useCallback(
    (x: number, y: number) => {
      setState((s) => ({
        ...s,
        x: clampX(x),
        y: clampY(y),
      }));
    },
    [clampX, clampY]
  );

  return {
    ...state,
    setPosition,
    bindSVGRef: svgRef,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  };
}
