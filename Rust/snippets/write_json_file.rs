// Note: This example requires adding the `serde` and `serde_json` crates to your Cargo.toml:
// [dependencies]
// serde = { version = "1.0", features = ["derive"] }
// serde_json = "1.0"

use serde::Serialize;
use serde_json::{Result as JsonResult, Value};
use std::fs::File;
use std::io::{self, BufWriter, Write};
use std::path::Path;

/// Serializes data (struct or `serde_json::Value`) to a JSON file.
/// Uses pretty-printing for human-readable output.
///
/// # Arguments
/// * `filepath` - Path to the output JSON file.
/// * `data` - The data to serialize (must implement `serde::Serialize`).
///
/// # Returns
/// * `Result<(), Box<dyn std::error::Error>>` - Ok(()) on success, or an error.
///   (Using Box<dyn Error> to handle both io::Error and serde_json::Error gracefully)
fn write_json_file_pretty<P: AsRef<Path>, T: Serialize>(
    filepath: P, 
    data: &T
) -> Result<(), Box<dyn std::error::Error>> {
    // Serialize the data to a JSON string with pretty printing.
    let json_string = serde_json::to_string_pretty(data)?;
    
    // Open the file for writing. Create it if it doesn't exist, truncate if it does.
    let file = File::create(filepath)?;
    
    // Use a BufWriter for potentially better performance.
    let mut writer = BufWriter::new(file);
    
    // Write the JSON string to the file.
    writer.write_all(json_string.as_bytes())?;
    
    // Ensure all buffered data is written to the file.
    writer.flush()?;
    
    Ok(())
}

/// Serializes data to a JSON file with compact formatting.
///
/// # Arguments
/// * `filepath` - Path to the output JSON file.
/// * `data` - The data to serialize.
///
/// # Returns
/// * `Result<(), Box<dyn std::error::Error>>`
fn write_json_file_compact<P: AsRef<Path>, T: Serialize>(
    filepath: P, 
    data: &T
) -> Result<(), Box<dyn std::error::Error>> {
    let file = File::create(filepath)?;
    let writer = BufWriter::new(file);
    // Serialize directly to the writer for efficiency (avoids intermediate string).
    serde_json::to_writer(writer, data)?;
    // BufWriter flushes on drop, but explicit flush can be added if needed before potential errors.
    Ok(())
}


// Example Struct
#[derive(Serialize)]
struct UserData {
    id: u32,
    username: String,
    is_active: bool,
    scores: Vec<i32>,
}

// Example Usage (within a main function or test)
/*
fn main() {
    let filepath_pretty = "output_pretty.json";
    let filepath_compact = "output_compact.json";
    let filepath_value = "output_value.json";

    // Example data (Struct)
    let user = UserData {
        id: 101,
        username: "jdoe".to_string(),
        is_active: true,
        scores: vec![85, 92, 78],
    };

    // Example data (serde_json::Value)
    let settings = serde_json::json!({
        "theme": "dark",
        "notifications": {
            "email": true,
            "sms": false
        },
        "version": 1.2
    });

    println!("--- Writing Struct (Pretty) ---");
    match write_json_file_pretty(filepath_pretty, &user) {
        Ok(_) => println!("Successfully wrote pretty JSON to {}", filepath_pretty),
        Err(e) => eprintln!("Error writing pretty JSON: {}", e),
    }

    println!("\n--- Writing Struct (Compact) ---");
    match write_json_file_compact(filepath_compact, &user) {
        Ok(_) => println!("Successfully wrote compact JSON to {}", filepath_compact),
        Err(e) => eprintln!("Error writing compact JSON: {}", e),
    }
    
    println!("\n--- Writing Value (Pretty) ---");
    match write_json_file_pretty(filepath_value, &settings) {
        Ok(_) => println!("Successfully wrote JSON Value to {}", filepath_value),
        Err(e) => eprintln!("Error writing JSON Value: {}", e),
    }

    // Optional: Read back to verify (requires read_json_file snippet)
    // if let Ok(content) = std::fs::read_to_string(filepath_pretty) {
    //     println!("\nContent of {}:\n{}", filepath_pretty, content);
    // }

    // Clean up dummy files
    std::fs::remove_file(filepath_pretty).ok();
    std::fs::remove_file(filepath_compact).ok();
    std::fs::remove_file(filepath_value).ok();
}
*/ 