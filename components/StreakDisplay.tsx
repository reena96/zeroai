'use client';

import { useGamificationStore } from '@/store/gamification';
import { Flame } from 'lucide-react';

/**
 * StreakDisplay Component
 * Shows daily streak prominently in header with modern design
 * Handles singular/plural: "1 day" vs "5 days"
 * Hidden when streak is 0 (first-time users before first problem)
 */
export function StreakDisplay() {
  const currentStreak = useGamificationStore((state) => state.streakData.currentStreak);

  // Don't show streak before first problem solved
  if (currentStreak === 0) {
    return null;
  }

  // Handle singular vs plural
  const dayLabel = currentStreak === 1 ? 'day' : 'days';

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
      <Flame className="w-4 h-4" />
      <span className="font-bold text-sm">
        {currentStreak} {dayLabel} streak
      </span>
    </div>
  );
}
