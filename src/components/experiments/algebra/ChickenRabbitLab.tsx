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
const SVG_H = 420;

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
      <circle r={ICON_R} fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
      <circle cx={-4} cy={-4} r={2} fill="#44403c" />
      <polygon points="10,-2 16,0 10,2" fill="#ef4444" />
      <path d="M -4,-14 Q -2,-18 0,-14 Q 2,-18 4,-14" fill="#ef4444" />
      <line x1={-4} y1={ICON_R} x2={-6} y2={ICON_R + 8} stroke="#d97706" strokeWidth="1.5" />
      <line x1={4} y1={ICON_R} x2={6} y2={ICON_R + 8} stroke="#d97706" strokeWidth="1.5" />
      <line x1={-8} y1={ICON_R + 8} x2={-4} y2={ICON_R + 8} stroke="#d97706" strokeWidth="1" />
      <line x1={4} y1={ICON_R + 8} x2={8} y2={ICON_R + 8} stroke="#d97706" strokeWidth="1" />
    </g>
  );
}

/** Simple rabbit SVG icon */
function RabbitIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={ICON_R} fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5" />
      <circle cx={-4} cy={-4} r={2} fill="#44403c" />
      <circle cx={8} cy={0} r={2} fill="#f472b6" />
      <ellipse cx={-6} cy={-22} rx={4} ry={10} fill="#a78bfa" stroke="#7c3aed" strokeWidth="1" />
      <ellipse cx={6} cy={-22} rx={4} ry={10} fill="#a78bfa" stroke="#7c3aed" strokeWidth="1" />
      <ellipse cx={-6} cy={-22} rx={2} ry={6} fill="#f472b6" opacity="0.4" />
      <ellipse cx={6} cy={-22} rx={2} ry={6} fill="#f472b6" opacity="0.4" />
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
  const initialState = experiment.scene.initialState;
  const initialHeads = clampHeads(
    typeof initialState.totalHeads === 'number' ? initialState.totalHeads : 35
  );
  const initialLegs = clampLegs(
    typeof initialState.totalFeet === 'number' ? initialState.totalFeet : 94
  );

  const [heads, setHeads] = useState(initialHeads);
  const [legs, setLegs] = useState(initialLegs);

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

  const chickenPositions = useMemo(
    () => generatePositions(chickens, 80, 130),
    [chickens]
  );
  const rabbitPositions = useMemo(
    () => generatePositions(rabbits, 480, 130),
    [rabbits]
  );

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
      <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center text-sm">
          🧮
        </span>
        假设法推理
      </h3>

      {isSolvable ? (
        <>
          {/* Step-by-step reasoning */}
          <div className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-4">
            {[
              {
                step: 1,
                label: '假设全是鸡',
                value: `${heads} × 2 = ${steps.assumedAllChickenLegs} 只脚`,
                color: 'bg-blue-500',
              },
              {
                step: 2,
                label: '与实际脚数的差异',
                value: `${legs} − ${steps.assumedAllChickenLegs} = ${fmt(steps.legDifference)} 只脚`,
                color: 'bg-indigo-500',
              },
              {
                step: 3,
                label: '每只兔比鸡多 2 只脚',
                value: `${fmt(steps.legDifference)} ÷ 2 = ${fmt(steps.rabbitsFromDifference)} 只兔`,
                color: 'bg-purple-500',
              },
              {
                step: 4,
                label: '鸡的数量',
                value: `${heads} − ${steps.rabbits} = ${steps.chickens} 只鸡`,
                color: 'bg-amber-500',
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <span
                  className={`shrink-0 w-7 h-7 rounded-lg ${item.color} text-white text-xs font-bold flex items-center justify-center shadow-sm`}
                >
                  {item.step}
                </span>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">{item.label}</p>
                  <p className="font-mono text-[var(--text-primary)] text-sm">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Solution result */}
          <div className="rounded-xl overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/5 dark:to-orange-500/5 border border-amber-200/50 dark:border-amber-500/10">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-500/10 mx-auto flex items-center justify-center mb-2">
                    <span className="text-2xl">🐔</span>
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mb-0.5">鸡</p>
                  <p className="text-3xl font-mono font-bold text-amber-900 dark:text-amber-300">
                    {steps.chickens}
                  </p>
                </div>
                <div className="h-16 w-px bg-amber-200 dark:bg-amber-500/20" />
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-500/10 mx-auto flex items-center justify-center mb-2">
                    <span className="text-2xl">🐰</span>
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mb-0.5">兔</p>
                  <p className="text-3xl font-mono font-bold text-purple-900 dark:text-purple-300">
                    {steps.rabbits}
                  </p>
                </div>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-400 text-center mt-4 font-mono p-2 rounded-lg bg-amber-100/50 dark:bg-amber-500/5">
                ✅ 验证: {steps.chickens}×2 + {steps.rabbits}×4 = {steps.chickens * 2} + {steps.rabbits * 4} = {steps.chickens * 2 + steps.rabbits * 4}
              </p>
            </div>
          </div>

          {/* Equation connection */}
          <div className="rounded-xl p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/5 dark:to-teal-500/5 border border-emerald-200/50 dark:border-emerald-500/10">
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-xs">🔗</span>
              从假设法到方程
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-white/60 dark:bg-white/5">
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">📜 古代假设法</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  假设全是鸡 → 差值分析 → 得到答案
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/60 dark:bg-white/5">
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">📐 现代方程组</p>
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
            <div className="mt-4 pt-4 border-t border-emerald-200/50 dark:border-emerald-500/10">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">⚡ 消元法（假设法的本质）</p>
              <div className="p-3 rounded-lg bg-white/60 dark:bg-white/5">
                <FormulaDisplay
                  formula={equations.eliminationFormula}
                  displayMode={false}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        /* No solution */
        <div className="p-5 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-500/5 dark:to-rose-500/5 border border-red-200/50 dark:border-red-500/10">
          <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
            <span className="text-lg">⚠️</span> 无整数解
          </h4>
          <p className="text-sm text-red-700 dark:text-red-400 mb-3">
            脚数必须满足以下条件：
          </p>
          <ul className="text-sm text-red-700 dark:text-red-400 space-y-1.5 ml-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500" />
              脚数必须是偶数（鸡和兔的脚都是偶数）
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500" />
              2 × 头数 ≤ 脚数 ≤ 4 × 头数
            </li>
          </ul>
          <div className="mt-3 p-3 rounded-lg bg-red-100/50 dark:bg-red-500/10 font-mono text-sm">
            <p className="text-red-800 dark:text-red-300">
              当前: 头={heads}, 脚={legs}
            </p>
            <p className="text-red-800 dark:text-red-300">
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
        {/* Background gradient */}
        <defs>
          <linearGradient id="cr-bg-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--bg-card, #ffffff)" />
            <stop offset="100%" stopColor="var(--bg-secondary, #f5f3f0)" />
          </linearGradient>
          <pattern
            id="cr-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--border-light, #e7e5e4)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width={SVG_W} height={SVG_H} fill="url(#cr-bg-grad)" />
        <rect width={SVG_W} height={SVG_H} fill="url(#cr-grid)" />

        {/* Title */}
        <text
          x={SVG_W / 2}
          y={30}
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="var(--text-primary, #44403c)"
        >
          鸡兔同笼
        </text>

        {/* Problem statement badge */}
        <rect
          x={SVG_W / 2 - 60}
          y={42}
          width={120}
          height={26}
          rx={13}
          fill="var(--accent-primary, #4f46e5)"
          opacity="0.1"
        />
        <text
          x={SVG_W / 2}
          y={59}
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="var(--accent-primary, #4f46e5)"
        >
          {heads} 头 {legs} 脚
        </text>

        {isSolvable ? (
          <>
            {/* Chicken section */}
            <rect x={20} y={78} width={360} height={32} rx={10} fill="#f59e0b" opacity="0.08" />
            <text
              x={200}
              y={100}
              textAnchor="middle"
              fontSize="14"
              fontWeight="600"
              fill="#d97706"
            >
              🐔 鸡 × {chickens}
              <tspan dx={12} fontSize="11" fill="#92400e" opacity={0.7}>
                ({chickens} × 2 = {chickens * 2} 脚)
              </tspan>
            </text>

            {chickenPositions.map((pos, i) => (
              <ChickenIcon key={`c-${i}`} x={pos.x} y={pos.y} />
            ))}

            {/* Rabbit section */}
            <rect x={420} y={78} width={360} height={32} rx={10} fill="#a78bfa" opacity="0.08" />
            <text
              x={600}
              y={100}
              textAnchor="middle"
              fontSize="14"
              fontWeight="600"
              fill="#7c3aed"
            >
              🐰 兔 × {rabbits}
              <tspan dx={12} fontSize="11" fill="#5b21b6" opacity={0.7}>
                ({rabbits} × 4 = {rabbits * 4} 脚)
              </tspan>
            </text>

            {rabbitPositions.map((pos, i) => (
              <RabbitIcon key={`r-${i}`} x={pos.x} y={pos.y} />
            ))}

            {/* Divider */}
            <line
              x1={400}
              y1={80}
              x2={400}
              y2={SVG_H - 35}
              stroke="var(--border-color, #d6d3d1)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Total bar */}
            <rect
              x={SVG_W / 2 - 150}
              y={SVG_H - 32}
              width={300}
              height={28}
              rx={14}
              fill="var(--accent-primary, #4f46e5)"
              opacity="0.08"
            />
            <text
              x={SVG_W / 2}
              y={SVG_H - 14}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="var(--accent-primary, #4f46e5)"
            >
              ✅ 合计: {chickens * 2} + {rabbits * 4} = {legs} 脚
            </text>
          </>
        ) : (
          <>
            <text
              x={SVG_W / 2}
              y={SVG_H / 2 - 10}
              textAnchor="middle"
              fontSize="40"
              fill="var(--text-muted, #a8a29e)"
            >
              ⚠️
            </text>
            <text
              x={SVG_W / 2}
              y={SVG_H / 2 + 25}
              textAnchor="middle"
              fontSize="16"
              fontWeight="500"
              fill="var(--text-muted, #dc2626)"
            >
              此组合无整数解
            </text>
          </>
        )}
      </svg>

      {/* Sliders + Presets */}
      <div className="px-6 py-5 bg-[var(--bg-card)] border-t border-[var(--border-color)] space-y-4">
        {/* Heads slider */}
        <div className="flex items-center gap-4">
          <label className="text-sm text-[var(--text-secondary)] w-16 shrink-0 font-medium">
            🐔 头数
          </label>
          <input
            type="range"
            min={HEADS_MIN}
            max={HEADS_MAX}
            step={1}
            value={heads}
            onChange={handleHeadsChange}
            className="flex-1 h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-lg font-mono font-bold text-[var(--text-primary)] w-12 text-right">
            {heads}
          </span>
        </div>

        {/* Legs slider */}
        <div className="flex items-center gap-4">
          <label className="text-sm text-[var(--text-secondary)] w-16 shrink-0 font-medium">
            🦶 脚数
          </label>
          <input
            type="range"
            min={LEGS_MIN}
            max={LEGS_MAX}
            step={1}
            value={legs}
            onChange={handleLegsChange}
            className="flex-1 h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-lg font-mono font-bold text-[var(--text-primary)] w-12 text-right">
            {legs}
          </span>
        </div>

        {/* Preset buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-[var(--text-muted)] w-16 shrink-0 font-medium">📚 经典</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.heads, p.legs)}
              title={p.desc}
              className={`px-3 py-1.5 text-sm font-mono rounded-lg border transition-all duration-200 ${
                heads === p.heads && legs === p.legs
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-sm shadow-amber-500/25'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-amber-400 hover:text-amber-600'
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
