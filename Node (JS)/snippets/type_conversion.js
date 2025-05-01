'use strict';

/**
 * Demonstrates explicit type conversion between common JavaScript types.
 * Covers String(), Number(), parseInt(), parseFloat(), Boolean().
 * @param {*} value - The value to convert.
 */
function typeConversionExample(value) {
    const originalType = value === null ? 'null' : typeof value; // Special handling for null's typeof
    console.log(`\n--- Converting value: ${value} (Type: ${originalType}) ---`);

    // --- To String ---
    // String() constructor works for most types, including null and undefined.
    // .toString() method exists on most types but fails for null/undefined.
    const strVal = String(value);
    console.log(`String():       "${strVal}" (Type: ${typeof strVal})`);
    // try { console.log(`.toString(): "${value.toString()}"`); } catch (e) { console.log(`.toString(): Error - ${e.message}`); }

    // --- To Number ---
    // Number() constructor attempts conversion. Returns NaN if unsuccessful.
    // Unary plus operator (+) is a concise way to convert to number.
    const numVal = Number(value);
    console.log(`Number():       ${numVal} (Type: ${typeof numVal})`);
    const unaryPlusVal = +value;
    console.log(`Unary Plus (+): ${unaryPlusVal} (Type: ${typeof unaryPlusVal})`);

    // parseInt() - Parses string argument and returns integer. Stops at first non-digit.
    // Radix (base) argument (e.g., 10 for decimal) is crucial to avoid unexpected behavior.
    const intVal = parseInt(value, 10); 
    console.log(`parseInt(, 10): ${intVal} (Type: ${typeof intVal})`); // Returns NaN if first char cannot be converted

    // parseFloat() - Parses string argument and returns floating point number.
    const floatVal = parseFloat(value);
    console.log(`parseFloat():   ${floatVal} (Type: ${typeof floatVal})`); // Returns NaN if first char cannot be converted

    // --- To Boolean ---
    // Boolean() constructor converts based on truthy/falsy rules.
    // Double negation (!!) is a concise way to convert to boolean.
    const boolVal = Boolean(value);
    console.log(`Boolean():      ${boolVal} (Type: ${typeof boolVal})`);
    const doubleNegationVal = !!value;
    console.log(`Double ! (!)!:  ${doubleNegationVal} (Type: ${typeof doubleNegationVal})`);

    console.log("  (Truthy values convert to true, Falsy values to false)");
    // Falsy values in JS: false, 0, -0, 0n (BigInt zero), "", null, undefined, NaN
    // All other values are truthy, including empty arrays [], empty objects {}, "0", "false".
}

// --- Example Usage ---
typeConversionExample("42");          // String number
typeConversionExample(" 3.14 ");      // String float with spaces
typeConversionExample("100px");       // String with trailing non-digits
typeConversionExample("-5");          // String negative number
typeConversionExample("Infinity");    // String Infinity
typeConversionExample("0xFF");        // String hex (parseInt needs radix 16)
typeConversionExample(100);           // Number
typeConversionExample(0);             // Number zero (falsy)
typeConversionExample(true);          // Boolean true
typeConversionExample(false);         // Boolean false (falsy)
typeConversionExample(null);          // null (falsy)
typeConversionExample(undefined);     // undefined (falsy)
typeConversionExample("");            // Empty string (falsy)
typeConversionExample("hello");       // Non-empty string
typeConversionExample(" ");           // String with space
typeConversionExample("0");           // String "0"
typeConversionExample("false");       // String "false"
typeConversionExample({});            // Empty object
typeConversionExample([]);            // Empty array
typeConversionExample([1]);           // Non-empty array
typeConversionExample(NaN);           // NaN (falsy)
typeConversionExample(function(){}); // Function

// Explicit parseInt with different radix
console.log("\n--- parseInt() with Radix ---");
console.log(`parseInt("0xFF", 16): ${parseInt("0xFF", 16)}`); // 255
console.log(`parseInt("101", 2):  ${parseInt("101", 2)}`);  // 5
console.log(`parseInt("101", 10): ${parseInt("101", 10)}`); // 101
console.log(`parseInt("010"):     ${parseInt("010")}`);     // 8 (Older JS might treat leading 0 as octal without radix)
console.log(`parseInt("010", 10): ${parseInt("010", 10)}`); // 10 (Recommended)


module.exports = { typeConversionExample }; 