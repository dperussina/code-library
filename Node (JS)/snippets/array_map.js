'use strict';

/**
 * Demonstrates transforming array elements using the map() method.
 * map() creates a new array populated with the results of calling a
 * provided function on every element in the calling array.
 * @param {Array<number>} numbers - An array of numbers.
 * @returns {Array<object>} A new array of objects derived from the input numbers.
 */
function mapArrayExample(numbers) {
    console.log("\n--- Array map() Example ---");
    console.log("Original numbers:", numbers);

    // Example 1: Doubling each number
    const doubled = numbers.map((num, index, arr) => {
        // console.log(`Processing index ${index}, value ${num}`);
        // console.log('Original array:', arr); // Can access original array
        return num * 2;
    });
    console.log("Doubled numbers:", doubled);

    // Example 2: Mapping numbers to objects with original and squared values
    const objects = numbers.map(num => ({
        original: num,
        squared: num * num,
        isEven: num % 2 === 0
    }));
    console.log("Mapped to objects:", objects);

    // Example 3: Mapping to strings
    const strings = numbers.map(num => `Number: ${num}`);
    console.log("Mapped to strings:", strings);

    // Note: map() does not modify the original array
    console.log("Original numbers (unchanged):", numbers);

    return objects; // Return one of the results for demonstration
}

// --- Example Usage ---
const nums = [1, 2, 3, 4, 5];
mapArrayExample(nums);

const empty = [];
console.log("\n--- map() on empty array ---");
mapArrayExample(empty); // Returns []

module.exports = { mapArrayExample }; 