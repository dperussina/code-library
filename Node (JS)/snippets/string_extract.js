'use strict';

/**
 * Demonstrates extracting substrings using slice() and substring().
 * @param {string} text - The input string.
 * @param {number} start - The starting index (inclusive).
 * @param {number} [end] - The ending index (exclusive for slice/substring). Optional.
 */
function extractSubstringExample(text, start, end) {
    console.log("\n--- Extracting Substring ---");
    console.log("Original:", text);
    console.log(`Start: ${start}, End: ${end}`);

    // slice(start, end) - end index is exclusive. Accepts negative indices.
    const sliced = text.slice(start, end); // If end is omitted, slices to the end
    console.log(`slice(${start}${end !== undefined ? ', ' + end : ''}):`, `"${sliced}"`);

    // slice with only start index
    const slicedToEnd = text.slice(start);
    console.log(`slice(${start}):`, `"${slicedToEnd}"`);

    // slice with negative start index (from end)
    if (start < 0) {
        const slicedFromEnd = text.slice(start, end); // end can also be negative
        console.log(`slice(${start}${end !== undefined ? ', ' + end : ''}) (negative start):`, `"${slicedFromEnd}"`);
    }

    // substring(start, end) - similar, but treats negative indices as 0, swaps start/end if start > end.
    const subStr = text.substring(start, end);
     console.log(`substring(${start}${end !== undefined ? ', ' + end : ''}):`, `"${subStr}"`);

     return { sliced, subStr };
}

// --- Example Usage ---
const identifier = "PREFIX-ABC-12345-SUFFIX";
console.log(`Input String: "${identifier}"`);

extractSubstringExample(identifier, 7, 10); // Extracts "ABC"
extractSubstringExample(identifier, 0, 6);  // Extracts "PREFIX"
extractSubstringExample(identifier, 11);     // Extracts "12345-SUFFIX" (slice to end)
extractSubstringExample(identifier, -6);    // Extracts "SUFFIX" (last 6 chars using slice)
extractSubstringExample(identifier, identifier.length - 6); // Equivalent using positive index
extractSubstringExample(identifier, 7);     // Slice from index 7 to end
extractSubstringExample(identifier, 10, 7); // substring handles swapped indices: substring(7, 10) -> "ABC"
                                          // slice would return ""

module.exports = { extractSubstringExample };