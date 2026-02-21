const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    console.log("Navigating to localhost:3000...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    console.log("Hovering Features button...");
    const buttons = await page.$$('button');
    let button = null;
    for (const b of buttons) {
        const text = await page.evaluate(el => el.textContent, b);
        if (text.includes('Features')) {
            button = b;
            break;
        }
    }
    if (button) {
        await button.hover();

        console.log("Waiting for dropdown animation...");
        await new Promise(r => setTimeout(r, 1000));

        const screenshotPath = path.join(process.cwd(), 'dropdown-fix-test.png');
        await page.screenshot({ path: screenshotPath });
        console.log("Screenshot saved to: " + screenshotPath);

        const data = await page.evaluate(() => {
            const viewport = document.querySelector('nav > div[style*="--radix-navigation-menu-viewport-width"]');
            const content = document.querySelector('[data-state="open"]')?.nextElementSibling;

            return {
                viewport: viewport ? {
                    width: viewport.offsetWidth,
                    cssWidth: viewport.style.getPropertyValue('--radix-navigation-menu-viewport-width')
                } : 'Viewport not found',
                content: content ? {
                    width: content.offsetWidth,
                    rect: content.getBoundingClientRect()
                } : 'Content not found'
            };
        });
        console.log("Measurements:", JSON.stringify(data, null, 2));
    } else {
        console.log("Features button not found!");
    }

    await browser.close();
})();
