# Epic 5: Testing, Documentation & Deployment (Launch Readiness - Day 5)

**Goal:** Validate across 5+ problem types, create documentation, demo video, and deploy.

**Why This Last:** Product is feature-complete. Now prove it works end-to-end and prepare for Gauntlet submission.

**Value:** Launch-ready product that meets all Gauntlet criteria. Proof the system works end-to-end.

**Stories:** 2-3 stories

---

## Story 5.1: Cross-Problem-Type Testing & Validation

As a Gauntlet evaluator,
I want to see the tutor successfully guide students through diverse problem types,
So that I can validate pedagogical quality across domains.

**Acceptance Criteria:**
1. Test suite covers 5+ problem types:
   - Linear equations: "Solve for x: 2x + 5 = 13"
   - Quadratic equations: "Factor: x² + 5x + 6"
   - Geometry: "Find the area of a triangle with base 10cm and height 6cm"
   - Word problems: "John has 3 apples, buys 5 more. How many total?"
   - Multi-step: "Solve: 2(x + 3) = 14"
2. For each problem type:
   - AI guides without giving direct answer ✅
   - Worked examples provided when stuck ✅
   - Different pacing across modes observable ✅
   - Math rendering works correctly ✅
3. Document test results in `/docs/test-results.md`
4. All 5 problem types pass successfully
5. Edge cases tested: Ambiguous problems, incorrect student answers, confused button spam
6. Performance validated: <3s LLM response, <5s OCR
7. Bug fixes completed for any failures

**Prerequisites:** All Epic 1-4 stories (full product needed)

**Technical Notes:**
- Manual testing with real problems
- Document: Problem, mode used, AI behavior, pass/fail, notes
- Use all 3 modes for each problem type
- Test confused button, worked examples, pace check-ins

---

## Story 5.2: Documentation, Demo Video & Deployment

As a Gauntlet judge and future user,
I want clear documentation and a working deployment,
So that I can easily understand, evaluate, and use the product.

**Acceptance Criteria:**
1. **README.md** created with:
   - Project overview and unique value proposition
   - Setup instructions (clone, npm install, env vars, run)
   - Technology stack (Next.js, GPT-4/Claude, KaTeX, etc.)
   - Feature highlights (context modes, scaffolding, gamification)
   - 5+ example problem walkthroughs
2. **Prompt Engineering Documentation** (`/docs/prompts.md`):
   - System prompts for all 3 modes
   - Worked example scaffolding logic
   - Iteration notes and learnings
3. **Demo Video** (5 minutes):
   - Text problem entry → Socratic dialogue
   - Image upload → OCR → dialogue
   - All 3 context modes demonstrated
   - Confused button → worked example
   - Celebration animation → streak increment
   - Voiceover explaining unique features
4. **Deployment:**
   - App deployed to Vercel or Netlify
   - Public URL accessible: https://zeroai-tutor.vercel.app (or similar)
   - Environment variables configured
   - No broken links or console errors
   - Performance validated on deployed version

**Prerequisites:** Story 5.1 (testing complete, bugs fixed)

**Technical Notes:**
- README: Clear headings, screenshots, code examples
- Demo video: Loom or QuickTime screen recording + editing
- Deployment: `vercel deploy` or `netlify deploy`
- Environment: Add API keys in Vercel/Netlify dashboard
- Test deployed version thoroughly before submission

---

## Success Checkpoint: After Day 5

- ✅ 5+ problem types tested
- ✅ README and demo video complete
- ✅ Deployed to public URL
- ✅ Ready for Gauntlet submission
