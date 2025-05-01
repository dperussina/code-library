// Note: This example requires adding the `reqwest` crate to your Cargo.toml:
// [dependencies]
// reqwest = { version = "0.11", features = ["blocking", "json"] } 
// Or for async:
// reqwest = { version = "0.11", features = ["json"] }
// tokio = { version = "1", features = ["full"] } // if using async

// --- Blocking Example --- 

use reqwest::blocking::Client;
use reqwest::Error;
use serde::Deserialize; // Add `serde` to Cargo.toml as well: serde = { version = "1.0", features = ["derive"] }
use std::collections::HashMap;

/// Represents a simple JSON structure if the API returns JSON
#[derive(Deserialize, Debug)]
struct ApiResponse {
    // Define fields based on the expected JSON response
    // Example:
    // userId: u32,
    // id: u32,
    // title: String,
    // completed: bool,
    message: Option<String>, // Making fields optional is safer
    // Add other fields as needed
}

/// Performs a blocking HTTP GET request and returns the response body as text.
fn http_get_text(url: &str) -> Result<String, Error> {
    let client = Client::new();
    let response = client.get(url).send()?;
    
    // Check if the request was successful (status code 2xx)
    if response.status().is_success() {
        response.text()
    } else {
        // If not successful, return an error with the status code
        Err(Error::from(response.error_for_status().unwrap_err()))
    }
}

/// Performs a blocking HTTP GET request and attempts to parse the response as JSON.
fn http_get_json<T: for<'de> Deserialize<'de>>(url: &str) -> Result<T, Error> {
    let client = Client::new();
    let response = client.get(url).send()?;

    // Check status and parse JSON
    response.error_for_status()?.json::<T>()
}

// Example Usage (within a main function or test)
/*
fn main() {
    let text_url = "https://httpbin.org/get"; // Simple endpoint that returns request info as JSON
    let json_url = "https://jsonplaceholder.typicode.com/todos/1"; // Example JSON API

    println!("--- Fetching Text ---");
    match http_get_text(text_url) {
        Ok(body) => println!("Response Body:\n{}", body),
        Err(e) => eprintln!("Error fetching text: {}", e),
    }
    
    println!("\n--- Fetching JSON ---");
    match http_get_json::<HashMap<String, serde_json::Value>>(text_url) { // Using HashMap for generic JSON
        Ok(parsed_json) => println!("Parsed JSON:\n{:#?}", parsed_json),
        Err(e) => eprintln!("Error fetching or parsing JSON: {}", e),
    }

    // Example with a specific struct
    // println!("\n--- Fetching Specific JSON Struct ---");
    // match http_get_json::<ApiResponse>(json_url) {
    //     Ok(todo) => println!("Parsed Todo Item:\n{:#?}", todo),
    //     Err(e) => eprintln!("Error fetching or parsing JSON: {}", e),
    // }
}
*/


// --- Async Example (using tokio) ---
/* 
use reqwest::Client as AsyncClient;
use reqwest::Error as AsyncError;
use serde::Deserialize as AsyncDeserialize;

#[derive(AsyncDeserialize, Debug)]
struct AsyncApiResponse {
    // Define fields as needed
    message: Option<String>,
}

async fn async_http_get_text(url: &str) -> Result<String, AsyncError> {
    let client = AsyncClient::new();
    let response = client.get(url).send().await?;
    if response.status().is_success() {
        response.text().await
    } else {
        Err(AsyncError::from(response.error_for_status().unwrap_err()))
    }
}

async fn async_http_get_json<T: for<'de> AsyncDeserialize<'de>>(url: &str) -> Result<T, AsyncError> {
    let client = AsyncClient::new();
    response.error_for_status().await?.json::<T>().await
}

// Example Usage (within an async main function)
#[tokio::main]
async fn main() {
    let text_url = "https://httpbin.org/get";

    println!("--- Async Fetching Text ---");
    match async_http_get_text(text_url).await {
        Ok(body) => println!("Response Body:\n{}", body),
        Err(e) => eprintln!("Error fetching text: {}", e),
    }
    
    // Add calls to async_http_get_json similarly
}
*/ 