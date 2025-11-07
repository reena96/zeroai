# zeroai - Architecture Document

**Author:** Reena
**Date:** November 3, 2025
**Project:** AI Math Tutor (Gauntlet C3)
**Version:** 1.0

---

## Executive Summary

This architecture document defines the technical implementation for **zeroai**, a Socratic AI Math Tutor targeting K-12 students. The architecture is optimized for a **5-day development sprint** with **17 implementable stories** across **5 epics**, ensuring consistency across multiple AI development agents.

**Core Architectural Approach:**
- **Framework:** Next.js 15 with App Router and TypeScript for type-safe rapid development
- **State Management:** Zustand with persistence middleware for streaks and gamification
- **LLM Integration:** OpenAI GPT-4 for Socratic dialogue + GPT-4 Vision for OCR (unified API)
- **Deployment:** Vercel for one-command deployment with edge functions
- **Error Handling:** Standardized ApiResponse pattern with retry logic and graceful degradation

**Unique Technical Challenges:**
1. **Context-Aware Prompting:** Mode-specific Socratic dialogue (Homework/Exam/Exploration)
2. **Scaffolded Learning:** Worked example generation when students are stuck
3. **Real-Time Streaming:** LLM responses streamed to chat UI
4. **Math Rendering:** Client-side LaTeX rendering with KaTeX
5. **Gamification Persistence:** localStorage for streaks/counters with automatic sync

This architecture ensures all 17 stories produce compatible, production-ready code.

---

## Project Initialization

**First Implementation Story (Story 1.1) should execute:**

```bash
npx create-next-app@latest zeroai --typescript --tailwind --app --eslint
```

This establishes the base architecture with these decisions already made:
- ✅ Next.js 15 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for rapid styling
- ✅ ESLint for code quality
- ✅ Standard project structure (`app/`, `components/`, `lib/`)

**After initialization:**
```bash
cd zeroai
npm install openai zustand katex canvas-confetti nanoid
npm install --save-dev @types/katex
```

---

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| **Framework** | Next.js | 15 (latest) | All | App Router, Server Components, Vercel-optimized |
| **Language** | TypeScript | Latest | All | Type safety, better DX, prevents bugs |
| **Styling** | Tailwind CSS | Latest | All | Rapid development, utility-first, responsive |
| **Build Tool** | Turbopack | Built-in | All | Fast builds, default in Next.js 15 |
| **Linting** | ESLint | Built-in | All | Code quality, consistency |
| **LLM Provider** | OpenAI GPT-4 | SDK 6.2.0 | Epic 1, 2 | Proven Socratic quality, streaming support |
| **Vision/OCR** | GPT-4 Vision | Included | Epic 3 | Same API as LLM, unified billing |
| **Math Rendering** | KaTeX | 0.16.25 | Epic 3 | Fast, lightweight, client-side |
| **State Management** | Zustand | 5.0.8 | Epic 1, 2, 4 | localStorage middleware, fine-grained subscriptions |
| **Animations** | canvas-confetti | 1.9.4 | Epic 4 | Celebration effects for gamification |
| **ID Generation** | nanoid | Latest | Epic 1, 4 | Unique message/session IDs |
| **API Structure** | Separate routes | N/A | Epic 1, 3 | /api/chat, /api/ocr - clear separation |
| **Error Handling** | Standardized ApiResponse | Custom | All | Consistent error UX, retry logic |
| **Logging** | Structured console | Custom | All | Vercel-compatible, debugging aid |
| **Deployment** | Vercel | N/A | Epic 5 | Next.js optimized, edge functions |
| **Testing** | Manual only | N/A | Epic 5 | 5-day timeline, 30 test cases |
| **Date/Time** | Client-side local | Browser API | Epic 4 | Simpler for streaks, personal |

## Project Structure

```
zeroai/
├── app/
│   ├── page.tsx                      # Main chat interface (Story 1.1, 1.2)
│   ├── layout.tsx                    # Root layout with providers
│   ├── globals.css                   # Tailwind imports
│   └── api/
│       ├── chat/
│       │   └── route.ts              # LLM Socratic dialogue endpoint (Story 1.3, 1.4, 2.2, 2.3)
│       └── ocr/
│           └── route.ts              # GPT-4 Vision image parsing (Story 3.2)
│
├── components/
│   ├── ChatContainer.tsx             # Top-level chat wrapper (Story 1.2)
│   ├── MessageList.tsx               # Message display with auto-scroll (Story 1.2)
│   ├── MessageInput.tsx              # Input field + send button (Story 1.2, 3.1)
│   ├── Message.tsx                   # Single message with math rendering (Story 1.2, 3.3)
│   ├── ModeSelector.tsx              # 3-mode selection UI (Story 2.1)
│   ├── ConfusedButton.tsx            # "I'm confused" trigger (Story 2.4)
│   ├── StreakDisplay.tsx             # Daily streak counter (Story 4.1)
│   ├── ProblemCounter.tsx            # Problems solved display (Story 4.2)
│   ├── CelebrationAnimation.tsx      # Confetti wrapper (Story 4.3)
│   └── ImageUpload.tsx               # Image upload UI (Story 3.2)
│
├── store/
│   ├── chat.ts                       # Conversation state, mode, loading (Story 1.2, 2.1)
│   └── gamification.ts               # Streaks, counters with persist middleware (Story 4.1, 4.2)
│
├── lib/
│   ├── api-response.ts               # ApiResponse<T> type definition
│   ├── error-codes.ts                # ErrorCode enum
│   ├── error-messages.ts             # User-facing error messages
│   ├── logger.ts                     # Structured logging utility
│   ├── retry.ts                      # retryWithBackoff helper
│   ├── date-utils.ts                 # Date/time helpers for streaks
│   └── prompts.ts                    # Socratic system prompts (Story 1.4, 2.2)
│
├── types/
│   └── index.ts                      # Shared TypeScript types (Message, Mode, etc.)
│
├── public/                           # Static assets
│
├── .env.local                        # Environment variables (NOT in git)
├── .gitignore
├── package.json
├── tsconfig.json                     # TypeScript config with @ alias
├── tailwind.config.ts                # Tailwind configuration
├── next.config.js                    # Next.js configuration
├── README.md                         # Project documentation (Story 5.2)
└── docs/
    ├── PRD.md                        # Product requirements
    ├── epics/                        # Epic breakdown (sharded)
    │   ├── epic-1-core-chat-infrastructure.md
    │   ├── epic-2-scaffolded-socratic-dialogue.md
    │   ├── epic-3-problem-input-math-rendering.md
    │   ├── epic-4-gamification-polish.md
    │   └── epic-5-testing-documentation-deployment.md
    ├── architecture.md               # This document
    ├── prompts.md                    # Prompt engineering notes (Story 5.2)
    └── test-results.md               # Testing documentation (Story 5.1)
```

**Directory Ownership by Epic:**
- **Epic 1:** `app/page.tsx`, `app/api/chat/`, `components/Chat*.tsx`, `components/Message*.tsx`, `store/chat.ts`
- **Epic 2:** `lib/prompts.ts`, `components/ModeSelector.tsx`, `components/ConfusedButton.tsx`
- **Epic 3:** `app/api/ocr/`, `components/ImageUpload.tsx`, KaTeX integration in `components/Message.tsx`
- **Epic 4:** `store/gamification.ts`, `components/Streak*.tsx`, `components/Problem*.tsx`, `components/Celebration*.tsx`
- **Epic 5:** `docs/` (documentation), deployment configs

## Epic to Architecture Mapping

| Epic | Primary Components | Key Technologies | API Routes | State Management |
|------|-------------------|------------------|------------|------------------|
| **Epic 1: Core Chat Infrastructure** | ChatContainer<br>MessageList<br>MessageInput<br>Message | Next.js 15<br>Zustand<br>OpenAI SDK<br>TypeScript | `/api/chat` | `useChatStore`<br>(messages, loading) |
| **Epic 2: Scaffolded Socratic Dialogue** | ModeSelector<br>ConfusedButton<br>Prompt engineering in `/lib/prompts.ts` | OpenAI GPT-4<br>Mode-aware prompts<br>Streaming responses | `/api/chat` (enhanced) | `useChatStore`<br>(mode selection) |
| **Epic 3: Problem Input & Math Rendering** | ImageUpload<br>Message (with KaTeX)<br>Text entry in MessageInput | GPT-4 Vision<br>KaTeX 0.16.25<br>Base64 encoding | `/api/ocr` | None (stateless) |
| **Epic 4: Gamification & Polish** | StreakDisplay<br>ProblemCounter<br>CelebrationAnimation<br>Responsive layouts | canvas-confetti<br>Zustand persist<br>localStorage<br>Tailwind responsive | None | `useGamificationStore`<br>(with persist middleware) |
| **Epic 5: Testing & Deployment** | Documentation<br>Test matrix<br>Demo video | Manual testing<br>Vercel deployment<br>GitHub repo | None | None |

---

## Technology Stack Details

### Core Technologies

**Frontend Framework:**
- **Next.js 15.x** - React framework with App Router
  - Server Components for performance
  - API routes for backend logic
  - Built-in image optimization
  - Turbopack for fast builds

**Language & Type Safety:**
- **TypeScript** - Static typing for all code
  - Interfaces for Message, Mode, ApiResponse
  - Strict mode enabled
  - Path aliases (@/) configured

**Styling:**
- **Tailwind CSS 3.x** - Utility-first CSS
  - Responsive design utilities
  - Custom color palette for brand
  - JIT compiler for optimized builds

### LLM & AI Stack

**Primary LLM:**
- **OpenAI SDK 6.2.0** - Official Node.js client
  - Model: `gpt-4` for Socratic dialogue
  - Model: `gpt-4-vision-preview` for OCR
  - Streaming: Enabled via `stream: true`
  - Context: 128K tokens (sufficient for 10+ turn conversations)

**Prompt Engineering:**
- Mode-specific system prompts in `/lib/prompts.ts`
- Worked example generation logic
- "NEVER give direct answers" enforcement
- Retrieval practice guidance

### State Management

**Zustand 5.0.8:**
- **Chat Store** (`store/chat.ts`):
  - Messages array (conversation history)
  - Current mode (homework/exam/explore)
  - Loading states
  - Actions: addMessage, setMode, clearChat

- **Gamification Store** (`store/gamification.ts`):
  - Streak counter (with persist middleware)
  - Total problems solved
  - Weekly problems solved
  - Last used date (for streak calculation)
  - Actions: incrementStreak, incrementProblems, resetWeekly

**Persistence:**
- Zustand persist middleware for gamification
- localStorage key: `zeroai-gamification`
- Automatic sync on state changes

### Math & Rendering

**KaTeX 0.16.25:**
- Fast client-side LaTeX rendering
- Auto-render extension for automatic detection
- Supports: fractions, exponents, radicals, integrals
- Fallback: Display raw LaTeX if rendering fails

**canvas-confetti 1.9.4:**
- Celebration animations for problem completion
- Configurable duration (2-3 seconds)
- Non-blocking (doesn't interrupt interaction)

### Integration Points

**OpenAI API Integration:**
```typescript
// app/api/chat/route.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages, mode } = await req.json();

  const systemPrompt = SOCRATIC_PROMPTS[mode]; // Mode-aware prompt

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    stream: true,
    temperature: 0.7,
  });

  return new Response(stream); // Streaming response
}
```

**GPT-4 Vision Integration:**
```typescript
// app/api/ocr/route.ts
import { OpenAI } from 'openai';

export async function POST(req: Request) {
  const { image } = await req.json(); // base64 string

  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Extract the math problem from this image. Return only the problem text.' },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${image}` } }
      ]
    }]
  });

  return Response.json({
    success: true,
    data: { problem: response.choices[0].message.content }
  });
}
```

**localStorage Integration:**
```typescript
// store/gamification.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGamificationStore = create(
  persist(
    (set) => ({
      streak: 0,
      totalProblems: 0,
      lastUsedDate: null,
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
    }),
    { name: 'zeroai-gamification' } // localStorage key
  )
);
```

---

## Novel Pattern: Context-Aware Socratic Prompting

**Challenge:** Students need different tutoring approaches based on urgency (homework deadline vs. exploration).

**Solution:** Mode-aware system prompts with adjusted question density and scaffolding timing.

**Implementation:**

```typescript
// lib/prompts.ts
export const SOCRATIC_PROMPTS = {
  homework: `You are a patient math tutor helping a student with homework.

CRITICAL RULES:
- NEVER give direct answers
- Guide through 2-3 questions per concept (efficient pacing)
- If stuck >2 turns, provide worked example of SIMILAR problem
- Tone: "Let's work through this efficiently"

Example: Student solving 2x + 5 = 13
You: "What operation undoes adding 5?"
Student: "Subtracting?"
You: "Exactly! What do we get when we subtract 5 from both sides?"`,

  exam: `You are a quick-review math tutor for test prep.

CRITICAL RULES:
- NEVER give direct answers
- Guide through 1-2 questions per concept (fast-paced)
- Assume baseline mastery, minimal hints
- If stuck >2 turns, provide worked example briefly
- Tone: "Quick review - you've got this!"`,

  explore: `You are a patient math tutor for deep learning.

CRITICAL RULES:
- NEVER give direct answers
- Guide through 5-7 questions per concept (patient, thorough)
- Encourage "why" questions
- If stuck >3 turns, provide detailed worked example
- Tone: "Let's explore this deeply - take your time"`,
};
```

**Affects Stories:** 1.4, 2.2, 2.3

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents working on the 17 stories:

### 1. File Naming Pattern

**Components** (PascalCase):
```
components/ChatContainer.tsx
components/MessageList.tsx
components/ModeSelector.tsx
```

**Utilities/Lib** (kebab-case):
```
lib/api-response.ts
lib/error-messages.ts
lib/date-utils.ts
```

**API Routes** (kebab-case):
```
app/api/chat/route.ts
app/api/ocr/route.ts
```

**Stores** (kebab-case):
```
store/chat.ts
store/gamification.ts
```

### 2. Component Structure Pattern

**ALL components must start with 'use client' directive:**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/chat';

interface MessageListProps {
  className?: string;
}

export function MessageList({ className }: MessageListProps) {
  const messages = useChatStore(state => state.messages);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {messages.map(msg => (
        <Message key={msg.id} {...msg} />
      ))}
    </div>
  );
}
```

**Pattern Requirements:**
- ✅ 'use client' on first line
- ✅ Explicit props interface
- ✅ Named export (not default)
- ✅ Zustand selector pattern: `useChatStore(state => state.messages)`

### 3. API Route Pattern

**ALL API routes follow this structure:**

```typescript
// app/api/chat/route.ts
import { OpenAI } from 'openai';
import { retryWithBackoff } from '@/lib/retry';
import { log, LogLevel } from '@/lib/logger';
import { ApiResponse } from '@/lib/api-response';
import { ErrorCode, ERROR_MESSAGES } from '@/lib/error-messages';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, mode } = await req.json();

    // Log request
    log(LogLevel.INFO, 'API:Chat', 'Request received', { mode, messageCount: messages.length });

    // Call OpenAI with retry
    const response = await retryWithBackoff(
      () => openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: SOCRATIC_PROMPTS[mode] },
          ...messages
        ],
        stream: true,
      }),
      { maxRetries: 1 }
    );

    // Log success
    log(LogLevel.INFO, 'API:Chat', 'Success', { tokens: response.usage?.total_tokens });

    return new Response(response); // Streaming response

  } catch (error) {
    // Log error
    log(LogLevel.ERROR, 'API:Chat', 'Failed', { error: error.message });

    // Return structured error
    return Response.json({
      success: false,
      error: {
        code: ErrorCode.LLM_TIMEOUT,
        message: ERROR_MESSAGES[ErrorCode.LLM_TIMEOUT],
        recoverable: true
      }
    }, { status: 500 });
  }
}
```

**Pattern Requirements:**
- ✅ Import OpenAI SDK
- ✅ Use retryWithBackoff for API calls
- ✅ Log requests and responses
- ✅ Return ApiResponse format on errors
- ✅ Try/catch around all operations

### 4. Zustand Store Pattern

```typescript
// store/chat.ts
'use client';

import { create } from 'zustand';

export type Mode = 'homework' | 'exam' | 'explore';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatState {
  // State properties
  messages: Message[];
  mode: Mode;
  isLoading: boolean;

  // Actions
  addMessage: (message: Message) => void;
  setMode: (mode: Mode) => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // Initial state
  messages: [],
  mode: 'homework',
  isLoading: false,

  // Actions (use arrow functions)
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  setMode: (mode) => set({ mode }),

  setLoading: (loading) => set({ isLoading: loading }),

  clearChat: () => set({ messages: [] }),
}));
```

**With Persistence (for gamification):**

```typescript
// store/gamification.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GamificationState {
  streak: number;
  totalProblems: number;
  weeklyProblems: number;
  lastUsedDate: string | null;

  incrementStreak: () => void;
  incrementProblems: () => void;
  resetWeekly: () => void;
}

export const useGamificationStore = create(
  persist<GamificationState>(
    (set) => ({
      streak: 0,
      totalProblems: 0,
      weeklyProblems: 0,
      lastUsedDate: null,

      incrementStreak: () => set((state) => ({
        streak: state.streak + 1,
        lastUsedDate: new Date().toISOString()
      })),

      incrementProblems: () => set((state) => ({
        totalProblems: state.totalProblems + 1,
        weeklyProblems: state.weeklyProblems + 1
      })),

      resetWeekly: () => set({ weeklyProblems: 0 }),
    }),
    {
      name: 'zeroai-gamification', // localStorage key
    }
  )
);
```

### 5. Import Pattern

**Import Order:**
```typescript
// 1. React/Next imports
import { useState, useEffect } from 'react';
import Link from 'next/link';

// 2. Third-party libraries
import { create } from 'zustand';
import katex from 'katex';

// 3. Internal imports with @ alias
import { useChatStore } from '@/store/chat';
import { Message } from '@/components/Message';
import { ApiResponse } from '@/lib/api-response';

// 4. Relative imports (rare, avoid if possible)
import { helper } from './helper';
```

**tsconfig.json configuration:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 6. Styling Pattern (Tailwind)

**Consistent Utility Usage:**
```typescript
// ✅ Use consistent spacing scale
<div className="p-4 m-2 gap-3">

// ✅ Semantic color names
<button className="bg-blue-600 hover:bg-blue-700 text-white">
<div className="bg-red-50 border border-red-200 text-red-800">

// ✅ Consistent border radius
<div className="rounded-lg">  // Cards, modals
<input className="rounded-md">  // Inputs, buttons

// ✅ Responsive patterns
<div className="flex flex-col md:flex-row">
<p className="text-sm md:text-base lg:text-lg">
```

**No inline styles or CSS modules - Tailwind only**

---

## Consistency Rules

### Naming Conventions

**Variables & Functions:**
```typescript
// ✅ Variables: camelCase
const messageList = [];
const currentMode = 'homework';
const isLoading = false;

// ✅ Functions: camelCase, verb-first
function addMessage(msg: Message) {}
function sendToLLM(messages: Message[]) {}
function handleSubmit() {}

// ✅ Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 2;
const DEFAULT_MODE = 'homework';
const API_TIMEOUT = 30000;

// ✅ Types/Interfaces: PascalCase
interface Message {}
type ApiResponse<T> = {};
enum ErrorCode {}
```

**Boolean Variables:**
```typescript
// ✅ Prefix with is/has/should
const isLoading = true;
const hasError = false;
const shouldRetry = true;
```

### Code Organization

**Folder Structure Rules:**
- ✅ NO new top-level directories beyond: `app/`, `components/`, `store/`, `lib/`, `types/`, `public/`, `docs/`
- ✅ Components stay in `/components` (no nested folders)
- ✅ Utilities stay in `/lib` (no nested folders)
- ✅ All API routes in `/app/api/[route]/route.ts`

**File Organization Within Files:**
```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Main component/function
// 5. Helper functions (if small)
// 6. Exports
```

### Error Handling

**Standardized Error Response:**
```typescript
// lib/api-response.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
    recoverable: boolean;
  };
}

// lib/error-codes.ts
export enum ErrorCode {
  LLM_TIMEOUT = 'LLM_TIMEOUT',
  LLM_RATE_LIMIT = 'LLM_RATE_LIMIT',
  OCR_FAILED = 'OCR_FAILED',
  OCR_IMAGE_UNCLEAR = 'OCR_IMAGE_UNCLEAR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  KATEX_RENDER_ERROR = 'KATEX_RENDER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// lib/error-messages.ts
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.LLM_TIMEOUT]: "The AI tutor is taking longer than usual. Please try again.",
  [ErrorCode.LLM_RATE_LIMIT]: "Too many questions at once! Please wait a moment and try again.",
  [ErrorCode.OCR_FAILED]: "Couldn't read the image. Please try typing the problem or upload a clearer photo.",
  [ErrorCode.OCR_IMAGE_UNCLEAR]: "The image is a bit unclear. Try better lighting or type the problem instead.",
  [ErrorCode.NETWORK_ERROR]: "Connection issue. Check your internet and try again.",
  [ErrorCode.KATEX_RENDER_ERROR]: "Math display issue. Showing text version instead.",
  [ErrorCode.UNKNOWN_ERROR]: "Something went wrong. Please try again or refresh the page.",
};
```

**Retry Logic:**
```typescript
// lib/retry.ts
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries: number;
    initialDelay: number;
    maxDelay: number;
  } = {
    maxRetries: 2,
    initialDelay: 1000,
    maxDelay: 5000,
  }
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < options.maxRetries) {
        const delay = Math.min(
          options.initialDelay * Math.pow(2, attempt),
          options.maxDelay
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
```

**Usage in Components:**
```typescript
// Always preserve state on errors
const sendMessage = async (text: string) => {
  const userMsg = { id: nanoid(), role: 'user', content: text, timestamp: Date.now() };
  addMessage(userMsg); // Add optimistically
  setLoading(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, userMsg], mode }),
    });

    const data: ApiResponse<{ message: Message }> = await response.json();

    if (data.success) {
      addMessage(data.data!.message);
    } else {
      // State already preserved (userMsg still in store)
      toast.error(data.error!.message);
    }
  } catch (error) {
    // Network error - state still preserved
    toast.error(ERROR_MESSAGES[ErrorCode.NETWORK_ERROR]);
  } finally {
    setLoading(false);
  }
};
```

### Logging Strategy

**Structured Logging:**
```typescript
// lib/logger.ts
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

export function log(
  level: LogLevel,
  context: string,
  message: string,
  data?: Record<string, any>
) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    context,
    message,
    ...(data && { data }),
  };

  // Only log in development or if error
  if (process.env.NODE_ENV === 'development' || level === LogLevel.ERROR) {
    console.log(JSON.stringify(logEntry));
  }
}

// Usage
log(LogLevel.INFO, 'API:Chat', 'Request received', { mode: 'homework', messageCount: 5 });
log(LogLevel.ERROR, 'API:OCR', 'Image processing failed', { errorCode: 'OCR_FAILED', imageSize: 2048 });
```

**What to Log:**
- ✅ API requests (context: mode, problem type)
- ✅ LLM responses (token count, latency)
- ✅ Errors (full context for debugging)
- ✅ OCR attempts (success/failure, image size)
- ❌ NO student content (privacy)
- ❌ NO API keys or secrets

## Data Architecture

### Core Data Models

**Message:**
```typescript
// types/index.ts
export interface Message {
  id: string;            // nanoid() generated
  role: 'user' | 'assistant';
  content: string;       // Plain text or LaTeX-formatted
  timestamp: number;     // Date.now()
}
```

**Mode:**
```typescript
export type Mode = 'homework' | 'exam' | 'explore';
```

**Gamification Data:**
```typescript
export interface GamificationData {
  streak: number;              // Current daily streak
  totalProblems: number;       // Lifetime problems solved
  weeklyProblems: number;      // This week's problems
  lastUsedDate: string | null; // ISO date string for streak calculation
}
```

### Data Flow

**Chat Flow:**
```
1. User types message in MessageInput
2. MessageInput calls addMessage() → Zustand store
3. Component triggers fetch('/api/chat') with messages + mode
4. API route calls OpenAI with mode-specific prompt
5. Streaming response → chunks added to UI
6. Complete message → addMessage() → store
```

**OCR Flow:**
```
1. User uploads image in ImageUpload
2. Image converted to base64
3. fetch('/api/ocr') with base64 image
4. API route calls GPT-4 Vision
5. Extracted text → populate MessageInput
6. Student proceeds with text-based flow
```

**Gamification Flow:**
```
1. App load → useGamificationStore hydrates from localStorage
2. Check lastUsedDate vs today → update streak if new day
3. Problem solved → incrementProblems() → auto-persists
4. Celebration animation triggers
5. Weekly reset checked on Monday 00:00
```

### Data Persistence

**localStorage (via Zustand persist):**
```json
{
  "zeroai-gamification": {
    "state": {
      "streak": 5,
      "totalProblems": 23,
      "weeklyProblems": 7,
      "lastUsedDate": "2025-11-03T00:00:00.000Z"
    },
    "version": 0
  }
}
```

**In-Memory (Zustand, cleared on refresh):**
- Conversation messages (intentionally not persisted for privacy)
- Current mode
- Loading states

---

## API Contracts

### POST /api/chat

**Purpose:** Socratic dialogue with mode-aware prompting

**Request:**
```typescript
{
  messages: Message[],  // Conversation history (last 10)
  mode: Mode            // 'homework' | 'exam' | 'explore'
}
```

**Response (Success):**
```typescript
// Streaming response (Server-Sent Events)
ReadableStream<string>  // Chunks of AI response
```

**Response (Error):**
```typescript
{
  success: false,
  error: {
    code: 'LLM_TIMEOUT' | 'LLM_RATE_LIMIT' | 'UNKNOWN_ERROR',
    message: string,  // User-friendly message
    recoverable: boolean
  }
}
```

**Performance:**
- Target: <3s for first token
- Max: 30s total response time
- Retry: Once with 1s delay

---

### POST /api/ocr

**Purpose:** Extract math problem from image

**Request:**
```typescript
{
  image: string  // base64-encoded image (JPG, PNG)
}
```

**Response (Success):**
```typescript
{
  success: true,
  data: {
    problem: string  // Extracted math problem text
  }
}
```

**Response (Error):**
```typescript
{
  success: false,
  error: {
    code: 'OCR_FAILED' | 'OCR_IMAGE_UNCLEAR' | 'OCR_NO_MATH_DETECTED',
    message: string,
    recoverable: true
  }
}
```

**Performance:**
- Target: <5s
- Max file size: 10MB
- Retry: Once with 1s delay

---

## Security Architecture

### API Key Management

**Development:**
```bash
# .env.local (NOT committed)
OPENAI_API_KEY=sk-...
NODE_ENV=development
```

**Production (Vercel):**
- Environment variables set in Vercel dashboard
- Never exposed to client-side code
- API routes run server-side only

### Client-Side Security

**No Sensitive Data:**
- ❌ No API keys in client code
- ❌ No student content logged server-side
- ❌ No PII collected

**Rate Limiting:**
- Rely on OpenAI's built-in rate limits (tier 1: 10K tokens/min)
- No additional rate limiting needed for MVP
- Consider Vercel Edge Rate Limiting for production

### Data Privacy

**Conversation Privacy:**
- Messages NOT persisted to database
- Messages cleared on page refresh
- Only gamification data in localStorage (no content)

**Compliance:**
- No COPPA concerns (no user accounts, no PII collection)
- FERPA not applicable (no educational records stored)
- GDPR compliant (no personal data collected)

---

## Performance Considerations

### LLM Response Time

**Optimization Strategies:**
1. **Streaming:** Enable `stream: true` for perceived faster responses
2. **Context Management:** Only send last 10 messages (reduce token count)
3. **Model Selection:** Use `gpt-4` (not `gpt-4-32k`) for faster responses
4. **Retry Logic:** Max 1 retry to avoid long waits

**Targets:**
- First token: <3s
- Total response: <30s
- 95th percentile: <5s first token

### Image Processing

**Optimization Strategies:**
1. **Client-side Resize:** Resize large images to max 2048px before upload
2. **Compression:** Convert to JPEG with 80% quality
3. **Async Processing:** Show loading state immediately

**Targets:**
- Upload + OCR: <5s
- Max file size: 10MB
- Focus: Printed text (90%+ accuracy)

### Frontend Performance

**Optimization Strategies:**
1. **Code Splitting:** Next.js automatic with App Router
2. **Image Optimization:** Use `next/image` for static assets
3. **Lazy Loading:** KaTeX loaded only when needed
4. **Memoization:** React.memo for MessageList items

**Targets:**
- Initial page load: <2s
- Time to Interactive: <3s
- Lighthouse score: >90

---

## Deployment Architecture

### Platform: Vercel

**Why Vercel:**
- ✅ Next.js 15 optimized
- ✅ Edge functions for global performance
- ✅ Automatic HTTPS + CDN
- ✅ GitHub integration (auto-deploy on push)
- ✅ Preview deployments for testing
- ✅ Free tier: 100GB bandwidth, unlimited requests

### Deployment Process

**Initial Setup:**
1. Push code to GitHub repository
2. Connect Vercel to repo (vercel.com/new)
3. Configure environment variables:
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`
4. Deploy: `vercel --prod`

**Continuous Deployment:**
- Push to `main` branch → auto-deploy to production
- Pull requests → preview deployments

**Domain:**
- Default: `zeroai.vercel.app`
- Custom: (optional for production)

### Environment Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Increase body size limit for image uploads
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },

  // Enable Edge Runtime for API routes
  experimental: {
    runtime: 'edge',
  },
};

module.exports = nextConfig;
```

### Monitoring

**Vercel Analytics (Free Tier):**
- Page views
- API route performance
- Error tracking
- Real-time logs

**OpenAI Usage Dashboard:**
- Token consumption
- Cost tracking
- Rate limit monitoring

---

## Development Environment

### Prerequisites

**Required:**
- **Node.js:** 18.x or higher ([nodejs.org](https://nodejs.org))
- **npm:** 9.x or higher (comes with Node.js)
- **Git:** Latest version
- **OpenAI API Key:** Get from [platform.openai.com](https://platform.openai.com)

**Recommended:**
- **VS Code:** Latest version
  - Extensions: ESLint, Prettier, Tailwind CSS IntelliSense, TypeScript
- **Browser:** Chrome/Edge (for DevTools)

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd zeroai

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your API key to .env.local
# OPENAI_API_KEY=sk-...

# Run development server
npm run dev

# Open http://localhost:3000
```

### Development Commands

```bash
# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Start production server locally
npm run start

# Lint code
npm run lint

# Format code (if Prettier configured)
npm run format
```

### Browser Testing

**Primary:**
- Chrome 120+ (latest)
- Responsive mode: iPad Pro (1024x1366)

**Secondary:**
- Safari 17+ (macOS)
- Firefox 121+ (latest)

**Mobile (Future):**
- iOS Safari (iPhone 13+)
- Chrome Mobile (Android)

---

## Architecture Decision Records (ADRs)

### ADR-001: Next.js 15 with App Router

**Status:** Accepted

**Context:** Need modern React framework for 5-day timeline.

**Decision:** Use Next.js 15 with App Router (not Pages Router).

**Rationale:**
- App Router is the future of Next.js (stable in v15)
- Server Components reduce client bundle size
- API routes co-located with frontend
- Vercel deployment optimized
- TypeScript + Tailwind included by default

**Consequences:**
- ✅ Faster development (official starter)
- ✅ Better performance (Server Components)
- ⚠️ All components need 'use client' directive for interactivity

---

### ADR-002: Zustand over Context API

**Status:** Accepted

**Context:** Need state management for chat + gamification.

**Decision:** Use Zustand with persist middleware.

**Rationale:**
- localStorage persistence built-in (critical for streaks)
- Fine-grained subscriptions (performance)
- Simpler than Redux (5-day timeline)
- Well-documented for Next.js 15
- Only 1KB overhead

**Consequences:**
- ✅ Automatic localStorage sync
- ✅ Less boilerplate than Context
- ✅ DevTools support
- ⚠️ Must use 'use client' (same as Context)

---

### ADR-003: GPT-4 Vision for OCR (not Google Cloud Vision)

**Status:** Accepted

**Context:** Need OCR for image problem extraction.

**Decision:** Use GPT-4 Vision API (not separate OCR service).

**Rationale:**
- Same API as Socratic dialogue (unified billing)
- Understands mathematical notation
- Can extract + interpret simultaneously
- Simpler architecture (one provider)
- Good enough for printed text (90%+ accuracy)

**Consequences:**
- ✅ Simpler integration
- ✅ One API key to manage
- ⚠️ Slightly higher cost than dedicated OCR
- ⚠️ Handwritten accuracy lower (70% vs 85% with specialized)

---

### ADR-004: Manual Testing Only (No Automated Tests in MVP)

**Status:** Accepted

**Context:** 5-day timeline with 17 stories.

**Decision:** Manual testing with documented test matrix. No Jest/Cypress/Playwright.

**Rationale:**
- Writing tests takes 30-40% of development time
- 5-day timeline is already aggressive
- Test matrix (30 cases) provides good coverage
- Gauntlet judges test manually anyway

**Consequences:**
- ✅ Faster development
- ✅ Focus on features over test infrastructure
- ⚠️ Bugs may slip through (mitigated by thorough manual testing)
- ⚠️ No CI/CD test automation

---

### ADR-005: Client-Side Timezone for Streaks

**Status:** Accepted

**Context:** Need timezone handling for daily streak tracking.

**Decision:** Use client-side local timezone (not UTC).

**Rationale:**
- Simpler implementation (no server-side timezone logic)
- More intuitive for students (matches their local time)
- Streaks are personal (doesn't matter if traveling)
- localStorage already client-side

**Consequences:**
- ✅ Simpler code
- ✅ Works offline
- ⚠️ Streak resets at midnight local time (could be gamed if traveling)

---

## Critical Consistency Rules (Must Follow)

**Every AI agent implementing a story MUST:**

1. ✅ **Name files correctly:**
   - Components: PascalCase (ChatContainer.tsx)
   - Lib/Utils: kebab-case (api-response.ts)

2. ✅ **Start all components with 'use client';**

3. ✅ **Return ApiResponse<T> from ALL API routes**

4. ✅ **Use Zustand stores (not useState) for shared state**

5. ✅ **Use @ imports for all internal modules**
   - `import { useChatStore } from '@/store/chat';`

6. ✅ **Use Tailwind utility classes (no inline styles, no CSS modules)**

7. ✅ **Wrap API calls in try/catch with structured errors**

8. ✅ **Log errors with `log(LogLevel.ERROR, context, message, data)`**

9. ✅ **Use retryWithBackoff for OpenAI API calls**

10. ✅ **Follow the project structure exactly** (no new top-level directories)

**These rules prevent conflicts across all 17 stories.**

---

## Next Steps

**After architecture approval:**

1. ✅ Run solutioning gate check: `/BMad:bmm:workflows:solutioning-gate-check`
2. ✅ Initialize sprint tracking: `/BMad:bmm:workflows:sprint-planning`
3. ✅ Start Story 1.1: Basic Web App Setup

**Architecture is ready to guide consistent implementation across all AI agents.**

---

_Generated by BMAD Decision Architecture Workflow v1.3.2_
_Date: November 3, 2025_
_For: Reena_
_Project: zeroai - AI Math Tutor (Gauntlet C3)_
