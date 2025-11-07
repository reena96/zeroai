# Epic 4: Gamification & Polish (Engagement - Day 4)

**Goal:** Add motivation layer (streaks, celebrations, counters) and polish UX for production readiness.

**Why This Fourth:** Core functionality complete (Epics 1-3). Now layer on engagement features that make it sticky.

**Value:** Makes learning sticky - students return daily. Professional polish separates good from great.

**Stories:** 3-4 stories

---

## Story 4.1: Daily Streak Tracker

As a student,
I want to see my daily streak of using the tutor,
So that I'm motivated to practice every day.

**Acceptance Criteria:**
1. Streak counter stored in localStorage: {lastUsedDate, currentStreak}
2. Display prominently in header: "🔥 5 day streak!"
3. Streak increments when student uses app on new calendar day
4. Streak resets to 1 if student misses a day (>24h gap)
5. Milestone celebrations: "7 day streak - You're on fire! 🎉" (at 7, 14, 30 days)
6. Streak persists across sessions (localStorage)
7. Timezone-aware: Reset at midnight local time
8. First-time users start at "1 day streak" after first problem

**Prerequisites:** None (independent feature)

**Technical Notes:**
- localStorage: `{lastUsedDate: '2025-11-03', currentStreak: 5}`
- Update logic: Check on app load, compare lastUsedDate to today
- Timezone: Use `new Date().toLocaleDateString()` for day comparison
- Milestone UI: Toast notification or confetti animation

---

## Story 4.2: Problems Solved Counter

As a student,
I want to see how many problems I've solved,
So that I can track my progress and feel accomplished.

**Acceptance Criteria:**
1. Counter stored in localStorage: {totalProblems, weeklyProblems, lastResetDate}
2. Display in header or sidebar: "23 problems this week! 💪"
3. Weekly counter resets every Monday at 00:00 local time
4. Total counter never resets (lifetime progress)
5. Problem counted as "solved" when student reaches correct answer after Socratic guidance
6. Separate indicator for "solo solves" (no hints/worked examples needed)
7. Visual progress: "You've solved 3 problems today, 23 this week, 156 total!"
8. Encouragement messages at milestones: 10, 25, 50, 100 problems

**Prerequisites:** None (independent feature)

**Technical Notes:**
- localStorage: `{totalProblems: 156, weeklyProblems: 23, lastResetDate: '2025-10-28'}`
- Reset logic: Check on load, reset weekly if current week > lastResetDate week
- Problem solved detection: Track when student gives correct final answer
- Solo solve: Track if no "confused" button clicked and no worked examples shown

---

## Story 4.3: Celebration Animations

As a student,
I want to see a fun celebration when I solve a problem,
So that I feel rewarded and motivated to continue.

**Acceptance Criteria:**
1. Confetti animation triggers when student solves problem correctly
2. Encouraging message displays: "You did it! 🎉", "Nice work! ⭐", "Excellent! Keep it up! 💪"
3. Animation lasts 2-3 seconds, non-blocking (student can continue)
4. Messages vary to avoid repetition (5+ variations)
5. Celebration includes streak update: "You did it! 🔥 6 day streak!"
6. Animation feels rewarding not annoying (smooth, tasteful)
7. Works on all screen sizes (responsive)
8. Option to disable animations in settings (future: for now always on)

**Prerequisites:** Story 4.1 (shows streak in celebration), Story 4.2 (shows problems count)

**Technical Notes:**
- Library: canvas-confetti or react-confetti
- Trigger: When AI confirms correct final answer
- Messages: Array of encouraging phrases, randomize selection
- Timing: `setTimeout(() => clearConfetti(), 2500)`
- Accessibility: Respects `prefers-reduced-motion` media query (future enhancement)

---

## Story 4.4: Responsive Design & UX Polish

As a student,
I want the app to work smoothly on my tablet and laptop,
So that I can use it wherever I do homework.

**Acceptance Criteria:**
1. Fully responsive on tablet (768px+) and laptop (1024px+)
2. Touch-friendly buttons: min 44px tap targets
3. Readable text: 16px+ body text, good contrast ratios
4. Image upload works on mobile file pickers
5. Chat interface adapts to screen size (stacked on mobile, sidebar on desktop)
6. Mode selection buttons scale appropriately
7. Math rendering readable on all screen sizes
8. Smooth animations and transitions (loading states, message appearance)
9. Clean, professional design (not prototype-looking)
10. No horizontal scrolling, all content fits viewport

**Prerequisites:** All previous stories (polish layer on top)

**Technical Notes:**
- Breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Tailwind responsive utilities: `md:`, `lg:` prefixes
- Test on: iPad (768x1024), MacBook (1440x900), iPhone (future)
- Loading states: Skeleton loaders or spinners
- Micro-interactions: Button hover states, message fade-in

---

## Success Checkpoint: After Day 4

- ✅ Streaks tracking
- ✅ Celebration animations
- ✅ Responsive on tablet/laptop
- ✅ Production-quality polish
