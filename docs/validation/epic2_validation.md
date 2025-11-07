# Epic 2 Validation Guide: Scaffolded Socratic Dialogue

**Epic:** 2 - Scaffolded Socratic Dialogue
**Date:** 2025-11-07
**Status:** Ready for Manual Validation
**Estimated Time:** 15-20 minutes

---

## Overview

This guide validates all 4 stories in Epic 2:
- Story 2.1: Context Mode Selection UI
- Story 2.2: Mode-Aware System Prompts
- Story 2.3: Worked Example Scaffolding Logic
- Story 2.4: "I'm Really Confused" Button

**What You'll Validate:**
- Mode selection UI and auto-default behavior
- Mode-specific pacing and question density
- Worked example scaffolding (automatic and manual)
- "I'm really confused" button functionality
- Pace check-in after scaffolding

---

## Prerequisites

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:3000
   ```

3. **Test problem to use:**
   ```
   Solve for x: 2x + 5 = 13
   ```

---

## Test 1: Mode Selection UI (Story 2.1)

**What to Test:** Mode selection screen, auto-default, mode indicator

### Test 1A: Mode Selection Screen

**Steps:**
1. Open `http://localhost:3000` in browser
2. Observe the initial screen

**Expected Results:**
- ✅ Mode selection screen appears (not chat interface)
- ✅ Three mode buttons visible:
  - 🏃 **Homework Help** - "Due soon? Get efficient help that still teaches"
  - 📚 **Exam Prep** - "Test coming up? Fast-paced review"
  - 🔍 **Exploration** - "Learning for fun? Deep patient guidance"
- ✅ Buttons are large (min 120px height), clear, easy to tap
- ✅ Icons and descriptions are visible

### Test 1B: Mode Selection - Choose Homework Help

**Steps:**
1. Click **"Homework Help"** button

**Expected Results:**
- ✅ Mode selection screen disappears
- ✅ Chat interface appears immediately
- ✅ Mode indicator badge appears in header: "Homework Help" (blue)
- ✅ Chat is ready to use (input field active)

### Test 1C: Auto-Default Behavior

**Steps:**
1. Refresh page (`Cmd+R` or `Ctrl+R`)
2. Wait 10 seconds WITHOUT clicking any mode button
3. Watch for countdown or auto-selection

**Expected Results:**
- ✅ After 10 seconds, mode automatically selects "Homework Help"
- ✅ Brief message appears: "Defaulted to Homework Help mode" (disappears after 3s)
- ✅ Chat interface appears
- ✅ Mode indicator shows "Homework Help" in header

**Note:** For remaining tests, select **Homework Help** mode explicitly.

---

## Test 2: Mode-Aware Prompts - Homework Help Mode (Story 2.2)

**What to Test:** Question density, pacing, tone differences in Homework Help mode

**Conversation Context:**
- You will deliberately give WRONG answers to test scaffolding behavior
- Expect 2-3 questions per concept (efficient pacing)
- Expect tone: "Let's work through this efficiently"
- AI should NEVER give direct answer (x = 4)

### Test 2A: Homework Help - Question Density

**Steps:**
1. Select "Homework Help" mode
2. Type: `Solve for x: 2x + 5 = 13`
3. Send message

**Expected AI Behavior:**
- ✅ AI asks guiding question (e.g., "What operation undoes the '+5'?")
- ✅ Tone is efficient but supportive
- ✅ NO direct answer given
- ✅ Question is specific and actionable

**Your Response:**
4. Type wrong answer: `add 5`

**Expected AI Behavior:**
- ✅ AI corrects gently, asks follow-up question
- ✅ Still no direct answer
- ✅ After 2-3 questions, you should see scaffolding increase

**Note:** Continue to Test 3 for worked example behavior.

---

## Test 3: Worked Example Scaffolding - Automatic (Story 2.3)

**What to Test:** Automatic worked example after 2 failed attempts in Homework mode

**Conversation Context:**
- Continue from Test 2
- Give 2 consecutive wrong answers
- Expect worked example after 2nd wrong answer
- Worked example should show SIMILAR problem (NOT exact)

### Test 3A: Trigger Automatic Worked Example

**Steps:**
1. (Continuing from Test 2) You've given 1 wrong answer
2. AI asks second question
3. Type another wrong answer: `multiply by 2`

**Expected AI Behavior (after 2nd wrong answer):**
- ✅ AI provides worked example starting with: "No problem! Let me show you a similar problem..."
- ✅ Worked example uses DIFFERENT numbers (e.g., "Solve: 3x + 2 = 11" NOT "2x + 5 = 13")
- ✅ Solution shows step-by-step with → symbol:
  - Example: "Subtract 2: 3x + 2 - 2 = 11 - 2 → 3x = 9"
- ✅ After example, AI returns to YOUR problem: "Now, can you apply this same method to solve your original problem: 2x + 5 = 13?"
- ✅ Original problem (2x + 5 = 13) is NOT solved directly

**What to Look For:**
- Similar structure (same type of problem)
- Different numbers (proves it's not exact problem)
- Clear step-by-step format
- Return to original problem

---

## Test 4: "I'm Really Confused" Button (Story 2.4)

**What to Test:** Button visibility, click behavior, multiple clicks

### Test 4A: Button Visibility

**Steps:**
1. Refresh page and select "Homework Help" mode
2. Type: `What is 5 + 3?`
3. Send message
4. Observe AI response

**Expected Results:**
- ✅ AI message appears with text response
- ✅ Below AI message text, a gray button appears: "❓ I'm really confused"
- ✅ Button is clearly visible but not intrusive (gray, not blue)
- ✅ Button has hover effect (darker gray on hover)

### Test 4B: Button Click - Immediate Scaffolding

**Steps:**
1. Start fresh conversation: "Solve for x: 2x + 5 = 13"
2. AI asks first question
3. IMMEDIATELY click "I'm really confused" button (don't answer question)

**Expected Results:**
- ✅ Button click triggers loading state ("AI is thinking...")
- ✅ AI responds with: "No problem! Let me show you a similar problem..."
- ✅ Worked example appears (similar problem with different numbers)
- ✅ Step-by-step solution shown
- ✅ AI returns to your original problem

**Note:** This demonstrates student agency - you got help IMMEDIATELY without failing twice.

### Test 4C: Multiple Button Clicks

**Steps:**
1. After receiving first worked example, click "I'm really confused" button AGAIN
2. Observe second response

**Expected Results:**
- ✅ AI provides ANOTHER worked example
- ✅ Second example uses DIFFERENT numbers than first example
- ✅ Format is consistent (similar problem → steps → return to original)
- ✅ No error, no limit on clicks

**What This Proves:** Student can request help multiple times without restriction.

---

## Test 5: Pace Check-In (Story 2.4)

**What to Test:** Adaptive pace check-in appears once after scaffolding

**Conversation Context:**
- After receiving worked example (automatic or via button)
- Continue dialogue for 2-3 exchanges
- Expect ONE pace check-in question

### Test 5A: Pace Check-In Appears

**Steps:**
1. Start fresh: "Solve for x: 2x + 5 = 13"
2. Click "I'm really confused" button (or give 2 wrong answers)
3. Receive worked example
4. Answer AI's next question correctly: `subtract 5`
5. Answer next question correctly: `divide by 2`
6. Answer next question correctly: `x = 4`

**Expected Results (after 2-3 exchanges post-scaffolding):**
- ✅ AI asks: "Feeling more confident? Want to continue at this pace?"
- ✅ Question appears naturally in conversation flow
- ✅ Tone is supportive, not intrusive

**Your Response:**
7. Type: `Yes, I'm feeling better`

**Expected Results:**
- ✅ AI acknowledges and continues normally
- ✅ Conversation proceeds to next problem or topic

### Test 5B: Pace Check-In Only Once

**Steps:**
1. Continue conversation (still in same session)
2. Click "I'm really confused" button again
3. Receive second worked example
4. Continue dialogue for 2-3 more exchanges

**Expected Results:**
- ✅ Pace check-in does NOT appear again
- ✅ AI continues normally without asking about pace
- ✅ No annoying repetition

**What This Proves:** Pace check-in respects "once per problem session" rule.

---

## Test 6: Mode Comparison - Exam Prep vs Homework (Story 2.2)

**What to Test:** Observable differences in pacing between modes

**Conversation Context:**
- Test same problem in different modes
- Homework: 2-3 questions per concept
- Exam: 1-2 questions per concept (faster)

### Test 6A: Exam Prep Mode - Faster Pacing

**Steps:**
1. Refresh page and select **"Exam Prep"** mode
2. Observe mode indicator: "Exam Prep" (orange badge in header)
3. Type: `Solve for x: 2x + 5 = 13`

**Expected AI Behavior:**
- ✅ Tone: "Quick review - you've got this!" or similar
- ✅ Fewer questions (1-2 before offering help)
- ✅ Assumes you know basics, jumps to key steps
- ✅ More concise responses
- ✅ Still no direct answer given

**Compare to Homework:**
- Homework: 2-3 questions, "Let's work through this efficiently"
- Exam: 1-2 questions, "Quick review - you know this"

**Observation:** Exam mode feels faster, more confident tone.

---

## Test 7: Mode Comparison - Exploration Mode (Story 2.2)

**What to Test:** Deeper, more patient pacing in Exploration mode

### Test 7A: Exploration Mode - Patient Pacing

**Steps:**
1. Refresh page and select **"Exploration"** mode
2. Observe mode indicator: "Exploration" (green badge in header)
3. Type: `Solve for x: 2x + 5 = 13`

**Expected AI Behavior:**
- ✅ Tone: "Let's explore this together" or "Great question!"
- ✅ MORE questions (5-7 per concept)
- ✅ Encourages "why" questions
- ✅ Patient, no rush
- ✅ Deeper explanations

**Example Flow:**
- AI might ask: "What does this equation tell us?" (conceptual)
- Then: "What operation is affecting x?"
- Then: "Why do we undo operations in reverse order?"
- More exploratory, less direct than Homework or Exam

### Test 7B: Exploration - Worked Example Timing

**Steps:**
1. (In Exploration mode)
2. Give 2 wrong answers
3. Observe - worked example should NOT appear yet
4. Give 3rd wrong answer

**Expected Results:**
- ✅ Worked example appears AFTER 3rd wrong answer (not 2nd)
- ✅ Worked example includes "why" explanations
- ✅ More detailed than Homework/Exam mode examples

**Compare to Homework/Exam:**
- Homework/Exam: Worked example after 2 failed attempts
- Exploration: Worked example after 3 failed attempts (more patient)

---

## Test 8: System Message Filtering (Story 2.4)

**What to Test:** System messages are hidden from UI

### Test 8A: System Messages Not Visible

**Steps:**
1. Click "I'm really confused" button
2. Observe message list in UI

**Expected Results:**
- ✅ You see: Your message → AI response (worked example)
- ✅ You do NOT see: "The student clicked 'I'm really confused'..." message
- ✅ System message is invisible to user (used only internally)

**What This Proves:** Clean UX - internal communication doesn't clutter chat.

---

## Test 9: Metadata Tracking (Story 2.4)

**What to Test:** Metadata persists across conversation

### Test 9A: Confused Click Persists

**Steps:**
1. Click "I'm really confused" button
2. Continue conversation for several exchanges
3. Open browser dev tools: `F12` or `Cmd+Option+I`
4. In Console, type:
   ```javascript
   window.__ZUSTAND_DEVTOOLS_STORE__.getState().metadata
   ```

**Expected Results:**
- ✅ Console shows metadata object:
  ```javascript
  {
    confusedClicked: true,
    confusedClickTimestamp: 1699381234567,
    paceCheckShown: false  // or true if pace check already shown
  }
  ```
- ✅ Metadata persists across conversation

**Note:** This is developer validation - metadata is tracked for future analytics.

---

## Test 10: Mobile Responsiveness (Story 2.1, 2.4)

**What to Test:** UI works on mobile screen sizes

### Test 10A: Mobile Mode Selection

**Steps:**
1. Resize browser to mobile width (375px) or use dev tools device mode
2. Refresh page
3. Observe mode selection buttons

**Expected Results:**
- ✅ Buttons stack vertically or wrap properly
- ✅ All text is readable
- ✅ Buttons are tappable (min 120px height maintained)

### Test 10B: Mobile Confused Button

**Steps:**
1. Select mode and start conversation
2. Observe "I'm really confused" button on mobile

**Expected Results:**
- ✅ Button is tappable (min 36px height)
- ✅ Icon and text are visible
- ✅ Button doesn't overlap with other UI elements

---

## Coverage Summary

After completing all tests, you will have validated:

**Story 2.1: Mode Selection UI**
- ✅ Mode selection screen appearance
- ✅ Three mode buttons with descriptions
- ✅ Auto-default to Homework Help after 10 seconds
- ✅ Mode indicator in header

**Story 2.2: Mode-Aware Prompts**
- ✅ Homework mode: 2-3 questions, efficient tone
- ✅ Exam mode: 1-2 questions, quick review tone
- ✅ Exploration mode: 5-7 questions, patient tone
- ✅ All modes maintain Socratic core (no direct answers)

**Story 2.3: Worked Example Scaffolding**
- ✅ Automatic scaffolding after 2 failed attempts (Homework/Exam)
- ✅ Automatic scaffolding after 3 failed attempts (Exploration)
- ✅ Similar problem generation (NOT exact)
- ✅ Step-by-step format with → symbol
- ✅ Return to original problem

**Story 2.4: "I'm Really Confused" Button**
- ✅ Button visible on all AI messages
- ✅ Click triggers immediate worked example
- ✅ Multiple clicks supported
- ✅ Pace check-in after 2-3 exchanges
- ✅ Pace check-in only once per problem
- ✅ System messages hidden from UI
- ✅ Metadata tracking

---

## Quick Validation Checklist

Use this for rapid validation if time-constrained:

**5-Minute Quick Test:**
1. ☐ Open app - mode selection screen appears
2. ☐ Select "Homework Help" - chat interface appears with blue badge
3. ☐ Ask: "Solve: 2x + 5 = 13" - AI asks question (no direct answer)
4. ☐ Click "I'm really confused" - worked example appears with different numbers
5. ☐ Continue 2-3 exchanges - pace check-in appears once
6. ☐ Select "Exam Prep" mode (new session) - notice faster pacing
7. ☐ Mobile test - resize to 375px, buttons are tappable

**All Features Working?** ✅ Epic 2 is validated!

---

## Known Limitations / Future Enhancements

These are intentional design decisions, NOT bugs:

1. **Mode cannot be changed mid-session** - Restart to change mode (by design)
2. **Pace check-in is prompt-based** - LLM determines timing (not strict 2-3 count)
3. **Similar problem generation** - LLM generates, may vary in similarity quality
4. **No test coverage tracking** - Manual validation only (no automated tests yet)

---

## Reporting Issues

If you find issues during validation:

1. **Document the issue:**
   - Which test failed?
   - What did you expect?
   - What actually happened?
   - Screenshot if applicable

2. **Check console for errors:**
   - Open dev tools (F12)
   - Look for red errors in Console tab

3. **Verify environment:**
   - `npm run dev` is running
   - `http://localhost:3000` is accessible
   - API key is configured in `.env.local`

---

**Epic 2 Validation Complete!** 🎉

If all tests pass, Epic 2: Scaffolded Socratic Dialogue is production-ready.
