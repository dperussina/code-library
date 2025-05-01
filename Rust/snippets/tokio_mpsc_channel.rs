// Note: This example requires adding the `tokio` crate to your Cargo.toml:
// [dependencies]
// tokio = { version = "1", features = ["full"] } // "full" enables sync features and macros

use tokio::sync::mpsc; // Multi-producer, single-consumer asynchronous channel
use tokio::time::{sleep, Duration};

/// Demonstrates sending values from one task to another using an MPSC channel.
async fn run_mpsc_example() {
    // Create a channel with a buffer capacity of 32.
    // `tx` is the sender (transmitter), `rx` is the receiver.
    // `tx` can be cloned to have multiple producers.
    let (tx, mut rx) = mpsc::channel::<i32>(32);

    println!("Spawning sender task...");
    // Spawn a new asynchronous task to send messages.
    let sender_task = tokio::spawn(async move {
        // `move` takes ownership of `tx`.
        for i in 0..10 {
            println!("Sender: Sending value {}...", i);
            // Send the value `i` through the channel.
            // `send` is an async operation; it waits if the channel buffer is full.
            if let Err(e) = tx.send(i).await {
                // This error occurs if the receiver (`rx`) has been dropped.
                eprintln!("Sender: Failed to send value {}. Receiver dropped? Error: {}", i, e);
                return; // Exit the task if sending fails
            }
            println!("Sender: Value {} sent successfully.", i);
            // Simulate some delay between sends
            sleep(Duration::from_millis(20)).await;
        }
        println!("Sender: Finished sending all values.");
        // `tx` is dropped here when the task finishes.
    });

    println!("Receiver: Waiting for values...");
    // Receive values from the channel in a loop.
    // `rx.recv()` is an async operation; it waits if the channel is empty.
    // It returns `Some(value)` if a value is received.
    // It returns `None` if the channel is closed (i.e., all `tx` clones have been dropped).
    while let Some(value) = rx.recv().await {
        println!("Receiver: Received value: {}", value);
        // Simulate processing time
        sleep(Duration::from_millis(50)).await;
    }

    println!("Receiver: Channel closed, no more values.");

    // Wait for the sender task to complete (optional, ensures it finishes cleanly).
    if let Err(e) = sender_task.await {
        eprintln!("Sender task panicked: {:?}", e);
    }
}

// Example Usage (requires a Tokio runtime)
/*
#[tokio::main]
async fn main() {
    run_mpsc_example().await;
}
*/ 