# Epic 1 Chat Validation Tests
**Date:** 2025-11-05
**Purpose:** Quick chat-based validation of Epic 1 (Core Chat Infrastructure)
**Time Required:** 15-20 minutes

---

## 📋 EPIC 1 SCOPE

Epic 1 covers the foundation:
- **Story 1.1:** Basic web app + chat UI skeleton
- **Story 1.2:** Conversation state management
- **Story 1.3:** LLM API integration with math validation
- **Story 1.4:** Socratic system prompt engineering

**Core Features to Validate:**
1. Chat interface works (Story 1.1)
2. Conversation persists across messages (Story 1.2)
3. Math validation catches errors (Story 1.3)
4. Socratic prompting prevents direct answers (Story 1.4)

---

## 🚀 SETUP

1. Start dev server:
```bash
cd /Users/reena/gauntletai/zeroai
npm run dev
```

2. Open browser: `http://localhost:3000`

3. Open this document side-by-side with browser for copy-paste

---

## ✅ TEST SUITE

### **TEST 1: Basic Chat Interface (Story 1.1)**
**Purpose:** Verify chat UI works and accepts input

**Action:**
```
Hello
```

**Expected:**
- AI responds (any response OK)
- Message appears in chat history
- Input field clears after send
- Response streams in (doesn't appear all at once)

**Pass Criteria:** ✅ Chat interface functional

---

### **TEST 2: Conversation Context (Story 1.2)**
**Purpose:** Verify messages persist and context maintained

**Action:**
```
My name is Alex
```

**Wait for response, then send:**
```
What's my name?
```

**Expected:**
- AI remembers: "Your name is Alex" or similar
- Previous messages visible in chat history

**Pass Criteria:** ✅ Context retained across messages

---

### **TEST 3: Core Socratic Behavior (Story 1.4)**
**Purpose:** Verify AI doesn't give direct answers

**Action:**
```
Solve for x: 2x + 5 = 13
```

**Expected:**
- AI asks guiding question (e.g., "What operation undoes +5?")
- Does NOT say "x = 4"
- Does NOT show complete solution immediately

**Pass Criteria:** ✅ No direct answer given

---

### **TEST 4: Over-Scaffolding Check (Story 1.4 - New Fix)**
**Purpose:** Verify AI doesn't show complete work before student attempts

**Action:**
```
Simplify: 5x + 3(2x - 4) + 7
```

**Expected CORRECT Behavior:**
- Asks question FIRST: "What's the first step?" or "What should we do with 3(2x - 4)?"
- Does NOT show: "Distribute 3 to get 6x - 12..."

**Expected WRONG Behavior (Should NOT happen):**
- Shows all distribution work before asking

**Pass Criteria:** ✅ Asks question WITHOUT showing work first

---

### **TEST 5: Hint Ladder Escalation (Story 1.4)**
**Purpose:** Verify systematic scaffolding (Conceptual → Procedural → Worked)

**Action:**
```
Solve for x: 3x - 7 = 14
```

**Response 1 (Conceptual):** AI asks guiding question
```
I don't know
```

**Response 2 (Procedural):** AI suggests action
```
I still don't know
```

**Response 3 (Worked Step):** AI shows partial work
```
I'm stuck
```

**Response 4 (Offer):** AI offers full solution

**Expected Progression:**
1. First: Conceptual question (no work shown)
2. Second: Procedural suggestion (still no work)
3. Third: Partial worked step (shows ONE step)
4. Fourth: Offers complete solution

**Pass Criteria:** ✅ Systematic escalation observed

---

### **TEST 6: Intent Recognition (Story 1.4)**
**Purpose:** Verify AI distinguishes "confused" from "give up"

#### **Part A: Confusion (NOT exception)**
**Action:**
```
I'm confused about how to start 2x + 5 = 13
```

**Expected:**
- Redirects with question: "What part feels unclear?" or "What's our goal?"
- Does NOT provide full solution

**Pass Criteria:** ✅ Asks clarifying question, doesn't give answer

#### **Part B: Give Up (IS exception)**
**Action:**
```
I give up, just tell me the answer to 2x + 5 = 13
```

**Expected:**
- Provides full solution: "Subtract 5 → 2x = 8. Divide by 2 → x = 4. Check: 2(4) + 5 = 13 ✓"

**Pass Criteria:** ✅ Provides complete solution when explicitly requested

---

### **TEST 7: Error Validation (Story 1.4)**
**Purpose:** Verify AI never validates wrong answers

**Action:**
```
Solve for x: 2x + 5 = 13
```

**Wait for AI question, then:**
```
2x - 13 + 5
```

**Expected:**
- "Not quite..." or similar correction
- Does NOT say "You're right!" or "Correct!"
- Gently corrects the error

**Pass Criteria:** ✅ Wrong answer not validated

---

### **TEST 8: Math Validation (Story 1.3)**
**Purpose:** Verify pre-validation catches math errors

**Note:** This tests backend validation, not visible to user in normal flow

**What Should Happen Behind Scenes:**
- LLM generates response
- Math validator checks expressions
- If errors found, LLM regenerates
- User sees only correct response

**How to Verify:**
Ask complex problem and check response times:

**Action:**
```
Solve: 5x + 3(2x - 4) = 22
```

**Expected:**
- Response arrives in 3-5 seconds (normal)
- If validation triggers: 5-8 seconds (retry happened)
- Final answer is mathematically correct
- Check: x = 2 (verify: 5(2) + 3(2(2) - 4) = 10 + 3(0) = 10 ≠ 22... actual: x = 34/11)

**Pass Criteria:** ✅ Response is mathematically accurate

---

### **TEST 9: Apology Policy (Story 1.4)**
**Purpose:** Verify AI only apologizes for AI mistakes

#### **Part A: Student Confusion (No Apology)**
**Action:**
```
I'm confused
```

**Expected:**
- "No problem! Let's break it down..." or "What part feels unclear?"
- NO "Sorry for any confusion"

**Pass Criteria:** ✅ No apology given

#### **Part B: Short Answer Interpretation (No Apology)**
**Action:**
```
What operation undoes +5?
```

**Wait for AI question like above, then:**
```
-5
```

**Expected:**
- "Exactly! Subtract 5..." (validates short answer)
- NO "I apologize for misunderstanding"

**Pass Criteria:** ✅ Interprets short answer correctly, no apology

---

### **TEST 10: Good Habits Reinforcement (Story 1.4)**
**Purpose:** Verify AI reinforces checking work

**Action:**
```
Solve for x: 2x + 5 = 13
```

**Follow the dialogue, then when you get answer:**
```
Let me check: 2(4) + 5 = 8 + 5 = 13. It works!
```

**Expected:**
- "Excellent! I love that you verified the answer. That's a great mathematical habit."
- Explicitly praises the verification behavior

**Pass Criteria:** ✅ Good habit explicitly reinforced

---

### **TEST 11: Response Time (Story 1.3 - Performance)**
**Purpose:** Verify Wolfram removal improved speed

**Action:**
```
What is 25 + 37?
```

**Expected:**
- Response arrives in 2-5 seconds
- Does NOT hang or "think forever"

**Pass Criteria:** ✅ Response time under 5 seconds

---

### **TEST 12: Conversation Length (Story 1.2)**
**Purpose:** Verify state management handles long conversations

**Action:**
Send 5+ messages in sequence:
```
1. "Hi"
2. "My favorite number is 7"
3. "Solve: 2x + 5 = 13"
4. [Respond to AI's question]
5. "What was my favorite number?"
```

**Expected:**
- All messages visible in history
- AI remembers "7" from message #2
- No crashes or state loss

**Pass Criteria:** ✅ Conversation state maintained through 5+ messages

---

## 📊 VALIDATION CHECKLIST

After running all tests, check off:

**Story 1.1: Chat UI**
- [ ] Test 1: Chat interface functional
- [ ] Test 11: Response time under 5 seconds

**Story 1.2: Conversation State**
- [ ] Test 2: Context retained across messages
- [ ] Test 12: Long conversation handling (5+ messages)

**Story 1.3: LLM Integration + Math Validation**
- [ ] Test 8: Math validation working (accurate results)
- [ ] Test 11: Performance acceptable (3-5 sec)

**Story 1.4: Socratic Prompting**
- [ ] Test 3: Core Socratic behavior (no direct answers)
- [ ] Test 4: Over-scaffolding prevented (new fix)
- [ ] Test 5: Hint ladder escalation working
- [ ] Test 6: Intent recognition (confused vs give up)
- [ ] Test 7: Error validation (never validates wrong answers)
- [ ] Test 9: Apology policy (only for AI mistakes)
- [ ] Test 10: Good habits reinforcement

---

## 🎯 EDGE CASES TO EXPLORE

If you have extra time, try these edge cases:

### **Edge Case 1: Repeated Same Error (Prerequisite Backtrack)**
```
Solve: 3x - 7 = 14

[AI asks what to do first]
You: "Add 7 to the left side"

[AI corrects: need both sides]
You: "Subtract 7 from the left?"
```

**Expected:** AI recognizes SAME error twice (operating on one side only) and backtracks to remediate equality concept.

---

### **Edge Case 2: Success at Miss #2 (Exit Ladder)**
```
Solve: 2x + 5 = 13

[AI asks: "What undoes +5?"]
You: "Add 5?"  [Miss #1]

[AI asks: "What's opposite of addition?"]
You: "Subtraction!"  [SUCCESS at Miss #2]
```

**Expected:** AI exits hint ladder (doesn't continue to Miss #3), proceeds with solution.

---

### **Edge Case 3: Ambiguous Problem**
```
Find the equation of a line through (2,3)
```

**Expected:**
- "There are infinitely many lines through (2,3). Do you want a specific slope?"
- States ambiguity explicitly

---

### **Edge Case 4: Underspecified Problem**
```
What's the area of a rectangle with one side 6?
```

**Expected:**
- "That's underspecified—area needs both side lengths. Do you have the other side?"

---

### **Edge Case 5: Multiple Questions in Turn (Should NOT Happen)**
```
Solve: 2x + 5 = 13
```

**Expected:** AI asks ONE question per turn, not multiple questions.

**Check for WRONG behavior:**
- "What undoes addition? And then what do we do? Do you know about inverse operations?"

---

## ✅ SUCCESS CRITERIA

**Epic 1 is VALIDATED when:**
- [ ] All 12 core tests pass
- [ ] No direct answers given (0% violation rate)
- [ ] Conversation state persists
- [ ] Response times 2-5 seconds consistently
- [ ] Systematic scaffolding working (hint ladder)
- [ ] Intent recognition working (confused vs give up)
- [ ] No false validations of wrong answers
- [ ] Over-scaffolding prevented (new fix)

---

## 🚨 FAILURE MODES TO WATCH FOR

1. **Direct Answer Given:** AI says "x = 4" without being asked
2. **Over-Scaffolding:** AI shows complete work before student attempts
3. **False Validation:** AI says "You're right!" when student is wrong
4. **Inappropriate Apology:** AI apologizes for student confusion
5. **Context Loss:** AI forgets previous messages
6. **Slow Response:** Takes >10 seconds (Wolfram issue)
7. **Skip Hint Ladder:** Jumps straight to Miss #3 without Miss #1, #2
8. **No Exit Condition:** Continues to Miss #3 even when student succeeds at Miss #2

---

## 📝 TESTING LOG TEMPLATE

Copy this template to track your results:

```
EPIC 1 VALIDATION - [Date/Time]
================================

TEST 1 (Chat UI): ✅ / ❌
Notes:

TEST 2 (Context): ✅ / ❌
Notes:

TEST 3 (Socratic): ✅ / ❌
Notes:

TEST 4 (Over-Scaffolding): ✅ / ❌
Notes:

TEST 5 (Hint Ladder): ✅ / ❌
Notes:

TEST 6 (Intent): ✅ / ❌
Notes:

TEST 7 (Error Validation): ✅ / ❌
Notes:

TEST 8 (Math Validation): ✅ / ❌
Notes:

TEST 9 (Apology Policy): ✅ / ❌
Notes:

TEST 10 (Good Habits): ✅ / ❌
Notes:

TEST 11 (Response Time): ✅ / ❌
Notes:

TEST 12 (Conversation Length): ✅ / ❌
Notes:

EDGE CASES TESTED:
- [ ] Prerequisite Backtrack
- [ ] Exit Ladder on Success
- [ ] Ambiguous Problem
- [ ] Underspecified Problem
- [ ] Multiple Questions Check

OVERALL STATUS: PASS / FAIL
BLOCKERS:
NOTES:
```

---

## 🎬 READY FOR GAUNTLET IF:

✅ All 12 tests pass
✅ At least 3/5 edge cases work correctly
✅ No critical failures observed
✅ Response times consistently under 5 seconds

**After validation, Epic 1 can be marked COMPLETE and ready for demo!**
