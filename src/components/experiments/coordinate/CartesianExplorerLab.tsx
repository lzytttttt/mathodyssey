'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import type { Experiment } from '@/types/timeline';
import ExperimentContainer from '../ExperimentContainer';
import DraggablePoint from '../geometry/DraggablePoint';
import FormulaDisplay from '@/components/math/FormulaDisplay';
import CoordinateGrid from './CoordinateGrid';
import {
  DEFAULT_BOUNDS,
  DEFAULT_SVG_W,
  DEFAULT_SVG_H,
  DEFAULT_PAD,
  mathToSvg,
  svgToMath,
  snapToGrid,
  clampCoordinate,
  deltaBetweenPoints,
  distanceBetweenPoints,
  slopeBetweenPoints,
  quadrantOfPoint,
  quadrantLabel,
  lineEquationFromTwoPoints,
  formatLineEquation,
} from '@/lib/math/coordinate';
import type { Point, Bounds } from '@/lib/math/coordinate';

/** Visual constants */
const BLUE = '#3b82f6';
const ORANGE = '#f59e0b';
const PURPLE = '#8b5cf6';
const STONE = '#78716c';

/** Preset point pairs */
const PRESETS: { label: string; a: Point; b: Point }[] = [
  { label: '经典 3-4-5', a: { x: 0, y: 0 }, b: { x: 3, y: 4 } },
  { label: '斜率正', a: { x: 1, y: 2 }, b: { x: 4, y: 8 } },
  { label: '斜率负', a: { x: -2, y: 6 }, b: { x: 4, y: -3 } },
  { label: '垂直线', a: { x: 3, y: -5 }, b: { x: 3, y: 7 } },
];

interface CartesianExplorerLabProps {
  experiment: Experiment;
}

export default function CartesianExplorerLab({
  experiment,
}: CartesianExplorerLabProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const bounds: Bounds = DEFAULT_BOUNDS;

  // --- Initial state from JSON ---
  const initial = experiment.scene.initialState;
  const [pointA, setPointA] = useState<Point>({
    x: clampCoordinate(typeof initial.pointAX === 'number' ? initial.pointAX : 0, bounds.xMin, bounds.xMax),
    y: clampCoordinate(typeof initial.pointAY === 'number' ? initial.pointAY : 0, bounds.yMin, bounds.yMax),
  });
  const [pointB, setPointB] = useState<Point>({
    x: clampCoordinate(typeof initial.pointBX === 'number' ? initial.pointBX : 3, bounds.xMin, bounds.xMax),
    y: clampCoordinate(typeof initial.pointBY === 'number' ? initial.pointBY : 4, bounds.yMin, bounds.yMax),
  });

  // --- Derived math ---
  const delta = useMemo(() => deltaBetweenPoints(pointA, pointB), [pointA, pointB]);
  const dist = useMemo(() => distanceBetweenPoints(pointA, pointB), [pointA, pointB]);
  const slope = useMemo(() => slopeBetweenPoints(pointA, pointB), [pointA, pointB]);
  const lineEq = useMemo(() => lineEquationFromTwoPoints(pointA, pointB), [pointA, pointB]);
  const qA = useMemo(() => quadrantOfPoint(pointA), [pointA]);
  const qB = useMemo(() => quadrantOfPoint(pointB), [pointB]);
  const isCoincident = pointA.x === pointB.x && pointA.y === pointB.y;

  // --- SVG positions ---
  const svgA = useMemo(() => mathToSvg(pointA, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD), [pointA, bounds]);
  const svgB = useMemo(() => mathToSvg(pointB, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD), [pointB, bounds]);

  // Delta triangle corner: (B.x, A.y) in math → SVG
  const deltaCorner = useMemo(
    () => mathToSvg({ x: pointB.x, y: pointA.y }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD),
    [pointA, pointB, bounds]
  );

  // --- Line through A and B, clipped to bounds ---
  const lineSegment = useMemo(() => {
    if (isCoincident) return null;

    if (lineEq.kind === 'vertical') {
      const top = mathToSvg({ x: lineEq.x, y: bounds.yMax }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD);
      const bottom = mathToSvg({ x: lineEq.x, y: bounds.yMin }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD);
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

      // Deduplicate and pick two extreme points
      const unique = candidates.filter((c, i, arr) =>
        arr.findIndex((d) => Math.abs(d.x - c.x) < 0.01 && Math.abs(d.y - c.y) < 0.01) === i
      );

      if (unique.length < 2) return null;

      // Sort by x to get consistent ordering
      unique.sort((a, b) => a.x - b.x);
      const p1 = mathToSvg(unique[0], bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD);
      const p2 = mathToSvg(unique[unique.length - 1], bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD);
      return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    }

    return null;
  }, [lineEq, isCoincident, bounds]);

  // --- Drag handlers ---
  const handleMoveA = useCallback(
    (svgX: number, svgY: number) => {
      const math = svgToMath(svgX, svgY, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD);
      const snapped = snapToGrid(math, bounds);
      setPointA(snapped);
    },
    [bounds]
  );

  const handleMoveB = useCallback(
    (svgX: number, svgY: number) => {
      const math = svgToMath(svgX, svgY, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD);
      const snapped = snapToGrid(math, bounds);
      setPointB(snapped);
    },
    [bounds]
  );

  const applyPreset = useCallback((a: Point, b: Point) => {
    setPointA(a);
    setPointB(b);
  }, []);

  // --- Right angle marker size ---
  const ANGLE_SIZE = 8;

  // --- Slope display ---
  const slopeDisplay = slope === null ? '\\text{未定义}' : formatSlopeLatex(slope);
  const slopeExplanation = slope === null
    ? 'Δx = 0，竖直线的斜率未定义'
    : slope > 0
      ? '正斜率：直线从左下到右上'
      : slope < 0
        ? '负斜率：直线从左上到右下'
        : '零斜率：水平线';

  // --- Line equation display ---
  const eqDisplay = formatLineEquation(lineEq);
  const eqLatex = lineEqToLatex(lineEq);

  // --- Result panel ---
  const resultPanel = (
    <div className="space-y-5">
      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-xs text-blue-600 mb-1">点 A</p>
          <p className="text-xl font-mono font-bold text-blue-800">
            ({pointA.x}, {pointA.y})
          </p>
          <p className="text-xs text-blue-600 mt-1">{quadrantLabel(qA)}</p>
        </div>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <p className="text-xs text-amber-600 mb-1">点 B</p>
          <p className="text-xl font-mono font-bold text-amber-800">
            ({pointB.x}, {pointB.y})
          </p>
          <p className="text-xs text-amber-600 mt-1">{quadrantLabel(qB)}</p>
        </div>
      </div>

      {/* Delta, distance, slope */}
      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-stone-500">Δx = </span>
            <span className="font-mono font-semibold text-stone-800">
              {pointB.x} - {pointA.x} = <strong>{delta.dx}</strong>
            </span>
          </div>
          <div>
            <span className="text-stone-500">Δy = </span>
            <span className="font-mono font-semibold text-stone-800">
              {pointB.y} - {pointA.y} = <strong>{delta.dy}</strong>
            </span>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-3">
          <p className="text-sm text-stone-600 mb-1">距离（勾股定理）</p>
          <div className="text-center">
            <FormulaDisplay
              formula={`d = \\sqrt{(${delta.dx})^2 + (${delta.dy})^2} = \\sqrt{${delta.dx * delta.dx} + ${delta.dy * delta.dy}} = ${formatDist(dist)}`}
              className="text-lg"
            />
          </div>
        </div>

        <div className="border-t border-stone-200 pt-3">
          <p className="text-sm text-stone-600 mb-1">斜率</p>
          <div className="text-center">
            <FormulaDisplay
              formula={`m = \\frac{\\Delta y}{\\Delta x} = ${slopeDisplay}`}
              className="text-lg"
            />
          </div>
          <p className="text-xs text-stone-500 mt-1 text-center">{slopeExplanation}</p>
        </div>
      </div>

      {/* Line equation */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="text-sm font-medium text-purple-800 mb-2">直线方程</h4>
        <div className="text-center">
          <FormulaDisplay formula={eqLatex} className="text-lg" />
        </div>
        <p className="text-xs text-purple-600 mt-2 text-center">
          {lineEq.kind === 'normal'
            ? '几何关系 → 代数方程：两点确定一条直线'
            : lineEq.kind === 'vertical'
              ? '竖直线没有 y = mx + b 形式，直接用 x = 常数表示'
              : '一个点无法确定唯一直线'}
        </p>
      </div>

      {/* Geometry → Algebra insight */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-sm font-medium text-green-800 mb-2">几何 → 代数</h4>
        <p className="text-sm text-green-700">
          {isCoincident
            ? '两点重合时，距离为 0，无法确定唯一直线。试试把 B 拖到不同的位置。'
            : `两点 (${pointA.x}, ${pointA.y}) 和 (${pointB.x}, ${pointB.y}) 之间的几何关系，现在可以用代数精确描述：距离 d = ${formatDist(dist)}，斜率 m = ${slope === null ? '未定义' : formatSlope(slope)}，方程 ${eqDisplay}。`}
        </p>
      </div>
    </div>
  );

  return (
    <ExperimentContainer experiment={experiment} resultPanel={resultPanel}>
      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${DEFAULT_SVG_W} ${DEFAULT_SVG_H}`}
        className="w-full h-auto"
        style={{ touchAction: 'none' }}
      >
        {/* Background */}
        <rect width={DEFAULT_SVG_W} height={DEFAULT_SVG_H} fill="#fafaf9" />

        {/* Title */}
        <text
          x={DEFAULT_SVG_W / 2}
          y={22}
          textAnchor="middle"
          fontSize="15"
          fontWeight="600"
          fill="#44403c"
        >
          坐标探索器
        </text>

        {/* Coordinate grid */}
        <CoordinateGrid
          bounds={bounds}
          svgW={DEFAULT_SVG_W}
          svgH={DEFAULT_SVG_H}
          pad={DEFAULT_PAD}
          showQuadrantColors
        />

        {/* Line through A and B */}
        {lineSegment && (
          <line
            x1={lineSegment.x1}
            y1={lineSegment.y1}
            x2={lineSegment.x2}
            y2={lineSegment.y2}
            stroke="#d6d3d1"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
        )}

        {/* Delta triangle: horizontal leg (Δx) */}
        {!isCoincident && pointA.y !== pointB.y && (
          <>
            {/* Horizontal dashed line: A → (B.x, A.y) */}
            <line
              x1={svgA.x}
              y1={svgA.y}
              x2={deltaCorner.x}
              y2={deltaCorner.y}
              stroke={BLUE}
              strokeWidth={1.5}
              strokeDasharray="5 3"
              opacity={0.7}
            />
            {/* Δx label */}
            <text
              x={(svgA.x + deltaCorner.x) / 2}
              y={svgA.y + (deltaCorner.x > svgA.x ? -8 : -8)}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill={BLUE}
            >
              Δx={delta.dx}
            </text>
          </>
        )}

        {!isCoincident && pointA.x !== pointB.x && (
          <>
            {/* Vertical dashed line: (B.x, A.y) → B */}
            <line
              x1={deltaCorner.x}
              y1={deltaCorner.y}
              x2={svgB.x}
              y2={svgB.y}
              stroke={ORANGE}
              strokeWidth={1.5}
              strokeDasharray="5 3"
              opacity={0.7}
            />
            {/* Δy label */}
            <text
              x={svgB.x + (delta.dy >= 0 ? 14 : 14)}
              y={(deltaCorner.y + svgB.y) / 2 + 4}
              textAnchor="start"
              fontSize={11}
              fontWeight={600}
              fill={ORANGE}
            >
              Δy={delta.dy}
            </text>
          </>
        )}

        {/* Right angle marker at delta corner */}
        {!isCoincident && pointA.x !== pointB.x && pointA.y !== pointB.y && (
          <path
            d={`M ${deltaCorner.x + (delta.dx > 0 ? -ANGLE_SIZE : ANGLE_SIZE)} ${deltaCorner.y}
                L ${deltaCorner.x + (delta.dx > 0 ? -ANGLE_SIZE : ANGLE_SIZE)} ${deltaCorner.y + (delta.dy > 0 ? ANGLE_SIZE : -ANGLE_SIZE)}
                L ${deltaCorner.x} ${deltaCorner.y + (delta.dy > 0 ? ANGLE_SIZE : -ANGLE_SIZE)}`}
            fill="none"
            stroke={STONE}
            strokeWidth={1}
          />
        )}

        {/* Connection line AB */}
        {!isCoincident && (
          <line
            x1={svgA.x}
            y1={svgA.y}
            x2={svgB.x}
            y2={svgB.y}
            stroke="#a8a29e"
            strokeWidth={2}
          />
        )}

        {/* Distance label on AB */}
        {!isCoincident && (
          <text
            x={(svgA.x + svgB.x) / 2 + (svgB.y > svgA.y ? -14 : 14)}
            y={(svgA.y + svgB.y) / 2}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill={PURPLE}
          >
            d={formatDist(dist)}
          </text>
        )}

        {/* Draggable point A */}
        <DraggablePoint
          x={svgA.x}
          y={svgA.y}
          onMove={handleMoveA}
          svgRef={svgRef}
          radius={10}
          color={BLUE}
          label={`A(${pointA.x}, ${pointA.y})`}
          minX={mathToSvg({ x: bounds.xMin, y: 0 }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD).x}
          maxX={mathToSvg({ x: bounds.xMax, y: 0 }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD).x}
          minY={mathToSvg({ x: 0, y: bounds.yMax }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD).y}
          maxY={mathToSvg({ x: 0, y: bounds.yMin }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD).y}
        />

        {/* Draggable point B */}
        <DraggablePoint
          x={svgB.x}
          y={svgB.y}
          onMove={handleMoveB}
          svgRef={svgRef}
          radius={10}
          color={ORANGE}
          label={`B(${pointB.x}, ${pointB.y})`}
          minX={mathToSvg({ x: bounds.xMin, y: 0 }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD).x}
          maxX={mathToSvg({ x: bounds.xMax, y: 0 }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD).x}
          minY={mathToSvg({ x: 0, y: bounds.yMax }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD).y}
          maxY={mathToSvg({ x: 0, y: bounds.yMin }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD).y}
        />

        {/* Instructions */}
        <text
          x={DEFAULT_SVG_W / 2}
          y={DEFAULT_SVG_H - 8}
          textAnchor="middle"
          fontSize={11}
          fill="#a8a29e"
        >
          拖动点 A 和点 B · 观察坐标、距离、斜率的变化
        </text>
      </svg>

      {/* Preset buttons */}
      <div className="px-6 py-4 bg-white border-t border-stone-100">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-stone-500 shrink-0">预设</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.a, p.b)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                pointA.x === p.a.x && pointA.y === p.a.y &&
                pointB.x === p.b.x && pointB.y === p.b.y
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </ExperimentContainer>
  );
}

// --- Helper formatters ---

function formatDist(d: number): string {
  if (Number.isInteger(d)) return String(d);
  return parseFloat(d.toFixed(2)).toString();
}

function formatSlope(m: number): string {
  if (Number.isInteger(m)) return String(m);
  return parseFloat(m.toFixed(2)).toString();
}

function formatSlopeLatex(m: number): string {
  if (Number.isInteger(m)) return String(m);
  // Try to express as a fraction for common cases
  const frac = toFraction(m, 100);
  if (frac) return `\\frac{${frac.num}}{${frac.den}}`;
  return parseFloat(m.toFixed(2)).toString();
}

function lineEqToLatex(eq: ReturnType<typeof lineEquationFromTwoPoints>): string {
  if (eq.kind === 'indeterminate') return '\\text{两点重合，无法确定唯一直线}';
  if (eq.kind === 'vertical') return `x = ${eq.x}`;

  const m = eq.slope;
  const b = eq.intercept;

  if (m === 0) {
    return b === 0 ? 'y = 0' : `y = ${b}`;
  }

  const mPart = m === 1 ? '' : m === -1 ? '-' : formatSlopeLatex(m);
  const sign = b > 0 ? ' + ' : b < 0 ? ' - ' : '';
  const bPart = b === 0 ? '' : `${sign}${Math.abs(b)}`;

  return `y = ${mPart}x${bPart}`;
}

function toFraction(val: number, maxDen: number): { num: number; den: number } | null {
  if (Number.isInteger(val)) return null;
  for (let den = 2; den <= maxDen; den++) {
    const num = Math.round(val * den);
    if (Math.abs(num / den - val) < 1e-9) {
      return { num, den };
    }
  }
  return null;
}
