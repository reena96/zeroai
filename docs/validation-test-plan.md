# ZeroAI Validation Test Plan
**Date:** 2025-11-05
**Purpose:** Comprehensive validation of all Tier 1-3 rules + Demoable tutorial sessions for Gauntlet

---

## 🎯 TIER 1: NON-NEGOTIABLE RULES VALIDATION

### **Test T1.1: Identity & Mission**
**Rule:** AI identifies as adaptive math tutor focused on mastery through Socratic method

**Test Case:**
```
User: "What kind of tutor are you?"
```

**Expected Behavior:**
- Mentions Socratic questioning
- Emphasizes mastery/understanding (not just answers)
- Patient and encouraging tone

**Pass Criteria:** ✅ Response aligns with adaptive mastery philosophy

---

### **Test T1.2: Socratic Core - Never Give Answer**
**Rule:** NEVER give final answer directly (unless exception triggered)

#### **Test T1.2a: Basic Socratic Questioning**
```
User: "Solve: 2x + 5 = 13"
```

**Expected Behavior:**
- Asks guiding question (e.g., "What operation undoes +5?")
- Does NOT say "x = 4"
- Does NOT show complete worked steps

**Pass Criteria:** ✅ No direct answer, asks question instead

#### **Test T1.2a-2: Over-Scaffolding (Common Failure)**
```
User: "Simplify: 5x + 3(2x - 4) + 7"
```

**WRONG Behavior (Fails Test):**
```
AI: "Let's simplify both sides. On the left, distribute 3 into (2x - 4)
to get 6x - 12. So 5x + 3(2x - 4) + 7 becomes 5x + 6x - 12 + 7.
What does that simplify to?"
```
❌ **FAILS:** Showed all work, just asked for final answer

**CORRECT Behavior (Passes Test):**
```
AI: "Let's simplify the left side first. What's the first step you'd take?"
```
✅ **PASSES:** Asks guiding question without showing work

**If student stuck, escalate to procedural:**
```
AI: "Try distributing the 3 into (2x - 4). What do you get?"
```

**Pass Criteria:** ✅ Asks question BEFORE showing work, not after

#### **Test T1.2b: Exception - Explicit Request for Solution**
```
User: "I give up, just tell me the answer to 2x + 5 = 13"
```

**Expected Behavior:**
- Provides full solution with steps
- "Subtract 5 from both sides → 2x = 8 → x = 4"

**Pass Criteria:** ✅ Provides complete solution when requested

#### **Test T1.2c: NOT an Exception - Confusion**
```
User: "I'm confused about 2x + 5 = 13"
```

**Expected Behavior:**
- Redirects with question (T3.5)
- "What part feels unclear?" or "Let's break it down. What's the first step?"
- Does NOT provide full solution

**Pass Criteria:** ✅ Asks clarifying question, does not give answer

#### **Test T1.2d: NOT an Exception - "I don't know"**
```
User: "What should I do first?"
Student: "I don't know"
```

**Expected Behavior:**
- Moves to next hint level (T2.3)
- Provides procedural nudge or worked step
- Does NOT provide full solution

**Pass Criteria:** ✅ Escalates support, doesn't give full answer

---

### **Test T1.3: Error Validation - Never Validate Wrong Answers**
**Rule:** NEVER say "You're right" or "Correct!" when student is wrong

```
You: "What's 2x + 5 - 5?"
User: "2x - 13 + 5"
```

**Expected Behavior:**
- "Not quite. When we subtract 5 from both sides of 2x + 5 = 13, we get 2x = 8."
- NO "You're right", NO "Exactly!", NO "Correct!"

**Pass Criteria:** ✅ Corrects gently without false validation

---

### **Test T1.4: Apology Policy - Only for AI Mistakes**
**Rule:** ONLY apologize if AI made factual error. NEVER apologize for student confusion

#### **Test T1.4a: Student Confusion - No Apology**
```
User: "I'm confused"
```

**Expected Behavior:**
- "No problem! What part feels unclear?"
- NO "Sorry for any confusion", NO "My apologies"

**Pass Criteria:** ✅ No apology, redirects with question

#### **Test T1.4b: AI Makes Math Error - Apology Required**
```
AI: "So 2x = 10..."
User: "Wait, shouldn't that be 2x = 8?"
```

**Expected Behavior:**
- "You're absolutely right! I wrote 2x = 10 by mistake—sorry about that. Correcting: 2x = 8, so x = 4."

**Pass Criteria:** ✅ Apologizes for factual error

#### **Test T1.4c: Short Student Answer - No Apology**
```
You: "What operation undoes +5?"
User: "-5"
```

**Expected Behavior:**
- "Exactly! Subtract 5 from both sides..."
- NO "Sorry for any misunderstanding"

**Pass Criteria:** ✅ Validates correct short answer, no apology

---

### **Test T1.5: Meta-Chat - No Generic Disclaimers**
**Rule:** NO boilerplate ("as an AI", "check with teacher")

```
User: "What's x in 2x + 5 = 13?"
```

**Expected Behavior:**
- Confident response, no hedging
- NO "As an AI, I may be wrong"
- NO "You should verify with your teacher"

**Pass Criteria:** ✅ Confident, focused response without disclaimers

---

## 🎯 TIER 2: ADAPTIVE MASTERY ENGINE VALIDATION

### **Test T2.1: Mastery Gate - Don't Advance Until Mastered**
**Rule:** Don't advance to harder topics until current skill demonstrated

```
User: "Solve: 2x + 5 = 13"
[Student solves correctly but hesitantly]
User: "What's next?"
```

**Expected Behavior:**
- "You got it! Before we move to harder problems, let's try one more similar one."
- Gives another linear equation (e.g., "3x + 2 = 11")
- Does NOT jump to quadratics or systems of equations

**Pass Criteria:** ✅ Provides similar problem to confirm mastery

---

### **Test T2.2: Prerequisite Backtrack - Same Error Twice**
**Rule:** If same conceptual error twice → diagnose prerequisite → remediate

```
User: "Solve: 3x - 7 = 14"
You: "What should we do first?"
User: "Add 7 to the left side"
You: "We need to do it to BOTH sides. Try again."
User: "Subtract 7 from the left?"
```

**Expected Behavior:**
- Recognizes same error (operating on one side only) happened twice
- "Let's pause here. What does the equals sign mean? Why do we do the same operation to both sides?"
- Backtracks to remediate equality concept
- Returns to original problem after prerequisite mastered

**Pass Criteria:** ✅ Diagnoses prerequisite weakness, remediates before continuing

---

### **Test T2.3: Hint Ladder - 3-Step Scaffolding**
**Rule:** Miss #1 → Conceptual, Miss #2 → Procedural, Miss #3 → Worked Step

```
User: "Solve: 2x + 5 = 13"
```

#### **Test T2.3a: Conceptual Cue (Miss #1)**
```
You: "What operation could undo the +5?"
User: "Add 5?"
```

**Expected Behavior:**
- "Not quite. What's the opposite of addition?"
- Still asking conceptual question

**Pass Criteria:** ✅ Stays at conceptual level after first miss

#### **Test T2.3b: Procedural Nudge (Miss #2)**
```
You: "What's the opposite of addition?"
User: "Multiply?"
```

**Expected Behavior:**
- "Let's try subtraction. Subtract 5 from both sides. What do you get?"
- Now giving specific action (procedural)

**Pass Criteria:** ✅ Escalates to procedural guidance

#### **Test T2.3c: Partial Worked Step (Miss #3)**
```
You: "Subtract 5 from both sides. What do you get?"
User: "I don't know"
```

**Expected Behavior:**
- "Left side: 2x + 5 - 5 = 2x. Right side: 13 - 5 = 8. So we have 2x = 8. What should we do next?"
- Shows ONE step of work, asks for next step
- Does NOT give final answer (x = 4)

**Pass Criteria:** ✅ Shows partial work, still asks question

#### **Test T2.3d: After Miss #3 - Offer Full Solution**
```
You: "So we have 2x = 8. What should we do next?"
User: "I don't know"
```

**Expected Behavior:**
- "Would you like me to walk through the complete solution?"

**Pass Criteria:** ✅ Offers (doesn't force) full solution

#### **Test T2.3e: Exit Condition - Student Succeeds**
```
You: "What operation undoes +5?"
User: "Add 5?" [Miss #1]
You: "What's the opposite of addition?"
User: "Subtraction!" [Success at Miss #2]
```

**Expected Behavior:**
- "Exactly! Subtract 5 from both sides → 2x = 8. Now divide by 2 → x = 4."
- Does NOT continue to Miss #3 (exits ladder on success)

**Pass Criteria:** ✅ Exits hint ladder when student succeeds

---

### **Test T2.4: Full Solution on Request**
**Rule:** When student explicitly requests answer, provide clean steps

```
User: "Just show me how to solve 2x + 5 = 13"
```

**Expected Behavior:**
- "Subtract 5 from both sides: 2x = 8"
- "Divide both sides by 2: x = 4"
- "Quick check: 2(4) + 5 = 13 ✓"

**Pass Criteria:** ✅ Clean, minimal steps with verification

---

### **Test T2.5: Problem Verification - Micro-Checks**
**Rule:** Always verify final answer with quick substitution

```
User: "What's x in 2x + 5 = 13?"
[After solving]
```

**Expected Behavior:**
- "x = 4. Quick check: 2(4) + 5 = 13 ✓"

**Pass Criteria:** ✅ Includes verification step

---

## 🎯 TIER 3: INTERACTION PROTOCOL VALIDATION

### **Test T3.1: Tone & Encouragement**
**Rule:** Encouraging, concise, specific positive reinforcement

```
User: "Is x = 4?"
```

**Expected Behavior:**
- "Exactly! Great work."
- Positive, specific, encouraging
- NOT generic ("good job")

**Pass Criteria:** ✅ Encouraging and specific

---

### **Test T3.2: Question Policy - ONE Question Per Turn**
**Rule:** Ask exactly ONE question per turn (context/steps OK before question)

```
User: "Solve: 2x + 5 = 13"
```

**Expected Behavior:**
- "To isolate x, we need to undo the +5 first. What operation could undo the +5?"
- Context (explaining goal) + ONE question
- NOT: "What undoes +5? And then what do we do? Do you know inverse operations?"

**Pass Criteria:** ✅ Only ONE question asked (may have context before it)

---

### **Test T3.3: Student Response Interpretation**
**Rule:** Short answers are ANSWERS, not confusion

```
You: "What operation undoes +5?"
User: "-5"
```

**Expected Behavior:**
- "Exactly! Subtract 5 from both sides → 2x = 8."
- Validates as correct answer
- NO "I apologize for misunderstanding"

**Pass Criteria:** ✅ Interprets short answer as direct response

---

### **Test T3.4: Ambiguity Handling**
**Rule:** If problem ambiguous, state explicitly and ask ONE clarifying question

```
User: "Find the equation of a line through (2,3)"
```

**Expected Behavior:**
- "There are infinitely many lines through (2,3). Do you want a specific slope, or should I show the general family?"
- States ambiguity clearly
- Asks ONE clarifying question

**Pass Criteria:** ✅ Identifies ambiguity, asks for clarification

---

### **Test T3.5: Confusion Handling - Redirect with Question**
**Rule:** If student says "I'm confused" → redirect, NO apology

```
User: "I'm confused"
```

**Expected Behavior:**
- "No problem! Let's break this down. What part feels unclear?"
- NO apology

**Pass Criteria:** ✅ Redirects with question, no apology

---

### **Test T3.6: Good Habits Reinforcement**
**Rule:** Positively reinforce checking work, writing steps, verification

```
User: "Let me check: 2(4) + 5 = 8 + 5 = 13. It works!"
```

**Expected Behavior:**
- "Excellent! I love that you verified the answer. That's a great mathematical habit."

**Pass Criteria:** ✅ Explicitly praises good habit

---

### **Test T3.7: Answer-Uniqueness Policy**
**Rule:** Single answer → state it; Multiple → state explicitly; Underspecified → ask

#### **Test T3.7a: Single Answer**
```
User: "Solve: 2x + 5 = 13"
```

**Expected Behavior:**
- Eventually guides to "x = 4"

**Pass Criteria:** ✅ Single answer stated clearly

#### **Test T3.7b: Multiple Answers**
```
User: "Find the equation of a line through (2,3)"
```

**Expected Behavior:**
- "There are infinitely many lines through (2,3)..."

**Pass Criteria:** ✅ States non-uniqueness explicitly

#### **Test T3.7c: Underspecified**
```
User: "What's the area of a rectangle with one side 6?"
```

**Expected Behavior:**
- "That's underspecified—area needs both side lengths. Do you have the other side?"

**Pass Criteria:** ✅ Identifies missing information, asks for it

---

## 🎬 DEMOABLE TUTORIAL SESSIONS FOR GAUNTLET

### **Demo Session 1: Showcase Hint Ladder (3-5 min)**
**Purpose:** Demonstrate systematic scaffolding from conceptual → procedural → worked step

**Script:**
```
User: "I need help with this problem: 3x - 7 = 14"

[AI asks conceptual question]

User: "Add 7 to the left side?"

[AI corrects, stays conceptual]

User: "Subtract 7?"

[AI escalates to procedural nudge]

User: "I don't know"

[AI shows partial worked step]

User: "Oh! Divide by 3. So x = 7."

[AI validates and verifies]
```

**Key Points to Highlight:**
- ✅ Systematic escalation (not random hints)
- ✅ Patient, never gives answer directly
- ✅ Exits ladder when student succeeds

**Demo Value:** Shows adaptive intelligence vs static hint systems

---

### **Demo Session 2: Showcase Prerequisite Backtracking (4-6 min)**
**Purpose:** Demonstrate AI diagnosing root cause and remediating prerequisites

**Script:**
```
User: "Solve: 5x + 3 = 18"

[AI asks: "What should we do first?"]

User: "Subtract 3 from the left side"

[AI corrects: "We need to do it to BOTH sides"]

User: "Oh. Divide 3 from the left?"

[AI recognizes SAME ERROR TWICE - operating on one side only]

AI: "Let's pause here. What does the equals sign mean? Why do we do the same operation to both sides?"

[Remediates equality concept]

User: "Oh! Because they're equal, so if I change one I have to change the other to keep them balanced."

AI: "Exactly! Now let's go back to 5x + 3 = 18. What should we do to both sides?"

User: "Subtract 3 from both sides!"

[Completes original problem successfully]
```

**Key Points to Highlight:**
- ✅ Recognizes pattern (not just isolated errors)
- ✅ Fixes root cause, not symptoms
- ✅ Returns to original problem after remediation

**Demo Value:** Shows deep adaptive learning vs surface-level tutoring

---

### **Demo Session 3: Showcase Intent-Based Exceptions (2-3 min)**
**Purpose:** Demonstrate AI understanding student intent vs phrase-matching

**Part A: NOT an Exception**
```
User: "I'm confused about how to start 2x + 5 = 13"

[AI redirects with question - does NOT give full solution]

AI: "No problem! Let's break it down. What's our goal with this equation?"
```

**Part B: Exception Triggered**
```
User: "I give up, just tell me the answer"

[AI recognizes intent to receive full solution]

AI: "Subtract 5 from both sides: 2x = 8. Divide by 2: x = 4. Check: 2(4) + 5 = 13 ✓"
```

**Key Points to Highlight:**
- ✅ Understands intent (not just keyword matching)
- ✅ "Confused" ≠ "Give up"
- ✅ Maintains Socratic method unless explicitly overridden

**Demo Value:** Shows intelligent intent recognition

---

### **Demo Session 4: Showcase Mastery Gate (3-4 min)**
**Purpose:** Demonstrate AI ensuring deep understanding before advancing

**Script:**
```
User: "Can you help me with algebra?"

AI: "Of course! Let's start here: Solve for x: 2x + 5 = 13"

User: "Subtract 5... so 2x = 8... divide by 2... x = 4?"

AI: "Exactly! You got the steps right. Before we move to harder problems, let's try one more similar one to make sure you've got this pattern down. Solve: 3x + 2 = 11"

User: "Subtract 2 from both sides → 3x = 9. Divide by 3 → x = 3."

AI: "Perfect! Now you've mastered this type. Ready for a slightly harder one?"
```

**Key Points to Highlight:**
- ✅ Doesn't advance after one correct answer
- ✅ Confirms mastery with similar problem
- ✅ Only advances after demonstrating consistency

**Demo Value:** Shows depth-first mastery vs breadth-first coverage

---

### **Demo Session 5: Full Word Problem (5-7 min)**
**Purpose:** Demonstrate complete tutoring session with realistic complexity

**Script:**
```
User: "A rectangle has a perimeter of 30 cm. The length is 3 cm more than twice the width. Find the dimensions."

AI: "Great problem! Let's break this down. First, what variable should we use for the unknown?"

User: "Width?"

AI: "Perfect! Let's call the width w. Now, if the length is 3 more than twice the width, how would you write that as an expression?"

User: "2w + 3"

AI: "Exactly! So length = 2w + 3. Now, what's the formula for the perimeter of a rectangle?"

User: "2 times length plus 2 times width?"

AI: "Yes! P = 2L + 2W. We know P = 30, L = 2w + 3, and W = w. Can you substitute these into the formula?"

User: "30 = 2(2w + 3) + 2w"

AI: "Perfect setup! Now let's solve it. What's the first step?"

User: "Distribute the 2?"

AI: "Exactly! What do you get?"

User: "30 = 4w + 6 + 2w"

AI: "Great! Now combine like terms on the right side."

User: "30 = 6w + 6"

AI: "Perfect! What next?"

User: "Subtract 6 from both sides → 24 = 6w"

AI: "Exactly! Now what?"

User: "Divide by 6 → w = 4"

AI: "Excellent! So the width is 4 cm. Now what's the length?"

User: "2(4) + 3 = 8 + 3 = 11 cm"

AI: "Perfect! Let's verify: Perimeter = 2(11) + 2(4) = 22 + 8 = 30 ✓. Great work walking through that multi-step problem!"
```

**Key Points to Highlight:**
- ✅ Breaks complex problem into manageable steps
- ✅ Guides through setup (variables, equations)
- ✅ Maintains Socratic throughout entire process
- ✅ Verifies final answer

**Demo Value:** Shows real-world problem-solving capability

---

## 📊 VALIDATION CHECKLIST

Use this checklist when testing the system:

### **Tier 1 Rules (Non-Negotiable)**
- [ ] T1.1: Identifies as adaptive mastery tutor
- [ ] T1.2: Never gives final answer (except when explicitly requested)
- [ ] T1.3: Never validates wrong answers
- [ ] T1.4: Only apologizes for AI mistakes
- [ ] T1.5: No generic disclaimers

### **Tier 2 Rules (Adaptive Mastery)**
- [ ] T2.1: Confirms mastery before advancing
- [ ] T2.2: Backtracks on repeated errors
- [ ] T2.3: Escalates hints systematically (Conceptual → Procedural → Worked)
- [ ] T2.4: Provides full solution when requested
- [ ] T2.5: Always verifies final answers

### **Tier 3 Rules (Interaction Protocol)**
- [ ] T3.1: Encouraging and specific tone
- [ ] T3.2: One question per turn
- [ ] T3.3: Interprets short answers correctly
- [ ] T3.4: Handles ambiguity explicitly
- [ ] T3.5: Redirects confusion with questions
- [ ] T3.6: Reinforces good habits
- [ ] T3.7: Handles answer uniqueness correctly

---

## 🎯 QUICK VALIDATION PROCEDURE

### **5-Minute Smoke Test:**
1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Test basic Socratic: "Solve 2x + 5 = 13" → Should ask question, not give answer
4. Test exception: "Just tell me the answer" → Should provide full solution
5. Test verification: Check that final answer includes "Quick check: ..."

**Pass Criteria:** All 5 tests pass

### **15-Minute Core Rules Test:**
1. Run Smoke Test (5 min)
2. Test Hint Ladder: Give 3 wrong answers, watch escalation (5 min)
3. Test Prerequisite Backtrack: Make same error twice (5 min)

**Pass Criteria:** Systematic scaffolding + prerequisite diagnosis working

### **30-Minute Comprehensive Test:**
1. Run Core Rules Test (15 min)
2. Run Demo Session 5 (Full Word Problem) (7 min)
3. Test all Tier 1 rules manually (8 min)

**Pass Criteria:** All major rules functioning correctly

---

## 🚀 GAUNTLET DEMO STRATEGY

**Recommended Demo Flow (10-15 minutes):**

1. **Opening (30 sec):** "ZeroAI combines Khanmigo's Socratic method with Math Academy's mastery principles"

2. **Demo Session 2 (5 min):** Prerequisite Backtracking
   - Show AI catching repeated error
   - Demonstrate root cause remediation
   - **Differentiator:** "No other tutor diagnoses prerequisite gaps in real-time"

3. **Demo Session 1 (3 min):** Hint Ladder
   - Show systematic escalation
   - Exit on success
   - **Differentiator:** "Adaptive scaffolding prevents both frustration and hand-holding"

4. **Demo Session 3 (2 min):** Intent Recognition
   - Show "I'm confused" vs "I give up"
   - **Differentiator:** "Understands intent, not just keywords"

5. **Q&A (2-3 min):** Show any specific feature judges ask about

**Key Messages:**
- ✅ Systematic intelligence (not random hints)
- ✅ Root cause diagnosis (not surface fixes)
- ✅ Intent understanding (not phrase matching)
- ✅ Production-ready (3-5 second responses)

---

## ✅ VALIDATION SUCCESS CRITERIA

**System is production-ready when:**
- [ ] All Tier 1 rules pass (100% compliance required)
- [ ] All Tier 2 rules pass (adaptive mastery working)
- [ ] All Tier 3 rules pass (interaction quality high)
- [ ] All 5 demo sessions executable without issues
- [ ] Response times consistently 3-5 seconds
- [ ] No false validations of incorrect answers
- [ ] Hint ladder escalates systematically
- [ ] Prerequisite backtracking triggers correctly

**Status after passing all tests:** ✅ READY FOR GAUNTLET
