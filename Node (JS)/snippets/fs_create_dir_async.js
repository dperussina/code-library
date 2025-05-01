'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Creates a directory asynchronously using fs.mkdir.
 * The `recursive: true` option creates parent directories as needed (like mkdir -p).
 * It does not throw an error if the directory already exists.
 * @param {string} dirPath - Path to the directory to create.
 * @param {(error: Error | null) => void} callback - Error-first callback.
 */
function createDirectoryAsync(dirPath, callback) {
    const absolutePath = path.resolve(dirPath);
    console.log(`Attempting to ensure directory exists asynchronously: ${absolutePath}`);

    const options = {
        recursive: true // Create parent directories if they don't exist
    };

    fs.mkdir(absolutePath, options, (err) => {
        if (err) {
            // fs.mkdir with recursive: true does NOT error if the directory already exists (unlike the older non-recursive behavior)
            // We only need to check for errors other than 'EEXIST' (though even EEXIST shouldn't happen with recursive)
            // Common errors: EACCES (permission), ENOTDIR (part of the path is a file)
            console.error(`Error creating directory ${absolutePath}:`, err);
            return callback(err);
        }

        console.log(`Directory ensured (created or already exists): ${absolutePath}`);
        callback(null); // Success
    });
     console.log("mkdir call initiated (callback will execute later)...");
}

// --- Example Usage ---
const newDirPath = path.join(__dirname, 'output_files', 'new_nested_dir', 'subdir');
const existingDirPath = path.join(__dirname); // Current directory (already exists)
const filePathAsDir = path.join(__dirname, path.basename(__filename)); // Path to this file
const restrictedPath = path.join('/root', 'cannot_create_here'); // Likely permission error

console.log("--- Creating New Nested Directory ---");
createDirectoryAsync(newDirPath, (error) => {
    if (error) {
         console.log("Callback: Failed to create new directory.");
    } else {
        console.log("Callback: New directory ensured successfully.");
        // Verify it exists (optional)
        if (fs.existsSync(newDirPath)) {
            console.log(`   Verification: Directory ${newDirPath} now exists.`);
             // Clean up the created directory (optional)
             // fs.rmdirSync(path.dirname(newDirPath), { recursive: true }); // remove parent 'new_nested_dir'
        } else {
             console.warn("   Verification: Directory creation reported success, but fs.existsSync failed?");
        }
    }
});

console.log("\n--- Ensuring Existing Directory ---");
createDirectoryAsync(existingDirPath, (error) => {
    if (error) {
        console.log("Callback: Failed ensuring existing directory (unexpected).");
    } else {
        console.log("Callback: Existing directory ensured successfully (no error as expected).");
    }
});

console.log("\n--- Attempting to Create Directory at File Path ---");
createDirectoryAsync(filePathAsDir, (error) => {
    if (error) {
        console.log(`Callback: Expected error creating directory at file path: ${error.code}`); // e.g., EEXIST or ENOTDIR depending on OS/Node version behavior with recursive
    } else {
        console.log("Callback: Unexpectedly created directory at file path?");
    }
});

console.log("\n--- Attempting to Create Directory with No Permission ---");
createDirectoryAsync(restrictedPath, (error) => {
    if (error) {
        console.log(`Callback: Expected error creating directory without permission: ${error.code}`); // e.g., EACCES or EPERM
    } else {
        console.log("Callback: Unexpectedly created directory without permission?");
    }
});


module.exports = { createDirectoryAsync }; 