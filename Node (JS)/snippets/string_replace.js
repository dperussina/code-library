'use strict';

/**
 * Demonstrates replacing substrings using replace() and replaceAll().
 * Also shows basic regex usage with replace().
 * @param {string} text - The original text.
 * @param {string|RegExp} searchValue - The string or regex pattern to search for.
 * @param {string} replaceValue - The string to replace the matches with.
 */
function replaceExample(text, searchValue, replaceValue) {
    console.log("\n--- Replace Operation ---");
    console.log("Original:", text);
    console.log(`Search Value: "${searchValue}", Replace Value: "${replaceValue}"`);

    // Basic replace (first occurrence only)
    const replacedFirst = text.replace(searchValue, replaceValue);
    console.log(`Replacing first occurrence:`, replacedFirst);

    // Replace all using replaceAll (preferred for simple string replacement)
    if (typeof text.replaceAll === 'function') {
         const replacedAll = text.replaceAll(searchValue, replaceValue);
         console.log(`Replacing all (replaceAll):`, replacedAll);
    } else {
         // Fallback using global regex for older Node.js versions (less common now)
         // Escape special regex characters in the search string for literal replacement
         const escapedSearchValue = String(searchValue).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
         const regex = new RegExp(escapedSearchValue, 'g');
         const replacedAllRegex = text.replace(regex, replaceValue);
         console.log(`Replacing all (regex fallback):`, replacedAllRegex);
    }

   // Using regex for more complex patterns (example: case-insensitive)
   if (searchValue instanceof RegExp) {
        const replacedRegex = text.replace(searchValue, replaceValue);
        console.log("Regex replace:", replacedRegex);
   } else {
        // Example: Case-insensitive replace for a fixed word "sample"
        const replacedCaseInsensitive = text.replace(/sample/ig, 'EXAMPLE'); // g for global, i for case-insensitive
        console.log("Regex replace (/sample/ig -> EXAMPLE):", replacedCaseInsensitive);
   }

   return replacedFirst; // Return one example result
}

// --- Example Usage ---
const message = "This sample message is a sample. Repeat sample.";
console.log("--- Replacing 'sample' with 'test' ---");
replaceExample(message, "sample", "test");

console.log("\n--- Replacing 'message' with 'NOTE' (case sensitive) ---");
replaceExample(message, "message", "NOTE");

console.log("\n--- Replacing using Regex (case insensitive /sample/i) ---");
replaceExample(message, /sample/i, "TEST_REGEX_FIRST"); // Only first match due to no 'g' flag

console.log("\n--- Replacing using Regex (global, case insensitive /sample/ig) ---");
replaceExample(message, /sample/ig, "TEST_REGEX_ALL");


module.exports = { replaceExample };