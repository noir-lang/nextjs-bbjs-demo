const { chromium } = require("playwright");

async function multithreadingTest() {
  try {
    console.log("Running Multithreading test...");

    console.log("Launching chromium browser...");
    const browser = await chromium.launch({ headless: false });

    console.log("Opening a new page...");
    const page = await browser.newPage();

    console.log("Navigating to http://localhost:3000/multithreading...");
    await page.goto("http://localhost:3000/multithreading");

    console.log("Waiting for [data-test-id='blake2s-success'] selector...");
    await page.waitForSelector(`[data-test-id='blake2s-success']`);

    console.log(
      "Waiting for [data-test-id='blake2sToField-success'] selector..."
    );
    await page.waitForSelector(`[data-test-id='blake2sToField-success']`);

    console.log("Closing the browser...");
    await browser.close();

    console.log("Multithreading test succeeded");
  } catch (e) {
    console.error("An error occurred during the Multithreading test.");
    throw new Error(e);
  }
}

module.exports = multithreadingTest;
