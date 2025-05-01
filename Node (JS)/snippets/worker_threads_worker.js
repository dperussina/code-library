'use strict';

const { parentPort, workerData, isMainThread } = require('worker_threads');
const crypto = require('crypto'); // Example CPU-intensive module

/**
 * Simulates a CPU-intensive task.
 * Replace this with your actual computation (e.g., image processing, complex math).
 * @param {*} item - The data item to process.
 * @returns {*} The result of the computation.
 */
function performHeavyTask(item) {
    // Example: Perform multiple rounds of SHA-256 hashing
    const rounds = 50000; // Adjust complexity as needed
    let data = String(item);
    for (let i = 0; i < rounds; i++) {
        const hash = crypto.createHash('sha256');
        hash.update(data + i);
        data = hash.digest('hex');
    }
    // Return a portion of the final hash as the result
    return data.substring(0, 16);
}

/**
 * Handles processing the data assigned to this worker thread.
 * Receives data via `workerData`, processes each item, and sends
 * results back to the main thread via `parentPort.postMessage()`.
 */
function runWorkerTask() {
    if (isMainThread) {
        throw new Error("Worker script should not be run directly in the main thread.");
    }

    if (!workerData || !Array.isArray(workerData.items) || !Array.isArray(workerData.originalIndices)) {
         console.error("Worker received invalid or missing workerData:", workerData);
        // Report error back to the main thread
        parentPort.postMessage({ type: 'ERROR', error: 'Invalid workerData received' });
        return; // Stop processing
    }

    const { items, originalIndices } = workerData;
    console.log(`Worker ${require('worker_threads').threadId}: Started processing ${items.length} items.`);
    const results = [];

    try {
        items.forEach((item, index) => {
            const resultValue = performHeavyTask(item);
            const originalIndex = originalIndices[index]; // Get original index

            results.push({
                originalIndex: originalIndex,
                value: resultValue
            });

            // Optional: Send progress update messages back to main thread
            if ((index + 1) % 10 === 0 || index === items.length - 1) { // Example: Update every 10 items
                 const percentComplete = Math.round(((index + 1) / items.length) * 100);
                 parentPort.postMessage({
                    type: 'PROGRESS',
                    percent: percentComplete,
                    status: `Processed item ${index + 1}/${items.length}`
                 });
            }
        });

        // Send the final results back to the main thread
        parentPort.postMessage({ type: 'RESULT', results: results });
        console.log(`Worker ${require('worker_threads').threadId}: Finished processing and sent results.`);

    } catch (error) {
         console.error(`Worker ${require('worker_threads').threadId}: Error during task execution:`, error);
         // Report error back to the main thread
        parentPort.postMessage({ type: 'ERROR', error: error.message || 'Unknown error in worker' });
    }
}

// --- Start Worker Execution ---
runWorkerTask();

// Note: No module.exports needed here, as this script is executed by the Worker constructor. 