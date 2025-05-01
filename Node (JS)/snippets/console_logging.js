'use strict';

/**
 * Demonstrates various console logging methods available in Node.js.
 */
function demonstrateLogging() {
    console.log("\n--- Basic Console Logging ---");

    // console.log: General purpose logging to stdout. Handles multiple arguments, object formatting.
    console.log("Simple log message.");
    const count = 42;
    const user = { id: 1, name: "Alice", city: "Wonderland" };
    console.log("Logging multiple values:", count, user.name, true);
    console.log("Logging an object:", user); // Node often pretty-prints objects

    // console.info: Alias for console.log. Sometimes used for informational messages.
    console.info("Informational message (behaves like log):", count);

    // console.warn: Outputs to stderr. Often used for potential issues or deprecations.
    console.warn("This is a warning message.");
    console.warn("Warning with object:", { code: "DEPRECATED", details: "Use new API" });

    // console.error: Outputs to stderr. Used for errors.
    console.error("An error occurred!");
    console.error("Error with Error object:", new Error("Something specific went wrong"));

    // --- Formatting ---
    console.log("\n--- Formatting Output ---");
    // %s (string), %d/%i (integer), %f (float), %o/%O (object)
    console.log("Formatted string: %s, Integer: %d, Float: %f", "hello", 123, 3.14);
    console.log("Object (optimally useful): %o", user); // Often better inspection than default
    console.log("Object (generic JS object): %O", user);

    // --- Timing ---
    console.log("\n--- Timing Operations ---");
    console.time("myOperation"); // Start a timer with a label
    // Simulate some work
    let sum = 0;
    for (let i = 0; i < 1e6; i++) { sum += i; }
    console.log("Work finished.");
    console.timeEnd("myOperation"); // Stop the timer and log elapsed time

    console.timeLog("myOperation", "Log message during timing"); // Log during timing without stopping

    // --- Counting ---
    console.log("\n--- Counting Occurrences ---");
    console.count("default"); // Count occurrences of a label
    console.count("eventA");
    console.count("default");
    console.count("eventA");
    console.count("eventA");
    console.countReset("eventA"); // Reset the counter for a label
    console.count("eventA");

    // --- Grouping ---
    console.log("\n--- Grouping Output ---");
    console.group("Outer Group"); // Start an indented group
    console.log("Message inside outer group.");
    console.groupCollapsed("Inner Group (Collapsed)"); // Start collapsed group
    console.log("Message inside inner group.");
    console.groupEnd(); // End inner group
    console.log("Back in outer group.");
    console.groupEnd(); // End outer group
    console.log("Outside all groups.");

    // --- Tracing ---
    console.log("\n--- Stack Traces ---");
    function innerFunction() {
        console.trace("Trace from innerFunction:"); // Print stack trace
    }
    function outerFunction() {
        innerFunction();
    }
    outerFunction();

    // --- Assertions ---
    console.log("\n--- Assertions ---");
    const condition = false;
    console.assert(condition, "Assertion failed: condition was false!", "More details.");
    // Logs the message only if the first argument is falsy.

    // --- Clearing ---
    // console.clear(); // Clears the console (behavior might vary depending on terminal)
    console.log("This message might appear after a clear, depending on the terminal.");

    // --- Table ---
    console.log("\n--- Displaying Tabular Data ---");
    const usersArray = [
        { name: "Alice", age: 30, city: "London" },
        { name: "Bob", age: 25, city: "Paris" },
        { name: "Charlie", age: 35, city: "New York" },
    ];
    const usersObject = {
         alice: { age: 30, city: "London" },
         bob: { age: 25, city: "Paris" },
         charlie: { age: 35, city: "New York" },
    };
    console.table(usersArray); // Display array of objects as a table
    console.table(usersObject); // Display object of objects as a table
    console.table(usersArray, ["name", "city"]); // Select specific columns

}

// --- Example Usage ---
demonstrateLogging();

// module.exports = { demonstrateLogging }; 