# Rust Code Snippets Library: Advanced Examples

This document explores more advanced Rust features and libraries commonly used for concurrency, error handling, macros, networking, and performance.

---

**1. Concurrency with `tokio`**

*   **Spawning Asynchronous Tasks**
    *   **What it does:** Creates lightweight, non-blocking tasks that can run concurrently, managed by the `tokio` runtime.
    *   **Why you use it:** To perform multiple I/O-bound operations (like network requests or file system access) simultaneously without blocking threads, improving application responsiveness and throughput.
    ```rust
    use tokio::task;
    use tokio::time::{sleep, Duration}; // For demonstration

    async fn background_task(id: u32) -> u32 {
        println!("Task {} started.", id);
        sleep(Duration::from_millis(id as u64 * 100)).await; // Simulate work
        println!("Task {} finished.", id);
        id * 10 // Return some value
    }

    #[tokio::main]
    async fn main() {
        // Spawn tasks: they start running immediately in the background
        let task1 = task::spawn(background_task(1));
        let task2 = task::spawn(background_task(2));

        println!("Tasks spawned.");

        // Wait for tasks to complete and get their results
        // .await pauses the current task (main) until the spawned task completes
        // .unwrap() handles the Result from task completion (can panic if task panics)
        let result1 = task1.await.unwrap();
        let result2 = task2.await.unwrap();

        println!("Results: Task 1 returned {}, Task 2 returned {}", result1, result2);
    }
    ```

*   **Using `tokio::sync::mpsc` for Multi-Producer, Single-Consumer Channels**
    *   **What it does:** Creates an asynchronous channel allowing multiple tasks (`producers`) to send messages to a single task (`consumer`).
    *   **Why you use it:** To safely pass data between asynchronous tasks, coordinating workflows or distributing work, while handling backpressure (when the channel is full).
    ```rust
    use tokio::sync::mpsc;
    use tokio::time::{sleep, Duration};

    #[tokio::main]
    async fn main() {
        // Create a channel with a buffer size of 32
        let (tx, mut rx) = mpsc::channel::<i32>(32);

        // Spawn a producer task
        let producer_task = tokio::spawn(async move {
            for i in 0..10 {
                println!("Producer sending: {}", i);
                // .send() is async, it might wait if the channel buffer is full
                if tx.send(i).await.is_err() {
                    // This error occurs if the receiver has been dropped
                    eprintln!("Producer failed: Receiver dropped!");
                    return;
                }
                sleep(Duration::from_millis(50)).await; // Simulate time between sends
            }
            println!("Producer finished sending.");
            // tx is dropped here when the task ends
        });

        // Spawn a consumer task (or run in the current task)
        let consumer_task = tokio::spawn(async move {
            println!("Consumer waiting for messages...");
            // rx.recv() waits for a message. Returns None if the channel is closed
            // (i.e., all senders have been dropped).
            while let Some(value) = rx.recv().await {
                println!("Consumer received: {}", value);
                sleep(Duration::from_millis(100)).await; // Simulate processing time
            }
            println!("Consumer finished: Channel closed.");
        });

        // Wait for both tasks to complete
        let _ = tokio::join!(producer_task, consumer_task);
        println!("All tasks completed.");
    }
    ```

---

**2. Advanced Error Handling with `thiserror`**

*   **Defining Custom Error Enums**
    *   **What it does:** Uses the `thiserror` crate's derive macro (`#[derive(Error)]`) to easily create custom error types that implement `std::error::Error` and `std::fmt::Display`.
    *   **Why you use it:** Provides structured, descriptive errors for your library or application, making error handling more robust and informative than using simple strings or generic error types. Simplifies converting from underlying errors (`#[from]`).
    ```rust
    use thiserror::Error;
    use std::fs;
    use std::num::ParseIntError;
    use std::io;

    // Define a custom error enum for our application/library
    #[derive(Error, Debug)]
    pub enum DataProcessingError {
        // Automatically implements From<io::Error> for DataProcessingError
        #[error("Failed to access data source: {0}")]
        IoError(#[from] io::Error),

        // Automatically implements From<ParseIntError> for DataProcessingError
        #[error("Invalid number format found: {0}")]
        ParseError(#[from] ParseIntError),

        #[error("Configuration value missing for key: {key}")]
        MissingConfiguration { key: String },

        #[error("Invalid data value encountered: {details}")]
        InvalidData { details: String },

        // Use {source} to display the underlying error if needed
        #[error("An external service call failed")]
        ServiceError { #[source] source: Box<dyn std::error::Error + Send + Sync> },
    }

    // Example function that can return different kinds of errors
    fn process_data_file(filepath: &str, config_key: &str) -> Result<i32, DataProcessingError> {
        // IO Error variant (using `?` which calls `into()` thanks to `#[from]`)
        let content = fs::read_to_string(filepath)?;

        // Custom error variant
        if content.is_empty() {
            return Err(DataProcessingError::InvalidData {
                details: "Input file cannot be empty".to_string(),
            });
        }

        // Missing configuration (example)
        if config_key.is_empty() {
             return Err(DataProcessingError::MissingConfiguration { key: "some_key".into() });
        }

        // Parse error variant (using `?` again)
        let number: i32 = content.trim().parse()?;

        Ok(number * 2)
    }

    fn main() {
        // Create a dummy file for the example
        fs::write("temp_data.txt", " 123 ").expect("Failed to create temp file");

        match process_data_file("temp_data.txt", "some_config") {
            Ok(result) => println!("Processing successful, result: {}", result),
            Err(e) => {
                eprintln!("Error processing data: {}", e);
                // You can also check the underlying source if available
                if let Some(source) = e.source() {
                    eprintln!("  Caused by: {}", source);
                }
            }
        }

        match process_data_file("non_existent_file.txt", "some_config") {
            Ok(_) => (), // Won't happen
            Err(e) => eprintln!("Error (expected): {}", e), // Expect IoError
        }

        fs::write("temp_data.txt", " not a number ").expect("Failed to write bad data");
        match process_data_file("temp_data.txt", "some_config") {
            Ok(_) => (), // Won't happen
            Err(e) => eprintln!("Error (expected): {}", e), // Expect ParseError
        }

        fs::remove_file("temp_data.txt").ok(); // Clean up
    }
    ```

---

**3. Custom Derive Macros**

*   **Creating a Basic Derive Macro**
    *   **What it does:** Defines a procedural macro that automatically generates trait implementations (or other code) for structs or enums annotated with `#[derive(YourMacroName)]`.
    *   **Why you use it:** Reduces boilerplate code by automating the implementation of common traits or custom logic based on the structure of the annotated type. Requires a separate crate with `proc-macro = true` in `Cargo.toml`.
    *   *(Note: This requires creating a separate crate)*

    **Example `my_derive_macro/src/lib.rs` (the macro crate):**
    ```rust
    // This code goes in a separate crate (e.g., `my_derive_macro`)
    // Add `proc-macro = true` to its Cargo.toml
    extern crate proc_macro;
    use proc_macro::TokenStream;
    use quote::quote; // Needs `quote` crate dependency
    use syn::{parse_macro_input, DeriveInput}; // Needs `syn` crate dependency (with "derive" feature)

    #[proc_macro_derive(Describe)]
    pub fn describe_derive(input: TokenStream) -> TokenStream {
        // Parse the input tokens into a syntax tree
        let input = parse_macro_input!(input as DeriveInput);

        // Get the name of the struct/enum the macro is applied to
        let name = &input.ident;

        // Build the output token stream using the `quote` macro
        let expanded = quote! {
            // Generate the implementation block
            impl Describe for #name {
                fn describe(&self) -> String {
                    // Create a descriptive string including the type name
                    format!("This is an instance of {}", stringify!(#name))
                }
            }
        };

        // Convert the generated code back into a TokenStream
        TokenStream::from(expanded)
    }
    ```

    **Example `main.rs` (using the derive macro):**
    ```rust
    // This code goes in your main application crate
    // Add `my_derive_macro` to its Cargo.toml dependencies

    // Assume my_derive_macro is the name of the macro crate
    use my_derive_macro::Describe;

    // Define the trait that the macro will implement
    trait Describe {
        fn describe(&self) -> String;
    }

    // Apply the custom derive macro
    #[derive(Describe)]
    struct MyStruct {
        field1: i32,
        field2: String,
    }

    #[derive(Describe)]
    enum MyEnum {
        VariantA,
        VariantB(String),
    }

    fn main() {
        let instance1 = MyStruct { field1: 10, field2: "Hello".to_string() };
        let instance2 = MyEnum::VariantB("World".to_string());

        println!("{}", instance1.describe()); // Output: This is an instance of MyStruct
        println!("{}", instance2.describe()); // Output: This is an instance of MyEnum
    }
    ```

---

**4. WebSocket Communication with `tokio-tungstenite`**

*   **Basic WebSocket Client**
    *   **What it does:** Establishes a WebSocket connection to a server, allowing for full-duplex communication (sending and receiving messages concurrently).
    *   **Why you use it:** For real-time applications like chat, live updates, or interactive browser-based tools where persistent, low-latency communication is needed.
    *   *(Requires `tokio`, `tokio-tungstenite`, `futures-util`, and `url` dependencies)*
    ```rust
    use tokio::net::TcpStream;
    use tokio_tungstenite::{connect_async, MaybeTlsStream, WebSocketStream};
    use tokio_tungstenite::tungstenite::protocol::Message;
    use url::Url;
    use futures_util::{StreamExt, SinkExt}; // For stream/sink methods
    use std::error::Error;

    #[tokio::main]
    async fn main() -> Result<(), Box<dyn Error>> {
        let ws_url = "wss://echo.websocket.org";
        let url = Url::parse(ws_url).expect("Invalid WebSocket URL");

        println!("Connecting to: {}", ws_url);

        // Establish the WebSocket connection (async)
        // connect_async handles the WebSocket handshake over TCP/TLS
        let (ws_stream, response) = connect_async(url).await.expect("Failed to connect");

        println!("Successfully connected to WebSocket server.");
        println!("HTTP Response Status: {}", response.status());
        // println!("HTTP Response Headers: {:?}", response.headers());

        // Split the WebSocket stream into a sender (Sink) and receiver (Stream)
        // This allows sending and receiving concurrently in separate tasks if needed.
        let (mut write, mut read) = ws_stream.split();

        // Example: Send a message
        let msg_text = "Hello, WebSocket!";
        println!("Sending message: {}", msg_text);
        write.send(Message::Text(msg_text.to_string())).await?;

        // Example: Receive messages (e.g., echo from echo.websocket.org)
        println!("Waiting for messages...");
        // Process the first few messages received
        for _ in 0..2 { // Limit for demonstration
            match read.next().await {
                Some(Ok(msg)) => {
                    match msg {
                        Message::Text(text) => {
                            println!("Received Text: {}", text);
                            // Echo server sends back our message, break after receiving it
                            if text == msg_text {
                                println!("Received echo, closing.");
                                break;
                            }
                        }
                        Message::Binary(bin) => {
                            println!("Received Binary: {:?}", bin);
                        }
                        Message::Ping(ping) => {
                            println!("Received Ping: {:?}", ping);
                            // Respond to pings to keep connection alive
                            write.send(Message::Pong(ping)).await?;
                        }
                        Message::Pong(pong) => {
                            println!("Received Pong: {:?}", pong);
                        }
                        Message::Close(close_frame) => {
                            println!("Received Close frame: {:?}", close_frame);
                            break; // Exit loop on close frame
                        }
                        Message::Frame(_) => {
                            // Raw frame, usually not handled directly
                            println!("Received raw Frame");
                        }
                    }
                }
                Some(Err(e)) => {
                    eprintln!("Error receiving message: {}", e);
                    break;
                }
                None => {
                    println!("WebSocket stream closed by server.");
                    break; // Stream ended
                }
            }
        }

        // Optionally, gracefully close the connection
        println!("Sending Close frame.");
        write.close().await?;

        println!("WebSocket client finished.");
        Ok(())
    }
    ```

---

**5. Advanced Pattern Matching**

*   **Destructuring Structs, Enums, and Tuples with Guards**
    *   **What it does:** Uses `match` expressions to simultaneously break down complex data structures (structs, enums, tuples) into their constituent parts and apply conditional logic (`if` guards) to specific patterns.
    *   **Why you use it:** Enables writing expressive and concise code for handling different states or variations within data structures, improving readability and reducing nested `if`/`else` chains.
    ```rust
    enum Message {
        // Simple variant
        Quit,
        // Struct variant
        Move { x: i32, y: i32 },
        // Tuple variant
        ChangeColor(u8, u8, u8),
        // Variant with data
        Write(String),
    }

    struct User {
        id: u32,
        name: String,
        active: bool,
    }

    fn process_item(item: Message, current_user: &User) {
        match item {
            // Match simple variant
            Message::Quit => println!("User {} requested Quit", current_user.name),

            // Match struct variant and destructure fields
            Message::Move { x, y } => {
                println!("Move command to ({}, {}) received.", x, y);
            }

            // Match tuple variant and destructure fields
            Message::ChangeColor(r, g, b) => {
                println!("ChangeColor command: R={}, G={}, B={}", r, g, b);
            }

            // Match variant with data and use `ref` for borrowing
            Message::Write(ref text) => {
                println!("Write command: '{}'", text);
            }
        }
    }

    fn check_user_status(user: &User) {
         match user {
             // Destructure struct in match, apply guard
             User { id, name, active: true } if *id > 100 => {
                 println!("High-ID Active User: {} ({})", name, id);
             }
             User { name, active: true, .. } => {
                 // `..` ignores remaining fields (id in this case)
                 println!("Active User: {}", name);
             }
             User { name, active: false, .. } => {
                 println!("Inactive User: {}", name);
             }
         }
    }

    fn main() {
        let user1 = User { id: 101, name: "Alice".to_string(), active: true };
        let user2 = User { id: 50, name: "Bob".to_string(), active: true };
        let user3 = User { id: 200, name: "Charlie".to_string(), active: false };

        let msg1 = Message::Move { x: 10, y: 20 };
        let msg2 = Message::Write("Hello there".to_string());
        let msg3 = Message::Quit;

        process_item(msg1, &user1);
        process_item(msg2, &user2);
        process_item(msg3, &user3);

        println!("---");
        check_user_status(&user1);
        check_user_status(&user2);
        check_user_status(&user3);
    }
    ```

---

**6. Parallelism with `rayon`**

*   **Parallel Iterators (`par_iter`)**
    *   **What it does:** Converts a standard iterator (on collections like `Vec`, `slice`, `HashMap`) into a parallel iterator using `rayon`. Operations like `map`, `filter`, `sum`, `collect` are then executed across multiple threads automatically.
    *   **Why you use it:** To easily speed up CPU-bound computations on collections by leveraging multiple processor cores without manual thread management. Ideal for data processing tasks.
    ```rust
    use rayon::prelude::*;
    use std::time::Instant;

    // A moderately CPU-intensive function
    fn compute_something(n: u64) -> u64 {
        let mut result = n;
        for i in 1..1000 {
            result = (result + i * n) % 50000;
        }
        result
    }

    fn main() {
        let numbers: Vec<u64> = (1..=20_000).collect();
        let numbers_large: Vec<u64> = (1..=500_000).collect();

        // --- Sequential Sum ---
        let start_seq_sum = Instant::now();
        let sum_seq: u64 = numbers.iter().sum();
        let duration_seq_sum = start_seq_sum.elapsed();
        println!("Sequential Sum: {} (took {:?})", sum_seq, duration_seq_sum);

        // --- Parallel Sum ---
        let start_par_sum = Instant::now();
        let sum_par: u64 = numbers.par_iter().sum();
        let duration_par_sum = start_par_sum.elapsed();
        println!("Parallel Sum:   {} (took {:?})", sum_par, duration_par_sum);

        println!("---");

        // --- Sequential Map + Sum ---
        let start_seq_map = Instant::now();
        let mapped_sum_seq: u64 = numbers_large.iter().map(|&n| compute_something(n)).sum();
        let duration_seq_map = start_seq_map.elapsed();
        println!("Sequential Map+Sum: {} (took {:?})", mapped_sum_seq, duration_seq_map);

        // --- Parallel Map + Sum ---
        let start_par_map = Instant::now();
        // Just change .iter() to .par_iter()
        let mapped_sum_par: u64 = numbers_large.par_iter().map(|&n| compute_something(n)).sum();
        let duration_par_map = start_par_map.elapsed();
        println!("Parallel Map+Sum:   {} (took {:?})", mapped_sum_par, duration_par_map);

         println!("---");

        // --- Parallel Collect ---
        let start_par_collect = Instant::now();
        let processed_numbers: Vec<u64> = numbers_large.par_iter()
                                                  .map(|&n| compute_something(n))
                                                  .filter(|&res| res % 2 == 0)
                                                  .collect();
        let duration_par_collect = start_par_collect.elapsed();
        println!("Parallel Collect ({} items) took {:?}", processed_numbers.len(), duration_par_collect);
    }
    ```

---

**7. Structured Logging with `tracing`**

*   **Basic Setup with Spans and Events**
    *   **What it does:** Uses the `tracing` crate to create hierarchical timed spans (representing units of work) and record structured events (log messages with associated data) within those spans.
    *   **Why you use it:** Provides richer, more structured diagnostic information than traditional line-based logging. Excellent for understanding the flow and performance of concurrent or complex applications. Allows different subscribers (`tracing_subscriber`) to format and output trace data in various ways (e.g., JSON, console).
    ```rust
    use tracing::{info, instrument, span, Level, event, warn};
    use tracing_subscriber::fmt; // For basic console output
    use std::time::Duration;
    use rand::Rng;

    // The #[instrument] macro automatically creates a span around this function
    // Arguments are automatically included as fields in the span.
    #[instrument(level = "info", skip(data), fields(data_len = data.len()))]
    fn process_data(task_id: u32, data: &[u8]) {
        event!(Level::INFO, "Starting data processing for task.");
        // Simulate work
        let processing_time = Duration::from_millis(rand::thread_rng().gen_range(50..150));
        std::thread::sleep(processing_time);

        if data.len() < 5 { // Example condition
            warn!(bytes = data.len(), "Data length is unexpectedly small.");
        }

        event!(Level::DEBUG, ?processing_time, "Data processing simulation complete.");
    }

    #[instrument(level = "info")]
    fn run_tasks() {
        info!("Running multiple tasks...");
        for i in 0..3 {
            // Manually create a span for each iteration
            let task_span = span!(Level::INFO, "task_iteration", task_num = i);
            // Enter the span: code inside the guard runs within this span
            let _enter = task_span.enter();

            event!(Level::INFO, "Preparing data for task.");
            let dummy_data = vec![i as u8; (i * 3 + 2) as usize]; // Variable data length

            process_data(i, &dummy_data);
        }
        info!("All tasks finished.");
    }

    fn main() {
        // Initialize the tracing subscriber
        // This collects trace data and formats/outputs it.
        // `fmt::init()` provides a simple, human-readable console output.
        // You can customize levels, formats (like JSON), and output destinations.
        fmt()
            // .with_max_level(Level::DEBUG) // Uncomment to see DEBUG level events
            .init();

        // The main function implicitly has a root span
        info!(app_version = env!("CARGO_PKG_VERSION"), "Application starting.");

        run_tasks();

        info!("Application finished.");
    }
    ```