'use client';

import { useState, useMemo } from 'react';
import type { Experiment } from '@/types/timeline';
import FormulaDisplay from '@/components/math/FormulaDisplay';
import ExperimentContainer from '../ExperimentContainer';
import {
  regularPolygonVertices,
  archimedesApproximation,
} from '@/lib/math/geometry';
import type { Point } from '@/lib/math/geometry';

/** Canvas dimensions */
const SVG_W = 800;
const SVG_H = 600;
const CENTER: Point = [SVG_W / 2, SVG_H / 2];
const RADIUS = 200;

/** Slider range */
const MIN_SIDES = 6;
const MAX_SIDES = 96;

/** Preset side counts */
const PRESETS = [6, 12, 24, 48, 96];

interface ArchimedesPolygonLabProps {
  experiment: Experiment;
}

function fmt(n: number, decimals = 4): string {
  return n.toFixed(decimals);
}

export default function ArchimedesPolygonLab({
  experiment,
}: ArchimedesPolygonLabProps) {
  // --- Read initial state from JSON config ---
  const initialState = experiment.scene.initialState;
  const initialSides =
    typeof initialState.sides === 'number'
      ? Math.max(MIN_SIDES, Math.min(MAX_SIDES, initialState.sides))
      : 6;

  // --- State ---
  const [sides, setSides] = useState(initialSides);

  // --- Derived ---
  const approx = useMemo(() => archimedesApproximation(sides), [sides]);

  const inscribedVertices = useMemo(
    () => regularPolygonVertices(sides, RADIUS, CENTER),
    [sides]
  );

  // Circumscribed polygon: scale inscribed vertices by 1/cos(π/n)
  const circumscribedVertices = useMemo(() => {
    const scaleFactor = 1 / Math.cos(Math.PI / sides);
    return inscribedVertices.map(
      (v): Point => [
        CENTER[0] + (v[0] - CENTER[0]) * scaleFactor,
        CENTER[1] + (v[1] - CENTER[1]) * scaleFactor,
      ]
    );
  }, [sides, inscribedVertices]);

  // --- Archimedes' historical result at n=96 ---
  const archimedesResult = useMemo(() => archimedesApproximation(96), []);

  // --- Handlers ---
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSides(Number(e.target.value));
  };

  const toPointsString = (vertices: Point[]): string =>
    vertices.map((v) => `${v[0]},${v[1]}`).join(' ');

  // --- Result panel ---
  const resultPanel = (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-stone-800">
        π 的逼近
      </h3>

      {/* Bounds display */}
      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="text-center">
            <p className="text-xs text-blue-600 mb-1">下界（内接）</p>
            <p className="text-2xl font-mono font-bold text-blue-800">
              {fmt(approx.lower)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-red-600 mb-1">上界（外切）</p>
            <p className="text-2xl font-mono font-bold text-red-800">
              {fmt(approx.upper)}
            </p>
          </div>
        </div>

        {/* Squeeze visualization bar */}
        <div className="relative h-6 bg-stone-200 rounded-full overflow-hidden">
          {/* Full range 3.0 → 3.5 */}
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-blue-400 to-red-400 rounded-full transition-all duration-200"
            style={{
              left: `${((approx.lower - 3.0) / 0.5) * 100}%`,
              width: `${(approx.intervalWidth / 0.5) * 100}%`,
            }}
          />
          {/* π marker */}
          <div
            className="absolute top-0 h-full w-0.5 bg-stone-800"
            style={{ left: `${((Math.PI - 3.0) / 0.5) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-stone-500 mt-1">
          <span>3.0</span>
          <span className="font-bold text-stone-800">π = 3.14159…</span>
          <span>3.5</span>
        </div>
      </div>

      {/* Interval width */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-amber-800">区间宽度</span>
          <span className="text-lg font-mono font-bold text-amber-900">
            {fmt(approx.intervalWidth, 6)}
          </span>
        </div>
        <p className="text-xs text-amber-600 mt-1">
          n={sides} 时，π 被夹在 [{fmt(approx.lower)}, {fmt(approx.upper)}] 之间
        </p>
      </div>

      {/* Historical comparison */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-sm font-medium text-green-800 mb-2">
          阿基米德的结果（n = 96）
        </h4>
        <p className="text-sm text-green-700 font-mono">
          {fmt(archimedesResult.lower)} &lt; π &lt; {fmt(archimedesResult.upper)}
        </p>
        {sides === 96 && (
          <p className="text-sm text-green-900 font-bold mt-2">
            你得到了和阿基米德一样的结果！
          </p>
        )}
      </div>

      {/* General formula */}
      <div className="text-center pt-2">
        <FormulaDisplay
          formula="\\lim_{n \\to \\infty} n \\sin\\!\\left(\\frac{\\pi}{n}\\right) = \\pi"
          displayMode={false}
          className="text-base"
        />
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

        {/* Grid pattern */}
        <defs>
          <pattern
            id="arch-grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#e7e5e4"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width={SVG_W} height={SVG_H} fill="url(#arch-grid)" />

        {/* Circumscribed polygon (red, dashed, outside the circle) */}
        <polygon
          points={toPointsString(circumscribedVertices)}
          fill="#ef4444"
          opacity="0.05"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeDasharray="6 3"
        />

        {/* Circle (gray) */}
        <circle
          cx={CENTER[0]}
          cy={CENTER[1]}
          r={RADIUS}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
        />

        {/* Inscribed polygon (blue, solid, inside the circle) */}
        <polygon
          points={toPointsString(inscribedVertices)}
          fill="#3b82f6"
          opacity="0.1"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Center marker */}
        <circle cx={CENTER[0]} cy={CENTER[1]} r="3" fill="#44403c" />

        {/* Radius line */}
        <line
          x1={CENTER[0]}
          y1={CENTER[1]}
          x2={CENTER[0] + RADIUS}
          y2={CENTER[1]}
          stroke="#94a3b8"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <text
          x={CENTER[0] + RADIUS / 2}
          y={CENTER[1] - 8}
          textAnchor="middle"
          fontSize="13"
          fill="#94a3b8"
        >
          r
        </text>

        {/* Labels */}
        <text
          x={SVG_W / 2}
          y={30}
          textAnchor="middle"
          fontSize="16"
          fontWeight="600"
          fill="#44403c"
        >
          正 {sides} 边形逼近圆
        </text>

        {/* Legend */}
        <g transform={`translate(${SVG_W - 200}, 50)`}>
          <line
            x1={0}
            y1={0}
            x2={24}
            y2={0}
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <text x={30} y={4} fontSize="12" fill="#3b82f6">
            内接 · π 下界
          </text>
          <line
            x1={0}
            y1={20}
            x2={24}
            y2={20}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
          <text x={30} y={24} fontSize="12" fill="#ef4444">
            外切 · π 上界
          </text>
          <line
            x1={0}
            y1={40}
            x2={24}
            y2={40}
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <text x={30} y={44} fontSize="12" fill="#94a3b8">
            真实圆
          </text>
        </g>

        {/* Instructions */}
        <text
          x={SVG_W / 2}
          y={SVG_H - 16}
          textAnchor="middle"
          fontSize="12"
          fill="#a8a29e"
        >
          拖动滑块调整边数 · 观察上下界如何夹逼 π
        </text>
      </svg>

      {/* Slider + Presets */}
      <div className="px-6 py-4 bg-white border-t border-stone-100 space-y-3">
        <div className="flex items-center gap-4">
          <label className="text-sm text-stone-600 w-16 shrink-0">
            边数 n
          </label>
          <input
            type="range"
            min={MIN_SIDES}
            max={MAX_SIDES}
            step={1}
            value={sides}
            onChange={handleSliderChange}
            className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-lg font-mono font-bold text-stone-800 w-12 text-right">
            {sides}
          </span>
        </div>

        {/* Preset buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 w-16 shrink-0">预设</span>
          {PRESETS.map((n) => (
            <button
              key={n}
              onClick={() => setSides(n)}
              className={`px-3 py-1.5 text-sm font-mono rounded-lg border transition-colors ${
                sides === n
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </ExperimentContainer>
  );
}
