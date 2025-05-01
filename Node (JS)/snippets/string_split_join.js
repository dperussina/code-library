'use strict';

/**
 * Demonstrates splitting a string into an array and joining an array into a string.
 * @param {string} text - The input text.
 * @param {string} separator - The separator to split the string by.
 * @param {string} joiner - The separator to join the array elements with.
 * @returns {string} The rejoined string.
 */
function splitAndJoinExample(text, separator = ',', joiner = '-') {
    console.log("Original:", text);
    const parts = text.split(separator);
    console.log("Split:", parts);

    // Trim whitespace from each part before joining
    const trimmedParts = parts.map(p => p.trim());
    const rejoined = trimmedParts.join(joiner);
    console.log("Joined:", rejoined);
    return rejoined;
}

// --- Example Usage ---
console.log("--- Example 1: CSV Line ---");
const csvLine = " item1 , item2, item3 ";
const joinedPipe = splitAndJoinExample(csvLine, ',', '|'); // Output: "item1|item2|item3"
console.log("Result 1:", joinedPipe);

console.log("\n--- Example 2: Sentence ---");
const sentence = "This is a sample sentence.";
const joinedUnderscore = splitAndJoinExample(sentence, ' ', '_'); // Output: "This_is_a_sample_sentence."
console.log("Result 2:", joinedUnderscore);

module.exports = { splitAndJoinExample }; // Export for potential reuse