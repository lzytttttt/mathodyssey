'use client';

import { useState, useCallback, useEffect, useRef, type RefObject } from 'react';

// ─── Pure helpers (testable, no React dependency) ───

/** Clamp zoom span within [minSpan, maxSpan] */
export function clampZoom(
  span: number,
  minSpan: number,
  maxSpan: number
): number {
  return Math.max(minSpan, Math.min(maxSpan, span));
}

/** Euclidean distance between two pointer positions */
export function calculatePinchDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Midpoint between two pointer positions */
export function calculatePinchMidpoint(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): { x: number; y: number } {
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
}

/** Calculate year delta from pixel dx */
export function calculatePanDelta(
  pixelDelta: number,
  yearsPerPixel: number
): number {
  return -pixelDelta * yearsPerPixel;
}

// ─── Constants ───

const TIMELINE_START = -2000;
const TIMELINE_END = 1800;
const MIN_YEAR_SPAN = 200;
const TOTAL_SPAN = TIMELINE_END - TIMELINE_START;
const CLICK_THRESHOLD_PX = 5;

// ─── Types ───

interface PointerPos {
  x: number;
  y: number;
}

interface PanStartSnapshot {
  startX: number;
  startViewStart: number;
  startViewEnd: number;
}

interface UseTimelinePanZoomOptions {
  initialViewStart?: number;
  initialViewEnd?: number;
}

interface UseTimelinePanZoomReturn {
  viewStart: number;
  viewEnd: number;
  containerWidth: number;
  yearToX: (year: number) => number;
  xToYear: (x: number) => number;
  containerRef: RefObject<HTMLDivElement | null>;
  containerProps: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
    onWheel: (e: React.WheelEvent) => void;
    onClick: (e: React.MouseEvent) => void;
    style: { touchAction: 'none' };
    className: string;
  };
}

// ─── Hook ───

export function useTimelinePanZoom(
  options: UseTimelinePanZoomOptions = {}
): UseTimelinePanZoomReturn {
  const {
    initialViewStart = TIMELINE_START,
    initialViewEnd = TIMELINE_END,
  } = options;

  const [viewStart, setViewStart] = useState(initialViewStart);
  const [viewEnd, setViewEnd] = useState(initialViewEnd);
  const [containerWidth, setContainerWidth] = useState(1200);

  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for latest state (avoid stale closures in event handlers)
  const viewStartRef = useRef(viewStart);
  const viewEndRef = useRef(viewEnd);
  useEffect(() => {
    viewStartRef.current = viewStart;
    viewEndRef.current = viewEnd;
  }, [viewStart, viewEnd]);

  // Pointer tracking
  const pointersRef = useRef<Map<number, PointerPos>>(new Map());
  const isPanningRef = useRef(false);
  const isPinchingRef = useRef(false);
  const panStartRef = useRef<PanStartSnapshot | null>(null);
  const lastPinchDistRef = useRef(0);
  const totalPointerMoveRef = useRef(0);

  // ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Coordinate converters
  const yearToX = useCallback(
    (year: number) =>
      ((year - viewStart) / (viewEnd - viewStart)) * containerWidth,
    [viewStart, viewEnd, containerWidth]
  );

  const xToYear = useCallback(
    (x: number) =>
      viewStart + (x / containerWidth) * (viewEnd - viewStart),
    [viewStart, viewEnd, containerWidth]
  );

  // Apply zoom around a pixel position
  const applyZoom = useCallback(
    (factor: number, centerPixelX: number) => {
      const cs = viewStartRef.current;
      const ce = viewEndRef.current;
      const currentSpan = ce - cs;
      const newSpan = clampZoom(
        currentSpan * factor,
        MIN_YEAR_SPAN,
        TOTAL_SPAN
      );
      const centerYear =
        cs + (centerPixelX / containerWidth) * currentSpan;
      const ratio =
        currentSpan > 0 ? (centerYear - cs) / currentSpan : 0.5;
      let newStart = centerYear - ratio * newSpan;
      let newEnd = centerYear + (1 - ratio) * newSpan;
      if (newStart < TIMELINE_START) {
        newStart = TIMELINE_START;
        newEnd = TIMELINE_START + newSpan;
      }
      if (newEnd > TIMELINE_END) {
        newEnd = TIMELINE_END;
        newStart = TIMELINE_END - newSpan;
      }
      setViewStart(newStart);
      setViewEnd(newEnd);
    },
    [containerWidth]
  );

  // Apply pan from a start snapshot
  const applyPan = useCallback(
    (snapshot: PanStartSnapshot, currentX: number) => {
      const dx = currentX - snapshot.startX;
      const yearsPerPixel =
        (snapshot.startViewEnd - snapshot.startViewStart) / containerWidth;
      const yearDelta = calculatePanDelta(dx, yearsPerPixel);
      const span = snapshot.startViewEnd - snapshot.startViewStart;
      let newStart = snapshot.startViewStart + yearDelta;
      let newEnd = snapshot.startViewEnd + yearDelta;
      if (newStart < TIMELINE_START) {
        newStart = TIMELINE_START;
        newEnd = TIMELINE_START + span;
      }
      if (newEnd > TIMELINE_END) {
        newEnd = TIMELINE_END;
        newStart = TIMELINE_END - span;
      }
      setViewStart(newStart);
      setViewEnd(newEnd);
    },
    [containerWidth]
  );

  // ─── Pointer event handlers ───

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;

      e.preventDefault();
      el.setPointerCapture(e.pointerId);

      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      totalPointerMoveRef.current = 0;

      const count = pointersRef.current.size;

      if (count === 1) {
        isPanningRef.current = true;
        isPinchingRef.current = false;
        panStartRef.current = {
          startX: e.clientX,
          startViewStart: viewStartRef.current,
          startViewEnd: viewEndRef.current,
        };
      } else if (count === 2) {
        // Switch from pan to pinch
        isPanningRef.current = false;
        isPinchingRef.current = true;
        panStartRef.current = null;
        const pts = Array.from(pointersRef.current.values());
        lastPinchDistRef.current = calculatePinchDistance(
          pts[0].x, pts[0].y, pts[1].x, pts[1].y
        );
      }
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      // Track total movement for click vs drag detection
      const prev = pointersRef.current.get(e.pointerId);
      if (prev) {
        totalPointerMoveRef.current +=
          Math.abs(e.clientX - prev.x) + Math.abs(e.clientY - prev.y);
      }
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (isPanningRef.current && panStartRef.current) {
        applyPan(panStartRef.current, e.clientX);
      } else if (isPinchingRef.current) {
        const pts = Array.from(pointersRef.current.values());
        if (pts.length < 2) return;
        const newDist = calculatePinchDistance(
          pts[0].x, pts[0].y, pts[1].x, pts[1].y
        );
        const lastDist = lastPinchDistRef.current;
        if (lastDist > 0) {
          const factor = lastDist / newDist;
          const mid = calculatePinchMidpoint(
            pts[0].x, pts[0].y, pts[1].x, pts[1].y
          );
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            applyZoom(factor, mid.x - rect.left);
          }
        }
        lastPinchDistRef.current = newDist;
      }
    },
    [applyPan, applyZoom]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      pointersRef.current.delete(e.pointerId);
      if (pointersRef.current.size < 2) {
        isPinchingRef.current = false;
      }
      if (pointersRef.current.size === 0) {
        isPanningRef.current = false;
        panStartRef.current = null;
      } else if (pointersRef.current.size === 1) {
        // Transition from pinch back to pan
        isPinchingRef.current = false;
        isPanningRef.current = true;
        const remaining = Array.from(pointersRef.current.values())[0];
        panStartRef.current = {
          startX: remaining.x,
          startViewStart: viewStartRef.current,
          startViewEnd: viewEndRef.current,
        };
      }
    },
    []
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent) => {
      pointersRef.current.delete(e.pointerId);
      if (pointersRef.current.size < 2) isPinchingRef.current = false;
      if (pointersRef.current.size === 0) {
        isPanningRef.current = false;
        panStartRef.current = null;
      }
    },
    []
  );

  // Global pointerup fallback (in case pointer leaves the element)
  useEffect(() => {
    const onGlobalUp = () => {
      pointersRef.current.clear();
      isPanningRef.current = false;
      isPinchingRef.current = false;
      panStartRef.current = null;
    };
    window.addEventListener('pointerup', onGlobalUp);
    return () => window.removeEventListener('pointerup', onGlobalUp);
  }, []);

  // Wheel zoom (desktop)
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = e.clientX - rect.left;
      const factor = e.deltaY > 0 ? 1.2 : 1 / 1.2;
      applyZoom(factor, mouseX);
    },
    [applyZoom]
  );

  // Click: suppress navigation after drag
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (totalPointerMoveRef.current > CLICK_THRESHOLD_PX) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    []
  );

  return {
    viewStart,
    viewEnd,
    containerWidth,
    yearToX,
    xToYear,
    containerRef,
    containerProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onWheel: handleWheel,
      onClick: handleClick,
      style: { touchAction: 'none' },
      className:
        'w-full h-[500px] overflow-hidden cursor-grab active:cursor-grabbing select-none',
    },
  };
}
