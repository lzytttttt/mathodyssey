'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { validateAnswer } from '@/lib/challenges/validation';
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/challenges/constants';
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
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">挑战结果</h3>
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-stone-800 mb-2">
            {totalCorrect} / {challenges.length}
          </p>
          <p className="text-stone-500">
            {totalCorrect === challenges.length
              ? '全部答对，太棒了！'
              : totalCorrect > 0
                ? '继续加油！'
                : '再试一次吧！'}
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
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {result.correct ? '✓' : '✗'}
                </span>
                <div className="min-w-0">
                  <p className="text-stone-700 truncate">
                    {i + 1}. {challenge.question}
                  </p>
                  {!result.correct && (
                    <p className="text-stone-500 mt-0.5">
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
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">挑战问题</h3>

      {/* Progress indicator */}
      <div className="flex items-center gap-1 mb-4">
        {challenges.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              i < currentIndex
                ? results[i]?.correct
                  ? 'bg-green-400'
                  : 'bg-red-400'
                : i === currentIndex
                  ? 'bg-blue-400'
                  : 'bg-stone-200'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="border border-stone-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-stone-500">
            问题 {currentIndex + 1} / {challenges.length}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded ${DIFFICULTY_COLORS[current.difficulty]}`}
          >
            {DIFFICULTY_LABELS[current.difficulty]}
          </span>
        </div>

        <p className="text-stone-800 mb-4">{current.question}</p>

        {/* Hints */}
        {hintCount > 0 && (
          <div className="mb-4 space-y-1">
            {current.hints.slice(0, hintCount).map((hint, i) => (
              <p key={i} className="text-sm text-blue-600">
                {hint}
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
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleSubmit}>
                提交答案
              </Button>
              {hintCount < current.hints.length && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHintCount(hintCount + 1)}
                >
                  获取提示
                </Button>
              )}
            </div>
          </div>
        )}

        {phase === 'feedback' && (
          <div className="space-y-3">
            <div
              className={`p-3 rounded-lg ${
                isCorrect ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <p
                className={`font-medium ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {isCorrect ? '回答正确！' : '回答错误'}
              </p>
              <p
                className={`text-sm mt-1 ${
                  isCorrect ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {current.explanation}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleNext}>
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
