# Story 3.3: KaTeX Math Rendering - Validation Guide

**Story ID:** 3-3-katex-math-rendering
**Epic:** 3 - Problem Input & Math Rendering
**Status:** Review
**Created:** 2025-11-07

## 30-Second Quick Test

1. Open the app at http://localhost:3000
2. Type "solve x^2 - 4 = 0"
3. Press Enter, wait for AI response
4. **Expected:** AI response includes formatted math (e.g., $x^2 - 4 = 0$ renders as x² - 4 = 0)
5. Check AI message includes display math: "$$x = \pm 2$$"
6. **Expected:** Equation centered on its own line with proper formatting

**PASS:** ✅ Inline and display math render beautifully
**FAIL:** ❌ LaTeX appears as raw text ($x^2$) or rendering errors

---

## Automated Test Results

**Per ADR-004:** Manual testing only for MVP. No automated tests implemented.

**Unit Tests:** N/A
**Integration Tests:** N/A
**Test Coverage:** N/A

---

## Manual Validation Steps

### Test 1: Inline Math Rendering

**Setup:**
1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Have conversation with AI that includes math

**Test Cases:**

#### TC 1.1: Simple inline math
- **Steps:**
  1. Enter problem: "solve 2x + 5 = 13"
  2. Continue dialogue until AI uses inline math in response
  3. AI might say: "So we have $x = 4$."
- **Expected:** "x = 4" renders as formatted math (not raw $x = 4$)
- **Pass Criteria:** ✅ Inline math formatted, ✅ Flows with text

#### TC 1.2: Multiple inline math expressions
- **Steps:** Trigger AI response like "We have $2x = 8$, so $x = 4$."
- **Expected:** Both expressions render inline
- **Pass Criteria:** ✅ Both formatted, ✅ Text spacing correct

#### TC 1.3: Inline fractions
- **Steps:** Trigger response with "$x = \frac{3}{4}$"
- **Expected:** Fraction renders as stacked numerator/denominator
- **Pass Criteria:** ✅ Fraction formatted inline

#### TC 1.4: Inline exponents
- **Steps:** Trigger "$x^2$" or "$e^{i\pi}$"
- **Expected:** Superscript renders correctly
- **Pass Criteria:** ✅ Exponents positioned above baseline

#### TC 1.5: Inline square roots
- **Steps:** Trigger "$\sqrt{2}$" or "$\sqrt[3]{8}$"
- **Expected:** Radical symbol with content underneath
- **Pass Criteria:** ✅ Root symbol renders correctly

---

### Test 2: Display Math Rendering

**Setup:** Same as Test 1

**Test Cases:**

#### TC 2.1: Centered display equation
- **Steps:** Trigger AI response with "$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$"
- **Expected:**
  - Equation centered on page
  - Larger than inline math
  - Own line with vertical spacing
- **Pass Criteria:** ✅ Centered, ✅ Display mode styling

#### TC 2.2: Multiple display equations
- **Steps:** Trigger response with:
  ```
  First equation:
  $$x^2 - 9 = 0$$
  Second equation:
  $$x = \pm 3$$
  ```
- **Expected:** Both equations centered, separate lines
- **Pass Criteria:** ✅ Both centered, ✅ Proper spacing

#### TC 2.3: Display math with fractions
- **Steps:** Trigger "$$\frac{a^2 + b^2}{c}$$"
- **Expected:** Large fraction in display mode
- **Pass Criteria:** ✅ Display sizing, ✅ Centered

---

### Test 3: Common Mathematical Notation

**Setup:** Same as Test 1

**Test Cases:**

#### TC 3.1: Fractions
- **Input:** Trigger AI to use \frac{a}{b}
- **Expected:** Stacked fraction notation
- **Pass Criteria:** ✅ Renders correctly

#### TC 3.2: Exponents and roots
- **Input:** Trigger $x^2$, $\sqrt{x}$, $\sqrt[3]{8}$
- **Expected:** Superscripts and radicals
- **Pass Criteria:** ✅ All render correctly

#### TC 3.3: Greek letters
- **Input:** Trigger $\alpha$, $\beta$, $\pi$, $\theta$
- **Expected:** Greek symbols displayed
- **Pass Criteria:** ✅ Symbols correct

#### TC 3.4: Subscripts
- **Input:** Trigger $x_1$, $a_n$
- **Expected:** Subscript positioning
- **Pass Criteria:** ✅ Below baseline

#### TC 3.5: Complex equation (quadratic formula)
- **Input:** Trigger "$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$"
- **Expected:** Fully formatted with nested structures
- **Pass Criteria:** ✅ All elements render, ✅ Proper nesting

#### TC 3.6: Integrals (if applicable)
- **Input:** Trigger "$$\int_0^1 x^2 dx = \frac{1}{3}$$"
- **Expected:** Integral symbol with limits
- **Pass Criteria:** ✅ Renders correctly

#### TC 3.7: Summations (if applicable)
- **Input:** Trigger "$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$"
- **Expected:** Sigma with limits
- **Pass Criteria:** ✅ Renders correctly

---

### Test 4: Mixed Text and Math

**Setup:** Same as Test 1

**Test Cases:**

#### TC 4.1: Text before and after inline math
- **Input:** AI says "The solution is $x = 4$."
- **Expected:** "The solution is [formatted x = 4]."
- **Pass Criteria:** ✅ Text flows naturally, ✅ Math formatted

#### TC 4.2: Multiple paragraphs with math
- **Input:** AI response:
  ```
  Let's start with the equation $2x + 5 = 13$.

  First, we subtract 5: $2x = 8$.

  Then divide by 2: $x = 4$.
  ```
- **Expected:** All inline math formatted, paragraphs preserved
- **Pass Criteria:** ✅ All math rendered, ✅ Paragraph spacing

#### TC 4.3: Display math with surrounding text
- **Input:**
  ```
  The quadratic formula is:
  $$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$
  This works for any quadratic equation.
  ```
- **Expected:** Display math centered between text blocks
- **Pass Criteria:** ✅ Centered equation, ✅ Text before/after

---

### Test 5: Error Handling and Fallback

**Setup:** Same as Test 1

**Test Cases:**

#### TC 5.1: Invalid LaTeX syntax
- **Steps:** Manually trigger AI response with invalid LaTeX: "$x = \invalid$"
- **Expected:** Falls back to plain text: "$x = \invalid$"
- **Expected:** No crash, error logged to console
- **Pass Criteria:** ✅ Graceful fallback, ✅ No UI break

#### TC 5.2: Malformed delimiters
- **Steps:** Trigger "$x = 4" (missing closing $)
- **Expected:** Displays as plain text or gracefully handles
- **Pass Criteria:** ✅ No crash, ✅ User sees content

#### TC 5.3: Nested dollar signs
- **Steps:** Trigger "$x = $5$" (unusual nesting)
- **Expected:** Attempts rendering or falls back
- **Pass Criteria:** ✅ No crash

---

### Test 6: Integration with Story 3.1 (Text Problems)

**Setup:** Same as Test 1

**Test Cases:**

#### TC 6.1: Type problem, AI responds with formatted math
- **Steps:**
  1. Type "solve x^2 - 9 = 0"
  2. AI confirms problem (Story 3.1)
  3. AI responds with "$x^2 - 9 = 0$" and later "$$x = \pm 3$$"
- **Expected:** All math in AI response formatted
- **Pass Criteria:** ✅ Inline and display math work, ✅ Integration seamless

---

### Test 7: Integration with Story 3.2 (OCR Problems)

**Setup:** Same as Test 1, with image upload

**Test Cases:**

#### TC 7.1: Upload image, AI responds with formatted math
- **Steps:**
  1. Upload image of "x^2 + 5x + 6 = 0"
  2. OCR extracts text (Story 3.2)
  3. AI confirms and works through problem
  4. AI uses LaTeX in responses
- **Expected:** Math formatted in AI responses
- **Pass Criteria:** ✅ OCR → formatted responses work

---

### Test 8: Mobile Responsiveness

**Setup:**
1. Open http://localhost:3000 in mobile browser or DevTools device emulation
2. Test on iPhone 12 (390x844) and iPad (768x1024)

**Test Cases:**

#### TC 8.1: Inline math on mobile
- **Steps:** Trigger AI response with inline math on phone
- **Expected:** Math renders inline, text wraps appropriately
- **Pass Criteria:** ✅ Readable, ✅ No overflow

#### TC 8.2: Display math on mobile
- **Steps:** Trigger display equation on phone
- **Expected:**
  - Equation centered
  - If too wide: horizontal scroll (overflow-x-auto)
  - Vertical spacing preserved
- **Pass Criteria:** ✅ Centered, ✅ Scrollable if needed, ✅ No vertical overflow

#### TC 8.3: Long equations on mobile
- **Steps:** Trigger very long equation (e.g., polynomial with many terms)
- **Expected:** Horizontal scroll appears, equation readable
- **Pass Criteria:** ✅ Scroll works, ✅ No layout break

---

### Test 9: User Messages vs AI Messages

**Setup:** Same as Test 1

**Test Cases:**

#### TC 9.1: User message with LaTeX (should NOT render)
- **Steps:** User types "solve $x^2 - 4 = 0$" in input
- **Expected:** User message displays as plain text (no rendering)
- **Pass Criteria:** ✅ User messages are plain text

#### TC 9.2: AI message with LaTeX (SHOULD render)
- **Steps:** AI responds with "$x = \pm 2$"
- **Expected:** AI message renders math
- **Pass Criteria:** ✅ AI messages render LaTeX

---

## Edge Cases and Error Handling

### Edge Case 1: Empty LaTeX
- **Input:** AI sends "$ $" or "$$$$ $$"
- **Expected:** Empty or whitespace, gracefully handled
- **Pass Criteria:** ✅ No crash

### Edge Case 2: Very long LaTeX expression
- **Input:** AI sends 500+ character LaTeX formula
- **Expected:** Renders or falls back, no performance issue
- **Pass Criteria:** ✅ Handles gracefully

### Edge Case 3: Special characters in LaTeX
- **Input:** AI uses "&", "%", "#" in LaTeX context
- **Expected:** KaTeX escapes or renders correctly
- **Pass Criteria:** ✅ No XSS risk, ✅ Safe rendering

### Edge Case 4: Mixed inline and display in one message
- **Input:** "We have $x = 2$ and also: $$x^2 = 4$$"
- **Expected:** Inline renders inline, display centered
- **Pass Criteria:** ✅ Both modes work in one message

---

## Rollback Plan

**If validation fails:**

1. **Rollback Code Changes:**
   ```bash
   git log --oneline  # Find commit before Story 3.3
   git revert [commit-hash]
   ```

2. **Revert Affected Files:**
   - `components/MathText.tsx` - Delete file
   - `components/Message.tsx` - Remove MathText import and usage (restore plain text)
   - `app/layout.tsx` - Remove KaTeX CSS import
   - `package.json` - Remove katex and @types/katex

3. **Restart Dev Server:**
   ```bash
   npm install  # Remove katex from node_modules
   npm run dev
   ```

4. **Verify Rollback:**
   - Check AI messages show raw LaTeX (e.g., "$x = 4$" as plain text)
   - Confirm KaTeX CSS not loaded

**Recovery Time:** ~5 minutes

---

## Acceptance Criteria Checklist

Per Story 3.3 requirements:

- [ ] **AC #1:** Inline math (e.g., $x^2$) renders as formatted math in AI messages
  - **Tests:** TC 1.1, 1.2, 1.3, 1.4, 1.5

- [ ] **AC #2:** Display math (e.g., $$...$) renders centered on its own line
  - **Tests:** TC 2.1, 2.2, 2.3

- [ ] **AC #3:** KaTeX library used (not MathJax)
  - **Verification:** Check package.json for katex dependency, not mathjax

- [ ] **AC #4:** Works with both typed and OCR-extracted problems
  - **Tests:** TC 6.1 (typed), TC 7.1 (OCR)

- [ ] **AC #5:** Rendering happens client-side
  - **Verification:** components/MathText.tsx uses 'use client' directive, katex.renderToString() in browser

- [ ] **AC #6:** Fallback to plain text if KaTeX rendering fails
  - **Tests:** TC 5.1, 5.2, 5.3

- [ ] **AC #7:** Mobile-responsive (equations scale appropriately)
  - **Tests:** TC 8.1, 8.2, 8.3

- [ ] **AC #8:** Common notation supported (fractions, exponents, roots, Greek, subscripts)
  - **Tests:** TC 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7

---

## Test Execution Record

**Date Tested:** _____________________
**Tested By:** _____________________
**Environment:** Local dev (http://localhost:3000)

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC 1.1 - Simple inline | ⬜ Pass / ⬜ Fail | |
| TC 1.2 - Multiple inline | ⬜ Pass / ⬜ Fail | |
| TC 1.3 - Inline fractions | ⬜ Pass / ⬜ Fail | |
| TC 1.4 - Inline exponents | ⬜ Pass / ⬜ Fail | |
| TC 1.5 - Inline roots | ⬜ Pass / ⬜ Fail | |
| TC 2.1 - Centered display | ⬜ Pass / ⬜ Fail | |
| TC 2.2 - Multiple display | ⬜ Pass / ⬜ Fail | |
| TC 2.3 - Display fractions | ⬜ Pass / ⬜ Fail | |
| TC 3.1 - Fractions | ⬜ Pass / ⬜ Fail | |
| TC 3.2 - Exponents/roots | ⬜ Pass / ⬜ Fail | |
| TC 3.3 - Greek letters | ⬜ Pass / ⬜ Fail | |
| TC 3.4 - Subscripts | ⬜ Pass / ⬜ Fail | |
| TC 3.5 - Quadratic formula | ⬜ Pass / ⬜ Fail | |
| TC 3.6 - Integrals | ⬜ Pass / ⬜ Fail | |
| TC 3.7 - Summations | ⬜ Pass / ⬜ Fail | |
| TC 4.1 - Mixed text/math | ⬜ Pass / ⬜ Fail | |
| TC 4.2 - Multi-paragraph | ⬜ Pass / ⬜ Fail | |
| TC 4.3 - Display w/ text | ⬜ Pass / ⬜ Fail | |
| TC 5.1 - Invalid LaTeX | ⬜ Pass / ⬜ Fail | |
| TC 5.2 - Malformed delimiters | ⬜ Pass / ⬜ Fail | |
| TC 5.3 - Nested $ | ⬜ Pass / ⬜ Fail | |
| TC 6.1 - Text problem integration | ⬜ Pass / ⬜ Fail | |
| TC 7.1 - OCR integration | ⬜ Pass / ⬜ Fail | |
| TC 8.1 - Mobile inline | ⬜ Pass / ⬜ Fail | |
| TC 8.2 - Mobile display | ⬜ Pass / ⬜ Fail | |
| TC 8.3 - Mobile long equations | ⬜ Pass / ⬜ Fail | |
| TC 9.1 - User no render | ⬜ Pass / ⬜ Fail | |
| TC 9.2 - AI renders | ⬜ Pass / ⬜ Fail | |

**Overall Status:** ⬜ PASS / ⬜ FAIL

**Critical Issues Found:** _____________________

---

## Bundle Size Verification

**Target:** KaTeX bundle < 100KB (per AC #3)

**Measurement:**
```bash
npm run build
# Check .next/static/chunks for katex bundle size
```

**Expected:**
- katex.min.css: ~23KB
- katex library: ~60KB
- Total: ~83KB (under 100KB limit)

**Verification Date:** _____________________
**Actual Bundle Size:** _______ KB
**Status:** ⬜ Under 100KB / ⬜ Over 100KB

---

## References

- **Story File:** docs/stories/3-3-katex-math-rendering.md
- **Story Context:** docs/stories/3-3-katex-math-rendering.context.xml
- **Implementation:** components/MathText.tsx, components/Message.tsx, app/layout.tsx
- **Architecture:** docs/architecture.md (ADR-005: KaTeX over MathJax, ADR-004: Manual Testing)
- **PRD:** docs/PRD.md (FR-1.3: KaTeX Math Rendering)
- **KaTeX Documentation:** https://katex.org/docs/supported.html
