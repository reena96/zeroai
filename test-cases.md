# ZeroAI Math Tutor - Demo Test Cases

## Quick Demo Flow (5 minutes)

### Test 1: Basic Socratic Guidance ✅
**Input:** `Solve for x: 2x + 5 = 13`

**Expected Behavior:**
- AI asks: "What information do we have?"
- AI asks: "What operation undoes +5?"
- AI guides to: "Subtract 5 from both sides"
- **NEVER says "x = 4" directly**

**Success Criteria:** 0% direct answer rate

---

### Test 2: Student Makes Wrong Move ⚠️
**Setup:** Start with above problem
**Student says:** `Add 5 to both sides`

**Expected Behavior:**
- AI: "Not quite - that would make the equation larger"
- AI: "Think about what operation UNDOES addition"
- **Validates response without giving answer**

**Success Criteria:** Catches error, redirects constructively

---

### Test 3: Simple Word Problem 📝
**Input:** `Sarah has 3 apples and buys 5 more. How many total?`

**Expected Behavior:**
- AI asks: "What operation combines amounts?"
- AI: "What happens when we add 3 and 5?"
- AI lets student say "8"

**Success Criteria:** Socratic even for simple problems

---

### Test 4: Arithmetic Error Catch 🔍
**Setup:** `2x = 8, what is x?`
**Student says:** `x = 3`

**Expected Behavior:**
- AI: "Let's verify: 2 × 3 = 6, not 8"
- AI: "What number times 2 gives us 8?"

**Success Criteria:** Validation catches wrong answer

---

### Test 5: Complex Equation 💪
**Input:** `Solve: 3x - 7 = 2x + 5`

**Expected Behavior:**
- AI guides through combining like terms
- AI: "What if we subtract 2x from both sides?"
- Multi-step guidance without revealing x = 12

**Success Criteria:** Handles multi-step problems

---

### Test 6: Response Speed Test ⚡
**Multiple rapid inputs:**
1. `What is 5 + 3?`
2. `Solve: x + 2 = 7`
3. `Factor: x² + 3x + 2`

**Expected Performance:**
- Each response: 3-5 seconds ✅
- No "thinking forever" hangs
- Consistent Socratic behavior

**Success Criteria:** <5s response time consistently

---

## Edge Cases to Check

### Edge 1: Non-Math Question
**Input:** `What is photosynthesis?`
**Expected:** Redirects to math focus politely

### Edge 2: Incomplete Problem
**Input:** `Solve x`
**Expected:** Asks for complete equation

### Edge 3: Impossible Equation
**Input:** `Solve: x + 5 = x + 3`
**Expected:** Guides student to discover no solution exists

### Edge 4: Pure Arithmetic (Validation Test)
**Input:** `What is 12 ÷ 3?`
**Expected:** Can validate answer "4" is correct

---

## Performance Benchmarks

| Metric | Target | Current Status |
|--------|--------|----------------|
| Response Time | <5s | ✅ 3-5s |
| Direct Answer Rate | 0% | ✅ 0% (Socratic) |
| Error Detection | Works | ⚠️ Some false positives in logs |
| Context Retention | 10 messages | ✅ Implemented |
| Validation Speed | <100ms | ✅ mathjs only |

---

## Known Issues / Limitations

1. **False Positive Validation Warnings** (logs only, user doesn't see):
   - Expression extractor picks up sentence fragments
   - Example: "late x. What could you do to undo the"
   - Impact: Console noise, but doesn't affect UX

2. **Validation Limited to Numerical Claims**:
   - MathJS can't validate symbolic equations (2x + 5 = 13)
   - Only catches pure arithmetic errors (2 + 2 = 5)
   - Acceptable for MVP - Socratic prompt prevents direct answers

3. **No Context Mode Selection Yet** (Epic 2):
   - All queries use same pacing
   - Future: Homework/Exam/Exploration modes

---

## Demo Script for Gauntlet

**30-Second Hook:**
"Unlike Photomath which just shows answers, or Khan Academy which uses one-size-fits-all tutoring, ZeroAI guides students through Socratic questioning that adapts to THEIR learning context. Watch this..."

**Live Demo (2 minutes):**
1. Show Test 1: AI refuses to give direct answer
2. Show Test 2: AI catches student error gracefully
3. Show Test 6: Fast response time (3-5s)
4. Mention: "This is Epic 1 foundation. Epic 2 adds context-awareness - homework deadline mode vs deep exploration mode"

**Unique Value Prop:**
"We're not competing with Math Academy's validated knowledge graph on accuracy - that took them years. We're competing on adaptive Socratic delivery and student agency. Context-awareness + gamification = no competitor has both."

---

## Next Steps After Demo

If demo goes well:
- [ ] Epic 2: Context mode selection (Homework/Exam/Explore)
- [ ] Epic 2: Adaptive pacing based on context
- [ ] Epic 2: "I'm really confused" button with worked examples
- [ ] Epic 3: Image upload with OCR
- [ ] Epic 4: Gamification (streaks, celebrations)
