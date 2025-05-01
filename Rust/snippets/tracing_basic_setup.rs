// Note: This example requires adding `tracing` and `tracing-subscriber` crates:
// [dependencies]
// tracing = "0.1"
// tracing-subscriber = { version = "0.3", features = ["fmt"] } // "fmt" feature for basic console output

use tracing::{info, warn, error, debug, trace, instrument, span, Level};
use tracing_subscriber::FmtSubscriber;
use std::time::Duration;

/// Sets up a basic `tracing` subscriber that logs to the console.
/// Reads log level directives from the `RUST_LOG` environment variable.
/// Example: `RUST_LOG=info cargo run` or `RUST_LOG=my_app=debug,warn cargo run`
fn setup_tracing_subscriber() {
    // Build a subscriber for formatting and printing traces to stdout.
    let subscriber = FmtSubscriber::builder()
        // Set the maximum level of traces to record (e.g., TRACE, DEBUG, INFO, WARN, ERROR).
        // This can be overridden by RUST_LOG.
        .with_max_level(Level::TRACE) 
        // Parses directives from the RUST_LOG environment variable.
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        // Builds the subscriber.
        .finish();

    // Set the built subscriber as the global default for this thread.
    // Use `set_global_default` for application-wide logging (requires `tracing::subscriber::set_global_default`).
    // `try_init` returns an error if a global subscriber is already set.
    if let Err(e) = tracing::subscriber::set_global_default(subscriber) {
         eprintln!("Failed to set global tracing subscriber: {}. Another subscriber might be active.", e);
    } else {
        info!("Tracing subscriber initialized. Log level controlled by RUST_LOG or default (TRACE).");
    }
}

/// A function demonstrating basic tracing events and spans.
#[instrument(level = "debug")] // Automatically creates a span when entering/exiting the function
fn process_item(item_id: u32, data: &str) {
    info!(item = item_id, data_len = data.len(), "Processing item"); // Log an event with structured fields
    
    // Simulate some work
    std::thread::sleep(Duration::from_millis(10));
    
    if data.is_empty() {
        warn!(item = item_id, "Item data is empty!");
    } else {
        debug!(item = item_id, "Item data processed successfully.");
    }
    
    // Explicitly create a child span
    let child_span = span!(Level::TRACE, "internal_processing", item = item_id);
    let _enter = child_span.enter(); // Enter the span scope
    
    trace!("Performing detailed internal step...");
    std::thread::sleep(Duration::from_millis(5));
    trace!("Internal step complete.");
    
    // Span automatically exited when `_enter` goes out of scope
    
    error!(item=item_id, "This is a simulated error for demonstration.");
}

// Example Usage
/*
fn main() {
    // Initialize the tracing subscriber ONCE at the start of the application.
    setup_tracing_subscriber();

    // --- Basic Event Logging --- 
    info!(app_version = env!("CARGO_PKG_VERSION"), "Application started."); // Add context fields

    // --- Using Spans --- 
    // Create a top-level span for a larger operation.
    let main_span = span!(Level::INFO, "main_operation", user_id = "system");
    // Enter the span. Code executed within this block is associated with the span.
    let _main_guard = main_span.enter(); 

    info!("Starting main operation...");

    // Call the instrumented function
    process_item(101, "Some data");
    process_item(102, ""); // Example with warning

    warn!("Main operation finishing.");
    
    // Span is exited when `_main_guard` goes out of scope here.
}
*/

// To see output, run with RUST_LOG environment variable set:
// RUST_LOG=info cargo run 
// RUST_LOG=debug cargo run
// RUST_LOG=trace cargo run
// RUST_LOG=my_crate_name=debug cargo run (replace my_crate_name with your actual crate name)
// RUST_LOG=info,my_crate_name::process_item=trace cargo run 