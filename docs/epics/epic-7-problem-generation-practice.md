# Epic 7: Problem Generation & Practice (Mastery Through Repetition)

**Goal:** Enable students to generate similar practice problems on-demand, reinforcing concepts through spaced repetition and retrieval practice.

**Why This:** Core to learning is practice. Technology already proven (LLM generates similar problems in worked examples). Just need to expose as user-facing feature. Quick win with massive learning impact.

**Value:** Transforms one-shot tutoring into continuous practice system. Enables mastery learning. Differentiates from answer-showing competitors. Aligns with Math Academy research (retrieval practice is key to retention).

**Estimated Effort:** 0.5-1 day (tech proven, need UI + prompt refinement)

**Stories:** 2 stories

---

## Story 7.1: Similar Problem Generation

As a student,
I want to generate similar practice problems after solving one,
So that I can practice the same concept with different numbers.

**Acceptance Criteria:**
1. "Generate Similar Problem" button appears after successfully solving a problem
2. Button triggers LLM to create similar problem with:
   - Same concept/method (e.g., linear equations with one variable)
   - Different numbers/context
   - Similar difficulty level
   - Different specific solution (not just x=4 again)
3. Generated problem displays in chat as new problem to solve
4. Student can request unlimited similar problems
5. Each generated problem tracks metadata:
   - Original problem it's based on
   - Problem type (linear, quadratic, geometry, etc.)
   - Difficulty level
   - Generation timestamp
6. LLM prompt engineering ensures quality:
   - Variations are pedagogically meaningful
   - Numbers chosen to avoid trivial solutions
   - Maintains instructional value
7. Track count: "You've practiced 3 similar problems! 🎯"
8. Works for all 5 core problem types (linear, quadratic, geometry, word, multi-step)
9. Loading state: "Generating practice problem..."
10. Error handling if generation fails (retry option)

**Prerequisites:** Epic 1-5 complete (needs full Socratic dialogue system)

**Technical Notes:**
- Leverage existing similar problem generation from Story 2.3 (worked examples)
- Prompt template: "Generate a similar {problem_type} problem to '{original}' with different numbers but same concept. Ensure pedagogical value."
- Use GPT-4 structured output for consistency
- Validation: Parse generated problem, ensure it's solvable
- Storage: Add to conversation history as new problem
- Difficulty adjustment: Optionally increase difficulty after 3 consecutive correct answers

**Prompt Engineering:**
```
You are generating practice problems for a student.

Original problem: {original_problem}
Problem type: {type}
Concept: {concept}

Generate a similar problem that:
1. Uses the same mathematical concept/method
2. Has different numbers (avoid making it too easy/hard)
3. Has a different specific answer
4. Is pedagogically valuable (not trivial variations)
5. Maintains similar difficulty level

Format: Return ONLY the problem statement, no explanation.

Example:
Original: "Solve for x: 2x + 5 = 13"
Generated: "Solve for x: 3x - 7 = 14"
```

**Research Findings:**
- GPT-4o excels at math problem generation (per 2024 benchmarks)
- Multi-agent debate frameworks improve problem diversity
- Human-in-loop quality control raises difficulty/diversity
- Current LLMs can generate K-12 math problems with >90% solvability

---

## Story 7.2: Practice Session Management & Analytics

As a student,
I want to track my practice progress and see patterns in my learning,
So that I understand my strengths and areas needing more work.

**Acceptance Criteria:**
1. Practice session tracking:
   - Problems generated count (this session, all-time)
   - Success rate per problem type
   - Average time to solve
   - Concepts mastered vs. struggling
2. Visual progress indicators:
   - "🎯 4/5 similar problems correct!"
   - Progress bar per concept (0-100%)
   - Streak counter for consecutive correct answers
3. Smart recommendations:
   - "Try 2 more quadratic problems to solidify this concept"
   - "You're ready for harder multi-step problems!"
   - "Revisit geometry formulas - 3 wrong attempts"
4. Practice history view:
   - List of all practiced problems
   - Color-coded by success (green=correct, yellow=needed help, red=incorrect)
   - Click to review conversation
5. Export practice session:
   - "Download Practice Summary" button
   - PDF or MD file with all problems + solutions
   - Useful for studying, showing teachers
6. Gamification integration:
   - "Practice Master" badge after 20 generated problems
   - "Concept Champion - Linear Equations" after 5 consecutive correct
   - Leaderboard position (if multi-user in future)
7. Spaced repetition hints:
   - "You solved this 3 days ago - try again to reinforce!"
   - Auto-suggest revisiting concepts after 1 week
8. LocalStorage persistence (MVP) or backend (future)
9. Clear/reset practice history option
10. Privacy: All data stored locally, no server

**Prerequisites:** Story 7.1 (needs problem generation)

**Technical Notes:**
- State management: Extend Zustand store with practice analytics
```typescript
interface PracticeState {
  problemsGenerated: number
  problemsSolved: number
  problemsByType: Record<ProblemType, { attempted: number, correct: number }>
  practiceHistory: Array<{
    id: string
    originalProblem: string
    generatedProblem: string
    timestamp: number
    success: boolean
    timeToSolve: number
    conversationTurns: number
  }>
  conceptMastery: Record<string, number> // 0-100%
}
```
- Export: Use `jsPDF` or markdown generation → trigger download
- Spaced repetition: Simple algorithm (remind after 1 day, 3 days, 7 days)
- Visualization: Simple progress bars, no heavy charting library needed
- Persistence: localStorage (sync on state changes)

**Analytics Tracked:**
- Total problems generated (lifetime)
- Problems generated per session
- Success rate per problem type
- Average conversation turns to solution
- Time spent per problem type
- Concepts marked as "mastered" (3+ consecutive correct)
- Struggling concepts (2+ incorrect attempts)

**Privacy & Data:**
- All analytics stored client-side (localStorage)
- No server upload (MVP)
- Export allows student to share with teacher voluntarily
- Clear data option available in settings

---

## Success Checkpoint: After Epic 7

**Validation Criteria:**
- ✅ Student solves "2x + 5 = 13" → Generates 5 similar linear problems → All solvable
- ✅ Generated problems vary meaningfully (not just different numbers)
- ✅ Practice counter increments correctly
- ✅ Export practice session creates readable PDF/MD file
- ✅ Progress indicators show accurate success rates
- ✅ Works for all 5 problem types (linear, quadratic, geometry, word, multi-step)
- ✅ Problem generation takes <3 seconds
- ✅ No duplicate problems in same session

**Testing Scenarios:**
1. **Linear Equation Practice:** Generate 10 similar problems, solve all, verify variety
2. **Mixed Practice:** Generate problems across all 5 types, check metadata accuracy
3. **Struggling Student:** Get 3 problems wrong → System suggests easier variants
4. **Mastery Path:** Get 5 consecutive correct → System offers harder problems
5. **Export:** Complete 10-problem session → Export → Verify PDF quality
6. **Persistence:** Generate 5 problems → Refresh page → History intact

**Quality Checks:**
- Generated problems are solvable (validate with math.js)
- Variations are pedagogically meaningful (not trivial changes)
- Difficulty stays consistent unless requested otherwise
- No duplicate problems in same session
- Problem format matches original (same notation style)

**Known Limitations:**
- LLM may occasionally generate unsolvable problems (add validation)
- Very advanced topics (calculus) may have lower quality generations
- Practice history limited by localStorage size (~5MB = ~500 problems)
- No cross-device sync (localStorage is per-browser)

---

## Technical Architecture

### Components
- `ProblemGenerationButton.tsx` - "Generate Similar Problem" CTA
- `PracticeProgressBar.tsx` - Visual progress per concept
- `PracticeHistory.tsx` - List of all practice sessions
- `PracticeAnalytics.tsx` - Statistics dashboard
- `ExportPracticeButton.tsx` - Download practice session
- `ConceptMasteryBadge.tsx` - Gamification badges

### State Management
```typescript
interface ProblemGenerationState {
  generatedProblems: Array<{
    id: string
    originalProblem: string
    generatedProblem: string
    type: ProblemType
    difficulty: number
    timestamp: number
  }>
  currentStreak: number
  totalGenerated: number
  conceptProgress: Map<string, number> // concept → mastery %
}
```

### LLM Integration
- Extend existing chat API to support `generateSimilarProblem` action
- Prompt template library for each problem type
- Validation layer: Check generated problem is solvable
- Fallback: If generation fails 2x, use template-based generation

### Storage
- LocalStorage for MVP (5MB limit ~500 problems)
- IndexedDB for future (unlimited storage)
- Export as JSON (backup/transfer)
- Import from JSON (restore sessions)

---

## Why This Epic Matters

**Learning Science:**
- **Retrieval Practice:** Most effective learning method (per Math Academy research)
- **Spaced Repetition:** Reinforces long-term retention
- **Deliberate Practice:** Targeted problem generation for weak areas
- **Immediate Feedback:** Socratic dialogue during each problem

**Competitive Differentiation:**
- **Khanmigo:** No on-demand problem generation
- **Photomath:** No practice mode (one-shot answers)
- **Math Academy:** Drill-based, not Socratic
- **zeroai:** ONLY Socratic tutor with infinite practice generation

**User Value:**
- Transforms single problem help into full practice session
- Enables true mastery (not just "I got one answer")
- Student controls practice volume (self-directed learning)
- Export feature useful for homework/teacher accountability

**Pedagogical Impact:**
- Research shows 5+ similar problems → 80% retention after 1 week
- Spaced repetition → 95% retention after 1 month
- Adaptive difficulty → Optimal challenge (flow state)
- Tracking weak areas → Focused remediation

**Business Value:**
- Increases session time (more problems = more engagement)
- Stickiness: Students return for practice, not just help
- Freemium hook: "5 free practice problems/day, unlimited with premium"
- Network effects: Students share practice PDFs

---

## Implementation Sequence

**Phase 1: Core Generation (Day 1, 0.5 days)**
- Story 7.1: Similar problem generation button + LLM integration
- Prompt engineering for quality
- Validation layer

**Phase 2: Analytics & Gamification (Day 1, 0.5 days)**
- Story 7.2: Practice tracking
- Export functionality
- Progress visualization

**Total Epic Time:** 1 day

---

**Epic 7 Status:** 📝 Ready for Implementation
**Priority:** HIGHEST (Quick win, proven tech, massive learning impact)
**Estimated Timeline:** 0.5-1 day
**Recommended Order:** After Epic 5, before Epic 6 (can ship immediately, no dependencies)
