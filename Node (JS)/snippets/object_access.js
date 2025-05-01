'use strict';

/**
 * Demonstrates accessing properties of JavaScript objects using dot notation,
 * bracket notation, optional chaining, and handling non-existent properties.
 * @param {object} obj - The object whose properties to access.
 */
function accessObjectProperties(obj) {
    console.log("\n--- Accessing Object Properties ---");
    if (typeof obj !== 'object' || obj === null) {
        console.log("Input is not a non-null object.");
        return;
    }
    console.log("Object:", obj);

    // --- Dot Notation ---
    // Used when the property key is a valid JavaScript identifier (no spaces, dashes, etc.)
    console.log("\nUsing dot notation:");
    console.log(`  obj.name: ${obj.name}`);   // Access 'name' property
    console.log(`  obj.age: ${obj.age}`);     // Access 'age' property

    // --- Bracket Notation ---
    // Required when the key is dynamic (stored in a variable) or is not a valid identifier.
    console.log("\nUsing bracket notation:");
    console.log(`  obj['city']: ${obj['city']}`); // Access 'city' property

    const dynamicKey = 'isActive';
    console.log(`  Accessing with dynamic key ('${dynamicKey}'): ${obj[dynamicKey]}`);

    const keyWithSpace = 'zip code'; // Example key that needs bracket notation
    obj[keyWithSpace] = '90210'; // Assign using bracket notation
    console.log(`  Accessing key with space ('${keyWithSpace}'): ${obj[keyWithSpace]}`);

    // --- Nested Properties ---
    console.log("\nAccessing nested properties:");
    // Without optional chaining (will throw error if 'address' is missing)
    try {
        console.log(`  obj.address.street (unsafe): ${obj.address.street}`);
    } catch (e) {
        console.error(`  Error accessing obj.address.street (unsafe): ${e.message}`);
    }

    // With optional chaining (?.) - returns undefined if path doesn't exist
    const street = obj.address?.street;
    console.log(`  obj.address?.street (safe): ${street}`);
    const country = obj.address?.country; // Example of deeper non-existent path
    console.log(`  obj.address?.country (safe, non-existent): ${country}`);

    // Optional chaining can be used multiple times
    const nestedValue = obj.details?.contact?.email;
    console.log(`  obj.details?.contact?.email (safe, non-existent): ${nestedValue}`);


    // --- Handling Non-existent Properties ---
    console.log("\nHandling non-existent properties:");
    const nonExistent = obj.nonExistentKey;
    console.log(`  Accessing obj.nonExistentKey: ${nonExistent}`); // Results in undefined

    // Providing a default value using || (OR operator)
    const defaultValue = obj.nonExistentKey || 'Default Value';
    console.log(`  Using || for default: ${defaultValue}`);

    // Providing a default value using ?? (Nullish Coalescing Operator) - better if 0 or '' are valid values
    // ?? only defaults if the left side is null or undefined
    const nullishDefault = obj.nonExistentKey ?? 'Nullish Default';
    console.log(`  Using ?? for default: ${nullishDefault}`);
    const ageDefault = obj.age ?? 99; // obj.age is 28, not null/undefined, so it's used
    console.log(`  Using ?? with existing property (age): ${ageDefault}`);
    obj.items = 0; // Example where 0 is a valid value
    const itemsDefaultOR = obj.items || 10; // || treats 0 as falsy, results in 10
    const itemsDefaultNullish = obj.items ?? 10; // ?? treats 0 as valid, results in 0
    console.log(`  Defaulting 0 with ||: ${itemsDefaultOR}`);
    console.log(`  Defaulting 0 with ??: ${itemsDefaultNullish}`);

}

// --- Example Usage ---
const user = {
    name: "Bob",
    age: 28,
    city: "New York",
    isActive: true,
    address: {
        street: "123 Main St",
        // zip is missing initially
    },
    items: undefined // Example for nullish check
};

accessObjectProperties(user);
accessObjectProperties({ name: "Alice" }); // Object with missing nested structure
accessObjectProperties(null);
accessObjectProperties(undefined);


module.exports = { accessObjectProperties }; 