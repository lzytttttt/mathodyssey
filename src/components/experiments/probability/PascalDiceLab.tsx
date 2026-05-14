'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Experiment } from '@/types/timeline';
import ExperimentContainer from '../ExperimentContainer';
import DiceFace from './DiceFace';
import FrequencyChart from './FrequencyChart';
import {
  simulateDiceSums,
  diceSumDistribution,
  frequencyTable,
  sum,
  rollDice,
} from '@/lib/math/probability';

const DICE_COUNT = 2;
const SIDES = 6;
const MIN_SUM = DICE_COUNT;          // 2
const MAX_SUM = DICE_COUNT * SIDES;  // 12

interface PascalDiceLabProps {
  experiment: Experiment;
}

export default function PascalDiceLab({
  experiment,
}: PascalDiceLabProps) {
  // --- State ---
  const [results, setResults] = useState<number[]>([]);
  const [lastDice, setLastDice] = useState<number[] | null>(null);
  const [lastSum, setLastSum] = useState<number | null>(null);

  // --- Derived ---
  const totalTrials = results.length;
  const table = useMemo(
    () => frequencyTable(results, MIN_SUM, MAX_SUM),
    [results]
  );
  const theoretical = useMemo(() => diceSumDistribution(DICE_COUNT, SIDES), []);

  // --- Simulation ---
  const runTrials = useCallback((count: number) => {
    const newSums = simulateDiceSums(count, DICE_COUNT, SIDES);
    // Show last roll
    const lastRoll = rollDice(DICE_COUNT, SIDES);
    setLastDice(lastRoll);
    setLastSum(sum(lastRoll));
    setResults((prev) => [...prev, ...newSums]);
  }, []);

  const handleRoll1 = useCallback(() => runTrials(1), [runTrials]);
  const handleRoll10 = useCallback(() => runTrials(10), [runTrials]);
  const handleRoll100 = useCallback(() => runTrials(100), [runTrials]);
  const handleReset = useCallback(() => {
    setResults([]);
    setLastDice(null);
    setLastSum(null);
  }, []);

  // --- Result panel ---
  const resultPanel = (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800">
        为什么 7 最常见？
      </h3>
      <p className="text-sm text-stone-600">
        {experiment.scene.description}
      </p>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800 mb-2 font-medium">
          两个骰子点数和为 7 的组合有 6 种：
        </p>
        <div className="grid grid-cols-3 gap-1 text-xs font-mono text-amber-700">
          <span>1 + 6</span>
          <span>2 + 5</span>
          <span>3 + 4</span>
          <span>4 + 3</span>
          <span>5 + 2</span>
          <span>6 + 1</span>
        </div>
        <p className="text-xs text-amber-600 mt-2">
          总共 36 种等可能组合中，7 占了 6 种，所以 P(7) = 6/36 = 1/6 ≈ 16.7%
        </p>
      </div>

      {totalTrials > 50 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            你已经进行了 <span className="font-bold font-mono">{totalTrials}</span> 次试验。
            {totalTrials > 200
              ? ' 观察图表——频率分布是否越来越接近理论概率曲线？这就是大数定律的直觉：随机中有规律。'
              : ' 继续增加试验次数，观察频率如何逐渐稳定。'}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <ExperimentContainer experiment={experiment} resultPanel={resultPanel}>
      <div className="p-6 space-y-5">
        {/* === Last roll display === */}
        <div className="flex items-center justify-center gap-4 py-3">
          {lastDice ? (
            <>
              <DiceFace value={lastDice[0]} size={56} />
              <span className="text-2xl text-stone-400 font-light">+</span>
              <DiceFace value={lastDice[1]} size={56} />
              <span className="text-2xl text-stone-400 font-light">=</span>
              <span className="text-4xl font-bold font-mono text-blue-700 w-12 text-center">
                {lastSum}
              </span>
            </>
          ) : (
            <span className="text-stone-400 text-sm">
              点击下方按钮开始模拟
            </span>
          )}
        </div>

        {/* === Controls === */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={handleRoll1}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            掷 1 次
          </button>
          <button
            onClick={handleRoll10}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
          >
            掷 10 次
          </button>
          <button
            onClick={handleRoll100}
            className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 text-sm font-medium"
          >
            掷 100 次
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 text-sm font-medium"
          >
            重置
          </button>
        </div>

        {/* === Trial count === */}
        <p className="text-center text-sm text-stone-500">
          总试验次数：
          <span className="font-mono font-bold text-stone-800">{totalTrials}</span>
        </p>

        {/* === Frequency chart === */}
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
          <h3 className="text-sm font-medium text-stone-700 mb-3">
            点数和频率分布
          </h3>
          <FrequencyChart
            observed={table}
            theoretical={theoretical}
            totalTrials={totalTrials}
          />
        </div>
      </div>
    </ExperimentContainer>
  );
}
