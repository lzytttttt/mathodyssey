'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Experiment } from '@/types/timeline';
import type { ProofItemCategory, ProofState } from '@/lib/math/proof';
import {
  getProofItems,
  canSelectItem,
  getAvailableItems,
  isProofComplete,
  buildProofChain,
  countNecessaryItems,
} from '@/lib/math/proof';
import ExperimentContainer from '../ExperimentContainer';

// ─── Geometry constants (SVG viewBox 600×450) ──────────────────────

const SVG_W = 600;
const SVG_H = 450;

const AX = 200;
const AY = 340;
const BX = 400;
const BY = 340;

const RADIUS = Math.sqrt((BX - AX) ** 2 + (BY - AY) ** 2); // 200

// Intersection of two circles: center A and B, same radius
const MX = (AX + BX) / 2;
const MY = (AY + BY) / 2;
const HALF_BASE = Math.sqrt(RADIUS ** 2 - ((BX - AX) / 2) ** 2);
const CX = MX;
const CY = MY - HALF_BASE; // upper intersection

// ─── Category display config ────────────────────────────────────────

const CATEGORY_ORDER: ProofItemCategory[] = [
  'postulate',
  'common-notion',
  'definition',
  'construction',
  'conclusion',
];

const CATEGORY_LABELS: Record<ProofItemCategory, string> = {
  postulate: '公设 Postulate',
  'common-notion': '公理 Common Notion',
  definition: '定义 Definition',
  construction: '构造 Construction',
  conclusion: '结论 Conclusion',
};

const CATEGORY_DESCRIPTIONS: Record<ProofItemCategory, string> = {
  postulate: '允许的几何构造操作',
  'common-notion': '允许的相等推理规则',
  definition: '说明什么是等边三角形',
  construction: '用直尺和圆规执行的步骤',
  conclusion: '从已知条件推导出最终结论',
};

// ─── Component ──────────────────────────────────────────────────────

interface ProofBuilderLabProps {
  experiment: Experiment;
}

export default function ProofBuilderLab({ experiment }: ProofBuilderLabProps) {
  const goalId = (experiment.scene.initialState.goalId as string) ?? 'conclusion';
  const items = useMemo(() => getProofItems(goalId), [goalId]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);

  const state: ProofState = useMemo(
    () => ({ selectedItems, goalId }),
    [selectedItems, goalId]
  );

  const availableItems = useMemo(
    () => getAvailableItems(state, items),
    [state, items]
  );
  const availableSet = useMemo(
    () => new Set(availableItems.map((i) => i.id)),
    [availableItems]
  );
  const selectedSet = useMemo(() => new Set(selectedItems), [selectedItems]);
  const proofComplete = useMemo(
    () => isProofComplete(state, items),
    [state, items]
  );

  // ─── Handlers ───────────────────────────────────────────────────

  const handleItemClick = useCallback(
    (itemId: string) => {
      const result = canSelectItem(state, itemId, items);
      if (result.valid) {
        setSelectedItems((prev) => [...prev, itemId]);
        setLastError(null);
      } else {
        setLastError(result.reason ?? '无法选择');
      }
    },
    [state, items]
  );

  const reset = useCallback(() => {
    setSelectedItems([]);
    setLastError(null);
  }, []);

  // ─── SVG visibility flags ────────────────────────────────────────

  const showCircleA = selectedSet.has('step-draw-circle-a');
  const showCircleB = selectedSet.has('step-draw-circle-b');
  const showPointC = showCircleA && showCircleB;
  const showAC = selectedSet.has('step-join-ac');
  const showBC = selectedSet.has('step-join-bc');
  const showConclusion = proofComplete;

  // ─── Result panel ────────────────────────────────────────────────

  const proofChain = buildProofChain(state, items);
  const stats = countNecessaryItems(state, items);

  const resultPanel =
    proofChain.length > 0 ? (
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-stone-800">证明链</h4>
        <div className="space-y-2">
          {proofChain.map((item, i) => (
            <div
              key={item.id}
              className="flex items-start gap-3 text-sm"
            >
              <span
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  item.category === 'conclusion'
                    ? 'bg-green-600'
                    : item.category === 'construction'
                      ? 'bg-blue-600'
                      : 'bg-stone-400'
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <span className="font-medium text-stone-800">
                  {item.name}
                </span>
                {item.euclidRef && (
                  <span className="ml-2 text-xs text-stone-400">
                    {item.euclidRef}
                  </span>
                )}
                <p className="text-stone-600 text-xs mt-0.5">
                  {item.statement}
                </p>
              </div>
            </div>
          ))}
        </div>

        {proofComplete && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
            <p className="text-sm font-semibold text-green-800">
              Q.E.D. 证明完成
            </p>
            <p className="text-sm text-green-700 leading-relaxed">
              AC = AB（圆 A 半径），
              BC = BA（圆 B 半径），
              AB = BA（同一线段）。
              根据公理 1（等于同量的量彼此相等），
              AC = AB = BC。
              由等边三角形定义，△ABC 是等边三角形。
            </p>
            {stats.extra > 0 && (
              <p className="text-xs text-amber-700 mt-2">
                你选择了 {stats.total} 个前提，其中{' '}
                {stats.necessary} 个被用到。
                你选择了一些本证明不需要的公设，
                这在探索阶段是允许的。
              </p>
            )}
          </div>
        )}
      </div>
    ) : null;

  // ─── Status bar ──────────────────────────────────────────────────

  const statusBar = (
    <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 text-center">
      <p className="text-xs text-stone-400">
        {proofComplete
          ? '证明完成！欧几里得会感到骄傲。'
          : selectedItems.length === 0
            ? '从公设和公理开始，逐步构建证明'
            : `已选择 ${selectedItems.length} 项，${
                items.length - selectedItems.length
              } 项待选`}
      </p>
    </div>
  );

  return (
    <ExperimentContainer experiment={experiment} resultPanel={resultPanel}>
      <div className="flex flex-col lg:flex-row">
        {/* SVG Canvas */}
        <div className="flex-1 p-4">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full h-auto"
            style={{ touchAction: 'none' }}
          >
            {/* Background */}
            <rect width={SVG_W} height={SVG_H} fill="#fafaf9" rx={12} />

            {/* Circle A */}
            {showCircleA && (
              <circle
                cx={AX}
                cy={AY}
                r={RADIUS}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="8 4"
                className="animate-[fadeIn_0.3s_ease-in]"
                style={{ opacity: 1 }}
              />
            )}

            {/* Circle B */}
            {showCircleB && (
              <circle
                cx={BX}
                cy={BY}
                r={RADIUS}
                fill="none"
                stroke="#f97316"
                strokeWidth={2}
                strokeDasharray="8 4"
                className="animate-[fadeIn_0.3s_ease-in]"
                style={{ opacity: 1 }}
              />
            )}

            {/* Triangle fill (conclusion) */}
            {showConclusion && (
              <polygon
                points={`${AX},${AY} ${BX},${BY} ${CX},${CY}`}
                fill="#dcfce7"
                stroke="#22c55e"
                strokeWidth={2}
              />
            )}

            {/* Segment AB (always visible) */}
            <line
              x1={AX}
              y1={AY}
              x2={BX}
              y2={BY}
              stroke="#57534e"
              strokeWidth={3}
            />

            {/* Segment AC */}
            {showAC && (
              <line
                x1={AX}
                y1={AY}
                x2={CX}
                y2={CY}
                stroke="#3b82f6"
                strokeWidth={3}
              />
            )}

            {/* Segment BC */}
            {showBC && (
              <line
                x1={BX}
                y1={BY}
                x2={CX}
                y2={CY}
                stroke="#f97316"
                strokeWidth={3}
              />
            )}

            {/* Point C */}
            {showPointC && (
              <>
                <circle
                  cx={CX}
                  cy={CY}
                  r={7}
                  fill={showConclusion ? '#22c55e' : '#8b5cf6'}
                  stroke="white"
                  strokeWidth={2}
                />
                <text
                  x={CX}
                  y={CY - 14}
                  textAnchor="middle"
                  fontSize={15}
                  fontWeight={600}
                  fill={showConclusion ? '#16a34a' : '#7c3aed'}
                >
                  C
                </text>
              </>
            )}

            {/* Point A */}
            <circle
              cx={AX}
              cy={AY}
              r={7}
              fill="#3b82f6"
              stroke="white"
              strokeWidth={2}
            />
            <text
              x={AX}
              y={AY + 24}
              textAnchor="middle"
              fontSize={15}
              fontWeight={600}
              fill="#3b82f6"
            >
              A
            </text>

            {/* Point B */}
            <circle
              cx={BX}
              cy={BY}
              r={7}
              fill="#f97316"
              stroke="white"
              strokeWidth={2}
            />
            <text
              x={BX}
              y={BY + 24}
              textAnchor="middle"
              fontSize={15}
              fontWeight={600}
              fill="#f97316"
            >
              B
            </text>

            {/* Q.E.D. label */}
            {showConclusion && (
              <text
                x={CX}
                y={CY + 50}
                textAnchor="middle"
                fontSize={18}
                fontWeight={700}
                fill="#16a34a"
              >
                Q.E.D.
              </text>
            )}

            {/* Side length labels (only when conclusion) */}
            {showConclusion && (
              <>
                <text
                  x={MX}
                  y={AY + 20}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#78716c"
                >
                  AB
                </text>
                <text
                  x={(AX + CX) / 2 - 16}
                  y={(AY + CY) / 2}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#3b82f6"
                >
                  AC
                </text>
                <text
                  x={(BX + CX) / 2 + 16}
                  y={(BY + CY) / 2}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#f97316"
                >
                  BC
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Proof Steps Panel */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-stone-200 bg-white">
          <div
            className="overflow-y-auto p-4"
            style={{ maxHeight: SVG_H }}
          >
            {/* Error message */}
            {lastError && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                {lastError}
              </div>
            )}

            {/* Category groups */}
            {CATEGORY_ORDER.map((category) => {
              const categoryItems = items.filter(
                (i) => i.category === category
              );
              if (categoryItems.length === 0) return null;

              return (
                <div key={category} className="mb-4">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                    {CATEGORY_LABELS[category]}
                  </p>
                  <p className="text-xs text-stone-400 mb-2">
                    {CATEGORY_DESCRIPTIONS[category]}
                  </p>
                  <div className="space-y-1.5">
                    {categoryItems.map((item) => {
                      const isSelected = selectedSet.has(item.id);
                      const isAvailable = availableSet.has(item.id);
                      const isLocked = !isSelected && !isAvailable;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item.id)}
                          disabled={isSelected || isLocked}
                          className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                            isSelected
                              ? 'bg-green-50 border-green-300 text-green-800'
                              : isAvailable
                                ? 'bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100 cursor-pointer'
                                : 'bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-xs">
                              {isSelected
                                ? '✓'
                                : isAvailable
                                  ? '○'
                                  : '🔒'}
                            </span>
                          </div>
                          <p className="text-xs mt-0.5 opacity-80">
                            {item.statement}
                          </p>
                          {isLocked &&
                            item.requires.length > 0 &&
                            !isSelected && (
                              <p className="text-xs mt-1 text-stone-400">
                                需要：
                                {item.requires
                                  .filter(
                                    (reqId) => !selectedSet.has(reqId)
                                  )
                                  .map(
                                    (reqId) =>
                                      items.find((i) => i.id === reqId)
                                        ?.name ?? reqId
                                  )
                                  .join('、')}
                              </p>
                            )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reset button */}
          <div className="p-4 border-t border-stone-100">
            <button
              onClick={reset}
              className="w-full px-4 py-2 text-sm rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors"
            >
              重置证明
            </button>
          </div>
        </div>
      </div>

      {statusBar}
    </ExperimentContainer>
  );
}
