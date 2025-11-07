# Epic 1: Core Chat Infrastructure (Foundation - Day 1)

**Goal:** Build the foundational chat interface with LLM integration and Socratic prompting engine.

**Why This First:** Everything builds on the conversation engine. We need to validate that the LLM can successfully guide Socratic dialogue before adding complexity.

**Value:** Proves the core concept works - AI can guide students through Socratic questioning. Technical foundation for all subsequent features.

**Stories:** 3-4 stories

---

## Story 1.1: Basic Web App Setup with Chat UI Skeleton

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

## Story 1.2: Conversation State Management

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

## Story 1.3: LLM API Integration

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

## Story 1.4: Socratic System Prompt Engineering

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

## Success Checkpoint: After Day 1

- ✅ Chat interface works
- ✅ LLM responds with Socratic questions
- ✅ No direct answers given
