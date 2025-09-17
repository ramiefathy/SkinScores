import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = './ui-analysis';
// Ensure screenshots directory exists
mkdirSync(SCREENSHOTS_DIR, { recursive: true });
async function analyzeUI() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    const findings = [];
    try {
        // 1. Analyze Home Page
        console.log('Analyzing home page...');
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: join(SCREENSHOTS_DIR, '01-home.png'), fullPage: true });
        // Check for key elements
        const heroText = await page.locator('h1').first().textContent();
        const ctaButtons = await page.locator('button').count();
        findings.push(`Home Page: Hero text="${heroText}", CTA buttons=${ctaButtons}`);
        // 2. Analyze Library/Browse Tools Page
        console.log('Analyzing library page...');
        await page.goto(`${BASE_URL}/library`);
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: join(SCREENSHOTS_DIR, '02-library.png'), fullPage: true });
        const toolCards = await page.locator('[class*="ToolCard"], [class*="tool-card"], .MuiCard-root').count();
        const searchBar = await page.locator('input[placeholder*="Search"], input[placeholder*="search"]').count();
        const categories = await page.locator('[role="button"][aria-label*="Category"], .MuiChip-root').count();
        findings.push(`Library Page: ${toolCards} tool cards, Search bar: ${searchBar > 0}, Categories: ${categories}`);
        // 3. Analyze a Calculator Page
        console.log('Analyzing calculator page...');
        // Navigate to first tool
        const firstToolLink = await page.locator('a[href*="/calculators/"]').first();
        const toolHref = await firstToolLink.getAttribute('href');
        if (toolHref) {
            await page.goto(`${BASE_URL}${toolHref}`);
            await page.waitForLoadState('networkidle');
            await page.screenshot({ path: join(SCREENSHOTS_DIR, '03-calculator.png'), fullPage: true });
            const inputFields = await page.locator('input, select, textarea').count();
            const calculateButton = await page.locator('button[type="submit"], button:has-text("Calculate")').count();
            const references = await page.locator('a[href*="http"], a[href*="https"]').count();
            findings.push(`Calculator Page: ${inputFields} inputs, Calculate button: ${calculateButton > 0}, References: ${references}`);
        }
        // 4. Check Mobile Responsiveness
        console.log('Checking mobile view...');
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto(`${BASE_URL}/library`);
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: join(SCREENSHOTS_DIR, '04-mobile-library.png'), fullPage: true });
        const mobileMenu = await page.locator('[aria-label*="menu"], [aria-label*="Menu"]').count();
        findings.push(`Mobile: Hamburger menu present: ${mobileMenu > 0}`);
        // 5. Navigation Analysis
        console.log('Analyzing navigation...');
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto(BASE_URL);
        const navLinks = await page.locator('nav a, header a').count();
        const dropdown = await page.locator('[aria-haspopup="menu"], [aria-expanded]').count();
        findings.push(`Navigation: ${navLinks} links, Dropdown menus: ${dropdown}`);
        // 6. Check for User Feedback Elements
        const alerts = await page.locator('[role="alert"], .MuiAlert-root').count();
        const tooltips = await page.locator('[aria-label], [title]').count();
        findings.push(`User Feedback: ${alerts} alerts, ${tooltips} elements with tooltips`);
        // Save findings
        const report = `UI Analysis Report
================
Date: ${new Date().toISOString()}

${findings.join('\n')}

Screenshots saved in: ${SCREENSHOTS_DIR}
`;
        writeFileSync(join(SCREENSHOTS_DIR, 'report.txt'), report);
        console.log('\nAnalysis complete!');
        console.log(report);
    }
    catch (error) {
        console.error('Error during analysis:', error);
    }
    finally {
        await browser.close();
    }
}
// Run the analysis
analyzeUI().catch(console.error);
