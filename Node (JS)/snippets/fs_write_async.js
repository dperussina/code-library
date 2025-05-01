'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Writes or appends content to a text file asynchronously.
 * Uses fs.writeFile (overwrites) or fs.appendFile (adds to end). Non-blocking.
 * @param {string} filepath - Path to the file (relative or absolute).
 * @param {string | Buffer} content - The content to write.
 * @param {boolean} [append=false] - If true, append to the file; otherwise, overwrite.
 * @param {(error: Error | null) => void} callback - Error-first callback.
 */
function writeTextFileAsync(filepath, content, append = false, callback) {
    const absolutePath = path.resolve(filepath);
    const operation = append ? fs.appendFile : fs.writeFile;
    const mode = append ? 'appending to' : 'writing to';
    const options = { encoding: 'utf8' }; // Specify encoding

    console.log(`Attempting ${mode} file asynchronously: ${absolutePath}`);

    operation(absolutePath, content, options, (err) => {
        if (err) {
             // Common errors: EACCES (Permission denied), ENOENT (if parent dir doesn't exist for writeFile)
            console.error(`Error ${mode} file ${absolutePath}:`, err);
            return callback(err); // Pass error to callback
        }
        // Note: Content length might not be accurate for Buffers if using default toString()
        const contentLength = typeof content === 'string' ? content.length : content.byteLength;
        console.log(`Successfully ${mode} ${absolutePath} (${contentLength} bytes/chars)`);
        callback(null); // Indicate success
    });
    console.log("writeFile/appendFile call initiated (callback will execute later)...");
}

// --- Example Usage ---
const outputDir = path.join(__dirname, 'output_files');
const filePathWrite = path.join(outputDir, 'output_write.txt');
const filePathAppend = path.join(outputDir, 'output_append.log');

// Ensure output directory exists (using synchronous version for simplicity here)
try {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
        console.log(`Created output directory: ${outputDir}`);
    }
} catch (err) {
    console.error("Could not create output directory:", err);
    // Exit or handle error appropriately if directory is essential
    // process.exit(1);
}


console.log("\n--- Writing (Overwrite) Example ---");
const contentToWrite = `Timestamp: ${new Date().toISOString()}\nThis file will be overwritten.\n`;
writeTextFileAsync(filePathWrite, contentToWrite, false, (error) => {
    if (error) {
        console.log("Callback: Failed to write file.");
    } else {
        console.log("Callback: File write successful.");
        // Example: Read it back to verify (async)
        fs.readFile(filePathWrite, 'utf8', (err, data) => {
             if (!err) console.log(`   Read back content: "${data.trim()}"`);
        });
    }
});


console.log("\n--- Appending Example ---");
const contentToAppend = `Log Entry: ${new Date().toLocaleTimeString()}\n`;
// Call append multiple times to see effect
writeTextFileAsync(filePathAppend, contentToAppend, true, (error) => {
     if (error) console.log("Callback: Failed to append (1st time).");
     else console.log("Callback: Append successful (1st time).");
});

setTimeout(() => { // Simulate appending later
     writeTextFileAsync(filePathAppend, `Another Log: ${new Date().toLocaleTimeString()}\n`, true, (error) => {
        if (error) console.log("Callback: Failed to append (2nd time).");
        else {
             console.log("Callback: Append successful (2nd time).");
             // Read back final appended content
             fs.readFile(filePathAppend, 'utf8', (err, data) => {
                if (!err) console.log(`   Read back appended content:\n---\n${data.trim()}\n---`);
             });
        }
     });
}, 100); // Append after a short delay


module.exports = { writeTextFileAsync }; 