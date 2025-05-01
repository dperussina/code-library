'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline'); // Node's built-in module for reading streams line by line

/**
 * Processes a large file line by line using Readable Streams and readline.
 * Avoids loading the entire file into memory.
 * Demonstrates async iteration (`for await...of`) over readline interface.
 *
 * @async
 * @param {string} filepath - Path to the large file to read.
 * @returns {Promise<{lineCount: number, charCount: number}>} A promise that resolves with the total line and character count.
 * @throws {Error} Throws an error if the file cannot be read or processed.
 */
async function processFileStreamByLine(filepath) {
    const absolutePath = path.resolve(filepath);
    console.log(`Starting to stream file by line: ${absolutePath}`);
    let lineCount = 0;
    let charCount = 0;
    let fileStream; // Declare here for potential access in finally block

    try {
        // Check if file exists first (optional, but improves error message)
        await fs.promises.access(absolutePath, fs.constants.R_OK);

        // Create a readable stream for the file
        fileStream = fs.createReadStream(absolutePath, { encoding: 'utf8' });

        // Handle stream errors (e.g., file disappears during read)
        fileStream.on('error', (err) => {
            console.error(`Error during file stream reading: ${err.message}`);
            // No need to explicitly reject here, error will propagate via readline/for-await
        });

        // Create a readline interface to process the stream line by line
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity // Important to handle both \n and \r\n line endings correctly
        });

        // Use async iteration (for await...of) to process lines as they become available
        console.log("Starting line-by-line processing...");
        for await (const line of rl) {
            lineCount++;
            charCount += line.length; // Add length of the current line

            // --- Your line processing logic goes here ---
            // Example: Log every 100,000 lines to show progress
            if (lineCount % 100000 === 0) {
                console.log(`  Processed ${lineCount} lines...`);
            }
            // Example: Find lines containing a specific keyword
            // if (line.includes('ERROR')) {
            //     console.warn(`  Found 'ERROR' on line ${lineCount}: ${line.substring(0, 100)}...`);
            // }
            // --------------------------------------------
        }

        // Note: 'close' event on readline or fileStream isn't strictly needed
        // when using `for await...of`, as the loop completes when the stream ends.

        console.log(`Finished streaming. Total lines: ${lineCount}, Total characters: ${charCount}`);
        return { lineCount, charCount };

    } catch (err) {
        // Catch errors like file not found (from fs.promises.access) or other stream issues
        console.error(`Error processing file stream for ${absolutePath}:`, err);
        throw err; // Re-throw the error for the caller to handle
    }
    // No finally block needed to close the stream explicitly here,
    // as readline and the underlying fs stream handle closure when iteration ends or error occurs.
}

// --- Example Usage ---
async function main() {
    const dummyFilePath = path.join(__dirname, 'large_dummy_file.log');

    // Create a large dummy file for testing (if it doesn't exist)
    const fileSizeMB = 5; // Adjust size as needed
    const lineContent = "This is a sample line of text for the large log file simulation.\n";
    const targetSize = fileSizeMB * 1024 * 1024;
    const linesNeeded = Math.ceil(targetSize / lineContent.length);

    try {
        if (!fs.existsSync(dummyFilePath)) {
            console.log(`Creating a large dummy file (${fileSizeMB}MB): ${dummyFilePath}`);
            const writer = fs.createWriteStream(dummyFilePath);
            for (let i = 0; i < linesNeeded; i++) {
                writer.write(lineContent);
            }
            writer.end();
            await new Promise(resolve => writer.on('finish', resolve)); // Wait for write to finish
            console.log("Dummy file created.");
        } else {
             console.log(`Dummy file already exists: ${dummyFilePath}`);
        }

        // --- Process the file ---
        console.log("\n--- Processing the large file ---");
        const startTime = Date.now();
        try {
            const stats = await processFileStreamByLine(dummyFilePath);
            const endTime = Date.now();
            console.log(`File processing complete. Stats:`, stats);
            console.log(`Time taken: ${endTime - startTime}ms`);
        } catch (error) {
            console.error("Failed to process file stream during main execution:", error.message);
        }

        // --- Test with non-existent file ---
         console.log("\n--- Processing non-existent file (expecting error) ---");
          try {
            await processFileStreamByLine(path.join(__dirname, 'non_existent_large_file.log'));
          } catch (error) {
              console.log(`Caught expected error: ${error.message}`);
          }

    } catch (err) {
        console.error("Error during setup or execution:", err);
    } finally {
        // Optional: Clean up the dummy file
        // try { if (fs.existsSync(dummyFilePath)) fs.unlinkSync(dummyFilePath); } catch (e) {}
    }
}

// Run the main function if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = { processFileStreamByLine }; 