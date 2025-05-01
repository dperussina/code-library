'use strict';

// Requires: npm install ws
// Run this file to start the WebSocket server.
// Connect using a WebSocket client (e.g., browser JavaScript, Postman, wscat).
// Client Example (Browser Console):
// > const ws = new WebSocket('ws://localhost:8080');
// > ws.onopen = () => { console.log('Connected!'); ws.send(JSON.stringify({type: 'echo', payload: 'Hello Server!'})); };
// > ws.onmessage = (event) => console.log('From Server:', JSON.parse(event.data));
// > ws.onclose = () => console.log('Disconnected.');
// > ws.onerror = (err) => console.error('WS Error:', err);
// > ws.send(JSON.stringify({ type: 'broadcast', message: 'Hi everyone!' }));

const { WebSocketServer, WebSocket } = require('ws');
const http = require('http'); // Can optionally integrate with existing HTTP server

/**
 * Creates and manages a WebSocket server.
 * Handles connections, messages, disconnections, errors, and broadcasting.
 *
 * @param {number|http.Server} serverOrPort - Either a port number to listen on directly,
 *                                            or an existing HTTP server instance to attach to.
 * @returns {{wss: WebSocketServer, broadcast: Function}} An object containing the WebSocketServer instance
 *                                                         and a broadcast utility function.
 */
function createWebSocketServer(serverOrPort) {
    let wss;
    let serverInstance = null; // Keep track if we created the server

    if (typeof serverOrPort === 'number') {
        // Option 1: Create a simple HTTP server just for the WebSocket server
        serverInstance = http.createServer((req, res) => {
             // Handle basic HTTP requests if needed (e.g., health check)
             if (req.url === '/health') {
                 res.writeHead(200, { 'Content-Type': 'text/plain' });
                 res.end('WebSocket Server OK');
             } else {
                 res.writeHead(404);
                 res.end();
             }
        });
        wss = new WebSocketServer({ server: serverInstance });
        const port = serverOrPort;
        serverInstance.listen(port, () => {
            console.log(`WebSocket server started and listening on ws://localhost:${port}`);
            console.log(`(Also listening for basic HTTP requests on port ${port})`);
        });
        serverInstance.on('error', (err) => {
             console.error(`HTTP Server Error (for WebSocket):`, err);
             process.exit(1); // Exit if underlying HTTP server fails
        });

    } else if (serverOrPort instanceof http.Server) {
        // Option 2: Attach to an existing HTTP server (e.g., from Express)
        wss = new WebSocketServer({ server: serverOrPort });
        console.log(`WebSocket server attached to existing HTTP server.`);
    } else {
        throw new Error("Invalid argument: Provide a port number or an http.Server instance.");
    }


    // --- Client Management ---
    // Use a Map for clients to potentially store metadata alongside the WebSocket object
    const clients = new Map(); // Map<WebSocket, { id: string, joinedAt: number, username?: string }>

    // --- WebSocket Server Event Handling ---

    wss.on('connection', (ws, req) => {
        // Generate a unique ID for the client (using sec-websocket-key is common but not guaranteed unique forever)
        // A more robust approach might use UUIDs.
        const clientId = req.headers['sec-websocket-key'] || `client_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        const metadata = { id: clientId, joinedAt: Date.now() };
        clients.set(ws, metadata);

        console.log(`Client connected: ${metadata.id} (IP: ${req.socket.remoteAddress}). Total clients: ${clients.size}`);

        // Send welcome message to the newly connected client
        safeSend(ws, { type: 'info', message: `Welcome! Your ID is ${metadata.id}` });
        // Notify other clients about the new connection (optional)
        broadcast({ type: 'status', status: 'connected', userId: metadata.id, timestamp: Date.now() }, ws);


        // --- Individual WebSocket Event Handling ---

        // Handle messages received from this client
        ws.on('message', (messageBuffer) => {
            const messageString = messageBuffer.toString(); // Convert buffer to string
            console.log(`Received from ${metadata.id}: ${messageString.substring(0, 200)}${messageString.length > 200 ? '...' : ''}`);

            try {
                const messageData = JSON.parse(messageString); // Assume JSON messages

                // --- Message Routing ---
                switch (messageData.type) {
                    case 'echo':
                        safeSend(ws, { type: 'echo-reply', originalPayload: messageData.payload, timestamp: Date.now() });
                        break;
                    case 'broadcast':
                        broadcast({ type: 'message', senderId: metadata.id, content: messageData.payload, timestamp: Date.now() }, ws); // Exclude sender
                        break;
                    case 'set-username':
                         if(messageData.username && typeof messageData.username === 'string') {
                             metadata.username = messageData.username.trim().substring(0, 50); // Sanitize/limit username
                             safeSend(ws, { type: 'info', message: `Username set to: ${metadata.username}` });
                             broadcast({ type: 'status', status: 'username-set', userId: metadata.id, username: metadata.username }, ws);
                         } else {
                              safeSend(ws, { type: 'error', message: 'Invalid username format.' });
                         }
                        break;
                     case 'get-clients': // Example: Get list of connected client IDs/usernames
                         const clientList = Array.from(clients.values()).map(m => ({ id: m.id, username: m.username }));
                         safeSend(ws, { type: 'client-list', clients: clientList });
                         break;
                    default:
                        console.warn(`Received unknown message type from ${metadata.id}: ${messageData.type}`);
                        safeSend(ws, { type: 'error', message: `Unknown message type: ${messageData.type}` });
                }

            } catch (e) {
                console.error(`Failed to parse JSON or process message from ${metadata.id}:`, e);
                safeSend(ws, { type: 'error', message: 'Invalid message format. Send valid JSON with a "type" property.' });
            }
        });

        // Handle client disconnection (graceful or abrupt)
        ws.on('close', (code, reason) => {
            const reasonString = reason ? reason.toString() : 'No reason given';
            console.log(`Client disconnected: ${metadata.id} (Code: ${code}, Reason: ${reasonString}). Total clients: ${clients.size - 1}`);
            // Notify other clients about the disconnection
             broadcast({ type: 'status', status: 'disconnected', userId: metadata.id, username: metadata.username, timestamp: Date.now() }, ws);
             clients.delete(ws); // Remove client from tracking
        });

        // Handle WebSocket errors for this client
        ws.on('error', (error) => {
            console.error(`WebSocket error for client ${metadata.id}:`, error);
            // Connection might already be closed or closing. Ensure cleanup.
            if (clients.has(ws)) {
                 broadcast({ type: 'status', status: 'error', userId: metadata.id, username: metadata.username, error: error.message }, ws);
                 clients.delete(ws);
            }
             // Optionally try to close the socket if it seems stuck
            try { ws.terminate(); } catch (e) { /* ignore */ }
        });
    });

    // Handle server-level errors (e.g., issues with the underlying HTTP server)
     wss.on('error', (error) => {
         console.error('WebSocket Server Error:', error);
         // Consider application restart strategy here
     });

     console.log("WebSocket server event listeners attached.");


    // --- Utility Functions ---

    /**
     * Safely sends a JSON message to a WebSocket client.
     * Handles potential errors during stringification or sending.
     * @param {WebSocket} clientWs - The client WebSocket instance.
     * @param {object} data - The JavaScript object to send.
     */
    function safeSend(clientWs, data) {
        if (clientWs.readyState === WebSocket.OPEN) {
            try {
                const message = JSON.stringify(data);
                 clientWs.send(message, (err) => {
                     if (err) {
                         console.error(`Error sending message to client ${clients.get(clientWs)?.id}:`, err);
                         // Consider closing/removing client if send fails repeatedly
                          try { clientWs.terminate(); } catch (e) { /* ignore */ }
                          clients.delete(clientWs);
                     }
                 });
            } catch (e) {
                console.error(`Error stringifying message for client ${clients.get(clientWs)?.id}:`, e);
            }
        } else {
             console.warn(`Attempted to send to client ${clients.get(clientWs)?.id} with readyState ${clientWs.readyState}`);
        }
    }

    /**
     * Broadcasts a JSON message to all connected clients, optionally excluding the sender.
     * @param {object} data - The JavaScript object to broadcast.
     * @param {WebSocket|null} [senderWs=null] - The WebSocket instance of the sender (to exclude).
     */
    function broadcast(data, senderWs = null) {
         const message = JSON.stringify(data); // Stringify once for efficiency
        const senderId = senderWs ? clients.get(senderWs)?.id : 'SERVER';
        console.log(`Broadcasting (from ${senderId}): ${message.substring(0,100)}... to ${clients.size} clients`);

        clients.forEach((metadata, clientWs) => {
            // Send to all clients EXCEPT the sender, if specified
            if (clientWs !== senderWs) {
                 safeSend(clientWs, data); // Use safeSend to handle errors per client
            }
        });
    }

    // --- Graceful Shutdown for WebSocket Server ---
    function closeWebSocketServer(callback) {
        console.log('Closing WebSocket server...');
        wss.close(() => {
            console.log('WebSocket server instance closed.');
            if (serverInstance) { // If we created the HTTP server, close it too
                 console.log('Closing underlying HTTP server...');
                serverInstance.close(() => {
                    console.log('Underlying HTTP server closed.');
                    if (callback) callback();
                });
            } else if (callback) {
                callback();
            }
        });

        // Force close remaining clients after a timeout
        console.log(`Terminating ${wss.clients.size} connected clients...`);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.terminate();
            }
        });
         // Give terminate a moment, then call back if needed (though wss.close callback is usually sufficient)
        setTimeout(() => {
             if (serverInstance && serverInstance.listening && !callback) {
                  console.warn("Force closing HTTP server as WebSocket closure seems stuck.");
                  serverInstance.close();
             }
        }, 3000);
    }

    // Return the server instance and utility functions
    return { wss, broadcast, clients, closeWebSocketServer };
}


// --- Main Execution ---
if (require.main === module) {
    const PORT = process.env.WS_PORT || 8080;
    const { closeWebSocketServer } = createWebSocketServer(PORT);

    // Handle graceful shutdown
    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    signals.forEach(signal => {
        process.on(signal, () => {
            console.log(`\n${signal} received.`);
            closeWebSocketServer(() => {
                 process.exit(0); // Exit cleanly after server closes
            });
        });
    });
}

module.exports = { createWebSocketServer }; 