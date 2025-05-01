'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Lists the contents of a directory asynchronously using fs.readdir.
 * Can return simple names or fs.Dirent objects for more info.
 * @param {string} directoryPath - Path to the directory.
 * @param {boolean} [withFileTypes=true] - If true, returns fs.Dirent objects.
 * @param {(error: Error | null, entries: string[] | fs.Dirent[] | null) => void} callback - Error-first callback.
 */
function listDirectoryAsync(directoryPath, withFileTypes = true, callback) {
    const absolutePath = path.resolve(directoryPath);
    console.log(`Attempting to list directory contents asynchronously: ${absolutePath}`);

    const options = {
        encoding: 'utf8', // Generally recommended, though often defaults ok
        withFileTypes: withFileTypes // Get Dirent objects
    };

    fs.readdir(absolutePath, options, (err, entries) => {
        if (err) {
            // Common errors: ENOENT (Not Found), ENOTDIR (Not a Directory), EACCES (Permission)
            console.error(`Error reading directory ${absolutePath}:`, err);
            return callback(err, null);
        }

        console.log(`Successfully listed ${entries.length} entries in ${absolutePath}`);
        callback(null, entries); // Success: null error, pass entries
    });
     console.log("readdir call initiated (callback will execute later)...");
}

// --- Example Usage ---
const currentDir = __dirname; // Directory of the current script
const parentDir = path.join(__dirname, '..'); // Parent directory
const nonExistentDir = path.join(__dirname, 'non_existent_dir');
const filePathAsDir = path.join(__dirname, path.basename(__filename)); // Use this file's path

console.log("--- Listing Current Directory (with Dirent) ---");
listDirectoryAsync(currentDir, true, (error, entries) => {
    if (error) {
         console.log("Callback: Failed to list current directory.");
    } else if (entries) {
        console.log(`Callback: Found ${entries.length} entries:`);
        entries.forEach(entry => {
             const type = entry.isDirectory() ? 'Dir' : entry.isFile() ? 'File' : 'Other';
             console.log(`  - ${entry.name} (${type})`);
        });
    }
});

console.log("\n--- Listing Parent Directory (names only) ---");
listDirectoryAsync(parentDir, false, (error, names) => {
     if (error) {
         console.log("Callback: Failed to list parent directory.");
    } else if (names) {
        console.log(`Callback: Found ${names.length} names in parent:`, names.slice(0, 10)); // Show first 10
    }
});

console.log("\n--- Listing Non-Existent Directory ---");
listDirectoryAsync(nonExistentDir, true, (error, entries) => {
    if (error) {
         console.log(`Callback: Expected error listing non-existent directory: ${error.code}`); // e.g., ENOENT
    } else {
        console.log("Callback: Unexpectedly listed non-existent directory?");
    }
});

console.log("\n--- Listing a File Path (expecting ENOTDIR) ---");
listDirectoryAsync(filePathAsDir, true, (error, entries) => {
    if (error) {
         console.log(`Callback: Expected error listing a file path: ${error.code}`); // e.g., ENOTDIR
    } else {
        console.log("Callback: Unexpectedly listed a file path?");
    }
});

module.exports = { listDirectoryAsync }; 