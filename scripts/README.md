# Validation Scripts

This directory contains automated validation scripts for Epic 4 using BrowserBase and Playwright.

## Scripts

### `validate-epic4-simple.ts`

Simplified validation script that captures screenshots and performs basic checks.

**Features:**
- Creates BrowserBase session via cloud browser
- Captures screenshots at multiple viewport sizes (mobile, tablet, desktop)
- Checks for horizontal scrolling
- Inspects localStorage for gamification data
- Generates markdown validation report

**Limitation:**
BrowserBase runs in a remote cloud environment and **cannot access `localhost:3000`**.

To use this script, you must:

1. **Deploy your app to a staging environment** (Vercel, Netlify, etc.)
2. **Set the URL environment variable:**
   ```bash
   export NEXT_PUBLIC_APP_URL="https://your-staging-url.com"
   ```
3. **Run the script:**
   ```bash
   npm run validate:epic4
   ```

## Manual Validation (Recommended for Local Development)

For local development on `localhost:3000`, use the manual validation guide instead:

**Guide Location:** `/docs/validation/epic4_validation.md`

This guide provides:
- 30-second smoke test
- Critical validation scenarios
- Edge cases to test
- Mobile/responsive checklist
- Detailed step-by-step instructions

Simply follow the guide and check off items as you validate them.

## BrowserBase Configuration

The scripts use environment variables from `.env.local`:

```env
BROWSERBASE_API_KEY=bb_live_...
BROWSERBASE_PROJECT_ID=...
```

These are automatically loaded by the validation scripts.

## Future Enhancements

- **Local Screenshot Tool:** Create a local Playwright script that doesn't use BrowserBase
- **Video Recording:** Capture video of user flows for celebration animations
- **Accessibility Testing:** Add automated a11y checks
- **Performance Metrics:** Track page load times and animation performance

## Questions?

See the main validation guide at `/docs/validation/epic4_validation.md` for complete testing instructions.
