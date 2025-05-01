'use strict';

/**
 * Demonstrates trimming whitespace from the start, end, or both ends of a string.
 * @param {string} text - The input string potentially with leading/trailing whitespace.
 */
function trimExample(text) {
    console.log("Original:    ", `"${text}"`);
    const trimmed = text.trim();
    console.log("trim():      ", `"${trimmed}"`);
    const trimmedStart = text.trimStart();
    console.log("trimStart(): ", `"${trimmedStart}"`);
    const trimmedEnd = text.trimEnd();
    console.log("trimEnd():   ", `"${trimmedEnd}"`);
    return { trimmed, trimmedStart, trimmedEnd };
}

// --- Example Usage ---
const dirtyString = "   Some text with spaces   ";
console.log("--- Trimming Example ---");
trimExample(dirtyString);

const leadingSpace = "  Leading";
console.log("\n--- Leading Space Example ---");
trimExample(leadingSpace);

const trailingSpace = "Trailing   ";
console.log("\n--- Trailing Space Example ---");
trimExample(trailingSpace);

module.exports = { trimExample };