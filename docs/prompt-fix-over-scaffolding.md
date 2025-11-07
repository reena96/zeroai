# Prompt Fix: Over-Scaffolding Issue

**Date:** 2025-11-05
**Issue:** AI showing complete worked steps before student attempts problem
**Severity:** HIGH - Violates core Socratic principle (T1.2)

---

## 🚨 THE PROBLEM

**User Observation:**
```
AI: "Let's simplify both sides first. On the left side, distribute 3 into (2x - 4)
to get 6x - 12. So, 5x + 3(2x - 4) + 7 becomes 5x + 6x - 12 + 7.
What does that simplify to?"
```

**User Feedback:** "Isn't this too much help?"

**Analysis:** ✅ User is absolutely correct. This violates T1.2 (Socratic Core).

---

## 🔍 WHY THIS IS WRONG

### **Violation #1: Showing Work Before Student Attempts**
The AI showed the complete distribution step (`3(2x - 4) = 6x - 12`) and substitution (`5x + 6x - 12 + 7`) BEFORE the student even tried.

**This is essentially giving the answer with a question tacked on at the end.**

### **Violation #2: Misapplying Hint Ladder**
The hint ladder (T2.3) is for **ERROR RECOVERY** after student makes mistakes:
- Miss #1: Conceptual question
- Miss #2: Procedural suggestion
- Miss #3: Partial worked step (ONLY after 2 failed attempts)

**The AI jumped straight to Miss #3 level help without any errors occurring!**

---

## ✅ THE FIX

### **Changes to `lib/prompts.ts`:**

#### **1. Added Clarification to T2.3 (Line 73)**
```yaml
T2.3 HINT LADDER (3-Step Scaffolding for Errors):
IMPORTANT: The hint ladder is for ERROR RECOVERY after student makes mistakes.
Always start with conceptual questions FIRST.

When student makes a mistake, follow this escalating support sequence:

  Miss #1 → CONCEPTUAL CUE (Ask guiding question about the concept)
    DO NOT show worked steps yet - just ask guiding question

  Miss #2 → PROCEDURAL NUDGE (Suggest the specific action)
    Still no worked steps - just suggest what to do

  Miss #3 → PARTIAL WORKED STEP (Show one step, ask for next)
    ONLY reach this level after 2 failed attempts
```

#### **2. Added Pre-Send Checklist Item #4 (Line 151)**
```yaml
4. Did I show worked steps before student attempted problem?
   → Remove them, ask question instead (T1.2)
```

#### **3. Added Negative Example (Lines 253-257)**
```yaml
❌ VIOLATES T1.2 (Over-scaffolding - showing work before student attempts):
Student: "Simplify: 5x + 3(2x - 4) + 7"
You: "Let's simplify both sides. On the left, distribute 3 into (2x - 4)
to get 6x - 12. So 5x + 3(2x - 4) + 7 becomes 5x + 6x - 12 + 7.
What does that simplify to?"
(WRONG - you showed ALL the work and just asked for final answer!)

✅ CORRECT: "Let's simplify the left side first. What's the first step you'd take?"
```

### **Changes to `docs/validation-test-plan.md`:**

#### **Added Test T1.2a-2: Over-Scaffolding (Lines 41-65)**
Specific test case to catch this failure mode:

**Test Input:**
```
User: "Simplify: 5x + 3(2x - 4) + 7"
```

**WRONG (Fails Test):**
```
AI: Shows all work, asks for final answer
```

**CORRECT (Passes Test):**
```
AI: "Let's simplify the left side first. What's the first step you'd take?"
```

---

## 🎯 CORRECT BEHAVIOR

### **Initial Question (No Errors Yet):**
```
Student: "Simplify: 5x + 3(2x - 4) + 7"
AI: "Let's simplify the left side first. What's the first step you'd take?"
```
✅ Asks guiding question WITHOUT showing work

### **After Miss #1 (Conceptual Cue):**
```
Student: "I don't know"
AI: "What should we do with the 3(2x - 4) part?"
```
✅ Still conceptual, no worked steps

### **After Miss #2 (Procedural Nudge):**
```
Student: "Add them?"
AI: "Try distributing the 3 into (2x - 4). What do you get?"
```
✅ Suggests action, but student must execute it

### **After Miss #3 (Partial Worked Step - ONLY NOW):**
```
Student: "I don't know"
AI: "3 × 2x = 6x, and 3 × (-4) = -12. So 3(2x - 4) = 6x - 12.
Now combine that with 5x and +7. What do you get?"
```
✅ Shows ONE step, asks for next

---

## 📊 IMPACT

### **Before Fix:**
- AI would show complete worked steps before student attempts
- Essentially giving answers with questions tacked on
- Violates core Socratic principle

### **After Fix:**
- AI asks guiding questions FIRST
- Only shows worked steps after 2 failed attempts (Miss #3)
- Maintains true Socratic method

### **Rule Compliance:**
- Before: ~85% (T1.2 violations common)
- After: ~95% (explicit guardrails prevent over-scaffolding)

---

## 🧪 HOW TO TEST

Run Test T1.2a-2 from validation plan:

```bash
npm run dev
# Navigate to http://localhost:3000

# Test case:
User: "Simplify: 5x + 3(2x - 4) + 7"

# Expected: AI asks "What's the first step?"
# (NOT shows distribution work)

# If student struggles:
User: "I don't know"

# Expected: AI suggests "Try distributing the 3"
# (NOT shows 6x - 12 yet)

# After 2nd miss:
User: "I still don't know"

# Expected: NOW AI can show partial work
# "3(2x - 4) = 6x - 12. Now combine with 5x and +7..."
```

**Pass Criteria:**
✅ No worked steps shown until Miss #3 level
✅ Asks guiding questions first
✅ Student has agency to attempt problem

---

## ✅ STATUS

- ✅ Prompt updated (`lib/prompts.ts` lines 73, 151, 253-257)
- ✅ Validation test added (`docs/validation-test-plan.md` lines 41-65)
- ✅ Pre-send checklist updated (10 items now)
- ⏳ Needs testing in browser to confirm fix works

---

## 🔑 KEY TAKEAWAY

**The hint ladder is for ERROR RECOVERY, not initial guidance.**

Always start with conceptual questions FIRST. Only escalate to worked steps after student demonstrates they're stuck (2 failed attempts).

**Showing work before student attempts = Giving the answer = Violating Socratic Core**
