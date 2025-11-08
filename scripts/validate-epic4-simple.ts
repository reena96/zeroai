/**
 * Epic 4 Simplified Validation Script
 * Uses BrowserBase + Playwright to capture screenshots and perform basic checks
 * Following Epic 3 validation approach with automated screenshot capture
 */

// Load environment variables
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

import { Browserbase } from '@browserbasehq/sdk';
import { chromium } from 'playwright';

interface ValidationResult {
  testName: string;
  status: 'PASS' | 'FAIL' | 'MANUAL' | 'SKIP';
  notes: string;
  screenshotPath?: string;
}

class Epic4SimpleValidator {
  private browserbase: Browserbase;
  private results: ValidationResult[] = [];
  private baseUrl: string;
  private screenshotDir: string;

  constructor() {
    this.browserbase = new Browserbase({
      apiKey: process.env.BROWSERBASE_API_KEY!,
    });
    this.baseUrl = 'http://localhost:3000';
    this.screenshotDir = path.join(process.cwd(), 'docs/validation/screenshots/epic4');

    // Create screenshots directory
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async run() {
    console.log('🚀 Starting Epic 4 Simplified Validation...\n');
    console.log(`📸 Screenshots will be saved to: ${this.screenshotDir}\n`);

    try {
      // Create BrowserBase session
      console.log('Creating BrowserBase session...');
      const session = await this.browserbase.sessions.create({
        projectId: process.env.BROWSERBASE_PROJECT_ID!,
      });

      console.log(`✅ BrowserBase session created: ${session.id}\n`);

      // Connect Playwright to BrowserBase
      console.log('Connecting Playwright via CDP...');
      const browser = await chromium.connectOverCDP(session.connectUrl!);
      const context = browser.contexts()[0];
      const page = await context.newPage();
      console.log('✅ Playwright connected\n');

      // Run validation scenarios
      await this.scenario1_BasicLoad(page);
      await this.scenario2_ResponsiveScreenshots(page);
      await this.scenario3_LocalStorage(page);

      // Cleanup
      console.log('\nClosing browser...');
      await browser.close();

      // Generate report
      await this.generateReport();

    } catch (error) {
      console.error('❌ Validation failed:', error);
      this.results.push({
        testName: 'CRITICAL ERROR',
        status: 'FAIL',
        notes: `Validation script error: ${error instanceof Error ? error.message : String(error)}`,
      });
      await this.generateReport();
      process.exit(1);
    }
  }

  /**
   * Scenario 1: Basic application load and UI elements
   */
  async scenario1_BasicLoad(page: any) {
    console.log('📋 Scenario 1: Basic Application Load\n');

    try {
      // Navigate to app
      console.log('   Loading http://localhost:3000...');
      await page.goto(this.baseUrl, { timeout: 30000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      console.log('   ✓ Page loaded');

      // Take full page screenshot
      const screenshotPath = path.join(this.screenshotDir, '01-initial-load.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`   📸 Screenshot: ${screenshotPath}`);

      this.results.push({
        testName: 'S1.1 - Application Loads Successfully',
        status: 'PASS',
        notes: 'Application loaded at http://localhost:3000',
        screenshotPath,
      });

      // Check for input field
      const inputExists = await page.locator('input, textarea').first().isVisible({ timeout: 5000 }).catch(() => false);

      this.results.push({
        testName: 'S1.2 - Input Field Visible',
        status: inputExists ? 'PASS' : 'FAIL',
        notes: inputExists ? 'Chat input field found' : 'No input field found',
      });

      console.log('   ✓ Basic load validation complete\n');

    } catch (error) {
      this.results.push({
        testName: 'Scenario 1 - Basic Load',
        status: 'FAIL',
        notes: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
      console.log(`   ✗ Error: ${error instanceof Error ? error.message : String(error)}\n`);
    }
  }

  /**
   * Scenario 2: Capture responsive screenshots at different sizes
   */
  async scenario2_ResponsiveScreenshots(page: any) {
    console.log('📋 Scenario 2: Responsive Design Screenshots\n');

    const viewports = [
      { name: 'Mobile', width: 390, height: 844, file: '02-mobile-390x844.png' },
      { name: 'Tablet', width: 768, height: 1024, file: '03-tablet-768x1024.png' },
      { name: 'Desktop', width: 1440, height: 900, file: '04-desktop-1440x900.png' },
    ];

    for (const viewport of viewports) {
      try {
        console.log(`   Testing ${viewport.name} (${viewport.width}x${viewport.height})...`);

        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(this.baseUrl, { timeout: 15000 });
        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

        const screenshotPath = path.join(this.screenshotDir, viewport.file);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`   📸 Screenshot: ${screenshotPath}`);

        // Check for horizontal scroll
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        this.results.push({
          testName: `S2.${viewports.indexOf(viewport) + 1} - ${viewport.name} Responsive`,
          status: hasHorizontalScroll ? 'FAIL' : 'PASS',
          notes: hasHorizontalScroll
            ? `Horizontal scroll detected at ${viewport.width}px`
            : `No horizontal scroll at ${viewport.width}px - see screenshot for manual UX review`,
          screenshotPath,
        });

        console.log(`   ✓ ${viewport.name} screenshot captured\n`);

      } catch (error) {
        this.results.push({
          testName: `S2 - ${viewport.name} Screenshot`,
          status: 'FAIL',
          notes: `Error: ${error instanceof Error ? error.message : String(error)}`,
        });
        console.log(`   ✗ Error: ${error instanceof Error ? error.message : String(error)}\n`);
      }
    }
  }

  /**
   * Scenario 3: Check localStorage for gamification features
   */
  async scenario3_LocalStorage(page: any) {
    console.log('📋 Scenario 3: Gamification Features (localStorage)\n');

    try {
      // Reset to desktop size
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(this.baseUrl, { timeout: 15000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

      // Check localStorage for streak and counter data
      console.log('   Checking localStorage...');

      const localStorageData = await page.evaluate(() => {
        return {
          streakData: localStorage.getItem('streakData'),
          problemsCounter: localStorage.getItem('problemsCounter'),
          allKeys: Object.keys(localStorage),
        };
      });

      console.log(`   LocalStorage keys: ${localStorageData.allKeys.join(', ')}`);

      // Parse and check streak data
      if (localStorageData.streakData) {
        const streakData = JSON.parse(localStorageData.streakData);
        console.log(`   Streak data: ${JSON.stringify(streakData)}`);

        this.results.push({
          testName: 'S3.1 - Streak Tracker localStorage',
          status: streakData.currentStreak !== undefined ? 'PASS' : 'FAIL',
          notes: `Streak data found: currentStreak=${streakData.currentStreak}, lastUsedDate=${streakData.lastUsedDate}`,
        });
      } else {
        this.results.push({
          testName: 'S3.1 - Streak Tracker localStorage',
          status: 'MANUAL',
          notes: 'No streak data in localStorage - may not be implemented yet or requires user interaction to initialize',
        });
      }

      // Parse and check problems counter
      if (localStorageData.problemsCounter) {
        const counterData = JSON.parse(localStorageData.problemsCounter);
        console.log(`   Counter data: ${JSON.stringify(counterData)}`);

        this.results.push({
          testName: 'S3.2 - Problems Counter localStorage',
          status: counterData.totalProblems !== undefined ? 'PASS' : 'FAIL',
          notes: `Counter data found: totalProblems=${counterData.totalProblems}, weeklyProblems=${counterData.weeklyProblems}`,
        });
      } else {
        this.results.push({
          testName: 'S3.2 - Problems Counter localStorage',
          status: 'MANUAL',
          notes: 'No counter data in localStorage - may not be implemented yet or requires user interaction to initialize',
        });
      }

      // Take screenshot of the page for UI verification
      const screenshotPath = path.join(this.screenshotDir, '05-gamification-ui.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`   📸 Screenshot: ${screenshotPath}`);

      this.results.push({
        testName: 'S3.3 - Gamification UI Elements',
        status: 'MANUAL',
        notes: 'Review screenshot for streak display, problems counter, and overall gamification UI',
        screenshotPath,
      });

      console.log('   ✓ LocalStorage check complete\n');

    } catch (error) {
      this.results.push({
        testName: 'Scenario 3 - Gamification Features',
        status: 'FAIL',
        notes: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
      console.log(`   ✗ Error: ${error instanceof Error ? error.message : String(error)}\n`);
    }
  }

  /**
   * Generate validation report
   */
  async generateReport() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 EPIC 4 VALIDATION REPORT (SIMPLIFIED)');
    console.log('='.repeat(70) + '\n');

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const manual = this.results.filter(r => r.status === 'MANUAL').length;
    const total = this.results.length;

    console.log(`Total Checks: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`👁️  Manual Review: ${manual}`);
    console.log();

    console.log('Results:\n');
    this.results.forEach((result) => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '👁️';
      console.log(`${icon} ${result.testName}`);
      console.log(`   ${result.notes}`);
      if (result.screenshotPath) {
        console.log(`   📸 ${result.screenshotPath}`);
      }
      console.log();
    });

    console.log('='.repeat(70));

    // Generate markdown report
    const reportPath = path.join(process.cwd(), 'docs/validation/epic4_validation_results.md');
    const report = this.generateMarkdownReport();

    fs.writeFileSync(reportPath, report);
    console.log(`\n📄 Full report saved to: ${reportPath}\n`);

    // Exit with appropriate code
    const exitCode = failed > 0 ? 1 : 0;
    console.log(failed > 0 ? '❌ Validation FAILED - see report above' : '✅ Automated checks PASSED - review screenshots for manual validation\n');
    process.exit(exitCode);
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport(): string {
    const timestamp = new Date().toISOString();
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const manual = this.results.filter(r => r.status === 'MANUAL').length;

    let report = `# Epic 4: Gamification & Polish - Validation Results\n\n`;
    report += `**Generated:** ${timestamp}\n`;
    report += `**Environment:** ${this.baseUrl}\n`;
    report += `**Test Framework:** BrowserBase + Playwright (Automated Screenshot Capture)\n`;
    report += `**Approach:** Following Epic 3 validation methodology with automated screenshots for manual review\n\n`;
    report += `---\n\n`;
    report += `## Summary\n\n`;
    report += `- **Total Checks:** ${this.results.length}\n`;
    report += `- **Automated Passed:** ${passed} ✅\n`;
    report += `- **Failed:** ${failed} ❌\n`;
    report += `- **Manual Review Required:** ${manual} 👁️\n\n`;

    if (failed === 0) {
      report += `**Status:** ✅ All automated checks passed - proceed with manual validation using screenshots\n\n`;
    } else {
      report += `**Status:** ❌ ${failed} check(s) failed - address issues before manual validation\n\n`;
    }

    report += `---\n\n`;
    report += `## Validation Approach\n\n`;
    report += `This validation follows the same approach as Epic 3:\n\n`;
    report += `1. **Automated Checks:** Basic functionality and technical requirements (responsive, no scroll issues)\n`;
    report += `2. **Screenshot Capture:** High-quality screenshots at multiple viewport sizes for manual UX review\n`;
    report += `3. **Manual Validation:** Human review of screenshots against Epic 4 acceptance criteria\n\n`;
    report += `All screenshots are saved to: \`${this.screenshotDir}\`\n\n`;
    report += `---\n\n`;
    report += `## Test Results\n\n`;

    const scenarios = [
      { id: 'S1', name: 'Basic Application Load' },
      { id: 'S2', name: 'Responsive Design Screenshots' },
      { id: 'S3', name: 'Gamification Features' },
    ];

    scenarios.forEach(scenario => {
      const scenarioResults = this.results.filter(r => r.testName.includes(scenario.id));
      if (scenarioResults.length === 0) return;

      report += `### ${scenario.name}\n\n`;
      scenarioResults.forEach(result => {
        const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '👁️';
        report += `${icon} **${result.testName}**\n`;
        report += `   - ${result.notes}\n`;
        if (result.screenshotPath) {
          const relativePath = path.relative(process.cwd(), result.screenshotPath);
          report += `   - Screenshot: [\`${path.basename(result.screenshotPath)}\`](../../${relativePath})\n`;
        }
        report += `\n`;
      });
    });

    report += `---\n\n`;
    report += `## Screenshots for Manual Validation\n\n`;
    report += `Review these screenshots against Epic 4 acceptance criteria:\n\n`;

    const screenshotResults = this.results.filter(r => r.screenshotPath);
    screenshotResults.forEach((result, index) => {
      const relativePath = path.relative(process.cwd(), result.screenshotPath!);
      report += `${index + 1}. **${path.basename(result.screenshotPath!)}**\n`;
      report += `   - Test: ${result.testName}\n`;
      report += `   - Path: [\`${relativePath}\`](../../${relativePath})\n\n`;
    });

    report += `---\n\n`;
    report += `## Epic 4 Stories - Manual Validation Checklist\n\n`;

    report += `Use the screenshots above to verify:\n\n`;

    report += `### Story 4.1: Daily Streak Tracker\n\n`;
    report += `- [ ] Streak counter visible in header (e.g., "🔥 5 day streak!")\n`;
    report += `- [ ] Streak display prominent and readable\n`;
    report += `- [ ] localStorage contains streak data (verified above)\n\n`;

    report += `### Story 4.2: Problems Solved Counter\n\n`;
    report += `- [ ] Counter visible (e.g., "23 problems this week! 💪")\n`;
    report += `- [ ] Counter display clear and motivating\n`;
    report += `- [ ] localStorage contains counter data (verified above)\n\n`;

    report += `### Story 4.3: Celebration Animations\n\n`;
    report += `- [ ] **Manual Test Required:** Solve a problem end-to-end and verify:\n`;
    report += `  - [ ] Confetti/celebration animation appears\n`;
    report += `  - [ ] Encouraging message displays\n`;
    report += `  - [ ] Animation lasts 2-3 seconds\n`;
    report += `  - [ ] Animation is tasteful, not annoying\n\n`;

    report += `### Story 4.4: Responsive Design & UX Polish\n\n`;
    report += `Based on screenshots:\n\n`;
    report += `- [ ] **Mobile (390x844):**\n`;
    report += `  - [ ] No horizontal scrolling (automated: ${this.results.find(r => r.testName.includes('Mobile'))?.status === 'PASS' ? '✅' : '❌'})\n`;
    report += `  - [ ] All UI elements visible and accessible\n`;
    report += `  - [ ] Touch targets ≥ 44px\n`;
    report += `  - [ ] Math rendering readable\n\n`;

    report += `- [ ] **Tablet (768x1024):**\n`;
    report += `  - [ ] No horizontal scrolling (automated: ${this.results.find(r => r.testName.includes('Tablet'))?.status === 'PASS' ? '✅' : '❌'})\n`;
    report += `  - [ ] Layout adapts appropriately\n`;
    report += `  - [ ] Good use of screen space\n\n`;

    report += `- [ ] **Desktop (1440x900):**\n`;
    report += `  - [ ] No horizontal scrolling (automated: ${this.results.find(r => r.testName.includes('Desktop'))?.status === 'PASS' ? '✅' : '❌'})\n`;
    report += `  - [ ] Professional, polished appearance\n`;
    report += `  - [ ] Clean design, not prototype-looking\n\n`;

    report += `---\n\n`;
    report += `## Next Steps\n\n`;

    if (failed > 0) {
      report += `### ❌ Address Failures First\n\n`;
      const failedTests = this.results.filter(r => r.status === 'FAIL');
      report += `The following automated checks failed:\n\n`;
      failedTests.forEach(result => {
        report += `- **${result.testName}:** ${result.notes}\n`;
      });
      report += `\nFix these issues before proceeding with manual validation.\n\n`;
    } else {
      report += `### ✅ Proceed with Manual Validation\n\n`;
      report += `1. Review all screenshots in \`${this.screenshotDir}\`\n`;
      report += `2. Complete the manual validation checklist above\n`;
      report += `3. For Story 4.3, manually test celebration animations by solving a problem\n`;
      report += `4. Test on real mobile device if possible\n`;
      report += `5. If all checks pass, mark Epic 4 as complete in sprint-status.yaml\n\n`;
    }

    report += `---\n\n`;
    report += `## Reference Documents\n\n`;
    report += `- **Epic 4 Details:** [\`docs/epics/epic-4-gamification-polish.md\`](../epics/epic-4-gamification-polish.md)\n`;
    report += `- **Epic 3 Validation (Reference):** [\`docs/validation/epic3_validation.md\`](./epic3_validation.md)\n`;
    report += `- **Sprint Status:** [\`docs/sprint-status.yaml\`](../sprint-status.yaml)\n\n`;

    report += `---\n\n`;
    report += `**Validation completed:** ${timestamp}\n`;

    return report;
  }
}

// Run validation
const validator = new Epic4SimpleValidator();
validator.run().catch(error => {
  console.error('Validation script failed:', error);
  process.exit(1);
});
