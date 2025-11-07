# Epic 3: Problem Input & Math Rendering - Validation Guide

**Epic ID:** Epic 3
**Status:** Review
**Stories:** 3.1, 3.2, 3.3
**Created:** 2025-11-07

---

## Epic Overview

**Goal:** Enable students to input math problems via text or image upload, and receive beautifully formatted mathematical responses from the AI tutor.

**User Journey:**
1. **Problem Input:** Student types a math problem OR uploads a photo of one
2. **Problem Confirmation:** AI detects and confirms the problem before starting dialogue (Story 3.1)
3. **Socratic Dialogue:** AI guides student through solving with formatted math (Story 3.3)
4. **Visual Excellence:** All equations render beautifully with KaTeX (inline and display modes)

**Integration Points:**
- **Story 1.4 (Socratic Prompts):** Problem confirmation enhances T1.1A prompt layer
- **Story 2.2 (Mode-Aware Prompts):** Math rendering works in both Guided and Challenge modes
- **Stories 3.1, 3.2, 3.3:** Text entry, image upload, and math rendering work together seamlessly

**Dependencies:**
- OpenAI Chat API (gpt-4o-mini for Socratic dialogue)
- OpenAI GPT-4 Vision API (for OCR)
- KaTeX library (client-side math rendering)

---

## 30-Second Smoke Test (End-to-End Happy Path)

**Prerequisites:**
- Dev server running: `npm run dev`
- Browser open at http://localhost:3000
- Test image available (handwritten or printed math problem)

**Steps:**

1. **Type a problem:**
   - Enter "solve 2x + 5 = 13" in chat input
   - Press Enter

2. **Verify confirmation:**
   - ✅ AI responds: "I see you want to solve 2x + 5 = 13. Let's work through this together!"

3. **Check math rendering:**
   - ✅ Inline math ($2x + 5 = 13$) renders formatted (not raw LaTeX)

4. **Upload an image:**
   - Click upload area or drag test image into chat
   - ✅ Preview appears, "Extracting..." shows briefly
   - ✅ OCR text populates input box within 5 seconds

5. **Send OCR-extracted problem:**
   - Press Enter to send extracted text
   - ✅ AI confirms extracted problem
   - ✅ AI response includes formatted display math (centered equations)

6. **Mobile check (optional):**
   - Open on phone or DevTools mobile emulation
   - ✅ Upload area visible and tappable
   - ✅ Math equations responsive (horizontal scroll if needed)

**Result:**
- **PASS:** All 6 steps succeed ✅
- **FAIL:** Any step fails ❌

---

## Critical Validation Scenarios (Integrated Flows)

### Scenario 1: Text Problem → Confirmation → Formatted Response

**Flow:** Student types problem → AI confirms → Socratic dialogue with math

**Steps:**
1. Type "solve x^2 - 9 = 0"
2. AI confirms: "I see you want to solve $x^2 - 9 = 0$."
3. AI asks: "What type of equation is this?"
4. Continue dialogue (2-3 exchanges)
5. AI shows final answer: "$$x = \pm 3$$"

**Expected:**
- ✅ Problem detected (Story 3.1: TC 1.1)
- ✅ Confirmation appears once (Story 3.1: TC 5.1)
- ✅ Inline math renders ($x^2 - 9 = 0$) (Story 3.3: TC 1.1)
- ✅ Display math centered ($$x = \pm 3$$) (Story 3.3: TC 2.1)

**Critical Checkpoints:**
- AI doesn't skip confirmation
- LaTeX renders (not raw text)
- Display math centered on its own line

---

### Scenario 2: Image Upload → OCR → Confirmation → Formatted Response

**Flow:** Student uploads photo → OCR extracts → AI confirms → Socratic dialogue with math

**Steps:**
1. Upload image of "3x + 7 = 22"
2. OCR completes, input box shows "3x + 7 = 22"
3. User edits if needed (e.g., fix OCR error)
4. Press Enter
5. AI confirms: "I see you want to solve 3x + 7 = 22."
6. AI guides with formatted math: "First, what should we do to isolate $x$?"

**Expected:**
- ✅ Image uploads successfully (Story 3.2: TC 1.1 or 2.1)
- ✅ OCR extracts text within 5 seconds (Story 3.2: TC 4.1)
- ✅ User can edit OCR text before sending (Story 3.2: TC 5.1)
- ✅ AI confirms extracted problem (Story 3.1: TC 1.1 + Story 3.2: TC 5.2)
- ✅ Inline math in AI response renders (Story 3.3: TC 7.1)

**Critical Checkpoints:**
- Upload → OCR → edit → send flow works smoothly
- AI confirms OCR-extracted problem (not just typed)
- Math formatting works for OCR inputs

---

### Scenario 3: Ambiguous Input Handling

**Flow:** Student enters vague problem → AI asks clarification → refined problem → confirmation

**Steps:**
1. Type "solve x"
2. AI asks: "What equation should we solve for x?"
3. Student replies: "x + 5 = 10"
4. AI confirms: "I see you want to solve $x + 5 = 10$."

**Expected:**
- ✅ AI detects ambiguity (Story 3.1: TC 2.1)
- ✅ Asks clarifying question (Story 3.1: TC 2.1)
- ✅ After clarification, confirms problem (Story 3.1: TC 1.1)
- ✅ Math renders in confirmation (Story 3.3: TC 1.1)

**Critical Checkpoints:**
- AI doesn't try to solve "solve x" directly
- Clarification flow natural
- Confirmation happens after refinement

---

### Scenario 4: Complex Equation with Multiple Math Notations

**Flow:** Student enters complex problem → AI responds with fractions, exponents, roots

**Steps:**
1. Type or upload "solve using quadratic formula: x^2 + 5x + 6 = 0"
2. AI confirms problem
3. AI guides: "The quadratic formula is $$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$"
4. AI shows intermediate steps with inline math: "$a = 1$, $b = 5$, $c = 6$"
5. AI shows final answer: "$$x = -2 \text{ or } x = -3$$"

**Expected:**
- ✅ Problem detected (Story 3.1: TC 1.1)
- ✅ Display math (quadratic formula) renders centered (Story 3.3: TC 3.5)
- ✅ Inline math ($a = 1$, etc.) renders inline (Story 3.3: TC 1.2)
- ✅ Fractions, square roots, subscripts all render (Story 3.3: TC 3.1, 3.2)
- ✅ Display answer centered (Story 3.3: TC 2.1)

**Critical Checkpoints:**
- Complex LaTeX structures render correctly
- No rendering errors or fallback to plain text
- Inline and display math both work in same response

---

### Scenario 5: Mobile End-to-End Flow

**Flow:** Student on mobile uploads image → OCR → dialogue → formatted math

**Setup:** Open on iPhone/Android or DevTools mobile emulation (390x844)

**Steps:**
1. Tap upload area on mobile
2. Select image from photo library (or use camera)
3. OCR completes, text appears in input
4. Tap send
5. AI confirms problem with inline math
6. AI responds with display equation

**Expected:**
- ✅ Upload area tappable (Story 3.2: TC 8.1)
- ✅ Image preview fits screen (Story 3.2: TC 8.2)
- ✅ OCR works on mobile (Story 3.2: TC 8.3)
- ✅ Inline math renders on mobile (Story 3.3: TC 8.1)
- ✅ Display math centered with horizontal scroll if needed (Story 3.3: TC 8.2)

**Critical Checkpoints:**
- Mobile UI doesn't break
- Touch targets large enough
- Math equations readable on small screen
- Horizontal scroll works for long equations

---

## Edge Cases Affecting Multiple Stories

### Edge Case 1: Invalid LaTeX in AI Response

**Scenario:** AI generates malformed LaTeX (e.g., model error)

**Steps:**
1. (Simulate) AI response includes "$x = \invalid$"
2. Observe rendering

**Expected:**
- ✅ KaTeX fallback: displays "$x = \invalid$" as plain text (Story 3.3: TC 5.1)
- ✅ No UI crash or blank screen
- ✅ Console logs error for debugging

**Affected Stories:** 3.3 (math rendering)

---

### Edge Case 2: OCR Extracts LaTeX Notation

**Scenario:** Student uploads image with LaTeX notation (e.g., from textbook)

**Steps:**
1. Upload image with "$x^2 - 4 = 0$" (printed LaTeX)
2. OCR extracts "$x^2 - 4 = 0$"
3. User sends extracted text
4. AI responds

**Expected:**
- ✅ OCR extracts LaTeX delimiters (Story 3.2: TC 4.2)
- ✅ AI confirms problem (Story 3.1: Edge Case 4)
- ✅ AI response renders math (Story 3.3: TC 1.1)

**Affected Stories:** 3.1, 3.2, 3.3

---

### Edge Case 3: Very Blurry Image with Partial OCR

**Scenario:** OCR extracts garbled text from blurry image

**Steps:**
1. Upload very blurry image
2. OCR extracts "x + _ = 10" (missing digit)
3. User edits to "x + 5 = 10"
4. Press Enter

**Expected:**
- ✅ OCR attempts extraction (Story 3.2: Edge Case 1)
- ✅ User can edit before sending (Story 3.2: TC 5.1)
- ✅ AI confirms edited problem (Story 3.1: TC 1.1)

**Affected Stories:** 3.2 (OCR), 3.1 (confirmation)

---

### Edge Case 4: Network Failure During OCR

**Scenario:** /api/ocr fails due to network or API error

**Steps:**
1. Upload image
2. (Simulate) Network offline or API key invalid
3. Observe error handling

**Expected:**
- ✅ Error message: "OCR failed. Please try again." (Story 3.2: TC 7.2, 7.3)
- ✅ User can retry upload
- ✅ No crash or infinite loading

**Affected Stories:** 3.2 (OCR)

---

## Mobile/Responsive Validation

**Devices to Test:**
- iPhone 12 (390x844)
- iPad (768x1024)
- Android phone (generic 360x640)

**Test Areas:**

### 1. Text Input (Story 3.1)
- [ ] Placeholder text readable: "Type your math problem here..."
- [ ] Input box tappable and keyboard appears
- [ ] AI confirmation message fits screen

### 2. Image Upload (Story 3.2)
- [ ] Upload area visible and tappable
- [ ] Drag-drop works (on tablet)
- [ ] Camera access works (on phone)
- [ ] Image preview fits screen, no overflow
- [ ] OCR loading spinner visible

### 3. Math Rendering (Story 3.3)
- [ ] Inline math renders inline, text wraps
- [ ] Display math centered on mobile
- [ ] Long equations have horizontal scroll (overflow-x-auto)
- [ ] No vertical overflow or layout breaks

**Critical Checkpoints:**
- All features accessible on mobile
- No horizontal scrolling on main page (except display math overflow)
- Touch targets ≥ 44px (Apple HIG guideline)

---

## Rollback Plan

**If epic validation fails critically:**

### Option 1: Rollback Entire Epic
```bash
git log --oneline  # Find commit before Epic 3
git revert [commit-range]  # Or git reset --hard if not pushed
npm install
npm run dev
```

**Revert:**
- All Story 3.1, 3.2, 3.3 changes
- Remove KaTeX, ImageUpload, OCR endpoint
- Restore original MessageInput placeholder

**Recovery Time:** ~10 minutes

### Option 2: Rollback Specific Story
See individual story validation guides:
- Story 3.1: [epic3_3-1-text-problem-entry_validation.md](./epic3_3-1-text-problem-entry_validation.md#rollback-plan)
- Story 3.2: [epic3_3-2-image-upload-with-ocr_validation.md](./epic3_3-2-image-upload-with-ocr_validation.md#rollback-plan)
- Story 3.3: [epic3_3-3-katex-math-rendering_validation.md](./epic3_3-3-katex-math-rendering_validation.md#rollback-plan)

---

## Acceptance Criteria (Epic-Level)

**Epic 3 Success Criteria:**

- [ ] **Text Entry (Story 3.1):**
  - Students can type math problems
  - AI detects and confirms problems before dialogue
  - Placeholder updated, ambiguous input handled

- [ ] **Image Upload (Story 3.2):**
  - Students can upload images (click or drag-drop)
  - OCR extracts text using GPT-4 Vision
  - Extracted text editable before sending

- [ ] **Math Rendering (Story 3.3):**
  - Inline math ($x^2$) renders formatted in AI messages
  - Display math ($$...$$) renders centered
  - Common notation supported (fractions, exponents, roots, Greek)

- [ ] **Integration:**
  - Text and image inputs both trigger problem confirmation
  - Math rendering works for both input types
  - Mobile-responsive across all features

- [ ] **Error Handling:**
  - Invalid file types rejected
  - OCR failures handled gracefully
  - Invalid LaTeX falls back to plain text

---

## Test Execution Summary

**Date Tested:** _____________________
**Tested By:** _____________________
**Environment:** Local dev (http://localhost:3000)

### Smoke Test Result
- [ ] ✅ PASS - All 6 steps completed
- [ ] ❌ FAIL - Step(s) failed: _____________________

### Critical Scenarios
| Scenario | Status | Notes |
|----------|--------|-------|
| 1. Text → Confirmation → Formatted | ⬜ Pass / ⬜ Fail | |
| 2. Image → OCR → Formatted | ⬜ Pass / ⬜ Fail | |
| 3. Ambiguous Input Handling | ⬜ Pass / ⬜ Fail | |
| 4. Complex Equation Rendering | ⬜ Pass / ⬜ Fail | |
| 5. Mobile End-to-End | ⬜ Pass / ⬜ Fail | |

### Edge Cases
| Edge Case | Status | Notes |
|-----------|--------|-------|
| Invalid LaTeX in AI Response | ⬜ Pass / ⬜ Fail | |
| OCR Extracts LaTeX Notation | ⬜ Pass / ⬜ Fail | |
| Blurry Image Partial OCR | ⬜ Pass / ⬜ Fail | |
| Network Failure During OCR | ⬜ Pass / ⬜ Fail | |

### Mobile/Responsive
| Device | Status | Notes |
|--------|--------|-------|
| iPhone 12 (390x844) | ⬜ Pass / ⬜ Fail | |
| iPad (768x1024) | ⬜ Pass / ⬜ Fail | |
| Android (360x640) | ⬜ Pass / ⬜ Fail | |

**Overall Epic 3 Status:** ⬜ PASS / ⬜ FAIL

**Blocking Issues:** _____________________

**Non-Blocking Issues:** _____________________

**Recommendations:**
- [ ] Ready for next epic (Epic 4)
- [ ] Needs fixes before proceeding
- [ ] Needs additional testing

---

## Reference: Detailed Per-Story Validation Guides

For comprehensive test cases, detailed steps, and story-specific rollback plans, see:

1. **Story 3.1 - Text Problem Entry:**
   - [epic3_3-1-text-problem-entry_validation.md](./epic3_3-1-text-problem-entry_validation.md)
   - Focus: Problem detection, confirmation, ambiguous input handling
   - Test cases: 11 TCs covering detection, ambiguity, context modes, placeholder

2. **Story 3.2 - Image Upload with OCR:**
   - [epic3_3-2-image-upload-with-ocr_validation.md](./epic3_3-2-image-upload-with-ocr_validation.md)
   - Focus: Upload UX, OCR accuracy, file validation, API integration
   - Test cases: 23 TCs covering click/drag upload, resize, OCR types, errors, mobile

3. **Story 3.3 - KaTeX Math Rendering:**
   - [epic3_3-3-katex-math-rendering_validation.md](./epic3_3-3-katex-math-rendering_validation.md)
   - Focus: Inline/display math, notation coverage, error handling, mobile rendering
   - Test cases: 28 TCs covering inline, display, notation, integration, mobile, user vs AI messages

**Total Test Coverage:** 62 detailed test cases across 3 stories

---

## Files Modified in Epic 3

**CREATED:**
- `components/ImageUpload.tsx` - Image upload with drag-drop, resize, OCR
- `app/api/ocr/route.ts` - GPT-4 Vision API endpoint for OCR
- `components/MathText.tsx` - LaTeX parser and KaTeX renderer

**MODIFIED:**
- `lib/prompts.ts` - Added T1.1A problem detection and confirmation section
- `components/MessageInput.tsx` - Updated placeholder, integrated ImageUpload
- `components/Message.tsx` - Integrated MathText for AI messages
- `app/layout.tsx` - Added KaTeX CSS import
- `package.json` - Added katex@^0.16.25, @types/katex@^0.16.7

**DOCUMENTATION:**
- `docs/stories/3-1-text-problem-entry.md` + `.context.xml`
- `docs/stories/3-2-image-upload-with-ocr.md` + `.context.xml`
- `docs/stories/3-3-katex-math-rendering.md` + `.context.xml`
- `docs/validation/epic3_3-1-text-problem-entry_validation.md`
- `docs/validation/epic3_3-2-image-upload-with-ocr_validation.md`
- `docs/validation/epic3_3-3-katex-math-rendering_validation.md`
- `docs/validation/epic3_validation.md` (this file)

**SPRINT STATUS:**
- `docs/sprint-status.yaml` - Epic 3 and Stories 3.1, 3.2, 3.3 marked 'review'

---

## Architecture Decisions Referenced

- **ADR-003:** GPT-4 Vision for OCR (not Google Cloud Vision)
  - Rationale: Unified billing, better math notation understanding
  - Impact: Story 3.2

- **ADR-004:** Manual Testing Only for MVP
  - Rationale: Speed over test coverage for MVP
  - Impact: All Epic 3 stories (no automated tests)

- **ADR-005:** KaTeX over MathJax
  - Rationale: Faster rendering, smaller bundle (~83KB vs 300KB+)
  - Impact: Story 3.3

---

## Known Limitations (As Designed)

1. **OCR Accuracy:** Depends on GPT-4 Vision capabilities. Blurry/handwritten text may have errors. Mitigation: User can edit before sending.

2. **LaTeX Rendering:** KaTeX supports common K-12 notation but not all advanced math (e.g., commutative diagrams). Fallback: Plain text display.

3. **Mobile Camera Access:** Browser-dependent (Safari, Chrome). Some browsers may not allow camera in web apps.

4. **No Offline Support:** OCR requires network. Image upload fails offline. Mitigation: Error message shown.

5. **File Size Limit:** 10MB max for images. Client-side resize helps, but very large files rejected.

---

## Success Metrics (Manual Observation)

**User Experience:**
- [ ] Can a student upload a photo and get help within 10 seconds?
- [ ] Are math equations readable and professional-looking?
- [ ] Does the AI confirm problems before diving into solutions?

**Technical:**
- [ ] OCR response time < 5 seconds for typical images
- [ ] KaTeX bundle size < 100KB
- [ ] No console errors during normal usage

**Integration:**
- [ ] Text and image inputs both work seamlessly
- [ ] Math rendering works in Guided and Challenge modes
- [ ] Mobile experience equivalent to desktop

---

## Next Steps After Epic 3

**If validation passes:**
- ✅ Mark Epic 3 as 'done' in sprint-status.yaml
- ✅ Update all 3 stories from 'review' to 'done'
- ✅ Commit validation guides to git
- ✅ Proceed to Epic 4: Gamification & Polish

**If validation fails:**
- ❌ Document blocking issues
- ❌ Prioritize fixes (P0 blockers first)
- ❌ Re-run validation after fixes
- ❌ Do not proceed to Epic 4 until Epic 3 passes

---

**Validation Guide Version:** 1.0
**Last Updated:** 2025-11-07
**Epic Status:** Review → Pending Validation
