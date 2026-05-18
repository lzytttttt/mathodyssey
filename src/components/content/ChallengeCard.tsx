'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Challenge } from '@/types/timeline';
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/challenges/constants';

interface ChallengeCardProps {
  challenges: Challenge[];
}

export default function ChallengeCard({ challenges }: ChallengeCardProps) {
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, number>>({});

  if (!challenges || challenges.length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">挑战问题</h3>
      <div className="space-y-6">
        {challenges.map((challenge, index) => (
          <div key={challenge.id} className="border border-stone-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-stone-500">
                问题 {index + 1}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded ${DIFFICULTY_COLORS[challenge.difficulty]}`}
              >
                {DIFFICULTY_LABELS[challenge.difficulty]}
              </span>
            </div>
            <p className="text-stone-800 mb-4">{challenge.question}</p>

            {/* 提示 */}
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setShowHint((prev) => ({
                    ...prev,
                    [challenge.id]: (prev[challenge.id] || 0) + 1,
                  }))
                }
              >
                获取提示
              </Button>
              {showHint[challenge.id] > 0 && (
                <div className="mt-2 space-y-1">
                  {challenge.hints.slice(0, showHint[challenge.id]).map((hint, i) => (
                    <p key={i} className="text-sm text-blue-600">
                      💡 {hint}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* 答案 */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setShowAnswer((prev) => ({
                  ...prev,
                  [challenge.id]: !prev[challenge.id],
                }))
              }
            >
              {showAnswer[challenge.id] ? '隐藏答案' : '查看答案'}
            </Button>
            {showAnswer[challenge.id] && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-green-800">
                  答案：{challenge.answer}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  {challenge.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
