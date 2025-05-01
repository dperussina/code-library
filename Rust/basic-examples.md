# Rust Code Snippets Library: Basic Examples

This document covers fundamental Rust tasks often needed in application development.

**Core Libraries Often Needed:**

* `std::fs`: File system interaction
* `std::io`: Input/output operations
* `serde`, `serde_json`: Working with JSON data (add to `Cargo.toml`)
* `chrono`: Handling dates and times (add to `Cargo.toml`)
* `log`, `env_logger`: Logging (add to `Cargo.toml`)
* `reqwest`: Making HTTP requests (add to `Cargo.toml`)
* `clap`: Command-line argument parsing (add to `Cargo.toml`)
* `rayon`: Parallelism (add to `Cargo.toml`)

*(For a library, you'd list dependencies like `serde`, `serde_json`, `chrono`, etc., in your `Cargo.toml`)*

---

**1. File Handling (I/O)**

*   **Reading a Text File Line by Line**
    *   **What it does:** Opens a file, reads its contents line by line into memory.
    *   **Why you use it:** Common task for processing text-based data files (logs, configuration, datasets). Uses buffering for efficiency.
    ```rust
    use std::fs::File;
    use std::io::{self, BufRead, BufReader};

    fn read_text_file(filepath: &str) -> io::Result<Vec<String>> {
        let file = File::open(filepath)?;
        let reader = BufReader::new(file);
        // Collect lines into a Vec<String>, handling potential I/O errors during reading
        let lines: Vec<String> = reader.lines().collect::<Result<_, _>>()?;
        Ok(lines)
    }

    // Usage:
    // match read_text_file("my_data.txt") {
    //     Ok(lines) => println!("Read {} lines.", lines.len()),
    //     Err(e) => eprintln!("Error reading file: {}", e),
    // }
    ```

*   **Writing Lines to a Text File**
    *   **What it does:** Opens or creates a file and writes a sequence of strings, each on a new line. Can optionally overwrite existing content.
    *   **Why you use it:** To save generated text data, logs, or results to a file. Buffering improves performance for multiple write operations.
    ```rust
    use std::fs::OpenOptions;
    use std::io::{self, Write, BufWriter}; // Added BufWriter for clarity

    fn write_text_file(filepath: &str, lines: &[&str], overwrite: bool) -> io::Result<()> {
        let file = OpenOptions::new()
            .write(true)     // Enable writing
            .create(true)    // Create the file if it doesn't exist
            .truncate(overwrite) // If overwrite is true, empty the file first
            // .append(!overwrite) // Alternatively, append if not overwriting
            .open(filepath)?;
        let mut writer = BufWriter::new(file); // Use a buffered writer for efficiency
        for line in lines {
            writeln!(writer, "{}", line)?; // writeln! automatically adds a newline
        }
        // BufWriter is automatically flushed when it goes out of scope
        Ok(())
    }

    // Usage:
    // let data_to_write = ["Line 1", "Line 2", "Another line"];
    // if let Err(e) = write_text_file("output.txt", &data_to_write, true) {
    //     eprintln!("Error writing to file: {}", e);
    // }
    ```

---

**2. JSON Handling (using `serde_json`)**

*   **Reading JSON Files into a Generic Value**
    *   **What it does:** Reads a file containing JSON data and parses it into a `serde_json::Value`, which can represent any valid JSON structure.
    *   **Why you use it:** Useful when the exact structure of the JSON isn't known beforehand or when you only need to inspect parts of it. Requires `serde_json` dependency.
    ```rust
    use serde_json::Value;
    use std::fs;
    use std::io; // Include io for error handling consistency

    fn read_json_file(filepath: &str) -> Result<Value, Box<dyn std::error::Error>> {
        // Reads the entire file into a string
        let data = fs::read_to_string(filepath)?;
        // Parses the string into a serde_json::Value
        let json: Value = serde_json::from_str(&data)?;
        Ok(json)
    }

    // Usage:
    // match read_json_file("config.json") {
    //     Ok(json) => {
    //         println!("JSON content: {:?}", json);
    //         // Access values:
    //         // if let Some(name) = json.get("name").and_then(|v| v.as_str()) {
    //         //     println!("Name: {}", name);
    //         // }
    //     },
    //     Err(e) => eprintln!("Error reading JSON: {}", e),
    // }
    ```

*   **Writing Data Structures to JSON File**
    *   **What it does:** Serializes a Rust data structure (that implements `serde::Serialize`) into a JSON string and writes it to a file.
    *   **Why you use it:** To save program state, configuration, or results in a widely compatible JSON format. Requires `serde` and `serde_json` dependencies.
    ```rust
    // Add this at the top if not already present
    use serde::{Serialize};
    use serde_json; // Need this for the json! macro and serialization functions
    use std::fs;
    use std::io;

    // Example struct that can be serialized
    #[derive(Serialize)]
    struct Config {
        name: String,
        version: u32,
        enabled: bool,
    }

    // Takes a reference to a serializable type T
    fn write_json_file<T: Serialize>(filepath: &str, data: &T) -> Result<(), Box<dyn std::error::Error>> {
        // Serialize the data structure to a pretty-printed JSON string
        let json_string = serde_json::to_string_pretty(data)?;
        // Write the string to the specified file, overwriting if it exists
        fs::write(filepath, json_string)?;
        Ok(())
    }

    // Usage:
    // let my_config = Config {
    //     name: "example_app".to_string(),
    //     version: 1,
    //     enabled: true,
    // };
    // // You can also use the json! macro for simple structures:
    // // let my_data = serde_json::json!({"name": "example", "version": 1});
    //
    // if let Err(e) = write_json_file("output.json", &my_config) {
    //     eprintln!("Error writing JSON: {}", e);
    // }
    ```

---

**3. Command-Line Argument Parsing (using `clap`)**

*   **Basic Argument Parsing**
    *   **What it does:** Defines expected command-line arguments (flags, options with values) and parses them when the program runs.
    *   **Why you use it:** Provides a robust and user-friendly way for users to configure the program's behavior from the command line. `clap` is a popular and powerful crate for this.
    ```rust
    use clap::{Arg, Command, ArgAction}; // Added ArgAction

    fn parse_arguments() {
        let matches = Command::new("MyApp")
            .version("1.0")
            .author("Your Name <you@example.com>")
            .about("Demonstrates basic argument parsing with clap")
            .arg(Arg::new("input") // Argument that takes a value
                .short('i')         // Allow -i
                .long("input")      // Allow --input
                .value_name("FILE") // Hint for the user about the expected value
                .help("Sets the input file path") // Description shown in --help
                .required(true))    // This argument must be provided
            .arg(Arg::new("verbose") // A flag (doesn't take a value)
                .short('v')
                .long("verbose")
                .action(ArgAction::SetTrue) // Sets the value to true if present
                .help("Enables verbose output"))
            .get_matches(); // Parse the actual arguments provided

        // Retrieve the value for the "input" argument
        // .unwrap() is safe here because the argument is required
        let input_file = matches.get_one::<String>("input").unwrap();

        // Check if the "verbose" flag was provided
        let is_verbose = matches.get_flag("verbose");

        println!("Input file specified: {}", input_file);
        if is_verbose {
            println!("Verbose mode is enabled.");
        } else {
            println!("Verbose mode is disabled.");
        }
    }

    // Usage (typically called from main):
    // fn main() {
    //     parse_arguments();
    // }
    // Run with: your_app -i data.txt -v
    ```

---

**4. Logging (using `log` and `env_logger`)**

*   **Basic Logging Setup**
    *   **What it does:** Initializes a simple logger that prints messages to stderr, controlled by the `RUST_LOG` environment variable.
    *   **Why you use it:** Essential for recording events, debugging issues, and monitoring application behavior without cluttering stdout. `log` provides the facade, `env_logger` provides the backend.
    ```rust
    use log::{info, warn, error, debug, LevelFilter}; // Added debug and LevelFilter
    use env_logger::Builder; // Use Builder for more control

    fn setup_logging() {
        // Initialize env_logger using a builder for customization
        let mut builder = Builder::from_default_env();

        // Set default log level if RUST_LOG is not set
        builder.filter_level(LevelFilter::Info);

        // Optional: Customize format
        // builder.format(|buf, record| {
        //     writeln!(buf,
        //         "{} [{}] - {}",
        //         chrono::Local::now().format("%Y-%m-%dT%H:%M:%S"), // Requires chrono feature
        //         record.level(),
        //         record.args()
        //     )
        // });

        builder.init();

        info!("Logging initialized successfully.");
        debug!("This is a debug message (will only show if RUST_LOG=debug).");
    }

    // Usage (typically called early in main):
    // fn main() {
    //     setup_logging();
    //
    //     info!("Application starting...");
    //     // ... application logic ...
    //     warn!("A potential issue occurred.");
    //     // ... more logic ...
    //     error!("An unrecoverable error happened!");
    //     info!("Application shutting down.");
    // }
    // Run with: RUST_LOG=info your_app
    // Or: RUST_LOG=debug your_app
    ```

---

**5. Web Interaction (using `reqwest`)**

*   **Simple Async GET Request**
    *   **What it does:** Sends an asynchronous HTTP GET request to a specified URL and retrieves the response body as text.
    *   **Why you use it:** For interacting with web APIs or fetching web resources. `reqwest` is a popular, ergonomic HTTP client. `async/await` (with `tokio` or `async-std`) prevents blocking the thread during network waits.
    ```rust
    use reqwest;
    use tokio; // Requires the tokio runtime

    // The function must be async to use .await
    // It returns a Result, indicating success or a reqwest::Error
    #[tokio::main] // Macro to set up the async runtime for main
    async fn fetch_url_data(url: &str) -> Result<(), reqwest::Error> {
        println!("Fetching URL: {}", url);
        // Send the GET request and wait for the response
        let response = reqwest::get(url).await?;

        // Check if the request was successful (status code 2xx)
        if response.status().is_success() {
            println!("Request successful (Status: {})", response.status());
            // Read the response body as text and wait for it
            let body = response.text().await?;
            println!("Response Body (first 100 chars): {:.100}", body);
        } else {
            println!("Request failed with Status: {}", response.status());
            // Optionally print error body if needed
            // let error_body = response.text().await?;
            // println!("Error Body: {}", error_body);
        }

        Ok(()) // Indicate success
    }

    // Usage:
    // fn main() {
    //     // Since fetch_url_data is async and uses #[tokio::main],
    //     // it handles the runtime setup.
    //     // You would typically call it directly or within another async context.
    //     // The example below is simplified for illustration. Running directly
    //     // requires the surrounding async block or runtime setup if not using #[tokio::main].
    //     if let Err(e) = fetch_url_data("https://httpbin.org/get") { // httpbin.org is useful for testing
    //          eprintln!("Error during web request: {}", e);
    //     }
    //     if let Err(e) = fetch_url_data("https://httpbin.org/status/404") { // Example of a failed request
    //          eprintln!("Error during web request (expected failure): {}", e);
    //     }
    // }
    // Note: Add `reqwest = { version = "...", features = ["json"] }` and `tokio = { version = "...", features = ["full"] }` to Cargo.toml
    ```

---

**Considerations for Your Library:**

1.  **Modularity:** Keep functions focused on a single task.
2.  **Error Handling:** Use `Result` consistently, often boxing errors (`Box<dyn std::error::Error>`) for flexibility or defining custom error enums.
3.  **Dependencies:** Clearly list external dependencies (`crates`) in `Cargo.toml` with necessary features.
4.  **Testing:** Write unit tests (`#[test]`) and integration tests. Use `cargo test`.
5.  **Documentation:** Use Rustdoc comments (`///` for items, `//!` for modules/crates) to generate documentation. Use `cargo doc --open`.
6.  **Asynchronous Operations:** For I/O-bound tasks (like web requests, file system access on some platforms), use `async`/`await` with a runtime like `tokio` or `async-std`.