'use strict';

/**
 * Demonstrates aggregating array data using the reduce() method.
 * reduce() executes a user-supplied "reducer" callback function on each element
 * of the array, in order, passing in the return value from the calculation
 * on the preceding element. The final result of running the reducer across
 * all elements of the array is a single value.
 * @param {Array<number>} numbers - An array of numbers.
 * @returns {object} An object containing sum and max calculated via reduce.
 */
function reduceArrayExample(numbers) {
    console.log("\n--- Array reduce() Example ---");
    if (!Array.isArray(numbers) || numbers.length === 0) {
        console.log("Input is not a non-empty array. Cannot reduce.");
        return { sum: undefined, max: undefined };
    }
    console.log("Original numbers:", numbers);

    // Example 1: Calculate the sum of all numbers
    // The second argument to reduce (0) is the initialValue of the accumulator.
    const sum = numbers.reduce((accumulator, currentValue, currentIndex, array) => {
        // console.log(`Sum - acc: ${accumulator}, current: ${currentValue}, index: ${currentIndex}`);
        // console.log('Original array:', array); // Can access original array
        return accumulator + currentValue;
    }, 0);
    console.log("Total Sum:", sum);

    // Example 2: Find the maximum value in the array
    // Initialize accumulator with the first element or -Infinity for safety with negative numbers
    const max = numbers.reduce((accumulator, currentValue) => {
        // console.log(`Max - acc: ${accumulator}, current: ${currentValue}`);
        return Math.max(accumulator, currentValue);
        // Alternative: return accumulator > currentValue ? accumulator : currentValue;
    }, numbers[0]); // Initialize with first element (safer if array guaranteed non-empty)
    // }, -Infinity); // Safer alternative initial value for any number set
    console.log("Maximum Value:", max);

    // Example 3: Counting occurrences of items (more complex reduce)
    const items = ['a', 'b', 'a', 'c', 'b', 'a'];
    console.log("\nCounting items:", items);
    const counts = items.reduce((accumulator, item) => {
        accumulator[item] = (accumulator[item] || 0) + 1;
        // console.log(`Counts - acc:`, accumulator, `, current: ${item}`);
        return accumulator;
    }, {}); // Initialize with an empty object
    console.log("Item Counts:", counts); // Output: { a: 3, b: 2, c: 1 }

    // Note: reduce() does not modify the original array
    console.log("Original numbers (unchanged):", numbers);

    return { sum, max, counts };
}

// --- Example Usage ---
const values = [5, 10, 2, 8, 3];
reduceArrayExample(values);

const singleValue = [15];
console.log("\n--- reduce() on single element array ---");
reduceArrayExample(singleValue);

const empty = [];
console.log("\n--- reduce() on empty array ---");
// reduce on empty array with no initial value throws TypeError
// reduce on empty array with initial value returns initial value
const sumEmpty = empty.reduce((acc, curr) => acc + curr, 0);
console.log("Sum of empty array (with initialValue 0):", sumEmpty); // 0

try {
    empty.reduce((acc, curr) => acc + curr);
} catch (e) {
    console.log("Error reducing empty array without initialValue:", e.message);
}


module.exports = { reduceArrayExample }; 