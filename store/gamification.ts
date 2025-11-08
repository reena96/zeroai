import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTodayDateString, getYesterdayDateString } from '@/lib/date-utils';

/**
 * Streak Data Structure
 * Stored in localStorage to persist across sessions
 */
export interface StreakData {
  lastUsedDate: string; // e.g., "11/7/2025"
  currentStreak: number; // e.g., 5
  lastCelebratedMilestone?: number; // Track 7, 14, 30 to avoid re-celebrating
}

/**
 * Milestone info returned when a milestone is reached
 */
export interface MilestoneInfo {
  reached: boolean;
  milestone?: number;
  message?: string;
}

/**
 * Gamification Store State
 * Manages daily streaks, problems solved counters, and celebrations
 */
interface GamificationStore {
  streakData: StreakData;

  // Streak actions
  checkAndUpdateStreak: () => MilestoneInfo;
  resetStreak: () => void;
  incrementStreak: () => MilestoneInfo;

  // Problem tracking (for Story 4.2)
  totalProblems: number;
  weeklyProblems: number;
  lastResetDate: string;
  incrementProblemCount: () => void;
}

/**
 * Milestone thresholds
 */
const MILESTONES = [7, 14, 30];

/**
 * Check if current streak matches a milestone and hasn't been celebrated yet
 */
function checkMilestone(currentStreak: number, lastCelebrated?: number): MilestoneInfo {
  const milestone = MILESTONES.find((m) => m === currentStreak);

  if (milestone && milestone !== lastCelebrated) {
    const messages: Record<number, string> = {
      7: '7 day streak - You\'re on fire! 🎉',
      14: '14 day streak - Incredible dedication! 🔥',
      30: '30 day streak - You\'re unstoppable! 🏆',
    };

    return {
      reached: true,
      milestone,
      message: messages[milestone],
    };
  }

  return { reached: false };
}

/**
 * Gamification Zustand Store with localStorage persistence
 */
export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      // Initial streak data
      streakData: {
        lastUsedDate: '',
        currentStreak: 0,
      },

      // Problem tracking (Story 4.2)
      totalProblems: 0,
      weeklyProblems: 0,
      lastResetDate: getTodayDateString(),

      /**
       * Check and update streak based on last used date
       * Call this on app mount and when student solves a problem
       *
       * Logic:
       * - Same day (lastUsedDate === today): No change
       * - Consecutive day (lastUsedDate === yesterday): Increment streak
       * - Missed day (lastUsedDate < yesterday): Reset to 1
       * - First time (no data): Initialize to 0 (will increment to 1 on first problem)
       */
      checkAndUpdateStreak: () => {
        const today = getTodayDateString();
        const yesterday = getYesterdayDateString();
        const { streakData } = get();

        try {
          // Same day - no update needed
          if (streakData.lastUsedDate === today) {
            return { reached: false };
          }

          // Consecutive day - increment streak
          if (streakData.lastUsedDate === yesterday) {
            const newStreak = streakData.currentStreak + 1;
            const milestone = checkMilestone(newStreak, streakData.lastCelebratedMilestone);

            set({
              streakData: {
                lastUsedDate: today,
                currentStreak: newStreak,
                lastCelebratedMilestone: milestone.reached
                  ? milestone.milestone
                  : streakData.lastCelebratedMilestone,
              },
            });

            return milestone;
          }

          // Missed day or first use - reset to 1 (user is active today)
          set({
            streakData: {
              lastUsedDate: today,
              currentStreak: 1,
              lastCelebratedMilestone: undefined, // Reset milestones on streak break
            },
          });

          return { reached: false };
        } catch (error) {
          console.error('[gamification] Error updating streak:', error);
          // On error, initialize to safe default
          set({
            streakData: {
              lastUsedDate: today,
              currentStreak: 1,
            },
          });
          return { reached: false };
        }
      },

      /**
       * Manually increment streak (called when student solves first problem of the day)
       */
      incrementStreak: () => {
        return get().checkAndUpdateStreak();
      },

      /**
       * Reset streak to 0 (for testing or manual reset)
       */
      resetStreak: () => {
        set({
          streakData: {
            lastUsedDate: '',
            currentStreak: 0,
            lastCelebratedMilestone: undefined,
          },
        });
      },

      /**
       * Increment problem count (Story 4.2)
       */
      incrementProblemCount: () => {
        const { totalProblems, weeklyProblems, lastResetDate } = get();
        const today = getTodayDateString();

        // Check if we need to reset weekly counter (simple approach for MVP)
        // In production, would use proper week calculation
        const needsReset = lastResetDate !== today;

        set({
          totalProblems: totalProblems + 1,
          weeklyProblems: needsReset ? 1 : weeklyProblems + 1,
          lastResetDate: today,
        });
      },
    }),
    {
      name: 'zeroai-gamification', // localStorage key
    }
  )
);
