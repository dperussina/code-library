import os # Import os module, though not strictly used in these functions, often useful with file paths.
from pathlib import Path # Import Path for object-oriented filesystem paths.

def read_text_file(filepath: str | Path) -> list[str]:
    """Reads a text file and returns a list of lines."""
    try:
        # Open the file in read mode ('r') with UTF-8 encoding.
        # The 'with' statement ensures the file is automatically closed.
        with open(filepath, 'r', encoding='utf-8') as f:
            # Read all lines, strip leading/trailing whitespace from each, and store in a list.
            lines = [line.strip() for line in f]
        # Return the list of lines.
        return lines
    except FileNotFoundError:
        # Handle the case where the file does not exist.
        print(f"Error: File not found at {filepath}")
        return [] # Return an empty list on error.
    except Exception as e:
        # Handle other potential file reading errors.
        print(f"Error reading file {filepath}: {e}")
        return [] # Return an empty list on error.

def write_text_file(filepath: str | Path, lines: list[str], overwrite: bool = False):
    """Writes a list of strings to a text file, one string per line."""
    # Determine the file opening mode: 'w' (write) to overwrite, 'a' (append) to add to the end.
    mode = 'w' if overwrite else 'a' # 'w' for overwrite, 'a' for append
    try:
        # Open the file in the determined mode ('w' or 'a') with UTF-8 encoding.
        with open(filepath, mode, encoding='utf-8') as f:
            # Iterate through the list of lines to write.
            for line in lines:
                # Write each line to the file, adding a newline character at the end.
                f.write(line + '\n')
        # Print a confirmation message.
        print(f"Successfully wrote {len(lines)} lines to {filepath} (mode: {mode})")
    except Exception as e:
        # Handle potential file writing errors.
        print(f"Error writing to file {filepath}: {e}")