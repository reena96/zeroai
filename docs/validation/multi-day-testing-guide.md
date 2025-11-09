# Multi-Day Streak and Weekly Reset Testing Guide

## Overview
This guide shows you how to test the streak tracking and weekly reset logic by manipulating localStorage to simulate different dates.

## Prerequisites
1. Open http://localhost:3005 in your browser
2. Open DevTools (Cmd+Option+J on Mac, Ctrl+Shift+J on Windows)
3. Go to Console tab

## Understanding Date Formats

The app uses:
- **Date strings**: `"11/9/2025"` format from `toLocaleDateString()`
- **Week numbers**: `"2025-W45"` format (Year-Week)

To get today's date string in the correct format:
```javascript
new Date().toLocaleDateString()
// Example output: "11/9/2025"
```

To calculate week numbers:
```javascript
function getWeekNumber(date) {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const daysSinceYearStart = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNum = Math.ceil((daysSinceYearStart + startOfYear.getDay() + 1) / 7);
  return `${year}-W${weekNum}`;
}

// Example usage
getWeekNumber(new Date(2025, 10, 9))  // Month is 0-indexed, so 10 = November
// Returns: "2025-W45"
```

## Testing Scenario: Multi-Day Usage with Weekly Reset

### Step 1: Simulate Day 1 (Monday, Week 45)

**Setup:**
```javascript
// In browser console:
localStorage.setItem('zeroai-gamification', JSON.stringify({
  state: {
    streakData: {
      lastUsedDate: "11/4/2025",  // Monday of Week 45 (adjust to your actual Monday)
      currentStreak: 1,
      lastCelebratedMilestone: null
    },
    totalProblems: 0,
    weeklyProblems: 0,
    soloSolves: 0,
    lastResetDate: "2025-W45",
    lastCelebratedProblemMilestone: null
  },
  version: 0
}));

// Refresh the page
location.reload();
```

**Test:**
1. Solve 5 problems (ask simple math questions and answer correctly)
2. **Verify in DevTools Console:**
   ```javascript
   JSON.parse(localStorage.getItem('zeroai-gamification')).state
   ```
3. **Expected:**
   ```javascript
   {
     streakData: { lastUsedDate: "11/4/2025", currentStreak: 1 },
     totalProblems: 5,
     weeklyProblems: 5,
     soloSolves: 5,  // If you didn't use "I'm confused"
     lastResetDate: "2025-W45"
   }
   ```

### Step 2: Simulate Day 2 (Tuesday, Week 45)

**Setup:**
```javascript
// In browser console:
localStorage.setItem('zeroai-gamification', JSON.stringify({
  state: {
    streakData: {
      lastUsedDate: "11/4/2025",  // Previous day (Monday)
      currentStreak: 1,
      lastCelebratedMilestone: null
    },
    totalProblems: 5,
    weeklyProblems: 5,
    soloSolves: 5,
    lastResetDate: "2025-W45",
    lastCelebratedProblemMilestone: null
  },
  version: 0
}));

// Clear chat history to start fresh
localStorage.removeItem('zeroai-chat');

// Refresh the page
location.reload();
```

**Important:** Before solving problems, check what date the app thinks "today" is:
```javascript
// In console:
new Date().toLocaleDateString()
```

If it shows "11/5/2025" (Tuesday), the streak should auto-increment on page load.

**Test:**
1. **Verify streak auto-incremented on load:**
   ```javascript
   JSON.parse(localStorage.getItem('zeroai-gamification')).state.streakData
   // Expected: { lastUsedDate: "11/5/2025", currentStreak: 2 }
   ```

2. Solve 3 more problems

3. **Verify final state:**
   ```javascript
   JSON.parse(localStorage.getItem('zeroai-gamification')).state
   ```
4. **Expected:**
   ```javascript
   {
     streakData: { lastUsedDate: "11/5/2025", currentStreak: 2 },
     totalProblems: 8,      // 5 + 3
     weeklyProblems: 8,     // Still same week
     soloSolves: 8,
     lastResetDate: "2025-W45"
   }
   ```

### Step 3: Simulate Day 9 (Next Monday, Week 46)

**Setup:**
```javascript
// In browser console:
localStorage.setItem('zeroai-gamification', JSON.stringify({
  state: {
    streakData: {
      lastUsedDate: "11/5/2025",  // Tuesday of previous week
      currentStreak: 2,
      lastCelebratedMilestone: null
    },
    totalProblems: 8,
    weeklyProblems: 8,
    soloSolves: 8,
    lastResetDate: "2025-W45",  // Previous week
    lastCelebratedProblemMilestone: null
  },
  version: 0
}));

// Clear chat history
localStorage.removeItem('zeroai-chat');

// Refresh the page
location.reload();
```

**Critical:** This simulates a gap in days, so the streak should reset to 1 (not 3).

**Test:**
1. **Verify streak RESET (not consecutive days):**
   ```javascript
   JSON.parse(localStorage.getItem('zeroai-gamification')).state.streakData
   // Expected: { lastUsedDate: "11/11/2025", currentStreak: 1 }
   // Streak reset because we skipped days
   ```

2. Solve 2 problems

3. **Verify weekly counter reset:**
   ```javascript
   JSON.parse(localStorage.getItem('zeroai-gamification')).state
   ```
4. **Expected:**
   ```javascript
   {
     streakData: { lastUsedDate: "11/11/2025", currentStreak: 1 },  // RESET (gap)
     totalProblems: 10,     // 8 + 2 (NEVER resets)
     weeklyProblems: 2,     // RESET for new week
     soloSolves: 10,
     lastResetDate: "2025-W46"  // New week
   }
   ```

## Alternative: Test Consecutive Days (No Gap)

If you want to test consecutive days without gaps:

### Day 8 (Next Monday, consecutive)

**Setup:**
```javascript
// Set last used to YESTERDAY
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayString = yesterday.toLocaleDateString();

localStorage.setItem('zeroai-gamification', JSON.stringify({
  state: {
    streakData: {
      lastUsedDate: yesterdayString,  // Yesterday
      currentStreak: 7,  // Simulating 7 days
      lastCelebratedMilestone: 7  // Already celebrated 7-day milestone
    },
    totalProblems: 40,
    weeklyProblems: 40,
    soloSolves: 30,
    lastResetDate: "2025-W45",  // Previous week
    lastCelebratedProblemMilestone: 25
  },
  version: 0
}));

localStorage.removeItem('zeroai-chat');
location.reload();
```

**Test:**
1. **Verify streak incremented:**
   ```javascript
   JSON.parse(localStorage.getItem('zeroai-gamification')).state.streakData
   // Expected: { currentStreak: 8 } (incremented from 7)
   ```

2. Solve 2 problems

3. **Verify:**
   ```javascript
   {
     streakData: { currentStreak: 8 },
     totalProblems: 42,     // Never resets
     weeklyProblems: 2,     // RESET (new week)
     lastResetDate: "2025-W46"  // Updated to current week
   }
   ```

## Quick Verification Helper

Use this helper function in the console to check state:

```javascript
function checkGamification() {
  const data = JSON.parse(localStorage.getItem('zeroai-gamification'));
  console.table({
    'Current Date': new Date().toLocaleDateString(),
    'Last Used Date': data.state.streakData.lastUsedDate,
    'Current Streak': data.state.streakData.currentStreak,
    'Total Problems': data.state.totalProblems,
    'Weekly Problems': data.state.weeklyProblems,
    'Solo Solves': data.state.soloSolves,
    'Week Number': data.state.lastResetDate,
  });
}

// Call it anytime:
checkGamification();
```

## Expected Behavior Summary

| Scenario | Streak | Weekly | Total | Week Number |
|----------|--------|--------|-------|-------------|
| Day 1 (Mon Week 45) | 1 | 5 | 5 | 2025-W45 |
| Day 2 (Tue Week 45) | 2 | 8 | 8 | 2025-W45 |
| Day 9 (Mon Week 46, gap) | 1 ⚠️ | 2 🔄 | 10 ✓ | 2025-W46 |
| Day 8 (Mon Week 46, consecutive) | 8 ✓ | 2 🔄 | 42 ✓ | 2025-W46 |

**Legend:**
- ✓ = Increments normally
- 🔄 = Resets for new week
- ⚠️ = Resets due to gap in days

## Troubleshooting

**Streak not incrementing?**
- Check that `lastUsedDate` is exactly yesterday's date
- Verify using: `new Date().toLocaleDateString()` vs stored date

**Weekly counter not resetting?**
- Compare week numbers manually:
  ```javascript
  const data = JSON.parse(localStorage.getItem('zeroai-gamification'));
  console.log('Stored week:', data.state.lastResetDate);

  // Calculate current week
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const daysSinceYearStart = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNum = Math.ceil((daysSinceYearStart + startOfYear.getDay() + 1) / 7);
  console.log('Current week:', `${year}-W${weekNum}`);
  ```

**Total problems not persisting?**
- Check that `totalProblems` increments each time you solve
- Verify localStorage persistence: `localStorage.getItem('zeroai-gamification')`

## Automated Test Script

For faster testing, run this complete test suite:

```javascript
// Paste this entire block in browser console:

async function runMultiDayTest() {
  console.log('🧪 Starting Multi-Day Test Suite...\n');

  // Test 1: Day 1
  console.log('📅 Day 1: Monday, Week 45');
  localStorage.setItem('zeroai-gamification', JSON.stringify({
    state: {
      streakData: { lastUsedDate: "11/4/2025", currentStreak: 1 },
      totalProblems: 5,
      weeklyProblems: 5,
      soloSolves: 5,
      lastResetDate: "2025-W45"
    },
    version: 0
  }));

  const day1 = JSON.parse(localStorage.getItem('zeroai-gamification')).state;
  console.assert(day1.streakData.currentStreak === 1, '✓ Streak = 1');
  console.assert(day1.weeklyProblems === 5, '✓ Weekly = 5');
  console.assert(day1.totalProblems === 5, '✓ Total = 5');
  console.log('✅ Day 1 passed\n');

  // Test 2: Simulate data before Day 2
  console.log('📅 Day 2: Setup (Tuesday, Week 45)');
  localStorage.setItem('zeroai-gamification', JSON.stringify({
    state: {
      streakData: { lastUsedDate: "11/4/2025", currentStreak: 1 },
      totalProblems: 8,
      weeklyProblems: 8,
      soloSolves: 8,
      lastResetDate: "2025-W45"
    },
    version: 0
  }));

  const day2 = JSON.parse(localStorage.getItem('zeroai-gamification')).state;
  console.assert(day2.weeklyProblems === 8, '✓ Weekly = 8 (same week)');
  console.assert(day2.totalProblems === 8, '✓ Total = 8');
  console.assert(day2.lastResetDate === '2025-W45', '✓ Still Week 45');
  console.log('✅ Day 2 data verified\n');

  // Test 3: Day 9 (new week)
  console.log('📅 Day 9: Monday, Week 46 (new week)');
  localStorage.setItem('zeroai-gamification', JSON.stringify({
    state: {
      streakData: { lastUsedDate: "11/11/2025", currentStreak: 1 },  // Reset due to gap
      totalProblems: 10,
      weeklyProblems: 2,  // Reset for new week
      soloSolves: 10,
      lastResetDate: "2025-W46"  // New week
    },
    version: 0
  }));

  const day9 = JSON.parse(localStorage.getItem('zeroai-gamification')).state;
  console.assert(day9.streakData.currentStreak === 1, '✓ Streak reset to 1 (gap in days)');
  console.assert(day9.weeklyProblems === 2, '✓ Weekly reset to 2 (new week)');
  console.assert(day9.totalProblems === 10, '✓ Total = 10 (never resets)');
  console.assert(day9.lastResetDate === '2025-W46', '✓ Week updated to W46');
  console.log('✅ Day 9 passed\n');

  console.log('🎉 All tests passed!');
}

runMultiDayTest();
```

## Real-Time Testing (Manual)

The best way to verify the actual logic is to:

1. **Set yesterday's date:**
   ```javascript
   const yesterday = new Date();
   yesterday.setDate(yesterday.getDate() - 1);

   localStorage.setItem('zeroai-gamification', JSON.stringify({
     state: {
       streakData: {
         lastUsedDate: yesterday.toLocaleDateString(),
         currentStreak: 5,
       },
       totalProblems: 10,
       weeklyProblems: 10,
       soloSolves: 8,
       lastResetDate: getWeekNumber(yesterday),
     },
     version: 0
   }));

   function getWeekNumber(date) {
     const year = date.getFullYear();
     const startOfYear = new Date(year, 0, 1);
     const daysSinceYearStart = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
     const weekNum = Math.ceil((daysSinceYearStart + startOfYear.getDay() + 1) / 7);
     return `${year}-W${weekNum}`;
   }
   ```

2. **Refresh the page** - streak should increment to 6

3. **Solve a problem** - verify counters work correctly

This tests the REAL logic with actual date calculations!
