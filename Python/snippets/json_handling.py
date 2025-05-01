import json # Import the standard library module for working with JSON data.
from pathlib import Path # Import Path for object-oriented filesystem paths.

def read_json_file(filepath: str | Path) -> dict | list | None:
    """Reads a JSON file and returns its content (dict or list)."""
    try:
        # Open the JSON file in read mode ('r') with UTF-8 encoding.
        with open(filepath, 'r', encoding='utf-8') as f:
            # Parse the JSON data from the file into a Python object (dict or list).
            data = json.load(f)
        # Return the parsed data.
        return data
    except FileNotFoundError:
        # Handle the case where the file does not exist.
        print(f"Error: File not found at {filepath}")
        return None # Return None on error.
    except json.JSONDecodeError:
        # Handle cases where the file content is not valid JSON.
        print(f"Error: Invalid JSON format in {filepath}")
        return None # Return None on error.
    except Exception as e:
        # Handle other potential errors during file reading or JSON parsing.
        print(f"Error reading JSON file {filepath}: {e}")
        return None # Return None on error.

def write_json_file(filepath: str | Path, data: dict | list, indent: int = 4):
    """Writes Python dict or list to a JSON file."""
    try:
        # Open the file in write mode ('w') with UTF-8 encoding.
        # This will overwrite the file if it exists, or create it if it doesn't.
        with open(filepath, 'w', encoding='utf-8') as f:
            # Serialize the Python object (data) into a JSON formatted string and write it to the file.
            # indent=4: Pretty-prints the JSON with an indentation of 4 spaces.
            # ensure_ascii=False: Allows writing non-ASCII characters directly (important for UTF-8).
            json.dump(data, f, indent=indent, ensure_ascii=False)
        # Print a confirmation message.
        print(f"Successfully wrote data to {filepath}")
    except Exception as e:
        # Handle potential errors during JSON serialization or file writing.
        print(f"Error writing JSON file {filepath}: {e}")