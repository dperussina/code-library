'use strict';

/**
 * Demonstrates using setTimeout, clearTimeout, setInterval, and clearInterval.
 */
function demonstrateTimers() {
    console.log("Starting timer demonstrations...");
    console.log(`Time at start: ${new Date().toLocaleTimeString()}`);

    // --- setTimeout ---
    // Executes the callback function once after the specified delay (in milliseconds).
    // Returns a Timeout object which can be used with clearTimeout.
    console.log("\nScheduling setTimeout (2 seconds)...");
    const timeoutCallback = () => {
        console.log(`-> setTimeout executed! Time: ${new Date().toLocaleTimeString()}`);
    };
    const timeoutId = setTimeout(timeoutCallback, 2000); // 2 seconds

    console.log(`   setTimeout scheduled with ID: ${timeoutId}`);

    // --- clearTimeout ---
    // Example: Cancelling a timeout before it executes.
    const earlyTimeoutId = setTimeout(() => {
        console.log("-> This should NOT be logged (timeout was cleared).");
    }, 1000);
    console.log(`   Scheduled another timeout (ID: ${earlyTimeoutId}) to be cleared.`);
    clearTimeout(earlyTimeoutId);
    console.log(`   Timeout with ID ${earlyTimeoutId} cancelled.`);


    // --- setInterval ---
    // Executes the callback function repeatedly at the specified interval (in milliseconds).
    // Returns an Interval object which can be used with clearInterval.
    console.log("\nScheduling setInterval (every 0.5 seconds, stops after 3 ticks)...");
    let intervalCount = 0;
    const maxIntervals = 3;

    const intervalCallback = () => {
        intervalCount++;
        console.log(` -> setInterval tick #${intervalCount} / ${maxIntervals}. Time: ${new Date().toLocaleTimeString()}`);

        if (intervalCount >= maxIntervals) {
            // --- clearInterval ---
            // Stops the repeated execution of setInterval.
            clearInterval(intervalId); // Use the ID returned by setInterval
            console.log(`   clearInterval called for ID ${intervalId}.`);
            console.log("Timer demonstrations finished.");
        }
    };
    const intervalId = setInterval(intervalCallback, 500); // 0.5 seconds

    console.log(`   setInterval scheduled with ID: ${intervalId}`);

    // Note: The main script execution continues immediately after scheduling timers.
    // The Node.js process will stay alive as long as there are active timers (or other async ops).
}

// --- Example Usage ---
demonstrateTimers();
console.log("\nTimers scheduled, script continues execution...");
console.log("(Node process will exit automatically after timers complete unless other async ops are running)");


// Export functions if needed
// module.exports = { demonstrateTimers }; 