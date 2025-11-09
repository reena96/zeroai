# Epic 9: Interactive Whiteboard (Visual Math Collaboration)

**Goal:** Provide a shared drawing canvas where students and AI can sketch diagrams, draw graphs, annotate problems visually - especially valuable for geometry and visual problem-solving.

**Why This:** Geometry, graphs, and visual problem-solving need spatial tools. Text-only tutoring fails for "draw triangle ABC" or "sketch y=x²". Whiteboard makes abstract concepts concrete through drawing.

**Value:** Unlocks geometry tutoring, enables visual explanations, appeals to kinesthetic learners (65% of students), creates memorable learning moments. Major differentiation from text-only competitors.

**Estimated Effort:** 2-3 days (canvas library integration, drawing tools, AI annotation)

**Stories:** 3-4 stories

---

## Story 9.1: Basic Drawing Canvas & Tools

As a student solving a geometry problem,
I want to draw shapes and diagrams on a whiteboard,
So that I can visualize the problem and sketch my solution.

**Acceptance Criteria:**
1. Whiteboard canvas component appears when problem type detected as geometry/graphing
2. Drawing tools toolbar:
   - Pen (freehand drawing)
   - Straight line tool
   - Circle/ellipse tool
   - Rectangle tool
   - Text label tool
   - Eraser
3. Tool properties:
   - Color picker (8 colors minimum)
   - Line thickness (thin, medium, thick)
   - Fill vs. stroke toggle
4. Canvas controls:
   - Clear canvas button
   - Undo/Redo (10 steps)
   - Zoom in/out
   - Pan canvas (drag to move)
   - Reset view
5. Grid overlay (toggle on/off) for precise drawing
6. Snap-to-grid option for alignment
7. Mobile-responsive: Touch drawing on tablet
8. Canvas saves state (persists across session)
9. Export as PNG image
10. Keyboard shortcuts:
    - P: Pen tool
    - L: Line tool
    - C: Circle tool
    - E: Eraser
    - Ctrl+Z: Undo
    - Ctrl+Y: Redo

**Prerequisites:** Epics 1-5 (needs problem-solving context)

**Technical Notes:**
- Canvas Library Options:
  - **tldraw** (best for production, React SDK, collaborative features)
  - **Fabric.js** (powerful, most tutorials, good for custom implementations)
  - **Excalidraw** (whiteboard-focused, open-source)
- Recommendation: **Fabric.js** (proven, flexible, 25k+ GitHub stars)
- State: Canvas data serialized to JSON, saved in localStorage
- Mobile: `touch-action: none` for touch drawing
- Export: `canvas.toDataURL()` → download PNG
- Grid: SVG pattern overlay

**Research Findings:**
- Fabric.js most used for React whiteboards (2024)
- tldraw best for collaboration (WebRTC built-in)
- Canvas performance: 60fps for 1000 objects (Fabric.js)

---

## Story 9.2: AI-Assisted Annotations & Explanations

As a student,
I want the AI to annotate my drawings with labels and explanations,
So that I understand what each part represents mathematically.

**Acceptance Criteria:**
1. AI can add annotations to canvas:
   - Text labels (e.g., "Side A", "Angle θ", "Hypotenuse")
   - Arrows pointing to specific parts
   - Measurements (e.g., "10 cm")
   - Formulas (e.g., "A = πr²")
2. AI annotations in different color (e.g., blue) vs. student drawings (black)
3. Socratic annotation flow:
   - Student: Draws triangle
   - AI: "Let's label the sides. Can you mark the longest side?"
   - Student: Clicks to place label
   - AI: Confirms with checkmark annotation
4. Smart geometry recognition:
   - AI detects shapes drawn (triangle, circle, line)
   - Suggests labels automatically: "I see a triangle. Shall we label the sides a, b, c?"
5. Common geometry templates:
   - Right triangle with labels
   - Circle with radius/diameter
   - Coordinate grid
   - Angle diagrams
6. Layering: AI annotations on separate layer (can toggle visibility)
7. Animation: AI draws step-by-step (shows construction process)
8. Works for:
   - Geometry problems (triangles, circles, polygons)
   - Graphing (coordinate planes, functions)
   - Diagrams (Venn diagrams, number lines)
9. Export includes both student + AI layers
10. Accessibility: AI verbally describes what it's drawing

**Prerequisites:** Story 9.1 (needs canvas infrastructure)

**Technical Notes:**
- AI drawing implementation:
  - LLM generates drawing commands (JSON format)
  ```json
  {
    "actions": [
      {"type": "line", "from": [0,0], "to": [10,0], "label": "Base"},
      {"type": "circle", "center": [5,5], "radius": 3, "label": "Circle C"}
    ]
  }
  ```
  - Frontend interprets and renders on canvas
- Shape recognition: Simple heuristics (closed path = shape) or ML (TensorFlow.js)
- Layering: Fabric.js groups for organization
- Animation: Sequential `setTimeout` calls for step-by-step drawing

---

## Story 9.3: Collaborative Problem-Solving Mode

As a student,
I want to work on the whiteboard simultaneously with the AI's guidance,
So that we can co-create the solution visually together.

**Acceptance Criteria:**
1. "Collaborative mode" toggle for whiteboard
2. When enabled:
   - AI can draw while student draws (non-blocking)
   - Real-time sync (AI's strokes appear immediately)
   - Turn-taking suggestions: "Your turn - try drawing the altitude"
3. Guided construction problems:
   - AI: "Let's construct a perpendicular bisector. First, draw two points."
   - Student: Draws points A and B
   - AI: "Great! Now draw circles from each point with equal radius."
   - Student: Draws circles
   - AI: Completes by connecting intersection points
4. Visual Socratic questions:
   - "Can you shade the area we need to calculate?"
   - "Draw a line showing where the height would be"
   - "Mark the right angle with a square"
5. Mistake detection:
   - AI notices if student draws wrong shape
   - "That looks more like an ellipse - try making it more circular"
   - Non-intrusive corrections (suggestions, not automatic fixes)
6. Progress tracking on canvas:
   - Checkmarks appear next to completed steps
   - Problem partially grayed out as solved
7. Multi-step geometry proofs:
   - Each step highlighted as student works
   - AI adds "Given" vs. "To Prove" labels
8. Save collaboration as playback (can replay drawing session)
9. Share link (if backend added in future)
10. Voice narration integration (if Epic 6 completed)

**Prerequisites:** Stories 9.1, 9.2 (needs full canvas + AI annotation)

**Technical Notes:**
- Collaborative framework:
  - MVP: Sequential turn-taking (not true real-time collaboration)
  - Future: WebSockets for simultaneous drawing
- State management: Track canvas versions, allow undo per-actor
- Playback: Store drawing events with timestamps
```typescript
interface DrawingEvent {
  timestamp: number
  actor: 'student' | 'ai'
  action: CanvasAction
}
```
- Mistake detection: Compare drawn shape to expected shape (basic geometry checks)

---

## Story 9.4: Geometry & Graphing Problem Integration

As a teacher assigning geometry homework,
I want students to solve visual problems on the whiteboard,
So that they practice spatial reasoning alongside algebraic skills.

**Acceptance Criteria:**
1. Problem type detection triggers whiteboard automatically:
   - Keywords: "draw", "sketch", "graph", "triangle", "circle"
   - Problem types: Geometry, coordinate graphing, trigonometry
2. Pre-loaded templates for common problems:
   - Blank coordinate grid (-10 to 10)
   - Right triangle template
   - Circle with labeled radius
   - Number line
   - Venn diagram
3. Problem-specific tools:
   - **Geometry**: Compass, protractor (measure angles), ruler (measure length)
   - **Graphing**: Plot point, draw function, add axis labels
   - **Trigonometry**: Unit circle template, angle measure tool
4. Auto-check drawings:
   - "Is this triangle a right triangle?" → AI measures angles
   - "Did I graph y=2x correctly?" → AI checks slope
5. Integration with Socratic dialogue:
   - AI asks question in chat
   - Student answers by drawing on whiteboard
   - AI validates drawing: "Perfect! That's a 90° angle."
6. Export options:
   - Save as image (PNG)
   - Include problem statement + solution
   - Generate PDF with steps
7. Gallery of past whiteboard solutions (stored locally)
8. Works for 10+ geometry/graphing problem types
9. Mobile-optimized (tablet-first, phone secondary)
10. Accessibility: Describe drawings verbally for screen readers

**Prerequisites:** All previous Story 9.x stories

**Technical Notes:**
- Template library: Pre-defined SVG templates loaded into canvas
- Measurement tools: Use Fabric.js built-in geometry functions
- Auto-check: Basic geometry validation (angle sum = 180°, Pythagorean theorem)
- Gallery: LocalStorage + thumbnails generated from canvas

---

## Success Checkpoint: After Epic 9

**Validation Criteria:**
- ✅ Student can draw triangle, AI labels sides/angles
- ✅ Geometry problem "Find area of triangle with base 10, height 6" completed on whiteboard
- ✅ Graph "y=2x" on coordinate grid, AI validates correctness
- ✅ Undo/Redo works smoothly (10 steps)
- ✅ Export canvas as PNG includes both student + AI annotations
- ✅ Mobile drawing works on iPad (touch-responsive)
- ✅ Templates load instantly (<500ms)
- ✅ No lag when drawing complex shapes (60fps maintained)

**Testing Scenarios:**
1. **Right Triangle:** Draw triangle, AI annotates hypotenuse, calculate area
2. **Function Graphing:** Plot y=x², AI validates shape
3. **Geometry Proof:** Construct perpendicular bisector with AI guidance
4. **Collaborative Mode:** AI draws first, student completes diagram
5. **Export:** Complete geometry problem, export to PNG with annotations
6. **Mobile:** Draw circle on iPad, verify smooth touch drawing

**Quality Metrics:**
- Drawing latency: <16ms (60fps)
- Canvas load time: <1 second
- Export PNG generation: <2 seconds
- AI annotation response: <3 seconds
- Shape recognition accuracy: >80%

**Known Limitations:**
- Advanced CAD features not supported (no precise measurements)
- No 3D geometry (2D only)
- Collaboration requires sequential turns (not true real-time in MVP)
- Shape recognition limited to basic shapes
- Performance degrades with 1000+ objects (rare in math problems)

---

## Technical Architecture

### Components
- `WhiteboardCanvas.tsx` - Main canvas component
- `DrawingToolbar.tsx` - Tool selection UI
- `GeometryTemplates.tsx` - Pre-loaded templates
- `AIAnnotationLayer.tsx` - Separate layer for AI drawings
- `CollaborativeMode.tsx` - Turn-taking coordination
- `CanvasExport.tsx` - Export PNG/PDF functionality

### Key Libraries
- **Fabric.js** (primary): Canvas manipulation, drawing tools
- **React** integration: `fabric-react` or custom hooks
- **Geometry utilities**: For shape detection and validation
- **Export**: `html2canvas` or Fabric.js built-in export

### State Management
```typescript
interface WhiteboardState {
  canvasObjects: FabricObject[]
  selectedTool: 'pen' | 'line' | 'circle' | 'text' | 'eraser'
  toolProperties: {
    color: string
    thickness: number
    fillEnabled: boolean
  }
  layers: {
    student: FabricGroup
    ai: FabricGroup
  }
  history: CanvasState[] // For undo/redo
  templates: Record<string, Template>
}
```

### Canvas Data Format
```json
{
  "version": "1.0",
  "objects": [
    {
      "type": "line",
      "x1": 0, "y1": 0,
      "x2": 100, "y2": 100,
      "stroke": "black",
      "strokeWidth": 2,
      "label": "Side A",
      "actor": "student"
    }
  ],
  "background": "white",
  "gridEnabled": true
}
```

---

## Why This Epic Matters

**Learning Science:**
- **Spatial Reasoning:** Drawing develops geometric intuition
- **Embodied Cognition:** Hand movements reinforce memory
- **Visual Learning:** 65% of students are visual learners
- **Multimodal Engagement:** Drawing + dialogue = 50% better retention

**Competitive Differentiation:**
- **Photomath:** No whiteboard (camera only)
- **Khanmigo:** Text-only interface
- **Wolfram Alpha:** Static diagrams
- **GeoGebra:** Drawing tool but no Socratic AI
- **zeroai**: ONLY Socratic tutor with collaborative whiteboard

**Problem Types Unlocked:**
- ✅ Geometry (triangles, circles, polygons)
- ✅ Coordinate graphing (linear, quadratic, trig functions)
- ✅ Trigonometry (unit circle, right triangles)
- ✅ Geometry proofs (visual construction)
- ✅ Word problems (draw diagrams to understand)
- ✅ Statistics (Venn diagrams, bar charts)

**User Value:**
- Makes geometry problems approachable
- Reduces "I can't visualize this" frustration
- Creates shareable artifacts (export drawings)
- Fun factor (students enjoy drawing)
- Portfolio of solutions (study gallery)

**Pedagogical Impact:**
- Transforms abstract geometry into concrete practice
- Supports visual learners (often underserved)
- Enables geometry proofs (Khan Academy missing this)
- Develops spatial reasoning (critical for STEM)

---

**Epic 9 Status:** 📝 Ready for Implementation
**Priority:** MEDIUM-HIGH (High value, medium-high effort)
**Estimated Timeline:** 2-3 days
**Recommended Order:** After Epics 6-8 (stable base needed, complex integration)
