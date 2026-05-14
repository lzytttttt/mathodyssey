'use client';

import { useState, useMemo } from 'react';
import type { Experiment } from '@/types/timeline';
import FormulaDisplay from '@/components/math/FormulaDisplay';
import ExperimentContainer from '../ExperimentContainer';
import {
  solveChickenRabbit,
  chickenRabbitAssumptionSteps,
  chickenRabbitEquations,
  clampHeads,
  clampLegs,
} from '@/lib/math/algebra';

/** Canvas dimensions */
const SVG_W = 800;
const SVG_H = 400;

/** Slider ranges */
const HEADS_MIN = 2;
const HEADS_MAX = 50;
const LEGS_MIN = 4;
const LEGS_MAX = 200;

/** Preset problems */
const PRESETS = [
  { heads: 35, legs: 94, label: '35头94脚', desc: '《孙子算经》原题' },
  { heads: 20, legs: 56, label: '20头56脚', desc: '教科书常见' },
  { heads: 10, legs: 26, label: '10头26脚', desc: '小数练习' },
  { heads: 8, legs: 22, label: '8头22脚', desc: '小数练习' },
];

/** Animal icon size and spacing */
const ICON_R = 14;
const COLS = 15;
const COL_GAP = 32;
const ROW_GAP = 36;

interface ChickenRabbitLabProps {
  experiment: Experiment;
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/** Generate grid positions for animal icons */
function generatePositions(
  count: number,
  startX: number,
  startY: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    positions.push({
      x: startX + col * COL_GAP,
      y: startY + row * ROW_GAP,
    });
  }
  return positions;
}

/** Simple chicken SVG icon */
function ChickenIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Body */}
      <circle r={ICON_R} fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
      {/* Eye */}
      <circle cx={-4} cy={-4} r={2} fill="#44403c" />
      {/* Beak */}
      <polygon points="10,-2 16,0 10,2" fill="#ef4444" />
      {/* Comb */}
      <path d="M -4,-14 Q -2,-18 0,-14 Q 2,-18 4,-14" fill="#ef4444" />
      {/* Legs */}
      <line x1={-4} y1={ICON_R} x2={-6} y2={ICON_R + 8} stroke="#d97706" strokeWidth="1.5" />
      <line x1={4} y1={ICON_R} x2={6} y2={ICON_R + 8} stroke="#d97706" strokeWidth="1.5" />
      {/* Feet */}
      <line x1={-8} y1={ICON_R + 8} x2={-4} y2={ICON_R + 8} stroke="#d97706" strokeWidth="1" />
      <line x1={4} y1={ICON_R + 8} x2={8} y2={ICON_R + 8} stroke="#d97706" strokeWidth="1" />
    </g>
  );
}

/** Simple rabbit SVG icon */
function RabbitIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Body */}
      <circle r={ICON_R} fill="#a78bfa" stroke="#7c3aed" strokeWidth="1" />
      {/* Eye */}
      <circle cx={-4} cy={-4} r={2} fill="#44403c" />
      {/* Nose */}
      <circle cx={8} cy={0} r={2} fill="#f472b6" />
      {/* Ears */}
      <ellipse cx={-6} cy={-22} rx={4} ry={10} fill="#a78bfa" stroke="#7c3aed" strokeWidth="1" />
      <ellipse cx={6} cy={-22} rx={4} ry={10} fill="#a78bfa" stroke="#7c3aed" strokeWidth="1" />
      {/* Inner ears */}
      <ellipse cx={-6} cy={-22} rx={2} ry={6} fill="#f472b6" opacity="0.4" />
      <ellipse cx={6} cy={-22} rx={2} ry={6} fill="#f472b6" opacity="0.4" />
      {/* Legs (4 legs) */}
      <line x1={-8} y1={ICON_R} x2={-10} y2={ICON_R + 8} stroke="#7c3aed" strokeWidth="1.5" />
      <line x1={-3} y1={ICON_R} x2={-5} y2={ICON_R + 8} stroke="#7c3aed" strokeWidth="1.5" />
      <line x1={3} y1={ICON_R} x2={5} y2={ICON_R + 8} stroke="#7c3aed" strokeWidth="1.5" />
      <line x1={8} y1={ICON_R} x2={10} y2={ICON_R + 8} stroke="#7c3aed" strokeWidth="1.5" />
    </g>
  );
}

export default function ChickenRabbitLab({
  experiment,
}: ChickenRabbitLabProps) {
  // --- Read initial state from JSON config ---
  const initialState = experiment.scene.initialState;
  const initialHeads = clampHeads(
    typeof initialState.totalHeads === 'number' ? initialState.totalHeads : 35
  );
  const initialLegs = clampLegs(
    typeof initialState.totalFeet === 'number' ? initialState.totalFeet : 94
  );

  // --- State ---
  const [heads, setHeads] = useState(initialHeads);
  const [legs, setLegs] = useState(initialLegs);

  // --- Derived ---
  const solution = useMemo(() => solveChickenRabbit(heads, legs), [heads, legs]);
  const steps = useMemo(
    () => chickenRabbitAssumptionSteps(heads, legs),
    [heads, legs]
  );
  const equations = useMemo(
    () => chickenRabbitEquations(heads, legs),
    [heads, legs]
  );

  const chickens = solution?.chickens ?? 0;
  const rabbits = solution?.rabbits ?? 0;
  const isSolvable = solution !== null;

  // --- SVG animal positions ---
  const chickenPositions = useMemo(
    () => generatePositions(chickens, 80, 120),
    [chickens]
  );
  const rabbitPositions = useMemo(
    () => generatePositions(rabbits, 480, 120),
    [rabbits]
  );

  // --- Handlers ---
  const handleHeadsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeads(Number(e.target.value));
  };

  const handleLegsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLegs(Number(e.target.value));
  };

  const applyPreset = (h: number, l: number) => {
    setHeads(h);
    setLegs(l);
  };

  // --- Result panel ---
  const resultPanel = (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-stone-800">
        假设法推理
      </h3>

      {isSolvable ? (
        <>
          {/* Step-by-step reasoning */}
          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p className="text-sm text-stone-600">假设全是鸡</p>
                <p className="font-mono text-stone-800">
                  {heads} &times; 2 = {steps.assumedAllChickenLegs} 只脚
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <p className="text-sm text-stone-600">与实际脚数的差异</p>
                <p className="font-mono text-stone-800">
                  {legs} &minus; {steps.assumedAllChickenLegs} = {fmt(steps.legDifference)} 只脚
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">3</span>
              <div>
                <p className="text-sm text-stone-600">每只兔比鸡多 2 只脚</p>
                <p className="font-mono text-stone-800">
                  {fmt(steps.legDifference)} &divide; 2 = {fmt(steps.rabbitsFromDifference)} 只兔
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">4</span>
              <div>
                <p className="text-sm text-stone-600">鸡的数量</p>
                <p className="font-mono text-stone-800">
                  {heads} &minus; {steps.rabbits} = {steps.chickens} 只鸡
                </p>
              </div>
            </div>
          </div>

          {/* Solution result */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-xs text-amber-600 mb-1">鸡</p>
                <p className="text-3xl font-mono font-bold text-amber-900">
                  {steps.chickens}
                </p>
              </div>
              <span className="text-2xl text-stone-400">|</span>
              <div className="text-center">
                <p className="text-xs text-amber-600 mb-1">兔</p>
                <p className="text-3xl font-mono font-bold text-amber-900">
                  {steps.rabbits}
                </p>
              </div>
            </div>
            <p className="text-sm text-amber-700 text-center mt-3 font-mono">
              验证: {steps.chickens}&times;2 + {steps.rabbits}&times;4 = {steps.chickens * 2} + {steps.rabbits * 4} = {steps.chickens * 2 + steps.rabbits * 4} ✓
            </p>
          </div>

          {/* Equation connection */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-3">
              从假设法到方程
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-green-600 mb-2">古代假设法</p>
                <p className="text-sm text-green-700">
                  假设全是鸡 → 差值分析 → 得到答案
                </p>
              </div>
              <div>
                <p className="text-xs text-green-600 mb-2">现代方程组</p>
                <div className="space-y-1">
                  <FormulaDisplay
                    formula={equations.equation1}
                    displayMode={false}
                    className="text-sm"
                  />
                  <FormulaDisplay
                    formula={equations.equation2}
                    displayMode={false}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-xs text-green-600 mb-1">消元法（假设法的本质）</p>
              <FormulaDisplay
                formula={equations.eliminationFormula}
                displayMode={false}
                className="text-sm"
              />
            </div>
          </div>
        </>
      ) : (
        /* No solution提示 */
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            无整数解
          </h4>
          <p className="text-sm text-red-700 mb-3">
            脚数必须满足以下条件：
          </p>
          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
            <li>
              脚数必须是偶数（鸡和兔的脚都是偶数）
            </li>
            <li>
              2 &times; 头数 &le; 脚数 &le; 4 &times; 头数
            </li>
          </ul>
          <div className="mt-3 p-3 bg-red-100 rounded-lg">
            <p className="text-sm text-red-800 font-mono">
              当前: 头={heads}, 脚={legs}
            </p>
            <p className="text-sm text-red-800 font-mono">
              有效范围: [{2 * heads}, {4 * heads}]
              {legs % 2 !== 0 && '，且脚数必须是偶数'}
            </p>
          </div>
        </div>
      )}
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
            id="cr-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#e7e5e4"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width={SVG_W} height={SVG_H} fill="url(#cr-grid)" />

        {/* Title */}
        <text
          x={SVG_W / 2}
          y={30}
          textAnchor="middle"
          fontSize="18"
          fontWeight="600"
          fill="#44403c"
        >
          鸡兔同笼
        </text>

        {/* Problem statement */}
        <text
          x={SVG_W / 2}
          y={55}
          textAnchor="middle"
          fontSize="13"
          fill="#78716c"
        >
          {heads} 头 {legs} 脚
        </text>

        {isSolvable ? (
          <>
            {/* Chicken section label */}
            <text
              x={160}
              y={88}
              textAnchor="middle"
              fontSize="14"
              fontWeight="600"
              fill="#d97706"
            >
              鸡 &times; {chickens}
            </text>
            <text
              x={160}
              y={104}
              textAnchor="middle"
              fontSize="11"
              fill="#92400e"
            >
              {chickens} &times; 2 = {chickens * 2} 脚
            </text>

            {/* Chicken icons */}
            {chickenPositions.map((pos, i) => (
              <ChickenIcon key={`c-${i}`} x={pos.x} y={pos.y} />
            ))}

            {/* Rabbit section label */}
            <text
              x={560}
              y={88}
              textAnchor="middle"
              fontSize="14"
              fontWeight="600"
              fill="#7c3aed"
            >
              兔 &times; {rabbits}
            </text>
            <text
              x={560}
              y={104}
              textAnchor="middle"
              fontSize="11"
              fill="#5b21b6"
            >
              {rabbits} &times; 4 = {rabbits * 4} 脚
            </text>

            {/* Rabbit icons */}
            {rabbitPositions.map((pos, i) => (
              <RabbitIcon key={`r-${i}`} x={pos.x} y={pos.y} />
            ))}

            {/* Divider */}
            <line
              x1={400}
              y1={75}
              x2={400}
              y2={SVG_H - 20}
              stroke="#d6d3d1"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Total feet */}
            <text
              x={SVG_W / 2}
              y={SVG_H - 10}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="#44403c"
            >
              合计: {chickens * 2} + {rabbits * 4} = {legs} 脚 ✓
            </text>
          </>
        ) : (
          /* No solution message */
          <text
            x={SVG_W / 2}
            y={SVG_H / 2}
            textAnchor="middle"
            fontSize="16"
            fill="#dc2626"
          >
            此组合无整数解
          </text>
        )}

        {/* Instructions */}
        <text
          x={SVG_W / 2}
          y={SVG_H - (isSolvable ? 30 : 50)}
          textAnchor="middle"
          fontSize="11"
          fill="#a8a29e"
        >
          拖动滑块调整头数和脚数 · 观察假设法如何推导出答案
        </text>
      </svg>

      {/* Sliders + Presets */}
      <div className="px-6 py-4 bg-white border-t border-stone-100 space-y-4">
        {/* Heads slider */}
        <div className="flex items-center gap-4">
          <label className="text-sm text-stone-600 w-16 shrink-0">
            总头数
          </label>
          <input
            type="range"
            min={HEADS_MIN}
            max={HEADS_MAX}
            step={1}
            value={heads}
            onChange={handleHeadsChange}
            className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-lg font-mono font-bold text-stone-800 w-12 text-right">
            {heads}
          </span>
        </div>

        {/* Legs slider */}
        <div className="flex items-center gap-4">
          <label className="text-sm text-stone-600 w-16 shrink-0">
            总脚数
          </label>
          <input
            type="range"
            min={LEGS_MIN}
            max={LEGS_MAX}
            step={1}
            value={legs}
            onChange={handleLegsChange}
            className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-lg font-mono font-bold text-stone-800 w-12 text-right">
            {legs}
          </span>
        </div>

        {/* Preset buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500 w-16 shrink-0">经典题目</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.heads, p.legs)}
              title={p.desc}
              className={`px-3 py-1.5 text-sm font-mono rounded-lg border transition-colors ${
                heads === p.heads && legs === p.legs
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
