'use strict';

/**
 * Demonstrates various ways to check data types in JavaScript.
 * Covers typeof, instanceof, Array.isArray, and checks for null/NaN.
 * @param {*} value - The value whose type to check.
 */
function checkTypeExample(value) {
    // typeof operator: Returns a string indicating the type of the unevaluated operand.
    // Useful for primitives, but has quirks (e.g., typeof null is 'object').
    const type = typeof value;
    // Handle console.log representation for objects/arrays/null
    let valueStr = value;
    if (type === 'object' && value !== null) {
        valueStr = JSON.stringify(value); // Basic object stringification
    } else if (typeof value === 'string') {
        valueStr = `"${value}"`; // Add quotes for strings
    } else if (typeof value === 'function') {
         valueStr = value.toString().split('\n')[0] + '... }'; // Abbreviate function body
    }

    console.log(`\n--- Checking Type of: ${valueStr} ---`);
    console.log(`typeof value:        '${type}'`);

    // Checking for null
    // typeof null === 'object' is a long-standing bug. Need explicit check.
    const isNull = value === null;
    console.log(`value === null:      ${isNull}`);

    // Checking for NaN (Not-a-Number)
    // NaN is the only JS value not equal to itself. Use Number.isNaN().
    const isNaNValue = Number.isNaN(value);
    console.log(`Number.isNaN(value): ${isNaNValue}`);
    // Avoid 'value === NaN' - it's always false!

    // Checking specifically for Array
    // typeof [] is 'object'. Array.isArray() is the reliable method.
    const isArray = Array.isArray(value);
    console.log(`Array.isArray(value): ${isArray}`);

    // instanceof operator: Checks if an object appears in the prototype chain
    // of a constructor. Useful for custom classes or built-in objects like Date.
    console.log(`value instanceof Object: ${value instanceof Object}`); // True for objects, arrays, Date, etc. (but also null sometimes, misleading)
    console.log(`value instanceof Array:  ${value instanceof Array}`);  // Generally works for arrays, but Array.isArray is safer
    console.log(`value instanceof Date:   ${value instanceof Date}`);
    console.log(`value instanceof Function: ${value instanceof Function}`);
    try {
        // instanceof throws error if left operand isn't an object or right isn't callable
        console.log(`value instanceof String: ${value instanceof String}`); // Checks for String OBJECT wrappers, not primitives
        console.log(`value instanceof Number: ${value instanceof Number}`); // Checks for Number OBJECT wrappers, not primitives
    } catch(e) {
         console.log(`instanceof Primitive Constructor: Error - ${e.message}`);
    }

    
    // Combined / More Robust Checks
    if (type === 'string') {
        console.log("Result: It's a string.");
    } else if (type === 'number' && !isNaNValue) {
        console.log("Result: It's a number (excluding NaN).");
    } else if (type === 'boolean') {
        console.log("Result: It's a boolean.");
    } else if (isNull) {
        console.log("Result: It's null.");
    } else if (type === 'undefined') {
        console.log("Result: It's undefined.");
    } else if (isNaNValue) {
        console.log("Result: It's NaN.");
    } else if (isArray) {
        console.log("Result: It's an Array.");
    } else if (value instanceof Date) {
         console.log("Result: It's a Date object.");
    } else if (type === 'function') {
        console.log("Result: It's a function.");
    } else if (type === 'object') {
        // Could be a plain object, or instance of a custom class, etc.
        console.log("Result: It's an object (and not null, array, or Date).");
    } else if (type === 'symbol') {
         console.log("Result: It's a Symbol.");
    } else if (type === 'bigint') {
         console.log("Result: It's a BigInt.");
    } else {
        console.log("Result: Unknown or unexpected type.");
    }
}

// --- Example Usage ---
checkTypeExample("hello");       // string
checkTypeExample(123);           // number
checkTypeExample(true);          // boolean
checkTypeExample(null);          // null (typeof 'object')
checkTypeExample(undefined);     // undefined
checkTypeExample({ key: 'value' }); // object
checkTypeExample([1, 2, 3]);     // array (typeof 'object')
checkTypeExample(new Date());    // Date object (typeof 'object')
checkTypeExample(NaN);           // NaN (typeof 'number')
checkTypeExample(Infinity);      // number
checkTypeExample(() => {});      // function
checkTypeExample(Symbol('id'));  // symbol
checkTypeExample(123n);          // bigint
checkTypeExample(new String("wrapper")); // String object (typeof 'object')


module.exports = { checkTypeExample }; 