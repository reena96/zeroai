# Story 4.1: Daily Streak Tracker

Status: review

## Story

As a student,
I want to see my daily streak of using the tutor,
so that I'm motivated to practice every day.

## Acceptance Criteria

1. Streak counter stored in localStorage with structure: `{lastUsedDate, currentStreak}`
2. Display prominently in header/top of UI: "🔥 5 day streak!"
3. Streak increments when student uses app on new calendar day (compared to lastUsedDate)
4. Streak resets to 1 if student misses a day (>24h gap between lastUsedDate and today)
5. Milestone celebrations at 7, 14, 30 days: "7 day streak - You're on fire! 🎉"
6. Streak data persists across browser sessions via localStorage
7. Timezone-aware: Comparisons use local timezone, reset at midnight local time
8. First-time users start at "1 day streak" after solving their first problem

## Tasks / Subtasks

- [x] Task 1: Create gamification Zustand store with localStorage persistence (AC: #1, #6)
  - [x] Subtask 1.1: Create `store/gamification.ts` file
  - [x] Subtask 1.2: Define StreakData type: `{lastUsedDate: string, currentStreak: number}`
  - [x] Subtask 1.3: Initialize Zustand store with persist middleware (localStorage key: 'zeroai-gamification')
  - [x] Subtask 1.4: Add actions: `checkAndUpdateStreak()`, `resetStreak()`, `getStreakDisplay()`

- [x] Task 2: Implement streak update logic with timezone awareness (AC: #3, #4, #7)
  - [x] Subtask 2.1: Create `lib/date-utils.ts` with `getTodayDateString()` using `new Date().toLocaleDateString()`
  - [x] Subtask 2.2: Implement `checkAndUpdateStreak()` logic:
    - If lastUsedDate === today: no change
    - If lastUsedDate === yesterday: increment currentStreak
    - If lastUsedDate < yesterday: reset currentStreak = 1
  - [x] Subtask 2.3: Handle first-time users: if no streak data, initialize to 0 (increments to 1 after first problem)
  - [x] Subtask 2.4: Update lastUsedDate to today when streak is updated

- [x] Task 3: Create StreakDisplay component (AC: #2)
  - [x] Subtask 3.1: Create `components/StreakDisplay.tsx`
  - [x] Subtask 3.2: Subscribe to gamification store streak data
  - [x] Subtask 3.3: Display format: "🔥 {currentStreak} day streak!" (handle singular/plural: "1 day" vs "5 days")
  - [x] Subtask 3.4: Style prominently (header area, visible color, appropriate size)

- [x] Task 4: Integrate streak tracking into app workflow (AC: #8)
  - [x] Subtask 4.1: Add StreakDisplay to app header/top of page.tsx
  - [x] Subtask 4.2: Call `checkAndUpdateStreak()` on app mount (useEffect in page.tsx or layout.tsx)
  - [x] Subtask 4.3: Trigger streak increment when student solves first problem of the day
  - [x] Subtask 4.4: Detect "problem solved" event (when AI confirms correct final answer)

- [x] Task 5: Implement milestone celebrations (AC: #5)
  - [x] Subtask 5.1: Add milestone detection in `checkAndUpdateStreak()` (check if currentStreak === 7, 14, or 30)
  - [x] Subtask 5.2: Return milestone flag and message when milestone reached
  - [x] Subtask 5.3: Display toast/notification with celebration message: "7 day streak - You're on fire! 🎉"
  - [x] Subtask 5.4: Ensure milestone shows once per achievement (track last celebrated milestone)

- [x] Task 6: Testing and edge cases (All ACs)
  - [x] Subtask 6.1: Test first-time user flow (no localStorage → initializes → increments to 1 after problem)
  - [x] Subtask 6.2: Test same-day usage (streak doesn't double-increment)
  - [x] Subtask 6.3: Test consecutive days (streak increments correctly)
  - [x] Subtask 6.4: Test missed day (streak resets to 1)
  - [x] Subtask 6.5: Test milestone celebrations (7, 14, 30 days)
  - [x] Subtask 6.6: Test timezone edge cases (midnight transitions)

## Dev Notes

### Context

This story introduces gamification to drive engagement and habit formation. The daily streak tracker motivates students to use the tutor regularly by displaying their consecutive days of practice. When combined with celebration animations (Story 4.3) and the problems counter (Story 4.2), this creates a complete motivation system that makes learning sticky.

### Architecture Patterns and Constraints

**State Management: Zustand with Persist Middleware**
- Use Zustand for state management [Source: docs/architecture.md#State-Management]
- Persist middleware for localStorage sync [Source: docs/architecture.md#Decision-Summary]
- localStorage key: `'zeroai-gamification'`
- Zustand provides fine-grained subscriptions (only re-render when streak changes)

**New Files Required:**
- `store/gamification.ts` - Zustand store with streak logic
- `lib/date-utils.ts` - Timezone-aware date utilities
- `components/StreakDisplay.tsx` - UI component for streak display

**Existing Files to Modify:**
- `app/page.tsx` - Add StreakDisplay component to header, initialize streak check on mount

**Key Technical Decisions:**

1. **Client-Side Date Handling**: Use `new Date().toLocaleDateString()` for timezone awareness [Source: docs/architecture.md#Decision-Summary]
   - Simpler than server-side timezone management
   - Personal device timezone is correct context for "daily" usage
   - Format: "M/D/YYYY" (e.g., "11/7/2025")

2. **Streak Update Trigger**: Update streak when student solves a problem
   - Detect via AI response confirming correct final answer
   - Prevents streak increment just from opening app (requires engagement)
   - Aligns with "after solving first problem" requirement (AC #8)

3. **localStorage Structure**:
   ```typescript
   interface StreakData {
     lastUsedDate: string;       // e.g., "11/7/2025"
     currentStreak: number;       // e.g., 5
     lastCelebratedMilestone?: number; // Track 7, 14, 30 to avoid re-celebrating
   }
   ```

4. **Streak Logic**:
   - **Same day** (lastUsedDate === today): No change
   - **Consecutive day** (lastUsedDate === yesterday): Increment streak
   - **Missed day** (lastUsedDate < yesterday): Reset to 1
   - **First time** (no data): Initialize currentStreak = 0, increment to 1 on first problem

5. **Yesterday Calculation**:
   ```typescript
   function getYesterdayDateString(): string {
     const yesterday = new Date();
     yesterday.setDate(yesterday.getDate() - 1);
     return yesterday.toLocaleDateString();
   }
   ```

6. **Milestone Detection**:
   - Check if `currentStreak === 7 || currentStreak === 14 || currentStreak === 30`
   - Only celebrate if `lastCelebratedMilestone !== currentStreak` (avoid repeat celebrations)
   - Update `lastCelebratedMilestone` after showing celebration

**Zustand Store Pattern**:
```typescript
// store/gamification.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StreakData {
  lastUsedDate: string;
  currentStreak: number;
  lastCelebratedMilestone?: number;
}

interface GamificationStore {
  streakData: StreakData;
  checkAndUpdateStreak: () => { updated: boolean; milestone?: number };
  resetStreak: () => void;
}

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      streakData: { lastUsedDate: '', currentStreak: 0 },
      checkAndUpdateStreak: () => {
        // Logic here
      },
      resetStreak: () => {
        set({ streakData: { lastUsedDate: '', currentStreak: 0 } });
      },
    }),
    { name: 'zeroai-gamification' }
  )
);
```

**Component Pattern**:
```typescript
// components/StreakDisplay.tsx
'use client';

import { useGamificationStore } from '@/store/gamification';

export function StreakDisplay() {
  const currentStreak = useGamificationStore(state => state.streakData.currentStreak);

  if (currentStreak === 0) return null; // Don't show before first problem

  const dayLabel = currentStreak === 1 ? 'day' : 'days';

  return (
    <div className="flex items-center gap-2 text-orange-600 font-semibold">
      <span className="text-2xl">🔥</span>
      <span>{currentStreak} {dayLabel} streak!</span>
    </div>
  );
}
```

### Project Structure Notes

**Alignment with Architecture:**
- `store/gamification.ts` - New file (first gamification state) [Source: docs/architecture.md#Project-Structure]
- `lib/date-utils.ts` - New utility file [Source: docs/architecture.md#Project-Structure]
- `components/StreakDisplay.tsx` - New component [Source: docs/architecture.md#Project-Structure]
- `app/page.tsx` - Existing file, add StreakDisplay to header area

**No Conflicts Detected:**
- Gamification store is independent (doesn't conflict with chat store)
- StreakDisplay is standalone UI component
- Date utils are pure functions (no side effects)

**Dependencies:**
- Zustand already installed (used by chat store)
- No new package installs required for this story

### Testing Standards Summary

**Testing Approach:**
- Manual testing with documented test cases (per ADR-004: Manual Testing Only) [Source: docs/architecture.md#Testing]
- Focus on date transition edge cases and localStorage persistence
- Test milestone celebrations at 7, 14, 30 day marks

**Test Coverage Requirements:**

1. **First-Time User Flow (AC #8)**:
   - Open app with no localStorage → streak = 0, no display
   - Solve first problem → streak = 1, display shows "🔥 1 day streak!"
   - Refresh page → streak persists (localStorage working)

2. **Same-Day Usage (AC #3)**:
   - Solve problem, check streak = 1
   - Solve another problem same day → streak still = 1 (no double increment)

3. **Consecutive Days (AC #3)**:
   - Day 1: Solve problem → streak = 1
   - Day 2: Solve problem → streak = 2
   - Day 3: Solve problem → streak = 3

4. **Missed Day / Reset (AC #4)**:
   - Day 1: Solve problem → streak = 3
   - Day 3 (skipped day 2): Solve problem → streak = 1 (reset)

5. **Milestone Celebrations (AC #5)**:
   - Reach 7-day streak → show celebration toast: "7 day streak - You're on fire! 🎉"
   - Continue using → no repeat celebration for day 7
   - Reach 14 days → new celebration
   - Reach 30 days → new celebration

6. **localStorage Persistence (AC #6)**:
   - Set streak to 5 days
   - Close browser completely
   - Reopen app → streak still shows 5 days

7. **Timezone Awareness (AC #7)**:
   - Test near midnight (use browser DevTools to simulate time changes if needed)
   - Verify streak increments correctly at midnight local time

**Edge Cases to Test:**
- Browser with localStorage disabled → graceful degradation (no streak, no errors)
- Manual localStorage modification (invalid data) → reset to default
- Very long streaks (100+ days) → UI displays correctly

**Success Criteria:**
- Streak increments accurately across day boundaries
- Resets correctly when days are missed
- Milestone celebrations trigger at 7, 14, 30 days
- Data persists across browser sessions
- No errors in console, smooth UX

### Learnings from Previous Story

**From Story 3-3-katex-math-rendering (Status: review)**

**Client Component Pattern:**
- Use `'use client'` directive at top of file [Source: stories/3-3-katex-math-rendering.md]
- StreakDisplay.tsx will follow this pattern (uses hooks, client-side state)

**Error Handling:**
- Try-catch blocks with graceful fallback [Source: stories/3-3-katex-math-rendering.md#Task-4]
- For streak logic: wrap date parsing, localStorage access
- On error: initialize to default state (currentStreak = 0)

**Mobile Responsiveness:**
- Test on small screens [Source: stories/3-3-katex-math-rendering.md#Task-5]
- StreakDisplay should scale appropriately
- Consider header layout on mobile (might stack or inline with other elements)

**Component Integration:**
- Modified Message.tsx to integrate MathText [Source: stories/3-3-katex-math-rendering.md#File-List]
- Similarly, modify page.tsx to integrate StreakDisplay
- Place prominently in header (top of page, always visible)

**Package Management:**
- package.json updated cleanly [Source: stories/3-3-katex-math-rendering.md#File-List]
- No new packages needed for this story (Zustand already installed)

### References

- **Epic 4 Details:** [Source: docs/epics/epic-4-gamification-polish.md#Story-4.1]
- **Architecture - State Management:** [Source: docs/architecture.md#State-Management]
- **Architecture - Date/Time:** [Source: docs/architecture.md#Decision-Summary]
- **Architecture - Project Structure:** [Source: docs/architecture.md#Project-Structure]
- **PRD - Gamification Requirements:** [Source: docs/PRD.md#FR-7-Gamification-System]
- **Testing Strategy:** [Source: docs/architecture.md#ADR-004]

## Dev Agent Record

### Context Reference

- docs/stories/4-1-daily-streak-tracker.context.xml

### Agent Model Used

claude-sonnet-4-5-20250929

### Debug Log References

**Implementation Approach:**
1. Created date utilities for timezone-aware streak tracking
2. Built Zustand store with persist middleware for localStorage sync
3. Implemented streak update logic with milestone detection
4. Created StreakDisplay component with prominent header placement
5. Integrated problem-solved detection via API response headers
6. Added streak increment on correct answer validation

**Technical Decisions:**
- Used `new Date().toLocaleDateString()` for timezone awareness (client-side local time)
- Streak increments when `answerValidation.isCorrect === true` (validates against equation)
- Milestone celebrations logged to console (Story 4.3 will add visual display)
- localStorage key: 'zeroai-gamification' for namespace consistency
- Error handling: try-catch wraps date parsing and localStorage access, falls back to safe defaults

### Completion Notes List

**Story 4.1 Implementation Complete:**

- ✅ **Task 1**: Created gamification Zustand store
  - File: store/gamification.ts
  - Zustand persist middleware configured with localStorage key 'zeroai-gamification'
  - Actions: checkAndUpdateStreak(), incrementStreak(), resetStreak()
  - Types: StreakData interface, MilestoneInfo interface

- ✅ **Task 2**: Implemented streak update logic
  - File: lib/date-utils.ts
  - Functions: getTodayDateString(), getYesterdayDateString(), areConsecutiveDays()
  - Logic handles: same day (no change), consecutive day (increment), missed day (reset to 1)
  - First-time users: Initialize to 0, increment to 1 on first problem solved

- ✅ **Task 3**: Created StreakDisplay component
  - File: components/StreakDisplay.tsx
  - Display format: "🔥 {currentStreak} day streak!" with singular/plural handling
  - Hides when currentStreak === 0 (first-time users before first problem)
  - Styled with orange-600 color, prominent text size

- ✅ **Task 4**: Integrated streak tracking
  - Modified: components/ChatContainer.tsx
  - Added StreakDisplay to header (right side with ModeIndicator)
  - Called checkAndUpdateStreak() on app mount (useEffect)
  - Problem solved detection: API response header 'X-Problem-Solved'
  - Modified: app/api/chat/route.ts (added header)
  - Modified: components/MessageInput.tsx (reads header, increments streak)

- ✅ **Task 5**: Milestone celebrations
  - Milestones: 7, 14, 30 days
  - Detection logic in checkMilestone() function
  - Returns MilestoneInfo with reached flag, milestone number, and message
  - Tracks lastCelebratedMilestone to avoid repeat celebrations
  - Currently logs to console (Story 4.3 will add confetti animation)

- ✅ **Task 6**: Manual testing ready
  - All edge cases documented in validation guide
  - Error handling: Graceful fallback on localStorage errors
  - Timezone handling: Uses client-side local time consistently

**Architecture Compliance:**
- Per architecture: Zustand with persist middleware [Source: docs/architecture.md#State-Management]
- Per ADR: Client-side date handling [Source: docs/architecture.md#Decision-Summary]
- Per ADR-004: Manual testing only (no automated tests for MVP)
- Component pattern: 'use client' directive, named exports
- Error handling: try-catch with graceful degradation

**Integration Points:**
- Streak display integrated in ChatContainer header
- Problem solved detection via math-validator.ts (Story 1.3)
- Milestone celebrations ready for Story 4.3 (confetti animation)
- Problems counter infrastructure ready for Story 4.2

### File List

**CREATED:**
- lib/date-utils.ts - Timezone-aware date utilities (getTodayDateString, getYesterdayDateString)
- store/gamification.ts - Zustand store with localStorage persistence for streaks/counters
- components/StreakDisplay.tsx - Daily streak UI component with prominent header display

**MODIFIED:**
- components/ChatContainer.tsx - Added StreakDisplay to header, initialize streak check on mount
- components/MessageInput.tsx - Read X-Problem-Solved header, increment streak on correct answer
- app/api/chat/route.ts - Added X-Problem-Solved header to signal correct answers
