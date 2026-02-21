const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 4000 });

    console.log("Navigating to localhost:3000...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    console.log("Taking Light Mode screenshot...");
    await page.screenshot({ path: 'C:\\Users\\aksp2\\.gemini\\antigravity\\brain\\c9858528-779d-4637-8c82-4f0a2a51c5ac\\landing_page_marketing_light.webp', type: 'webp', fullPage: true });

    console.log("Switching to Dark Mode...");
    await page.evaluate(() => {
        // Find the Moon/Sun SVG in the Navbar
        const svgs = Array.from(document.querySelectorAll('nav svg'));
        for (let svg of svgs) {
            if (svg.classList.contains('lucide-sun') || svg.classList.contains('lucide-moon')) {
                const btn = svg.closest('button');
                if (btn) btn.click();
                return;
            }
        }
    });

    console.log("Waiting for transition...");
    await new Promise(r => setTimeout(r, 1000));

    console.log("Taking Dark Mode screenshot...");
    await page.screenshot({ path: 'C:\\Users\\aksp2\\.gemini\\antigravity\\brain\\c9858528-779d-4637-8c82-4f0a2a51c5ac\\landing_page_marketing_dark.webp', type: 'webp', fullPage: true });

    await browser.close();
    console.log("Done.");
})();
