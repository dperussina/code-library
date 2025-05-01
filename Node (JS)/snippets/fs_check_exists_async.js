'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Checks if a path exists using fs.access (checks permissions/visibility).
 * This is often faster than fs.stat if you only need to know about existence.
 * @param {string} targetPath - Path to check.
 * @param {(error: Error | null, exists: boolean) => void} callback - Error-first callback. Error is null if accessible.
 */
function pathExistsAccessAsync(targetPath, callback) {
    const absolutePath = path.resolve(targetPath);
    console.log(`Checking path existence via fs.access: ${absolutePath}`);

    // fs.constants.F_OK checks for file existence (visibility to the process).
    // Other flags like R_OK, W_OK, X_OK check read/write/execute permissions.
    fs.access(absolutePath, fs.constants.F_OK, (err) => {
        const exists = !err; // If no error, it exists and is accessible
        if (err) {
             console.log(`fs.access reported error (path likely doesn't exist or no permission): ${err.code}`);
        } else {
             console.log("fs.access reported success (path exists and is accessible).");
        }
        // The callback pattern for access is slightly different:
        // error is non-null if access is denied/file doesn't exist.
        // We convert this to a boolean 'exists' flag.
        callback(null, exists); // We report 'null' for the error, and boolean for existence.
    });
     console.log("fs.access call initiated...");
}


/**
 * Checks if a path exists using fs.stat, which provides more details (file/dir type, size etc.).
 * Handles the specific 'ENOENT' error for non-existence.
 * @param {string} targetPath - Path to check.
 * @param {(error: Error | null, exists: boolean, stats: fs.Stats | null) => void} callback - Error-first callback.
 */
function pathExistsStatAsync(targetPath, callback) {
    const absolutePath = path.resolve(targetPath);
    console.log(`Checking path existence via fs.stat: ${absolutePath}`);

    fs.stat(absolutePath, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File or directory does not exist
                 console.log("fs.stat reported ENOENT (path does not exist).");
                return callback(null, false, null); // No error, just doesn't exist
            } else {
                // Other error (e.g., permission denied - EACCES)
                console.error(`fs.stat reported error for ${absolutePath}:`, err);
                return callback(err, false, null); // Pass the actual error
            }
        }
        // If no error, the path exists
        const isFile = stats.isFile();
        const isDir = stats.isDirectory();
        console.log(`fs.stat reported success. Is file: ${isFile}, Is directory: ${isDir}`);
        callback(null, true, stats); // No error, exists = true, return stats object
    });
    console.log("fs.stat call initiated...");
}

// --- Example Usage ---
const currentFile = __filename; // Path to this script file
const currentDir = __dirname;   // Path to the directory of this script
const nonExistent = path.join(__dirname, 'surely_does_not_exist.xyz');

console.log("--- Using fs.access ---");
pathExistsAccessAsync(currentFile, (err, exists) => {
    console.log(`Callback (access) - File ${path.basename(currentFile)} exists: ${exists}`);
});
pathExistsAccessAsync(currentDir, (err, exists) => {
    console.log(`Callback (access) - Directory ${path.basename(currentDir)} exists: ${exists}`);
});
pathExistsAccessAsync(nonExistent, (err, exists) => {
    console.log(`Callback (access) - Path ${path.basename(nonExistent)} exists: ${exists}`);
});

// Add a small delay to allow access callbacks to potentially finish before starting stat
setTimeout(() => {
    console.log("\n--- Using fs.stat ---");
    pathExistsStatAsync(currentFile, (err, exists, stats) => {
        console.log(`Callback (stat) - File ${path.basename(currentFile)} exists: ${exists}`);
        if (stats) console.log(`  File size: ${stats.size} bytes`);
    });
    pathExistsStatAsync(currentDir, (err, exists, stats) => {
        console.log(`Callback (stat) - Directory ${path.basename(currentDir)} exists: ${exists}`);
         if (stats) console.log(`  Is directory: ${stats.isDirectory()}`);
    });
    pathExistsStatAsync(nonExistent, (err, exists, stats) => {
        console.log(`Callback (stat) - Path ${path.basename(nonExistent)} exists: ${exists}`);
    });
}, 100);


module.exports = { pathExistsAccessAsync, pathExistsStatAsync }; 