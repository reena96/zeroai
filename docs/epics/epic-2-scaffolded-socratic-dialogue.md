# Epic 2: Scaffolded Socratic Dialogue (Intelligence - Day 2)

**Goal:** Implement context-aware learning modes and adaptive scaffolding with worked examples.

**Why This Second:** Builds on proven Socratic foundation from Epic 1. Adds the unique differentiator - context awareness and student agency.

**Value:** Delivers the unique differentiator - Socratic tutoring that adapts to student context (homework vs exam vs exploration). No competitor has this.

**Stories:** 3-4 stories

---

## Story 2.1: Context Mode Selection UI

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

## Story 2.2: Mode-Aware System Prompts

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

## Story 2.3: Worked Example Scaffolding Logic

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

## Story 2.4: "I'm Really Confused" Button

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

## Success Checkpoint: After Day 2

- ✅ Three modes selectable
- ✅ AI pacing differs across modes
- ✅ Worked examples show when stuck
- ✅ "Confused" button triggers scaffolding
