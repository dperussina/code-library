'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Reads a text file synchronously using fs.readFileSync.
 * This BLOCKS the Node.js event loop until the file is read.
 * Use with caution, typically only for initialization or simple scripts.
 * @param {string} filepath - Path to the file (relative or absolute).
 * @returns {string[] | null} An array of lines from the file, or null on error.
 */
function readTextFileSync(filepath) {
    const absolutePath = path.resolve(filepath); // Ensure absolute path
    console.log(`Attempting to read file synchronously: ${absolutePath}`);

    try {
        // The { encoding: 'utf8' } option returns a string directly.
        // Without it, a Buffer object would be returned.
        const data = fs.readFileSync(absolutePath, { encoding: 'utf8' });
        const lines = data.split(/\r?\n/); // Handle different line endings
        // Optionally trim lines: const lines = data.split(/\r?\n/).map(line => line.trim());
        console.log(`Successfully read ${lines.length} lines synchronously from ${absolutePath}`);
        return lines;
    } catch (err) {
        // Common errors: ENOENT (Not Found), EACCES (Permission Denied)
        console.error(`Error reading file synchronously ${absolutePath}:`, err);
        return null; // Indicate failure
    }
}

// --- Example Usage ---
const testFilePath = path.join(__dirname, '..', 'basic-examples.md'); // Example: Read the basic-examples.md file
const nonExistentPath = path.join(__dirname, 'non_existent_file_sync.txt');

console.log("--- Reading existing file synchronously ---");
const syncLines = readTextFileSync(testFilePath);
if (syncLines) {
    console.log(`Sync Read: Successfully read ${syncLines.length} lines.`);
    console.log("Sync Read: First 5 lines:", syncLines.slice(0, 5));
} else {
     console.log("Sync Read: Failed to read existing file.");
}


console.log("\n--- Reading non-existent file synchronously ---");
const nonExistentLines = readTextFileSync(nonExistentPath);
if (nonExistentLines === null) {
    console.log("Sync Read: Correctly failed to read non-existent file (returned null).");
} else {
    console.log("Sync Read: Unexpectedly read non-existent file?");
}

console.log("\n--- Note: Script execution was blocked during synchronous reads ---");

module.exports = { readTextFileSync }; 