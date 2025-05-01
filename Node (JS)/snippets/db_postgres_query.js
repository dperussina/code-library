'use strict';

// Requires: npm install pg
// Also requires a running PostgreSQL database accessible with the provided credentials.
// Environment variables are recommended for configuration:
// DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME

const { Pool } = require('pg');

// --- Database Configuration ---
// Load configuration from environment variables with sensible defaults.
const dbConfig = {
    user: process.env.DB_USER || 'postgres', // Default user
    password: process.env.DB_PASSWORD || 'password', // Default password - CHANGE THIS!
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'testdb', // Default database name
    // Pool configuration options (optional)
    max: parseInt(process.env.DB_POOL_MAX || '10', 10), // Max number of clients in the pool
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000', 10), // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT || '5000', 10), // How long to wait for a connection acquisition
};

console.log("Database Configuration:", { ...dbConfig, password: dbConfig.password ? '******' : 'Not Set' });

// --- Create Connection Pool ---
// A Pool manages multiple client connections automatically.
// It's the recommended way to interact with the DB in multi-request scenarios.
let pool;
try {
    pool = new Pool(dbConfig);
} catch (error) {
     console.error("FATAL: Failed to create database pool instance.", error);
     process.exit(1); // Exit if pool cannot even be instantiated
}


// --- Event Listeners for the Pool ---
pool.on('connect', (client) => {
    console.log(`DB client connected (Client ID: ${client.processID})`);
    // You could potentially set session variables here if needed
    // client.query('SET search_path TO my_schema');
});

pool.on('acquire', (client) => {
     console.log(`DB client acquired from pool (Client ID: ${client.processID})`);
});

pool.on('remove', (client) => {
    console.log(`DB client removed from pool (Client ID: ${client.processID})`);
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle DB client', {
        error: err.message,
        clientInfo: client ? `Client PID: ${client.processID}`: 'N/A'
    });
    // Recommended action: Log the error and potentially restart the application
    // depending on the severity and frequency. You might not need to exit immediately.
    // process.exit(-1);
});


// --- Test Connection Function ---
/**
 * Attempts a single connection to the database to verify configuration.
 */
async function testDbConnection() {
     let client;
     try {
         client = await pool.connect();
         const res = await client.query('SELECT NOW() as now, current_database() as db');
         console.log('Database connection test successful!');
         console.log('  Server Time:', res.rows[0].now);
         console.log('  Database Name:', res.rows[0].db);
         return true;
     } catch (err) {
         console.error('Database connection test failed:', err.message);
         // Provide hints based on common errors
         if (err.code === 'ECONNREFUSED') console.error("  Hint: Is the database server running and accessible at the specified host/port?");
         if (err.code === 'ENOTFOUND') console.error("  Hint: Could not resolve the database hostname.");
         if (err.code === '28P01' || err.code === '3D000') console.error("  Hint: Check database name, username, and password."); // password auth failed or database does not exist
         return false;
     } finally {
         if (client) client.release(); // Always release the client
     }
}

// --- Query Execution Function ---
/**
 * Executes a SQL query using a client from the connection pool.
 * Uses parameterized queries to prevent SQL injection.
 *
 * @async
 * @param {string} sql - The SQL query string (use $1, $2... for parameters).
 * @param {Array<any>} [params=[]] - An array of parameters for the query.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of result rows.
 * @throws {Error} Throws an error if the query fails.
 */
async function queryDatabase(sql, params = []) {
    let client;
    try {
        client = await pool.connect(); // Acquire a client from the pool
        const queryText = sql.length > 100 ? `${sql.substring(0, 97)}...` : sql; // Truncate long queries for logging
        console.log(`Executing query: ${queryText}`, params.length > 0 ? `with params: ${JSON.stringify(params)}`: '');

        const startTime = Date.now();
        const result = await client.query(sql, params);
        const duration = Date.now() - startTime;

        console.log(`Query successful (${duration}ms). Returned ${result.rowCount} rows.`);
        return result.rows; // Return only the data rows
    } catch (err) {
        console.error('Database query error:', err);
        // Log details for debugging
        console.error('  SQL:', sql);
        console.error('  Params:', params);
        console.error('  Error Code:', err.code); // Useful for specific error handling
        throw err; // Re-throw the error for higher-level handling
    } finally {
        if (client) {
            client.release(); // IMPORTANT: Release the client back to the pool
            console.log(`Database client (PID ${client.processID}) released.`);
        } else {
             console.warn("Query attempt finished, but no client was acquired.");
        }
    }
}

// --- Graceful Shutdown Function ---
/**
 * Closes the database connection pool. Should be called on application exit.
 */
async function closeDbPool() {
    if (!pool) {
         console.log("Database pool does not exist or already closed.");
        return;
    }
    console.log("Closing database connection pool...");
    try {
        await pool.end(); // Closes all clients in the pool
        console.log("Database pool closed successfully.");
        pool = null; // Set pool to null after closing
    } catch (err) {
        console.error("Error closing database pool:", err.stack);
        // Depending on context, you might want to force exit or just log
    }
}

// --- Example Usage ---
async function main() {
    // 1. Test connection on startup
    const connected = await testDbConnection();
    if (!connected) {
        console.error("Exiting due to database connection failure.");
        // Optional: Trigger graceful shutdown of other resources if needed
        await closeDbPool();
        process.exit(1);
    }

    // 2. Example Queries (Assuming a 'users' table exists)
    //    CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE);
    //    INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com'), ('Bob', 'bob@example.com');
    console.log("\n--- Running Example Queries ---");
    try {
        // Query 1: Get all users
        const allUsers = await queryDatabase('SELECT id, name, email FROM users ORDER BY id');
        console.log("All Users:", allUsers);

        // Query 2: Get a specific user (Parameterized)
        const userIdToFind = 1;
        const specificUser = await queryDatabase('SELECT id, name, email FROM users WHERE id = $1', [userIdToFind]);
        if (specificUser.length > 0) {
            console.log(`User with ID ${userIdToFind}:`, specificUser[0]);
        } else {
            console.log(`User with ID ${userIdToFind} not found.`);
        }

         // Query 3: Insert a new user (Parameterized) - Be cautious running inserts repeatedly
         const newUserEmail = `charlie_${Date.now()}@example.com`; // Unique email for testing
         const insertResult = await queryDatabase(
             'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email', // RETURNING gets the inserted row
             ['Charlie', newUserEmail]
         );
         console.log("Inserted User:", insertResult[0]);


    } catch (error) {
        console.error("Error during example query execution:", error.message);
        // Application might choose to continue or exit depending on the error
    } finally {
        // 3. Close the pool when done
        await closeDbPool();
    }
}

// Run main if executed directly
if (require.main === module) {
    main();

    // Setup graceful shutdown for the pool on process exit signals
    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    signals.forEach(signal => {
        process.on(signal, async () => {
            console.log(`\n${signal} received. Closing DB pool...`);
            await closeDbPool();
            process.exit(0); // Exit cleanly after pool closes
        });
    });
}

// Export functions for potential use in other modules
module.exports = { queryDatabase, closeDbPool, testDbConnection }; 