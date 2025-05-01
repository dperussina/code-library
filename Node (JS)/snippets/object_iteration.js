'use strict';

/**
 * Demonstrates iterating over the properties of a JavaScript object.
 * Covers Object.keys, Object.values, Object.entries, and for...in loop.
 * @param {object} obj - The object to iterate over.
 */
function iterateObjectProperties(obj) {
     console.log("\n--- Iterating Object Properties ---");
      if (typeof obj !== 'object' || obj === null) {
        console.log("Input is not a non-null object.");
        return;
    }
     console.log("Object:", obj);

    // --- Method 1: Object.keys() ---
    // Returns an array of the object's own enumerable property names (strings).
    console.log("\nUsing Object.keys():");
    const keys = Object.keys(obj);
    console.log("  Keys:", keys);
    keys.forEach(key => {
        console.log(`    Key: ${key}, Value: ${obj[key]}`); // Use bracket notation to get value
    });

    // --- Method 2: Object.values() ---
    // Returns an array of the object's own enumerable property values.
    console.log("\nUsing Object.values():");
    const values = Object.values(obj);
    console.log("  Values:", values);
    values.forEach((value, index) => {
        console.log(`    Value at index ${index}: ${value}`);
    });

    // --- Method 3: Object.entries() ---
    // Returns an array of the object's own enumerable string-keyed
    // property [key, value] pairs.
    console.log("\nUsing Object.entries():");
    const entries = Object.entries(obj); 
    console.log("  Entries:", entries); // Array of [key, value] arrays
    entries.forEach(([key, value], index) => { // Use array destructuring
        console.log(`    Entry ${index}: Key='${key}', Value=${value}`);
    });
    // Can also use a traditional loop:
    // for (const [key, value] of Object.entries(obj)) {
    //     console.log(`    Entry: ${key} = ${value}`);
    // }

    // --- Method 4: for...in loop ---
    // Iterates over all enumerable properties of an object, including inherited ones.
    // Often requires a hasOwnProperty check to ensure you're only dealing with
    // the object's own properties. Generally, Object.keys/values/entries are preferred.
    console.log("\nUsing for...in (with hasOwnProperty check):");
    for (const key in obj) {
        // Check if the property belongs directly to the object (not inherited)
        if (Object.hasOwnProperty.call(obj, key)) {
            console.log(`  Own Key (for...in): ${key}, Value: ${obj[key]}`);
        } else {
             // This block would run for properties inherited from the prototype chain
             console.log(`  Inherited Key (for...in): ${key}`);
        }
    }

    // Example demonstrating inherited property
    function Dog(name) { this.name = name; }
    Dog.prototype.bark = function() { console.log('Woof!'); };
    const myDog = new Dog('Buddy');
    myDog.age = 3; // Own property

    console.log("\n--- Iterating object with inherited properties ---");
    console.log("Dog object:", myDog);
    console.log("Keys (own):", Object.keys(myDog)); // ['name', 'age']
    console.log("for...in (includes inherited):");
    for (const key in myDog) {
        if (Object.hasOwnProperty.call(myDog, key)) {
             console.log(`  Own Key: ${key}`);
        } else {
            console.log(`  Inherited Key: ${key}`); // bark
        }
    }
    
}

// --- Example Usage ---
const settings = {
    theme: "dark",
    fontSize: 14,
    showToolbar: true,
    // Example of a symbol property (not iterated by Object.keys/values/entries or for...in)
    [Symbol('id')]: 123 
};
iterateObjectProperties(settings);

iterateObjectProperties({ a: 1, b: undefined, c: null }); // Handles different value types
iterateObjectProperties({}); // Empty object


module.exports = { iterateObjectProperties }; 