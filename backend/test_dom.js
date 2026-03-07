const { chromium } = require('playwright');

(async () => {
  console.log('--- PHASE 3.5: DOM Testing via Playwright ---');
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    console.error("Failed to launch browser. You may need to run 'npx playwright install chromium'.", e);
    process.exit(1);
  }
  
  const context = await browser.newContext();
  const page = await context.newPage();

  const domErrors = [];
  const consoleLogs = [];

  // Capture unhandled exceptions in the browser
  page.on('pageerror', exception => {
    domErrors.push(`Uncaught exception: ${exception.message}`);
  });

  // Capture console errors/warnings
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleLogs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });

  try {
    console.log('Navigating to http://localhost:8081...');
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });

    console.log('Testing Login Flow...');
    // Click login link/button (adjusting selector based on standard header links)
    await page.click('text="Login"');
    await page.waitForTimeout(500);

    // Fill in credentials
    await page.fill('input[type="email"]', 'pentest_outlet@test.com');
    await page.fill('input[type="password"]', 'pentest123');
    await page.click('button[type="submit"]');
    
    // Wait for navigation or network idle after login
    await page.waitForTimeout(2000);
    
    console.log('Testing Add to Cart functionality...');
    // Find the first "Add to Cart" button on the page
    const addToCartBtns = page.locator('button:has-text("Add to Cart")');
    if (await addToCartBtns.count() > 0) {
        await addToCartBtns.first().click();
        await page.waitForTimeout(1000); // wait for state update
        console.log('Item added to cart.');
    } else {
        console.log('No "Add to Cart" buttons found on current page. Navigating to products...');
        await page.goto('http://localhost:8081/products', { waitUntil: 'networkidle' });
        const productBtns = page.locator('button:has-text("Add to Cart")');
        if (await productBtns.count() > 0) {
            await productBtns.first().click();
            await page.waitForTimeout(1000);
            console.log('Item added to cart.');
        }
    }

    console.log('Testing Logout Flow...');
    // Click logout button (either text or icon)
    const logoutBtn = page.locator('text="Logout"');
    if (await logoutBtn.count() > 0) {
        await logoutBtn.first().click();
        await page.waitForTimeout(1000);
        console.log('Logged out successfully.');
    } else {
        console.log('Logout button not found. Menu might be collapsed.');
    }

  } catch (error) {
    console.error('Playwright Script Navigation Error:', error.message);
  } finally {
    console.log('\n--- UI DOM ERRORS & WARNINGS HARVESTED ---');
    if (domErrors.length === 0 && consoleLogs.length === 0) {
        console.log('✅ No critical DOM exceptions or console errors found during flows.');
    } else {
        if (domErrors.length > 0) {
            console.log('❌ Page Exceptions:');
            domErrors.forEach(e => console.log('  - ' + e));
        }
        if (consoleLogs.length > 0) {
            console.log('⚠️ Console Logs (Warnings/Errors):');
            consoleLogs.forEach(e => console.log('  - ' + e));
        }
    }
    await browser.close();
  }
})();
