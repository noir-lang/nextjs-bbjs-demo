const puppeteer = require("puppeteer");

async function multithreadingTest() {
  try {
    console.log("Running Multithreading test...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("http://localhost:3000/multithreading");
    await page.waitForSelector(`[data-test-id='blake2s-success']`);
    await page.waitForSelector(`[data-test-id='blake2sToField-success']`);
    await browser.close();
    console.log("Multithreading test succeeded");
  } catch {
    console.log("Multithreading test failed");
  }
}

module.exports = multithreadingTest;
