'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Reads and parses a JSON file asynchronously.
 * Handles both file reading errors and JSON parsing errors.
 * @param {string} filepath - Path to the JSON file.
 * @param {(error: Error | null, data: object | null) => void} callback - Error-first callback.
 */
function readJsonFileAsync(filepath, callback) {
    const absolutePath = path.resolve(filepath);
    console.log(`Attempting to read and parse JSON file asynchronously: ${absolutePath}`);

    fs.readFile(absolutePath, { encoding: 'utf8' }, (fileErr, fileData) => {
        if (fileErr) {
            console.error(`Error reading JSON file ${absolutePath}:`, fileErr);
            return callback(fileErr, null); // File reading error
        }

        // If file read succeeds, try parsing
        try {
            const jsonData = JSON.parse(fileData);
            console.log(`Successfully parsed JSON from ${absolutePath}`);
            callback(null, jsonData); // Success: null error, parsed data
        } catch (parseErr) {
            // Handle JSON specific errors (SyntaxError)
            console.error(`Error parsing JSON from ${absolutePath}:`, parseErr);
            // You might want to wrap the parseErr in a more specific error type
            // const parsingError = new Error(`Invalid JSON format in ${absolutePath}: ${parseErr.message}`);
            // parsingError.cause = parseErr; // Link original error if needed (newer Node versions)
            callback(parseErr, null); // JSON parsing error
        }
    });
    console.log("readFile call for JSON initiated (callback will execute later)...");
}

// --- Example Usage ---
// Create dummy JSON files for testing
const outputDir = path.join(__dirname, 'output_files');
const validJsonPath = path.join(outputDir, 'valid.json');
const invalidJsonPath = path.join(outputDir, 'invalid.json');
const nonExistentJsonPath = path.join(outputDir, 'non_existent.json');

try {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    fs.writeFileSync(validJsonPath, JSON.stringify({ name: "Example JSON", version: 1.0, enabled: true }, null, 2));
    fs.writeFileSync(invalidJsonPath, '{ "name": "Invalid JSON", "version": 1.0, enabled: true, }'); // Extra comma makes it invalid
    console.log("Created dummy JSON files for testing.");
} catch (err) {
    console.error("Could not create dummy JSON files:", err);
}

console.log("\n--- Reading Valid JSON ---");
readJsonFileAsync(validJsonPath, (error, data) => {
    if (error) {
        console.log("Callback: Failed to read valid JSON.");
    } else {
        console.log("Callback: Successfully read valid JSON:", data);
        console.log(`Callback: Data Name: ${data?.name}`);
    }
});

console.log("\n--- Reading Invalid JSON ---");
readJsonFileAsync(invalidJsonPath, (error, data) => {
    if (error) {
        console.log(`Callback: Expected error reading invalid JSON: ${error.name} - ${error.message.split('\n')[0]}`); // Show error type/message
    } else {
        console.log("Callback: Unexpectedly succeeded reading invalid JSON?");
    }
});

console.log("\n--- Reading Non-Existent JSON ---");
readJsonFileAsync(nonExistentJsonPath, (error, data) => {
    if (error) {
        console.log(`Callback: Expected error reading non-existent JSON: ${error.code}`); // e.g., ENOENT
    } else {
        console.log("Callback: Unexpectedly succeeded reading non-existent JSON?");
    }
});

module.exports = { readJsonFileAsync }; 