# Story 4.1 Validation Guide: Daily Streak Tracker

**Story:** 4.1 - Daily Streak Tracker
**Status:** Done
**Date:** 2025-11-08

## 30-Second Quick Test

1. Start the app: `npm run dev`
2. Wait for "I'm your math tutor" message
3. Type a math problem: "solve 2x + 5 = 13"
4. Provide correct answer when prompted: "x = 4"
5. **Verify:** Header shows "🔥 1 day streak!" after correct answer

**Expected:** Streak display appears with fire emoji and "1 day" (singular).

## Automated Test Results

**Test Approach:** Manual testing only per ADR-004
**Coverage:** N/A - No automated tests for MVP

## Manual Validation Steps

### Test 1: First-Time User (AC #8, #1, #6)

```bash
# Clear localStorage
1. Open DevTools (F12) → Application tab → Local Storage → localhost
2. Delete 'zeroai-gamification' key
3. Refresh page

# Initial state
4. Verify: NO streak display visible (streak = 0)

# Solve first problem
5. Enter problem: "what is 3 + 5?"
6. Answer correctly: "8"

# Verify
7. Streak display appears: "🔥 1 day streak!"
8. Refresh page → Streak persists (AC #6: localStorage)
9. DevTools → Local Storage → Check 'zeroai-gamification':
   {
     "state": {
       "streakData": {
         "lastUsedDate": "11/8/2025",
         "currentStreak": 1
       }
     }
   }
```

### Test 2: Same-Day Usage (AC #3)

```bash
1. With streak = 1 from Test 1
2. Solve another problem same day: "solve x + 3 = 10"
3. Answer: "x = 7"
4. Verify: Streak still shows "🔥 1 day streak!" (not 2)
```

### Test 3: Consecutive Days (AC #3)

**Manual Simulation (DevTools):**
```javascript
// In browser console:
localStorage.setItem('zeroai-gamification', JSON.stringify({
  state: {
    streakData: {
      lastUsedDate: "11/7/2025", // Yesterday
      currentStreak: 3,
      lastCelebratedMilestone: null
    },
    totalProblems: 5,
    weeklyProblems: 5,
    soloSolves: 2,
    lastResetDate: "2025-W45"
  },
  version: 0
}));
// Refresh page
```

```bash
1. Solve problem: "what is 12 - 5?"
2. Answer: "7"
3. Verify: Streak increments to "🔥 4 days streak!" (plural)
```

### Test 4: Missed Day / Reset (AC #4)

**Manual Simulation:**
```javascript
// Set lastUsedDate to 2 days ago
localStorage.setItem('zeroai-gamification', JSON.stringify({
  state: {
    streakData: {
      lastUsedDate: "11/6/2025", // 2 days ago
      currentStreak: 5
    },
    totalProblems: 10,
    weeklyProblems: 10,
    soloSolves: 3,
    lastResetDate: "2025-W45"
  },
  version: 0
}));
// Refresh page
```

```bash
1. Solve problem: "solve 2x = 10"
2. Answer: "x = 5"
3. Verify: Streak resets to "🔥 1 day streak!" (not 6)
```

### Test 5: Milestone Celebrations (AC #5)

**7-Day Milestone:**
```javascript
localStorage.setItem('zeroai-gamification', JSON.stringify({
  state: {
    streakData: {
      lastUsedDate: "11/7/2025",
      currentStreak: 6,
      lastCelebratedMilestone: null
    },
    totalProblems: 15,
    weeklyProblems: 15,
    soloSolves: 5,
    lastResetDate: "2025-W45"
  },
  version: 0
}));
```

```bash
1. Solve problem: "what is 9 x 7?"
2. Answer: "63"
3. Verify:
   - Streak shows "🔥 7 days streak!"
   - Console log: "[Streak Milestone] 7 day streak - You're on fire! 🎉"
   - (Visual celebration in Story 4.3)
4. Solve another problem same day
5. Verify: No repeat milestone message
```

**14-Day and 30-Day:** Repeat with currentStreak: 13 and 29

### Test 6: Timezone Awareness (AC #7)

```bash
1. Check streak uses local timezone:
   - lastUsedDate format in localStorage: "M/D/YYYY" (e.g., "11/8/2025")
   - Uses `new Date().toLocaleDateString()`
2. Verify midnight transitions use local time (not UTC)

Note: Automated timezone testing would require mocking Date object.
For manual testing: Streak increments at midnight local time.
```

### Test 7: Display Format (AC #2)

```bash
# Singular
1. Set streak to 1 → Verify: "🔥 1 day streak!" (not "days")

# Plural
2. Set streak to 5 → Verify: "🔥 5 days streak!"

# Prominent display
3. Verify: Appears in header
4. Verify: Orange-600 color, large emoji (text-2xl), semibold font
5. Verify: Visible on mobile, tablet, desktop (responsive)
```

## Edge Cases and Error Handling

| Edge Case | Test Steps | Expected Behavior |
|-----------|------------|-------------------|
| localStorage disabled | Disable in browser settings | App continues to work, streak doesn't persist (graceful degradation) |
| Corrupted localStorage data | Set invalid JSON in 'zeroai-gamification' | Store resets to default state, no errors in console |
| Very long streaks (100+ days) | Set currentStreak: 150 | Displays correctly: "🔥 150 days streak!" |
| Date parsing errors | Mock Date to throw error | Try-catch in date-utils.ts catches error, returns fallback |
| Multiple browser tabs | Open 2 tabs, solve problems in both | Streak updates from localStorage persist across tabs |

## Acceptance Criteria Checklist

- [x] AC1: Streak counter stored in localStorage: {lastUsedDate, currentStreak}
- [x] AC2: Display prominently in header: "🔥 5 day streak!"
- [x] AC3: Streak increments when student uses app on new calendar day
- [x] AC4: Streak resets to 1 if student misses a day (>24h gap)
- [x] AC5: Milestone celebrations: "7 day streak - You're on fire! 🎉" (at 7, 14, 30 days)
- [x] AC6: Streak persists across sessions (localStorage)
- [x] AC7: Timezone-aware: Reset at midnight local time
- [x] AC8: First-time users start at "1 day streak" after first problem

**Status:** ✅ All acceptance criteria validated

## Rollback Plan

If critical issues found post-deployment:

### Option 1: Feature Flag Disable (Recommended)
```typescript
// In components/ChatContainer.tsx
const ENABLE_STREAK = false; // Set to false to disable

{ENABLE_STREAK && <StreakDisplay />}
```

### Option 2: Remove Streak Display
```bash
git revert <commit-hash-of-story-4.1>
npm run build
```

### Option 3: Clear User Data
```javascript
// If localStorage corruption causing issues:
localStorage.removeItem('zeroai-gamification');
```

**Impact:** Removing streak feature won't break core tutoring functionality (independent feature).

## Files Modified

- `store/gamification.ts` - Core gamification state
- `lib/date-utils.ts` - Date utilities
- `components/StreakDisplay.tsx` - UI component
- `components/ChatContainer.tsx` - Integration point
- `components/MessageInput.tsx` - Streak increment trigger
- `app/api/chat/route.ts` - Problem solved header

## Validation Sign-Off

**Validated By:** Reena
**Date:** 2025-11-08
**Result:** ✅ PASS - All tests passed, ready for production
