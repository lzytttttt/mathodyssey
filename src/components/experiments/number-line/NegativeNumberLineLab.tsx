'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Experiment } from '@/types/timeline';
import ExperimentContainer from '../ExperimentContainer';
import {
  clampNumberLineValue,
  numberLinePosition,
  oppositeNumber,
  absoluteDistance,
  numberLineOperationSteps,
} from '@/lib/math/numberLine';

/** SVG canvas */
const SVG_W = 800;
const SVG_H = 420;

/** Number line geometry */
const LINE_Y = 180;
const PAD_LEFT = 60;
const PAD_RIGHT = 60;
const RANGE_MIN = -10;
const RANGE_MAX = 10;

/** Visual constants */
const MARKER_R = 10;
const ARROW_HEAD_SIZE = 10;
const ANIM_DURATION = 600;

/** Color palette */
const BLUE = '#3b82f6';
const ORANGE = '#f59e0b';
const GREEN = '#10b981';
const RED = '#ef4444';
const PURPLE = '#8b5cf6';
const STONE = '#78716c';

/** Slider ranges */
const START_MIN = -10;
const START_MAX = 10;
const DELTA_MIN = -10;
const DELTA_MAX = 10;

/** Preset operations */
const PRESETS = [
  { start: 3, delta: -5, op: 'add' as const, label: '3+(-5)' },
  { start: -4, delta: 7, op: 'add' as const, label: '-4+7' },
  { start: 0, delta: 6, op: 'subtract' as const, label: '0-6' },
  { start: -3, delta: -5, op: 'subtract' as const, label: '-3-(-5)' },
];

interface NegativeNumberLineLabProps {
  experiment: Experiment;
}

export default function NegativeNumberLineLab({
  experiment,
}: NegativeNumberLineLabProps) {
  // --- Initial state from JSON ---
  const initialState = experiment.scene.initialState;
  const initialStart = clampNumberLineValue(
    typeof initialState.start === 'number' ? initialState.start : 0,
    START_MIN,
    START_MAX
  );
  const initialDelta = clampNumberLineValue(
    typeof initialState.delta === 'number' ? initialState.delta : 5,
    DELTA_MIN,
    DELTA_MAX
  );
  const initialOp =
    initialState.operation === 'subtract' ? 'subtract' : 'add';

  // --- State ---
  const [start, setStart] = useState(initialStart);
  const [delta, setDelta] = useState(initialDelta);
  const [operation, setOperation] = useState<'add' | 'subtract'>(initialOp);
  const [animProgress, setAnimProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // --- Derived math ---
  const steps = useMemo(
    () => numberLineOperationSteps(start, delta, operation),
    [start, delta, operation]
  );
  const result = steps.result;
  const resultInRange = result >= RANGE_MIN && result <= RANGE_MAX;

  // --- SVG positions ---
  const startX = useMemo(
    () => numberLinePosition(start, RANGE_MIN, RANGE_MAX, SVG_W, PAD_LEFT, PAD_RIGHT),
    [start]
  );
  const resultX = useMemo(
    () => numberLinePosition(result, RANGE_MIN, RANGE_MAX, SVG_W, PAD_LEFT, PAD_RIGHT),
    [result]
  );
  const clampedResultX = Math.max(PAD_LEFT, Math.min(SVG_W - PAD_RIGHT, resultX));
  const edgeX = steps.direction === 'right' ? SVG_W - PAD_RIGHT : PAD_LEFT;

  // --- Opposite number ---
  const opposite = oppositeNumber(delta);
  const oppositeInRange = opposite >= RANGE_MIN && opposite <= RANGE_MAX;
  const oppositeX = useMemo(
    () => numberLinePosition(opposite, RANGE_MIN, RANGE_MAX, SVG_W, PAD_LEFT, PAD_RIGHT),
    [opposite]
  );
  const deltaAbs = absoluteDistance(delta);

  // --- Animation ---
  const playAnimation = useCallback(() => {
    setIsAnimating(true);
    setAnimProgress(0);
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / ANIM_DURATION);
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

  useEffect(() => {
    const timer = setTimeout(playAnimation, 300);
    return () => clearTimeout(timer);
  }, [start, delta, operation, playAnimation]);

  // --- Animated positions ---
  const animX = startX + (clampedResultX - startX) * animProgress;
  const arrowOpacity = animProgress > 0.05 ? 1 : 0;
  const endOpacity = animProgress > 0.9 ? 1 : 0;

  // --- Handlers ---
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStart(Number(e.target.value));
  };
  const handleDeltaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDelta(Number(e.target.value));
  };
  const toggleOperation = () => {
    setOperation((prev) => (prev === 'add' ? 'subtract' : 'add'));
  };
  const applyPreset = (
    pStart: number,
    pDelta: number,
    pOp: 'add' | 'subtract'
  ) => {
    setStart(pStart);
    setDelta(pDelta);
    setOperation(pOp);
  };

  // --- Direction styling ---
  const moveColor = steps.direction === 'right' ? GREEN : RED;
  const moveLabel = steps.direction === 'right' ? '向右' : '向左';

  // --- Equation formatting ---
  const deltaLabel = delta < 0 ? `(${delta})` : String(delta);

  // --- Result panel ---
  const resultPanel = (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-stone-800">
        {steps.equation}
      </h3>

      {/* Step-by-step */}
      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
            1
          </span>
          <div>
            <p className="text-sm text-stone-600">起点</p>
            <p className="font-mono text-stone-800">
              从 <strong>{start}</strong> 出发
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span
            className="shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
            style={{
              backgroundColor: `${moveColor}20`,
              color: moveColor,
            }}
          >
            2
          </span>
          <div>
            <p className="text-sm text-stone-600">移动</p>
            <p className="font-mono text-stone-800">
              {moveLabel}移动 <strong>{deltaAbs}</strong> 步
            </p>
          </div>
        </div>
        {operation === 'subtract' && (
          <div className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
              !
            </span>
            <div>
              <p className="text-sm text-stone-600">减法本质</p>
              <p className="font-mono text-stone-800 text-sm">
                {steps.subtractionExplanation}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                减去一个数 = 加上它的相反数
              </p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
            3
          </span>
          <div>
            <p className="text-sm text-stone-600">到达</p>
            <p className="font-mono text-stone-800">
              结果 = <strong>{result}</strong>
            </p>
            {!resultInRange && (
              <p className="text-xs text-red-600 mt-1">
                超出数轴显示范围 [{RANGE_MIN}, {RANGE_MAX}]
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Equation display */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
        <p className="text-2xl font-mono font-bold text-amber-900">
          {steps.equation}
        </p>
      </div>

      {/* Opposite & absolute value */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="text-sm font-medium text-purple-800 mb-3">
          {delta} 的相反数与绝对值
        </h4>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-purple-600 mb-1">相反数</p>
            <p className="text-lg font-mono font-bold text-purple-900">
              {delta} 和 {opposite}
            </p>
            <p className="text-xs text-purple-600 mt-1">关于 0 对称</p>
          </div>
          <div>
            <p className="text-xs text-purple-600 mb-1">绝对值</p>
            <p className="text-lg font-mono font-bold text-purple-900">
              |{delta}| = {deltaAbs}
            </p>
            <p className="text-xs text-purple-600 mt-1">到 0 的距离</p>
          </div>
        </div>
        <p className="text-xs text-purple-600 mt-3 text-center font-mono">
          {delta} + ({opposite}) = 0
        </p>
      </div>

      {/* Modern connections */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-sm font-medium text-green-800 mb-2">
          生活中的数轴
        </h4>
        <div className="text-sm text-green-700 space-y-1">
          <p>
            温度：{start}°C {operation === 'add' ? '变化' : '降低'}{' '}
            {deltaAbs}°{steps.direction === 'right' ? '升温' : '降温'} →{' '}
            {result}°C
          </p>
          <p>
            海拔：海拔{start}m {steps.direction === 'right' ? '上升' : '下降'}{' '}
            {deltaAbs}m → 海拔{result}m
          </p>
        </div>
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

        {/* Title */}
        <text
          x={SVG_W / 2}
          y={30}
          textAnchor="middle"
          fontSize="16"
          fontWeight="600"
          fill="#44403c"
        >
          数轴上的运算
        </text>
        <text
          x={SVG_W / 2}
          y={52}
          textAnchor="middle"
          fontSize="14"
          fill={STONE}
        >
          {steps.equation}
        </text>

        {/* === Number Line === */}

        {/* Main axis line */}
        <line
          x1={PAD_LEFT - 10}
          y1={LINE_Y}
          x2={SVG_W - PAD_RIGHT + 10}
          y2={LINE_Y}
          stroke="#44403c"
          strokeWidth="2"
        />

        {/* Arrowheads */}
        <polygon
          points={`${PAD_LEFT - 10},${LINE_Y} ${PAD_LEFT},${LINE_Y - 5} ${PAD_LEFT},${LINE_Y + 5}`}
          fill="#44403c"
        />
        <polygon
          points={`${SVG_W - PAD_RIGHT + 10},${LINE_Y} ${SVG_W - PAD_RIGHT},${LINE_Y - 5} ${SVG_W - PAD_RIGHT},${LINE_Y + 5}`}
          fill="#44403c"
        />

        {/* Tick marks and labels */}
        {Array.from({ length: RANGE_MAX - RANGE_MIN + 1 }, (_, i) => {
          const val = RANGE_MIN + i;
          const x = numberLinePosition(
            val,
            RANGE_MIN,
            RANGE_MAX,
            SVG_W,
            PAD_LEFT,
            PAD_RIGHT
          );
          const isZero = val === 0;
          const isEven = val % 2 === 0;
          return (
            <g key={val}>
              {/* Tick mark */}
              <line
                x1={x}
                y1={LINE_Y - (isZero ? 10 : isEven ? 7 : 4)}
                x2={x}
                y2={LINE_Y + (isZero ? 10 : isEven ? 7 : 4)}
                stroke={isZero ? '#44403c' : '#a8a29e'}
                strokeWidth={isZero ? 2.5 : isEven ? 1.5 : 0.8}
              />
              {/* Label: even numbers only (plus zero always) */}
              {(isZero || isEven) && (
                <text
                  x={x}
                  y={LINE_Y + 28}
                  textAnchor="middle"
                  fontSize={isZero ? 14 : 11}
                  fontWeight={isZero ? '700' : '400'}
                  fill={isZero ? '#44403c' : STONE}
                >
                  {val}
                </text>
              )}
            </g>
          );
        })}

        {/* === Movement Arrow === */}
        {start !== result && animProgress > 0.05 && (
          <g opacity={arrowOpacity}>
            {/* Arrow body */}
            <line
              x1={startX}
              y1={LINE_Y - 30}
              x2={animX}
              y2={LINE_Y - 30}
              stroke={moveColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Arrowhead at animated tip */}
            {resultInRange ? (
              <polygon
                points={
                  steps.direction === 'right'
                    ? `${animX},${LINE_Y - 30} ${animX - ARROW_HEAD_SIZE},${LINE_Y - 30 - ARROW_HEAD_SIZE / 2} ${animX - ARROW_HEAD_SIZE},${LINE_Y - 30 + ARROW_HEAD_SIZE / 2}`
                    : `${animX},${LINE_Y - 30} ${animX + ARROW_HEAD_SIZE},${LINE_Y - 30 - ARROW_HEAD_SIZE / 2} ${animX + ARROW_HEAD_SIZE},${LINE_Y - 30 + ARROW_HEAD_SIZE / 2}`
                }
                fill={moveColor}
              />
            ) : (
              /* Out-of-range edge arrow */
              <polygon
                points={
                  steps.direction === 'right'
                    ? `${SVG_W - PAD_RIGHT + 8},${LINE_Y - 30} ${SVG_W - PAD_RIGHT - 2},${LINE_Y - 36} ${SVG_W - PAD_RIGHT - 2},${LINE_Y - 24}`
                    : `${PAD_LEFT - 8},${LINE_Y - 30} ${PAD_LEFT + 2},${LINE_Y - 36} ${PAD_LEFT + 2},${LINE_Y - 24}`
                }
                fill={moveColor}
              />
            )}
            {/* Step count on arrow */}
            {animProgress > 0.3 && (
              <text
                x={(startX + animX) / 2}
                y={LINE_Y - 42}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill={moveColor}
              >
                {deltaAbs} 步
              </text>
            )}
          </g>
        )}

        {/* Out-of-range result indicator */}
        {!resultInRange && animProgress > 0.9 && (
          <g>
            {/* Dashed extension line */}
            <line
              x1={edgeX}
              y1={LINE_Y - 30}
              x2={edgeX + (steps.direction === 'right' ? 20 : -20)}
              y2={LINE_Y - 30}
              stroke={moveColor}
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {/* Result label at edge */}
            <text
              x={edgeX + (steps.direction === 'right' ? 28 : -28)}
              y={LINE_Y - 26}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill={moveColor}
            >
              {result}
            </text>
          </g>
        )}

        {/* Start marker (blue) */}
        <circle cx={startX} cy={LINE_Y} r={MARKER_R} fill={BLUE} opacity="0.9" />
        <text
          x={startX}
          y={LINE_Y - 16}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill={BLUE}
        >
          {start}
        </text>

        {/* End marker (orange) — only when result is in range */}
        {resultInRange && (
          <g opacity={endOpacity}>
            <circle
              cx={clampedResultX}
              cy={LINE_Y}
              r={MARKER_R}
              fill={ORANGE}
              opacity="0.9"
            />
            <text
              x={clampedResultX}
              y={LINE_Y + 50}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="#b45309"
            >
              {result}
            </text>
            <text
              x={clampedResultX}
              y={LINE_Y + 66}
              textAnchor="middle"
              fontSize="10"
              fill={STONE}
            >
              结果
            </text>
          </g>
        )}

        {/* === Opposite Number Section === */}
        <line
          x1={60}
          y1={310}
          x2={SVG_W - 60}
          y2={310}
          stroke="#e7e5e4"
          strokeWidth="1"
        />
        <text
          x={SVG_W / 2}
          y={335}
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill={PURPLE}
        >
          {delta} 的相反数 = {opposite}（关于 0 对称）
        </text>

        {/* Delta marker */}
        {delta !== 0 && (
          <g>
            <circle
              cx={numberLinePosition(
                delta,
                RANGE_MIN,
                RANGE_MAX,
                SVG_W,
                PAD_LEFT,
                PAD_RIGHT
              )}
              cy={360}
              r={7}
              fill={PURPLE}
              opacity="0.8"
            />
            <text
              x={numberLinePosition(
                delta,
                RANGE_MIN,
                RANGE_MAX,
                SVG_W,
                PAD_LEFT,
                PAD_RIGHT
              )}
              y={385}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill={PURPLE}
            >
              {delta}
            </text>
          </g>
        )}

        {/* Opposite marker */}
        {opposite !== 0 && oppositeInRange && (
          <g>
            <circle
              cx={oppositeX}
              cy={360}
              r={7}
              fill={PURPLE}
              opacity="0.4"
            />
            <text
              x={oppositeX}
              y={385}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill={PURPLE}
              opacity="0.7"
            >
              {opposite}
            </text>
          </g>
        )}

        {/* Symmetry dashed line */}
        {delta !== 0 && oppositeInRange && (
          <line
            x1={numberLinePosition(
              delta,
              RANGE_MIN,
              RANGE_MAX,
              SVG_W,
              PAD_LEFT,
              PAD_RIGHT
            )}
            y1={360}
            x2={oppositeX}
            y2={360}
            stroke={PURPLE}
            strokeWidth="1"
            strokeDasharray="4 3"
            opacity="0.5"
          />
        )}

        {/* Zero label in opposite section */}
        <text
          x={numberLinePosition(
            0,
            RANGE_MIN,
            RANGE_MAX,
            SVG_W,
            PAD_LEFT,
            PAD_RIGHT
          )}
          y={368}
          textAnchor="middle"
          fontSize="10"
          fill={STONE}
        >
          0
        </text>

        {/* Instructions */}
        <text
          x={SVG_W / 2}
          y={SVG_H - 10}
          textAnchor="middle"
          fontSize="11"
          fill="#a8a29e"
        >
          调整起点和操作数 · 选择加法或减法 · 观察数轴上的移动
        </text>
      </svg>

      {/* Sliders + Controls */}
      <div className="px-6 py-4 bg-white border-t border-stone-100 space-y-4">
        {/* Start slider */}
        <div className="flex items-center gap-4">
          <label className="text-sm text-stone-600 w-12 shrink-0">起点</label>
          <input
            type="range"
            min={START_MIN}
            max={START_MAX}
            step={1}
            value={start}
            onChange={handleStartChange}
            className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-lg font-mono font-bold text-stone-800 w-8 text-right">
            {start}
          </span>
        </div>

        {/* Delta slider */}
        <div className="flex items-center gap-4">
          <label className="text-sm text-stone-600 w-12 shrink-0">操作数</label>
          <input
            type="range"
            min={DELTA_MIN}
            max={DELTA_MAX}
            step={1}
            value={delta}
            onChange={handleDeltaChange}
            className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-lg font-mono font-bold text-stone-800 w-8 text-right">
            {delta}
          </span>
        </div>

        {/* Operation toggle + presets */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Replay button */}
          <button
            onClick={playAnimation}
            disabled={isAnimating}
            className="px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-50 transition-colors"
          >
            {isAnimating ? '...' : '重播'}
          </button>

          {/* Operation toggle */}
          <button
            onClick={toggleOperation}
            className={`px-4 py-2 text-sm font-mono font-bold rounded-lg border-2 transition-colors ${
              operation === 'add'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-red-600 text-white border-red-600'
            }`}
          >
            {operation === 'add'
              ? `${start} + ${deltaLabel}`
              : `${start} - ${deltaLabel}`}
          </button>

          <span className="text-xs text-stone-400">|</span>

          {/* Presets */}
          <span className="text-xs text-stone-500 shrink-0">预设</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.start, p.delta, p.op)}
              className={`px-3 py-1.5 text-sm font-mono rounded-lg border transition-colors ${
                start === p.start &&
                delta === p.delta &&
                operation === p.op
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
