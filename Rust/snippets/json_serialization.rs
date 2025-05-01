// Note: This example requires adding the `serde` and `serde_json` crates to your Cargo.toml:
// [dependencies]
// serde = { version = "1.0", features = ["derive"] }
// serde_json = "1.0"

use serde::{Deserialize, Serialize};
use serde_json::{Result as JsonResult, Value};

/// A struct demonstrating serialization and deserialization.
#[derive(Serialize, Deserialize, Debug, PartialEq)] // PartialEq for easy comparison in example
struct Point {
    x: i32,
    y: i32,
    label: String,
    tags: Vec<String>,
}

/// Serializes a Rust struct into a JSON string.
fn serialize_struct_to_json_string<T: Serialize>(data: &T) -> JsonResult<String> {
    // `to_string_pretty` provides formatted JSON, `to_string` is compact.
    serde_json::to_string_pretty(data)
    // Or: serde_json::to_string(data)
}

/// Deserializes a JSON string into a Rust struct.
fn deserialize_json_string_to_struct<'a, T: Deserialize<'a>>(json_string: &'a str) -> JsonResult<T> {
    serde_json::from_str(json_string)
}

/// Serializes a Rust struct into a `serde_json::Value`.
fn serialize_struct_to_json_value<T: Serialize>(data: &T) -> JsonResult<Value> {
    serde_json::to_value(data)
}

/// Deserializes a `serde_json::Value` into a Rust struct.
fn deserialize_json_value_to_struct<T: Deserialize<'static>>(json_value: Value) -> JsonResult<T> {
    // Note: If the Value contains borrowed data (&str), this might need lifetime adjustments.
    // Using Deserialize<'static> is common when the Value owns its data.
    serde_json::from_value(json_value)
}


// Example Usage (within a main function or test)
/*
fn main() {
    // 1. Create an instance of the struct
    let point = Point {
        x: 10,
        y: 20,
        label: "Origin".to_string(),
        tags: vec!["start".to_string(), "center".to_string()],
    };
    println!("Original Struct: {:?}", point);

    // 2. Serialize to JSON String
    println!("\n--- Serialize to String ---");
    let json_string_result = serialize_struct_to_json_string(&point);
    match json_string_result {
        Ok(json_str) => {
            println!("JSON String:\n{}", json_str);

            // 3. Deserialize from JSON String
            println!("\n--- Deserialize from String ---");
            let deserialized_point_result: JsonResult<Point> = deserialize_json_string_to_struct(&json_str);
            match deserialized_point_result {
                Ok(deserialized_point) => {
                    println!("Deserialized Struct: {:?}", deserialized_point);
                    assert_eq!(point, deserialized_point); // Verify equality
                    println!("Deserialization successful and matches original!");
                }
                Err(e) => eprintln!("Error deserializing from string: {}", e),
            }
        }
        Err(e) => eprintln!("Error serializing to string: {}", e),
    }

    // 4. Serialize to serde_json::Value
    println!("\n--- Serialize to Value ---");
    let json_value_result = serialize_struct_to_json_value(&point);
    match json_value_result {
        Ok(json_val) => {
            println!("JSON Value: {:#?}", json_val);
            // You can access fields dynamically:
            println!("Accessing fields in Value: x = {:?}, label = {:?}", 
                     json_val.get("x"), json_val.get("label").and_then(|v| v.as_str()));

            // 5. Deserialize from serde_json::Value
            println!("\n--- Deserialize from Value ---");
            let deserialized_from_value_result: JsonResult<Point> = deserialize_json_value_to_struct(json_val);
            match deserialized_from_value_result {
                Ok(deserialized_point) => {
                    println!("Deserialized Struct from Value: {:?}", deserialized_point);
                    assert_eq!(point, deserialized_point);
                     println!("Deserialization from Value successful!");
                }
                Err(e) => eprintln!("Error deserializing from value: {}", e),
            }
        }
        Err(e) => eprintln!("Error serializing to value: {}", e),
    }
    
    // Example of handling invalid JSON
    println!("\n--- Handling Invalid JSON ---");
    let invalid_json = "{ \"x\": 5, \"label\": \"Incomplete" "; // Missing comma, closing brace
    let bad_deserialization: JsonResult<Point> = deserialize_json_string_to_struct(invalid_json);
    match bad_deserialization {
        Ok(_) => println!("This shouldn't happen!"),
        Err(e) => eprintln!("Successfully caught expected error for invalid JSON: {}", e),
    }
}
*/ 