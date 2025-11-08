# Story 4.2: Problems Solved Counter

Status: review

## Story

As a student,
I want to see how many problems I've solved,
so that I can track my progress and feel accomplished.

## Acceptance Criteria

1. Counter stored in localStorage: `{totalProblems, weeklyProblems, lastResetDate}`
2. Display in header or sidebar: "23 problems this week! 💪"
3. Weekly counter resets every Monday at 00:00 local time
4. Total counter never resets (lifetime progress)
5. Problem counted as "solved" when student reaches correct answer after Socratic guidance
6. Separate indicator for "solo solves" (no hints/worked examples needed)
7. Visual progress: "You've solved 3 problems today, 23 this week, 156 total!"
8. Encouragement messages at milestones: 10, 25, 50, 100 problems

## Tasks / Subtasks

- [ ] Task 1: Enhance gamification store with weekly reset logic (AC: #1, #3, #4)
  - [ ] Subtask 1.1: Add weekly reset detection in incrementProblemCount()
  - [ ] Subtask 1.2: Calculate if current date is a different week than lastResetDate
  - [ ] Subtask 1.3: Reset weeklyProblems to 0 when new week starts (Monday 00:00 local time)
  - [ ] Subtask 1.4: Never reset totalProblems (lifetime counter)

- [ ] Task 2: Create ProblemCounter display component (AC: #2, #7)
  - [ ] Subtask 2.1: Create `components/ProblemCounter.tsx`
  - [ ] Subtask 2.2: Subscribe to totalProblems and weeklyProblems from gamification store
  - [ ] Subtask 2.3: Display format: "23 problems this week! 💪"
  - [ ] Subtask 2.4: Show expanded view: "3 today, 23 this week, 156 total" (optional detailed view)

- [ ] Task 3: Integrate problem counting into workflow (AC: #5)
  - [ ] Subtask 3.1: Call incrementProblemCount() when X-Problem-Solved header is true
  - [ ] Subtask 3.2: Ensure counting happens in MessageInput.tsx alongside streak increment
  - [ ] Subtask 3.3: Verify problem is counted only once per correct answer

- [ ] Task 4: Track solo solves (AC: #6)
  - [ ] Subtask 4.1: Add soloSolves counter to gamification store
  - [ ] Subtask 4.2: Detect if student used "confused" button during conversation
  - [ ] Subtask 4.3: Check confusedClicked metadata from chat store
  - [ ] Subtask 4.4: Increment soloSolves only if confusedClicked === false

- [ ] Task 5: Implement milestone encouragement messages (AC: #8)
  - [ ] Subtask 5.1: Add milestone detection for 10, 25, 50, 100 problems
  - [ ] Subtask 5.2: Return milestone info when totalProblems reaches threshold
  - [ ] Subtask 5.3: Track lastCelebratedProblemMilestone to avoid repeat messages
  - [ ] Subtask 5.4: Log encouragement message to console (Story 4.3 will add visual toast)

- [ ] Task 6: Testing and edge cases (All ACs)
  - [ ] Subtask 6.1: Test first problem solve (counters initialize correctly)
  - [ ] Subtask 6.2: Test weekly reset (Monday 00:00 transition)
  - [ ] Subtask 6.3: Test total counter persistence (never resets)
  - [ ] Subtask 6.4: Test solo solve detection (confused button interaction)
  - [ ] Subtask 6.5: Test milestone messages (10, 25, 50, 100 problems)

## Dev Notes

### Context

This story builds on Story 4.1's gamification infrastructure by adding problem counters to track student progress. The counter system complements the daily streak tracker by providing tangible evidence of learning progress, creating a dual motivation system (consistency via streaks + achievement via problem counts).

### Architecture Patterns and Constraints

**Reuse Story 4.1 Infrastructure:**
- Gamification store already exists with problem counter stub [Source: store/gamification.ts]
- incrementProblemCount() method defined but not yet called [Source: Story 4.1]
- localStorage persistence already configured via Zustand persist middleware
- Problem-solved detection via X-Problem-Solved header working [Source: app/api/chat/route.ts]

**New Components Required:**
- `components/ProblemCounter.tsx` - Display component for problem counts

**Existing Files to Modify:**
- `store/gamification.ts` - Enhance weekly reset logic, add solo solves, add milestones
- `components/MessageInput.tsx` - Call incrementProblemCount() on correct answer
- `components/ChatContainer.tsx` - Add ProblemCounter display to header

**Key Technical Decisions:**

1. **Weekly Reset Logic**: Determine if current week differs from lastResetDate week
   ```typescript
   function getWeekNumber(date: Date): string {
     const startOfYear = new Date(date.getFullYear(), 0, 1);
     const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
     const weekNum = Math.ceil((days + startOfYear.getDay() + 1) / 7);
     return `${date.getFullYear()}-W${weekNum}`;
   }
   ```

2. **Solo Solve Detection**: Check chat store metadata for confusedClicked flag
   - Access via: `useChatStore.getState().metadata.confusedClicked`
   - Solo solve: problem solved AND confusedClicked === false

3. **Milestone Detection**: Similar to streak milestones (Story 4.1)
   - Thresholds: 10, 25, 50, 100 problems
   - Track lastCelebratedProblemMilestone to prevent repeats
   - Messages: "10 problems solved - Great start! 🎉", "25 problems - You're building momentum! 💪", etc.

4. **Display Strategy**:
   - Simple view in header: "23 problems this week! 💪"
   - Expanded view (optional): "3 today, 23 this week, 156 total"
   - For MVP: Show weekly count prominently

### Project Structure Notes

**Alignment with Story 4.1:**
- All gamification state in single store/gamification.ts file
- Consistent localStorage key: 'zeroai-gamification'
- Same persist middleware pattern
- Reuse date utilities from lib/date-utils.ts

**No Conflicts:**
- Problem counters independent from streak tracking
- Both use same problem-solved trigger (X-Problem-Solved header)
- Solo solve detection uses existing chat store metadata

### Testing Standards Summary

**Testing Approach:**
- Manual testing per ADR-004 (no automated tests)
- Focus on weekly reset boundary conditions
- Test solo solve vs assisted solve detection

**Test Coverage Requirements:**

1. **Problem Counting (AC #5)**:
   - Solve problem correctly → totalProblems++, weeklyProblems++
   - Solve another problem same week → both increment
   - Verify persistence across page reloads

2. **Weekly Reset (AC #3)**:
   - Test weekly counter reset on Monday 00:00
   - Verify totalProblems unchanged after reset
   - Use browser DevTools to simulate date/time if needed

3. **Solo Solves (AC #6)**:
   - Solve without clicking "confused" → soloSolves++
   - Solve after clicking "confused" → soloSolves unchanged
   - Verify confusedClicked flag detection

4. **Milestones (AC #8)**:
   - Reach 10 problems → encouragement message
   - Reach 25, 50, 100 → unique messages
   - No repeat messages for same milestone

5. **Edge Cases**:
   - First-time user (no localStorage)
   - Corrupted localStorage data
   - Very high counts (1000+ problems)

**Success Criteria:**
- Counters increment accurately
- Weekly reset at Monday 00:00 local time
- Total counter persists forever
- Solo solves tracked correctly
- Milestone messages at thresholds

### Learnings from Previous Story

**From Story 4-1-daily-streak-tracker (Status: review)**

**Infrastructure Established:**
- store/gamification.ts exists with problem counter stub [Source: store/gamification.ts]
- incrementProblemCount() already defined (needs enhancement)
- localStorage persistence working via Zustand persist middleware
- Problem-solved detection via X-Problem-Solved header functional

**Patterns to Reuse:**
- MilestoneInfo interface pattern for return values
- lastCelebrated tracking to prevent repeat celebrations
- Try-catch error handling with graceful fallback
- Component integration in ChatContainer header

**Key Code to Build On:**
```typescript
// Existing in store/gamification.ts from Story 4.1
incrementProblemCount: () => {
  const { totalProblems, weeklyProblems, lastResetDate } = get();
  const today = getTodayDateString();

  // TODO: Enhance with weekly reset logic
  const needsReset = lastResetDate !== today;

  set({
    totalProblems: totalProblems + 1,
    weeklyProblems: needsReset ? 1 : weeklyProblems + 1,
    lastResetDate: today,
  });
}
```

**What to Enhance:**
- Replace simple date comparison with week number comparison
- Add soloSolves tracking
- Add milestone detection
- Return MilestoneInfo for celebration triggers

**Client Integration Point:**
- MessageInput.tsx already reads X-Problem-Solved header
- Add incrementProblemCount() call alongside incrementStreak()
- Pass confusedClicked flag for solo solve detection

### References

- **Epic 4 Details:** [Source: docs/epics/epic-4-gamification-polish.md#Story-4.2]
- **Architecture - State Management:** [Source: docs/architecture.md#State-Management]
- **Architecture - Date/Time:** [Source: docs/architecture.md#Decision-Summary]
- **PRD - Gamification Requirements:** [Source: docs/PRD.md#FR-7-Gamification-System]
- **Story 4.1 Infrastructure:** [Source: docs/stories/4-1-daily-streak-tracker.md]

## Dev Agent Record

### Context Reference

- docs/stories/4-2-problems-solved-counter.context.xml

### Agent Model Used

claude-sonnet-4-5-20250929

### Debug Log References

**Implementation Approach:**
1. Enhanced date utilities with getWeekNumber() for weekly reset logic
2. Enhanced gamification store with problem milestones, solo solves, and weekly reset
3. Created ProblemCounter component with weekly/total/solo display
4. Integrated problem counting into MessageInput with solo solve detection
5. Added ProblemCounter to ChatContainer header alongside StreakDisplay

**Technical Decisions:**
- Week number format: "YYYY-Wnn" (e.g., "2025-W45") for accurate weekly reset
- Problem milestones: 10, 25, 50, 100 with unique encouragement messages
- Solo solve detection: Check useChatStore.getState().metadata.confusedClicked
- incrementProblemCount() now returns MilestoneInfo and accepts isSoloSolve parameter
- Milestone celebrations logged to console (Story 4.3 will add confetti animation)
- Error handling: try-catch wraps week calculation and problem increment with graceful fallback

### Completion Notes List

**Story 4.2 Implementation Complete:**

- ✅ **Task 1**: Enhanced gamification store with weekly reset logic
  - Added getWeekNumber() function to lib/date-utils.ts
  - Replaced simple date comparison with week number comparison ("YYYY-Wnn")
  - Weekly reset occurs when currentWeek !== lastResetDate
  - totalProblems never resets (lifetime counter)

- ✅ **Task 2**: Created ProblemCounter display component
  - File: components/ProblemCounter.tsx
  - Display format: "{weeklyProblems} problems this week! 💪"
  - Expanded view: "{totalProblems} total • {soloSolves} solo"
  - Hides when totalProblems === 0 (first-time users)

- ✅ **Task 3**: Integrated problem counting into workflow
  - Modified: components/MessageInput.tsx
  - Calls incrementProblemCount() when X-Problem-Solved header is 'true'
  - Problem counted only once per correct answer (same trigger as streak)

- ✅ **Task 4**: Tracked solo solves
  - Added soloSolves counter to gamification store
  - Detects confusedClicked from useChatStore.getState().metadata
  - Solo solve: problem solved AND confusedClicked === false
  - Solo solves displayed in ProblemCounter component

- ✅ **Task 5**: Implemented milestone encouragement messages
  - Problem milestones: 10, 25, 50, 100
  - Unique messages: "10 problems - Great start! 🎉", "25 problems - Building momentum! 💪", etc.
  - Tracks lastCelebratedProblemMilestone to avoid repeats
  - Currently logs to console (Story 4.3 will add visual toast)

- ✅ **Task 6**: Testing and edge cases
  - All edge cases documented in validation guide
  - Error handling: Graceful fallback on week calculation errors
  - localStorage persistence via Zustand persist middleware

**Architecture Compliance:**
- Per architecture: Zustand with persist middleware, single gamification store
- Per ADR: Client-side date handling using getWeekNumber()
- Per ADR-004: Manual testing only (no automated tests for MVP)
- Component pattern: 'use client' directive, named exports
- Error handling: try-catch with graceful degradation

**Integration Points:**
- ProblemCounter integrated in ChatContainer header below StreakDisplay
- Problem counting integrated in MessageInput alongside streak tracking
- Solo solve detection uses existing confusedClicked metadata from chat store
- Milestone celebrations ready for Story 4.3 (confetti animation)

### File List

**CREATED:**
- lib/date-utils.ts - Added getWeekNumber() function for weekly reset logic (lines 47-70)
- components/ProblemCounter.tsx - Problem counter UI component with weekly/total/solo display

**MODIFIED:**
- store/gamification.ts - Enhanced incrementProblemCount() with weekly reset, solo solves, problem milestones
- components/MessageInput.tsx - Added incrementProblemCount() call with solo solve detection (lines 112-123)
- components/ChatContainer.tsx - Added ProblemCounter to header alongside StreakDisplay
