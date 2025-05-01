// Note: This example requires adding `tokio`, `tokio-tungstenite`, `futures-util`, and `url` crates:
// [dependencies]
// tokio = { version = "1", features = ["full"] }
// tokio-tungstenite = { version = "0.17", features = ["native-tls"] } // Or "rustls-tls" for rustls
// futures-util = "0.3" // Provides SinkExt and StreamExt traits
// url = "2"

use tokio::net::TcpStream;
use tokio_tungstenite::{
    connect_async, 
    MaybeTlsStream, 
    WebSocketStream
};
use tokio_tungstenite::tungstenite::protocol::Message;
use url::Url;
use futures_util::{StreamExt, SinkExt}; // For stream/sink methods
use std::error::Error;

/// Connects to a WebSocket server, sends a message, and prints received messages.
async fn run_websocket_client(ws_url: &str) -> Result<(), Box<dyn Error + Send + Sync>> {
    // Parse the URL for the WebSocket server.
    let url = Url::parse(ws_url)?;
    println!("Connecting to: {}", url);

    // Attempt to establish the WebSocket connection.
    // `connect_async` performs the WebSocket handshake over TCP.
    // It returns the WebSocket stream and the HTTP response from the server.
    let (ws_stream, response) = connect_async(url).await.map_err(|e| format!("Failed to connect: {}", e))?;
    
    println!("WebSocket handshake successful!");
    println!("Server HTTP response status: {}", response.status());
    // You can inspect response headers if needed:
    // println!("Response headers: {:#?}", response.headers());

    // Split the WebSocket stream into a sender (Sink) and receiver (Stream).
    // This allows sending and receiving concurrently if needed (e.g., in separate tasks).
    let (mut write, mut read) = ws_stream.split();

    // --- Sending a message --- 
    let message_to_send = "Hello, WebSocket from Rust!";
    println!("Sending message: '{}'", message_to_send);
    // Send a text message.
    // `send` is an async method from the `SinkExt` trait.
    write.send(Message::Text(message_to_send.to_string())).await?;
    println!("Message sent successfully.");

    // Optionally send other types of messages:
    // write.send(Message::Binary(vec![1, 2, 3])).await?;
    // write.send(Message::Ping(vec![])).await?;

    // --- Receiving messages --- 
    println!("Waiting for messages from server...");
    // Loop to continuously receive messages.
    // `read.next()` gets the next message from the stream (async).
    while let Some(message_result) = read.next().await {
        match message_result {
            Ok(message) => {
                match message {
                    Message::Text(text) => {
                        println!("Received Text: {}", text);
                        // If it's the echo server, close after receiving the echo.
                        if text.contains(message_to_send) {
                             println!("Received echo, closing connection...");
                             break; // Exit loop after receiving expected echo
                        }
                    }
                    Message::Binary(bin) => {
                        println!("Received Binary: {:?}", bin);
                    }
                    Message::Ping(ping_data) => {
                        println!("Received Ping, sending Pong");
                        // Respond with a Pong frame containing the same payload.
                        write.send(Message::Pong(ping_data)).await?;
                    }
                    Message::Pong(pong_data) => {
                        println!("Received Pong: {:?}", pong_data);
                    }
                    Message::Close(close_frame) => {
                        println!("Received Close frame: {:?}", close_frame);
                        // The server initiated the close handshake.
                        // The stream is likely closing or closed now.
                        break; // Exit the loop
                    }
                    // Frame type is used internally by tungstenite, typically not exposed here.
                    // Message::Frame(_) => { /* Usually ignore */ }
                }
            }
            Err(e) => {
                eprintln!("Error receiving message: {}", e);
                break; // Exit loop on error
            }
        }
    }

    // Optionally, explicitly close the connection if we initiated the break.
    // Note: `write.close()` initiates the close handshake.
    // The underlying TCP stream is closed when `ws_stream` (or `write` and `read`) are dropped.
    // write.close().await?;
    println!("WebSocket client finished.");
    Ok(())
}

// Example Usage (requires a Tokio runtime)
/*
#[tokio::main]
async fn main() {
    // Public echo server for testing.
    let ws_url = "wss://echo.websocket.org"; 
    // Or use ws:// for non-TLS connections if the server supports it.
    // let ws_url = "ws://echo.websocket.org"; 

    println!("Starting WebSocket client example...");
    if let Err(e) = run_websocket_client(ws_url).await {
        eprintln!("WebSocket client error: {}", e);
    }
}
*/ 