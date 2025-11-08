'use client';

import { useGamificationStore } from '@/store/gamification';

export function ProblemCounter() {
  const weeklyProblems = useGamificationStore((state) => state.weeklyProblems);
  const totalProblems = useGamificationStore((state) => state.totalProblems);
  const soloSolves = useGamificationStore((state) => state.soloSolves);

  // Don't show before first problem
  if (totalProblems === 0) return null;

  const problemLabel = weeklyProblems === 1 ? 'problem' : 'problems';

  return (
    <div className="flex flex-col items-end gap-1 text-sm">
      {/* Main display: weekly count */}
      <div className="flex items-center gap-2 text-blue-600 font-semibold">
        <span className="text-xl" aria-label="Trophy emoji">💪</span>
        <span>{weeklyProblems} {problemLabel} this week!</span>
      </div>

      {/* Expanded view: total and solo solves */}
      <div className="text-xs text-gray-500">
        {totalProblems} total{soloSolves > 0 && ` • ${soloSolves} solo`}
      </div>
    </div>
  );
}
