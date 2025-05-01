**Advanced Rust Examples**

---

**1. Concurrency with `tokio`**

* **Spawning Asynchronous Tasks:**
    ```rust
    use tokio::task;

    #[tokio::main]
    async fn main() {
        let task1 = task::spawn(async {
            println!("Task 1 is running");
            42 // Return value
        });

        let task2 = task::spawn(async {
            println!("Task 2 is running");
            24
        });

        let result1 = task1.await.unwrap();
        let result2 = task2.await.unwrap();

        println!("Results: {} and {}", result1, result2);
    }
    ```

* **Using `tokio::sync::mpsc` for Channels:**
    ```rust
    use tokio::sync::mpsc;

    #[tokio::main]
    async fn main() {
        let (tx, mut rx) = mpsc::channel(32);

        tokio::spawn(async move {
            for i in 0..10 {
                if tx.send(i).await.is_err() {
                    println!("Receiver dropped");
                    return;
                }
            }
        });

        while let Some(value) = rx.recv().await {
            println!("Received: {}", value);
        }
    }
    ```

---

**2. Advanced Error Handling with `thiserror`**

* **Defining Custom Errors:**
    ```rust
    use thiserror::Error;

    #[derive(Error, Debug)]
    pub enum MyError {
        #[error("An IO error occurred: {0}")]
        Io(#[from] std::io::Error),

        #[error("A parsing error occurred: {0}")]
        Parse(#[from] std::num::ParseIntError),

        #[error("Custom error: {0}")]
        Custom(String),
    }

    fn example_function() -> Result<(), MyError> {
        let _value: i32 = "not_a_number".parse()?;
        Ok(())
    }

    fn main() {
        match example_function() {
            Ok(_) => println!("Success"),
            Err(e) => eprintln!("Error: {}", e),
        }
    }
    ```

---

**3. Custom Derive Macros**

* **Creating a Custom Derive Macro:**
    ```rust
    use proc_macro::TokenStream;

    #[proc_macro_derive(HelloWorld)]
    pub fn hello_world_derive(_input: TokenStream) -> TokenStream {
        "impl HelloWorld for MyStruct {
            fn hello_world() {
                println!(\"Hello, world!\");
            }
        }"
        .parse()
        .unwrap()
    }
    ```

* **Using the Macro:**
    ```rust
    #[derive(HelloWorld)]
    struct MyStruct;

    fn main() {
        MyStruct::hello_world();
    }
    ```

---

**4. WebSocket Communication with `tokio-tungstenite`**

* **WebSocket Client Example:**
    ```rust
    use tokio_tungstenite::connect_async;
    use url::Url;

    #[tokio::main]
    async fn main() {
        let url = Url::parse("wss://echo.websocket.org").unwrap();
        let (ws_stream, _) = connect_async(url).await.expect("Failed to connect");

        println!("WebSocket handshake has been successfully completed");

        let (write, read) = ws_stream.split();
        // Use `write` to send messages and `read` to receive messages
    }
    ```

---

**5. Advanced Pattern Matching**

* **Destructuring Enums and Tuples:**
    ```rust
    enum Message {
        Quit,
        Move { x: i32, y: i32 },
        Write(String),
        ChangeColor(i32, i32, i32),
    }

    fn process_message(msg: Message) {
        match msg {
            Message::Quit => println!("Quit message received"),
            Message::Move { x, y } => println!("Move to ({}, {})", x, y),
            Message::Write(text) => println!("Text message: {}", text),
            Message::ChangeColor(r, g, b) => println!("Change color to RGB({}, {}, {})", r, g, b),
        }
    }

    fn main() {
        let msg = Message::Move { x: 10, y: 20 };
        process_message(msg);
    }
    ```

---

**6. Parallelism with `rayon`**

* **Using `par_iter` for Parallel Iteration:**
    ```rust
    use rayon::prelude::*;

    fn main() {
        let numbers: Vec<i32> = (1..=100).collect();
        let sum: i32 = numbers.par_iter().sum();

        println!("Sum of numbers from 1 to 100: {}", sum);
    }
    ```

---

**7. Advanced Logging with `tracing`**

* **Setting Up Tracing:**
    ```rust
    use tracing::{info, instrument};
    use tracing_subscriber;

    #[instrument]
    fn my_function(param: i32) {
        info!("Function called with param: {}", param);
    }

    fn main() {
        tracing_subscriber::fmt::init();
        my_function(42);
    }
    ```