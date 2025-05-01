// Note: This example requires adding the `tokio` crate to your Cargo.toml:
// [dependencies]
// tokio = { version = "1", features = ["full"] } // "full" enables macros like #[tokio::main]

use tokio::task; // For spawning tasks
use tokio::time::{sleep, Duration}; // For simulating work

/// Spawns two asynchronous tasks using tokio::spawn.
/// Waits for both tasks to complete using .await and prints their results.
async fn run_async_tasks() {
    println!("Spawning async tasks...");

    // Spawn the first task.
    // The `async` block creates an asynchronous operation.
    // `task::spawn` starts the task running potentially concurrently.
    let task1 = task::spawn(async {
        println!("Task 1: Started");
        sleep(Duration::from_millis(100)).await; // Simulate work
        println!("Task 1: Finished");
        42 // Return value from the task
    });

    // Spawn the second task.
    let task2 = task::spawn(async {
        println!("Task 2: Started");
        sleep(Duration::from_millis(50)).await; // Simulate work
        println!("Task 2: Finished");
        24 // Return value from the task
    });

    println!("Tasks spawned, waiting for results...");

    // Wait for the first task to complete and get its result.
    // .await pauses the current task until `task1` completes.
    // `unwrap()` will panic if the task panicked.
    let result1 = task1.await.unwrap();
    println!("Task 1 result received: {}", result1);

    // Wait for the second task to complete.
    let result2 = task2.await.unwrap();
    println!("Task 2 result received: {}", result2);

    println!("All tasks completed. Final results: {} and {}", result1, result2);
}

// Example Usage (requires a Tokio runtime)
/*
#[tokio::main]
async fn main() {
    run_async_tasks().await;
}
*/ 