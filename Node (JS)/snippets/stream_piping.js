'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib'); // Node's built-in module for compression/decompression
const { pipeline } = require('stream'); // Recommended function for piping streams
const { promisify } = require('util'); // Utility to convert callback-based functions to promise-based

// Promisify the stream.pipeline function for use with async/await
const pipelineAsync = promisify(pipeline);

/**
 * Compresses a file using streams and zlib.
 * Demonstrates piping a readable stream (file input) through a transform
 * stream (gzip) to a writable stream (file output). Uses stream.pipeline
 * for robust error handling and cleanup.
 *
 * @async
 * @param {string} inputFile - Path to the input file.
 * @param {string} outputFile - Path to the output compressed file (e.g., 'file.txt.gz').
 * @returns {Promise<void>} A promise that resolves when compression is complete.
 * @throws {Error} Throws an error if any part of the pipeline fails.
 */
async function compressFile(inputFile, outputFile) {
    const inputPath = path.resolve(inputFile);
    const outputPath = path.resolve(outputFile);
    console.log(`Attempting to compress ${inputPath} to ${outputPath} using streams...`);

    let sourceStream;
    let gzipStream;
    let destinationStream;

    try {
        // Check if input file exists
        await fs.promises.access(inputPath, fs.constants.R_OK);

        // Create the streams
        sourceStream = fs.createReadStream(inputPath);
        gzipStream = zlib.createGzip(); // Create a Gzip transform stream
        destinationStream = fs.createWriteStream(outputPath);

        // Add error listeners to individual streams (optional, as pipeline catches most)
        sourceStream.on('error', (err) => console.error(`Source Stream Error: ${err.message}`));
        gzipStream.on('error', (err) => console.error(`Gzip Stream Error: ${err.message}`));
        destinationStream.on('error', (err) => console.error(`Destination Stream Error: ${err.message}`));

        // Use stream.pipeline to connect the streams.
        // It automatically handles data flow, backpressure, error forwarding,
        // and ensures all streams are properly closed/destroyed on completion or error.
        console.log("Starting pipeline: Read -> Gzip -> Write");
        await pipelineAsync(
            sourceStream,
            gzipStream,
            destinationStream
        );

        console.log(`Successfully compressed ${inputPath} to ${outputPath}`);

    } catch (err) {
        console.error('Compression pipeline failed:', err);

        // Attempt to clean up the partially written output file if an error occurred
        if (fs.existsSync(outputPath)) {
             console.log(`Attempting to delete partially written file: ${outputPath}`);
            try {
                await fs.promises.unlink(outputPath);
                console.log(`Deleted partially written file.`);
            } catch (unlinkErr) {
                // Log warning if cleanup fails, but don't obscure the original error
                console.warn(`Could not delete partial file ${outputPath}: ${unlinkErr.message}`);
            }
        }
        // Re-throw the original error so the caller knows the operation failed
        throw err;
    }
    // No explicit stream closing needed here - pipeline handles it.
}

// --- Example Usage ---
async function main() {
    const sourceFileName = 'large_dummy_file.log'; // Use the file created in the other example
    const compressedFileName = `${sourceFileName}.gz`;
    const sourceFilePath = path.join(__dirname, sourceFileName);
    const compressedFilePath = path.join(__dirname, 'output_files', compressedFileName); // Put gz in output dir

    // Ensure source file exists (or create it)
     try {
        if (!fs.existsSync(sourceFilePath)) {
             console.log(`Creating source file: ${sourceFilePath}`);
             fs.writeFileSync(sourceFilePath, 'This is test content.\n'.repeat(10000));
        }
         // Ensure output directory exists
         const outputDir = path.dirname(compressedFilePath);
          if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

        console.log("\n--- Compressing File ---");
        const startTime = Date.now();
        await compressFile(sourceFilePath, compressedFilePath);
        const endTime = Date.now();
        console.log(`Compression finished in ${endTime - startTime}ms`);

         // Optional: Verify compressed file size
        const sourceStats = await fs.promises.stat(sourceFilePath);
        const compressedStats = await fs.promises.stat(compressedFilePath);
        console.log(`  Original Size: ${sourceStats.size} bytes`);
        console.log(`  Compressed Size: ${compressedStats.size} bytes`);

     } catch (error) {
         console.error("Main function failed:", error.message);
     } finally {
         // Optional: Clean up created files
         // try { if(fs.existsSync(compressedFilePath)) fs.unlinkSync(compressedFilePath); } catch(e) {}
         // try { if(fs.existsSync(sourceFilePath) && sourceFileName === 'large_dummy_file.log') fs.unlinkSync(sourceFilePath); } catch(e) {} // Only delete if we created it
     }
}

if (require.main === module) {
    main();
}

module.exports = { compressFile }; 