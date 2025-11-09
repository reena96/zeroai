import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTodayDateString, getYesterdayDateString, getWeekNumber } from '@/lib/date-utils';

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

  // Problem tracking (Story 4.2)
  totalProblems: number;
  weeklyProblems: number;
  soloSolves: number;
  lastResetDate: string;
  lastCelebratedProblemMilestone?: number;
  incrementProblemCount: (isSoloSolve?: boolean) => MilestoneInfo;
}

/**
 * Milestone thresholds
 */
const STREAK_MILESTONES = [7, 14, 30];
const PROBLEM_MILESTONES = [10, 25, 50, 100];

/**
 * Check if current streak matches a milestone and hasn't been celebrated yet
 */
function checkStreakMilestone(currentStreak: number, lastCelebrated?: number): MilestoneInfo {
  const milestone = STREAK_MILESTONES.find((m) => m === currentStreak);

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
 * Check if current problem count matches a milestone and hasn't been celebrated yet
 */
function checkProblemMilestone(totalProblems: number, lastCelebrated?: number): MilestoneInfo {
  const milestone = PROBLEM_MILESTONES.find((m) => m === totalProblems);

  if (milestone && milestone !== lastCelebrated) {
    const messages: Record<number, string> = {
      10: '10 problems solved - Great start! 🎉',
      25: '25 problems - You\'re building momentum! 💪',
      50: '50 problems - Halfway to mastery! 🌟',
      100: '100 problems - You\'re unstoppable! 🏆',
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
      soloSolves: 0,
      lastResetDate: getWeekNumber(new Date()),
      lastCelebratedProblemMilestone: undefined,

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
            const milestone = checkStreakMilestone(newStreak, streakData.lastCelebratedMilestone);

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
       * @param isSoloSolve - Whether this problem was solved without using the confused button
       * @returns MilestoneInfo if a problem milestone was reached
       */
      incrementProblemCount: (isSoloSolve = false) => {
        const { totalProblems, weeklyProblems, soloSolves, lastResetDate, lastCelebratedProblemMilestone } = get();

        try {
          // Get current week number
          const currentWeek = getWeekNumber(new Date());

          // Check if we need to reset weekly counter (different week)
          const needsWeeklyReset = lastResetDate !== currentWeek;

          // Calculate new values
          const newTotalProblems = totalProblems + 1;
          const newWeeklyProblems = needsWeeklyReset ? 1 : weeklyProblems + 1;
          const newSoloSolves = isSoloSolve ? soloSolves + 1 : soloSolves;

          // Check for milestone
          const milestone = checkProblemMilestone(newTotalProblems, lastCelebratedProblemMilestone);

          // Update store
          set({
            totalProblems: newTotalProblems,
            weeklyProblems: newWeeklyProblems,
            soloSolves: newSoloSolves,
            lastResetDate: currentWeek,
            lastCelebratedProblemMilestone: milestone.reached
              ? milestone.milestone
              : lastCelebratedProblemMilestone,
          });

          return milestone;
        } catch (error) {
          console.error('[gamification] Error incrementing problem count:', error);
          // On error, still increment but skip milestone check
          set({
            totalProblems: totalProblems + 1,
            weeklyProblems: weeklyProblems + 1,
          });
          return { reached: false };
        }
      },
    }),
    {
      name: 'zeroai-gamification', // localStorage key
    }
  )
);
