/// Enum defining different types of messages.
#[derive(Debug)] // Add Debug for easy printing
enum Message {
    Quit,
    Move { x: i32, y: i32 }, // Struct variant
    Write(String),           // Tuple variant with one element
    ChangeColor(i32, i32, i32), // Tuple variant with multiple elements
    Complex { id: u32, payload: Vec<u8>, important: bool }, // Another struct variant
}

/// Processes different message variants using pattern matching.
dfn process_message(msg: Message) {
    println!("Processing message: {:?}", msg);
    match msg {
        // 1. Simple enum variant match
        Message::Quit => {
            println!("  Action: Quit message received. Terminating.");
            // Perform termination logic here...
        }

        // 2. Destructuring a struct variant
        // We bind the inner fields `x` and `y` to variables.
        Message::Move { x, y } => {
            println!("  Action: Move to coordinates ({}, {}).", x, y);
            // Use x and y here...
        }

        // 3. Destructuring a tuple variant
        Message::Write(text) => {
            println!("  Action: Write text message: \"{}\"", text);
            // Use text here...
        }

        // 4. Destructuring a multi-element tuple variant
        Message::ChangeColor(r, g, b) => {
            println!("  Action: Change color to RGB({}, {}, {}).", r, g, b);
            // Use r, g, b here...
        }
        
        // 5. More complex destructuring with guards and binding modes
        Message::Complex { id, ref payload, important } => {
            println!("  Action: Complex message ID: {}", id);
            // Use `ref payload` to borrow the Vec instead of moving it.
            println!("    Payload length: {} bytes", payload.len());
            
            // Example of a match guard: only execute if `important` is true.
            if important {
                println!("    This is an important message!");
                // Perform priority actions...
            }
            
            // Example of matching specific values within the structure
            if id == 101 && payload.get(0) == Some(&0xAAu8) {
                 println!("    Special condition met (ID 101, payload starts with 0xAA).");
            }
        }
        
        // It's good practice to have a catch-all or handle all variants explicitly.
        // If new variants are added to Message, the compiler will warn if they aren't handled.
        // Uncomment if you want a catch-all instead of listing all variants:
        // _ => {
        //     println!("  Action: Received an unknown or unhandled message type.");
        // }
    }
    println!("Finished processing message.");
}


/// Demonstrates matching on tuples and using guards.
fn match_tuple_and_guards(point: (i32, i32)) {
    println!("\nMatching on point: {:?}", point);
    match point {
        (0, 0) => println!("  Point is at the origin."),
        (x, 0) => println!("  Point is on the x-axis at x = {}."),
        (0, y) => println!("  Point is on the y-axis at y = {}."),
        // Match any point (x, y)
        (x, y) if x == y => println!("  Point lies on the line x = y at ({}, {}).", x, y),
        (x, y) if x == -y => println!("  Point lies on the line x = -y at ({}, {}).", x, y),
        // Bind to `x_val` and `y_val`
        (x_val, y_val) => {
            println!("  Point is at ({}, {}).", x_val, y_val);
            // Further conditions or calculations using x_val, y_val
            if x_val.abs() > 10 || y_val.abs() > 10 {
                println!("    This point is far from the origin.");
            }
        }
    }
}

// Example Usage
/*
fn main() {
    println!("--- Processing Enum Messages ---");
    let msg1 = Message::Quit;
    let msg2 = Message::Move { x: 10, y: 20 };
    let msg3 = Message::Write("Hello there!".to_string());
    let msg4 = Message::ChangeColor(255, 0, 128);
    let msg5 = Message::Complex { id: 101, payload: vec![0xAA, 0xBB, 0xCC], important: true };
    let msg6 = Message::Complex { id: 200, payload: vec![1, 2, 3], important: false };

    process_message(msg1);
    println!("---");
    process_message(msg2);
    println!("---");
    process_message(msg3);
    println!("---");
    process_message(msg4);
    println!("---");
    process_message(msg5);
     println!("---");
    process_message(msg6);

    println!("\n--- Matching Tuples and Guards ---");
    match_tuple_and_guards((0, 0));
    match_tuple_and_guards((5, 0));
    match_tuple_and_guards((0, -3));
    match_tuple_and_guards((4, 4));
    match_tuple_and_guards((2, -2));
    match_tuple_and_guards((15, 8));
    match_tuple_and_guards((1, 3));
}
*/ 