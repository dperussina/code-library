use std::fs::OpenOptions;
use std::io::{self, Write};
use std::path::Path;

/// Writes lines of text to a file, optionally overwriting it.
///
/// # Arguments
///
/// * `filepath` - Path to the output file.
/// * `lines` - A slice of string slices to write.
/// * `overwrite` - If true, truncates the file if it exists; otherwise, appends.
///
/// # Returns
///
/// * `io::Result<()>` - Ok(()) if successful, or an io::Error otherwise.
fn write_text_file<P: AsRef<Path>>(filepath: P, lines: &[&str], overwrite: bool) -> io::Result<()> {
    // Use OpenOptions to control how the file is opened.
    let file = OpenOptions::new()
        .write(true)     // Open for writing.
        .create(true)    // Create the file if it doesn't exist.
        .truncate(overwrite) // If overwrite is true, truncate the file to zero length.
        .append(!overwrite) // If not overwriting, append to the end.
        .open(filepath)?;
    
    // Use a BufWriter for potentially better performance, especially with many small writes.
    let mut writer = io::BufWriter::new(file);
    
    // Iterate through the lines and write each one, followed by a newline.
    for line in lines {
        writeln!(writer, "{}", line)?;
    }
    
    // BufWriter might buffer data; flushing ensures all data is written to the OS.
    // Dropping the writer also typically flushes, but explicit flush is clearer.
    writer.flush()?;
    
    Ok(())
}

// Example Usage (within a main function or test)
/*
fn main() {
    let filepath = "output.txt";
    let data_to_write = ["Line 1 from Rust", "Line 2", "Another line"];

    println!("Attempting to write to {}", filepath);
    if let Err(e) = write_text_file(filepath, &data_to_write, true) {
        eprintln!("Error writing to file: {}", e);
    } else {
        println!("Successfully wrote to {}", filepath);
        // Optional: read back to verify
        // let contents = std::fs::read_to_string(filepath).expect("Could not read back file");
        // println!("File contents:\n{}", contents);
        // std::fs::remove_file(filepath).expect("Could not remove test file");
    }
}
*/ 