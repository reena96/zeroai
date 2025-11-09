# Epic 10: Grade-Level Adaptive Difficulty (Personalized Learning Paths)

**Goal:** Extend existing 3 context modes (Homework/Exam/Exploration) with grade-level personalization, adjusting problem difficulty, vocabulary, and scaffolding based on student's grade (6-12).

**Why This:** Current 3 modes adjust pacing but not prerequisite knowledge assumptions. A 6th grader needs different scaffolding than a 12th grader on the same linear equation. Personalizing by grade = better learning outcomes + reduces frustration.

**Value:** Makes product truly adaptive (context + grade level), supports wider age range (K-12), increases effectiveness (right-sized challenges), enables school partnerships (grade-appropriate content).

**Estimated Effort:** 1 day (extends existing mode system)

**Stories:** 2 stories

---

## Story 10.1: Grade Level Selection & Profile

As a student,
I want to select my grade level when starting,
So that the AI adjusts explanations to my background knowledge.

**Acceptance Criteria:**
1. Grade level selector added to mode selection screen:
   - Dropdown or buttons: "6th", "7th", "8th", "9th-10th", "11th-12th"
   - Optional "Skip" (defaults to grade 9-10)
2. Grade level saved in profile (localStorage for MVP)
3. Persistent across sessions (remembers choice)
4. Can change grade level in settings
5. Visual indicator shows current grade: "📚 Grade 8 | Homework Help"
6. Grade-appropriate welcome message:
   - 6th grade: "Hi! I'm here to help you with your math. Let's work through this together!"
   - 12th grade: "Ready to tackle some math? Let's break this down systematically."
7. First-time user onboarding:
   - "What grade are you in?" (friendly, non-intimidating)
   - "Don't worry, you can change this anytime in settings"
8. Grade detection from problem (optional):
   - If student enters "Factor x² + 5x + 6" → Suggest grade 9-10
   - "This looks like Algebra I. Are you in 9th or 10th grade?"
9. Privacy: No personally identifiable information stored (just grade number)
10. Mobile-friendly selector (large tap targets)

**Prerequisites:** Epics 1-2 (extends existing mode system)

**Technical Notes:**
- State management: Add `gradeLevel` to user profile store
```typescript
interface UserProfile {
  gradeLevel: 6 | 7 | 8 | 9 | 10 | 11 | 12
  selectedMode: 'homework' | 'exam' | 'exploration'
  preferences: {
    voiceModeEnabled: boolean
    // ...
  }
}
```
- Storage: localStorage (MVP) → backend (future)
- Default: Grade 9 (middle of range, safest assumption)

**Research Findings:**
- Common Core Math Standards by grade (reference for prerequisites)
- Grade 6-8: Pre-algebra, basic geometry
- Grade 9-10: Algebra I, Geometry
- Grade 11-12: Algebra II, Pre-Calculus, Calculus

---

## Story 10.2: Grade-Adaptive Scaffolding & Vocabulary

As a 6th grader,
I want explanations that don't assume I know advanced concepts,
So that I don't get confused by unfamiliar terminology.

**Acceptance Criteria:**
1. Prompt engineering adjusts by grade level:
   - **Grade 6-8:** Simpler vocabulary, more scaffolding, concrete examples
   - **Grade 9-10:** Standard algebra terminology, moderate scaffolding
   - **Grade 11-12:** Advanced vocabulary, less scaffolding, assumes fluency
2. Vocabulary differences:
   - Grade 6: "opposite operation" vs. Grade 12: "inverse operation"
   - Grade 7: "solve for x" vs. Grade 12: "determine the value of the variable"
   - Grade 8: "what do we do next?" vs. Grade 12: "identify the appropriate transformation"
3. Prerequisite knowledge assumptions:
   - **Grade 6:** Explain order of operations (PEMDAS) if needed
   - **Grade 9:** Assume order of operations known
   - **Grade 12:** Assume fluency with algebraic manipulation
4. Scaffolding density:
   - Grade 6-8: 5-7 questions per concept (high scaffolding)
   - Grade 9-10: 3-4 questions per concept (moderate)
   - Grade 11-12: 2-3 questions per concept (low - assumes independence)
5. Examples and analogies:
   - Grade 6: "Think of x as a mystery number in a puzzle"
   - Grade 12: "Consider x as an unknown quantity to isolate"
6. Worked example complexity:
   - Grade 6: Show every sub-step (2+3=5, then 5×4=20)
   - Grade 12: Skip trivial arithmetic (simplify directly)
7. Encouragement style:
   - Grade 6: "You're doing great! Keep going!"
   - Grade 12: "Solid reasoning - proceed to the next step"
8. Error correction approach:
   - Grade 6: "Not quite - let's think about what adding means"
   - Grade 12: "Check your arithmetic on that step"
9. Mode + Grade combination:
   - Homework Help + Grade 6 = Maximum scaffolding
   - Exploration + Grade 12 = Minimal scaffolding, deep concepts
10. Settings allow override: "Explain like I'm in [different grade]"

**Prerequisites:** Story 10.1 (needs grade selection)

**Technical Notes:**
- Prompt templates per grade band:
  - `prompts/grade-6-8.ts`
  - `prompts/grade-9-10.ts`
  - `prompts/grade-11-12.ts`
- Dynamic prompt composition:
```typescript
const systemPrompt = composePrompt({
  mode: userProfile.selectedMode,
  gradeLevel: userProfile.gradeLevel,
  problemType: detectedProblemType
})
```
- Vocabulary mapping: Define grade-appropriate term substitutions
- LLM meta-prompt: "Adjust explanation complexity for {gradeLevel}"

**Prompt Engineering Examples:**

**Grade 6-8 System Prompt:**
```
You are a patient, encouraging math tutor for middle school students (grades 6-8).

VOCABULARY: Use simple, everyday language. Avoid advanced terms.
- Say "opposite operation" not "inverse operation"
- Say "solve for x" not "isolate the variable"
- Explain each step clearly

SCAFFOLDING: Ask 5-7 guiding questions per concept. Break down into small steps.
PREREQUISITES: Do not assume fluency with fractions, negatives, or variables.
ENCOURAGEMENT: Frequent, positive reinforcement.
```

**Grade 11-12 System Prompt:**
```
You are a rigorous math tutor for high school juniors/seniors (grades 11-12).

VOCABULARY: Use standard mathematical terminology. Assume familiarity with algebra fundamentals.
- "Inverse operation", "isolate the variable", "factor the expression"

SCAFFOLDING: 2-3 targeted questions. Skip trivial steps.
PREREQUISITES: Assume fluency with algebra, geometry, trigonometry.
ENCOURAGEMENT: Professional, concise feedback.
```

---

## Success Checkpoint: After Epic 10

**Validation Criteria:**
- ✅ Same problem "2x + 5 = 13" results in different scaffolding for grade 6 vs. grade 12
- ✅ Grade 6 receives 6 guiding questions, grade 12 receives 3 questions
- ✅ Vocabulary matches grade level (simple vs. advanced terms)
- ✅ Grade selection persists across sessions
- ✅ Settings allow changing grade level mid-session
- ✅ All 3 modes × 3 grade bands = 9 combinations work correctly

**Testing Scenarios:**
1. **Grade 6 + Homework:** "2x + 5 = 13" → High scaffolding, simple vocab
2. **Grade 12 + Exploration:** "Factor x² + 5x + 6" → Low scaffolding, advanced discussion
3. **Grade Change:** Start as grade 8, switch to grade 10 mid-session → Immediate adjustment
4. **Mode + Grade:** Test all 9 combinations (3 modes × 3 grade bands)
5. **Persistence:** Set grade 7, close browser, reopen → Grade 7 remembered

**Quality Metrics:**
- Vocabulary appropriateness: 95% match to grade-level standards
- Scaffolding density matches spec (±1 question)
- Student satisfaction: "Explanations feel right for my level"
- Error rate: <5% vocabulary mismatches

**Known Limitations:**
- Grade bands are broad (9-10 combined, 11-12 combined)
- No automatic grade progression (student must manually update)
- Vocabulary mapping is manual (not AI-generated)
- Doesn't account for individual learning differences within grade

---

## Technical Architecture

### Components
- `GradeLevelSelector.tsx` - Grade selection UI
- `GradeIndicator.tsx` - Display current grade badge
- `ProfileSettings.tsx` - Edit grade level

### Prompt System
```
/lib/prompts/
  ├── base-socratic.ts          # Core Socratic rules
  ├── modes/
  │   ├── homework.ts
  │   ├── exam.ts
  │   └── exploration.ts
  ├── grades/
  │   ├── grade-6-8.ts          # Middle school vocabulary/scaffolding
  │   ├── grade-9-10.ts         # High school intro
  │   └── grade-11-12.ts        # Advanced high school
  └── composer.ts               # Combine mode + grade + problem type
```

### Vocabulary Mapping
```typescript
const vocabularyByGrade = {
  '6-8': {
    'inverse': 'opposite',
    'variable': 'unknown number',
    'factor': 'break into parts'
  },
  '9-10': {
    'inverse': 'inverse operation',
    'variable': 'variable',
    'factor': 'factor'
  },
  '11-12': {
    'inverse': 'inverse function',
    'variable': 'independent variable',
    'factor': 'factorize'
  }
}
```

### State Management
```typescript
interface AdaptiveLearningState {
  userProfile: {
    gradeLevel: 6 | 7 | 8 | 9 | 10 | 11 | 12
    selectedMode: LearningMode
  }
  currentPromptTemplate: string
  scaffoldingLevel: 'high' | 'medium' | 'low'
  vocabularyLevel: 'simple' | 'standard' | 'advanced'
}
```

---

## Why This Epic Matters

**Learning Science:**
- **Zone of Proximal Development:** Right-sized challenges optimize learning
- **Cognitive Load Theory:** Grade-appropriate vocab reduces extraneous load
- **Scaffolding Fading:** Older students need less support (research-backed)

**Competitive Differentiation:**
- **Khanmigo:** One-size-fits-all (no grade personalization)
- **Photomath:** No personalization (just shows steps)
- **Math Academy:** Adaptive difficulty but not Socratic
- **zeroai:** ONLY Socratic tutor with grade-level + context-mode adaptation

**Business Value:**
- Expands addressable market to full K-12 range (6-12)
- School partnerships easier ("Supports all grade levels")
- Parent appeal ("Adapts to my child's level")
- Retention: Students don't outgrow the product

**Pedagogical Impact:**
- 6th graders don't get lost in advanced terminology
- 12th graders don't get bored with excessive scaffolding
- Builds confidence (right-level challenges)
- Supports diverse learners (honors vs. struggling students)

---

**Epic 10 Status:** 📝 Ready for Implementation
**Priority:** MEDIUM-HIGH (Quick win, extends existing system)
**Estimated Timeline:** 1 day
**Recommended Order:** After Epic 5 (stable modes), parallel with Epic 7
