# Epic 3: Problem Input & Math Rendering (Input/Output - Day 3)

**Goal:** Enable students to enter problems via text or image upload, with proper math rendering.

**Why This Third:** Core tutoring loop is proven (Epic 1-2). Now make it work with REAL student problems, not hardcoded ones.

**Value:** Completes the core tutoring loop - students can submit real problems and see properly formatted solutions.

**Stories:** 3-4 stories

---

## Story 3.1: Text Problem Entry

As a student,
I want to type my math problem directly into the chat,
So that I can get help quickly without needing an image.

**Acceptance Criteria:**
1. Student can type problem in regular chat input: "Solve for x: 2x + 5 = 13"
2. Problem parsed and confirmed before starting dialogue
3. AI responds: "I see you want to solve [problem]. Let's work through this together!"
4. Handles plain text math notation (no LaTeX required from student)
5. Works with algebra, arithmetic, geometry (text-describable problems)
6. Student can edit problem if AI misunderstood
7. Smooth transition from problem entry to Socratic dialogue

**Prerequisites:** Story 1.4 (replaces hardcoded problem with user input)

**Technical Notes:**
- Problem detection: Look for keywords "solve", "find", "calculate", numbers, variables
- Confirmation: AI restates problem in first response
- No complex parsing needed yet - LLM handles interpretation
- Edge case: If ambiguous, AI asks clarifying question

---

## Story 3.2: Image Upload with OCR

As a student,
I want to upload a photo of my math problem,
So that I don't have to type complex equations.

**Acceptance Criteria:**
1. Image upload button visible in chat input area
2. Click opens file picker OR drag-drop zone appears
3. Supports JPG, PNG, PDF (max 10MB)
4. Image preview shown before submitting
5. Vision API (GPT-4 Vision or Google Cloud Vision) extracts problem text
6. Loading indicator during OCR: "Extracting problem..." (<5 seconds)
7. Extracted problem displayed for student confirmation
8. Student can edit extracted text if OCR made mistakes
9. 90%+ accuracy on printed text, 70%+ on clear handwritten
10. Graceful error handling: "Couldn't read image clearly. Please try typing the problem or upload a clearer photo."

**Prerequisites:** Story 3.1 (builds on text problem flow)

**Technical Notes:**
- Use GPT-4 Vision API or Google Cloud Vision API
- File upload: `<input type="file" accept="image/*,application/pdf" />`
- Preview: Convert to base64 or object URL
- OCR prompt: "Extract the math problem from this image. Return only the problem text, no explanations."
- Error handling: Network errors, unclear images, API failures

---

## Story 3.3: KaTeX Math Rendering

As a student,
I want math equations to display properly with fractions, exponents, and symbols,
So that problems and solutions are easy to read.

**Acceptance Criteria:**
1. KaTeX library integrated into app
2. Math notation in messages automatically rendered:
   - Fractions: $\frac{a}{b}$
   - Exponents: $x^2$
   - Radicals: $\sqrt{x}$
   - Equations: $2x + 5 = 13$
3. Inline math (within text) and block math (centered) both supported
4. LaTeX syntax detection: Text between $ or $$ delimiters
5. AI responses include proper LaTeX formatting
6. Works in problem display, worked examples, and dialogue
7. 95%+ of K-12 math notation renders correctly
8. Fallback: If rendering fails, show raw LaTeX (better than broken display)

**Prerequisites:** Story 3.2 (makes most sense with image upload where complex notation appears)

**Technical Notes:**
- Install: `npm install katex react-katex`
- Component: `<BlockMath math={latexString} />` or `<InlineMath />`
- Auto-detection: Regex to find $...$ patterns in message content
- System prompt update: Instruct AI to use LaTeX notation for math
- Test with: fractions, quadratics, geometry (angles, area), word problems

---

## Success Checkpoint: After Day 3

- ✅ Text problems accepted
- ✅ Image upload works with OCR
- ✅ Math renders properly (fractions, exponents, etc.)
