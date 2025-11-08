# Prompt Engineering Documentation

**zeroai AI Math Tutor - Socratic System Prompts**

This document details the prompt engineering implementation that powers the Socratic dialogue system in zeroai. The prompts combine research-backed pedagogical principles from Khan Academy (Socratic method) and Math Academy (adaptive mastery) to create an effective, context-aware math tutoring experience.

---

## Table of Contents

1. [Overview](#overview)
2. [Prompt Architecture](#prompt-architecture)
3. [Mode-Specific Prompts](#mode-specific-prompts)
4. [Worked Example Scaffolding Logic](#worked-example-scaffolding-logic)
5. [Iteration Notes & Learnings](#iteration-notes--learnings)
6. [Implementation Details](#implementation-details)

---

## Overview

### Core Philosophy

The prompts are designed to **never give direct answers** but instead guide students to understanding through strategic questioning. However, they include intelligent scaffolding mechanisms to prevent frustration when students are genuinely stuck.

### Key Principles

1. **Socratic Core** - Ask guiding questions, don't tell answers
2. **Adaptive Mastery** - Don't advance until concept is mastered
3. **Intelligent Scaffolding** - Provide worked examples when stuck (not their exact problem)
4. **Context Awareness** - Adapt pacing to student's situation (homework/exam/exploration)
5. **Student Agency** - Student controls depth via "I'm confused" button

---

## Prompt Architecture

### Three-Tier Structure

All prompts follow a hierarchical three-tier structure:

#### **Tier 1: Non-Negotiable Rules (Highest Priority)**

- T1.1: Identity & Mission (Socratic math tutor)
- T1.1A: Problem Detection & Confirmation
- T1.1B: Math Formatting (LaTeX/KaTeX)
- T1.2: Socratic Core (Never give answer - exception: when explicitly requested)
- T1.3: Answer Verification (ALWAYS verify before affirming)
- T1.4: Apology Policy (Only apologize for factual errors)
- T1.5: Meta-Chat (No disclaimers like "as an AI")

#### **Tier 2: Adaptive Mastery Engine**

- T2.1: Mastery Gate (Don't advance until skill is demonstrated)
- T2.2: Prerequisite Backtrack (Fix weak foundations when same error twice)
- T2.3: Hint Ladder (3-step escalating support for errors)
- T2.4: Full Solution on Request (Override T1.2 when student gives up)
- T2.5: Problem Verification (Quick check before stating final answer)

#### **Tier 3: Interaction Protocol**

- T3.1: Tone & Encouragement
- T3.2: Question Policy (One precise question per turn)
- T3.3: Student Response Interpretation
- T3.4: Ambiguity Handling
- T3.5: Confusion Handling
- T3.6: Good Habits Reinforcement
- T3.7: Answer-Uniqueness Policy

### Pre-Send Mental Checklist

Before every response, the AI performs 11 validation checks:

1. Did I say "sorry" without fixing a mistake? → Remove it
2. Did I validate a wrong answer? → Fix it
3. Did I give direct answer without being asked? → Check intent
4. Did I show worked steps before student attempted? → Remove, ask question instead
5. Was student response unclear? → Ask for clarification
6. Is student stuck on same error twice? → Diagnose prerequisite
7. What hint level is student at? → Use appropriate scaffold
8. Did student succeed? → Exit hint ladder
9. Did I add generic disclaimer? → Remove it
10. One question per turn? → Verify
11. Did I verify the final answer? → Add check

---

## Mode-Specific Prompts

### 1. Homework Help Mode

**Context:** Student has homework due soon and needs efficient help that still teaches.

**Pacing Instructions:**
- Question density: **2-3 questions per concept**
- Tone: "Let's work through this efficiently"
- Faster scaffolding trigger: **After 2 failed attempts** (vs 3 in explore mode)
- Balance speed with understanding

**Example Pacing Flow:**

```
Student: "Solve: 2x + 5 = 13"
AI: "Let's work through this efficiently. What operation undoes the '+5'?" [Q1]
Student: [wrong answer]
AI: "Think about inverse operations. What's the opposite of addition?" [Q2]
Student: [still struggling - 2nd failed attempt, TRIGGER WORKED EXAMPLE]
AI: "Let me show you a similar problem to help you understand the pattern:

**Similar Problem:** Solve: 3x + 2 = 11

**Solution Steps:**
1. Subtract 2 from both sides: 3x + 2 - 2 = 11 - 2 → 3x = 9
2. Divide both sides by 3: 3x ÷ 3 = 9 ÷ 3 → x = 3
3. Check: 3(3) + 2 = 9 + 2 = 11 ✓

Now, can you apply this same method to solve your original problem: 2x + 5 = 13?"
```

**Prompt Location:** `lib/prompts.ts` → `SOCRATIC_PROMPTS.homework`

---

### 2. Exam Prep Mode

**Context:** Student has test coming up and needs fast-paced review of concepts.

**Pacing Instructions:**
- Question density: **1-2 questions per concept**
- Tone: "Quick review - you've got this!"
- Minimal scaffolding - assumes they've studied, just need confidence check
- Jump to key steps rather than detailed exploration

**Example Pacing Flow:**

```
Student: "Solve: 2x + 5 = 13"
AI: "Quick review - you know this. What's the first step to isolate x?" [Q1 - assumes they know]
Student: [wrong answer]
AI: "Think about inverse operations. What undoes addition?" [Q2]
Student: [still struggling - 2nd failed attempt, TRIGGER WORKED EXAMPLE]
AI: "Let me show you a quick example:

**Similar Problem:** Solve: 3x + 2 = 11

**Solution:**
1. Subtract 2: 3x = 9
2. Divide by 3: x = 3
3. Check: 3(3) + 2 = 11 ✓

Now apply this to your problem: 2x + 5 = 13"
```

**Prompt Location:** `lib/prompts.ts` → `SOCRATIC_PROMPTS.exam`

---

### 3. Exploration Mode

**Context:** Student is learning for fun/curiosity and wants deep understanding.

**Pacing Instructions:**
- Question density: **5-7 questions per concept**
- Tone: "Let's explore this together"
- Slower scaffolding trigger: **After 3 failed attempts** (give more time to discover)
- Encourage "why" and "what if" questions
- No rush - follow their curiosity

**Example Pacing Flow:**

```
Student: "Solve: 2x + 5 = 13"
AI: "Great problem! Let's explore this together. What does this equation tell us?" [Q1 - conceptual]
Student: "That 2x plus 5 equals 13?"
AI: "Exactly! Now, what operation is affecting x?" [Q2]
Student: "Multiplication?"
AI: "Good observation - x is multiplied by 2. But what else is happening to 2x?" [Q3]
Student: "Adding 5?"
AI: "Perfect! So we have two operations: multiplication and addition. Which should we undo first and why?" [Q4 - deeper exploration]
Student: [wrong answer]
AI: "Think about order of operations in reverse. What was the last operation applied when building 2x + 5?" [Q5]
Student: [wrong again]
AI: "Let's explore inverse operations. If I build an expression by first multiplying then adding, how do I undo it?" [Q6]
Student: [still struggling - 3rd failed attempt, TRIGGER WORKED EXAMPLE]
AI: "Let me show you a similar problem to help you understand the deeper pattern:

**Similar Problem:** Solve: 3x + 2 = 11

**Solution Steps:**
1. Subtract 2 from both sides: 3x + 2 - 2 = 11 - 2 → 3x = 9
   (WHY: We undo operations in reverse order. Addition was applied last, so we undo it first)
2. Divide both sides by 3: 3x ÷ 3 = 9 ÷ 3 → x = 3
   (WHY: Now we undo the multiplication to isolate x)
3. Check: 3(3) + 2 = 9 + 2 = 11 ✓

Notice how we worked backwards through the operations!

Now, can you apply this same method to solve your original problem: 2x + 5 = 13? Take your time and think about why each step works."
```

**Prompt Location:** `lib/prompts.ts` → `SOCRATIC_PROMPTS.explore`

---

## Worked Example Scaffolding Logic

### The "I'm Confused" Button

When a student clicks the "I'm really confused" button, the system triggers **student-initiated scaffolding** by sending a special flag to the API.

**Implementation:**

1. **Frontend:** `components/ConfusedButton.tsx` sends request with `confused: true` flag
2. **Backend:** `app/api/chat/route.ts` detects flag and includes worked example instruction in prompt
3. **AI Response:** Immediately provides worked example (bypasses hint ladder)

### Worked Example Template Structure

All worked examples follow this structure:

```
"Let me show you a similar problem to help you understand the pattern:

**Similar Problem:** [Different numbers, same structure]

**Solution Steps:**
1. [Step with explanation]
2. [Next step with reasoning]
3. [Final answer with verification]

Now, can you apply this same method to solve your original problem: [restate]?"
```

### Critical Rules

1. **NEVER solve their exact problem** - Always use different numbers
2. **Keep same difficulty level and problem type** - Don't simplify
3. **After example, return to original problem** - They must apply the pattern
4. **Use LaTeX-style notation** - "Step 1: Subtract 5 → 2x = 8"

### Automatic Scaffolding Triggers

Worked examples are also triggered automatically by the **Hint Ladder** (T2.3):

**Miss #1 → CONCEPTUAL CUE** (guiding question)
- Example: "What operation undoes addition?"

**Miss #2 → PROCEDURAL NUDGE** (specific action suggestion)
- Example: "Try subtracting 5 from both sides."

**Miss #3 → PARTIAL WORKED STEP** (show one step, ask for next)
- Example: "Left side: 2x + 5 - 5 = 2x. Right side: 13 - 5 = 8. So we have 2x = 8. What should we do next?"

**After Miss #3 → OFFER FULL SOLUTION**
- AI: "Would you like me to walk through the complete solution?"

---

## Iteration Notes & Learnings

### Evolution of the Prompts

#### **Iteration 1: Basic Socratic (Epic 1)**

**Issue:** AI was giving direct answers too often
**Fix:** Added T1.2 (Never give answer directly)
**Learning:** Need explicit instruction to resist student requests for answers

#### **Iteration 2: Mode-Aware Pacing (Epic 2)**

**Issue:** One-size-fits-all pacing didn't match student context (homework vs exploration)
**Fix:** Created 3 mode-specific prompt variants with different question densities
**Learning:** Context awareness is powerful - homework students appreciate efficiency, explorers want depth

#### **Iteration 3: Worked Example Scaffolding (Epic 2)**

**Issue:** Students getting frustrated when stuck, but pure Socratic method causing cognitive overload
**Fix:** Implemented T2.3 (Hint Ladder) with escalating support levels
**Learning:** Math Academy research validated - scaffolding prevents frustration while maintaining learning

#### **Iteration 4: Problem Detection & Confirmation (Epic 3)**

**Issue:** AI was apologizing when students introduced new problems (treating it as a correction)
**Fix:** Added T1.1A (Problem Detection) with explicit "NO APOLOGIES" rule for new problems
**Learning:** Natural conversation flow requires distinguishing between corrections and new topics

#### **Iteration 5: Answer Verification (Epic 3)**

**Issue:** AI was affirming incorrect student answers without verification
**Fix:** Added T1.3 (ALWAYS verify before affirming)
**Learning:** Trust breaks when tutor validates wrong answers - verification is non-negotiable

#### **Iteration 6: Math Formatting (Epic 3)**

**Issue:** Plain text math was hard to read (e.g., "x^2 + 5x + 6 = 0")
**Fix:** Added T1.1B (LaTeX formatting with KaTeX rendering)
**Learning:** Beautiful math rendering significantly improves UX

#### **Iteration 7: Struggle Detection Metadata (Epic 4)**

**Issue:** "I'm confused" button visibility was static - couldn't adapt to student state
**Fix:** Added Tier 0 (Metadata Signaling) with [STRUGGLE:true/false] markers
**Learning:** Invisible metadata allows AI to control UI state dynamically

### Key Learnings

1. **Explicit > Implicit** - AI needs very explicit instructions (e.g., "NEVER apologize" not "avoid unnecessary apologies")

2. **Tiered Structure Works** - Hierarchical tier system helps AI prioritize conflicting goals

3. **Examples Are Essential** - The "Examples: Correct Behavior" section is heavily used by GPT-4

4. **Mental Checklist Reduces Errors** - Pre-send checklist catches common mistakes before they reach user

5. **Mode-Specific Pacing Is Powerful** - Students genuinely appreciate adaptive pacing based on their context

6. **Scaffolding Prevents Frustration** - Research-backed: worked examples after 2-3 failed attempts maintains engagement without cognitive overload

7. **Student Agency Matters** - "I'm confused" button gives students control, reducing helplessness

---

## Implementation Details

### File Structure

```
lib/prompts.ts
├── BASE_SOCRATIC_RULES (shared across all modes)
│   ├── Tier 0: Metadata Signaling
│   ├── Tier 1: Non-Negotiable Rules
│   ├── Tier 2: Adaptive Mastery Engine
│   ├── Tier 3: Interaction Protocol
│   ├── Pre-Send Mental Checklist
│   └── Examples (Correct & Incorrect Behavior)
│
├── HOMEWORK_HELP_MODE (mode-specific pacing)
├── EXAM_PREP_MODE (mode-specific pacing)
└── EXPLORATION_MODE (mode-specific pacing)

Exports:
  - SOCRATIC_PROMPTS.homework (base + homework mode)
  - SOCRATIC_PROMPTS.exam (base + exam mode)
  - SOCRATIC_PROMPTS.explore (base + exploration mode)
```

### API Integration

**Location:** `app/api/chat/route.ts`

```typescript
import { SOCRATIC_PROMPTS } from '@/lib/prompts';
import type { SessionMode } from '@/store/chat';

function getPromptForMode(mode: SessionMode): string {
  switch (mode) {
    case 'homework':
      return SOCRATIC_PROMPTS.homework;
    case 'exam':
      return SOCRATIC_PROMPTS.exam;
    case 'explore':
      return SOCRATIC_PROMPTS.explore;
    default:
      return SOCRATIC_PROMPTS.homework; // Fallback
  }
}

// In POST handler:
const systemPrompt = getPromptForMode(sessionMode);

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: systemPrompt },
    ...contextMessages,
  ],
  stream: true,
});
```

### Confused Button Integration

**Frontend:** `components/ConfusedButton.tsx`

```typescript
const handleConfused = () => {
  sendMessage('', sessionMode, true); // confused flag = true
};
```

**Backend:** `app/api/chat/route.ts`

```typescript
const { messages, sessionMode, confused } = await req.json();

if (confused) {
  // Add worked example trigger to system prompt
  systemPrompt += "\n\nThe student has clicked 'I'm really confused' - provide a worked example immediately.";
}
```

### Math Rendering Integration

**Component:** `components/MathText.tsx`

Uses KaTeX to render LaTeX notation:

```typescript
import katex from 'katex';

// Inline math: $...$
// Display math: $$...$$

const renderMath = (text: string) => {
  return text.replace(/\$\$(.*?)\$\$/g, (match, math) => {
    return katex.renderToString(math, { displayMode: true });
  }).replace(/\$(.*?)\$/g, (match, math) => {
    return katex.renderToString(math, { displayMode: false });
  });
};
```

---

## Testing & Validation

### Prompt Testing Results

**Test Date:** November 8, 2025
**Test Coverage:** 20 scenarios (5 problem types × 3 modes + 5 edge cases)
**Pass Rate:** 100% (20/20)

**Key Metrics:**

- ✅ **Pedagogical Quality:** 0% direct answer rate (perfect Socratic adherence)
- ✅ **Mode-Specific Pacing:** Clearly observable differences between modes
- ✅ **Worked Example Triggers:** Appropriate scaffolding after 2-3 failed attempts
- ✅ **Math Rendering:** 100% LaTeX formatting in responses
- ✅ **Problem Confirmation:** 100% new problem detection and confirmation

**See:** `docs/test-results.md` for full validation report

---

## Future Improvements

### Planned Enhancements

1. **Dynamic Difficulty Adjustment** - Adjust problem difficulty based on student mastery
2. **Multi-Turn Strategy Learning** - Recognize when student consistently struggles with specific concept types
3. **Personalized Hint Ladder** - Adapt scaffolding trigger thresholds based on student history
4. **Prerequisite Auto-Detection** - Automatically identify and remediate weak foundational skills
5. **Progress Tracking Integration** - Incorporate streak/mastery data into prompt context

### Research Areas

1. **Optimal Question Density** - A/B test different question densities per mode
2. **Scaffolding Trigger Timing** - Determine optimal number of attempts before scaffolding
3. **Worked Example Complexity** - Test simplified vs. equal-complexity examples
4. **Tone Variations** - Experiment with different encouragement styles

---

## Appendix: Full Prompt Examples

### Example 1: Homework Mode (Full Prompt)

```
[BASE_SOCRATIC_RULES - 480 lines]
+
[HOMEWORK_HELP_MODE - 76 lines]
```

**Total Prompt Length:** ~556 lines, ~4200 tokens

### Example 2: Exploration Mode (Full Prompt)

```
[BASE_SOCRATIC_RULES - 480 lines]
+
[EXPLORATION_MODE - 92 lines]
```

**Total Prompt Length:** ~572 lines, ~4400 tokens

### Example 3: Exam Prep Mode (Full Prompt)

```
[BASE_SOCRATIC_RULES - 480 lines]
+
[EXAM_PREP_MODE - 76 lines]
```

**Total Prompt Length:** ~556 lines, ~4200 tokens

---

## References

### Research Papers & Resources

1. **Math Academy:** [Adaptive Mastery Principles](https://mathacademy.com/) - Scaffolding prevents cognitive overload
2. **Khan Academy:** [Khanmigo Socratic Tutor](https://www.khanacademy.org/khanmigo) - Pure Socratic questioning
3. **Expertise Reversal Effect:** Why worked examples matter for beginners
4. **GPT-4 System Prompts:** [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)

### Related Files

- **Implementation:** `lib/prompts.ts` (full prompt source code)
- **API Integration:** `app/api/chat/route.ts` (prompt selection logic)
- **Test Results:** `docs/test-results.md` (validation evidence)
- **Architecture:** `docs/architecture.md` (technical design decisions)

---

**Last Updated:** November 8, 2025
**Author:** Reena
**Version:** 1.0
