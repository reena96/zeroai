# Epic 2: All Stories Created - Summary

**Date:** 2025-11-05
**Epic:** Scaffolded Socratic Dialogue
**Stories Created:** 4/4
**Status:** All stories drafted and ready for development

---

## 📋 Stories Created

### ✅ Story 2.1: Context Mode Selection UI
**File:** `docs/stories/2-1-context-mode-selection-ui.md`
**Status:** drafted
**Complexity:** Medium (3-4 hours)

**What It Does:**
- Creates mode selection UI with 3 buttons (Homework, Exam, Exploration)
- Stores selected mode in session state
- Shows mode indicator in header
- Defaults to Homework Help after 10 seconds

**Key Components:**
- `ModeSelector.tsx` - Three button UI
- `ModeIndicator.tsx` - Header badge
- Session state management

**Dependencies:** Story 1.2 (State Management)

---

### ✅ Story 2.2: Mode-Aware System Prompts
**File:** `docs/stories/2-2-mode-aware-system-prompts.md`
**Status:** drafted
**Complexity:** Medium (3-4 hours)

**What It Does:**
- Creates 3 mode-specific prompt variants
- Homework Help: 2-3 questions per concept, efficient pace
- Exam Prep: 1-2 questions, fast review
- Exploration: 5-7 questions, deep dive
- AI behavior adapts based on selected mode

**Key Changes:**
- `/lib/prompts.ts` - Add `SOCRATIC_PROMPTS` object with 3 variants
- `app/api/chat/route.ts` - Select prompt based on mode

**Dependencies:** Story 2.1 (Mode Selection), Story 1.4 (Base Prompt)

---

### ✅ Story 2.3: Worked Example Scaffolding Logic
**File:** `docs/stories/2-3-worked-example-scaffolding-logic.md`
**Status:** drafted
**Complexity:** Complex (4-6 hours)

**What It Does:**
- AI detects when student is stuck (2+ failed attempts)
- Generates SIMILAR problem (not exact) with step-by-step solution
- Mode-specific timing: 2 turns (homework/exam), 3 turns (exploration)
- Returns student to original problem after example

**Key Features:**
- Stuck detection via prompt instructions
- Similar problem generation (LLM on-the-fly)
- Worked example format template
- LaTeX-style notation

**Dependencies:** Story 2.2 (Mode-Aware Prompts)

---

### ✅ Story 2.4: "I'm Really Confused" Button
**File:** `docs/stories/2-4-im-really-confused-button.md`
**Status:** drafted
**Complexity:** Medium (3-4 hours)

**What It Does:**
- Adds "I'm really confused" button to all AI messages
- Click triggers immediate worked example (bypasses hint ladder)
- Adaptive pace check-in after scaffolding (once per problem)
- Student can click multiple times

**Key Components:**
- `ConfusedButton.tsx` - Button component
- Click handler injects system message
- Pace check-in logic
- Metadata tracking

**Dependencies:** Story 2.3 (Worked Example Logic)

---

## 🔗 Dependency Graph

```
Story 2.1 (Mode Selection UI)
    ↓
Story 2.2 (Mode-Aware Prompts) ← depends on 2.1
    ↓
Story 2.3 (Worked Examples) ← depends on 2.2
    ↓
Story 2.4 (Confused Button) ← depends on 2.3
```

**Critical Path:** Must be executed sequentially (2.1 → 2.2 → 2.3 → 2.4)

**Parallelization Opportunities:** None (all sequential dependencies)

---

## 📊 Execution Strategy

### **Option 1: Sequential Execution (Conservative)**
- Day 1: Story 2.1 (3-4 hours)
- Day 2: Story 2.2 (3-4 hours)
- Day 3: Story 2.3 (4-6 hours)
- Day 4: Story 2.4 (3-4 hours)

**Total:** 13-18 hours across 4 days

---

### **Option 2: Batched Execution (Faster)**
- **Session 1 (4-5 hours):** Stories 2.1 + 2.2
  - Implement mode selection UI
  - Immediately add mode-aware prompts
  - Test mode selection → prompt switching

- **Session 2 (5-7 hours):** Stories 2.3 + 2.4
  - Add worked example logic to prompts
  - Implement confused button
  - Test complete scaffolding flow

**Total:** 9-12 hours across 2 days

**Benefits:**
- Faster epic completion
- Context maintained across related stories
- Testing happens in larger chunks

---

### **Option 3: Lightweight Execution (Recommended)**
- Skip formal review checkpoints
- Execute all 4 stories in 1-2 sessions
- Mark all as "done" together at end
- Run retrospective after completion

**Process:**
```bash
# Session 1: Implement all 4 stories (8-12 hours)
1. Story 2.1: Mode selection UI
2. Story 2.2: Mode-aware prompts
3. Story 2.3: Worked examples
4. Story 2.4: Confused button

# Session 2: Testing and validation
5. Test all 3 modes
6. Test worked examples
7. Test confused button
8. Mark all stories done

# Session 3: Retrospective
9. /BMad:bmm:workflows:retrospective
```

**Total:** 1-2 days instead of 4 days

---

## 🎯 Recommended Approach

**For ZeroAI MVP, I recommend Option 3 (Lightweight):**

**Why:**
- Epic 2 stories are tightly coupled (better to implement together)
- Faster iteration (maintain context across all 4 stories)
- Can optimize across story boundaries
- Still maintains quality through testing phase

**How to Execute:**

1. **Read all 4 story files** to understand full scope
2. **Implement in one flow:**
   - Add mode selector UI
   - Add mode-aware prompts immediately
   - Add worked example logic
   - Add confused button
3. **Test complete feature** (not story-by-story)
4. **Mark all done** when epic complete

**Time Savings:** 4 days → 1-2 days (50-75% faster)

---

## 📝 Story Status Update

**Updated in `docs/sprint-status.yaml`:**

```yaml
# Epic 2: Scaffolded Socratic Dialogue
epic-2: backlog
2-1-context-mode-selection-ui: drafted ✅
2-2-mode-aware-system-prompts: drafted ✅
2-3-worked-example-scaffolding-logic: drafted ✅
2-4-i-m-really-confused-button: drafted ✅
epic-2-retrospective: optional
```

---

## 🚀 Next Steps

**Ready to start Epic 2 implementation!**

### **Option A: Start Immediately**
```bash
# Read all story files
cat docs/stories/2-*.md

# Implement all 4 stories in one session
# (8-12 hours focused work)

# Mark all done
/BMad:bmm:workflows:story-done # 2.1
/BMad:bmm:workflows:story-done # 2.2
/BMad:bmm:workflows:story-done # 2.3
/BMad:bmm:workflows:story-done # 2.4

# Retrospective
/BMad:bmm:workflows:retrospective
```

### **Option B: Traditional Sequential**
```bash
# Execute one story at a time
/BMad:bmm:workflows:dev-story # 2.1
/BMad:bmm:workflows:story-done # 2.1

/BMad:bmm:workflows:dev-story # 2.2
/BMad:bmm:workflows:story-done # 2.2

# ... etc
```

---

## 📊 Comparison: Epic 1 vs Epic 2 Execution

| Metric | Epic 1 (Sequential) | Epic 2 (Batched) | Improvement |
|--------|---------------------|------------------|-------------|
| Stories | 4 | 4 | Same |
| Sessions | 4 | 1-2 | 50-75% fewer |
| Total Time | ~4 days | ~1-2 days | 50-75% faster |
| Overhead | High (review each) | Low (batch review) | Significant |
| Context Loss | High (between stories) | Low (maintained) | Better quality |

---

## ✅ Epic 2 Story Creation Complete

All 4 stories drafted and ready for implementation!

**Files Created:**
- ✅ `docs/stories/2-1-context-mode-selection-ui.md`
- ✅ `docs/stories/2-2-mode-aware-system-prompts.md`
- ✅ `docs/stories/2-3-worked-example-scaffolding-logic.md`
- ✅ `docs/stories/2-4-i-m-really-confused-button.md`
- ✅ `docs/sprint-status.yaml` updated

**Status:** Ready for development using batched execution strategy
