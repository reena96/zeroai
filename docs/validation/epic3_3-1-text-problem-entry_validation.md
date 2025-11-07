# Story 3.1: Text Problem Entry - Validation Guide

**Story ID:** 3-1-text-problem-entry
**Epic:** 3 - Problem Input & Math Rendering
**Status:** Review
**Created:** 2025-11-07

## 30-Second Quick Test

1. Open the app at http://localhost:3000
2. Type "solve 2x + 5 = 13" in the input box
3. Press Enter
4. **Expected:** AI immediately confirms: "I see you want to solve 2x + 5 = 13. Let's work through this together!"
5. **Expected:** AI begins Socratic dialogue (doesn't give answer directly)

**PASS:** ✅ AI confirms problem before starting Socratic dialogue
**FAIL:** ❌ AI skips confirmation or gives direct answer

---

## Automated Test Results

**Per ADR-004:** Manual testing only for MVP. No automated tests implemented.

**Unit Tests:** N/A
**Integration Tests:** N/A
**Test Coverage:** N/A

---

## Manual Validation Steps

### Test 1: Basic Problem Detection & Confirmation

**Setup:**
1. Start dev server: `npm run dev`
2. Open http://localhost:3000 in browser
3. Ensure chat is empty (refresh if needed)

**Test Cases:**

#### TC 1.1: Simple equation
- **Input:** "solve 2x + 5 = 13"
- **Expected:** AI restates: "I see you want to solve 2x + 5 = 13. Let's work through this together!"
- **Expected:** AI asks Socratic question (e.g., "What's the first step to isolate x?")
- **Pass Criteria:** ✅ Confirmation appears, ✅ No direct answer given

#### TC 1.2: Word problem
- **Input:** "A rectangle has length 8 and width 5. What is its area?"
- **Expected:** AI confirms: "I see you want to find the area of a rectangle with length 8 and width 5."
- **Expected:** Socratic guidance (e.g., "What formula do we use for area of a rectangle?")
- **Pass Criteria:** ✅ Confirmation appears, ✅ Socratic approach

#### TC 1.3: Expression evaluation
- **Input:** "what is 15% of 80"
- **Expected:** AI confirms the problem
- **Expected:** Guides through percentage calculation
- **Pass Criteria:** ✅ Confirmation appears, ✅ Step-by-step guidance

#### TC 1.4: Inequality
- **Input:** "solve 3x - 7 > 11"
- **Expected:** AI restates inequality correctly
- **Expected:** Asks about first step
- **Pass Criteria:** ✅ Confirmation appears, ✅ Socratic dialogue

---

### Test 2: Ambiguous Input Handling

**Setup:** Same as Test 1

**Test Cases:**

#### TC 2.1: Incomplete equation
- **Input:** "solve x"
- **Expected:** AI asks clarifying question: "What equation should we solve for x?"
- **Pass Criteria:** ✅ Asks for clarification, ❌ Does NOT try to solve

#### TC 2.2: Single word
- **Input:** "area"
- **Expected:** AI asks: "What shape's area do you want to find? Do you have dimensions?"
- **Pass Criteria:** ✅ Asks for more information

#### TC 2.3: Vague calculation
- **Input:** "calculate"
- **Expected:** AI asks: "What would you like to calculate?"
- **Pass Criteria:** ✅ Requests clarification

---

### Test 3: Context Mode Integration

**Setup:** Same as Test 1

**Test Cases:**

#### TC 3.1: Guided mode (default)
- **Input:** "solve x^2 - 9 = 0"
- **Expected:** AI confirms problem
- **Expected:** More scaffolding/hints (per Story 2.2)
- **Pass Criteria:** ✅ Confirmation + guided scaffolding

#### TC 3.2: Challenge mode
- **Steps:** Select "Challenge" mode (per Story 2.1)
- **Input:** "solve x^2 - 9 = 0"
- **Expected:** AI confirms problem
- **Expected:** Less scaffolding, more open questions
- **Pass Criteria:** ✅ Confirmation + minimal hints

---

### Test 4: Placeholder Text

**Setup:** Same as Test 1

**Test Case:**

#### TC 4.1: Input placeholder
- **Steps:** Click in message input box
- **Expected:** Placeholder text reads: "Type your math problem here..."
- **Pass Criteria:** ✅ Placeholder updated from generic "Type your message..."

---

### Test 5: No Repeated Confirmation

**Setup:** Same as Test 1

**Test Cases:**

#### TC 5.1: Subsequent messages don't re-confirm
- **Steps:**
  1. Enter: "solve 2x + 5 = 13"
  2. AI confirms and asks first question
  3. Reply: "subtract 5 from both sides"
  4. Continue dialogue for 2-3 exchanges
- **Expected:** AI confirms ONLY on first message
- **Expected:** Subsequent AI messages do NOT repeat confirmation
- **Pass Criteria:** ✅ Confirmation only once, ✅ Natural dialogue flow

---

## Edge Cases and Error Handling

### Edge Case 1: Non-Math Input
- **Input:** "hello"
- **Expected:** AI responds normally (not a math problem)
- **Expected:** No forced confirmation
- **Pass Criteria:** ✅ Graceful handling of non-math input

### Edge Case 2: Mixed Content
- **Input:** "Hi! Can you help me solve 2x + 3 = 9?"
- **Expected:** AI extracts and confirms problem: "I see you want to solve 2x + 3 = 9."
- **Pass Criteria:** ✅ Identifies math problem within conversational text

### Edge Case 3: Multiple Problems
- **Input:** "solve x + 5 = 10 and also 2y - 3 = 7"
- **Expected:** AI handles both or asks which to tackle first
- **Pass Criteria:** ✅ Acknowledges both problems, ✅ Guides appropriately

### Edge Case 4: LaTeX Notation (Preview for Story 3.3)
- **Input:** "solve $x^2 - 4x + 4 = 0$"
- **Expected:** AI confirms problem (LaTeX rendering tested in Story 3.3)
- **Pass Criteria:** ✅ Problem detected despite LaTeX delimiters

---

## Rollback Plan

**If validation fails:**

1. **Rollback Code Changes:**
   ```bash
   git log --oneline  # Find commit before Story 3.1
   git revert [commit-hash]  # Or git reset --hard if not pushed
   ```

2. **Revert Affected Files:**
   - `lib/prompts.ts` - Remove T1.1A section (lines 61-92)
   - `components/MessageInput.tsx` - Restore placeholder to "Type your message..."

3. **Restart Dev Server:**
   ```bash
   npm run dev
   ```

4. **Verify Rollback:**
   - Check placeholder text is generic
   - Test that AI doesn't auto-confirm problems

**Recovery Time:** ~5 minutes

---

## Acceptance Criteria Checklist

Per Story 3.1 requirements:

- [ ] **AC #1:** Placeholder text reads "Type your math problem here..."
  - **Test:** TC 4.1

- [ ] **AC #2:** AI detects math problems using NLU (keywords: solve, find, calculate, equations)
  - **Tests:** TC 1.1, 1.2, 1.3, 1.4

- [ ] **AC #3:** AI restates problem for confirmation before Socratic dialogue
  - **Tests:** TC 1.1, 1.2, 1.3, 1.4

- [ ] **AC #4:** Confirmation happens ONLY on first user message (not repeated)
  - **Test:** TC 5.1

- [ ] **AC #5:** Ambiguous input triggers clarifying questions
  - **Tests:** TC 2.1, 2.2, 2.3

- [ ] **AC #6:** No special parsing/AST - pure LLM inference
  - **Verification:** Code review of `lib/prompts.ts` - only prompt engineering, no regex/parsers

- [ ] **AC #7:** Works with text entry only (images tested in Story 3.2)
  - **Tests:** All TC 1.x tests use text input

- [ ] **AC #8:** Integrates with existing Socratic prompts (Stories 1.4, 2.2)
  - **Tests:** TC 3.1, 3.2 verify context mode integration

---

## Test Execution Record

**Date Tested:** _____________________
**Tested By:** _____________________
**Environment:** Local dev (http://localhost:3000)

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC 1.1 - Simple equation | ⬜ Pass / ⬜ Fail | |
| TC 1.2 - Word problem | ⬜ Pass / ⬜ Fail | |
| TC 1.3 - Expression | ⬜ Pass / ⬜ Fail | |
| TC 1.4 - Inequality | ⬜ Pass / ⬜ Fail | |
| TC 2.1 - Incomplete | ⬜ Pass / ⬜ Fail | |
| TC 2.2 - Single word | ⬜ Pass / ⬜ Fail | |
| TC 2.3 - Vague | ⬜ Pass / ⬜ Fail | |
| TC 3.1 - Guided mode | ⬜ Pass / ⬜ Fail | |
| TC 3.2 - Challenge mode | ⬜ Pass / ⬜ Fail | |
| TC 4.1 - Placeholder | ⬜ Pass / ⬜ Fail | |
| TC 5.1 - No repeat | ⬜ Pass / ⬜ Fail | |

**Overall Status:** ⬜ PASS / ⬜ FAIL

**Critical Issues Found:** _____________________

---

## References

- **Story File:** docs/stories/3-1-text-problem-entry.md
- **Story Context:** docs/stories/3-1-text-problem-entry.context.xml
- **Implementation:** lib/prompts.ts (lines 61-92), components/MessageInput.tsx
- **Architecture:** docs/architecture.md (ADR-004: Manual Testing)
- **PRD:** docs/PRD.md (FR-1.1: Text Problem Entry)
