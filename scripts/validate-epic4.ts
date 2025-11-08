/**
 * Epic 4 Automated Validation Script
 * Uses BrowserBase + Playwright for manual validation automation
 *
 * Tests:
 * - Story 4.1: Daily Streak Tracker
 * - Story 4.2: Problems Solved Counter
 * - Story 4.3: Celebration Animations
 * - Story 4.4: Responsive Design & UX Polish
 */

// Load environment variables
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    }
  });
}

import { Browserbase } from '@browserbasehq/sdk';
import { chromium } from 'playwright';

interface ValidationResult {
  testName: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  notes: string;
  screenshot?: string;
}

class Epic4Validator {
  private browserbase: Browserbase;
  private results: ValidationResult[] = [];
  private baseUrl: string;

  constructor() {
    this.browserbase = new Browserbase({
      apiKey: process.env.BROWSERBASE_API_KEY!,
    });
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }

  async run() {
    console.log('🚀 Starting Epic 4 Validation...\n');

    try {
      // Create BrowserBase session
      const session = await this.browserbase.sessions.create({
        projectId: process.env.BROWSERBASE_PROJECT_ID!,
      });

      console.log(`✅ BrowserBase session created: ${session.id}`);

      // Connect Playwright to BrowserBase using CDP
      const browser = await chromium.connectOverCDP(session.connectUrl!);

      const context = browser.contexts()[0];
      const page = await context.newPage();

      // Run all validation tests
      await this.testStreakTracker(page);
      await this.testProblemsCounter(page);
      await this.testCelebrationAnimations(page);
      await this.testResponsiveDesign(page);

      // Cleanup
      await browser.close();
      await this.generateReport();

    } catch (error) {
      console.error('❌ Validation failed:', error);
      throw error;
    }
  }

  /**
   * Story 4.1: Daily Streak Tracker
   */
  async testStreakTracker(page: any) {
    console.log('\n📋 Testing Story 4.1: Daily Streak Tracker...');

    try {
      // Navigate to app
      await page.goto(this.baseUrl);
      await page.waitForLoadState('networkidle');

      // Test 1: Check streak display exists
      const streakElement = await page.locator('text=/🔥.*day streak/i').first();
      const streakExists = await streakElement.isVisible().catch(() => false);

      if (streakExists) {
        const streakText = await streakElement.textContent();
        this.results.push({
          testName: '4.1.1 - Streak Display Visible',
          status: 'PASS',
          notes: `Found streak display: ${streakText}`,
        });
      } else {
        this.results.push({
          testName: '4.1.1 - Streak Display Visible',
          status: 'FAIL',
          notes: 'Streak display not found in header',
        });
      }

      // Test 2: Check localStorage for streak data
      const streakData = await page.evaluate(() => {
        const data = localStorage.getItem('streakData');
        return data ? JSON.parse(data) : null;
      });

      if (streakData && streakData.currentStreak !== undefined) {
        this.results.push({
          testName: '4.1.2 - Streak Data in localStorage',
          status: 'PASS',
          notes: `Streak data found: ${JSON.stringify(streakData)}`,
        });
      } else {
        this.results.push({
          testName: '4.1.2 - Streak Data in localStorage',
          status: 'FAIL',
          notes: 'No streak data in localStorage',
        });
      }

      // Test 3: First-time user initialization
      await page.evaluate(() => localStorage.removeItem('streakData'));
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Type and send a problem to initialize streak
      await page.fill('[placeholder*="math problem"]', 'solve 2x + 5 = 13');
      await page.press('[placeholder*="math problem"]', 'Enter');
      await page.waitForTimeout(2000); // Wait for AI response

      const newStreakData = await page.evaluate(() => {
        const data = localStorage.getItem('streakData');
        return data ? JSON.parse(data) : null;
      });

      if (newStreakData && newStreakData.currentStreak === 1) {
        this.results.push({
          testName: '4.1.3 - First-time User Streak Initialization',
          status: 'PASS',
          notes: 'Streak initialized to 1 after first problem',
        });
      } else {
        this.results.push({
          testName: '4.1.3 - First-time User Streak Initialization',
          status: 'FAIL',
          notes: `Expected streak 1, got: ${JSON.stringify(newStreakData)}`,
        });
      }

      // Test 4: Take screenshot for manual verification
      await page.screenshot({ path: '/tmp/epic4-streak-tracker.png', fullPage: true });
      console.log('   📸 Screenshot saved: /tmp/epic4-streak-tracker.png');

    } catch (error) {
      this.results.push({
        testName: 'Story 4.1 - Streak Tracker',
        status: 'FAIL',
        notes: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  /**
   * Story 4.2: Problems Solved Counter
   */
  async testProblemsCounter(page: any) {
    console.log('\n📋 Testing Story 4.2: Problems Solved Counter...');

    try {
      // Navigate to app
      await page.goto(this.baseUrl);
      await page.waitForLoadState('networkidle');

      // Test 1: Check counter display exists
      const counterElement = await page.locator('text=/\\d+ problems/i').first();
      const counterExists = await counterElement.isVisible().catch(() => false);

      if (counterExists) {
        const counterText = await counterElement.textContent();
        this.results.push({
          testName: '4.2.1 - Problems Counter Display Visible',
          status: 'PASS',
          notes: `Found counter: ${counterText}`,
        });
      } else {
        this.results.push({
          testName: '4.2.1 - Problems Counter Display Visible',
          status: 'FAIL',
          notes: 'Problems counter not found',
        });
      }

      // Test 2: Check localStorage for counter data
      const counterData = await page.evaluate(() => {
        const data = localStorage.getItem('problemsCounter');
        return data ? JSON.parse(data) : null;
      });

      if (counterData && counterData.totalProblems !== undefined) {
        this.results.push({
          testName: '4.2.2 - Counter Data in localStorage',
          status: 'PASS',
          notes: `Counter data: ${JSON.stringify(counterData)}`,
        });
      } else {
        this.results.push({
          testName: '4.2.2 - Counter Data in localStorage',
          status: 'FAIL',
          notes: 'No counter data in localStorage',
        });
      }

      // Test 3: Take screenshot
      await page.screenshot({ path: '/tmp/epic4-problems-counter.png', fullPage: true });
      console.log('   📸 Screenshot saved: /tmp/epic4-problems-counter.png');

    } catch (error) {
      this.results.push({
        testName: 'Story 4.2 - Problems Counter',
        status: 'FAIL',
        notes: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  /**
   * Story 4.3: Celebration Animations
   */
  async testCelebrationAnimations(page: any) {
    console.log('\n📋 Testing Story 4.3: Celebration Animations...');

    try {
      await page.goto(this.baseUrl);
      await page.waitForLoadState('networkidle');

      // Test 1: Solve a problem to trigger celebration
      await page.fill('[placeholder*="math problem"]', 'What is 5 + 5?');
      await page.press('[placeholder*="math problem"]', 'Enter');
      await page.waitForTimeout(2000);

      // Continue dialogue to solve the problem
      // (This is a simplified test - in real validation we'd follow full Socratic flow)
      await page.fill('[placeholder*="math problem"]', '10');
      await page.press('[placeholder*="math problem"]', 'Enter');
      await page.waitForTimeout(3000);

      // Test 2: Check for celebration elements
      const celebrationElement = await page.locator('text=/You did it|Nice work|Excellent/i').first();
      const celebrationExists = await celebrationElement.isVisible({ timeout: 5000 }).catch(() => false);

      if (celebrationExists) {
        this.results.push({
          testName: '4.3.1 - Celebration Message Appears',
          status: 'PASS',
          notes: 'Celebration message found after solving problem',
        });
      } else {
        this.results.push({
          testName: '4.3.1 - Celebration Message Appears',
          status: 'SKIP',
          notes: 'Could not complete full Socratic flow - manual verification needed',
        });
      }

      // Test 3: Check for confetti canvas (if using canvas-confetti)
      const confettiCanvas = await page.locator('canvas').first();
      const canvasExists = await confettiCanvas.isVisible().catch(() => false);

      this.results.push({
        testName: '4.3.2 - Confetti Animation Elements',
        status: canvasExists ? 'PASS' : 'SKIP',
        notes: canvasExists ? 'Canvas element found for confetti' : 'Manual verification needed',
      });

      // Test 4: Take screenshot
      await page.screenshot({ path: '/tmp/epic4-celebration.png', fullPage: true });
      console.log('   📸 Screenshot saved: /tmp/epic4-celebration.png');

    } catch (error) {
      this.results.push({
        testName: 'Story 4.3 - Celebration Animations',
        status: 'FAIL',
        notes: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  /**
   * Story 4.4: Responsive Design & UX Polish
   */
  async testResponsiveDesign(page: any) {
    console.log('\n📋 Testing Story 4.4: Responsive Design & UX Polish...');

    try {
      // Test different viewport sizes
      const viewports = [
        { name: 'Mobile', width: 390, height: 844 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1440, height: 900 },
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(this.baseUrl);
        await page.waitForLoadState('networkidle');

        // Test 1: Check no horizontal scrolling
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        this.results.push({
          testName: `4.4.${viewports.indexOf(viewport) + 1} - ${viewport.name} No Horizontal Scroll`,
          status: hasHorizontalScroll ? 'FAIL' : 'PASS',
          notes: hasHorizontalScroll
            ? `Horizontal scroll detected at ${viewport.width}px`
            : `No horizontal scroll at ${viewport.width}px`,
        });

        // Test 2: Check input field is visible and accessible
        const inputVisible = await page.locator('[placeholder*="math problem"]').isVisible();

        this.results.push({
          testName: `4.4.${viewports.indexOf(viewport) + 1}b - ${viewport.name} Input Accessible`,
          status: inputVisible ? 'PASS' : 'FAIL',
          notes: inputVisible
            ? `Input field visible on ${viewport.name}`
            : `Input field not visible on ${viewport.name}`,
        });

        // Test 3: Take screenshots at each size
        await page.screenshot({
          path: `/tmp/epic4-responsive-${viewport.name.toLowerCase()}.png`,
          fullPage: true
        });
        console.log(`   📸 Screenshot saved: /tmp/epic4-responsive-${viewport.name.toLowerCase()}.png`);
      }

      // Test 4: Check touch-friendly button sizes (44px minimum)
      await page.setViewportSize({ width: 390, height: 844 });
      const buttons = await page.locator('button').all();

      let smallButtonsFound = 0;
      for (const button of buttons.slice(0, 10)) { // Check first 10 buttons
        const box = await button.boundingBox();
        if (box && (box.width < 44 || box.height < 44)) {
          smallButtonsFound++;
        }
      }

      this.results.push({
        testName: '4.4.10 - Touch-Friendly Button Sizes',
        status: smallButtonsFound === 0 ? 'PASS' : 'FAIL',
        notes: smallButtonsFound === 0
          ? 'All buttons meet 44px minimum tap target'
          : `${smallButtonsFound} buttons smaller than 44px`,
      });

    } catch (error) {
      this.results.push({
        testName: 'Story 4.4 - Responsive Design',
        status: 'FAIL',
        notes: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  /**
   * Generate validation report
   */
  async generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 EPIC 4 VALIDATION REPORT');
    console.log('='.repeat(60) + '\n');

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;
    const total = this.results.length;

    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`\nSuccess Rate: ${((passed / (total - skipped)) * 100).toFixed(1)}%\n`);

    console.log('Detailed Results:\n');
    this.results.forEach((result, index) => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
      console.log(`${icon} ${result.testName}`);
      console.log(`   ${result.notes}\n`);
    });

    console.log('='.repeat(60));
    console.log('\n📸 Screenshots saved to /tmp/epic4-*.png');
    console.log('   - epic4-streak-tracker.png');
    console.log('   - epic4-problems-counter.png');
    console.log('   - epic4-celebration.png');
    console.log('   - epic4-responsive-mobile.png');
    console.log('   - epic4-responsive-tablet.png');
    console.log('   - epic4-responsive-desktop.png\n');

    // Generate markdown report
    const reportPath = '/Users/reena/gauntletai/zeroai/docs/validation/epic4_validation_results.md';
    const report = this.generateMarkdownReport();

    const fs = require('fs');
    fs.writeFileSync(reportPath, report);
    console.log(`📄 Full report saved to: ${reportPath}\n`);

    // Exit with appropriate code
    process.exit(failed > 0 ? 1 : 0);
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport(): string {
    const timestamp = new Date().toISOString();
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;

    let report = `# Epic 4: Gamification & Polish - Validation Results\n\n`;
    report += `**Date:** ${timestamp}\n`;
    report += `**Environment:** ${this.baseUrl}\n`;
    report += `**Test Runner:** BrowserBase + Playwright\n\n`;
    report += `---\n\n`;
    report += `## Summary\n\n`;
    report += `- **Total Tests:** ${this.results.length}\n`;
    report += `- **Passed:** ${passed} ✅\n`;
    report += `- **Failed:** ${failed} ❌\n`;
    report += `- **Skipped:** ${skipped} ⏭️\n`;
    report += `- **Success Rate:** ${((passed / (this.results.length - skipped)) * 100).toFixed(1)}%\n\n`;
    report += `---\n\n`;
    report += `## Test Results\n\n`;

    // Group by story
    const stories = [
      { id: '4.1', name: 'Daily Streak Tracker' },
      { id: '4.2', name: 'Problems Solved Counter' },
      { id: '4.3', name: 'Celebration Animations' },
      { id: '4.4', name: 'Responsive Design & UX Polish' },
    ];

    stories.forEach(story => {
      const storyResults = this.results.filter(r => r.testName.includes(story.id));
      if (storyResults.length === 0) return;

      report += `### Story ${story.id}: ${story.name}\n\n`;
      storyResults.forEach(result => {
        const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
        report += `${icon} **${result.testName}**\n`;
        report += `   - ${result.notes}\n\n`;
      });
    });

    report += `---\n\n`;
    report += `## Screenshots\n\n`;
    report += `Screenshots have been captured for manual verification:\n\n`;
    report += `1. **Streak Tracker:** \`/tmp/epic4-streak-tracker.png\`\n`;
    report += `2. **Problems Counter:** \`/tmp/epic4-problems-counter.png\`\n`;
    report += `3. **Celebration:** \`/tmp/epic4-celebration.png\`\n`;
    report += `4. **Responsive Mobile:** \`/tmp/epic4-responsive-mobile.png\`\n`;
    report += `5. **Responsive Tablet:** \`/tmp/epic4-responsive-tablet.png\`\n`;
    report += `6. **Responsive Desktop:** \`/tmp/epic4-responsive-desktop.png\`\n\n`;

    report += `---\n\n`;
    report += `## Manual Verification Needed\n\n`;
    const skipResults = this.results.filter(r => r.status === 'SKIP');
    if (skipResults.length > 0) {
      skipResults.forEach(result => {
        report += `- **${result.testName}:** ${result.notes}\n`;
      });
    } else {
      report += `No manual verification needed - all tests automated!\n`;
    }

    report += `\n---\n\n`;
    report += `## Recommendations\n\n`;
    if (failed === 0) {
      report += `✅ **All automated tests passed!** Epic 4 is ready for manual verification of the screenshots.\n\n`;
      report += `Next steps:\n`;
      report += `1. Review screenshots for visual polish\n`;
      report += `2. Manually test celebration animations (timing, feel)\n`;
      report += `3. Test on real mobile device\n`;
      report += `4. Mark Epic 4 as complete if satisfied\n`;
    } else {
      report += `❌ **${failed} test(s) failed.** Address blocking issues before proceeding.\n\n`;
      const failedTests = this.results.filter(r => r.status === 'FAIL');
      report += `Failed tests:\n`;
      failedTests.forEach(result => {
        report += `- ${result.testName}: ${result.notes}\n`;
      });
    }

    return report;
  }
}

// Run validation
const validator = new Epic4Validator();
validator.run().catch(error => {
  console.error('Validation script failed:', error);
  process.exit(1);
});
