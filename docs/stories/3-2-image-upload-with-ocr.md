# Story 3.2: Image Upload with OCR

Status: drafted

## Story

As a student,
I want to upload a photo of my math problem,
so that I don't have to type complex equations.

## Acceptance Criteria

1. Image upload button visible in chat input area
2. Click opens file picker OR drag-drop zone appears
3. Supports JPG, PNG, PDF (max 10MB)
4. Image preview shown before submitting
5. Vision API (GPT-4 Vision or Google Cloud Vision) extracts problem text
6. Loading indicator during OCR: "Extracting problem..." (<5 seconds)
7. Extracted problem displayed for student confirmation
8. Student can edit extracted text if OCR made mistakes
9. 90%+ accuracy on printed text, 70%+ on clear handwritten
10. Graceful error handling: "Couldn't read image clearly. Please try typing the problem or upload a clearer photo."

## Tasks / Subtasks

- [ ] Task 1: Create ImageUpload component with file picker and drag-drop support (AC: #1, #2, #3)
  - [ ] Subtask 1.1: Create new ImageUpload.tsx component with 'use client' directive
  - [ ] Subtask 1.2: Add file input with accept="image/*,application/pdf"
  - [ ] Subtask 1.3: Implement click-to-upload button
  - [ ] Subtask 1.4: Add drag-drop zone with visual feedback
  - [ ] Subtask 1.5: Validate file size (max 10MB) and type (JPG, PNG, PDF)

- [ ] Task 2: Implement image preview before submission (AC: #4)
  - [ ] Subtask 2.1: Convert uploaded image to base64 or object URL
  - [ ] Subtask 2.2: Display preview with remove/retry options
  - [ ] Subtask 2.3: Show file name and size

- [ ] Task 3: Create /api/ocr endpoint with GPT-4 Vision integration (AC: #5, #6)
  - [ ] Subtask 3.1: Create app/api/ocr/route.ts with POST handler
  - [ ] Subtask 3.2: Accept base64 image in request body
  - [ ] Subtask 3.3: Call OpenAI GPT-4 Vision API with prompt: "Extract the math problem from this image. Return only the problem text."
  - [ ] Subtask 3.4: Return ApiResponse<{ problem: string }> format
  - [ ] Subtask 3.5: Add loading state with "Extracting problem..." message

- [ ] Task 4: Display extracted problem with edit capability (AC: #7, #8)
  - [ ] Subtask 4.1: Populate MessageInput with extracted text
  - [ ] Subtask 4.2: Allow student to edit before sending
  - [ ] Subtask 4.3: Clear image after extraction

- [ ] Task 5: Implement error handling and edge cases (AC: #9, #10)
  - [ ] Subtask 5.1: Handle API failures gracefully
  - [ ] Subtask 5.2: Handle unclear/unreadable images
  - [ ] Subtask 5.3: Add fallback message suggesting text input
  - [ ] Subtask 5.4: Test with printed text (target 90%+ accuracy)
  - [ ] Subtask 5.5: Test with clear handwritten text (target 70%+ accuracy)

- [ ] Task 6: Integrate ImageUpload into chat UI (AC: #1)
  - [ ] Subtask 6.1: Add ImageUpload component to MessageInput or ChatContainer
  - [ ] Subtask 6.2: Style for consistent UI with existing components
  - [ ] Subtask 6.3: Ensure mobile-responsive design

## Dev Notes

### Context

This story builds on Story 3.1 (text problem entry) by adding image upload capability with OCR. Students can now upload photos of math problems instead of typing them. The extracted text flows through the same confirmation and Socratic dialogue system established in Story 3.1.

### Architecture Patterns and Constraints

**New Components Required:**
- `components/ImageUpload.tsx` - Image upload UI with drag-drop and file picker [Source: docs/architecture.md#Project-Structure]
- `app/api/ocr/route.ts` - OCR endpoint using GPT-4 Vision API [Source: docs/architecture.md#API-Contracts]

**Existing Components to Integrate:**
- `components/MessageInput.tsx` - Will receive extracted text from ImageUpload [Source: docs/architecture.md#Project-Structure]
- Existing Socratic dialogue flow from Story 3.1

**Key Architectural Decisions:**
1. **GPT-4 Vision over Google Cloud Vision**: Same API as Socratic dialogue, unified billing, understands mathematical notation [Source: docs/architecture.md#ADR-003]
2. **Base64 Encoding**: Convert images to base64 for API transmission
3. **Client-Side Resize**: Resize large images to max 2048px before upload [Source: docs/architecture.md#Performance-Considerations]
4. **Compression**: Convert to JPEG with 80% quality
5. **Max File Size**: 10MB limit

**API Pattern:**
```typescript
// app/api/ocr/route.ts
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

**Component Pattern:**
```typescript
// components/ImageUpload.tsx
'use client';

import { useState } from 'react';

export function ImageUpload({ onExtract }: { onExtract: (text: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  // File picker, drag-drop, resize, base64 conversion, API call
}
```

### Project Structure Notes

**Files to Create:**
1. **`components/ImageUpload.tsx`**
   - Image upload UI (drag-drop + file picker)
   - Image preview with remove option
   - Client-side resize and compression
   - Base64 conversion
   - OCR API call with loading state
   - Error handling

2. **`app/api/ocr/route.ts`**
   - POST endpoint accepting base64 image
   - GPT-4 Vision API integration
   - ApiResponse format
   - Error handling per architecture pattern

**Files to Modify:**
- `components/MessageInput.tsx` or `components/ChatContainer.tsx` - integrate ImageUpload component

**No Changes Needed:**
- Existing Socratic dialogue flow (works with extracted text same as typed text)
- Problem confirmation logic from Story 3.1

### Testing Standards Summary

**Testing Approach:**
- Manual testing with documented test matrix (per ADR-004: Manual Testing Only) [Source: docs/architecture.md#ADR-004]
- Test with various image types (printed, handwritten, clear, blurry)
- Verify accuracy targets: 90%+ printed, 70%+ handwritten

**Test Coverage Requirements:**
1. **File Upload (AC #1-4):**
   - Click-to-upload functionality
   - Drag-drop functionality
   - File type validation (JPG, PNG, PDF accepted)
   - File size validation (10MB max, reject larger)
   - Image preview display

2. **OCR Extraction (AC #5, #6, #9):**
   - Printed text: Test with textbook problems, worksheets (target 90%+ accuracy)
   - Handwritten text: Test with clear handwriting (target 70%+ accuracy)
   - Loading indicator appears during extraction
   - Extraction completes in <5 seconds

3. **Edit Capability (AC #7, #8):**
   - Extracted text populates MessageInput
   - Student can edit before sending
   - Clear workflow (extract → preview → edit → confirm)

4. **Error Handling (AC #10):**
   - Unclear image handling
   - API failure handling
   - Network error handling
   - User-friendly error messages

**Success Criteria:**
- 90%+ accuracy on printed text (textbooks, worksheets)
- 70%+ accuracy on clear handwritten problems
- <5 second OCR processing time
- Graceful error handling with helpful fallback messages

### Learnings from Previous Story

**From Story 3-1-text-problem-entry (Status: review)**

The previous story established the problem entry and confirmation flow through text input. This story extends that capability to images.

**Key Integration Points:**
- Extracted text from OCR flows into the same confirmation system (T1.1A in lib/prompts.ts)
- No changes needed to Socratic dialogue logic - it works with any text source
- ImageUpload component will call onExtract callback to populate MessageInput

**Reuse Opportunity:**
- MessageInput already has the placeholder "Type your math problem here..." and handles text
- After OCR, the extracted text simply populates this existing field
- Student can then edit and submit, triggering the same Socratic flow

### References

- **Epic 3 Details:** [Source: docs/epics/epic-3-problem-input-math-rendering.md#Story-3.2]
- **Architecture - Vision API:** [Source: docs/architecture.md#ADR-003]
- **Architecture - API Pattern:** [Source: docs/architecture.md#API-Route-Pattern]
- **Architecture - Component Pattern:** [Source: docs/architecture.md#Component-Structure-Pattern]
- **Architecture - Performance:** [Source: docs/architecture.md#Performance-Considerations-Image-Processing]
- **PRD Functional Requirements:** [Source: docs/PRD.md#FR-1.2-Image-Upload-with-OCR]
- **Error Handling Strategy:** [Source: docs/PRD.md#NFR-2-Reliability-Error-Handling]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
