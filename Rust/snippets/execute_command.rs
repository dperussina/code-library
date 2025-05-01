use std::process::{Command, Output, Stdio};
use std::io::{self, Write}; // For piping input
use std::path::Path;

/// Executes an external command and waits for it to finish.
/// Captures stdout, stderr, and the exit status.
///
/// # Arguments
/// * `program` - The command to execute (e.g., "ls", "echo").
/// * `args` - A slice of string arguments for the command.
/// * `current_dir` - Optional directory to run the command in. Defaults to current dir.
/// * `input` - Optional string slice to pipe to the command's stdin.
///
/// # Returns
/// * `io::Result<Output>` - Contains stdout, stderr, and status if successful.
fn execute_command(
    program: &str, 
    args: &[&str],
    current_dir: Option<&Path>,
    input: Option<&str>,
) -> io::Result<Output> {
    let mut command = Command::new(program);
    command.args(args);

    // Set the working directory if provided
    if let Some(dir) = current_dir {
        command.current_dir(dir);
    }

    // Configure stdio for capturing output and optionally piping input
    if input.is_some() {
        command.stdin(Stdio::piped());
    }
    command.stdout(Stdio::piped());
    command.stderr(Stdio::piped());

    // Spawn the child process
    let mut child = command.spawn()?;

    // Pipe input if provided
    if let Some(input_data) = input {
        if let Some(mut stdin) = child.stdin.take() {
            stdin.write_all(input_data.as_bytes())?;
            // stdin is closed when `stdin` goes out of scope.
        } else {
            // This should ideally not happen if stdin was set to piped
            return Err(io::Error::new(io::ErrorKind::Other, "Failed to get stdin handle"));
        }
    }

    // Wait for the command to complete and collect its output
    child.wait_with_output()
}

/// Executes a command but streams its output (stdout/stderr) directly to the parent's stdio.
/// Does not capture the output in memory.
///
/// # Arguments
/// * `program` - The command to execute.
/// * `args` - A slice of string arguments.
/// * `current_dir` - Optional directory to run the command in.
///
/// # Returns
/// * `io::Result<std::process::ExitStatus>` - The exit status of the command.
fn execute_command_inherit_stdio(
    program: &str, 
    args: &[&str],
    current_dir: Option<&Path>,
) -> io::Result<std::process::ExitStatus> {
    let mut command = Command::new(program);
    command.args(args);
    if let Some(dir) = current_dir {
        command.current_dir(dir);
    }
    
    // Inherit stdio handles from the parent
    command.stdin(Stdio::inherit());
    command.stdout(Stdio::inherit());
    command.stderr(Stdio::inherit());

    // Spawn and wait for the status
    command.status()
}


// Example Usage (within a main function or test)
/*
fn main() -> io::Result<()> {
    println!("--- Example 1: Capturing 'echo' output ---");
    let echo_args = ["Hello", "from", "Rust!"];
    match execute_command("echo", &echo_args, None, None) {
        Ok(output) => {
            println!("Status: {}", output.status);
            // Output often includes a trailing newline
            println!("Stdout:\n{}", String::from_utf8_lossy(&output.stdout));
            println!("Stderr:\n{}", String::from_utf8_lossy(&output.stderr));
            if !output.status.success() {
                eprintln!("Command failed!");
            }
        }
        Err(e) => eprintln!("Error executing command: {}", e),
    }

    println!("\n--- Example 2: Listing files with 'ls' (or 'dir' on Windows) ---");
    #[cfg(windows)]
    let (list_cmd, list_args) = ("cmd", ["/C", "dir"]);
    #[cfg(not(windows))]
    let (list_cmd, list_args) = ("ls", ["-la"]);

    match execute_command(list_cmd, &list_args, None, None) {
        Ok(output) => {
            println!("Status: {}", output.status);
            println!("Stdout:\n{}", String::from_utf8_lossy(&output.stdout));
            println!("Stderr:\n{}", String::from_utf8_lossy(&output.stderr));
        }
        Err(e) => eprintln!("Error executing command: {}", e),
    }

    println!("\n--- Example 3: Piping input to 'grep' (or 'findstr' on Windows) ---");
    let input_text = "Line one\nLine two with keyword\nLine three\nAnother keyword line";
    
    #[cfg(windows)]
    let (grep_cmd, grep_args) = ("findstr", ["keyword"]);
    #[cfg(not(windows))]
    let (grep_cmd, grep_args) = ("grep", ["keyword"]);

    match execute_command(grep_cmd, &grep_args, None, Some(input_text)) {
        Ok(output) => {
            println!("Status: {}", output.status);
            println!("Stdout (lines containing 'keyword'):\n{}", String::from_utf8_lossy(&output.stdout));
            println!("Stderr:\n{}", String::from_utf8_lossy(&output.stderr));
        }
        Err(e) => eprintln!("Error executing command with input pipe: {}", e),
    }
    
    println!("\n--- Example 4: Running a command with inherited stdio (e.g., interactive) ---");
    // This will print directly to the console where this program runs.
    // Useful for interactive commands or when you don't need to capture output.
    // Example: Run `git status` and see its output directly.
    println!("Running '{} {}' with inherited stdio...", list_cmd, list_args.join(" "));
    match execute_command_inherit_stdio(list_cmd, &list_args, None) {
        Ok(status) => println!("Command finished with status: {}", status),
        Err(e) => eprintln!("Error executing command with inherited stdio: {}", e),
    }

    Ok(())
}
*/ 