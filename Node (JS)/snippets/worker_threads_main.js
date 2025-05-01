'use strict';

const { Worker, isMainThread } = require('worker_threads');
const path = require('path');
const os = require('os');

/**
 * Runs a CPU-intensive task in parallel using worker threads.
 * Distributes items across available CPU cores (or max items) for processing.
 * Aggregates results sent back from worker threads via messages.
 *
 * @param {Array<any>} items - An array of items to be processed by the workers.
 * @param {string} workerScriptPath - Absolute path to the worker script file.
 * @returns {Promise<Array<any>>} A promise that resolves with an array containing the results
 *                                in the same order as the input items, or rejects on error.
 */
function runParallel(items, workerScriptPath) {
    return new Promise((resolve, reject) => {
        // This function should only be called from the main thread.
        if (!isMainThread) {
            return reject(new Error("runParallel can only be called from the main thread."));
        }
        if (!items || items.length === 0) {
             console.log("No items to process.");
            return resolve([]);
        }

        // Determine the number of threads to use (up to number of CPU cores)
        const numItems = items.length;
        const maxThreads = os.cpus().length;
        const numThreads = Math.min(maxThreads, numItems);

        console.log(`Starting parallel processing for ${numItems} items using ${numThreads} worker threads.`);
        console.log(`Worker script: ${workerScriptPath}`);

        const results = new Array(numItems); // Array to hold results in order
        let workersCompleted = 0;
        let hasErrored = false; // Flag to prevent multiple rejections
        const activeWorkers = new Set(); // Keep track of active workers

        // Function to handle cleanup on error or completion
        const cleanupAndReject = (err) => {
            if (hasErrored) return; // Prevent multiple rejections
            hasErrored = true;
            console.error("Terminating active workers due to error...");
            activeWorkers.forEach(worker => worker.terminate()); // Terminate remaining workers
            reject(err);
        };

        // Distribute work and create workers
        for (let i = 0; i < numThreads; i++) {
            // Assign a subset of items to each worker
            // Simple modulo distribution - more complex strategies exist
            const workerItems = items.filter((item, index) => index % numThreads === i);
            const workerInput = { items: workerItems, originalIndices: [] };
             items.forEach((item, index) => {
                 if(index % numThreads === i) {
                     workerInput.originalIndices.push(index);
                 }
             });


            if (workerItems.length === 0) continue; // Skip creating worker if no items assigned

            const worker = new Worker(workerScriptPath, {
                workerData: workerInput // Pass items and their original indices
            });
            activeWorkers.add(worker);

            // --- Worker Event Listeners ---

            // Handle messages from the worker (containing results)
            worker.on('message', (message) => {
                 console.log(`Received message from worker ${worker.threadId}`);
                if (message.type === 'RESULT' && message.results) {
                    // Place results back into the main results array using original indices
                    message.results.forEach((resultItem) => {
                        results[resultItem.originalIndex] = resultItem.value;
                    });
                } else if (message.type === 'PROGRESS') {
                     console.log(`Worker ${worker.threadId} progress: ${message.percent}% - ${message.status}`);
                } else if (message.type === 'ERROR') { // Allow worker to report errors via message
                     console.error(`Worker ${worker.threadId} reported error via message:`, message.error);
                     cleanupAndReject(new Error(message.error || 'Worker reported an unspecified error'));
                }
                 // Handle other message types if needed
            });

            // Handle errors occurring within the worker itself
            worker.on('error', (err) => {
                console.error(`Error from worker ${worker.threadId}:`, err);
                activeWorkers.delete(worker);
                cleanupAndReject(err); // Reject the main promise
            });

            // Handle worker exit
            worker.on('exit', (code) => {
                activeWorkers.delete(worker);
                 console.log(`Worker ${worker.threadId} exited with code ${code}.`);
                workersCompleted++;
                if (code !== 0 && !hasErrored) {
                    // Worker exited unexpectedly without an explicit error event
                    cleanupAndReject(new Error(`Worker ${worker.threadId} stopped unexpectedly with exit code ${code}`));
                } else if (workersCompleted === numThreads && !hasErrored) {
                    // All workers finished successfully
                    console.log("All workers completed successfully.");
                    resolve(results);
                } else if(hasErrored) {
                     console.log(`Worker ${worker.threadId} exited after error occurred elsewhere.`);
                }
            });
        }

        // Handle case where no workers were actually needed/created
        if (activeWorkers.size === 0 && !hasErrored) {
             console.log("No workers were created (perhaps 0 items or distribution error).");
            resolve(results);
        }
    });
}

// --- Example Usage ---
async function main() {
    // Data to be processed - example: numbers requiring heavy computation
    const dataToProcess = Array.from({ length: 10 }, (_, i) => i + 1); // e.g., [1, 2, ..., 10]

    // Absolute path to the worker script
    const workerScript = path.resolve(__dirname, 'worker_threads_worker.js');

    console.log("--- Running CPU-Bound Task with Worker Threads ---");
    const startTime = Date.now();

    try {
        const parallelResults = await runParallel(dataToProcess, workerScript);
        const endTime = Date.now();
        console.log(`\nMain: Parallel computation finished in ${endTime - startTime}ms`);
        console.log("Main: Final Results (should be in order):", parallelResults);

        // Example: Verify results (adjust based on worker task)
        // parallelResults.forEach((res, index) => {
        //    console.log(`  Item ${index + 1} -> Result ${res ? res.substring(0, 10) + '...' : 'ERROR'}`);
        // });

    } catch (error) {
        const endTime = Date.now();
        console.error(`\nMain: Parallel computation failed after ${endTime - startTime}ms:`, error);
    }
}

// Ensure this main logic only runs when the script is executed directly
if (isMainThread) {
    main();
}

// Export the main function if needed for other modules
module.exports = { runParallel }; 