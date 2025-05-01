'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Reads a text file asynchronously using fs.readFile.
 * This is non-blocking and suitable for server environments.
 * @param {string} filepath - Path to the file (relative or absolute).
 * @param {(error: Error | null, lines: string[] | null) => void} callback - Error-first callback.
 */
function readTextFileAsync(filepath, callback) {
    const absolutePath = path.resolve(filepath); // Ensure absolute path
    console.log(`Attempting to read file asynchronously: ${absolutePath}`);

    fs.readFile(absolutePath, { encoding: 'utf8' }, (err, data) => {
        if (err) {
            // Common errors: ENOENT (Not Found), EACCES (Permission Denied)
            console.error(`Error reading file ${absolutePath}:`, err);
            return callback(err, null); // Pass the error to the callback
        }

        // Process the data (e.g., split into lines)
        try {
            const lines = data.split(/\r?\n/); // Handle different line endings
            // Optionally trim lines: const lines = data.split(/\r?\n/).map(line => line.trim());
            console.log(`Successfully read ${lines.length} lines from ${absolutePath}`);
            callback(null, lines); // Success: null error, pass the lines array
        } catch (processingErr) {
             console.error(`Error processing file data from ${absolutePath}:`, processingErr);
             callback(processingErr, null); // Pass processing error
        }
    });
     console.log("readFile call initiated (callback will execute later)...");
}

// --- Example Usage ---
const testFilePath = path.join(__dirname, '..', 'basic-examples.md'); // Example: Read the basic-examples.md file
const nonExistentPath = path.join(__dirname, 'non_existent_file.txt');

console.log("--- Reading existing file ---");
readTextFileAsync(testFilePath, (error, lines) => {
    if (error) {
        console.log("Callback: Failed to read existing file.");
        // Handle error appropriately (e.g., return error response in API)
        return;
    }
    if (lines) {
        console.log(`Callback: Successfully read ${lines.length} lines.`);
        console.log("Callback: First 5 lines:", lines.slice(0, 5));
    }
});

console.log("\n--- Reading non-existent file ---");
readTextFileAsync(nonExistentPath, (error, lines) => {
     if (error) {
        console.log(`Callback: Expected error reading non-existent file: ${error.code}`); // e.g., ENOENT
        return;
    }
    // This part should not be reached if the file doesn't exist
     console.log("Callback: Unexpectedly read non-existent file?");
});

module.exports = { readTextFileAsync }; 