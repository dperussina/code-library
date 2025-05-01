'use strict';

const http = require('http');
const url = require('url'); // To parse URL query parameters

/**
 * Creates and starts a basic Node.js HTTP server using the built-in 'http' module.
 * Handles simple routing and responds with plain text or basic JSON.
 * @param {number} [port=3000] - The port number to listen on.
 * @returns {http.Server} The created server instance.
 */
function createBasicServer(port = 3000) {
    // Create the server instance, providing a request listener function
    const server = http.createServer((req, res) => {
        // req: http.IncomingMessage object (Readable Stream) - contains request details
        // res: http.ServerResponse object (Writable Stream) - used to send back response

        const requestUrl = url.parse(req.url, true); // true parses query string into object
        const method = req.method;
        const path = requestUrl.pathname;
        const query = requestUrl.query;

        console.log(`\n--- Incoming Request ---`);
        console.log(`Timestamp: ${new Date().toISOString()}`);
        console.log(`Method: ${method}`);
        console.log(`Path: ${path}`);
        console.log(`Query Parameters:`, query);
        console.log(`Headers:`, req.headers);

        // --- Basic Routing ---
        res.setHeader('Content-Type', 'text/plain'); // Default content type

        if (method === 'GET' && path === '/') {
            res.statusCode = 200; // OK
            res.end('Hello World from Node.js HTTP Server!\n');
        } else if (method === 'GET' && path === '/about') {
            res.statusCode = 200;
            res.end('This is the basic About page.\n');
        } else if (method === 'GET' && path === '/data') {
             res.setHeader('Content-Type', 'application/json'); // Set JSON content type
             res.statusCode = 200;
             const responseData = {
                 message: "Here is some data",
                 timestamp: Date.now(),
                 queryParamsReceived: query // Echo back query params
             };
             res.end(JSON.stringify(responseData)); // Send JSON string
        } else if (method === 'POST' && path === '/submit') {
             let body = '';
             // Request body data arrives in chunks (streams)
             req.on('data', chunk => {
                 body += chunk.toString(); // Convert Buffer chunk to string
             });
             // When all chunks are received
             req.on('end', () => {
                 console.log('Received POST body:', body);
                 // Attempt to parse if content-type suggests JSON
                 let parsedBody = {};
                 if (req.headers['content-type'] === 'application/json') {
                     try {
                         parsedBody = JSON.parse(body);
                     } catch (e) {
                         console.error("Error parsing JSON body:", e);
                         res.statusCode = 400; // Bad Request
                         res.setHeader('Content-Type', 'application/json');
                         res.end(JSON.stringify({ error: "Invalid JSON format in request body." }));
                         return;
                     }
                 } else {
                     // Handle other content types (e.g., application/x-www-form-urlencoded) if needed
                     parsedBody = { raw: body };
                 }

                 res.statusCode = 200;
                 res.setHeader('Content-Type', 'application/json');
                 res.end(JSON.stringify({ status: "Received POST", data: parsedBody }));
             });
              req.on('error', (err) => {
                  console.error("Error reading request body:", err);
                   res.statusCode = 500;
                   res.end("Server error reading request body.");
             });

        } else {
            // --- Not Found ---
            res.statusCode = 404; // Not Found
            res.end('Error 404: Resource Not Found\n');
        }
    });

    // Start listening on the specified port
    server.listen(port, () => {
        console.log(`Basic HTTP server started and listening on http://localhost:${port}`);
    });

    // --- Optional: Handle server errors (e.g., port already in use) ---
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Error: Port ${port} is already in use. Cannot start server.`);
        } else {
            console.error('Server error:', err);
        }
         // Optional: Exit process if server fails to start
         // process.exit(1);
    });

     server.on('clientError', (err, socket) => {
         console.error('Client connection error:', err);
         // socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'); // Gracefully close bad requests
     });

    return server; // Return the server instance
}

// --- Example Usage ---
// To run this server, save the file and execute `node http_server_basic.js` in your terminal.
// Then you can access http://localhost:3000, http://localhost:3000/about, etc. in your browser
// or use tools like curl:
// curl http://localhost:3000/data?user=test
// curl -X POST -H "Content-Type: application/json" -d '{"value": 42}' http://localhost:3000/submit
// curl -X POST -d 'raw text body' http://localhost:3000/submit

if (require.main === module) {
    // Start the server only if the script is run directly
    const serverInstance = createBasicServer(process.env.PORT || 3000);

    // Example: Graceful shutdown handling (optional)
    process.on('SIGINT', () => {
        console.log('\nSIGINT received. Shutting down server...');
        serverInstance.close(() => {
            console.log('Server shut down gracefully.');
            process.exit(0);
        });
         // Force shutdown after timeout if needed
        setTimeout(() => {
            console.error('Could not close connections in time, forcing shutdown.');
            process.exit(1);
        }, 5000);
    });
}

module.exports = { createBasicServer }; 