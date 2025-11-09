# Epic 6: Voice Interface & Accessibility (Hands-Free Learning)

**Goal:** Enable students to interact with the AI tutor using voice input and receive spoken responses, making math learning accessible and hands-free.

**Why This:** Accessibility for students with visual impairments or learning disabilities, hands-free interaction while working on paper, appeals to auditory learners, differentiates from competitors.

**Value:** Opens product to broader audience, enables multitasking (listen while writing solutions), accessibility compliance, unique UX that feels like talking to a real tutor.

**Estimated Effort:** 1-2 days (using Web Speech API - browser native, no backend)

**Stories:** 2-3 stories

---

## Story 6.1: Text-to-Speech for AI Responses

As a student,
I want to hear the AI tutor's responses read aloud,
So that I can listen while writing solutions on paper.

**Acceptance Criteria:**
1. Toggle button added to enable/disable voice mode ("🔊 Voice Mode")
2. Web Speech API SpeechSynthesis integrated
3. AI responses automatically read aloud when voice mode enabled
4. Voice playback controls: Play, Pause, Stop
5. Volume control slider (0-100%)
6. Voice speed control (0.5x - 2x)
7. Voice selection dropdown (browser available voices)
8. Preference saved in localStorage
9. Visual indicator shows when AI is speaking (animated sound icon)
10. Works on Chrome, Safari, Edge (90%+ browser coverage)
11. Graceful fallback message if browser doesn't support API

**Prerequisites:** None (builds on existing chat system)

**Technical Notes:**
- Use Browser Web Speech API SpeechSynthesis (no external dependencies)
- Implementation: `window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))`
- Popular React wrapper: `react-speech-kit` or native implementation
- Cross-browser support: Chrome (excellent), Safari (good), Firefox (limited)
- Handle math notation: Convert LaTeX to readable text ("x squared" instead of "x^2")
- Chunk long responses to avoid speech synthesis limits
- Cancel ongoing speech when new message arrives

**Research Findings:**
- Web Speech API is free and browser-native (no API costs)
- Chrome has 90+ voices across languages
- React hooks available: `useTextToVoice` from react-speakup
- TTS response time: <100ms (instant)

---

## Story 6.2: Speech-to-Text for Student Input

As a student,
I want to speak my answers instead of typing,
So that I can interact hands-free while working through problems.

**Acceptance Criteria:**
1. Microphone button added to message input ("🎤 Speak")
2. Web Speech API SpeechRecognition integrated
3. Click mic button to start recording (visual indicator: pulsing red)
4. Live transcription shown as user speaks (real-time feedback)
5. Click again to stop recording and send message
6. Auto-stop after 10 seconds of silence
7. Error handling for no microphone permission
8. Works on Chrome, Safari, Edge
9. Graceful fallback to text input if browser doesn't support
10. Visual feedback: "Listening..." indicator, waveform animation
11. Keyboard shortcut: Hold Space to record (release to send)
12. Transcription accuracy >90% for clear speech in quiet environment

**Prerequisites:** None (independent feature)

**Technical Notes:**
- Use Browser Web Speech API SpeechRecognition
- Implementation: `new webkitSpeechRecognition()` (Chrome) or `SpeechRecognition` (standards)
- React wrapper: `react-speech-recognition` package (most popular, 800k+ downloads/week)
- Handle interim results for live transcription preview
- Request microphone permissions on first use
- Cross-browser: Chrome (best), Safari (good), Firefox (NOT supported as of 2024)
- Continuous mode for multi-sentence responses
- Noise cancellation considerations (recommend quiet environment)

**Research Findings:**
- Browser-native API, no backend required
- Chrome SpeechRecognition accuracy: ~85-95% for clear speech
- Real-time streaming transcription (shows words as spoken)
- No character/time limits for free usage
- Popular library: `react-speech-recognition` (Maintained, 1.8k GitHub stars)

---

## Story 6.3: Voice Mode UX Polish & Accessibility

As a student with visual impairment,
I want clear audio cues and keyboard navigation in voice mode,
So that I can use the tutor without seeing the screen.

**Acceptance Criteria:**
1. Audio cues for key actions:
   - "Voice mode enabled" announcement
   - "Listening for your response" when mic active
   - "Processing your answer" when sending
   - "New message from tutor" before reading AI response
2. Keyboard shortcuts for voice mode:
   - `Alt+V`: Toggle voice mode on/off
   - `Alt+M`: Start/stop microphone
   - `Alt+S`: Skip/stop current speech
   - `Alt+R`: Repeat last AI message
3. Screen reader compatibility (ARIA labels)
4. Focus management (keyboard navigation works fully)
5. Visual indicators for non-sighted users (large, high contrast)
6. Settings panel for voice preferences:
   - Default voice selection
   - Default speed (saved)
   - Auto-play AI responses (toggle)
   - Keyboard shortcuts help overlay
7. Error announcements (spoken): "Microphone not available, please check permissions"
8. Voice mode tutorial on first use (optional onboarding)
9. Works with popular screen readers (NVDA, JAWS, VoiceOver)
10. WCAG 2.1 Level AA compliance

**Prerequisites:** Stories 6.1, 6.2 (needs both TTS and STT)

**Technical Notes:**
- ARIA labels: `aria-label`, `aria-live` for announcements
- Focus management: `useRef` + `focus()` after voice actions
- Keyboard event listeners: `useEffect` with event handlers
- Audio cues: Short MP3 beeps or speech synthesis announcements
- High contrast mode: CSS variables for theme switching
- Test with real screen readers (macOS VoiceOver, NVDA on Windows)
- Settings persistence: localStorage
- Tutorial: Optional modal on first voice mode activation

**Accessibility Standards:**
- WCAG 2.1 Level AA guidelines
- Keyboard navigation (all features accessible without mouse)
- Screen reader announcements for state changes
- Sufficient color contrast (4.5:1 minimum)
- Focus indicators visible

---

## Success Checkpoint: After Epic 6

**Validation Criteria:**
- ✅ Student can complete entire problem dialogue using only voice (no typing/clicking)
- ✅ AI responses read aloud naturally (not robotic, math notation clear)
- ✅ Speech recognition accuracy >85% for test phrases in quiet room
- ✅ Voice mode toggle persists across sessions
- ✅ Keyboard shortcuts work for all voice features
- ✅ Screen reader announces all UI changes
- ✅ Works on Chrome and Safari (90%+ browser coverage)
- ✅ Graceful fallback to text mode if browser doesn't support

**Testing Scenarios:**
1. **Hands-Free Math Problem:** Student solves "2x + 5 = 13" entirely through voice
2. **Multitasking:** Listen to AI while writing solution on paper
3. **Accessibility:** Complete session using only keyboard and screen reader
4. **Noisy Environment:** Test STT accuracy with background music (should degrade gracefully)
5. **Browser Compatibility:** Test on Chrome, Safari, Edge
6. **Long Response:** AI gives 3-paragraph worked example, TTS handles correctly

**Known Limitations:**
- Firefox does not support SpeechRecognition (show friendly message)
- Mobile Safari has limited voice selection
- Speech recognition requires internet connection
- Accuracy drops in noisy environments
- Math notation requires text preprocessing (LaTeX → spoken words)

**Deployment Checklist:**
- [ ] Test TTS with all common math symbols (x², √, π, ∑, ∫)
- [ ] Verify microphone permissions prompt is clear
- [ ] Test keyboard shortcuts on macOS and Windows
- [ ] Validate screen reader compatibility with NVDA
- [ ] Add voice mode toggle to settings panel
- [ ] Document browser compatibility in README

---

## Technical Architecture

### Components
- `VoiceModeToggle.tsx` - Enable/disable voice mode
- `TextToSpeech.tsx` - Component wrapping SpeechSynthesis API
- `SpeechToText.tsx` - Component wrapping SpeechRecognition API
- `VoiceControls.tsx` - Playback controls (play, pause, stop, speed, volume)
- `MicrophoneButton.tsx` - Record button with visual feedback
- `VoiceSettingsPanel.tsx` - Voice preferences UI

### State Management
```typescript
interface VoiceState {
  voiceModeEnabled: boolean
  isSpeaking: boolean
  isListening: boolean
  selectedVoice: string
  speechRate: number // 0.5 - 2.0
  volume: number // 0 - 1.0
  autoPlayResponses: boolean
}
```

### Key Libraries
- **Native**: Web Speech API (SpeechSynthesis, SpeechRecognition)
- **React Wrapper (Optional)**: `react-speech-recognition` (850k+ downloads/week)
- **Utility**: `react-speech-kit` for hooks

### Browser Support
| Browser | TTS | STT | Notes |
|---------|-----|-----|-------|
| Chrome  | ✅  | ✅  | Best support, 90+ voices |
| Safari  | ✅  | ✅  | Good support, fewer voices |
| Edge    | ✅  | ✅  | Chromium-based, same as Chrome |
| Firefox | ✅  | ❌  | TTS works, STT not supported |

---

## Why This Epic Matters

**Accessibility Impact:**
- Opens product to visually impaired students (screen reader + voice)
- Supports students with dyslexia (listening easier than reading)
- Helps students with motor impairments (voice input reduces typing)

**UX Differentiation:**
- Khanmigo: Text-only interface
- Photomath: No voice interaction
- Math Academy: No voice features
- **zeroai**: Only Socratic AI tutor with full voice interaction

**Pedagogical Value:**
- Auditory learners benefit from hearing explanations
- Multitasking: Listen to AI while writing solutions
- Reduces screen time (can close eyes and listen)
- Natural conversation feel (like talking to real tutor)

**Technical Benefits:**
- Browser-native API (zero backend cost)
- No external API dependencies
- Works offline (after initial page load)
- Fast response times (<100ms for TTS)

---

**Epic 6 Status:** 📝 Ready for Implementation
**Priority:** HIGH (Quick win, accessibility compliance, unique differentiator)
**Estimated Timeline:** 1-2 days
**Recommended Order:** After Epic 5 (stable base needed), before Epic 9 (whiteboard)
