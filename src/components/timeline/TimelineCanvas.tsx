'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { TimelineNode } from '@/types/timeline';
import TimelineNodeComponent from './TimelineNode';
import EraMarker from './EraMarker';
import { eras } from '@/lib/data/eras';

interface TimelineCanvasProps {
  nodes: TimelineNode[];
}

const TIMELINE_START = -2000;
const TIMELINE_END = 1800;
const MIN_YEAR_SPAN = 200;
const NODE_Y = 200;
const DEFAULT_WIDTH = 1200;

export default function TimelineCanvas({ nodes }: TimelineCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(DEFAULT_WIDTH);
  const [viewStart, setViewStart] = useState(TIMELINE_START);
  const [viewEnd, setViewEnd] = useState(TIMELINE_END);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartViewStart, setDragStartViewStart] = useState(0);
  const [dragStartViewEnd, setDragStartViewEnd] = useState(0);

  // 监听容器尺寸变化
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const yearToX = useCallback(
    (year: number) => {
      return ((year - viewStart) / (viewEnd - viewStart)) * containerWidth;
    },
    [viewStart, viewEnd, containerWidth]
  );

  const xToYear = useCallback(
    (x: number) => {
      return viewStart + (x / containerWidth) * (viewEnd - viewStart);
    },
    [viewStart, viewEnd, containerWidth]
  );

  // 拖拽平移
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStartX(e.clientX);
      setDragStartViewStart(viewStart);
      setDragStartViewEnd(viewEnd);
    },
    [viewStart, viewEnd]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      const yearsPerPixel = (dragStartViewEnd - dragStartViewStart) / containerWidth;
      const yearDelta = -dx * yearsPerPixel;
      const span = dragStartViewEnd - dragStartViewStart;
      let newStart = dragStartViewStart + yearDelta;
      let newEnd = dragStartViewEnd + yearDelta;
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
    [isDragging, dragStartX, dragStartViewStart, dragStartViewEnd, containerWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 滚轮缩放
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = e.clientX - rect.left;
      const mouseYear = xToYear(mouseX);
      const factor = e.deltaY > 0 ? 1.2 : 0.8;
      const newSpan = Math.max(
        MIN_YEAR_SPAN,
        Math.min(TIMELINE_END - TIMELINE_START, (viewEnd - viewStart) * factor)
      );
      const ratio = (mouseYear - viewStart) / (viewEnd - viewStart);
      let newStart = mouseYear - ratio * newSpan;
      let newEnd = mouseYear + (1 - ratio) * newSpan;
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
    [viewStart, viewEnd, xToYear]
  );

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // 生成时代标记
  const visibleEras = eras.filter(
    (era) => era.endYear >= viewStart && era.startYear <= viewEnd
  );

  return (
    <div className="relative w-full">
      {/* 缩放提示 */}
      <div className="absolute top-4 right-4 z-10 text-xs text-stone-400">
        滚轮/双指缩放 · 拖拽平移
      </div>

      {/* 时间轴容器 */}
      <div
        ref={containerRef}
        className="w-full h-[500px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg width="100%" height="100%">
          {/* 时代背景 */}
          {visibleEras.map((era) => {
            const x1 = yearToX(Math.max(era.startYear, viewStart));
            const x2 = yearToX(Math.min(era.endYear, viewEnd));
            return (
              <EraMarker
                key={era.id}
                era={era}
                x={x1}
                width={x2 - x1}
              />
            );
          })}

          {/* 时间轴线 */}
          <line
            x1="0"
            y1={NODE_Y}
            x2={containerWidth}
            y2={NODE_Y}
            stroke="#d4d4d4"
            strokeWidth="2"
          />

          {/* 年份刻度 */}
          {Array.from(
            { length: Math.ceil((viewEnd - viewStart) / 500) + 1 },
            (_, i) => {
              const year = Math.ceil(viewStart / 500) * 500 + i * 500;
              if (year < viewStart || year > viewEnd) return null;
              const x = yearToX(year);
              return (
                <g key={year}>
                  <line
                    x1={x}
                    y1={NODE_Y - 10}
                    x2={x}
                    y2={NODE_Y + 10}
                    stroke="#a3a3a3"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={NODE_Y + 30}
                    textAnchor="middle"
                    fill="#737373"
                    fontSize="12"
                  >
                    {year < 0 ? `前${-year}年` : `${year}年`}
                  </text>
                </g>
              );
            }
          )}

          {/* 节点 */}
          {nodes.map((node) => {
            const x = yearToX(node.timePeriod.start);
            if (x < -50 || x > containerWidth + 50) return null;
            return (
              <TimelineNodeComponent
                key={node.id}
                node={node}
                x={x}
                y={NODE_Y}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
