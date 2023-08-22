const { chromium } = require("playwright");

async function recursionTest() {
  try {
    console.log("Running Recursion test...");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("http://localhost:3000/recursion");
    await page.waitForSelector(`input[value='init api']`);
    await page.click(`input[value='init api']`);
    await page.waitForSelector(`input[value='prove']`);
    await page.click(`input[value='prove']`);
    await page.waitForSelector(`input[value='proved']`);
    await page.click(`input[value='verify']`);
    await page.waitForSelector(`input[value='verified']`);
    await browser.close();
    console.log("Recursion test succeeded");
  } catch {
    console.log("Recursion test failed");
  }
}

module.exports = recursionTest;
