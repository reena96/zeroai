# zeroai - Product Requirements Document

**Author:** Reena
**Date:** November 3, 2025
**Version:** 1.0

---

## Executive Summary

**Product:** AI Math Tutor - Socratic Learning Assistant that guides K-12 students (grades 6-12) through math problems using research-backed scaffolded Socratic questioning, adapted to their learning context (homework deadline vs. exam prep vs. exploration), with gamification to drive engagement and habit formation.

**Problem Solved:** Students need math help that builds genuine understanding (not just answer-showing like Photomath), adapted to their urgency and learning context (not one-size-fits-all like Khanmigo), with engaging motivation to keep practicing. Current solutions either just show answers (cognitive harm) or use pure Socratic method without scaffolding (cognitive overload per expertise reversal effect).

**Market Opportunity:** $1.05B serviceable market (K-12 math tutoring), 30.5% CAGR, with a 1-2 year window while Khanmigo remains in US-only pilot phase.

### What Makes This Special

**The Magic Moments:**

1. **Context-Aware Adaptation** - A student in "Homework Help mode" (9pm, 10 problems due tomorrow) gets faster-paced guidance with more scaffolding, while another student in "Exploration mode" (weekend, curious about calculus) gets patient deep Socratic questioning. Same tutor, different pacing, adapted to THEIR situation.

2. **Student Agency & Control** - When stuck, the student clicks "I'm really confused" and the AI immediately provides a worked example of a similar problem, then guides them to apply the pattern. The student controls depth, not the AI.

3. **Celebration & Motivation** - After working through Socratic guidance, the student solves the problem solo and sees confetti animation + "You solved it! 🎉 5-day streak!" The dopamine hit keeps them coming back.

4. **Scaffolded Socratic (Research-Backed)** - Unlike pure discovery learning (which causes cognitive overload in beginners per Math Academy research), we provide worked examples as "concrete hints" after 2 failed Socratic turns, then guide retrieval practice. TRUE learning without frustration.

**Unique Positioning (The Moat):**
- ✅ Socratic + Gamified + Context-Aware (NO competitor has all three)
- ✅ Khanmigo: Socratic but no gamification or context modes
- ✅ Math Academy: Gamification but no Socratic dialogue, drill-focused
- ✅ Photomath: Answer-delivery, no learning

---

## Project Classification

**Technical Type:** Web Application (Chat UI with image upload, real-time LLM integration, gamification state management)

**Domain:** Education Technology (EdTech) - K-12 Mathematics Learning

**Complexity:** Medium - Requires deep understanding of learning science principles (Socratic method, scaffolding, spaced repetition, retrieval practice) combined with technical implementation (LLM prompt engineering, OCR/Vision parsing, math rendering, state persistence).

**Project Context:**
- **Timeline:** 3-5 days core MVP (Gauntlet C3 competition), Days 6-7 stretch features
- **Success Criteria:** Guides students through 5+ problem types without giving direct answers; maintains conversation context; adapts to student understanding
- **Evaluation:** Pedagogical Quality (35%), Technical Implementation (30%), UX (20%), Innovation (15%)

**Domain Classification:** Standard EdTech (leverages proven pedagogical research from Math Academy, Khan Academy) with innovation in context-awareness and student agency features.

---

## Success Criteria

### Gauntlet Competition Success (Primary - Days 1-5)

**Pedagogical Quality (35% weight):**
- ✅ Demonstrates scaffolded Socratic method across 5+ problem types (arithmetic, algebra, geometry, word problems, multi-step)
- ✅ NEVER gives direct answers - guides through questions, validates responses, provides worked examples as "concrete hints"
- ✅ Context-aware pacing adapts to selected mode (Homework/Exam/Exploration)
- ✅ "I'm really confused" button triggers adaptive scaffolding (research-backed)
- ✅ Maintains conversation context across multiple turns

**Technical Implementation (30% weight):**
- ✅ Production-ready quality - bug-free, fast response times (<3 sec), handles edge cases
- ✅ OCR/Vision LLM successfully extracts problems from images (printed text prioritized)
- ✅ Math rendering (LaTeX/KaTeX) displays equations properly
- ✅ Clean code architecture, deployable to Vercel/Netlify

**User Experience (20% weight):**
- ✅ Intuitive chat UI with conversation history
- ✅ Clear context mode selection (3 visual buttons)
- ✅ Visible "I'm really confused" button
- ✅ Celebration animations feel rewarding (not annoying)
- ✅ Mobile-responsive design

**Innovation (15% weight):**
- ✅ Context-aware learning modes (NO competitor has this)
- ✅ Student agency through depth control (unique)
- ✅ Socratic + Gamified combination (unique positioning)

### Post-Competition Success (Long-term Vision)

**User Love Indicators:**
- 100+ beta users who use it 3+ times per week (sticky product)
- "This is the ONLY tutor that gets my situation" testimonials
- Net Promoter Score > 50

**Business Validation:**
- 10-20% beta → paid conversion ($4/month pricing)
- <5% monthly churn
- 1,000+ paying users within 3 months ($4K MRR)

**Learning Effectiveness:**
- Students successfully solve similar problems after Socratic guidance (retrieval practice validation)
- Avg 5+ problems solved per session (engagement)
- Daily streak retention > 40% week-over-week

---

## Product Scope

### MVP - Minimum Viable Product (Days 1-5)

**Core Features (Required for Gauntlet):**

1. **Problem Input**
   - Text entry for math problems
   - Image upload with OCR/Vision LLM parsing (start with printed text, handwritten if time permits)
   - Problem extraction and display

2. **Scaffolded Socratic Dialogue Engine**
   - Multi-turn conversation maintaining context
   - Guiding questions: "What information do we have?" "What method might help?"
   - Response validation and encouragement
   - **After 2 failed Socratic turns:** Show worked example of similar problem (not their exact problem)
   - **Then:** Guide student to apply pattern through retrieval practice
   - NEVER give direct answer to their exact problem

3. **Context-Aware Learning Modes**
   - **Homework Help:** Efficient pacing, more scaffolding/hints, faster to show worked examples
   - **Exam Prep:** Fast-paced review, assumes baseline mastery, fewer hints
   - **Exploration:** Patient deep Socratic, full scaffolding, encourages curiosity
   - Upfront mode selection with clear descriptions

4. **Student Agency Features**
   - **"I'm really confused" button** → Triggers worked example + deeper scaffolding
   - **Adaptive pace check-ins:** "Feeling more confident? Want to speed back up or keep this pace?"

5. **Math Rendering**
   - LaTeX/KaTeX for proper equation display
   - Handles fractions, exponents, radicals, etc.

6. **Chat UI**
   - Clean, familiar chat interface (like ChatGPT/messaging apps)
   - Conversation history within session
   - Image upload with preview
   - Loading states ("AI is thinking...")

7. **Gamification Layer (Lightweight)**
   - Daily streak tracker (persisted in localStorage for MVP)
   - Problems solved counter ("5 problems this week!")
   - Celebration animation on solo solve (confetti + encouragement)
   - Visual feedback system

**MVP Deliverables (Required):**
- Deployed app (Vercel/Netlify) or local with clear setup instructions
- GitHub repo with clean code structure
- Documentation: README with setup, 5+ example problem walkthroughs, prompt engineering notes
- 5-min demo video: Text input, image upload, Socratic dialogue, context modes, gamification

### Growth Features (Post-MVP - Days 6-7 or later)

**High-Value Additions:**
- Progress badges (Algebra Champion, Geometry Master, etc.)
- Visual progress bars per concept
- Difficulty level progression ("Level 4 unlocked!")
- Smart practice recommendations (revisit struggled concepts)
- "Welcome back!" personalized messages
- Persistent user accounts (backend + auth)

**Gauntlet Stretch Features (If time permits):**
- Interactive Whiteboard: Shared canvas for visual explanations
- Step Visualization: Animated breakdown of solution steps
- Voice Interface: Text-to-speech responses + speech-to-text input

### Vision (Future - Post-Competition)

**Advanced Adaptive Intelligence:**
- Full behavioral sensing (pause patterns, correction frequency, interaction analysis)
- "Your Daily Math Mix" - AI-generated personalized problem sets
- Multi-session learning path optimization
- Spaced repetition system (like Math Academy)
- Automatic difficulty calibration

**Advanced Gamification:**
- Animated avatar with expressions
- Multiplayer/competitive modes
- Achievement system with unlockables
- Weekly challenges and leaderboards

**Platform Expansion:**
- Mobile apps (iOS/Android)
- Teacher dashboard (assign problems, track progress)
- Parent portal (monitor usage, see progress)
- Integration with school LMS systems

**Monetization Features:**
- Freemium model (3 problems/day free, unlimited premium)
- Family plans ($10/month for 3 students)
- School/district licensing

---

## Functional Requirements

### FR-1: Problem Input & Parsing

**FR-1.1 Text Problem Entry**
- User can type math problem directly into text input
- Support for plain text: "2x + 5 = 13"
- System parses and displays for confirmation
- **Acceptance:** Successfully parse 95%+ of typed algebra/arithmetic problems

**FR-1.2 Image Upload with OCR**
- Drag-drop OR click-to-upload image file
- Support formats: JPG, PNG, PDF
- Vision LLM (GPT-4 Vision or similar) extracts problem text
- Display extracted problem for user confirmation
- **Acceptance:** 90%+ accuracy on printed text, 70%+ on clear handwritten

**FR-1.3 Problem Display**
- Show extracted/entered problem with math rendering
- User can edit if OCR made mistakes
- Confirm before starting Socratic dialogue
- **Acceptance:** User can review and correct before proceeding

---

### FR-2: Scaffolded Socratic Dialogue Engine

**FR-2.1 Conversation Flow**
- System prompt: "You are a patient math tutor. NEVER give direct answers. Guide through questions: 'What information do we have?' 'What method might help?' If stuck >2 turns, provide concrete hint (worked example). Use encouraging language."
- Flow: Parse problem → Inventory knowns → Identify goal → Guide method selection → Step through solution → Validate answer
- Multi-turn conversation (maintain context across 10+ turns)
- **Acceptance:** 0% direct answer-giving rate across test problems

**FR-2.2 Guiding Questions**
- Ask: "What information do we have?" "What are we trying to find?" "What method might help?"
- Validate student responses: "Right! To get x alone, we need to..."
- Adjust question complexity based on student understanding
- **Acceptance:** Questions guide without revealing solution steps

**FR-2.3 Worked Example Scaffolding (Critical - Research-Backed)**
- **Trigger:** If student stuck >2 conversational turns OR clicks "I'm really confused"
- **Action:** Provide worked example of SIMILAR problem (not their exact problem)
  - Example: Student solving `2x + 5 = 13` → Show worked example of `3x + 2 = 11` with step-by-step solution
- **After example:** Guide student to apply pattern through retrieval practice: "Now can you apply this same method to solve your problem?"
- **Rationale:** Prevents cognitive overload (expertise reversal effect per Math Academy research) while maintaining learning through retrieval practice
- **Acceptance:** Worked examples shown within 3 turns of struggle, never give exact problem solution

**FR-2.4 Response Validation**
- Detect correct vs incorrect student responses
- Encourage correct: "Exactly! Now..."
- Guide incorrect: "Not quite - think about what happens when..." (don't reveal answer)
- Track understanding level for adaptive pacing
- **Acceptance:** 95%+ accurate response validation

---

### FR-3: Context-Aware Learning Modes

**FR-3.1 Mode Selection (Upfront)**
- Present 3 modes with clear descriptions before starting problem:
  - **🏃 Homework Help:** "Due soon? Get efficient help that still teaches"
  - **📚 Exam Prep:** "Test coming up? Fast-paced review"
  - **🔍 Exploration:** "Learning for fun? Deep patient guidance"
- One-click selection, stored for session
- **Acceptance:** Mode selection takes <5 seconds, descriptions clear and helpful

**FR-3.2 Mode-Aware Prompting (Differentiation Strategy)**
- **Homework Help mode:**
  - Question density: 2-3 questions per concept
  - Faster to show worked examples (after 2 turns vs 3)
  - More scaffolding hints
  - Tone: "Let's work through this efficiently"

- **Exam Prep mode:**
  - Question density: 1-2 questions per concept
  - Assumes baseline mastery, fewer hints
  - Faster pacing overall
  - Tone: "Quick review - you've got this"

- **Exploration mode:**
  - Question density: 5-7 questions per concept
  - Patient deep Socratic questioning
  - Full scaffolding, encourages "why" questions
  - Tone: "Let's explore this deeply"

- **Acceptance:** Observable difference in pacing/depth across modes, matches student expectations

---

### FR-4: Student Agency & Adaptive Features

**FR-4.1 "I'm Really Confused" Button (Innovation)**
- Visible button on every AI response
- Click → Immediately provide worked example + deeper scaffolding
- Ask: "Does this help? Let's try applying it to your problem"
- Student controls depth, not AI
- **Acceptance:** Button always visible, triggers immediate scaffolding response

**FR-4.2 Adaptive Pace Check-ins**
- After providing deeper scaffolding, ask: "Feeling more confident? Want to speed back up or keep this pace?"
- Student can adjust mid-session
- System remembers preference for current problem
- **Acceptance:** Check-ins feel natural, not intrusive (max 1 per problem)

---

### FR-5: Math Rendering

**FR-5.1 LaTeX/KaTeX Support**
- Render mathematical notation properly using KaTeX library
- Support: fractions `\frac{a}{b}`, exponents `x^2`, radicals `\sqrt{x}`, integrals, summations, matrices
- Inline and block rendering
- **Acceptance:** 95%+ of common K-12 math notation renders correctly

**FR-5.2 Problem & Solution Display**
- Original problem displayed with proper formatting
- Worked examples shown with proper math rendering
- Student work validated with proper notation
- **Acceptance:** Equations readable, professional-looking, no rendering errors

---

### FR-6: Chat UI & User Experience

**FR-6.1 Chat Interface**
- Familiar chat layout (student messages right-aligned, AI left-aligned)
- Conversation history within session (scrollable)
- Auto-scroll to latest message
- Clear visual distinction between student and AI messages
- **Acceptance:** Feels like using a messaging app, intuitive navigation

**FR-6.2 Image Upload UX**
- Drag-drop zone with clear visual feedback ("Drop your problem here")
- Click-to-upload fallback button
- Image preview before submitting
- Loading spinner during OCR processing ("Extracting problem...")
- **Acceptance:** Upload flow intuitive, completes in <10 seconds total

**FR-6.3 Loading States & Feedback**
- "AI is thinking..." indicator with animated dots during LLM response
- "Processing image..." during OCR
- Disable input during processing (prevents multiple submissions)
- Error messages if OCR fails or API errors
- **Acceptance:** User never wonders if system is working, clear error recovery

**FR-6.4 Mobile Responsiveness**
- Works on tablet (768px+) and laptop (1024px+)
- Touch-friendly buttons (minimum 44px tap targets)
- Readable text on smaller screens (16px+ body text)
- Image upload works on mobile devices
- **Acceptance:** Fully usable on iPad and laptop screens

---

### FR-7: Gamification System (Engagement Driver)

**FR-7.1 Daily Streak Tracker**
- Count consecutive days student used system
- Display prominently: "🔥 5 day streak!"
- Reset at midnight local time
- Persist in localStorage (MVP) or backend (future)
- Celebrate milestones: "7 day streak - You're on fire! 🎉"
- **Acceptance:** Streak accurate, visible, motivates daily usage

**FR-7.2 Problems Solved Counter**
- Count total problems solved (successfully completed after Socratic guidance)
- Display: "23 problems this week! 💪"
- Weekly reset (Monday 00:00)
- Separate counter for "solo solves" (no hints needed)
- **Acceptance:** Counter accurate, visible, celebrates progress

**FR-7.3 Celebration Animations**
- **Trigger:** When student solves problem correctly after Socratic guidance
- **Show:** Confetti animation + encouraging message ("You did it! 🎉", "Nice work! Keep it up! ⭐")
- **Duration:** 2-3 seconds, non-blocking
- Vary messages to avoid repetition
- **Acceptance:** Feels rewarding not annoying, students smile

**FR-7.4 Visual Progress Feedback**
- Show progress within current problem (e.g., "Step 2 of 4")
- Session summary: "3 problems solved today!"
- **Acceptance:** Student can track progress through session

---

## Non-Functional Requirements

### NFR-1: Performance (User-Facing Impact)

**Response Time Requirements:**
- LLM response generation: <3 seconds for Socratic questions
- OCR/Vision processing: <5 seconds for image extraction
- Math rendering: Instant (<100ms)
- Page load: <2 seconds
- **Rationale:** Learning flow disrupted by slow responses; students lose focus

**Concurrency:**
- Support 10+ concurrent users for Gauntlet demo
- MVP: 50-100 concurrent users (beta launch)
- **Rationale:** Demo day traffic + initial beta users

---

### NFR-2: Reliability & Error Handling

**Uptime (Post-MVP):**
- 95%+ uptime during beta (good enough for demo/testing)
- 99%+ uptime for paid launch
- **Rationale:** Students need help when stuck (often evenings); downtime = frustration

**Error Recovery:**
- OCR failures: Graceful degradation → "Couldn't read image, please try text input"
- LLM API errors: Retry once, then show friendly error + allow retry
- Network errors: Display clear message, preserve conversation state
- **Rationale:** Students shouldn't lose progress due to technical failures

---

### NFR-3: Integration Requirements

**LLM API Integration:**
- Support GPT-4 or Claude (configurable via environment variable)
- Streaming responses preferred (improves perceived speed)
- Conversation context maintained (last 10 turns minimum)
- **Rationale:** Socratic dialogue requires context; multiple LLM options reduce vendor lock-in

**Vision API Integration:**
- Support GPT-4 Vision or Google Cloud Vision
- Image size limit: 10MB max
- Supported formats: JPG, PNG, PDF
- **Rationale:** OCR critical for user experience; flexibility in providers

**State Persistence:**
- localStorage for MVP (streaks, counters, session state)
- Migration path to backend/database for production
- **Rationale:** Gamification requires persistence; localStorage sufficient for demo

---

### NFR-4: Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- **Rationale:** Cover 95%+ of student browser usage

**Device Support:**
- Laptop/desktop (1024px+ width) - primary
- Tablet (768px+ width) - secondary
- Mobile phone - not required for MVP
- **Rationale:** Students do homework on laptops/tablets; phone support is future

---

### Skipped NFRs (Not Applicable for MVP)

❌ **Security:** No user auth, no sensitive data in MVP → Not applicable
❌ **Scalability:** Gauntlet demo + small beta → Not needed yet
❌ **Accessibility:** WCAG compliance nice-to-have, not critical for MVP
❌ **Data Privacy:** No PII collected in MVP → GDPR/COPPA not applicable yet
❌ **Monitoring/Analytics:** Basic error logs sufficient for MVP

---

## Implementation Planning

### Project Level & Scale

**Project Level:** 2 (Medium - 12-18 stories)
**Target Scale:** 3-5 day MVP with clear path to production-ready product

**Rationale:**
- Core features well-defined and scoped
- Technical complexity moderate (LLM integration, OCR, state management)
- Requires 12-18 bite-sized stories for 200k context development
- Clear separation between MVP (Days 1-5) and growth features (Days 6-7+)

### Epic Breakdown Required

This PRD must be decomposed into implementable epics and stories for development. Each epic represents a major capability area, broken into bite-sized stories optimized for AI-assisted development (200k context window).

**Recommended Epic Structure:**

1. **Epic 1: Core Chat Infrastructure** (Day 1)
   - Basic chat UI with state management
   - LLM integration with hardcoded problem
   - Socratic prompt engineering validation

2. **Epic 2: Scaffolded Socratic Dialogue** (Day 2)
   - Context-aware mode selection
   - Mode-specific prompting
   - Worked example scaffolding logic
   - "I'm confused" button implementation

3. **Epic 3: Problem Input & Math Rendering** (Day 3)
   - Text problem entry
   - Image upload with OCR/Vision integration
   - KaTeX math rendering
   - Problem display and confirmation

4. **Epic 4: Gamification & Polish** (Day 4)
   - Daily streak tracker
   - Problems solved counter
   - Celebration animations
   - Visual feedback system
   - Responsive design polish

5. **Epic 5: Testing, Documentation & Deployment** (Day 5)
   - Test across 5+ problem types
   - README with setup instructions
   - 5+ example walkthroughs
   - Prompt engineering documentation
   - Demo video creation
   - Deployment to Vercel/Netlify

**Next Step:** Run `workflow create-epics-and-stories` or `/BMad:bmm:workflows:create-epics-and-stories` to generate detailed epic breakdown with acceptance criteria and story mapping.

---

## References

### Source Documents

**Brainstorming Session:**
- File: `docs/brainstorming-session-complete-2025-11-03.md`
- Contains: 21+ concepts, strategic decisions, MVP feature set (Option 3 - Ambitious Enhancement)
- Key insights: Context-aware modes, student agency, Socratic+gamified positioning

**Competitive Intelligence Research:**
- File: `docs/research-competitive-2025-11-03.md`
- Contains: Market analysis ($2.11B TAM, 30.5% CAGR), competitor deep-dives (Khanmigo, Photomath, Math Academy), pricing strategy ($4/month)
- Key insights: 1-2 year window before Khanmigo scales, unique positioning through context-awareness

**Gauntlet C3 Specification:**
- File: `/Users/reena/Downloads/AI Math Tutor - Gauntlet C3 Project.pdf`
- Contains: Core requirements, evaluation criteria, success metrics, timeline (3-5 days)

**Math Academy Research:**
- Source: "The Math Academy Way" pages 395-466
- Key pedagogical insights: Worked examples prevent cognitive overload, expertise reversal effect, spaced repetition, retrieval practice, scaffolding principles

---

## Next Steps

### Immediate (Required Before Development)

1. **Epic & Story Breakdown** ⭐ CRITICAL
   - Command: `/BMad:bmm:workflows:create-epics-and-stories`
   - Purpose: Decompose requirements into 12-18 implementable stories
   - Output: Epic breakdown document with story mapping

2. **Architecture Document** (Recommended)
   - Command: `/BMad:bmm:workflows:architecture`
   - Purpose: Technical architecture decisions (LLM provider, state management, deployment)
   - Output: Architecture decisions document

3. **Technical Specification** (Optional but Recommended)
   - Command: `/BMad:bmm:workflows:tech-spec`
   - Purpose: Detailed technical specs with acceptance criteria
   - Output: Tech spec document

### Development Phase (Post-Planning)

4. **Solutioning Gate Check** (Required before coding)
   - Command: `/BMad:bmm:workflows:solutioning-gate-check`
   - Purpose: Validate PRD + Architecture + Stories are cohesive
   - Output: Validation report

5. **Sprint Planning** (Required to start implementation)
   - Command: `/BMad:bmm:workflows:sprint-planning`
   - Purpose: Create sprint status tracking, prioritize stories
   - Output: Sprint status YAML tracking file

---

## Product Magic Summary

**What makes zeroai special:**

Zeroai is the **only AI math tutor** that combines:
1. **Scaffolded Socratic Method** (research-backed learning without cognitive overload)
2. **Context-Aware Adaptation** (homework deadline vs exploration - no competitor has this)
3. **Student Agency** (students control depth, not the AI)
4. **Gamification** (streaks, celebrations, progress tracking for habit formation)

**The magic moment:** A student stuck at 9pm on a homework problem clicks "Homework Help" mode, gets efficient guidance with worked examples when stuck, applies the pattern to solve their problem, sees confetti + "5-day streak! 🎉", and thinks "This tutor GETS me - it's the only one that adapts to MY situation."

**Market positioning:** Khanmigo (Socratic but no gamification or context) + Math Academy (gamification but no Socratic) + Photomath's UX (without the answer-showing harm) = zeroai (the first Socratic+Gamified+Context-Aware tutor).

**Competitive advantage:** 1-2 year window while Khanmigo remains in US-only pilot. Move fast, execute flawlessly, build loyal user base through superior pedagogical quality AND engaging UX.

---

_This PRD captures the essence of **zeroai** - a Socratic AI math tutor that adapts to student context, gives them control, and keeps them motivated through gamification. The unique combination of research-backed pedagogy (Math Academy insights) with innovative features (context-awareness, student agency) positions zeroai to capture the "accessible Socratic tutoring" market during Khanmigo's pilot window._

_Created through collaborative discovery between Reena and AI Product Manager._

**Document Version:** 1.0
**Last Updated:** November 3, 2025
**Status:** ✅ Complete - Ready for Epic Breakdown
