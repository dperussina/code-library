'use strict';

/**
 * Demonstrates sorting arrays using the sort() method.
 * IMPORTANT: sort() sorts elements IN PLACE (modifies the original array).
 * It converts elements to strings and sorts based on UTF-16 code units by default.
 * A compare function must be provided for numerical or complex sorting.
 * @param {Array<any>} items - The array to sort (will be copied before sorting).
 */
function sortArrayExample(items) {
    console.log("\n--- Array sort() Example ---");
    if (!Array.isArray(items)) {
        console.log("Input is not an array.");
        return;
    }
     console.log("Original:", items);

    // --- Sorting Numbers ---
    if (items.every(item => typeof item === 'number')) {
        // Default sort (INCORRECT for numbers, treats as strings: 100 comes before 2)
        const defaultSortedNumbers = [...items]; // Create a copy
        defaultSortedNumbers.sort();
        console.log("Default Sort (string-based, incorrect for numbers):", defaultSortedNumbers);

        // Numeric sort (ascending) using compare function
        const numericAsc = [...items];
        numericAsc.sort((a, b) => {
            // if a < b, return negative value (a comes first)
            // if a > b, return positive value (b comes first)
            // if a === b, return 0
            return a - b;
        });
        console.log("Numeric Sort (ascending, a - b):", numericAsc);

        // Numeric sort (descending) using compare function
        const numericDesc = [...items];
        numericDesc.sort((a, b) => b - a); // Reverse the comparison
        console.log("Numeric Sort (descending, b - a):", numericDesc);
    }

    // --- Sorting Strings ---
    if (items.every(item => typeof item === 'string')) {
        // Default sort works correctly for simple strings (alphabetical, case-sensitive)
        const defaultSortedStrings = [...items];
        defaultSortedStrings.sort();
        console.log("Default Sort (alphabetical, case-sensitive):", defaultSortedStrings);

        // Case-insensitive sort
        const caseInsensitive = [...items];
        caseInsensitive.sort((a, b) => {
            const lowerA = a.toLowerCase();
            const lowerB = b.toLowerCase();
            if (lowerA < lowerB) return -1;
            if (lowerA > lowerB) return 1;
            return 0;
        });
        console.log("Case-Insensitive Sort:", caseInsensitive);
    }

    // --- Sorting Objects ---
    if (items.every(item => typeof item === 'object' && item !== null && item.hasOwnProperty('name') && item.hasOwnProperty('age'))) {
        console.log("Sorting array of objects:");
        const sortedByAge = [...items];
        sortedByAge.sort((a, b) => a.age - b.age); // Sort by age ascending
        console.log("Objects sorted by age (asc):", sortedByAge);

        const sortedByName = [...items];
        sortedByName.sort((a, b) => { // Sort by name alphabetically
            const nameA = a.name.toUpperCase(); // ignore case
            const nameB = b.name.toUpperCase(); // ignore case
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
         console.log("Objects sorted by name (asc, case-insensitive):", sortedByName);
    }
}

// --- Example Usage ---
const unsortedNumbers = [10, 5, 100, 2, 8, -1];
sortArrayExample(unsortedNumbers);

const unsortedStrings = ["Banana", "Apple", "cherry", "apricot", "Date"];
sortArrayExample(unsortedStrings);

const users = [
    { name: "Alice", age: 30 },
    { name: "bob", age: 25 }, // Lowercase name
    { name: "Charlie", age: 35 },
    { name: "David", age: 25 }, // Same age as Bob
];
sortArrayExample(users);

const empty = [];
sortArrayExample(empty);


module.exports = { sortArrayExample }; 