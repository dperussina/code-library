import argparse # Import the standard library for command-line option, argument and sub-command parsing.

def parse_arguments():
    """Parses command-line arguments using argparse."""
    # Create an ArgumentParser object.
    # description provides a brief description of what the script does.
    parser = argparse.ArgumentParser(description="Description of your script.")

    # Define command-line arguments the script accepts.
    # Add a required positional argument for the input file path.
    parser.add_argument("input_file", help="Path to the input file.")
    # Add an optional argument ('-o' or '--output') for the output file path.
    # 'default' specifies the value if the argument is not provided.
    parser.add_argument("-o", "--output", default="output.txt", help="Path to the output file (default: output.txt).")
    # Add an optional argument ('-n' or '--number') that expects an integer value.
    # 'type=int' ensures the argument is converted to an integer.
    parser.add_argument("-n", "--number", type=int, default=10, help="An integer parameter (default: 10).")
    # Add an optional flag ('-v' or '--verbose') that acts as a boolean switch.
    # 'action="store_true"' means the argument will be True if the flag is present, False otherwise.
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose output.")

    # Parse the arguments provided by the user when running the script.
    args = parser.parse_args()
    # Return the parsed arguments as an object (usually a Namespace).
    return args