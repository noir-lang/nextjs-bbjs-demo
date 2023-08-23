const { chromium } = require("playwright");

async function recursionTest() {
  try {
    console.log("Running Recursion test...");

    console.log("Launching chromium browser...");
    const browser = await chromium.launch({ headless: true });

    console.log("Opening a new page...");
    const page = await browser.newPage();

    console.log("Navigating to http://localhost:3000/recursion...");
    await page.goto("http://localhost:3000/recursion");

    console.log("Waiting for `input[value='init api']` selector...");
    await page.waitForSelector(`input[value='init api']`);

    console.log("Clicking on `input[value='init api']` button...");
    await page.click(`input[value='init api']`);

    console.log("Waiting for `input[value='prove']` selector...");
    await page.waitForSelector(`input[value='prove']`);

    console.log("Clicking on `input[value='prove']` button...");
    await page.click(`input[value='prove']`);

    console.log("Waiting for `input[value='proved']` selector...");
    await page.waitForSelector(`input[value='proved']`);

    console.log("Clicking on `input[value='verify']` button...");
    await page.click(`input[value='verify']`);

    console.log("Waiting for `input[value='verified']` selector...");
    await page.waitForSelector(`input[value='verified']`);

    console.log("Closing the browser...");
    await browser.close();

    console.log("Recursion test succeeded");
  } catch {
    console.error("An error occurred during the Recursion test.");
    throw new Error("Recursion test failed");
  }
}

module.exports = recursionTest;
