// Note: This example requires adding the `thiserror` crate to your Cargo.toml:
// [dependencies]
// thiserror = "1.0"

use thiserror::Error;
use std::fs::File; // For IO error example
use std::num::ParseIntError; // For parsing error example
use std::io; // For IO error example

/// Define a custom error enum using `thiserror`.
/// Each variant represents a different kind of error that can occur.
#[derive(Error, Debug)]
pub enum DataProcessingError {
    /// Represents an I/O error that occurred (e.g., file not found).
    /// `#[from]` automatically converts `std::io::Error` into this variant.
    #[error("An I/O error occurred while processing data")]
    Io(#[from] io::Error),

    /// Represents an error during number parsing.
    /// `#[from]` automatically converts `std::num::ParseIntError`.
    #[error("Failed to parse number: {source}")] // Can reference the source error
    Parse {
        #[from]
        source: ParseIntError,
    },
    // Note: The original example had #[from] directly on Parse(#[from] ParseIntError).
    // Using a named field `source` with #[from] is often clearer, especially if you need
    // to add more context later.

    /// Represents a custom error condition with a message.
    #[error("Invalid data found: {0}")]
    InvalidData(String),

    /// Represents an error from an external library (example).
    #[error("Configuration error: {details}")]
    ConfigError { details: String },
}

/// Example function that can return different variants of `DataProcessingError`.
fn process_data(input_str: &str, file_path: &str) -> Result<i32, DataProcessingError> {
    // Attempt to open a file - can result in an Io error.
    let _file = File::open(file_path)?; // The `?` operator uses `From::from`
    println!("File opened successfully (for demonstration).");

    // Attempt to parse the input string - can result in a Parse error.
    let number: i32 = input_str.parse()?; // `?` uses `From::from` again

    // Custom validation check.
    if number < 0 {
        return Err(DataProcessingError::InvalidData(
            format!("Negative numbers ({}) are not allowed", number)
        ));
    }
    
    // Simulate another potential error type.
    if number > 1000 {
        return Err(DataProcessingError::ConfigError { 
            details: "Value exceeds configured maximum threshold".to_string() 
        });
    }

    println!("Data processed successfully.");
    Ok(number * 2)
}

// Example Usage
/*
fn main() {
    println!("--- Attempt 1: Parse Error ---");
    match process_data("not_a_number", "dummy.txt") { // dummy.txt might not exist
        Ok(result) => println!("Success! Result: {}", result), // This won't happen here
        Err(e) => {
            eprintln!("Error: {}", e); // Prints the message defined by #[error(...)]
            // You can also match on the specific error variant if needed
            match e {
                DataProcessingError::Io(io_err) => eprintln!("  (Specific type: IO Error - {})", io_err),
                DataProcessingError::Parse { source } => eprintln!("  (Specific type: Parse Error - {})", source),
                DataProcessingError::InvalidData(msg) => eprintln!("  (Specific type: Invalid Data - {})", msg),
                DataProcessingError::ConfigError { details } => eprintln!("  (Specific type: Config Error - {})", details),
            }
        }
    }
    
    // Create a dummy file for the next tests
    std::fs::write("real_file.txt", "content").expect("Failed to create test file");

    println!("\n--- Attempt 2: Invalid Data Error ---");
    match process_data("-5", "real_file.txt") {
        Ok(result) => println!("Success! Result: {}", result),
        Err(e) => eprintln!("Error: {}", e),
    }
    
    println!("\n--- Attempt 3: IO Error (Simulated by deleting file) ---");
    std::fs::remove_file("real_file.txt").ok(); // Delete the file
    match process_data("10", "real_file.txt") {
        Ok(result) => println!("Success! Result: {}", result),
        Err(e) => eprintln!("Error: {}", e),
    }
    
     // Recreate file for final test
    std::fs::write("real_file.txt", "content").expect("Failed to create test file");
    
    println!("\n--- Attempt 4: Success ---");
    match process_data("50", "real_file.txt") {
        Ok(result) => println!("Success! Result: {}", result),
        Err(e) => eprintln!("Error: {}", e),
    }
    
    // Clean up
    std::fs::remove_file("real_file.txt").ok();
}
*/ 