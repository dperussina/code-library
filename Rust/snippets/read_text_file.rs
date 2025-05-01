use std::fs::File;
use std::io::{self, BufRead, BufReader};
use std::path::Path;

/// Reads a text file line by line into a vector of strings.
///
/// # Arguments
///
/// * `filepath` - A string slice that holds the path to the file.
///
/// # Returns
///
/// * `io::Result<Vec<String>>` - A Result containing a vector of strings (each line)
///   if successful, or an io::Error otherwise.
fn read_text_file<P: AsRef<Path>>(filepath: P) -> io::Result<Vec<String>> {
    let file = File::open(filepath)?; // Open the file read-only.
    let reader = BufReader::new(file); // Use a BufReader for efficiency.
    // Collect lines into a Vec<String>, handling potential errors during reading.
    let lines: Vec<String> = reader.lines().collect::<Result<_, _>>()?;
    Ok(lines)
}

// Example Usage (within a main function or test)
/*
fn main() {
    let filepath = "my_data.txt"; // Replace with your file path
    // Create a dummy file for testing
    // std::fs::write(filepath, "Line 1
Line 2
Line 3").expect("Unable to create test file");

    match read_text_file(filepath) {
        Ok(lines) => {
            println!("Successfully read {} lines.", lines.len());
            for line in lines {
                println!("  - {}", line);
            }
        }
        Err(e) => eprintln!("Error reading file '{}': {}", filepath, e),
    }
    // Clean up dummy file
    // std::fs::remove_file(filepath).expect("Unable to remove test file");
}
*/ 