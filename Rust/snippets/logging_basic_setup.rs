// Note: This example requires adding the `log` and `env_logger` crates to your Cargo.toml:
// [dependencies]
// log = "0.4"
// env_logger = "0.9" // Or a newer compatible version

use log::{info, warn, error, debug, trace, LevelFilter};
use env_logger::Builder;
use std::io::Write; // Needed for customizing the logger format

/// Initializes the `env_logger` with default settings.
/// Reads the log level from the `RUST_LOG` environment variable.
/// Example: `RUST_LOG=info cargo run` or `RUST_LOG=my_app=debug cargo run`
fn setup_logging_default() {
    // Call init() once at the start of your application (usually in main).
    // It configures logging based on the RUST_LOG environment variable.
    // If RUST_LOG is not set, it often defaults to `error` level.
    env_logger::init();

    // Now you can use the log macros throughout your application.
    info!("Default logging initialized. Log level controlled by RUST_LOG env var.");
    warn!("This is a warning message (will show if level is warn, info, debug, or trace).");
    error!("This is an error message (will always show if logging is initialized).");
    debug!("This is a debug message (will show if level is debug or trace).");
    trace!("This is a trace message (will show only if level is trace).");
}

/// Initializes the `env_logger` with custom settings.
/// Sets a default log level if `RUST_LOG` is not set, and customizes the format.
fn setup_logging_custom() {
    let mut builder = Builder::new();

    // Set the default log level filter if RUST_LOG is not defined.
    builder.filter_level(LevelFilter::Info); // Default to Info level

    // Override log level for specific modules (optional).
    // builder.filter_module("my_crate::some_module", LevelFilter::Debug);
    
    // Try to parse the RUST_LOG environment variable. This overrides the default level.
    builder.parse_env("RUST_LOG");

    // Customize the log format (optional).
    builder.format(|buf, record| {
        writeln!(
            buf,
            "[{}] [{}] - {}",
            // chrono::Local::now().format("%Y-%m-%d %H:%M:%S%.3f"), // Requires `chrono` crate
            record.level(),
            record.target(), // The module path where the log originated
            record.args()
        )
    });
    
    // Initialize the logger with the builder configuration.
    // Use try_init if initialization might fail or be called multiple times.
    if let Err(e) = builder.try_init() {
        eprintln!("Failed to initialize logger: {}", e);
        // Handle error appropriately, maybe fall back to a simpler logger or ignore.
    }

    info!("Custom logging initialized.");
    warn!("Another warning.");
    error!("Another error.");
    debug!("Another debug message.");
    trace!("Another trace message.");
}

// Example Usage (within a main function or test)
/*
fn main() {
    println!("--- Setting up Default Logging ---");
    // Set RUST_LOG environment variable before running to see different levels.
    // Example: RUST_LOG=trace cargo run
    // setup_logging_default(); 
    // Note: You can only initialize one logger per application run.
    // Comment out one of the setup calls.
    
    println!("\n--- Setting up Custom Logging ---");
    // Set RUST_LOG environment variable before running to override the default Info level.
    // Example: RUST_LOG=debug cargo run
    setup_logging_custom(); 

    // Example of logging in another function/module
    perform_some_action();
}

fn perform_some_action() {
    info!("Performing an action...");
    // Simulate something happening
    debug!("Action details: processed item X.");
    warn!("Potential issue encountered during action.");
    info!("Action completed.");
}
*/ 