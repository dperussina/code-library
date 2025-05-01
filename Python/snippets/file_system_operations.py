# File System Operations (using `pathlib`)
from pathlib import Path # Import the Path object for object-oriented file system paths.

def list_files(directory: str | Path, pattern: str = "*") -> list[Path]:
    """Lists files in a directory matching a pattern."""
    # Convert the input string or Path object into a Path object.
    dir_path = Path(directory)
    # Check if the path exists and is a directory.
    if not dir_path.is_dir():
        print(f"Error: Directory not found or not a directory: {directory}")
        return [] # Return empty list if not a valid directory.
    # Use glob() to find all files/directories matching the pattern within the directory.
    # Return the results as a list of Path objects.
    return list(dir_path.glob(pattern))

def create_directory(dir_path: str | Path):
    """Creates a directory, including parent directories if needed."""
    # Convert the input to a Path object.
    path = Path(dir_path)
    try:
        # Create the directory.
        # parents=True: Creates any necessary parent directories.
        # exist_ok=True: Does not raise an error if the directory already exists.
        path.mkdir(parents=True, exist_ok=True) # exist_ok=True prevents error if exists
        print(f"Directory ensured: {path}")
    except Exception as e:
        # Handle potential errors during directory creation.
        print(f"Error creating directory {path}: {e}")

# Checking if File or Directory Exists
def path_exists(path_str):
    """Checks if a file or directory exists."""
    # Convert the string to a Path object and check if it exists.
    return Path(path_str).exists()

def is_file(path_str):
    """Checks if a path is an existing file."""
    # Convert the string to a Path object and check if it points to an existing file.
    return Path(path_str).is_file()

def is_dir(path_str):
    """Checks if a path is an existing directory."""
    # Convert the string to a Path object and check if it points to an existing directory.
    return Path(path_str).is_dir()