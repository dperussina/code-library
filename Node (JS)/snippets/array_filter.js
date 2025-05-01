'use strict';

/**
 * Demonstrates filtering array elements using the filter() method.
 * filter() creates a new array with all elements that pass the test
 * implemented by the provided function.
 * @param {Array<any>} items - An array with mixed data types.
 * @returns {object} An object containing different filtered arrays.
 */
function filterArrayExample(items) {
    console.log("\n--- Array filter() Example ---");
    console.log("Original items:", items);

    // Example 1: Filter numbers greater than 5
    const numbersGreaterThan5 = items.filter((item, index, arr) => {
        // console.log(`Checking index ${index}, value ${item}`);
        // console.log('Original array:', arr); // Can access original array
        return typeof item === 'number' && item > 5;
    });
    console.log("Numbers > 5:", numbersGreaterThan5);

    // Example 2: Filter strings that start with 'A' (case-sensitive)
    const stringsStartingWithA = items.filter(item => {
        return typeof item === 'string' && item.startsWith('A');
    });
    console.log("Strings starting with 'A':", stringsStartingWithA);

    // Example 3: Filter out null or undefined values
    const definedValues = items.filter(item => item !== null && item !== undefined);
    console.log("Defined values (excluding null/undefined):", definedValues);

    // Example 4: Filtering based on object properties
    const objects = [
        { name: "Alice", type: "user", active: true },
        { name: "Widget", type: "product", active: false },
        { name: "Bob", type: "user", active: false },
        { name: "Gadget", type: "product", active: true },
    ];
    console.log("\nOriginal objects:", objects);
    const activeUsers = objects.filter(obj => obj.type === 'user' && obj.active);
    console.log("Active users:", activeUsers);

    // Note: filter() does not modify the original array
    console.log("Original items (unchanged):", items);

    return { numbersGreaterThan5, stringsStartingWithA, definedValues, activeUsers };
}

// --- Example Usage ---
const mixedData = [1, "Apple", 10, "Banana", null, 3, "Apricot", undefined, 7, false, 0];
filterArrayExample(mixedData);

const empty = [];
console.log("\n--- filter() on empty array ---");
filterArrayExample(empty); // Returns empty arrays for filters

module.exports = { filterArrayExample };
