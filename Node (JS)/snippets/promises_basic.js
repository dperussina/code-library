'use strict';

/**
 * Function that returns a Promise simulating an asynchronous operation.
 * @param {boolean} shouldSucceed - Determines if the promise should resolve or reject.
 * @param {number} [delayMs=100] - Delay in milliseconds to simulate async work.
 * @returns {Promise<object>} A promise that resolves with data or rejects with an error.
 */
function simulateAsyncTask(shouldSucceed, delayMs = 100) {
    console.log(`Starting simulated async task (will ${shouldSucceed ? 'succeed' : 'fail'} in ${delayMs}ms)...`);
    // The Promise constructor takes an 'executor' function with resolve and reject arguments.
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldSucceed) {
                console.log(" -> Async task succeeded!");
                // Call resolve() with the result value when the operation is successful.
                resolve({ data: "Task completed successfully", timestamp: Date.now() });
            } else {
                console.log(" -> Async task failed!");
                // Call reject() with an Error object when the operation fails.
                reject(new Error("Task failed due to simulated error"));
            }
        }, delayMs);
    });
}

/**
 * Demonstrates consuming promises using .then(), .catch(), and .finally().
 */
async function demonstratePromiseConsumption() {
    console.log("\n--- Consuming Promise (Success Scenario) ---");
    // --- Scenario 1: Success ---
    await simulateAsyncTask(true, 150)
        .then(result => {
            // .then() is called when the promise RESOLVES.
            // It receives the value passed to resolve().
            console.log("  .then() #1: Promise resolved. Result:", result);
            // The return value of .then() becomes the resolved value for the next .then() in the chain.
            return `Processed: ${result.data}`;
        })
        .then(processedResult => {
            // This .then() receives the value returned from the previous .then().
            console.log("  .then() #2: Chained result:", processedResult);
        })
        .catch(error => {
            // .catch() is called if the promise REJECTS at any point in the preceding chain.
            // It receives the value passed to reject() (usually an Error object).
            console.error("  .catch(): Caught an error (should NOT happen in success scenario):", error.message);
        })
        .finally(() => {
            // .finally() is always called, regardless of whether the promise resolved or rejected.
            // Useful for cleanup operations (e.g., closing connections, hiding loading indicators).
            // It does not receive the result or error.
            console.log("  .finally(): Executed (Success Scenario).");
        });

    console.log("\n--- Consuming Promise (Failure Scenario) ---");
    // --- Scenario 2: Failure ---
    await simulateAsyncTask(false, 200) // Use await to ensure this runs after the first one
        .then(result => {
            // This .then() will be skipped because the promise rejects.
            console.log("  .then(): Promise resolved (should NOT happen in failure scenario):", result);
        })
        .catch(error => {
            // This .catch() will execute because the promise rejected.
            console.error("  .catch(): Caught an error (expected in failure scenario):", error.message);
            // You can handle the error here, log it, or potentially recover.
            // If you return a value from .catch(), the promise chain continues as RESOLVED
            // return "Recovered from error";
            // If you re-throw or throw a new error, the chain remains REJECTED
             throw new Error("Propagating error after catch");
        })
         .then(recoveredValue => {
             // This .then() would only run if the preceding .catch() returned a value instead of throwing.
             console.log("  .then() after catch: Received recovered value:", recoveredValue);
         })
         .catch(propagatedError => {
             // This .catch() catches the error thrown from the previous .catch().
              console.error("  .catch() #2: Caught propagated error:", propagatedError.message);
         })
        .finally(() => {
            // This .finally() still executes even after multiple catches.
            console.log("  .finally(): Executed (Failure Scenario).");
        });

     console.log("\n--- Promise consumption demonstrated ---");
}

// --- Example Usage ---
// Using an async IIFE (Immediately Invoked Function Expression) to use await at top level
(async () => {
    await demonstratePromiseConsumption();
})();


module.exports = { simulateAsyncTask, demonstratePromiseConsumption }; 