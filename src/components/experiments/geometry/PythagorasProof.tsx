'use client';

import { useState, useRef, useCallback } from 'react';
import type { Experiment } from '@/types/timeline';
import DraggablePoint from './DraggablePoint';
import FormulaDisplay from '@/components/math/FormulaDisplay';
import ExperimentContainer from '../ExperimentContainer';
import {
  pythagoreanHypotenuse,
  squareOnEdgeAwayFromPoint,
} from '@/lib/math/geometry';
import type { Point } from '@/lib/math/geometry';

/** Canvas dimensions */
const SVG_W = 800;
const SVG_H = 550;
const SCALE = 50; // pixels per unit

/** Right-angle vertex position */
const PX = 220;
const PY = 400;

const MIN_LEG = 1;
const MAX_LEG = 7;

interface PythagorasProofProps {
  experiment: Experiment;
}

/**
 * Format a number to avoid floating point noise.
 * e.g. 24.9999999 → "25", 7.0710678 → "7.07"
 */
function fmt(n: number): string {
  if (Math.abs(n - Math.round(n)) < 0.005) return String(Math.round(n));
  return n.toFixed(2).replace(/\.?0+$/, '');
}

export default function PythagorasProof({
  experiment,
}: PythagorasProofProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // --- Read initial state from JSON config ---
  const initialState = experiment.scene.initialState;
  const initialA = typeof initialState.a === 'number' ? initialState.a : 3;
  const initialB = typeof initialState.b === 'number' ? initialState.b : 4;

  // --- State ---
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);

  // --- Derived ---
  const c = pythagoreanHypotenuse(a, b);
  const a2 = a * a;
  const b2 = b * b;
  const c2 = c * c;
  const sumAB = a2 + b2;
  // Check equality with tolerance for floating point
  const isEqual = Math.abs(sumAB - c2) < 0.01;

  // --- Triangle vertices ---
  const P: Point = [PX, PY];                          // right angle
  const A: Point = [PX + a * SCALE, PY];              // horizontal leg end
  const B: Point = [PX, PY - b * SCALE];              // vertical leg end

  // --- Square vertices (computed by geometry helper) ---
  const sqA = squareOnEdgeAwayFromPoint(P, A, B);     // on a-edge, away from B
  const sqB = squareOnEdgeAwayFromPoint(B, P, A);     // on b-edge, away from A
  const sqC = squareOnEdgeAwayFromPoint(A, B, P);     // on c-edge, away from P

  // --- Centroid of a polygon (for label placement) ---
  const centroid = (pts: Point[]): Point => {
    const n = pts.length;
    const sx = pts.reduce((s, p) => s + p[0], 0);
    const sy = pts.reduce((s, p) => s + p[1], 0);
    return [sx / n, sy / n];
  };

  // --- Drag handlers ---
  const handleADrag = useCallback(
    (x: number) => {
      const newA = Math.max(MIN_LEG, Math.min(MAX_LEG, (x - PX) / SCALE));
      setA(Math.round(newA * 2) / 2); // snap to 0.5
    },
    []
  );

  const handleBDrag = useCallback(
    (_x: number, y: number) => {
      const newB = Math.max(MIN_LEG, Math.min(MAX_LEG, (PY - y) / SCALE));
      setB(Math.round(newB * 2) / 2); // snap to 0.5
    },
    []
  );

  // --- Labels ---
  const midA: Point = [(P[0] + A[0]) / 2, PY + 22];
  const midB: Point = [PX - 22, (P[1] + B[1]) / 2];
  const midC: Point = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  const cLabelOffset: Point = [
    midC[0] + (B[1] - A[1]) * 0.15,
    midC[1] - (B[0] - A[0]) * 0.15,
  ];

  // --- Result panel ---
  const resultPanel = (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800">面积验证</h3>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 mb-1">a 边正方形</p>
          <p className="text-xl font-mono font-bold text-blue-800">{fmt(a2)}</p>
          <p className="text-xs text-blue-500 mt-1">a={fmt(a)}</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-600 mb-1">b 边正方形</p>
          <p className="text-xl font-mono font-bold text-green-800">{fmt(b2)}</p>
          <p className="text-xs text-green-500 mt-1">b={fmt(b)}</p>
        </div>
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs text-amber-600 mb-1">c 边正方形</p>
          <p className="text-xl font-mono font-bold text-amber-800">{fmt(c2)}</p>
          <p className="text-xs text-amber-500 mt-1">c={fmt(c)}</p>
        </div>
      </div>

      {/* Verification */}
      <div className={`p-4 rounded-lg border ${isEqual ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
        <div className="flex items-center justify-center gap-4 text-lg">
          <FormulaDisplay
            formula={`${fmt(a)}^2 + ${fmt(b)}^2 = ${fmt(c)}^2`}
            displayMode={false}
          />
        </div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <FormulaDisplay
            formula={`${fmt(a2)} + ${fmt(b2)} = ${fmt(c2)}`}
            displayMode={false}
          />
          <span className={`text-sm font-bold ${isEqual ? 'text-green-700' : 'text-red-700'}`}>
            {isEqual ? '✓ 成立' : '✗ 不相等'}
          </span>
        </div>
      </div>

      {/* General formula */}
      <div className="text-center">
        <FormulaDisplay
          formula="a^2 + b^2 = c^2"
          displayMode={false}
          className="text-xl"
        />
      </div>
    </div>
  );

  return (
    <ExperimentContainer
      experiment={experiment}
      resultPanel={resultPanel}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto"
        style={{ touchAction: 'none' }}
      >
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e7e5e4" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={SVG_W} height={SVG_H} fill="#fafaf9" />
        <rect width={SVG_W} height={SVG_H} fill="url(#grid)" />

        {/* --- Squares --- */}
        {/* a-edge square (blue, bottom) */}
        <polygon
          points={sqA.map((p) => p.join(',')).join(' ')}
          fill="#3b82f6"
          opacity="0.15"
          stroke="#3b82f6"
          strokeWidth="1.5"
        />
        {/* b-edge square (green, left) */}
        <polygon
          points={sqB.map((p) => p.join(',')).join(' ')}
          fill="#16a34a"
          opacity="0.15"
          stroke="#16a34a"
          strokeWidth="1.5"
        />
        {/* c-edge square (amber, hypotenuse) */}
        <polygon
          points={sqC.map((p) => p.join(',')).join(' ')}
          fill="#d97706"
          opacity="0.15"
          stroke="#d97706"
          strokeWidth="1.5"
        />

        {/* --- Square area labels --- */}
        <text
          x={centroid(sqA)[0]}
          y={centroid(sqA)[1]}
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="#2563eb"
        >
          {fmt(a2)}
        </text>
        <text
          x={centroid(sqB)[0]}
          y={centroid(sqB)[1]}
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="#16a34a"
        >
          {fmt(b2)}
        </text>
        <text
          x={centroid(sqC)[0]}
          y={centroid(sqC)[1]}
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="#b45309"
        >
          {fmt(c2)}
        </text>

        {/* --- Triangle --- */}
        <polygon
          points={`${P.join(',')} ${A.join(',')} ${B.join(',')}`}
          fill="#f5f5f4"
          stroke="#44403c"
          strokeWidth="2.5"
        />

        {/* Right-angle marker */}
        <path
          d={`M ${PX + 18} ${PY} L ${PX + 18} ${PY - 18} L ${PX} ${PY - 18}`}
          fill="none"
          stroke="#44403c"
          strokeWidth="1.5"
        />

        {/* --- Side labels --- */}
        <text x={midA[0]} y={midA[1]} textAnchor="middle" fontSize="14" fontWeight="600" fill="#2563eb">
          a = {fmt(a)}
        </text>
        <text x={midB[0]} y={midB[1]} textAnchor="middle" fontSize="14" fontWeight="600" fill="#16a34a">
          b = {fmt(b)}
        </text>
        <text x={cLabelOffset[0]} y={cLabelOffset[1]} textAnchor="middle" fontSize="14" fontWeight="600" fill="#b45309">
          c = {fmt(c)}
        </text>

        {/* --- Draggable points --- */}
        {/* Drag a: horizontal leg endpoint */}
        <DraggablePoint
          x={A[0]}
          y={A[1]}
          onMove={handleADrag}
          svgRef={svgRef}
          radius={9}
          color="#3b82f6"
          label="拖动改 a"
          horizontalOnly
          minX={PX + MIN_LEG * SCALE}
          maxX={PX + MAX_LEG * SCALE}
        />
        {/* Drag b: vertical leg endpoint */}
        <DraggablePoint
          x={B[0]}
          y={B[1]}
          onMove={handleBDrag}
          svgRef={svgRef}
          radius={9}
          color="#16a34a"
          label="拖动改 b"
          verticalOnly
          minY={PY - MAX_LEG * SCALE}
          maxY={PY - MIN_LEG * SCALE}
        />

        {/* Instructions */}
        <text x={SVG_W / 2} y={SVG_H - 12} textAnchor="middle" fontSize="12" fill="#a8a29e">
          拖动蓝色点调整 a · 拖动绿色点调整 b · 观察三个正方形面积
        </text>
      </svg>

      {/* Slider controls */}
      <div className="px-6 pb-4 space-y-3 bg-white border-t border-stone-100">
        <div className="flex items-center gap-4">
          <label className="text-sm text-stone-600 w-16 shrink-0">边 a</label>
          <input
            type="range"
            min={MIN_LEG * 2}
            max={MAX_LEG * 2}
            value={a * 2}
            onChange={(e) => setA(Number(e.target.value) / 2)}
            className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-sm font-mono w-10 text-right">{fmt(a)}</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-stone-600 w-16 shrink-0">边 b</label>
          <input
            type="range"
            min={MIN_LEG * 2}
            max={MAX_LEG * 2}
            value={b * 2}
            onChange={(e) => setB(Number(e.target.value) / 2)}
            className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <span className="text-sm font-mono w-10 text-right">{fmt(b)}</span>
        </div>
      </div>
    </ExperimentContainer>
  );
}
