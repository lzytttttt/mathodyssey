'use client';

import { useState, useCallback } from 'react';
import type { Experiment } from '@/types/timeline';
import FormulaDisplay from '@/components/math/FormulaDisplay';
import ExperimentContainer from '../ExperimentContainer';
import PlaceValueBlocks from './PlaceValueBlocks';
import {
  clampInteger,
  decimalToSexagesimal,
  formatSexagesimal,
  decimalSecondsToHMS,
  placeValueBreakdown,
} from '@/lib/math/numberSystems';

const MIN = 0;
const MAX = 10000;
const BASE = 60;

interface BabylonianBaseLabProps {
  experiment: Experiment;
}

export default function BabylonianBaseLab({
  experiment,
}: BabylonianBaseLabProps) {
  // --- Read initial state from JSON config ---
  const initialState = experiment.scene.initialState;
  const initialValue =
    typeof initialState.decimalValue === 'number'
      ? initialState.decimalValue
      : 125;
  const showFactors =
    typeof initialState.showFactors === 'boolean'
      ? initialState.showFactors
      : true;

  // --- State ---
  const [value, setValue] = useState(clampInteger(initialValue, MIN, MAX));
  const [inputStr, setInputStr] = useState(String(value));
  const [inputError, setInputError] = useState(false);

  // --- Derived ---
  const digits = decimalToSexagesimal(value);
  const sexStr = formatSexagesimal(digits);
  const breakdown = placeValueBreakdown(value, BASE);
  const hms = decimalSecondsToHMS(value);

  // --- Angle display (same structure, different labels) ---
  const angleDisplay = digits.length === 3
    ? `${digits[0]}° ${digits[1]}′ ${digits[2]}″`
    : digits.length === 2
    ? `0° ${digits[0]}′ ${digits[1]}″`
    : `0° 0′ ${digits[0]}″`;

  // --- Handlers ---
  const updateValue = useCallback((v: number) => {
    const clamped = clampInteger(v, MIN, MAX);
    setValue(clamped);
    setInputStr(String(clamped));
    setInputError(false);
  }, []);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateValue(Number(e.target.value));
    },
    [updateValue]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setInputStr(raw);
      if (raw.trim() === '') {
        setInputError(false);
        return;
      }
      const num = Number(raw);
      if (Number.isNaN(num)) {
        setInputError(true);
        return;
      }
      setInputError(false);
      updateValue(num);
    },
    [updateValue]
  );

  const handleInputBlur = useCallback(() => {
    if (inputStr.trim() === '') {
      updateValue(0);
    }
  }, [inputStr, updateValue]);

  // --- Result panel ---
  const resultPanel = (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800">60 的因数优势</h3>
      {showFactors && (
        <div>
          <p className="text-sm text-stone-600 mb-2">
            60 有 12 个因数，比 10 多得多，分数计算更方便：
          </p>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60].map((f) => (
              <span
                key={f}
                className="px-2 py-1 bg-amber-50 border border-amber-200 rounded text-sm font-mono text-amber-800"
              >
                {f}
              </span>
            ))}
          </div>
          <p className="text-sm text-stone-500 mt-2">
            10 只有 4 个因数：1, 2, 5, 10
          </p>
        </div>
      )}
      <div className="p-3 bg-stone-50 rounded-lg">
        <FormulaDisplay
          formula="123_{10} = 2 \times 60 + 3 = 2{;}03_{60}"
          displayMode={false}
          className="text-sm"
        />
      </div>
    </div>
  );

  return (
    <ExperimentContainer experiment={experiment} resultPanel={resultPanel}>
      <div className="p-6 space-y-6">
        {/* === Input area === */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="text-sm text-stone-600 w-20 shrink-0">
              十进制数
            </label>
            <input
              type="range"
              min={MIN}
              max={MAX}
              step={1}
              value={value}
              onChange={handleSliderChange}
              className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-lg font-mono font-bold text-stone-800 w-16 text-right">
              {value}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-stone-600 w-20 shrink-0">
              直接输入
            </label>
            <input
              type="number"
              min={MIN}
              max={MAX}
              value={inputStr}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={`w-32 px-3 py-1.5 border rounded-lg text-sm font-mono ${
                inputError
                  ? 'border-red-400 bg-red-50'
                  : 'border-stone-300 bg-white'
              }`}
            />
            {inputError && (
              <span className="text-xs text-red-500">请输入有效数字</span>
            )}
          </div>
        </div>

        {/* === 60 进制表示 === */}
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
          <h3 className="text-sm font-medium text-amber-800 mb-3">
            60 进制表示
          </h3>
          <div className="flex items-end justify-center gap-1">
            {digits.map((d, i) => {
              const power = digits.length - 1 - i;
              return (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-xs text-amber-600 mb-1">
                    60<sup>{power}</sup>
                  </span>
                  <span className="text-3xl font-bold font-mono text-amber-900 bg-white px-3 py-1 rounded-lg border border-amber-300 min-w-[48px] text-center">
                    {d}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-center mt-3 text-sm text-amber-700 font-mono">
            {value}<sub>10</sub> = {sexStr}<sub>60</sub>
          </p>
        </div>

        {/* === 位值拆解 === */}
        <div className="p-5 bg-stone-50 border border-stone-200 rounded-xl">
          <h3 className="text-sm font-medium text-stone-700 mb-3">
            位值拆解
          </h3>
          <PlaceValueBlocks breakdown={breakdown} base={BASE} />
          <div className="mt-3 pt-3 border-t border-stone-200">
            <p className="text-sm font-mono text-stone-700 text-center">
              {value} ={' '}
              {breakdown.map((b, i) => (
                <span key={i}>
                  {i > 0 && ' + '}
                  {b.digit}×{b.weight}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* === 现代连接 === */}
        <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="text-sm font-medium text-blue-800 mb-3">
            60 进制在今天的痕迹
          </h3>
          <p className="text-xs text-blue-600 mb-3">
            同样的 60 进制结构被保留在时间和角度的计量中：
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-500 mb-1">
                ⏰ 如果 {value} 表示秒数
              </p>
              <p className="text-lg font-mono font-bold text-blue-900">
                {hms.display}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-500 mb-1">
                📐 如果 {value} 表示角秒
              </p>
              <p className="text-lg font-mono font-bold text-blue-900">
                {angleDisplay}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ExperimentContainer>
  );
}
