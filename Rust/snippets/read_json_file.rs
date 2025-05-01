// Note: This example requires adding the `serde_json` crate to your Cargo.toml:
// [dependencies]
// serde_json = "1.0"
// serde = { version = "1.0", features = ["derive"] } // If deserializing to a struct

use serde::Deserialize; // Needed if deserializing to a specific struct
use serde_json::{Result as JsonResult, Value};
use std::fs;
use std::path::Path;

/// Reads a JSON file and deserializes it into a generic `serde_json::Value`.
///
/// # Arguments
/// * `filepath` - Path to the JSON file.
///
/// # Returns
/// * `JsonResult<Value>` - A Result containing the parsed JSON Value or a serde_json Error.
fn read_json_file_to_value<P: AsRef<Path>>(filepath: P) -> JsonResult<Value> {
    // Read the entire file content into a string.
    let data = fs::read_to_string(filepath)
        .map_err(|io_err| serde_json::Error::io(io_err))?; // Convert io::Error to serde_json::Error
    
    // Parse the string data into a serde_json::Value.
    let json_value: Value = serde_json::from_str(&data)?;
    Ok(json_value)
}

/// A generic struct to deserialize into (replace with your actual struct).
#[derive(Deserialize, Debug)]
struct Config {
    server: String,
    port: u16,
    features: Vec<String>,
}

/// Reads a JSON file and deserializes it directly into a specified struct.
///
/// # Arguments
/// * `filepath` - Path to the JSON file.
///
/// # Returns
/// * `JsonResult<T>` - A Result containing the parsed struct or a serde_json Error.
fn read_json_file_to_struct<P: AsRef<Path>, T: for<'de> Deserialize<'de>>(filepath: P) -> JsonResult<T> {
    let data = fs::read_to_string(filepath)
        .map_err(|io_err| serde_json::Error::io(io_err))?;
    let parsed_struct: T = serde_json::from_str(&data)?;
    Ok(parsed_struct)
}

// Example Usage (within a main function or test)
/*
fn main() {
    let filepath_value = "config_value.json";
    let filepath_struct = "config_struct.json";

    // Create dummy files for testing
    let json_content = r#"
    {
        "server": "127.0.0.1",
        "port": 8080,
        "features": ["auth", "logging"]
    }
    "#;
    fs::write(filepath_value, json_content).expect("Unable to create test file");
    fs::write(filepath_struct, json_content).expect("Unable to create test file");

    println!("--- Reading JSON into Value ---");
    match read_json_file_to_value(filepath_value) {
        Ok(json) => {
            println!("Successfully read JSON Value: {:#?}", json);
            // Access fields dynamically
            if let Some(port) = json.get("port").and_then(|v| v.as_u64()) {
                println!("Port from Value: {}", port);
            }
        }
        Err(e) => eprintln!("Error reading JSON file '{}' into Value: {}", filepath_value, e),
    }
    
    println!("\n--- Reading JSON into Struct ---");
    match read_json_file_to_struct::<_, Config>(filepath_struct) {
        Ok(config) => {
            println!("Successfully read JSON Struct: {:#?}", config);
            println!("Server from Struct: {}", config.server);
        }
        Err(e) => eprintln!("Error reading JSON file '{}' into Struct: {}", filepath_struct, e),
    }

    // Clean up dummy files
    fs::remove_file(filepath_value).ok();
    fs::remove_file(filepath_struct).ok();
}
*/ 