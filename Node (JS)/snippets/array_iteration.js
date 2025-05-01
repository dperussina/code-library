'use strict';

/**
 * Demonstrates various ways to iterate over array elements.
 * @param {Array<any>} arr - The array to iterate over.
 */
function iterateArrayExample(arr) {
    console.log("\n--- Iterating Array ---");
    console.log("Array:", arr);

    console.log("\nMethod 1: Using forEach:");
    arr.forEach((item, index, theArray) => {
        // item: current element
        // index: current index
        // theArray: the array being iterated over
        console.log(`  forEach - Index ${index}: ${item}`);
        // console.log(theArray); // Can access the original array
    });

    console.log("\nMethod 2: Using for...of (gets values directly):");
    let ofIndex = 0; // Need to track index manually if needed
    for (const item of arr) {
        console.log(`  for...of - Item ${ofIndex++}: ${item}`);
    }

    console.log("\nMethod 3: Using traditional for loop (index-based):");
    for (let i = 0; i < arr.length; i++) {
        console.log(`  for loop - Index ${i}: ${arr[i]}`);
    }

    // Method 4: Using map (technically iteration, but primarily for transformation)
    // console.log("\nMethod 4: Using map (returns new array):");
    // const mapped = arr.map(item => item); // Example: just creates a copy
    // console.log("  Mapped array:", mapped);

    // Method 5: Using filter (iteration for selection)
    // console.log("\nMethod 5: Using filter (returns new filtered array):");
    // const filtered = arr.filter(item => true); // Example: keeps all items
    // console.log("  Filtered array:", filtered);
}

// --- Example Usage ---
const colors = ["Red", "Green", "Blue"];
const numbers = [10, 20, 30];
const mixed = [1, "hello", true, null, { id: 1 }];

iterateArrayExample(colors);
iterateArrayExample(numbers);
iterateArrayExample(mixed);

module.exports = { iterateArrayExample }; 