'use client';

import { useGamificationStore } from '@/store/gamification';
import { Target, TrendingUp, Zap } from 'lucide-react';

export function ProblemCounter() {
  const weeklyProblems = useGamificationStore((state) => state.weeklyProblems);
  const totalProblems = useGamificationStore((state) => state.totalProblems);
  const soloSolves = useGamificationStore((state) => state.soloSolves);

  // Don't show before first problem
  if (totalProblems === 0) return null;

  const problemLabel = weeklyProblems === 1 ? 'problem' : 'problems';

  return (
    <>
      {/* Weekly problems */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
        <Target className="w-4 h-4" />
        <span className="font-bold text-sm">{weeklyProblems} {problemLabel}</span>
      </div>

      {/* Total problems */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
        <TrendingUp className="w-4 h-4" />
        <span className="font-bold text-sm">{totalProblems} total</span>
      </div>

      {/* Solo solves */}
      {soloSolves > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
          <Zap className="w-4 h-4" />
          <span className="font-bold text-sm">{soloSolves} solo</span>
        </div>
      )}
    </>
  );
}
