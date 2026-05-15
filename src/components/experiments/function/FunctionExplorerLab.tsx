'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Experiment } from '@/types/timeline';
import ExperimentContainer from '../ExperimentContainer';
import FormulaDisplay from '@/components/math/FormulaDisplay';
import CoordinateGrid from '../coordinate/CoordinateGrid';
import FunctionCurve from './FunctionCurve';
import {
  DEFAULT_BOUNDS,
  DEFAULT_SVG_W,
  DEFAULT_SVG_H,
  DEFAULT_PAD,
  mathToSvg,
} from '@/lib/math/coordinate';
import type { Bounds } from '@/lib/math/coordinate';
import type { FunctionType, FunctionParams } from '@/lib/math/functions';
import {
  findFunctionFeatures,
  formatEquationLatex,
  describeParameter,
} from '@/lib/math/functions';

/** Visual constants */
const BLUE = '#3b82f6';
const RED = '#ef4444';
const GREEN = '#10b981';
const PURPLE = '#8b5cf6';

/** Default parameters for each function type */
const DEFAULTS: Record<FunctionType, FunctionParams> = {
  linear: { type: 'linear', m: 2, b: 1 },
  quadratic: { type: 'quadratic', a: 1, b: 0, c: 0 },
};

/** Preset configurations */
const PRESETS: { label: string; params: FunctionParams }[] = [
  { label: 'y = 2x + 1', params: { type: 'linear', m: 2, b: 1 } },
  { label: 'y = -x + 4', params: { type: 'linear', m: -1, b: 4 } },
  { label: 'y = x²', params: { type: 'quadratic', a: 1, b: 0, c: 0 } },
  { label: 'y = -x² + 4', params: { type: 'quadratic', a: -1, b: 0, c: 4 } },
];

interface FunctionExplorerLabProps {
  experiment: Experiment;
}

export default function FunctionExplorerLab({
  experiment,
}: FunctionExplorerLabProps) {
  const bounds: Bounds = DEFAULT_BOUNDS;

  // --- State ---
  const initial = experiment.scene.initialState;
  const [funcType, setFuncType] = useState<FunctionType>(
    initial.functionType === 'quadratic' ? 'quadratic' : 'linear'
  );
  const [params, setParams] = useState<FunctionParams>(() => {
    if (initial.functionType === 'quadratic') {
      return {
        type: 'quadratic',
        a: typeof initial.a === 'number' ? initial.a : 1,
        b: typeof initial.b === 'number' ? initial.b : 0,
        c: typeof initial.c === 'number' ? initial.c : 0,
      };
    }
    return {
      type: 'linear',
      m: typeof initial.m === 'number' ? initial.m : 2,
      b: typeof initial.b === 'number' ? (initial.b as number) : 1,
    };
  });

  // --- Derived ---
  const features = useMemo(() => findFunctionFeatures(params), [params]);
  const equationLatex = useMemo(
    () => formatEquationLatex(params),
    [params]
  );

  // --- Clamped feature points within bounds ---
  const visibleZeros = useMemo(
    () =>
      features.zeros.filter(
        (x) => x >= bounds.xMin && x <= bounds.xMax
      ),
    [features.zeros, bounds]
  );

  const yInterceptVisible =
    features.yIntercept >= bounds.yMin &&
    features.yIntercept <= bounds.yMax;

  const vertexVisible =
    features.vertex !== undefined &&
    features.vertex.x >= bounds.xMin &&
    features.vertex.x <= bounds.xMax &&
    features.vertex.y >= bounds.yMin &&
    features.vertex.y <= bounds.yMax;

  // --- SVG positions for feature markers ---
  const zeroSvgs = useMemo(
    () =>
      visibleZeros.map((x) =>
        mathToSvg({ x, y: 0 }, bounds, DEFAULT_SVG_W, DEFAULT_SVG_H, DEFAULT_PAD)
      ),
    [visibleZeros, bounds]
  );

  const yInterceptSvg = useMemo(
    () =>
      mathToSvg(
        { x: 0, y: features.yIntercept },
        bounds,
        DEFAULT_SVG_W,
        DEFAULT_SVG_H,
        DEFAULT_PAD
      ),
    [features.yIntercept, bounds]
  );

  const vertexSvg = useMemo(() => {
    if (!features.vertex) return null;
    return mathToSvg(
      features.vertex,
      bounds,
      DEFAULT_SVG_W,
      DEFAULT_SVG_H,
      DEFAULT_PAD
    );
  }, [features.vertex, bounds]);

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

  const applyPreset = useCallback((p: FunctionParams) => {
    setFuncType(p.type);
    setParams(p);
  }, []);

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

  // --- Parameter descriptions ---
  const paramDescriptions = useMemo(() => {
    const names = funcType === 'linear' ? ['m', 'b'] : ['a', 'b', 'c'];
    return names.map((n) => ({
      name: n,
      description: describeParameter(funcType, n),
    }));
  }, [funcType]);

  // --- Is current preset active ---
  const isPresetActive = useCallback(
    (preset: FunctionParams) => {
      if (preset.type !== params.type) return false;
      if (preset.type === 'linear' && params.type === 'linear') {
        return preset.m === params.m && preset.b === params.b;
      }
      if (preset.type === 'quadratic' && params.type === 'quadratic') {
        return (
          preset.a === params.a &&
          preset.b === params.b &&
          preset.c === params.c
        );
      }
      return false;
    },
    [params]
  );

  // --- Vertex label ---
  const vertexLabel = useMemo(() => {
    if (!features.vertex) return null;
    const { x, y } = features.vertex;
    return `顶点 (${fmtNum(x)}, ${fmtNum(y)})`;
  }, [features.vertex]);

  // --- Result panel ---
  const resultPanel = (
    <div className="space-y-5">
      {/* Current equation */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <p className="text-xs text-blue-600 mb-1">当前方程</p>
        <FormulaDisplay formula={equationLatex} className="text-xl" />
      </div>

      {/* Feature points */}
      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
        <h4 className="text-sm font-medium text-stone-700">函数特征</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {/* Y-intercept */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-600 mb-1">y 截距</p>
            <p className="font-mono font-semibold text-green-800">
              (0, {fmtNum(features.yIntercept)})
            </p>
          </div>

          {/* Zeros */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600 mb-1">x 截距（零点）</p>
            <p className="font-mono font-semibold text-red-800">
              {visibleZeros.length === 0
                ? '无实数零点'
                : visibleZeros.map((x) => `(${fmtNum(x)}, 0)`).join(', ')}
            </p>
          </div>

          {/* Vertex (quadratic only) */}
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs text-purple-600 mb-1">
              {funcType === 'quadratic' ? '顶点' : '—'}
            </p>
            <p className="font-mono font-semibold text-purple-800">
              {funcType === 'quadratic'
                ? vertexLabel ?? '—'
                : '线性函数无顶点'}
            </p>
          </div>
        </div>
      </div>

      {/* Parameter descriptions */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h4 className="text-sm font-medium text-amber-800 mb-2">
          参数含义
        </h4>
        <ul className="space-y-1">
          {paramDescriptions.map((pd) => (
            <li key={pd.name} className="text-sm text-amber-700">
              <span className="font-mono font-semibold">{pd.name}</span>
              {'：'}
              {pd.description}
            </li>
          ))}
        </ul>
      </div>

      {/* Historical connection */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-sm font-medium text-green-800 mb-2">
          从方程到曲线
        </h4>
        <p className="text-sm text-green-700">
          笛卡尔发现，代数方程可以画成几何曲线。你刚才调整参数时看到的，正是方程与曲线之间的对应关系——每个参数控制曲线的一种「姿态」。这就是解析几何的核心思想。
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
          函数图像探索器
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

        {/* Y-intercept marker */}
        {yInterceptVisible && (
          <g>
            <circle
              cx={yInterceptSvg.x}
              cy={yInterceptSvg.y}
              r={5}
              fill={GREEN}
              stroke="white"
              strokeWidth={1.5}
            />
            <text
              x={yInterceptSvg.x + 10}
              y={yInterceptSvg.y - 8}
              fontSize={11}
              fontWeight={600}
              fill={GREEN}
            >
              (0, {fmtNum(features.yIntercept)})
            </text>
          </g>
        )}

        {/* Zero markers */}
        {zeroSvgs.map((svg, i) => (
          <g key={i}>
            <circle
              cx={svg.x}
              cy={svg.y}
              r={5}
              fill={RED}
              stroke="white"
              strokeWidth={1.5}
            />
            <text
              x={svg.x}
              y={svg.y + 18}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill={RED}
            >
              ({fmtNum(visibleZeros[i])}, 0)
            </text>
          </g>
        ))}

        {/* Vertex marker (quadratic only) */}
        {vertexVisible && vertexSvg && features.vertex && (
          <g>
            <circle
              cx={vertexSvg.x}
              cy={vertexSvg.y}
              r={5}
              fill={PURPLE}
              stroke="white"
              strokeWidth={1.5}
            />
            <text
              x={vertexSvg.x + 10}
              y={vertexSvg.y - 8}
              fontSize={11}
              fontWeight={600}
              fill={PURPLE}
            >
              顶点
            </text>
          </g>
        )}

        {/* Instructions */}
        <text
          x={DEFAULT_SVG_W / 2}
          y={DEFAULT_SVG_H - 8}
          textAnchor="middle"
          fontSize={11}
          fill="#a8a29e"
        >
          调整参数 · 观察方程如何变成曲线
        </text>
      </svg>

      {/* Preset buttons */}
      <div className="px-6 py-4 bg-white border-t border-stone-100">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-stone-500 shrink-0">预设</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.params)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                isPresetActive(p.params)
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

// --- Helpers ---

function fmtNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(2)).toString();
}
