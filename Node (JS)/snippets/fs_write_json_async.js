'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Converts a JavaScript object to a JSON string and writes it to a file asynchronously.
 * Handles potential errors during JSON stringification and file writing.
 * @param {string} filepath - Path to the file where JSON will be written.
 * @param {object} data - The JavaScript object or array to write.
 * @param {(error: Error | null) => void} callback - Error-first callback.
 */
function writeJsonFileAsync(filepath, data, callback) {
    const absolutePath = path.resolve(filepath);
    console.log(`Attempting to stringify and write JSON to file asynchronously: ${absolutePath}`);

    let jsonString;
    try {
        // Use JSON.stringify with indentation for readability
        // The replacer function (null) and space argument (2) control formatting.
        jsonString = JSON.stringify(data, null, 2);
    } catch (stringifyErr) {
        // Handle errors like circular references
        console.error(`Error stringifying data for ${absolutePath}:`, stringifyErr);
        // Ensure callback is called asynchronously even on sync error
        process.nextTick(() => callback(stringifyErr));
        return; // Stop execution
    }

    fs.writeFile(absolutePath, jsonString, { encoding: 'utf8' }, (writeErr) => {
        if (writeErr) {
            console.error(`Error writing JSON to ${absolutePath}:`, writeErr);
            return callback(writeErr);
        }
        console.log(`Successfully wrote JSON (${jsonString.length} bytes) to ${absolutePath}`);
        callback(null); // Indicate success
    });
     console.log("writeFile call for JSON initiated (callback will execute later)...");
}

// --- Example Usage ---
const outputDir = path.join(__dirname, 'output_files');
const outputJsonPath = path.join(outputDir, 'output_data.json');
const errorJsonPath = path.join('/root', 'no_permission_data.json'); // Example invalid path

// Ensure output directory exists
try {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
} catch (err) { console.error("Could not ensure output directory:", err); }


console.log("\n--- Writing Valid Data ---");
const myData = {
    user: "node_dev",
    timestamp: Date.now(),
    settings: [1, 2, { nested: true }],
    active: true
};
writeJsonFileAsync(outputJsonPath, myData, (error) => {
    if (error) {
        console.log("Callback: Failed to write JSON data.");
    } else {
        console.log("Callback: JSON data write successful.");
        // Optionally read back to verify
        fs.readFile(outputJsonPath, 'utf8', (err, data) => {
            if (!err) console.log(`   Read back JSON:\n${data}`);
        });
    }
});

// Example with circular reference (will cause stringify error)
console.log("\n--- Writing Data with Circular Reference (Error Expected) ---");
const circularData = { name: "Circular" };
circularData.self = circularData; // Create circular reference

writeJsonFileAsync(path.join(outputDir, 'circular_error.json'), circularData, (error) => {
    if (error) {
        console.log(`Callback: Expected error stringifying circular data: ${error.name} - ${error.message}`);
    } else {
        console.log("Callback: Unexpectedly succeeded writing circular data?");
    }
});

// Example writing to a path likely to cause permission error
console.log("\n--- Writing Data with Permission Error (Error Expected) ---");
writeJsonFileAsync(errorJsonPath, { test: "no permission" }, (error) => {
     if (error) {
        console.log(`Callback: Expected error writing to restricted path: ${error.code}`); // e.g., EACCES or EPERM
    } else {
        console.log("Callback: Unexpectedly succeeded writing to restricted path?");
    }
});


module.exports = { writeJsonFileAsync }; 