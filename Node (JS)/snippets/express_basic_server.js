'use strict';

// Requires: npm install express
// Run this file, then access http://localhost:3000 (or the specified port) in your browser/tool.
// Example requests:
// GET /
// GET /about
// GET /api/users
// GET /api/users/1
// POST /api/users  (with JSON body like {"name": "Charlie", "email": "charlie@example.com"})
// GET /nonexistentpath  (should return 404)

const express = require('express');
const http = require('http'); // Required to create server explicitly for graceful shutdown

/**
 * Creates and configures a basic Express application with middleware and routing.
 * Includes request logging, JSON/URL-encoded body parsing, sample API routes,
 * 404 handling, and basic error handling.
 *
 * @returns {express.Application} The configured Express app instance.
 */
function createExpressApp() {
    const app = express();

    // --- Core Middleware ---

    // 1. Request Logger: Logs basic information about each incoming request.
    app.use((req, res, next) => {
        const startTime = process.hrtime(); // Get high-resolution time
        console.log(`-> ${req.method} ${req.originalUrl} from ${req.ip}`);

        // Log when the response finishes
        res.on('finish', () => {
            const duration = process.hrtime(startTime);
            const durationMs = (duration[0] * 1e3 + duration[1] * 1e-6).toFixed(3); // Convert to ms
            console.log(`<- ${req.method} ${req.originalUrl} responded ${res.statusCode} in ${durationMs}ms`);
        });

        next(); // Pass control to the next middleware/handler
    });

    // 2. Body Parsers: Parse incoming request bodies.
    // Parses JSON payloads (Content-Type: application/json)
    app.use(express.json({ limit: '1mb' })); // Limit payload size
    // Parses URL-encoded payloads (Content-Type: application/x-www-form-urlencoded)
    app.use(express.urlencoded({ extended: true, limit: '1mb' })); // `extended: true` allows richer objects

    // 3. Static Files (Optional): Serve static files (CSS, JS, images) from a directory.
    // app.use(express.static(path.join(__dirname, 'public'))); // Example

    // --- Application Routes ---

    // Simple GET route
    app.get('/', (req, res) => {
        res.status(200).type('text/plain').send('Welcome to the Advanced Express App!');
    });

    app.get('/about', (req, res) => {
        res.status(200).json({
            appName: "Express Advanced Example",
            version: "1.0.0",
            description: "Demonstrating routing, middleware, and error handling."
        });
    });

    // --- API Routes Example (Simple In-Memory "DB") ---
    let users = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' }
    ];
    let nextUserId = 3;

    // GET all users
    app.get('/api/users', (req, res) => {
        res.status(200).json(users);
    });

    // GET a single user by ID
    app.get('/api/users/:id', (req, res, next) => {
        const userId = parseInt(req.params.id, 10);
        const user = users.find(u => u.id === userId);

        if (user) {
            res.status(200).json(user);
        } else {
            // User not found - create a specific error and pass to error handler
            const error = new Error(`User with ID ${userId} not found.`);
            error.status = 404; // Set custom status code
            next(error); // Pass error to the error handling middleware
        }
    });

    // POST (create) a new user
    app.post('/api/users', (req, res, next) => {
        const { name, email } = req.body; // Assumes express.json() or express.urlencoded() middleware

        if (!name || !email) {
            const error = new Error('Missing required fields: name and email.');
            error.status = 400; // Bad Request
            return next(error); // Pass to error handler
        }

        // Basic email validation example
        if (!/\S+@\S+\.\S+/.test(email)) {
             const error = new Error('Invalid email format.');
             error.status = 400;
             return next(error);
        }

        // Check if email already exists
         if (users.some(u => u.email === email)) {
             const error = new Error(`Email "${email}" already exists.`);
             error.status = 409; // Conflict
             return next(error);
         }


        const newUser = {
            id: nextUserId++,
            name: name.trim(),
            email: email.trim()
        };
        users.push(newUser);
        console.log('Created new user:', newUser);

        // Respond with 201 Created status and the new user object
        res.status(201).location(`/api/users/${newUser.id}`).json(newUser);
    });

    // --- Catch-all for 404 Not Found Routes ---
    // This middleware runs if no preceding route handler matched.
    app.use((req, res, next) => {
        const error = new Error(`Resource not found: ${req.originalUrl}`);
        error.status = 404;
        next(error); // Pass the 404 error to the main error handler
    });

    // --- Centralized Error Handling Middleware ---
    // Must have 4 arguments (err, req, res, next) to be recognized as an error handler.
    // This middleware catches errors passed via `next(error)` from route handlers/other middleware.
    // It should be defined LAST, after all other app.use() and routes.
    app.use((err, req, res, next) => {
        console.error("--- Unhandled Error ---");
        console.error("Timestamp:", new Date().toISOString());
        console.error("Route:", `${req.method} ${req.originalUrl}`);
        // Avoid logging sensitive details from the error in production if necessary
        console.error("Error Status:", err.status || 500);
        console.error("Error Message:", err.message);
        // Log stack trace in development for easier debugging
        if (process.env.NODE_ENV !== 'production') {
             console.error("Stack Trace:", err.stack || 'No stack trace available');
        }
        console.error("--- End Unhandled Error ---");


        // Send a user-friendly JSON error response
        res.status(err.status || 500).json({
            error: {
                message: err.message || 'An unexpected internal server error occurred.',
                // Optionally include status code in body
                // status: err.status || 500,
                // Optionally include stack trace in dev response (use with caution)
                // stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
            }
        });
         // Note: We don't call next() here in the final error handler unless we
         // want to delegate to Express's default built-in error handler.
    });

    return app;
}


/**
 * Starts the Express server and handles graceful shutdown.
 * @param {express.Application} app - The Express app instance.
 * @param {number} port - The port number to listen on.
 * @returns {http.Server} The Node HTTP server instance.
 */
function startServer(app, port) {
    // Create HTTP server explicitly to manage connections for graceful shutdown
    const server = http.createServer(app);

    server.listen(port, () => {
        console.log(`Express server listening on http://localhost:${port}`);
        console.log(`Node environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Handle server startup errors
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Error: Port ${port} is already in use.`);
        } else {
            console.error('Server startup error:', err);
        }
        process.exit(1); // Exit if server fails to start
    });

    // --- Graceful Shutdown Handling ---
    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    signals.forEach(signal => {
        process.on(signal, () => {
            console.log(`\n${signal} received. Shutting down gracefully...`);
            server.close(() => {
                console.log('HTTP server closed.');
                // Add any other cleanup logic here (e.g., close DB connections)
                process.exit(0); // Exit cleanly
            });

            // Force shutdown after a timeout if connections aren't closing
            setTimeout(() => {
                console.error('Could not close connections in time, forcing shutdown.');
                process.exit(1);
            }, 10000); // 10 seconds timeout
        });
    });

    return server;
}


// --- Main Execution ---
if (require.main === module) {
    const app = createExpressApp();
    const PORT = process.env.PORT || 3000;
    const serverInstance = startServer(app, PORT);
    // serverInstance can be used if needed, e.g., for socket.io attachment
}

// Export the app creation function if needed by other modules (e.g., for testing)
module.exports = { createExpressApp, startServer };
