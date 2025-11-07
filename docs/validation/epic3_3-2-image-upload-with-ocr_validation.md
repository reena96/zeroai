# Story 3.2: Image Upload with OCR - Validation Guide

**Story ID:** 3-2-image-upload-with-ocr
**Epic:** 3 - Problem Input & Math Rendering
**Status:** Review
**Created:** 2025-11-07

## 30-Second Quick Test

1. Open the app at http://localhost:3000
2. Take a photo of a handwritten math problem (or use test image)
3. Click the upload area or drag image into chat
4. **Expected:** Preview appears, "Extracting..." shows briefly
5. **Expected:** OCR text populates input box within 3-5 seconds
6. Press Enter to send
7. **Expected:** AI confirms the extracted problem

**PASS:** ✅ Image uploads, OCR extracts text, AI confirms problem
**FAIL:** ❌ Upload fails, OCR timeout/error, or garbled extraction

---

## Automated Test Results

**Per ADR-004:** Manual testing only for MVP. No automated tests implemented.

**Unit Tests:** N/A
**Integration Tests:** N/A
**Test Coverage:** N/A

---

## Manual Validation Steps

### Test 1: Image Upload - Click to Upload

**Setup:**
1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Prepare test images (handwritten math problems, printed equations)

**Test Cases:**

#### TC 1.1: Click upload - JPEG image
- **Steps:**
  1. Click the upload area (camera icon or "Upload Image" text)
  2. Select a JPEG image of a math problem (e.g., "2x + 5 = 13")
- **Expected:**
  - File picker opens
  - Preview appears after selection
  - "Extracting problem..." message shows
  - OCR completes within 5 seconds
  - Input box populated with extracted text
- **Pass Criteria:** ✅ Image previews, ✅ OCR extracts text, ✅ Text in input box

#### TC 1.2: Click upload - PNG image
- **Steps:** Same as TC 1.1 with PNG file
- **Expected:** Same behavior as JPEG
- **Pass Criteria:** ✅ PNG handled identically to JPEG

#### TC 1.3: Click upload - HEIC image (iPhone photos)
- **Steps:** Same as TC 1.1 with HEIC file
- **Expected:** Same behavior (converted to JPEG)
- **Pass Criteria:** ✅ HEIC processed successfully

---

### Test 2: Image Upload - Drag and Drop

**Setup:** Same as Test 1

**Test Cases:**

#### TC 2.1: Drag JPEG into upload area
- **Steps:**
  1. Drag a JPEG image from desktop/folder
  2. Drop onto upload area
- **Expected:** Same OCR flow as click upload
- **Pass Criteria:** ✅ Drag-drop works, ✅ OCR extracts

#### TC 2.2: Drag PNG into upload area
- **Steps:** Same as TC 2.1 with PNG
- **Expected:** Same behavior
- **Pass Criteria:** ✅ Drag-drop works

---

### Test 3: Image Processing - Client-Side Resize

**Setup:** Same as Test 1

**Test Cases:**

#### TC 3.1: Large image (> 2048px)
- **Steps:**
  1. Upload a high-resolution image (e.g., 4000x3000px)
  2. Monitor network tab (DevTools → Network)
- **Expected:**
  - Image resized to max 2048px (width or height)
  - Base64 payload in /api/ocr request is smaller than original
- **Pass Criteria:** ✅ Image resized before upload, ✅ Faster OCR

#### TC 3.2: Small image (< 2048px)
- **Steps:** Upload a 800x600px image
- **Expected:** No resize (already under limit)
- **Pass Criteria:** ✅ Small images not unnecessarily processed

---

### Test 4: OCR Accuracy - Different Problem Types

**Setup:** Same as Test 1

**Test Cases:**

#### TC 4.1: Handwritten simple equation
- **Image:** "x + 7 = 15" (handwritten)
- **Expected:** OCR extracts "x + 7 = 15" or close variant
- **Pass Criteria:** ✅ Readable extraction, ✅ AI can parse it

#### TC 4.2: Printed equation
- **Image:** Screenshot of "2x^2 - 5x + 3 = 0"
- **Expected:** OCR extracts with exponents (may use ^ or LaTeX)
- **Pass Criteria:** ✅ Exponents preserved, ✅ AI understands

#### TC 4.3: Word problem
- **Image:** "A train travels 60 miles in 2 hours. What is its speed?"
- **Expected:** Full text extracted
- **Pass Criteria:** ✅ Complete sentence extraction

#### TC 4.4: Fraction notation
- **Image:** "Simplify 3/4 + 1/2"
- **Expected:** Fractions extracted (may be 3/4 or LaTeX \frac{3}{4})
- **Pass Criteria:** ✅ Fraction structure preserved

#### TC 4.5: Greek letters (if applicable)
- **Image:** "Solve for θ: 2θ + 5 = 13"
- **Expected:** Greek letter recognized (θ or "theta")
- **Pass Criteria:** ✅ Symbol extracted or transliterated

---

### Test 5: OCR Editing and Confirmation

**Setup:** Same as Test 1

**Test Cases:**

#### TC 5.1: Edit extracted text before sending
- **Steps:**
  1. Upload image: "x + 5 = 10"
  2. OCR extracts (may have errors)
  3. Manually edit in input box: "x + 5 = 10"
  4. Press Enter
- **Expected:** Edited text sent to AI (not original OCR)
- **Pass Criteria:** ✅ User can correct OCR errors before sending

#### TC 5.2: AI confirms extracted problem (per Story 3.1)
- **Steps:**
  1. Upload image: "solve 2x - 8 = 4"
  2. OCR completes, press Enter
- **Expected:** AI restates: "I see you want to solve 2x - 8 = 4."
- **Pass Criteria:** ✅ AI confirmation (Story 3.1 integration)

---

### Test 6: File Validation

**Setup:** Same as Test 1

**Test Cases:**

#### TC 6.1: Invalid file type (PDF, TXT, etc.)
- **Steps:** Try uploading a PDF or TXT file
- **Expected:** Error message: "Please upload an image file (JPEG, PNG, HEIC)"
- **Pass Criteria:** ✅ Rejects non-image files gracefully

#### TC 6.2: File too large (> 10MB)
- **Steps:** Upload a 15MB image
- **Expected:** Error message: "Image too large. Max 10MB."
- **Pass Criteria:** ✅ Rejects oversized files

#### TC 6.3: Corrupted image
- **Steps:** Upload a corrupted/incomplete image file
- **Expected:** Error message or graceful fallback
- **Pass Criteria:** ✅ Doesn't crash app

---

### Test 7: API Integration - /api/ocr Endpoint

**Setup:** Same as Test 1

**Test Cases:**

#### TC 7.1: OCR API success
- **Steps:**
  1. Upload valid image
  2. Open DevTools → Network → /api/ocr
- **Expected:**
  - POST request to /api/ocr
  - Response: `{ success: true, data: { problem: "..." } }`
  - Status: 200 OK
- **Pass Criteria:** ✅ API returns extracted text

#### TC 7.2: OCR API failure (network error)
- **Steps:**
  1. Simulate offline mode (DevTools → Network → Offline)
  2. Try uploading image
- **Expected:** Error message: "OCR failed. Please try again."
- **Pass Criteria:** ✅ Graceful error handling

#### TC 7.3: OpenAI API error (invalid API key)
- **Steps:** (Requires temp invalid OPENAI_API_KEY)
  1. Set invalid key in .env.local
  2. Restart server
  3. Upload image
- **Expected:** Error message displayed to user
- **Pass Criteria:** ✅ Doesn't expose API error details, ✅ User-friendly message

---

### Test 8: Mobile Responsiveness

**Setup:**
1. Open http://localhost:3000 in mobile browser or DevTools device emulation
2. Test on iPhone 12 (390x844) and iPad (768x1024)

**Test Cases:**

#### TC 8.1: Upload area on mobile
- **Steps:** View upload area on phone screen
- **Expected:**
  - Upload area visible and tappable
  - Icon and text readable
- **Pass Criteria:** ✅ No layout issues, ✅ Touchable

#### TC 8.2: Image preview on mobile
- **Steps:** Upload image on mobile
- **Expected:** Preview fits screen, doesn't overflow
- **Pass Criteria:** ✅ Responsive preview

#### TC 8.3: Camera access (mobile only)
- **Steps:** Tap upload on mobile device with camera
- **Expected:** Option to use camera OR photo library
- **Pass Criteria:** ✅ Camera access works (browser-dependent)

---

## Edge Cases and Error Handling

### Edge Case 1: Blurry Image
- **Steps:** Upload a very blurry photo
- **Expected:** OCR may extract partial/garbled text
- **Expected:** User can edit before sending
- **Pass Criteria:** ✅ Doesn't crash, ✅ Allows manual correction

### Edge Case 2: Image with No Text
- **Steps:** Upload a blank image or photo of a tree
- **Expected:** OCR returns empty string or error
- **Expected:** User sees message: "No text detected. Please try another image."
- **Pass Criteria:** ✅ Graceful handling

### Edge Case 3: Multiple Equations in One Image
- **Steps:** Upload image with 2-3 equations
- **Expected:** OCR extracts all visible text
- **Expected:** User can edit to focus on one problem
- **Pass Criteria:** ✅ All text captured, ✅ User controls final input

### Edge Case 4: Image Rotation (sideways photo)
- **Steps:** Upload a sideways/upside-down image
- **Expected:** GPT-4 Vision handles rotation (per model capabilities)
- **Expected:** Text extracted correctly or user can rotate/retry
- **Pass Criteria:** ✅ Attempts extraction, ✅ User can retry

### Edge Case 5: Non-English Text
- **Steps:** Upload image with non-English math notation (e.g., European decimals)
- **Expected:** OCR extracts text (may need user correction)
- **Pass Criteria:** ✅ Extracts visible characters, ✅ User can edit

---

## Rollback Plan

**If validation fails:**

1. **Rollback Code Changes:**
   ```bash
   git log --oneline  # Find commit before Story 3.2
   git revert [commit-hash]
   ```

2. **Revert Affected Files:**
   - `components/ImageUpload.tsx` - Delete file
   - `app/api/ocr/route.ts` - Delete file
   - `components/MessageInput.tsx` - Remove ImageUpload import and component
   - `package.json` - Remove any new image-processing dependencies (if added)

3. **Restart Dev Server:**
   ```bash
   npm run dev
   ```

4. **Verify Rollback:**
   - Check upload area is gone from chat
   - Confirm /api/ocr endpoint doesn't exist (404)

**Recovery Time:** ~5 minutes

---

## Acceptance Criteria Checklist

Per Story 3.2 requirements:

- [ ] **AC #1:** Upload area visible in chat interface (camera icon or button)
  - **Tests:** TC 1.1, 1.2, 8.1

- [ ] **AC #2:** Click-to-upload triggers file picker
  - **Tests:** TC 1.1, 1.2, 1.3

- [ ] **AC #3:** Drag-and-drop support
  - **Tests:** TC 2.1, 2.2

- [ ] **AC #4:** File validation (JPEG, PNG, HEIC only, max 10MB)
  - **Tests:** TC 6.1, 6.2

- [ ] **AC #5:** Client-side image resize (max 2048px, JPEG compression 80%)
  - **Test:** TC 3.1

- [ ] **AC #6:** Image preview displayed before OCR
  - **Tests:** TC 1.1, 8.2

- [ ] **AC #7:** GPT-4 Vision API integration for OCR
  - **Tests:** TC 7.1, 4.1-4.5

- [ ] **AC #8:** Extracted text populates input box
  - **Tests:** TC 1.1, 4.1-4.5

- [ ] **AC #9:** User can edit OCR text before sending
  - **Test:** TC 5.1

- [ ] **AC #10:** Error handling for upload/OCR failures
  - **Tests:** TC 6.1, 6.2, 7.2, 7.3

- [ ] **AC #11:** Works on mobile devices
  - **Tests:** TC 8.1, 8.2, 8.3

- [ ] **AC #12:** Extracted problem confirmed by AI (Story 3.1 integration)
  - **Test:** TC 5.2

---

## Test Execution Record

**Date Tested:** _____________________
**Tested By:** _____________________
**Environment:** Local dev (http://localhost:3000)

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC 1.1 - Click JPEG | ⬜ Pass / ⬜ Fail | |
| TC 1.2 - Click PNG | ⬜ Pass / ⬜ Fail | |
| TC 1.3 - Click HEIC | ⬜ Pass / ⬜ Fail | |
| TC 2.1 - Drag JPEG | ⬜ Pass / ⬜ Fail | |
| TC 2.2 - Drag PNG | ⬜ Pass / ⬜ Fail | |
| TC 3.1 - Large resize | ⬜ Pass / ⬜ Fail | |
| TC 3.2 - Small image | ⬜ Pass / ⬜ Fail | |
| TC 4.1 - Handwritten | ⬜ Pass / ⬜ Fail | |
| TC 4.2 - Printed | ⬜ Pass / ⬜ Fail | |
| TC 4.3 - Word problem | ⬜ Pass / ⬜ Fail | |
| TC 4.4 - Fractions | ⬜ Pass / ⬜ Fail | |
| TC 4.5 - Greek letters | ⬜ Pass / ⬜ Fail | |
| TC 5.1 - Edit OCR | ⬜ Pass / ⬜ Fail | |
| TC 5.2 - AI confirms | ⬜ Pass / ⬜ Fail | |
| TC 6.1 - Invalid type | ⬜ Pass / ⬜ Fail | |
| TC 6.2 - Too large | ⬜ Pass / ⬜ Fail | |
| TC 6.3 - Corrupted | ⬜ Pass / ⬜ Fail | |
| TC 7.1 - API success | ⬜ Pass / ⬜ Fail | |
| TC 7.2 - Network fail | ⬜ Pass / ⬜ Fail | |
| TC 7.3 - API error | ⬜ Pass / ⬜ Fail | |
| TC 8.1 - Mobile UI | ⬜ Pass / ⬜ Fail | |
| TC 8.2 - Mobile preview | ⬜ Pass / ⬜ Fail | |
| TC 8.3 - Camera access | ⬜ Pass / ⬜ Fail | |

**Overall Status:** ⬜ PASS / ⬜ FAIL

**Critical Issues Found:** _____________________

---

## Performance Metrics

**Target Performance:**
- OCR response time: < 5 seconds for typical image
- Image resize time: < 1 second client-side
- Upload UI responsiveness: Immediate feedback

**Measurement:**
- Use DevTools → Network → Timing for /api/ocr latency
- Use DevTools → Performance → Record for client-side resize
- Visual feedback timing (preview, spinner)

**Acceptable Range:**
- OCR: 3-7 seconds (depends on OpenAI API)
- Resize: < 2 seconds (client-side canvas)
- UI feedback: < 100ms

---

## References

- **Story File:** docs/stories/3-2-image-upload-with-ocr.md
- **Story Context:** docs/stories/3-2-image-upload-with-ocr.context.xml
- **Implementation:** components/ImageUpload.tsx, app/api/ocr/route.ts, components/MessageInput.tsx
- **Architecture:** docs/architecture.md (ADR-003: GPT-4 Vision, ADR-004: Manual Testing)
- **PRD:** docs/PRD.md (FR-1.2: Image Upload with OCR)
