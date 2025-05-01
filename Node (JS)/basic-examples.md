# Node.js Code Snippets Library: Basic Examples

This document provides an overview of common fundamental JavaScript tasks and basic Node.js module usage, formatted for clarity. It covers both core language features for data handling and essential patterns for interacting with the Node.js environment.

**Core JavaScript Concepts Covered:**

*   **Variables & Data Types:** `let`, `const`, `var`, String, Number, Boolean, Null, Undefined, Object, Array.
*   **Operators:** Arithmetic, Assignment, Comparison, Logical.
*   **Control Flow:** `if/else`, `switch`, loops (`for`, `while`, `for...of`, `for...in`).
*   **Functions:** Declarations, expressions, arrow functions, parameters, return values.
*   **Arrays:** Creation, accessing elements, iteration, common methods (`map`, `filter`, `reduce`, `sort`, etc.).
*   **Objects:** Creation, accessing properties, iteration, methods.
*   **Strings:** Creation, concatenation, template literals, common methods (`split`, `join`, `trim`, `replace`, `slice`, etc.).
*   **Type Conversion:** Explicit and implicit conversions.

**Common Node.js Modules/Patterns Covered:**

*   `fs`: Asynchronous and synchronous file system operations (reading, writing files, JSON handling).
*   `path`: Handling and transforming file paths across different operating systems.
*   `http`: Creating basic HTTP servers.
*   **Asynchronous Programming:** Callbacks, Promises, Timers (`setTimeout`, `setInterval`).
*   **Utilities:** Console logging.

*(External dependencies like `axios` or `lodash` would be listed in `package.json`)*

---

**1. Core JavaScript: String Manipulation**

*   **Splitting and Joining Strings**
    *   **What it does:** `split()` breaks a string into an array of substrings based on a separator. `join()` combines elements of an array into a string using a separator.
    *   **Why you use it:** Parsing delimited data, constructing strings from array data.
    *   [See standalone snippet: snippets/string_split_join.js](./snippets/string_split_join.js)
    ```javascript
    function splitAndJoinExample(text, separator = ',', joiner = '-') {
        console.log("Original:", text);
        const parts = text.split(separator);
        console.log("Split:", parts);
        const rejoined = parts.map(p => p.trim()).join(joiner); // Trim whitespace before joining
        console.log("Joined:", rejoined);
        return rejoined;
    }
    // Usage: const csvLine = " item1 , item2, item3 "; splitAndJoinExample(csvLine, ',', '|');
    ```

*   **Trimming Whitespace**
    *   **What it does:** `trim()`, `trimStart()`, `trimEnd()` remove whitespace from the beginning, end, or both ends of a string.
    *   **Why you use it:** Cleaning user input, normalizing data.
    *   [See standalone snippet: snippets/string_trimming.js](./snippets/string_trimming.js)
    ```javascript
    function trimExample(text) {
        console.log("Original:    ", `"${text}"`);
        console.log("trim():      ", `"${text.trim()}"`);
        console.log("trimStart(): ", `"${text.trimStart()}"`);
        console.log("trimEnd():   ", `"${text.trimEnd()}"`);
    }
    // Usage: const dirtyString = "   Some text   "; trimExample(dirtyString);
    ```

*   **Replacing Substrings**
    *   **What it does:** `replace()` (first occurrence) or `replaceAll()` changes parts of a string. Can use regex.
    *   **Why you use it:** Sanitizing input, formatting text, masking data.
    *   [See standalone snippet: snippets/string_replace.js](./snippets/string_replace.js)
    ```javascript
    function replaceExample(text, searchValue, replaceValue) {
        console.log("Original:", text);
        const replacedFirst = text.replace(searchValue, replaceValue);
        console.log(`Replacing first "${searchValue}":`, replacedFirst);
        if (typeof text.replaceAll === 'function') {
             const replacedAll = text.replaceAll(searchValue, replaceValue);
             console.log(`Replacing all "${searchValue}" (replaceAll):`, replacedAll);
        } else { /* Fallback omitted for brevity */ }
        const replacedRegex = text.replace(/sample/i, 'EXAMPLE');
        console.log("Regex replace (/sample/i):", replacedRegex);
    }
    // Usage: const message = "This sample message is a sample."; replaceExample(message, "sample", "test");
    ```

*   **Extracting Substrings**
    *   **What it does:** `slice()`, `substring()` extract parts of a string based on indices.
    *   **Why you use it:** Getting specific parts of strings, truncating text.
    *   [See standalone snippet: snippets/string_extract.js](./snippets/string_extract.js)
    ```javascript
    function extractSubstringExample(text, start, end) {
        console.log("Original:", text);
        const sliced = text.slice(start, end);
        console.log(`slice(${start}, ${end}):`, sliced);
        const slicedEnd = text.slice(-6); // Last 6 characters
        console.log(`slice(-6):`, slicedEnd);
        const subStr = text.substring(start, end);
        console.log(`substring(${start}, ${end}):`, subStr);
    }
    // Usage: const identifier = "PREFIX-ABC-12345-SUFFIX"; extractSubstringExample(identifier, 7, 10);
    ```

---

**2. Core JavaScript: Array Manipulation**

*   **Iterating Over Arrays**
    *   **What it does:** Loop through array elements (`forEach`, `for...of`, `for`).
    *   **Why you use it:** To access and process each element.
    *   [See standalone snippet: snippets/array_iteration.js](./snippets/array_iteration.js)
    ```javascript
    function iterateArrayExample(arr) { /* ... */ } // Implementation omitted for brevity
    // Usage: const colors = ["Red", "Green", "Blue"]; iterateArrayExample(colors);
    ```

*   **Transforming Arrays (`map`)**
    *   **What it does:** Creates a new array by applying a function to each element.
    *   **Why you use it:** To modify or extract information into a new array.
    *   [See standalone snippet: snippets/array_map.js](./snippets/array_map.js)
    ```javascript
    function mapArrayExample(numbers) { /* ... */ } // Implementation omitted for brevity
    // Usage: const nums = [1, 2, 3, 4, 5]; mapArrayExample(nums);
    ```

*   **Filtering Arrays (`filter`)**
    *   **What it does:** Creates a new array with elements that pass a test function.
    *   **Why you use it:** To select a subset of data.
    *   [See standalone snippet: snippets/array_filter.js](./snippets/array_filter.js)
    ```javascript
    function filterArrayExample(items) { /* ... */ } // Implementation omitted for brevity
    // Usage: const mixedData = [1, "Apple", 10, "Banana", 3, "Apricot", 7]; filterArrayExample(mixedData);
    ```

*   **Aggregating Array Data (`reduce`)**
    *   **What it does:** Reduces an array to a single value using an accumulator function.
    *   **Why you use it:** Calculating sums, counts, finding min/max, grouping data.
    *   [See standalone snippet: snippets/array_reduce.js](./snippets/array_reduce.js)
    ```javascript
    function reduceArrayExample(numbers) { /* ... */ } // Implementation omitted for brevity
    // Usage: const values = [5, 10, 2, 8, 3]; reduceArrayExample(values);
    ```

*   **Sorting Arrays (`sort`)**
    *   **What it does:** Sorts array elements *in place*. Requires a compare function for non-string/complex sorts.
    *   **Why you use it:** Ordering data. **Caution:** Default sort is lexicographical.
    *   [See standalone snippet: snippets/array_sort.js](./snippets/array_sort.js)
    ```javascript
    function sortArrayExample(items) { /* ... */ } // Implementation omitted for brevity
    // Usage: const unsortedNumbers = [10, 5, 100, 2, 8]; sortArrayExample(unsortedNumbers);
    ```

---

**3. Core JavaScript: Object Manipulation**

*   **Accessing Object Properties**
    *   **What it does:** Uses dot (`.`) or bracket (`[]`) notation to get property values.
    *   **Why you use it:** Retrieving data stored in objects. Brackets needed for dynamic/special keys.
    *   [See standalone snippet: snippets/object_access.js](./snippets/object_access.js)
    ```javascript
    function accessObjectProperties(obj) { /* ... */ } // Implementation omitted for brevity
    // Usage: const user = { name: "Bob", age: 28, city: "New York", isActive: true, address: { street: "123 Main St"} }; accessObjectProperties(user);
    ```

*   **Iterating Over Object Properties**
    *   **What it does:** Loops through keys, values, or entries (`for...in`, `Object.keys/values/entries`).
    *   **Why you use it:** Processing all data, dynamic access. `Object.*` methods are generally preferred over `for...in`.
    *   [See standalone snippet: snippets/object_iteration.js](./snippets/object_iteration.js)
    ```javascript
    function iterateObjectProperties(obj) { /* ... */ } // Implementation omitted for brevity
    // Usage: const settings = { theme: "dark", fontSize: 14 }; iterateObjectProperties(settings);
    ```

---

**4. Core JavaScript: Type Conversion & Checking**

*   **Converting Between Types**
    *   **What it does:** Explicit conversion using `String()`, `Number()`, `parseInt()`, `parseFloat()`, `Boolean()`.
    *   **Why you use it:** Ensuring correct data format for operations.
    *   [See standalone snippet: snippets/type_conversion.js](./snippets/type_conversion.js)
    ```javascript
    function typeConversionExample(value) { /* ... */ } // Implementation omitted for brevity
    // Usage: typeConversionExample("42"); typeConversionExample("3.14 meters"); typeConversionExample(0);
    ```

*   **Checking Data Types (`typeof`, `instanceof`, `Array.isArray`)**
    *   **What it does:** `typeof` checks primitive type (with quirks), `instanceof` checks constructor chain, `Array.isArray` checks for arrays.
    *   **Why you use it:** Validating input, conditional logic. Be aware of `typeof null === 'object'`.
    *   [See standalone snippet: snippets/type_checking.js](./snippets/type_checking.js)
    ```javascript
    function checkTypeExample(value) { /* ... */ } // Implementation omitted for brevity
    // Usage: checkTypeExample("hello"); checkTypeExample([1, 2]); checkTypeExample(null); checkTypeExample(new Date());
    ```

---

**5. Node.js: File Handling (I/O) using `fs` module**

*   **Reading a Text File Asynchronously**
    *   **What it does:** Reads file content asynchronously using `fs.readFile` (non-blocking).
    *   **Why you use it:** Efficient I/O for servers. Handles errors via callback or Promise.
    *   [See standalone snippet: snippets/fs_read_async.js](./snippets/fs_read_async.js)
    ```javascript
    const fs = require('fs');
    const path = require('path');
    function readTextFileAsync(filepath, callback) {
        fs.readFile(path.resolve(filepath), 'utf8', (err, data) => {
            if (err) return callback(err, null);
            const lines = data.split(/\r?\n/).map(line => line.trim());
            callback(null, lines);
        });
    }
    // Usage: readTextFileAsync('my_data.txt', (error, lines) => { /*...*/ });
    ```

*   **Reading a Text File Synchronously**
    *   **What it does:** Reads file content synchronously using `fs.readFileSync` (blocking).
    *   **Why you use it:** Simpler syntax for startup scripts. **Avoid in servers**.
    *   [See standalone snippet: snippets/fs_read_sync.js](./snippets/fs_read_sync.js)
    ```javascript
    const fs = require('fs');
    const path = require('path');
    function readTextFileSync(filepath) {
        try {
            const data = fs.readFileSync(path.resolve(filepath), 'utf8');
            return data.split(/\r?\n/).map(line => line.trim());
        } catch (err) { return null; }
    }
    // Usage: const syncLines = readTextFileSync('config.ini');
    ```

*   **Writing/Appending to a Text File Asynchronously**
    *   **What it does:** Writes (`fs.writeFile`) or appends (`fs.appendFile`) asynchronously.
    *   **Why you use it:** Non-blocking way to save data/logs.
    *   [See standalone snippet: snippets/fs_write_async.js](./snippets/fs_write_async.js)
    ```javascript
    const fs = require('fs');
    const path = require('path');
    function writeTextFileAsync(filepath, content, append = false, callback) {
        const operation = append ? fs.appendFile : fs.writeFile;
        operation(path.resolve(filepath), content, 'utf8', (err) => callback(err));
    }
    // Usage: writeTextFileAsync('app.log', "Log\n", true, (err) => {});
    ```

*   **Reading/Writing JSON Files Asynchronously**
    *   **What it does:** Reads/writes JSON asynchronously, handling parsing and stringification.
    *   **Why you use it:** Non-blocking handling of configuration or data in JSON format.
    *   [See snippets: snippets/fs_read_json_async.js, snippets/fs_write_json_async.js](./snippets/fs_read_json_async.js)
    ```javascript
    // Reading (Simplified)
    function readJsonFileAsync(filepath, callback) {
        fs.readFile(path.resolve(filepath), 'utf8', (err, data) => {
            if (err) return callback(err, null);
            try { callback(null, JSON.parse(data)); }
            catch (parseErr) { callback(parseErr, null); }
        });
    }
    // Writing (Simplified)
    function writeJsonFileAsync(filepath, data, callback) {
        try {
            const jsonString = JSON.stringify(data, null, 2);
            fs.writeFile(path.resolve(filepath), jsonString, 'utf8', callback);
        } catch (stringifyErr) { process.nextTick(() => callback(stringifyErr)); }
    }
    // Usage: readJsonFileAsync('config.json', (err, data) => {}); writeJsonFileAsync('output.json', {a:1}, (err) => {});
    ```

---

**6. Node.js: File System Operations (`fs`, `path`)**

*   **Listing Directory Contents Asynchronously**
    *   **What it does:** Retrieves directory entries asynchronously (`fs.readdir`).
    *   **Why you use it:** Non-blocking discovery of files/subdirectories.
    *   [See standalone snippet: snippets/fs_list_dir_async.js](./snippets/fs_list_dir_async.js)
    ```javascript
    const fs = require('fs');
    const path = require('path');
    function listDirectoryAsync(directoryPath, callback) {
        fs.readdir(path.resolve(directoryPath), { withFileTypes: true }, (err, entries) => {
            callback(err, entries);
        });
    }
    // Usage: listDirectoryAsync('.', (err, entries) => { /* ... */ });
    ```

*   **Creating Directories Asynchronously**
    *   **What it does:** Creates directories asynchronously (`fs.mkdir`), including parents (`recursive: true`).
    *   **Why you use it:** Ensure directory structure exists non-blockingly.
    *   [See standalone snippet: snippets/fs_create_dir_async.js](./snippets/fs_create_dir_async.js)
    ```javascript
    const fs = require('fs');
    const path = require('path');
    function createDirectoryAsync(dirPath, callback) {
        fs.mkdir(path.resolve(dirPath), { recursive: true }, (err) => {
            if (err && err.code === 'EEXIST') return callback(null); // Ignore if exists
            callback(err);
        });
    }
    // Usage: createDirectoryAsync('data/processed', (err) => {});
    ```

*   **Checking if Path Exists Asynchronously**
    *   **What it does:** Checks existence/accessibility (`fs.access`) or gets stats (`fs.stat`) asynchronously.
    *   **Why you use it:** Non-blocking confirmation before file operations.
    *   [See standalone snippet: snippets/fs_check_exists_async.js](./snippets/fs_check_exists_async.js)
    ```javascript
    const fs = require('fs');
    const path = require('path');
    // Using fs.access (simpler for existence)
    function pathExistsAccessAsync(targetPath, callback) {
        fs.access(path.resolve(targetPath), fs.constants.F_OK, (err) => callback(null, !err));
    }
    // Using fs.stat (more info)
    function pathExistsStatAsync(targetPath, callback) { /* Implementation omitted */ }
    // Usage: pathExistsAccessAsync('file.txt', (err, exists) => {});
    ```

*   **Using `path.join` and `path.resolve`**
    *   **What it does:** `join` combines segments platform-independently. `resolve` computes absolute path.
    *   **Why you use it:** Create reliable, cross-platform paths. Avoid manual concatenation.
    *   [See standalone snippet: snippets/path_operations.js](./snippets/path_operations.js)
    ```javascript
    const path = require('path');
    const joinedPath = path.join('data', '..', 'processed', 'file.txt'); // 'processed/file.txt' or 'processed\file.txt'
    const resolvedPath = path.resolve('data', 'file.txt'); // '/abs/path/to/cwd/data/file.txt'
    console.log("Joined:", joinedPath);
    console.log("Resolved:", resolvedPath);
    ```

---

**7. Node.js: Basic HTTP Server**

*   **Creating a Simple HTTP Server**
    *   **What it does:** Uses `http` module for a basic server listening on a port.
    *   **Why you use it:** Fundamental building block for web apps/APIs in Node.js.
    *   [See standalone snippet: snippets/http_server_basic.js](./snippets/http_server_basic.js)
    ```javascript
    const http = require('http');
    function createBasicServer(port = 3000) {
        const server = http.createServer((req, res) => {
            console.log(`Request: ${req.method} ${req.url}`);
            if (req.url === '/') {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Hello World!\n');
            } else { /* Other routes/404 omitted */ }
        });
        server.listen(port, () => console.log(`Server on http://localhost:${port}`));
        server.on('error', (err) => console.error('Server error:', err));
        return server;
    }
    // Usage: const myServer = createBasicServer(8080);
    ```

---

**8. Node.js: Asynchronous Patterns & Utilities**

*   **Working with Promises**
    *   **What it does:** Handles async operations using `.then()`, `.catch()`, `.finally()`. Foundation for `async/await`.
    *   **Why you use it:** Avoid callback hell, manage async flow more cleanly.
    *   [See standalone snippet: snippets/promises_basic.js](./snippets/promises_basic.js)
    ```javascript
    function simulateAsyncTask(shouldSucceed) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldSucceed) resolve({ data: "Success" });
                else reject(new Error("Failure"));
            }, 50); // Short delay
        });
    }
    // Usage: simulateAsyncTask(true).then(res => console.log(res)).catch(err => console.error(err)).finally(() => console.log("Done"));
    ```

*   **Using `setTimeout` and `setInterval`**
    *   **What it does:** `setTimeout` runs once after delay. `setInterval` runs repeatedly.
    *   **Why you use it:** Schedule tasks, delays, polling. Use `clearTimeout`/`clearInterval` to cancel.
    *   [See standalone snippet: snippets/timers.js](./snippets/timers.js)
    ```javascript
    // setTimeout: Run once after 50ms
    const timeoutId = setTimeout(() => console.log("setTimeout!"), 50);
    // clearTimeout(timeoutId); // Optional: cancel it

    // setInterval: Run every 50ms, stop after 3 times
    let intervalCount = 0;
    const intervalId = setInterval(() => {
        console.log(`setInterval tick #${++intervalCount}`);
        if (intervalCount >= 3) clearInterval(intervalId);
    }, 50);
    ```

*   **Basic Console Logging**
    *   **What it does:** Uses `console.log/warn/error/info/time/timeEnd` for output.
    *   **Why you use it:** Essential for debugging, tracing, feedback.
    *   [See standalone snippet: snippets/console_logging.js](./snippets/console_logging.js)
    ```javascript
    console.log("Simple log.");
    console.warn("A warning.");
    console.error("An error!");
    console.info("Information.");
    console.time("timer"); // Start timer
    /* ... code ... */
    console.timeEnd("timer"); // Stop timer
    ```

---

**Considerations for Basic JavaScript & Node.js:**

1.  **Asynchronous Nature:** Prioritize async operations (Promises, `async/await`) for I/O in Node.js to avoid blocking. Use sync versions sparingly.
2.  **Error Handling:** Use `try...catch` with `async/await` or `.catch()` with Promises. Handle errors from callbacks.
3.  **Scope & Immutability:** Prefer `const`/`let` over `var`. Favor immutable operations where practical.
4.  **Modularity & Dependencies:** Use modules (`require` or `import`) and manage external packages via `package.json`.
5.  **Cross-Platform:** Use `path` module for file paths.
6.  **Strict Mode:** Enable `'use strict';`.
7.  **Type Safety:** Consider TypeScript or JSDoc for larger projects.
8.  **Testing:** Use testing frameworks (Jest, Mocha, etc.).

This collection covers fundamental JavaScript manipulation techniques and basic Node.js patterns essential for developers. Advanced examples will cover streams, worker threads, more complex networking, and ecosystem libraries.