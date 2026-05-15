'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Experiment } from '@/types/timeline';
import ExperimentContainer from '../ExperimentContainer';
import FormulaDisplay from '@/components/math/FormulaDisplay';
import CoordinateGrid from '../coordinate/CoordinateGrid';
import FunctionCurve from '../function/FunctionCurve';
import SecantLine from './SecantLine';
import {
  DEFAULT_BOUNDS,
  DEFAULT_SVG_W,
  DEFAULT_SVG_H,
  DEFAULT_PAD,
  mathToSvg,
} from '@/lib/math/coordinate';
import type { Bounds } from '@/lib/math/coordinate';
import type { FunctionType, FunctionParams } from '@/lib/math/functions';
import { formatEquationLatex } from '@/lib/math/functions';
import {
  averageRateOfChange,
  isValidInterval,
} from '@/lib/math/calculus';

/** Visual constants */
const BLUE = '#3b82f6';

/** Default parameters for each function type */
const DEFAULTS: Record<FunctionType, FunctionParams> = {
  linear: { type: 'linear', m: 2, b: 1 },
  quadratic: { type: 'quadratic', a: 1, b: 0, c: 0 },
};

/** Preset configurations */
const PRESETS: { label: string; params: FunctionParams; x1: number; x2: number }[] = [
  { label: 'y=x² [-1,3]', params: { type: 'quadratic', a: 1, b: 0, c: 0 }, x1: -1, x2: 3 },
  { label: 'y=x² [1,3]', params: { type: 'quadratic', a: 1, b: 0, c: 0 }, x1: 1, x2: 3 },
  { label: 'y=x² [-2,2]', params: { type: 'quadratic', a: 1, b: 0, c: 0 }, x1: -2, x2: 2 },
  { label: 'y=2x+1 [0,4]', params: { type: 'linear', m: 2, b: 1 }, x1: 0, x2: 4 },
];

interface AverageRateLabProps {
  experiment: Experiment;
}

export default function AverageRateLab({
  experiment,
}: AverageRateLabProps) {
  const bounds: Bounds = DEFAULT_BOUNDS;

  // --- State ---
  const initial = experiment.scene.initialState;
  const [funcType, setFuncType] = useState<FunctionType>(
    initial.functionType === 'linear' ? 'linear' : 'quadratic'
  );
  const [params, setParams] = useState<FunctionParams>(() => {
    if (initial.functionType === 'linear') {
      return {
        type: 'linear',
        m: typeof initial.m === 'number' ? initial.m : 2,
        b: typeof initial.b === 'number' ? initial.b : 1,
      };
    }
    return {
      type: 'quadratic',
      a: typeof initial.a === 'number' ? initial.a : 1,
      b: typeof initial.b === 'number' ? initial.b : 0,
      c: typeof initial.c === 'number' ? initial.c : 0,
    };
  });
  const [x1, setX1] = useState(
    typeof initial.x1 === 'number' ? initial.x1 : -1
  );
  const [x2, setX2] = useState(
    typeof initial.x2 === 'number' ? initial.x2 : 3
  );

  // --- Derived ---
  const valid = useMemo(() => isValidInterval(x1, x2), [x1, x2]);
  const result = useMemo(
    () => averageRateOfChange(params, x1, x2),
    [params, x1, x2]
  );
  const equationLatex = useMemo(
    () => formatEquationLatex(params),
    [params]
  );

  // --- SVG positions for x-axis labels ---
  const x1Svg = useMemo(
    () => mathToSvg({ x: x1, y: bounds.yMin }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD),
    [x1, bounds]
  );
  const x2Svg = useMemo(
    () => mathToSvg({ x: x2, y: bounds.yMin }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD),
    [x2, bounds]
  );

  // --- Handlers ---
  const switchType = useCallback((t: FunctionType) => {
    setFuncType(t);
    setParams(DEFAULTS[t]);
  }, []);

  const updateParam = useCallback(
    (name: string, value: number) => {
      setParams((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const applyPreset = useCallback(
    (p: { params: FunctionParams; x1: number; x2: number }) => {
      setFuncType(p.params.type);
      setParams(p.params);
      setX1(p.x1);
      setX2(p.x2);
    },
    []
  );

  // --- Parameter sliders ---
  const sliderDefs = useMemo(() => {
    if (funcType === 'linear') {
      return [
        { name: 'm', label: 'm（斜率）', min: -5, max: 5, step: 0.1 },
        { name: 'b', label: 'b（截距）', min: -8, max: 8, step: 0.5 },
      ];
    }
    return [
      { name: 'a', label: 'a（开口）', min: -3, max: 3, step: 0.1 },
      { name: 'b', label: 'b（对称轴）', min: -8, max: 8, step: 0.5 },
      { name: 'c', label: 'c（截距）', min: -8, max: 8, step: 0.5 },
    ];
  }, [funcType]);

  // --- Is current preset active ---
  const isPresetActive = useCallback(
    (preset: { params: FunctionParams; x1: number; x2: number }) => {
      if (preset.params.type !== params.type) return false;
      if (preset.x1 !== x1 || preset.x2 !== x2) return false;
      if (preset.params.type === 'linear' && params.type === 'linear') {
        return preset.params.m === params.m && preset.params.b === params.b;
      }
      if (preset.params.type === 'quadratic' && params.type === 'quadratic') {
        return (
          preset.params.a === params.a &&
          preset.params.b === params.b &&
          preset.params.c === params.c
        );
      }
      return false;
    },
    [params, x1, x2]
  );

  // --- Proximity hint ---
  const showProximityHint = valid && Math.abs(x2 - x1) < 1;

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
          <p className="text-xs text-blue-600 mb-1">点 A</p>
          <p className="text-xl font-mono font-bold text-blue-800">
            ({fmtNum(x1)}, {fmtNum(result.pointA.y)})
          </p>
        </div>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <p className="text-xs text-amber-600 mb-1">点 B</p>
          <p className="text-xl font-mono font-bold text-amber-800">
            ({fmtNum(x2)}, {fmtNum(result.pointB.y)})
          </p>
        </div>
      </div>

      {/* Deltas */}
      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
          <div>
            <span className="text-blue-600 font-medium">Δx = </span>
            <span className="font-mono font-semibold text-stone-800">
              {fmtNum(x2)} - ({fmtNum(x1)}) = <strong>{fmtNum(result.deltaX)}</strong>
            </span>
          </div>
          <div>
            <span className="text-amber-600 font-medium">Δy = </span>
            <span className="font-mono font-semibold text-stone-800">
              {fmtNum(result.pointB.y)} - {fmtNum(result.pointA.y)} = <strong>{fmtNum(result.deltaY)}</strong>
            </span>
          </div>
        </div>

        {/* Average rate of change formula */}
        <div className="border-t border-stone-200 pt-3">
          <p className="text-sm text-stone-600 mb-2">平均变化率（割线斜率）</p>
          <div className="text-center">
            <FormulaDisplay
              formula={`m = ${result.formulaLatex}`}
              className="text-lg"
            />
          </div>
        </div>
      </div>

      {/* Proximity hint */}
      {showProximityHint && (
        <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg">
          <h4 className="text-sm font-medium text-violet-800 mb-2">
            逼近切线
          </h4>
          <p className="text-sm text-violet-700">
            当前区间宽度 = {fmtNum(Math.abs(x2 - x1))}，割线斜率 = {result.rateFormatted}。
            试试让 x₂ 更接近 x₁，观察割线如何趋近切线。
            这就是从「平均变化率」到「瞬时变化率」的桥梁。
          </p>
        </div>
      )}

      {/* Degenerate case */}
      {!valid && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            区间长度为 0，平均变化率未定义。试试把 x₂ 移开一点。
          </p>
        </div>
      )}

      {/* Historical connection */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-sm font-medium text-green-800 mb-2">
          从割线到切线
        </h4>
        <p className="text-sm text-green-700">
          割线连接曲线上两个点，它的斜率表示函数在这段区间上的平均变化率。
          当两点无限接近时，割线变成切线——这就是导数的直觉来源。
          牛顿正是通过这个思路，发明了微积分。
        </p>
      </div>
    </div>
  );

  return (
    <ExperimentContainer experiment={experiment} resultPanel={resultPanel}>
      {/* Function type toggle */}
      <div className="px-6 py-4 bg-white border-b border-stone-100">
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 shrink-0">函数类型</span>
          <button
            onClick={() => switchType('linear')}
            className={`px-4 py-1.5 text-sm rounded-lg border transition-colors ${
              funcType === 'linear'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            线性 y = mx + b
          </button>
          <button
            onClick={() => switchType('quadratic')}
            className={`px-4 py-1.5 text-sm rounded-lg border transition-colors ${
              funcType === 'quadratic'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            二次 y = ax² + bx + c
          </button>
        </div>
      </div>

      {/* Parameter sliders */}
      <div className="px-6 py-4 bg-white border-b border-stone-100 space-y-3">
        {sliderDefs.map((s) => {
          const val =
            params.type === 'linear'
              ? (params as { m: number; b: number })[s.name as 'm' | 'b']
              : (params as { a: number; b: number; c: number })[
                  s.name as 'a' | 'b' | 'c'
                ];
          return (
            <div key={s.name} className="flex items-center gap-4">
              <label className="text-sm text-stone-600 w-28 shrink-0">
                {s.label}
              </label>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={val}
                onChange={(e) =>
                  updateParam(s.name, parseFloat(e.target.value))
                }
                className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-sm font-mono font-semibold text-stone-800 w-14 text-right">
                {fmtNum(val)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Interval sliders */}
      <div className="px-6 py-4 bg-white border-b border-stone-100 space-y-3">
        <div className="flex items-center gap-4">
          <label className="text-sm text-blue-600 w-28 shrink-0 font-medium">
            x₁（左端点）
          </label>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.5}
            value={x1}
            onChange={(e) => setX1(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-sm font-mono font-semibold text-blue-800 w-14 text-right">
            {fmtNum(x1)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-amber-600 w-28 shrink-0 font-medium">
            x₂（右端点）
          </label>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.5}
            value={x2}
            onChange={(e) => setX2(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <span className="text-sm font-mono font-semibold text-amber-800 w-14 text-right">
            {fmtNum(x2)}
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
          平均变化率实验室
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
          params={params}
          bounds={bounds}
          svgW={DEFAULT_SVG_W}
          svgH={DEFAULT_SVG_H}
          pad={DEFAULT_PAD}
          stroke={BLUE}
          strokeWidth={2.5}
        />

        {/* Secant line + delta triangle + points */}
        {valid && (
          <SecantLine
            pointA={result.pointA}
            pointB={result.pointB}
            bounds={bounds}
            svgW={DEFAULT_SVG_W}
            svgH={DEFAULT_SVG_H}
            pad={DEFAULT_PAD}
          />
        )}

        {/* Coincident point (x1 = x2) */}
        {!valid && (
          <g>
            <circle
              cx={mathToSvg(result.pointA, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD).x}
              cy={mathToSvg(result.pointA, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD).y}
              r={6}
              fill={BLUE}
              stroke="white"
              strokeWidth={2}
            />
            <text
              x={mathToSvg(result.pointA, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD).x + 10}
              y={mathToSvg(result.pointA, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD).y - 12}
              textAnchor="start"
              fontSize={12}
              fontWeight={600}
              fill={BLUE}
            >
              ({fmtNum(result.pointA.x)}, {fmtNum(result.pointA.y)})
            </text>
          </g>
        )}

        {/* x1 label below x-axis */}
        <text
          x={x1Svg.x}
          y={x1Svg.y + 20}
          textAnchor="middle"
          fontSize={12}
          fontWeight={600}
          fill="#3b82f6"
        >
          x₁={fmtNum(x1)}
        </text>

        {/* x2 label below x-axis */}
        {x2 !== x1 && (
          <text
            x={x2Svg.x}
            y={x2Svg.y + 20}
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
            fill="#f59e0b"
          >
            x₂={fmtNum(x2)}
          </text>
        )}

        {/* Instructions */}
        <text
          x={DEFAULT_SVG_W / 2}
          y={DEFAULT_SVG_H - 8}
          textAnchor="middle"
          fontSize={11}
          fill="#a8a29e"
        >
          调整 x₁ 和 x₂ · 观察割线斜率如何变化
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

function fmtNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(2)).toString();
}
