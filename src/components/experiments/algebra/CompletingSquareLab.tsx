'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Experiment } from '@/types/timeline';
import FormulaDisplay from '@/components/math/FormulaDisplay';
import ExperimentContainer from '../ExperimentContainer';
import {
  completingSquareParts,
  completingSquareSteps,
  formatQuadraticEquation,
  formatHalfBLabel,
  formatNumber,
  clampB,
  clampC,
} from '@/lib/math/algebra';

/** SVG canvas */
const SVG_W = 800;
const SVG_H = 520;

/** Slider ranges */
const B_MIN = 1;
const B_MAX = 12;
const C_MIN = 1;
const C_MAX = 50;

/** Animation duration in ms */
const ANIM_DURATION = 800;

/** Preset equations */
const PRESETS = [
  { b: 6, c: 7, label: 'x²+6x=7', desc: '花拉子米风格·整数解 x=1' },
  { b: 10, c: 24, label: 'x²+10x=24', desc: '整数解 x=2' },
  { b: 8, c: 9, label: 'x²+8x=9', desc: '整数解 x=1' },
  { b: 4, c: 5, label: 'x²+4x=5', desc: '小参数·整数解 x=1' },
];

/** Color palette */
const BLUE = '#3b82f6';
const ORANGE = '#f59e0b';
const GREEN = '#10b981';
const BLUE_LIGHT = 'rgba(59,130,246,0.15)';
const ORANGE_LIGHT = 'rgba(245,158,11,0.15)';
const GREEN_LIGHT = 'rgba(16,185,129,0.2)';

interface CompletingSquareLabProps {
  experiment: Experiment;
}

export default function CompletingSquareLab({
  experiment,
}: CompletingSquareLabProps) {
  // --- Initial state from JSON ---
  const initialState = experiment.scene.initialState;
  const initialB = clampB(typeof initialState.b === 'number' ? initialState.b : 6);
  const initialC = clampC(typeof initialState.c === 'number' ? initialState.c : 7);

  // --- State ---
  const [b, setB] = useState(initialB);
  const [c, setC] = useState(initialC);
  const [animProgress, setAnimProgress] = useState(0); // 0 = decomposed, 1 = completed
  const [isAnimating, setIsAnimating] = useState(false);

  // --- Derived math ---
  const parts = useMemo(() => completingSquareParts(b, c), [b, c]);
  const steps = useMemo(() => completingSquareSteps(b, c), [b, c]);
  const equation = useMemo(() => formatQuadraticEquation(b, c), [b, c]);

  const { x, halfB, cornerArea, bigSquareSide } = parts;

  // --- Adaptive scale ---
  const maxDim = useMemo(() => Math.max(x + halfB, x, halfB, 1), [x, halfB]);
  const SCALE = useMemo(() => {
    const maxPanelW = 330;
    const maxPanelH = SVG_H - 120;
    const s = Math.min(maxPanelW / maxDim, maxPanelH / maxDim);
    return Math.max(20, Math.min(100, s));
  }, [maxDim]);

  // --- Panel layout ---
  const LEFT_CX = 200;
  const RIGHT_CX = 590;
  const PANEL_Y = 60;

  // --- Decomposed piece positions (progress=0) ---
  const xSqW = x * SCALE;
  const rectW = halfB * SCALE;
  const rectH = x * SCALE;
  const xSqX = LEFT_CX - xSqW / 2;
  const xSqY = PANEL_Y + (bigSquareSide * SCALE - xSqW) / 2;
  const rect1X = xSqX + xSqW;
  const rect1Y = xSqY;
  const rect2X = rect1X;
  const rect2Y = rect1Y + rectH;

  // --- Completed piece positions (progress=1) ---
  const bigW = bigSquareSide * SCALE;
  const bigX = RIGHT_CX - bigW / 2;
  const bigY = PANEL_Y + (bigSquareSide * SCALE - bigW) / 2;
  const comp_xSqX = bigX;
  const comp_xSqY = bigY;
  const comp_rect1X = bigX + xSqW;
  const comp_rect1Y = bigY;
  const comp_rect2X = bigX;
  const comp_rect2Y = bigY + xSqW;
  const comp_cornerX = bigX + xSqW;
  const comp_cornerY = bigY + xSqW;

  // --- Interpolation ---
  const lerp = (a: number, b: number) => a + (b - a) * animProgress;
  const cur_xSqX = lerp(xSqX, comp_xSqX);
  const cur_xSqY = lerp(xSqY, comp_xSqY);
  const cur_rect1X = lerp(rect1X, comp_rect1X);
  const cur_rect1Y = lerp(rect1Y, comp_rect1Y);
  const cur_rect2X = lerp(rect2X, comp_rect2X);
  const cur_rect2Y = lerp(rect2Y, comp_rect2Y);
  const cur_cornerX = lerp(rect1X, comp_cornerX);
  const cur_cornerY = lerp(rect2Y, comp_cornerY);
  const cornerOpacity = animProgress;
  const bigBorderOpacity = animProgress;

  // --- Auto-play animation ---
  const playAnimation = useCallback(() => {
    setIsAnimating(true);
    setAnimProgress(0);
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / ANIM_DURATION);
      // Ease-in-out
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setAnimProgress(eased);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        setIsAnimating(false);
      }
    };
    requestAnimationFrame(step);
  }, []);

  // Auto-play on mount and when b/c change
  useEffect(() => {
    const timer = setTimeout(playAnimation, 300);
    return () => clearTimeout(timer);
  }, [b, c, playAnimation]);

  // --- Handlers ---
  const handleBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setB(Number(e.target.value));
  };
  const handleCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setC(Number(e.target.value));
  };
  const applyPreset = (pb: number, pc: number) => {
    setB(pb);
    setC(pc);
  };

  // --- Label positions ---
  const xSqCenterX = cur_xSqX + xSqW / 2;
  const xSqCenterY = cur_xSqY + xSqW / 2;

  // --- Result panel ---
  const resultPanel = (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-stone-800">配方法推导</h3>

      {/* Algebraic derivation */}
      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">1</span>
          <div>
            <p className="text-sm text-stone-600">原始方程</p>
            <FormulaDisplay formula={steps.step1} displayMode={false} className="text-base" />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">2</span>
          <div>
            <p className="text-sm text-stone-600">两边加上 <FormulaDisplay formula={`${steps.halfBStr}^2`} displayMode={false} className="text-sm" />（补角面积）</p>
            <FormulaDisplay formula={steps.step2} displayMode={false} className="text-base" />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">3</span>
          <div>
            <p className="text-sm text-stone-600">左边配成完全平方</p>
            <FormulaDisplay formula={steps.step3} displayMode={false} className="text-base" />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">4</span>
          <div>
            <p className="text-sm text-stone-600">开方求解</p>
            <FormulaDisplay formula={steps.step4} displayMode={false} className="text-base" />
            <div className="mt-1">
              <FormulaDisplay formula={steps.result} displayMode={false} className="text-lg font-bold" />
            </div>
          </div>
        </div>
      </div>

      {/* Area breakdown */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-3 rounded-lg border-2" style={{ backgroundColor: BLUE_LIGHT.replace('0.15', '0.08'), borderColor: BLUE }}>
          <p className="text-xs mb-1" style={{ color: BLUE }}>x²</p>
          <p className="text-lg font-mono font-bold" style={{ color: '#1e40af' }}>{formatNumber(parts.xSquared)}</p>
        </div>
        <div className="p-3 rounded-lg border-2" style={{ backgroundColor: ORANGE_LIGHT.replace('0.15', '0.08'), borderColor: ORANGE }}>
          <p className="text-xs mb-1" style={{ color: '#d97706' }}>bx</p>
          <p className="text-lg font-mono font-bold" style={{ color: '#92400e' }}>{formatNumber(parts.bxArea)}</p>
        </div>
        <div className="p-3 rounded-lg border-2" style={{ backgroundColor: GREEN_LIGHT.replace('0.2', '0.08'), borderColor: GREEN }}>
          <p className="text-xs mb-1" style={{ color: '#059669' }}>补角</p>
          <p className="text-lg font-mono font-bold" style={{ color: '#065f46' }}>{formatNumber(cornerArea)}</p>
        </div>
        <div className="p-3 rounded-lg border-2 border-stone-300 bg-stone-50">
          <p className="text-xs text-stone-500 mb-1">大正方形</p>
          <p className="text-lg font-mono font-bold text-stone-800">{formatNumber(parts.bigSquareArea)}</p>
        </div>
      </div>

      {/* Color legend */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: BLUE }} />
          <span style={{ color: BLUE }}>x²</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: ORANGE }} />
          <span style={{ color: '#d97706' }}>bx</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: GREEN }} />
          <span style={{ color: '#059669' }}>补角 (b/2)²</span>
        </span>
      </div>

      {/* Equation display */}
      <div className="text-center pt-2">
        <FormulaDisplay formula={equation} displayMode={false} className="text-xl" />
      </div>
    </div>
  );

  return (
    <ExperimentContainer experiment={experiment} resultPanel={resultPanel}>
      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto"
        style={{ touchAction: 'none' }}
      >
        {/* Background */}
        <rect width={SVG_W} height={SVG_H} fill="#fafaf9" />

        {/* Grid */}
        <defs>
          <pattern id="cs-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e7e5e4" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={SVG_W} height={SVG_H} fill="url(#cs-grid)" />

        {/* Title */}
        <text x={SVG_W / 2} y={30} textAnchor="middle" fontSize="16" fontWeight="600" fill="#44403c">
          面积完成法
        </text>
        <text x={SVG_W / 2} y={50} textAnchor="middle" fontSize="13" fill="#78716c">
          {equation} → x = {formatNumber(x)}
        </text>

        {/* ======== LEFT PANEL: Decomposed ======== */}
        <text x={LEFT_CX} y={PANEL_Y - 8} textAnchor="middle" fontSize="13" fontWeight="600" fill="#57534e">
          分解
        </text>

        {/* x² square (blue) */}
        <rect
          x={cur_xSqX}
          y={cur_xSqY}
          width={xSqW}
          height={xSqW}
          fill={BLUE_LIGHT}
          stroke={BLUE}
          strokeWidth="2"
          style={{ transition: `x 0.05s, y 0.05s` }}
        />
        {/* x² label */}
        <text
          x={xSqCenterX}
          y={xSqCenterY - 6}
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          fill="#1e40af"
        >
          x²
        </text>
        <text
          x={xSqCenterX}
          y={xSqCenterY + 12}
          textAnchor="middle"
          fontSize="11"
          fill="#3b82f6"
        >
          {formatNumber(parts.xSquared)}
        </text>

        {/* Rectangle 1 (orange) - top half of bx */}
        <rect
          x={cur_rect1X}
          y={cur_rect1Y}
          width={rectW}
          height={rectH}
          fill={ORANGE_LIGHT}
          stroke={ORANGE}
          strokeWidth="1.5"
          style={{ transition: `x 0.05s, y 0.05s` }}
        />
        {/* Rectangle 1 label */}
        <text
          x={cur_rect1X + rectW / 2}
          y={cur_rect1Y + rectH / 2 - 4}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#92400e"
        >
          {formatHalfBLabel(b)}×x
        </text>
        <text
          x={cur_rect1X + rectW / 2}
          y={cur_rect1Y + rectH / 2 + 10}
          textAnchor="middle"
          fontSize="9"
          fill="#d97706"
        >
          {formatNumber(halfB * x)}
        </text>

        {/* Rectangle 2 (orange) - bottom half of bx */}
        <rect
          x={cur_rect2X}
          y={cur_rect2Y}
          width={rectW}
          height={rectH}
          fill={ORANGE_LIGHT}
          stroke={ORANGE}
          strokeWidth="1.5"
          style={{ transition: `x 0.05s, y 0.05s` }}
        />
        {/* Rectangle 2 label */}
        <text
          x={cur_rect2X + rectW / 2}
          y={cur_rect2Y + rectH / 2 - 4}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#92400e"
        >
          {formatHalfBLabel(b)}×x
        </text>
        <text
          x={cur_rect2X + rectW / 2}
          y={cur_rect2Y + rectH / 2 + 10}
          textAnchor="middle"
          fontSize="9"
          fill="#d97706"
        >
          {formatNumber(halfB * x)}
        </text>

        {/* Corner piece (green) - fades in during animation */}
        <rect
          x={cur_cornerX}
          y={cur_cornerY}
          width={rectW}
          height={rectW}
          fill={GREEN_LIGHT}
          stroke={GREEN}
          strokeWidth="1.5"
          opacity={cornerOpacity}
          style={{ transition: `x 0.05s, y 0.05s, opacity 0.05s` }}
        />
        {/* Corner label */}
        {animProgress > 0.3 && (
          <>
            <text
              x={cur_cornerX + rectW / 2}
              y={cur_cornerY + rectW / 2 - 4}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#065f46"
              opacity={cornerOpacity}
            >
              {formatHalfBLabel(b)}²
            </text>
            <text
              x={cur_cornerX + rectW / 2}
              y={cur_cornerY + rectW / 2 + 8}
              textAnchor="middle"
              fontSize="9"
              fill="#10b981"
              opacity={cornerOpacity}
            >
              {formatNumber(cornerArea)}
            </text>
          </>
        )}

        {/* Left panel equation */}
        <text
          x={LEFT_CX}
          y={PANEL_Y + bigSquareSide * SCALE + 28}
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="#44403c"
        >
          x² + bx = c
        </text>

        {/* ======== RIGHT PANEL: Completed ======== */}
        <text x={RIGHT_CX} y={PANEL_Y - 8} textAnchor="middle" fontSize="13" fontWeight="600" fill="#57534e">
          完成
        </text>

        {/* Big square border (fades in) */}
        <rect
          x={bigX}
          y={bigY}
          width={bigW}
          height={bigW}
          fill="none"
          stroke="#44403c"
          strokeWidth="2.5"
          strokeDasharray={animProgress < 0.9 ? '6 3' : 'none'}
          opacity={Math.max(0.2, bigBorderOpacity)}
        />

        {/* Completed x² (blue) */}
        <rect
          x={comp_xSqX}
          y={comp_xSqY}
          width={xSqW}
          height={xSqW}
          fill={BLUE_LIGHT}
          stroke={BLUE}
          strokeWidth="1.5"
        />
        <text
          x={comp_xSqX + xSqW / 2}
          y={comp_xSqY + xSqW / 2 + 5}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#1e40af"
        >
          x²
        </text>

        {/* Completed rect 1 (orange) - right of x² */}
        <rect
          x={comp_rect1X}
          y={comp_rect1Y}
          width={rectW}
          height={rectH}
          fill={ORANGE_LIGHT}
          stroke={ORANGE}
          strokeWidth="1"
        />

        {/* Completed rect 2 (orange) - below x² */}
        <rect
          x={comp_rect2X}
          y={comp_rect2Y}
          width={rectH}
          height={rectW}
          fill={ORANGE_LIGHT}
          stroke={ORANGE}
          strokeWidth="1"
        />

        {/* Completed corner (green) */}
        <rect
          x={comp_cornerX}
          y={comp_cornerY}
          width={rectW}
          height={rectW}
          fill={GREEN_LIGHT}
          stroke={GREEN}
          strokeWidth="1.5"
        />
        <text
          x={comp_cornerX + rectW / 2}
          y={comp_cornerY + rectW / 2 + 5}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#065f46"
        >
          {formatHalfBLabel(b)}²
        </text>

        {/* Big square side label - bottom */}
        <text
          x={bigX + bigW / 2}
          y={bigY + bigW + 18}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#44403c"
        >
          x + {formatHalfBLabel(b)} = {formatNumber(bigSquareSide)}
        </text>

        {/* Right panel equation */}
        <text
          x={RIGHT_CX}
          y={PANEL_Y + bigSquareSide * SCALE + 28}
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="#44403c"
        >
          (x + {formatHalfBLabel(b)})² = {formatNumber(parts.bigSquareArea)}
        </text>

        {/* Arrow between panels */}
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#a8a29e" />
          </marker>
        </defs>
        <line
          x1={LEFT_CX + bigSquareSide * SCALE / 2 + 30}
          y1={PANEL_Y + bigSquareSide * SCALE / 2}
          x2={RIGHT_CX - bigSquareSide * SCALE / 2 - 30}
          y2={PANEL_Y + bigSquareSide * SCALE / 2}
          stroke="#a8a29e"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead)"
        />
        <text
          x={(LEFT_CX + RIGHT_CX) / 2}
          y={PANEL_Y + bigSquareSide * SCALE / 2 - 10}
          textAnchor="middle"
          fontSize="11"
          fill="#a8a29e"
        >
          补上 (b/2)²
        </text>

        {/* Instructions */}
        <text x={SVG_W / 2} y={SVG_H - 14} textAnchor="middle" fontSize="11" fill="#a8a29e">
          调整 b 和 c · 观察面积如何补成完整正方形 · {formatQuadraticEquation(b, c)}
        </text>
      </svg>

      {/* Animation control + sliders + presets */}
      <div className="px-6 py-4 bg-white border-t border-stone-100 space-y-4">
        {/* Animation replay */}
        <div className="flex items-center justify-center">
          <button
            onClick={playAnimation}
            disabled={isAnimating}
            className="px-4 py-1.5 text-sm rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-50 transition-colors"
          >
            {isAnimating ? '动画中...' : '重播动画'}
          </button>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-stone-600 w-10 shrink-0">b</label>
            <input
              type="range"
              min={B_MIN}
              max={B_MAX}
              step={1}
              value={b}
              onChange={handleBChange}
              className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-lg font-mono font-bold text-stone-800 w-8 text-right">{b}</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-stone-600 w-10 shrink-0">c</label>
            <input
              type="range"
              min={C_MIN}
              max={C_MAX}
              step={1}
              value={c}
              onChange={handleCChange}
              className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-lg font-mono font-bold text-stone-800 w-8 text-right">{c}</span>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500 shrink-0">经典方程</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.b, p.c)}
              title={p.desc}
              className={`px-3 py-1.5 text-sm font-mono rounded-lg border transition-colors ${
                b === p.b && c === p.c
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
