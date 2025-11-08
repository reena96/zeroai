'use client';

import { useGamificationStore } from '@/store/gamification';
import { useEffect, useState } from 'react';

/**
 * StreakDisplay Component
 * Shows daily streak prominently in header: "🔥 5 day streak!"
 * Handles singular/plural: "1 day" vs "5 days"
 * Hidden when streak is 0 (first-time users before first problem)
 */
export function StreakDisplay() {
  const currentStreak = useGamificationStore((state) => state.streakData.currentStreak);
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);

  // Check for milestone on mount (in case streak was updated elsewhere)
  useEffect(() => {
    // Milestone messages are handled by celebration component (Story 4.3)
    // This effect is placeholder for future milestone toast integration
  }, [currentStreak]);

  // Don't show streak before first problem solved
  if (currentStreak === 0) {
    return null;
  }

  // Handle singular vs plural
  const dayLabel = currentStreak === 1 ? 'day' : 'days';

  return (
    <div className="flex items-center gap-2 text-orange-600 font-semibold">
      <span className="text-2xl" aria-label="Fire emoji">
        🔥
      </span>
      <span className="text-lg">
        {currentStreak} {dayLabel} streak!
      </span>
    </div>
  );
}
