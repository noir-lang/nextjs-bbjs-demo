const { chromium } = require("playwright");

async function multithreadingTest() {
  try {
    console.log("Running Multithreading test...");
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("http://localhost:3000/multithreading");
    await page.waitForSelector(`[data-test-id='blake2s-success']`);
    await page.waitForSelector(`[data-test-id='blake2sToField-success']`);
    await browser.close();
    console.log("Multithreading test succeeded");
  } catch {
    throw new Error("Multithreading test failed");
  }
}

module.exports = multithreadingTest;
