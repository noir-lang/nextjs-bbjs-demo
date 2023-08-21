const multithreadingTest = require("./multithreading.test");
const recursionTest = require("./recursion.test");

async function main() {
  try {
    await multithreadingTest();
    await recursionTest();
  } catch (error) {
    console.error(error);
  }
}

main();
