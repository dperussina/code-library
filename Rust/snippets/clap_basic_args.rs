// Note: This example requires adding the `clap` crate to your Cargo.toml:
// [dependencies]
// clap = { version = "4.0", features = ["derive"] } // Using derive feature for easier setup

use clap::{Parser, ArgAction};

/// Simple program to greet a person and optionally print debug info.
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)] // Reads info from Cargo.toml
struct Args {
    /// Name of the person to greet
    #[arg(short, long)]
    name: String,

    /// Number of times to greet
    #[arg(short, long, default_value_t = 1)]
    count: u8,
    
    /// Optional input file path
    #[arg(short, long, value_name = "FILE")]
    input: Option<String>,
    
    /// Enable verbose logging
    #[arg(short, long, action = ArgAction::SetTrue)] // Flag, doesn't take a value
    verbose: bool,
}

/// Parses command-line arguments using clap derive API and prints the results.
fn parse_and_print_args() {
    // Clap automatically parses arguments from `std::env::args_os()`
    let args = Args::parse();

    println!("--- Parsed Arguments ---");
    println!("Name: {}", args.name);
    println!("Count: {}", args.count);
    
    if let Some(input_file) = args.input {
        println!("Input file: {}", input_file);
    } else {
        println!("Input file: Not provided");
    }

    println!("Verbose: {}", args.verbose);

    // Example of using the parsed arguments
    for _ in 0..args.count {
        println!("\nHello, {}!", args.name);
    }
    
    if args.verbose {
        println!("\nVerbose mode is ON.");
        // Perform verbose actions here...
    }
}

// Example Usage (within a main function)
/*
fn main() {
    // To run this example, build and execute from the command line:
    // cargo build
    // ./target/debug/<your_executable_name> --name Alice -v
    // ./target/debug/<your_executable_name> --name Bob --count 3 --input data.txt
    // ./target/debug/<your_executable_name> --help 
    
    parse_and_print_args();
}
*/

// --- Manual (non-derive) Clap Setup Example (for reference) ---
/*
use clap::{Arg, Command, ArgAction as ClapArgAction}; // Renamed to avoid conflict

fn parse_arguments_manual() {
    let matches = Command::new("MyAppManual")
        .version("1.0")
        .author("Manual Author")
        .about("Demonstrates manual clap setup")
        .arg(
            Arg::new("name")
                .short('n')
                .long("name")
                .value_name("NAME")
                .help("Sets the name to greet")
                .required(true)
        )
        .arg(
            Arg::new("count")
                .short('c')
                .long("count")
                .value_name("NUMBER")
                .help("Number of times to greet")
                .value_parser(clap::value_parser!(u8)) // Specify the type
                .default_value("1")
        )
        .arg(
             Arg::new("input")
                .short('i')
                .long("input")
                .value_name("FILE")
                .help("Sets the input file")
                // Not required, so it's an Option<String>
        )
        .arg(
            Arg::new("verbose")
                .short('v')
                .long("verbose")
                .help("Enables verbose mode")
                .action(ClapArgAction::SetTrue) // Specify it's a flag
        )
        .get_matches();

    // Extract values using value_of (for value args) or is_present (for flags)
    let name = matches.get_one::<String>("name").expect("Name is required");
    let count = *matches.get_one::<u8>("count").expect("Count has a default value");
    let input = matches.get_one::<String>("input"); // Returns Option<&String>
    let verbose = matches.get_flag("verbose");

    println!("--- Manual Parsed Arguments ---");
    println!("Name: {}", name);
    println!("Count: {}", count);
    if let Some(input_file) = input {
        println!("Input file: {}", input_file);
    } else {
        println!("Input file: Not provided");
    }
    println!("Verbose: {}", verbose);
}

// fn main() {
//     parse_arguments_manual();
// }
*/ 