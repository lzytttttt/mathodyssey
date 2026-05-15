'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Experiment } from '@/types/timeline';
import ExperimentContainer from '../ExperimentContainer';
import FormulaDisplay from '@/components/math/FormulaDisplay';
import CoordinateGrid from '../coordinate/CoordinateGrid';
import FunctionCurve from '../function/FunctionCurve';
import SecantLine from './SecantLine';
import TangentLine from './TangentLine';
import {
  DEFAULT_BOUNDS,
  DEFAULT_SVG_W,
  DEFAULT_SVG_H,
  DEFAULT_PAD,
  mathToSvg,
} from '@/lib/math/coordinate';
import type { Bounds } from '@/lib/math/coordinate';
import type { FunctionParams } from '@/lib/math/functions';
import { formatEquationLatex } from '@/lib/math/functions';
import {
  averageRateOfChange,
  derivativeAtPoint,
} from '@/lib/math/calculus';

/** Fixed function: y = x² */
const FIXED_PARAMS: FunctionParams = { type: 'quadratic', a: 1, b: 0, c: 0 };

/** Visual constants */
const BLUE = '#3b82f6';
const AMBER = '#f59e0b';
const RED = '#ef4444';

/** Preset configurations */
const PRESETS: { label: string; x: number; h: number }[] = [
  { label: 'x=0, h=1', x: 0, h: 1 },
  { label: 'x=2, h=1', x: 2, h: 1 },
  { label: 'x=2, h=0.1', x: 2, h: 0.1 },
  { label: 'x=-1, h=2', x: -1, h: 2 },
  { label: 'x=3, h=0.5', x: 3, h: 0.5 },
  { label: 'x=0, h=0.1', x: 0, h: 0.1 },
];

interface TangentTrackerLabProps {
  experiment: Experiment;
}

export default function TangentTrackerLab({
  experiment,
}: TangentTrackerLabProps) {
  const bounds: Bounds = DEFAULT_BOUNDS;

  // --- State ---
  const initial = experiment.scene.initialState;
  const [x, setX] = useState(
    typeof initial.x === 'number' ? initial.x : 2
  );
  const [h, setH] = useState(
    typeof initial.h === 'number' ? Math.max(initial.h, 0.1) : 1
  );

  // --- Derived ---
  const xB = x + h;

  // Secant data (average rate of change between x and x+h)
  const secantResult = useMemo(
    () => averageRateOfChange(FIXED_PARAMS, x, xB),
    [x, xB]
  );

  // Derivative (tangent slope) at x
  const derivResult = useMemo(
    () => derivativeAtPoint(FIXED_PARAMS, x),
    [x]
  );

  // Equation LaTeX
  const equationLatex = useMemo(
    () => formatEquationLatex(FIXED_PARAMS),
    []
  );

  // Slope difference
  const slopeDifference = useMemo(() => {
    if (secantResult.rate === null) return null;
    return Math.abs(secantResult.rate - derivResult.slope);
  }, [secantResult.rate, derivResult.slope]);

  // Is B out of bounds?
  const bOutOfBounds = xB < bounds.xMin || xB > bounds.xMax;

  // Show proximity hint when h is small
  const showProximityHint = h < 0.5;

  // SVG positions for x-axis labels
  const xSvg = useMemo(
    () => mathToSvg({ x, y: bounds.yMin }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD),
    [x, bounds]
  );
  const xBSvg = useMemo(
    () => mathToSvg({ x: xB, y: bounds.yMin }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD),
    [xB, bounds]
  );
  const hMidSvg = useMemo(
    () => mathToSvg({ x: x + h / 2, y: bounds.yMin }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD),
    [x, h, bounds]
  );

  // --- Handlers ---
  const applyPreset = useCallback((p: { x: number; h: number }) => {
    setX(p.x);
    setH(p.h);
  }, []);

  const isPresetActive = useCallback(
    (p: { x: number; h: number }) => p.x === x && p.h === h,
    [x, h]
  );

  // --- Result panel ---
  const resultPanel = (
    <div className="space-y-5">
      {/* Current equation */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <p className="text-xs text-blue-600 mb-1">当前函数</p>
        <FormulaDisplay formula={equationLatex} className="text-xl" />
      </div>

      {/* Two curve points */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-xs text-blue-600 mb-1">点 A（切点）</p>
          <p className="text-xl font-mono font-bold text-blue-800">
            ({fmtNum(x)}, {fmtNum(secantResult.pointA.y)})
          </p>
        </div>
        <div className={`p-4 border rounded-lg text-center ${bOutOfBounds ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
          <p className={`text-xs mb-1 ${bOutOfBounds ? 'text-red-600' : 'text-amber-600'}`}>点 B（附近点）</p>
          <p className={`text-xl font-mono font-bold ${bOutOfBounds ? 'text-red-800' : 'text-amber-800'}`}>
            ({fmtNum(xB)}, {fmtNum(secantResult.pointB.y)})
          </p>
          {bOutOfBounds && (
            <p className="text-xs text-red-500 mt-1">超出当前视窗</p>
          )}
        </div>
      </div>

      {/* Slope comparison */}
      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
        <div className="space-y-3">
          {/* Secant slope */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-600">割线斜率（平均变化率）</span>
            <span className="text-lg font-mono font-bold text-stone-800">
              {secantResult.rateFormatted}
            </span>
          </div>

          {/* Tangent slope */}
          <div className="flex items-center justify-between border-t border-stone-200 pt-3">
            <span className="text-sm text-red-600 font-medium">切线斜率（瞬时变化率）</span>
            <span className="text-lg font-mono font-bold text-red-700">
              {derivResult.slopeFormatted}
            </span>
          </div>

          {/* Difference */}
          {slopeDifference !== null && (
            <div className="flex items-center justify-between border-t border-stone-200 pt-3">
              <span className="text-sm text-stone-500">|割线 - 切线|</span>
              <span className={`text-lg font-mono font-bold ${slopeDifference < 0.1 ? 'text-green-600' : 'text-stone-700'}`}>
                {fmtNum(slopeDifference)}
              </span>
            </div>
          )}
        </div>

        {/* Derivative formula */}
        <div className="border-t border-stone-200 pt-3 mt-3">
          <p className="text-sm text-stone-600 mb-2">导数公式</p>
          <div className="text-center">
            <FormulaDisplay
              formula={derivResult.formulaLatex}
              className="text-lg"
            />
          </div>
        </div>
      </div>

      {/* h proximity hint */}
      {showProximityHint && (
        <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg">
          <h4 className="text-sm font-medium text-violet-800 mb-2">
            割线正在逼近切线！
          </h4>
          <p className="text-sm text-violet-700">
            当 h = {fmtNum(h)} 时，割线斜率 = {secantResult.rateFormatted}，
            切线斜率 = {derivResult.slopeFormatted}，
            差值仅为 {slopeDifference !== null ? fmtNum(slopeDifference) : '—'}。
            h 越小，割线越接近切线——这就是极限的直觉！
          </p>
        </div>
      )}

      {/* B out of bounds */}
      {bOutOfBounds && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            点 B (x+h = {fmtNum(xB)}) 超出当前视窗范围 [{bounds.xMin}, {bounds.xMax}]。
            数学计算仍然正确，但 SVG 中可能看不到点 B。
            试试减小 h 或调整 x。
          </p>
        </div>
      )}

      {/* Linear special case */}
      {FIXED_PARAMS.type === 'linear' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            线性函数的切线就是函数本身，割线斜率始终等于切线斜率。
          </p>
        </div>
      )}

      {/* Historical connection */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-sm font-medium text-green-800 mb-2">
          从割线到切线
        </h4>
        <p className="text-sm text-green-700">
          牛顿发现，当时间间隔 h 趋近于 0 时，平均速度（割线斜率）趋近于瞬时速度（切线斜率）。
          对 y = x²，切线斜率 = 2x——斜率本身也是 x 的函数，这就是导数。
        </p>
      </div>
    </div>
  );

  return (
    <ExperimentContainer experiment={experiment} resultPanel={resultPanel}>
      {/* Sliders */}
      <div className="px-6 py-4 bg-white border-b border-stone-100 space-y-3">
        <div className="flex items-center gap-4">
          <label className="text-sm text-blue-600 w-28 shrink-0 font-medium">
            x（切点位置）
          </label>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.1}
            value={x}
            onChange={(e) => setX(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-sm font-mono font-semibold text-blue-800 w-14 text-right">
            {fmtNum(x)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-amber-600 w-28 shrink-0 font-medium">
            h（间隔）
          </label>
          <input
            type="range"
            min={0.1}
            max={5}
            step={0.1}
            value={h}
            onChange={(e) => setH(Math.max(parseFloat(e.target.value), 0.1))}
            className="flex-1 h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <span className="text-sm font-mono font-semibold text-amber-800 w-14 text-right">
            {fmtNum(h)}
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${DEFAULT_SVG_W} ${DEFAULT_SVG_H}`}
        className="w-full h-auto"
        style={{ touchAction: 'none' }}
      >
        {/* Background */}
        <rect
          width={DEFAULT_SVG_W}
          height={DEFAULT_SVG_H}
          fill="#fafaf9"
        />

        {/* Title */}
        <text
          x={DEFAULT_SVG_W / 2}
          y={22}
          textAnchor="middle"
          fontSize="15"
          fontWeight="600"
          fill="#44403c"
        >
          切线追踪器
        </text>

        {/* Coordinate grid */}
        <CoordinateGrid
          bounds={bounds}
          svgW={DEFAULT_SVG_W}
          svgH={DEFAULT_SVG_H}
          pad={DEFAULT_PAD}
        />

        {/* Function curve */}
        <FunctionCurve
          params={FIXED_PARAMS}
          bounds={bounds}
          svgW={DEFAULT_SVG_W}
          svgH={DEFAULT_SVG_H}
          pad={DEFAULT_PAD}
          stroke={BLUE}
          strokeWidth={2.5}
        />

        {/* Secant line (A to B) with delta triangle */}
        <SecantLine
          pointA={secantResult.pointA}
          pointB={secantResult.pointB}
          bounds={bounds}
          svgW={DEFAULT_SVG_W}
          svgH={DEFAULT_SVG_H}
          pad={DEFAULT_PAD}
          lineColor="#a8a29e"
          pointAColor={BLUE}
          pointBColor={AMBER}
          showDeltaTriangle={true}
          showLabels={true}
        />

        {/* Tangent line at A */}
        <TangentLine
          point={derivResult}
          slope={derivResult.slope}
          bounds={bounds}
          svgW={DEFAULT_SVG_W}
          svgH={DEFAULT_SVG_H}
          pad={DEFAULT_PAD}
          lineColor={RED}
          pointColor={RED}
          showPoint={false}
          showLabel={false}
        />

        {/* x label below x-axis */}
        <text
          x={xSvg.x}
          y={xSvg.y + 20}
          textAnchor="middle"
          fontSize={12}
          fontWeight={600}
          fill={BLUE}
        >
          x={fmtNum(x)}
        </text>

        {/* x+h label below x-axis */}
        {!bOutOfBounds && (
          <text
            x={xBSvg.x}
            y={xBSvg.y + 20}
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
            fill={AMBER}
          >
            x+h={fmtNum(xB)}
          </text>
        )}

        {/* h bracket between x and x+h */}
        {!bOutOfBounds && Math.abs(xBSvg.x - xSvg.x) > 30 && (
          <g>
            <line
              x1={xSvg.x}
              y1={xSvg.y + 28}
              x2={xBSvg.x}
              y2={xBSvg.y + 28}
              stroke="#78716c"
              strokeWidth={1}
            />
            <line
              x1={xSvg.x}
              y1={xSvg.y + 25}
              x2={xSvg.x}
              y2={xSvg.y + 31}
              stroke="#78716c"
              strokeWidth={1}
            />
            <line
              x1={xBSvg.x}
              y1={xBSvg.y + 25}
              x2={xBSvg.x}
              y2={xBSvg.y + 31}
              stroke="#78716c"
              strokeWidth={1}
            />
            <text
              x={hMidSvg.x}
              y={hMidSvg.y + 40}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill="#78716c"
            >
              h={fmtNum(h)}
            </text>
          </g>
        )}

        {/* Legend */}
        <g transform={`translate(${DEFAULT_SVG_W - 180}, 40)`}>
          <rect x={0} y={0} width={160} height={72} rx={4} fill="white" fillOpacity={0.9} stroke="#e7e5e4" />
          <line x1={8} y1={14} x2={30} y2={14} stroke={BLUE} strokeWidth={2.5} />
          <text x={36} y={18} fontSize={11} fill="#44403c">函数曲线</text>
          <line x1={8} y1={32} x2={30} y2={32} stroke="#a8a29e" strokeWidth={2} />
          <text x={36} y={36} fontSize={11} fill="#44403c">割线 AB（平均变化率）</text>
          <line x1={8} y1={50} x2={30} y2={50} stroke={RED} strokeWidth={2.5} />
          <text x={36} y={54} fontSize={11} fill="#44403c">切线（瞬时变化率）</text>
        </g>

        {/* Instructions */}
        <text
          x={DEFAULT_SVG_W / 2}
          y={DEFAULT_SVG_H - 8}
          textAnchor="middle"
          fontSize={11}
          fill="#a8a29e"
        >
          调整 x 和 h · 观察 h 变小时割线如何逼近切线
        </text>
      </svg>

      {/* Preset buttons */}
      <div className="px-6 py-4 bg-white border-t border-stone-100">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-stone-500 shrink-0">预设</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                isPresetActive(p)
                  ? 'bg-red-600 text-white border-red-600'
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

function fmtNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(2)).toString();
}
