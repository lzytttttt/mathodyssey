'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ───

interface ChallengeScore {
  correct: number;
  total: number;
}

interface ProgressData {
  visitedNodes: string[];
  completedExperiments: string[];
  challengeScores: Record<string, ChallengeScore>;
  theme: 'light' | 'dark';
}

interface UseProgressReturn {
  /** All visited node IDs */
  visitedNodes: string[];
  /** All completed experiment IDs */
  completedExperiments: string[];
  /** Challenge scores by node ID */
  challengeScores: Record<string, ChallengeScore>;
  /** Current theme */
  theme: 'light' | 'dark';
  /** Mark a node as visited */
  markNodeVisited: (nodeId: string) => void;
  /** Mark an experiment as completed */
  markExperimentCompleted: (experimentId: string) => void;
  /** Save challenge score for a node */
  saveChallengeScore: (nodeId: string, correct: number, total: number) => void;
  /** Toggle theme between light and dark */
  toggleTheme: () => void;
  /** Set theme explicitly */
  setTheme: (theme: 'light' | 'dark') => void;
  /** Check if a node has been visited */
  isNodeVisited: (nodeId: string) => boolean;
  /** Check if an experiment has been completed */
  isExperimentCompleted: (experimentId: string) => boolean;
  /** Get progress percentage (0-100) */
  getProgressPercent: (totalNodes: number) => number;
  /** Get recommended next node (first unvisited) */
  getNextRecommended: (allNodeIds: string[]) => string | null;
  /** Reset all progress */
  resetProgress: () => void;
}

// ─── Constants ───

const STORAGE_KEY = 'mathodyssey-progress';

const DEFAULT_PROGRESS: ProgressData = {
  visitedNodes: [],
  completedExperiments: [],
  challengeScores: {},
  theme: 'light',
};

// ─── Helpers ───

function loadProgress(): ProgressData {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      visitedNodes: Array.isArray(parsed.visitedNodes) ? parsed.visitedNodes : [],
      completedExperiments: Array.isArray(parsed.completedExperiments)
        ? parsed.completedExperiments
        : [],
      challengeScores:
        typeof parsed.challengeScores === 'object' && parsed.challengeScores !== null
          ? parsed.challengeScores
          : {},
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgress(data: ProgressData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage might be full or unavailable
  }
}

// ─── Hook ───

export function useProgress(): UseProgressReturn {
  const [data, setData] = useState<ProgressData>(DEFAULT_PROGRESS);

  // Load from localStorage after hydration
  useEffect(() => {
    const loaded = loadProgress();
    setData(loaded); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: SSR hydration requires post-mount state sync from localStorage
    document.documentElement.setAttribute('data-theme', loaded.theme);
  }, []);

  // Persist changes to localStorage (skip the initial default write)
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    saveProgress(data);
  }, [data]);

  const markNodeVisited = useCallback((nodeId: string) => {
    setData((prev) => {
      if (prev.visitedNodes.includes(nodeId)) return prev;
      return { ...prev, visitedNodes: [...prev.visitedNodes, nodeId] };
    });
  }, []);

  const markExperimentCompleted = useCallback((experimentId: string) => {
    setData((prev) => {
      if (prev.completedExperiments.includes(experimentId)) return prev;
      return {
        ...prev,
        completedExperiments: [...prev.completedExperiments, experimentId],
      };
    });
  }, []);

  const saveChallengeScore = useCallback(
    (nodeId: string, correct: number, total: number) => {
      setData((prev) => ({
        ...prev,
        challengeScores: {
          ...prev.challengeScores,
          [nodeId]: { correct, total },
        },
      }));
    },
    []
  );

  const toggleTheme = useCallback(() => {
    setData((prev) => {
      const newTheme = prev.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      return { ...prev, theme: newTheme };
    });
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', theme);
    setData((prev) => ({ ...prev, theme }));
  }, []);

  const isNodeVisited = useCallback(
    (nodeId: string) => data.visitedNodes.includes(nodeId),
    [data.visitedNodes]
  );

  const isExperimentCompleted = useCallback(
    (experimentId: string) => data.completedExperiments.includes(experimentId),
    [data.completedExperiments]
  );

  const getProgressPercent = useCallback(
    (totalNodes: number) => {
      if (totalNodes <= 0) return 0;
      return Math.round((data.visitedNodes.length / totalNodes) * 100);
    },
    [data.visitedNodes.length]
  );

  const getNextRecommended = useCallback(
    (allNodeIds: string[]) => {
      return allNodeIds.find((id) => !data.visitedNodes.includes(id)) ?? null;
    },
    [data.visitedNodes]
  );

  const resetProgress = useCallback(() => {
    setData(DEFAULT_PROGRESS);
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return {
    visitedNodes: data.visitedNodes,
    completedExperiments: data.completedExperiments,
    challengeScores: data.challengeScores,
    theme: data.theme,
    markNodeVisited,
    markExperimentCompleted,
    saveChallengeScore,
    toggleTheme,
    setTheme,
    isNodeVisited,
    isExperimentCompleted,
    getProgressPercent,
    getNextRecommended,
    resetProgress,
  };
}
