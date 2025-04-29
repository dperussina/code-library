import argparse

def parse_arguments():
    """Parses command-line arguments using argparse."""
    parser = argparse.ArgumentParser(description="Description of your script.")
    parser.add_argument("input_file", help="Path to the input file.")
    parser.add_argument("-o", "--output", default="output.txt", help="Path to the output file (default: output.txt).")
    parser.add_argument("-n", "--number", type=int, default=10, help="An integer parameter (default: 10).")
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose output.")

    args = parser.parse_args()
    return args