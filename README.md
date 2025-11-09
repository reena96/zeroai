# ZeroAI - Adaptive Socratic Math Tutor

An AI-powered math tutor that guides K-12 students through problems using **Socratic questioning** and **adaptive scaffolding**. Built with Next.js 15, OpenAI GPT-4, and modern UX patterns inspired by Khan Academy's Khanmigo.

---

## Features

### Core Learning System
- **Socratic Dialogue**: Never gives direct answers - guides students through questions and hints
- **Adaptive Mastery Engine**: Detects struggle patterns and adjusts scaffolding automatically
- **Intelligent Struggle Detection**: LLM analyzes student responses to determine when help is needed
- **Worked Example Scaffolding**: Provides similar problem demonstrations when students get stuck

### Context-Aware Learning Modes
- **Homework Help**: Efficient pacing (2-3 questions per concept)
- **Exam Prep**: Quick review mode (1-2 questions per concept)
- **Exploration**: Deep patient guidance (5-7 questions per concept)

### Problem Input & Rendering
- **Text Input**: Natural language problem entry ("solve 2x + 5 = 13")
- **Image Upload**: OCR/Vision LLM parsing for handwritten or screenshot problems
- **Beautiful Math Rendering**: KaTeX integration for equations and expressions

### Gamification & Engagement
- **Daily Streak Tracker**: Encourages consistent practice habits
- **Problems Solved Counter**: Tracks progress with milestone celebrations
- **Celebration Animations**: Confetti effects and toast messages for achievements
- **"I'm Really Confused" Button**: Student-initiated help request (appears when contextually relevant)

### Technical Features
- **Math Validation**: Pre-validates LLM responses using math.js and Wolfram Alpha fallback
- **Student Answer Verification**: Automatically validates student responses for correctness
- **Streaming Responses**: Real-time chat experience with character-by-character streaming
- **Conversation State Management**: Zustand-powered state with metadata tracking

---

## Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (React 18, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Math Rendering**: [KaTeX](https://katex.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: Canvas Confetti

### Backend
- **API**: Next.js API Routes (serverless)
- **LLM**: OpenAI GPT-4 (with streaming)
- **Math Validation**: math.js, Wolfram Alpha API
- **Image Processing**: OpenAI Vision API (GPT-4 Vision)

### Development
- **Package Manager**: npm
- **Linting**: ESLint (Next.js config)
- **Type Checking**: TypeScript 5

---

## Setup

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- (Optional) Wolfram Alpha App ID for enhanced math validation

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/reena96/zeroai.git
   cd zeroai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   WOLFRAM_APP_ID=your_wolfram_app_id_here  # Optional
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
zeroai/
├── app/                      # Next.js 15 App Router
│   ├── api/chat/            # Chat API endpoint (streaming)
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── ChatContainer.tsx    # Main chat interface
│   ├── Message.tsx          # Individual message display
│   ├── MessageInput.tsx     # User input with image upload
│   ├── ModeSelector.tsx     # Learning mode selection
│   ├── ModeIndicator.tsx    # Active mode badge
│   ├── ConfusedButton.tsx   # Help request button
│   ├── MathText.tsx         # KaTeX math renderer
│   ├── ImageUpload.tsx      # OCR image upload
│   ├── StreakTracker.tsx    # Daily streak display
│   ├── ProblemCounter.tsx   # Problems solved counter
│   └── CelebrationToast.tsx # Achievement notifications
├── store/                   # Zustand state stores
│   ├── chat.ts             # Chat state + metadata
│   └── gamification.ts     # Streak/counter state
├── lib/                     # Utility libraries
│   ├── prompts.ts          # Socratic system prompts
│   ├── math-validator.ts   # Math validation logic
│   └── celebration.ts      # Confetti/toast helpers
├── docs/                    # Documentation
│   ├── architecture.md     # System design
│   ├── prd.md             # Product requirements
│   ├── sprint-status.yaml  # Development tracking
│   └── validation/        # Testing guides
└── public/                 # Static assets
```

---

## Usage Examples

### Basic Problem Solving

1. **Select learning mode** (Homework Help, Exam Prep, or Exploration)
2. **Type or upload a problem**:
   - Text: "Solve for x: 2x + 5 = 13"
   - Image: Upload screenshot of handwritten problem
3. **Engage in Socratic dialogue** - answer AI's guiding questions
4. **Request help if stuck** - click "I'm really confused" button for worked examples
5. **Celebrate achievements** - watch your streak and problem counter grow!

### Example Conversation Flow

```
Student: "Solve for x: 2x + 5 = 13"

AI: "I see you want to solve 2x + 5 = 13. Let's work through this together!
     What operation could you do to undo the '+5'?"

Student: "subtract 5?"

AI: "Exactly! If we subtract 5 from both sides, what do we get?"

Student: "2x = 8"

AI: "Perfect! Now we have 2x = 8. What should we do next to find x?"

Student: "divide by 2"

AI: "That's right! So x = 4.
     Quick check: 2(4) + 5 = 8 + 5 = 13 ✓
     Great work! 🎉"
```

---

## Key Features Deep Dive

### Intelligent Struggle Detection

The system uses LLM-generated metadata markers to detect when students are struggling:

- **[STRUGGLE:true]**: Student makes 2+ wrong attempts, shows confusion
- **[STRUGGLE:false]**: Student demonstrates understanding, correct reasoning

This enables the "I'm really confused" button to appear only when contextually relevant.

### Adaptive Mastery Principles

Based on [Math Academy](https://mathacademy.com/) methodology:

1. **Mastery Gate**: Don't advance until current skill is demonstrated
2. **Prerequisite Backtrack**: If same error repeats 2x, remediate foundation
3. **Hint Ladder**: Escalating support (Conceptual Cue → Procedural Nudge → Worked Step)
4. **Verification**: Always check final answers with micro-validation

### Mode-Aware Prompting

Different pacing for different contexts:

| Mode | Questions/Concept | Scaffolding Trigger | Tone |
|------|-------------------|---------------------|------|
| Homework Help | 2-3 | After 2 errors | Efficient but thorough |
| Exam Prep | 1-2 | After 2 errors | Quick review |
| Exploration | 5-7 | After 3 errors | Patient, deep |

---

## Development Roadmap

### Completed (Epics 1-4)
- ✅ Core chat infrastructure
- ✅ Scaffolded Socratic dialogue
- ✅ Problem input & math rendering
- ✅ Gamification & polish

### Planned (Epic 5+)
- 🚧 AI-generated visual explanations (diagrams, animations)
- 🚧 Interactive whiteboard with step-by-step visualization
- 🚧 Voice interface (text-to-speech + speech-to-text)
- 🚧 Problem generation (create similar practice problems)

---

## Testing

### Manual Testing
See `docs/validation/epic2_validation.md` for comprehensive test scenarios.

### Test Coverage Areas
- Simple arithmetic, algebra, geometry
- Word problems, multi-step problems
- Mode switching and adaptive pacing
- Image upload and OCR accuracy
- Streak/counter persistence

---

## Contributing

This is a project submission for the Gauntlet C3 AI Builders Program. For questions or collaboration:

**Contact**: reena96 (GitHub)

---

## Evaluation Criteria Alignment

This project addresses the following evaluation criteria:

- **Pedagogical Quality (35%)**: Genuine Socratic guidance with adaptive scaffolding
- **Technical Implementation (30%)**: Production-ready Next.js app with streaming, validation, and state management
- **User Experience (20%)**: Intuitive modes, beautiful math rendering, gamification
- **Innovation (15%)**: Intelligent struggle detection, LLM-driven adaptive learning, context-aware prompting

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

- Inspired by [OpenAI x Khan Academy Khanmigo](https://www.youtube.com/watch?v=IvXZCocyU_M)
- Socratic methodology from [Math Academy](https://mathacademy.com/)
- Built with [Claude Code](https://claude.com/claude-code)
