# zeroai - Epic Breakdown

**Author:** Reena
**Date:** November 3, 2025
**Project Level:** 2
**Target Scale:** 3-5 day MVP with 12-18 implementable stories

---

## Overview

This document provides the detailed epic breakdown for zeroai, expanding on the high-level epic list in the [PRD](./PRD.md).

Each epic includes:

- Expanded goal and value proposition
- Complete story breakdown with user stories
- Acceptance criteria for each story
- Story sequencing and dependencies

**Epic Sequencing Principles:**

- Epic 1 establishes foundational infrastructure and initial functionality
- Subsequent epics build progressively, each delivering significant end-to-end value
- Stories within epics are vertically sliced and sequentially ordered
- No forward dependencies - each story builds only on previous work

---

## Epic Overview

### Epic 1: Core Chat Infrastructure (Foundation - Day 1)
**Goal:** Establish the basic conversation engine with LLM integration and validate Socratic prompting approach.

**Value:** Proves the core concept works - AI can guide students through Socratic questioning. Technical foundation for all subsequent features.

**Stories:** 3-4 stories

---

### Epic 2: Scaffolded Socratic Dialogue (Intelligence - Day 2)
**Goal:** Implement context-aware learning modes and adaptive scaffolding with worked examples.

**Value:** Delivers the unique differentiator - Socratic tutoring that adapts to student context (homework vs exam vs exploration). No competitor has this.

**Stories:** 3-4 stories

---

### Epic 3: Problem Input & Math Rendering (Input/Output - Day 3)
**Goal:** Enable students to enter problems via text or image upload, with proper math rendering.

**Value:** Completes the core tutoring loop - students can submit real problems and see properly formatted solutions.

**Stories:** 3-4 stories

---

### Epic 4: Gamification & Polish (Engagement - Day 4)
**Goal:** Add motivation layer (streaks, celebrations, counters) and polish UX for production readiness.

**Value:** Makes learning sticky - students return daily. Professional polish separates good from great.

**Stories:** 3-4 stories

---

### Epic 5: Testing, Documentation & Deployment (Launch Readiness - Day 5)
**Goal:** Validate across 5+ problem types, create documentation, demo video, and deploy.

**Value:** Launch-ready product that meets all Gauntlet criteria. Proof the system works end-to-end.

**Stories:** 2-3 stories

---

## Epic Details

### Epic 1: Core Chat Infrastructure

**Epic Goal:** Build the foundational chat interface with LLM integration and Socratic prompting engine.

**Why This First:** Everything builds on the conversation engine. We need to validate that the LLM can successfully guide Socratic dialogue before adding complexity.

**Stories:**

---

**Story 1.1: Basic Web App Setup with Chat UI Skeleton**

As a developer,
I want a clean web application foundation with basic chat interface structure,
So that I have a working skeleton to build features on.

**Acceptance Criteria:**
1. Next.js or React app initialized with TypeScript
2. Basic chat UI layout created (header, message area, input field)
3. Styled with Tailwind CSS or similar for rapid iteration
4. Message area displays with scrollable container
5. Input field at bottom with send button
6. App runs locally on localhost:3000
7. Clean folder structure: components/, pages/, lib/, styles/

**Prerequisites:** None (foundation story)

**Technical Notes:**
- Choose Next.js for easy deployment to Vercel
- Component structure: ChatContainer, MessageList, MessageInput, Message
- Start mobile-first responsive design (min 768px tablet)

---

**Story 1.2: Conversation State Management**

As a student,
I want my conversation with the AI to be displayed in a chat interface,
So that I can see the full dialogue history.

**Acceptance Criteria:**
1. State management implemented (useState or Zustand)
2. Messages array stores: {id, role: 'user'|'assistant', content, timestamp}
3. MessageList component renders all messages chronologically
4. User messages right-aligned, AI messages left-aligned
5. Auto-scroll to newest message on send
6. Visual distinction between user/AI messages (colors, avatars)
7. Input field clears after sending message
8. Send button disabled while waiting for response

**Prerequisites:** Story 1.1 (needs UI skeleton)

**Technical Notes:**
- Simple state is fine for MVP (no Redux needed)
- Message format: `{id: nanoid(), role, content, timestamp: Date.now()}`
- Consider useRef for auto-scroll to bottom

---

**Story 1.3: LLM API Integration**

As a developer,
I want to connect to an LLM API (GPT-4 or Claude),
So that the AI can respond to student messages.

**Acceptance Criteria:**
1. API route created (/api/chat or server action)
2. Environment variable for API key (OPENAI_API_KEY or ANTHROPIC_API_KEY)
3. Successful API call to GPT-4 or Claude Sonnet
4. Response streaming implemented for better UX
5. Loading state shown while AI generates response ("AI is thinking...")
6. Error handling for API failures (display friendly message, allow retry)
7. Conversation context maintained (send last 10 messages for context)
8. Response appears in chat as new AI message

**Prerequisites:** Story 1.2 (needs state management)

**Technical Notes:**
- Use OpenAI SDK or Anthropic SDK
- Streaming: `openai.chat.completions.create({stream: true})` or Anthropic equivalent
- Rate limiting: Consider basic retry logic with exponential backoff
- Context window: Send conversation history in messages array

---

**Story 1.4: Socratic System Prompt Engineering**

As a student,
I want the AI to guide me through solving a math problem without giving direct answers,
So that I learn through understanding, not memorization.

**Acceptance Criteria:**
1. System prompt created that enforces Socratic questioning
2. Prompt includes: "NEVER give direct answers. Guide through questions: 'What information do we have?' 'What method might help?'"
3. Hardcoded test problem used for validation: "Solve for x: 2x + 5 = 13"
4. AI successfully guides through problem WITHOUT revealing answer
5. AI asks guiding questions like "What operation undoes addition?" "What happens if we subtract 5 from both sides?"
6. AI validates student responses and encourages next steps
7. Tested with 3+ different algebra problems to ensure consistency
8. 0% direct answer rate confirmed through manual testing

**Prerequisites:** Story 1.3 (needs LLM integration)

**Technical Notes:**
- System prompt stored in `/lib/prompts.ts` for easy iteration
- Test problems: Linear equations, simple quadratics, word problems
- Prompt engineering tips: Be explicit about "never reveal", give examples of good vs bad responses
- Consider adding few-shot examples in prompt for consistency

---

### Epic 2: Scaffolded Socratic Dialogue

**Epic Goal:** Implement context-aware learning modes and adaptive scaffolding with worked examples.

**Why This Second:** Builds on proven Socratic foundation from Epic 1. Adds the unique differentiator - context awareness and student agency.

**Stories:**

---

**Story 2.1: Context Mode Selection UI**

As a student,
I want to choose my learning context (Homework Help, Exam Prep, or Exploration) before starting,
So that the AI adapts its pacing to my situation.

**Acceptance Criteria:**
1. Mode selection screen shown at start of new session
2. Three clear buttons with icons and descriptions:
   - 🏃 Homework Help: "Due soon? Get efficient help that still teaches"
   - 📚 Exam Prep: "Test coming up? Fast-paced review"
   - 🔍 Exploration: "Learning for fun? Deep patient guidance"
3. One-click selection stores mode in session state
4. Selected mode visible throughout session (small indicator in header)
5. Mode cannot be changed mid-session (prevents confusion)
6. Default to Homework Help if user skips selection
7. Clean, intuitive design - takes <5 seconds to choose

**Prerequisites:** Story 1.2 (needs state management)

**Technical Notes:**
- Store as `sessionMode: 'homework' | 'exam' | 'explore'` in state
- Icons: Use Heroicons or Lucide for consistency
- Design: Large buttons (min 120px height), clear visual hierarchy
- Consider adding tooltip: "You can restart to change mode"

---

**Story 2.2: Mode-Aware System Prompts**

As a student,
I want the AI's teaching style to match my selected context,
So that I get the right pace and depth for my situation.

**Acceptance Criteria:**
1. Three separate system prompt variants created for each mode
2. **Homework Help mode:**
   - Question density: 2-3 questions per concept
   - Tone: "Let's work through this efficiently"
   - Faster to show scaffolding (after 2 turns vs 3)
3. **Exam Prep mode:**
   - Question density: 1-2 questions per concept
   - Tone: "Quick review - you've got this"
   - Assumes baseline mastery, fewer hints
4. **Exploration mode:**
   - Question density: 5-7 questions per concept
   - Tone: "Let's explore this deeply"
   - Patient, encourages "why" questions
5. Correct prompt selected based on sessionMode
6. Observable difference in AI behavior across modes (tested manually)
7. All modes still NEVER give direct answers

**Prerequisites:** Story 2.1 (needs mode selection), Story 1.4 (builds on base Socratic prompt)

**Technical Notes:**
- Prompts stored in `/lib/prompts.ts` as `SOCRATIC_PROMPTS = {homework, exam, explore}`
- Prompt structure: Base Socratic rules + mode-specific pacing instructions
- Test with same problem across all 3 modes to verify different pacing

---

**Story 2.3: Worked Example Scaffolding Logic**

As a student,
I want the AI to show me a worked example of a similar problem when I'm stuck,
So that I can learn the pattern without cognitive overload.

**Acceptance Criteria:**
1. System detects "stuck state": 2+ consecutive failed attempts OR no progress after 3 turns
2. AI generates SIMILAR problem (not exact problem) with step-by-step solution
3. Example format: "Let me show you a similar problem: [Example problem] Here's how to solve it: [Step 1, Step 2, Step 3]"
4. After example, AI says: "Now can you apply this same method to solve your problem?"
5. Never shows solution to student's exact problem (maintains learning value)
6. Worked examples happen faster in Homework mode (2 turns) vs Exploration (3 turns)
7. Examples use proper math notation (prepare for KaTeX in Epic 3)
8. Tested with algebra, geometry, word problems

**Prerequisites:** Story 2.2 (builds on mode-aware prompting)

**Technical Notes:**
- Stuck detection: Track consecutive failed responses in conversation metadata
- Prompt instruction: "If student stuck >2 turns, provide worked example of SIMILAR problem"
- Similar problem generation: LLM generates on-the-fly (e.g., "2x + 5 = 13" → example "3x + 2 = 11")
- Mode-specific thresholds: homework=2 turns, exam=2 turns, explore=3 turns

---

**Story 2.4: "I'm Really Confused" Button**

As a student,
I want to click a button when I'm confused,
So that I can immediately get deeper scaffolding without waiting.

**Acceptance Criteria:**
1. "I'm really confused" button visible on every AI message
2. Click triggers immediate worked example + deeper scaffolding (same as Story 2.3 logic)
3. Button styled clearly but not intrusively (secondary button style)
4. After clicking, AI responds: "No problem! Let me show you a similar example..."
5. Button click tracked in conversation metadata
6. Student can click multiple times if needed
7. Adaptive pace check-in after scaffolding: "Feeling more confident? Want to continue at this pace?"
8. Check-in happens max once per problem (not annoying)

**Prerequisites:** Story 2.3 (uses same scaffolding logic)

**Technical Notes:**
- Button component: `<ConfusedButton onClick={handleConfused} />`
- onClick: Inject system message to trigger scaffolding response
- Pace check-in: Ask after 2-3 exchanges post-scaffolding
- Track in metadata: `{confusedClicked: boolean, paceCheckShown: boolean}`

---

### Epic 3: Problem Input & Math Rendering

**Epic Goal:** Enable students to enter problems via text or image upload, with proper math rendering.

**Why This Third:** Core tutoring loop is proven (Epic 1-2). Now make it work with REAL student problems, not hardcoded ones.

**Stories:**

---

**Story 3.1: Text Problem Entry**

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

**Story 3.2: Image Upload with OCR**

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

**Story 3.3: KaTeX Math Rendering**

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

### Epic 4: Gamification & Polish

**Epic Goal:** Add motivation layer (streaks, celebrations, counters) and polish UX for production readiness.

**Why This Fourth:** Core functionality complete (Epics 1-3). Now layer on engagement features that make it sticky.

**Stories:**

---

**Story 4.1: Daily Streak Tracker**

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

**Story 4.2: Problems Solved Counter**

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

**Story 4.3: Celebration Animations**

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

**Story 4.4: Responsive Design & UX Polish**

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

### Epic 5: Testing, Documentation & Deployment

**Epic Goal:** Validate across 5+ problem types, create documentation, demo video, and deploy.

**Why This Last:** Product is feature-complete. Now prove it works end-to-end and prepare for Gauntlet submission.

**Stories:**

---

**Story 5.1: Cross-Problem-Type Testing & Validation**

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

**Story 5.2: Documentation, Demo Video & Deployment**

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

## Implementation Sequence

### Development Phases

The 17 stories are organized into 5 sequential phases aligned with the 5-day timeline. Stories within each phase can often run in parallel where dependencies allow.

---

#### Phase 1: Foundation (Day 1) - Epic 1

**Goal:** Get basic conversation working with Socratic prompting

**Stories (Sequential):**
1. **Story 1.1** - Basic Web App Setup (START HERE - no dependencies)
2. **Story 1.2** - Conversation State Management (depends on 1.1)
3. **Story 1.3** - LLM API Integration (depends on 1.2)
4. **Story 1.4** - Socratic System Prompt Engineering (depends on 1.3)

**Milestone:** Working chat interface where AI guides through hardcoded problem using Socratic method

**Parallel Opportunities:** None in Phase 1 (all sequential dependencies)

---

#### Phase 2: Intelligence (Day 2) - Epic 2

**Goal:** Add context-aware modes and adaptive scaffolding

**Stories:**
1. **Story 2.1** - Context Mode Selection UI (can start immediately after Phase 1)
2. **Story 2.2** - Mode-Aware System Prompts (depends on 2.1 and 1.4)
3. **Story 2.3** - Worked Example Scaffolding Logic (depends on 2.2)
4. **Story 2.4** - "I'm Really Confused" Button (depends on 2.3)

**Milestone:** AI adapts pacing based on selected mode, provides worked examples when stuck

**Parallel Opportunities:** Story 2.1 can overlap with finishing 1.4 (UI work vs prompt engineering)

---

#### Phase 3: Input/Output (Day 3) - Epic 3

**Goal:** Enable real problem entry and proper math display

**Stories:**
1. **Story 3.1** - Text Problem Entry (can start immediately after Phase 2)
2. **Story 3.2** - Image Upload with OCR (depends on 3.1)
3. **Story 3.3** - KaTeX Math Rendering (can parallel with 3.2)

**Milestone:** Students can enter problems via text or image, math renders beautifully

**Parallel Opportunities:** Story 3.3 (math rendering) can run parallel with 3.2 (OCR) - different systems

---

#### Phase 4: Engagement (Day 4) - Epic 4

**Goal:** Add gamification and polish for production quality

**Stories (High Parallelization):**
1. **Story 4.1** - Daily Streak Tracker (can start immediately after Phase 3)
2. **Story 4.2** - Problems Solved Counter (can parallel with 4.1)
3. **Story 4.3** - Celebration Animations (depends on 4.1 and 4.2 for data)
4. **Story 4.4** - Responsive Design & UX Polish (can parallel with 4.1-4.3)

**Milestone:** Polished, engaging product with streaks, celebrations, responsive design

**Parallel Opportunities:** Stories 4.1, 4.2, 4.4 are all independent (3 can run simultaneously!)

---

#### Phase 5: Launch (Day 5) - Epic 5

**Goal:** Validate, document, and deploy

**Stories:**
1. **Story 5.1** - Cross-Problem-Type Testing & Validation (needs complete product from Phase 4)
2. **Story 5.2** - Documentation, Demo Video & Deployment (depends on 5.1 bug fixes)

**Milestone:** Launch-ready product deployed and documented for Gauntlet submission

**Parallel Opportunities:** Documentation can start during 5.1 testing (write README while testing)

---

## Dependency Graph

### Critical Path (Must Be Sequential)
```
1.1 → 1.2 → 1.3 → 1.4 → 2.2 → 2.3 → 2.4 → 3.1 → 3.2 → 4.3 → 5.1 → 5.2
```

### Parallel Tracks Available
```
Day 2: Story 2.1 (mode UI) can overlap end of Day 1
Day 3: Story 3.3 (math rendering) || Story 3.2 (OCR)
Day 4: Story 4.1 (streaks) || Story 4.2 (counters) || Story 4.4 (polish)
Day 5: Documentation || Testing (partial overlap)
```

### Success Checkpoints

**After Day 1:**
- ✅ Chat interface works
- ✅ LLM responds with Socratic questions
- ✅ No direct answers given

**After Day 2:**
- ✅ Three modes selectable
- ✅ AI pacing differs across modes
- ✅ Worked examples show when stuck
- ✅ "Confused" button triggers scaffolding

**After Day 3:**
- ✅ Text problems accepted
- ✅ Image upload works with OCR
- ✅ Math renders properly (fractions, exponents, etc.)

**After Day 4:**
- ✅ Streaks tracking
- ✅ Celebration animations
- ✅ Responsive on tablet/laptop
- ✅ Production-quality polish

**After Day 5:**
- ✅ 5+ problem types tested
- ✅ README and demo video complete
- ✅ Deployed to public URL
- ✅ Ready for Gauntlet submission

---

## Risk Mitigation

### High-Risk Stories (Watch Carefully)

**Story 3.2 (Image OCR):**
- **Risk:** OCR accuracy may be lower than expected, especially handwritten
- **Mitigation:** Focus on printed text first, handwritten is bonus; graceful error handling
- **Fallback:** If Vision API struggles, prioritize text entry flow

**Story 2.3 (Worked Example Scaffolding):**
- **Risk:** LLM might not consistently generate SIMILAR (not identical) problems
- **Mitigation:** Explicit prompt engineering with examples; manual testing with diverse problems
- **Fallback:** If automatic generation fails, use predefined example bank

**Story 1.4 (Socratic Prompting):**
- **Risk:** LLM might accidentally give direct answers despite prompt instructions
- **Mitigation:** Iterative prompt testing; add few-shot examples; include explicit "NEVER reveal answer" rules
- **Fallback:** Multiple prompt iterations budgeted into Day 1

### Technical Complexity Notes

**Easy Stories (2-3 hours):**
- 1.1 (web app setup)
- 1.2 (state management)
- 2.1 (mode UI)
- 4.1 (streaks)
- 4.2 (counters)

**Medium Stories (3-4 hours):**
- 1.3 (LLM integration)
- 2.2 (mode prompts)
- 3.1 (text entry)
- 3.3 (math rendering)
- 4.3 (animations)
- 4.4 (responsive polish)

**Complex Stories (4-6 hours):**
- 1.4 (Socratic prompt engineering - requires iteration)
- 2.3 (worked example logic)
- 2.4 (confused button + pace check-ins)
- 3.2 (OCR integration)
- 5.1 (comprehensive testing)
- 5.2 (documentation + deployment)

---

## Story Validation

### Size Check ✅

All 17 stories validated for single-agent completion:

**Criteria Met:**
- ✅ Story descriptions <500 words each
- ✅ Clear inputs and outputs defined
- ✅ Single responsibility per story
- ✅ No hidden complexity

**Story Size Distribution:**
- Easy (2-3h): 5 stories (29%)
- Medium (3-4h): 6 stories (35%)
- Complex (4-6h): 6 stories (35%)

**Result:** All stories fit comfortably in 200k context window with room for implementation code

---

### Clarity Check ✅

**All stories include:**
- ✅ Explicit acceptance criteria (3-10 criteria per story)
- ✅ Clear technical approach in notes
- ✅ No ambiguous requirements
- ✅ Success is measurable (can test/verify)

**Sample validation:**
- Story 1.4: "0% direct answer rate" = measurable
- Story 3.2: "90%+ accuracy on printed text" = measurable
- Story 4.1: Streak logic clearly defined with localStorage schema

---

### Dependency Check ✅

**Dependency Documentation:**
- ✅ All dependencies explicitly documented in Prerequisites
- ✅ Clear inputs needed to start each story
- ✅ Well-defined outputs for next story
- ✅ Parallel opportunities identified (7 stories can overlap)

**Dependency Stats:**
- Sequential dependencies: 12 stories in critical path
- Parallelizable: 5 stories can run simultaneously with others
- No forward dependencies: All stories only depend on previous work

---

### Estimated Completion

**Velocity Calculation:**
- Total stories: 17
- Total estimated hours: 60-72 hours
- Timeline: 5 days (8-12 hour days)
- Daily velocity: 3-4 stories per day

**Phase Duration:**
- Day 1 (Phase 1): 4 stories = 10-14 hours
- Day 2 (Phase 2): 4 stories = 11-15 hours
- Day 3 (Phase 3): 3 stories = 10-13 hours
- Day 4 (Phase 4): 4 stories = 12-16 hours (but 3 can parallel!)
- Day 5 (Phase 5): 2 stories = 12-14 hours

**Result:** Tight but achievable with focused 10-12 hour days

---

## Development Guidance

### Getting Started

**Before Day 1:**
1. Set up development environment:
   - Node.js 18+ installed
   - Code editor (VS Code recommended)
   - Git repository initialized
2. Obtain API keys:
   - OpenAI API key (for GPT-4) OR Anthropic API key (for Claude)
   - Optional: Google Cloud Vision API key (for OCR fallback)
3. Create `.env.local` file structure
4. Review PRD and Epic breakdown thoroughly

**Day 1 Start:**
- Begin with Story 1.1 (web app setup)
- Use Next.js App Router for modern React patterns
- Set up Tailwind CSS from the start (saves time later)
- Don't skip TypeScript - it prevents bugs in later stories

---

### Technology Stack Recommendations

**Frontend:**
- **Framework:** Next.js 14+ (App Router) - Easy Vercel deployment
- **Styling:** Tailwind CSS - Rapid iteration, responsive utilities
- **State:** Zustand or React Context - Simple, no Redux complexity needed
- **Icons:** Heroicons or Lucide - Consistent, free

**Backend/APIs:**
- **LLM:** GPT-4 (OpenAI) or Claude Sonnet (Anthropic) - Both work great
- **Vision:** GPT-4 Vision (easiest) or Google Cloud Vision
- **Deployment:** Vercel (Next.js optimized) or Netlify

**Libraries:**
- **Math Rendering:** KaTeX (lighter than MathJax)
- **Animations:** canvas-confetti (celebrations)
- **File Upload:** Native HTML5 (no library needed for MVP)
- **Unique IDs:** nanoid

**Development Tools:**
- **Testing:** Manual testing sufficient for MVP (automated tests = future)
- **Version Control:** Git with clear commit messages per story
- **Demo Video:** Loom or QuickTime screen recording

---

### Key Files to Create

**Project Structure:**
```
/app
  /page.tsx (main chat interface)
  /api
    /chat/route.ts (LLM API endpoint)
    /ocr/route.ts (Vision API endpoint)
/components
  /ChatContainer.tsx
  /MessageList.tsx
  /MessageInput.tsx
  /Message.tsx
  /ModeSelector.tsx
  /ConfusedButton.tsx
  /StreakDisplay.tsx
  /CelebrationAnimation.tsx
/lib
  /prompts.ts (Socratic system prompts)
  /localStorage.ts (streaks, counters)
  /mathUtils.ts (LaTeX helpers)
/styles
  /globals.css (Tailwind imports)
/.env.local (API keys - DO NOT COMMIT)
/README.md
/docs
  /prompts.md
  /test-results.md
```

---

### Daily Success Criteria

**Day 1 Done When:**
- Chat interface works locally
- Can type message and get LLM response
- AI uses Socratic method (no direct answers)
- Conversation history displays properly

**Day 2 Done When:**
- Three modes selectable with clear UI
- AI behavior noticeably different across modes
- "Confused" button shows worked example
- Adaptive pace check-ins working

**Day 3 Done When:**
- Can type problem and get help
- Can upload image and OCR extracts problem
- Math equations render properly (fractions, exponents work)

**Day 4 Done When:**
- Streak counter persists and updates correctly
- Celebration shows when problem solved
- App looks professional on tablet and laptop
- No obvious UI bugs

**Day 5 Done When:**
- Tested with 5+ diverse problem types
- README complete with setup instructions
- 5-min demo video recorded
- App deployed to public URL
- GitHub repo clean and organized

---

### Prompt Engineering Tips

**For Socratic Prompts (Story 1.4, 2.2):**

Use this structure:
```
You are a patient math tutor helping K-12 students.

CRITICAL RULES:
- NEVER give the direct answer to their problem
- Guide through questions: "What information do we have?" "What operation might help?"
- Validate their responses: "Exactly!" or "Not quite - think about..."
- If stuck >2 turns, provide worked example of SIMILAR problem (not their exact problem)
- Always encourage and be patient

[Mode-specific instructions here]

Example good guidance:
Student: "How do I solve 2x + 5 = 13?"
You: "Great question! First, what information do we have in this equation?"
Student: "We have 2x + 5 equals 13"
You: "Perfect! So we want to find x. What's the first step to isolate x?"

Example BAD (never do this):
Student: "How do I solve 2x + 5 = 13?"
You: "x = 4" ❌ TOO DIRECT
```

**Mode-Specific Additions:**
- Homework: "Work efficiently but thoroughly"
- Exam: "Quick review - you know this!"
- Explore: "Let's think deeply about why this works"

---

### Common Pitfalls to Avoid

**Technical:**
- ❌ Don't use complex state management (Redux) - overkill for MVP
- ❌ Don't build custom file upload - use native HTML5 input
- ❌ Don't over-engineer OCR - Vision API does the heavy lifting
- ❌ Don't skip environment variables - hardcoded keys = security risk

**Pedagogical:**
- ❌ LLM might give direct answers - test extensively, iterate prompts
- ❌ Worked examples might be TOO similar - explicitly say "similar but different"
- ❌ Confetti might be annoying - keep it subtle (2-3 seconds max)

**Scope:**
- ❌ Don't add features beyond 17 stories - scope creep kills timelines
- ❌ Don't perfect Day 1 - good enough, move forward
- ❌ Don't skip testing (Story 5.1) - bugs caught late = painful

---

### When Things Go Wrong

**If Story takes >6 hours:**
- Reassess scope - can you split it?
- Ask: "What's the MVP version of this story?"
- Consider technical debt - perfect later, working now

**If stuck on prompt engineering:**
- Add few-shot examples to system prompt
- Test with 3+ different problems
- Iterate quickly - don't overthink

**If OCR accuracy low:**
- Focus on printed text (90%+ achievable)
- Add manual edit flow (user fixes mistakes)
- Handwritten = stretch goal, not requirement

**If running behind schedule:**
- Cut stories 4.4 (polish) and 3.3 (math rendering) to stretch
- Prioritize: Socratic dialogue > Context modes > Gamification > Polish
- Demo video can be rough - judges value functionality over production

---

## Story Guidelines Reference

**Story Format:**

```
**Story [EPIC.N]: [Story Title]**

As a [user type],
I want [goal/desire],
So that [benefit/value].

**Acceptance Criteria:**
1. [Specific testable criterion]
2. [Another specific criterion]
3. [etc.]

**Prerequisites:** [Dependencies on previous stories, if any]
```

**Story Requirements:**

- **Vertical slices** - Complete, testable functionality delivery
- **Sequential ordering** - Logical progression within epic
- **No forward dependencies** - Only depend on previous work
- **AI-agent sized** - Completable in 2-4 hour focused session
- **Value-focused** - Integrate technical enablers into value-delivering stories

---

**For implementation:** Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown.

---

## Summary

**Epic Decomposition Complete for zeroai!**

You now have a comprehensive implementation blueprint:

- ✅ **5 epics** aligned with 5-day timeline
- ✅ **17 bite-sized stories** optimized for AI-agent development
- ✅ **Clear dependencies** mapped with parallel opportunities
- ✅ **Success checkpoints** for each day
- ✅ **Risk mitigation** for complex stories
- ✅ **Development guidance** with tech stack, file structure, and pitfalls

**Key Stats:**
- Total estimated effort: 60-72 hours
- Critical path: 12 stories sequential
- Parallelizable: 5 stories can run with others
- Complexity: Balanced distribution (29% easy, 35% medium, 35% complex)

**What Makes This Plan Succeed:**
1. **Vertical slicing** - Every story delivers working functionality
2. **Incremental value** - Each day produces demonstrable progress
3. **Clear scope** - No ambiguity, no scope creep
4. **Agent-friendly** - Stories fit 200k context limits
5. **Gauntlet-aligned** - Directly maps to competition criteria

**Ready to Implement:**
- Start with Story 1.1 (Basic Web App Setup)
- Follow the 5-phase sequence
- Track progress against daily success criteria
- Reference development guidance when stuck

**Next Workflow:**
- `/BMad:bmm:workflows:create-story` to generate detailed implementation plans per story
- `/BMad:bmm:workflows:architecture` to document technical architecture decisions
- `/BMad:bmm:workflows:sprint-planning` to initialize sprint tracking

---

**Document Status:** ✅ Complete - Ready for Development
**Created:** November 3, 2025
**Total Stories:** 17 across 5 epics
**Target Timeline:** 5 days (60-72 hours)
**Project:** zeroai - AI Math Tutor (Gauntlet C3)
