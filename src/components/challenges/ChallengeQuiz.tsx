'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { validateAnswer } from '@/lib/challenges/validation';
import { DIFFICULTY_LABELS } from '@/lib/challenges/constants';
import { colors } from '@/styles/tokens';
import type { Challenge } from '@/types/timeline';

interface ChallengeQuizProps {
  challenges: Challenge[];
}

type QuizPhase = 'answering' | 'feedback' | 'results';

interface QuestionResult {
  challengeId: string;
  correct: boolean;
  userAnswer: string;
}

export default function ChallengeQuiz({ challenges }: ChallengeQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [phase, setPhase] = useState<QuizPhase>('answering');
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);

  if (!challenges || challenges.length === 0) return null;

  const current = challenges[currentIndex];
  const totalCorrect = results.filter((r) => r.correct).length;

  function handleSubmit() {
    if (!userInput.trim()) return;
    const correct = validateAnswer(userInput, current.answer);
    setIsCorrect(correct);
    setPhase('feedback');
  }

  function handleNext() {
    const newResults = [
      ...results,
      { challengeId: current.id, correct: isCorrect, userAnswer: userInput },
    ];
    setResults(newResults);

    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setIsCorrect(false);
      setHintCount(0);
      setPhase('answering');
    } else {
      setPhase('results');
    }
  }

  function handleRetry() {
    setUserInput('');
    setPhase('answering');
  }

  function handleRestart() {
    setCurrentIndex(0);
    setUserInput('');
    setPhase('answering');
    setIsCorrect(false);
    setHintCount(0);
    setResults([]);
  }

  // Results screen
  if (phase === 'results') {
    const percentage = Math.round((totalCorrect / challenges.length) * 100);
    return (
      <Card variant="glass" className="p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">⚡ 挑战结果</h3>
        <div className="text-center mb-6">
          {/* Ring chart */}
          <div className="relative w-24 h-24 mx-auto mb-3">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle
                cx="18" cy="18" r="16"
                fill="none"
                stroke="var(--border-color)"
                strokeWidth="2"
              />
              <circle
                cx="18" cy="18" r="16"
                fill="none"
                stroke={percentage >= 80 ? '#22c55e' : percentage >= 50 ? '#eab308' : '#ef4444'}
                strokeWidth="2"
                strokeDasharray={`${percentage} ${100 - percentage}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[var(--text-primary)]">
              {percentage}%
            </span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] mb-1">
            {totalCorrect} / {challenges.length}
          </p>
          <p className="text-[var(--text-muted)]">
            {totalCorrect === challenges.length
              ? '🎉 全部答对，太棒了！'
              : totalCorrect > 0
                ? '💪 继续加油！'
                : '🔄 再试一次吧！'}
          </p>
        </div>
        <div className="space-y-3 mb-6">
          {results.map((result, i) => {
            const challenge = challenges.find((c) => c.id === result.challengeId);
            if (!challenge) return null;
            return (
              <div key={result.challengeId} className="flex items-start gap-3 text-sm">
                <span
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    result.correct
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {result.correct ? '✓' : '✗'}
                </span>
                <div className="min-w-0">
                  <p className="text-[var(--text-primary)] truncate">
                    {i + 1}. {challenge.question}
                  </p>
                  {!result.correct && (
                    <p className="text-[var(--text-muted)] mt-0.5">
                      正确答案：{challenge.answer}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <Button variant="outline" onClick={handleRestart}>
          再试一次
        </Button>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">⚡ 挑战问题</h3>

      {/* Gradient progress bar */}
      <div className="flex items-center gap-1 mb-4">
        {challenges.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i < currentIndex
                ? results[i]?.correct
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : 'bg-gradient-to-r from-red-400 to-red-500'
                : i === currentIndex
                  ? 'bg-gradient-to-r from-blue-400 to-indigo-500'
                  : 'bg-[var(--border-color)]'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="border border-[var(--border-color)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-[var(--text-muted)]">
            问题 {currentIndex + 1} / {challenges.length}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: colors.difficulty[current.difficulty] + '15',
              color: colors.difficulty[current.difficulty],
            }}
          >
            {DIFFICULTY_LABELS[current.difficulty]}
          </span>
        </div>

        <p className="text-[var(--text-primary)] mb-4">{current.question}</p>

        {/* Hints */}
        {hintCount > 0 && (
          <div className="mb-4 space-y-1.5 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-800/30">
            {current.hints.slice(0, hintCount).map((hint, i) => (
              <p key={i} className="text-sm text-blue-700 dark:text-blue-400">
                💡 {hint}
              </p>
            ))}
          </div>
        )}

        {phase === 'answering' && (
          <div className="space-y-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="输入你的答案..."
              className="w-full px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
            />
            <div className="flex gap-2">
              <Button variant="gradient" size="sm" onClick={handleSubmit}>
                提交答案
              </Button>
              {hintCount < current.hints.length && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHintCount(hintCount + 1)}
                >
                  💡 获取提示
                </Button>
              )}
            </div>
          </div>
        )}

        {phase === 'feedback' && (
          <div className="space-y-3">
            <div
              className={`p-4 rounded-xl ${
                isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/30'
                  : 'bg-red-50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30'
              }`}
            >
              <p
                className={`font-medium ${
                  isCorrect
                    ? 'text-emerald-800 dark:text-emerald-400'
                    : 'text-red-800 dark:text-red-400'
                }`}
              >
                {isCorrect ? '🎉 回答正确！' : '❌ 回答错误'}
              </p>
              <p
                className={`text-sm mt-1 ${
                  isCorrect
                    ? 'text-emerald-700 dark:text-emerald-500'
                    : 'text-red-700 dark:text-red-500'
                }`}
              >
                {current.explanation}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="gradient" size="sm" onClick={handleNext}>
                {currentIndex + 1 < challenges.length ? '下一题' : '查看结果'}
              </Button>
              {!isCorrect && (
                <Button variant="ghost" size="sm" onClick={handleRetry}>
                  再试一次
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
