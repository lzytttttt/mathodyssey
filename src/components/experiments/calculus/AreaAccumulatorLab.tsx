'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Experiment } from '@/types/timeline';
import ExperimentContainer from '../ExperimentContainer';
import FormulaDisplay from '@/components/math/FormulaDisplay';
import CoordinateGrid from '../coordinate/CoordinateGrid';
import FunctionCurve from '../function/FunctionCurve';
import AreaUnderCurve from './AreaUnderCurve';
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
  riemannSum,
  formatIntegralLatex,
} from '@/lib/math/calculus';
import type { RiemannMethod } from '@/lib/math/calculus';

/** Fixed function: y = x² + 1 */
const FIXED_PARAMS: FunctionParams = { type: 'quadratic', a: 1, b: 0, c: 1 };

/** Visual constants */
const BLUE = '#3b82f6';

/** Preset configurations */
const PRESETS: { label: string; a: number; b: number; n: number; method: RiemannMethod }[] = [
  { label: '[0,3] n=4 left', a: 0, b: 3, n: 4, method: 'left' },
  { label: '[0,3] n=4 right', a: 0, b: 3, n: 4, method: 'right' },
  { label: '[0,3] n=16 left', a: 0, b: 3, n: 16, method: 'left' },
  { label: '[0,3] n=64 left', a: 0, b: 3, n: 64, method: 'left' },
  { label: '[-2,2] n=8 mid', a: -2, b: 2, n: 8, method: 'midpoint' },
  { label: '[1,4] n=10 right', a: 1, b: 4, n: 10, method: 'right' },
];

interface AreaAccumulatorLabProps {
  experiment: Experiment;
}

export default function AreaAccumulatorLab({
  experiment,
}: AreaAccumulatorLabProps) {
  const bounds: Bounds = DEFAULT_BOUNDS;

  // --- State ---
  const initial = experiment.scene.initialState;
  const [rangeA, setRangeA] = useState(
    typeof initial.rangeA === 'number' ? initial.rangeA : 0
  );
  const [rangeB, setRangeB] = useState(
    typeof initial.rangeB === 'number' ? initial.rangeB : 3
  );
  const [n, setN] = useState(
    typeof initial.n === 'number' ? Math.max(initial.n, 4) : 8
  );
  const [method, setMethod] = useState<RiemannMethod>(
    initial.method === 'right' || initial.method === 'midpoint'
      ? initial.method
      : 'left'
  );

  // --- Derived ---
  const result = useMemo(
    () => riemannSum(FIXED_PARAMS, rangeA, rangeB, n, method),
    [rangeA, rangeB, n, method]
  );

  const equationLatex = useMemo(
    () => formatEquationLatex(FIXED_PARAMS),
    []
  );

  const integralLatex = useMemo(
    () => formatIntegralLatex(FIXED_PARAMS, rangeA, rangeB, result.exact),
    [rangeA, rangeB, result.exact]
  );

  const isZeroInterval = rangeA === rangeB;
  const showConvergenceHint = result.n >= 20 && !isZeroInterval;

  // SVG positions for interval labels
  const aSvg = useMemo(
    () => mathToSvg({ x: rangeA, y: bounds.yMin }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD),
    [rangeA, bounds]
  );
  const bSvg = useMemo(
    () => mathToSvg({ x: rangeB, y: bounds.yMin }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD),
    [rangeB, bounds]
  );

  // --- Handlers ---
  const applyPreset = useCallback(
    (p: { a: number; b: number; n: number; method: RiemannMethod }) => {
      setRangeA(p.a);
      setRangeB(p.b);
      setN(p.n);
      setMethod(p.method);
    },
    []
  );

  const isPresetActive = useCallback(
    (p: { a: number; b: number; n: number; method: RiemannMethod }) =>
      p.a === rangeA && p.b === rangeB && p.n === n && p.method === method,
    [rangeA, rangeB, n, method]
  );

  // --- Result panel ---
  const resultPanel = (
    <div className="space-y-5">
      {/* Current equation */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <p className="text-xs text-blue-600 mb-1">当前函数</p>
        <FormulaDisplay formula={equationLatex} className="text-xl" />
      </div>

      {/* Interval and method info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-center">
          <p className="text-xs text-stone-500 mb-1">区间</p>
          <p className="text-lg font-mono font-bold text-stone-800">
            [{fmtNum(rangeA)}, {fmtNum(rangeB)}]
          </p>
        </div>
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-center">
          <p className="text-xs text-stone-500 mb-1">矩形数</p>
          <p className="text-lg font-mono font-bold text-stone-800">{result.n}</p>
        </div>
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-center">
          <p className="text-xs text-stone-500 mb-1">采样方法</p>
          <p className="text-lg font-mono font-bold text-stone-800">
            {method === 'left' ? '左端点' : method === 'right' ? '右端点' : '中点'}
          </p>
        </div>
      </div>

      {/* Swapped notice */}
      {result.swapped && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700">
            区间已按从小到大计算面积（a &gt; b 时自动交换）
          </p>
        </div>
      )}

      {/* Area comparison */}
      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
        <div className="space-y-3">
          {/* Riemann sum */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-600">矩形面积之和（黎曼和）</span>
            <span className="text-lg font-mono font-bold text-blue-700">
              {result.sumFormatted}
            </span>
          </div>

          {/* Exact integral */}
          <div className="flex items-center justify-between border-t border-stone-200 pt-3">
            <span className="text-sm text-green-600 font-medium">精确积分值</span>
            <span className="text-lg font-mono font-bold text-green-700">
              {result.exactFormatted}
            </span>
          </div>

          {/* Error */}
          <div className="flex items-center justify-between border-t border-stone-200 pt-3">
            <span className="text-sm text-stone-500">|近似 - 精确|</span>
            <span className={`text-lg font-mono font-bold ${result.error < 0.1 ? 'text-green-600' : 'text-stone-700'}`}>
              {result.errorFormatted}
              <span className="text-xs text-stone-400 ml-2">({result.errorPercent})</span>
            </span>
          </div>
        </div>

        {/* Integral formula */}
        <div className="border-t border-stone-200 pt-3 mt-3">
          <p className="text-sm text-stone-600 mb-2">积分表达式</p>
          <div className="text-center">
            <FormulaDisplay formula={integralLatex} className="text-lg" />
          </div>
        </div>
      </div>

      {/* Convergence hint */}
      {showConvergenceHint && (
        <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg">
          <h4 className="text-sm font-medium text-violet-800 mb-2">
            矩形和正在逼近真实面积！
          </h4>
          <p className="text-sm text-violet-700">
            当 n = {result.n} 时，矩形面积之和 = {result.sumFormatted}，
            精确值 = {result.exactFormatted}，
            误差仅为 {result.errorFormatted}。
            n 越大，矩形越窄，逼近越准——这就是积分的直觉！
          </p>
        </div>
      )}

      {/* Zero interval */}
      {isZeroInterval && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            区间长度为 0，面积为 0。试试把 a 或 b 移开一点。
          </p>
        </div>
      )}

      {/* Historical connection */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-sm font-medium text-green-800 mb-2">
          从矩形到积分
        </h4>
        <p className="text-sm text-green-700">
          阿基米德用多边形逼近圆的面积，牛顿和莱布尼茨用矩形逼近曲线下面积。
          当矩形数量趋向无穷、宽度趋向 0 时，矩形面积之和趋向精确面积——这就是定积分的定义。
          对 y = x² + 1，精确积分可以用反导数计算：F(x) = x³/3 + x。
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
            a（区间起点）
          </label>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.5}
            value={rangeA}
            onChange={(e) => setRangeA(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-sm font-mono font-semibold text-blue-800 w-14 text-right">
            {fmtNum(rangeA)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-blue-600 w-28 shrink-0 font-medium">
            b（区间终点）
          </label>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.5}
            value={rangeB}
            onChange={(e) => setRangeB(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-sm font-mono font-semibold text-blue-800 w-14 text-right">
            {fmtNum(rangeB)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-amber-600 w-28 shrink-0 font-medium">
            n（矩形数量）
          </label>
          <input
            type="range"
            min={4}
            max={80}
            step={1}
            value={n}
            onChange={(e) => setN(parseInt(e.target.value, 10))}
            className="flex-1 h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <span className="text-sm font-mono font-semibold text-amber-800 w-14 text-right">
            {n}
          </span>
        </div>
      </div>

      {/* Method toggle */}
      <div className="px-6 py-3 bg-white border-b border-stone-100">
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 shrink-0">采样方法</span>
          {(['left', 'right', 'midpoint'] as RiemannMethod[]).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`px-4 py-1.5 text-sm rounded-lg border transition-colors ${
                method === m
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              {m === 'left' ? '左端点' : m === 'right' ? '右端点' : '中点'}
            </button>
          ))}
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
          面积累积器
        </text>

        {/* Coordinate grid */}
        <CoordinateGrid
          bounds={bounds}
          svgW={DEFAULT_SVG_W}
          svgH={DEFAULT_SVG_H}
          pad={DEFAULT_PAD}
        />

        {/* Riemann rectangles + sample points */}
        {!isZeroInterval && (
          <AreaUnderCurve
            rectangles={result.rectangles}
            bounds={bounds}
            svgW={DEFAULT_SVG_W}
            svgH={DEFAULT_SVG_H}
            pad={DEFAULT_PAD}
          />
        )}

        {/* Function curve (on top of rectangles) */}
        <FunctionCurve
          params={FIXED_PARAMS}
          bounds={bounds}
          svgW={DEFAULT_SVG_W}
          svgH={DEFAULT_SVG_H}
          pad={DEFAULT_PAD}
          stroke={BLUE}
          strokeWidth={2.5}
        />

        {/* Interval markers: dashed vertical lines at a and b */}
        {!isZeroInterval && (
          <>
            {/* a marker */}
            <line
              x1={aSvg.x}
              y1={aSvg.y}
              x2={aSvg.x}
              y2={mathToSvg({ x: rangeA, y: bounds.yMax }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD).y}
              stroke="#78716c"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <text
              x={aSvg.x}
              y={aSvg.y + 20}
              textAnchor="middle"
              fontSize={12}
              fontWeight={600}
              fill="#78716c"
            >
              a={fmtNum(rangeA)}
            </text>

            {/* b marker */}
            <line
              x1={bSvg.x}
              y1={bSvg.y}
              x2={bSvg.x}
              y2={mathToSvg({ x: rangeB, y: bounds.yMax }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD).y}
              stroke="#78716c"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <text
              x={bSvg.x}
              y={bSvg.y + 20}
              textAnchor="middle"
              fontSize={12}
              fontWeight={600}
              fill="#78716c"
            >
              b={fmtNum(rangeB)}
            </text>
          </>
        )}

        {/* Legend */}
        <g transform={`translate(${DEFAULT_SVG_W - 200}, 40)`}>
          <rect x={0} y={0} width={185} height={56} rx={4} fill="white" fillOpacity={0.9} stroke="#e7e5e4" />
          <rect x={8} y={8} width={18} height={12} fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" strokeWidth={1} />
          <text x={32} y={18} fontSize={11} fill="#44403c">黎曼矩形（近似面积）</text>
          <circle cx={17} cy={38} r={3} fill="#1d4ed8" stroke="white" strokeWidth={1} />
          <text x={32} y={42} fontSize={11} fill="#44403c">采样点（高度取自此处）</text>
        </g>

        {/* Instructions */}
        <text
          x={DEFAULT_SVG_W / 2}
          y={DEFAULT_SVG_H - 8}
          textAnchor="middle"
          fontSize={11}
          fill="#a8a29e"
        >
          调整 a、b、n · 观察矩形面积如何逼近真实面积
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
                  ? 'bg-blue-600 text-white border-blue-600'
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
