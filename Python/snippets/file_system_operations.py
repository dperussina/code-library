# File System Operations (using `pathlib`)
from pathlib import Path

def list_files(directory: str | Path, pattern: str = "*") -> list[Path]:
    """Lists files in a directory matching a pattern."""
    dir_path = Path(directory)
    if not dir_path.is_dir():
        print(f"Error: Directory not found or not a directory: {directory}")
        return []
    return list(dir_path.glob(pattern))

def create_directory(dir_path: str | Path):
    """Creates a directory, including parent directories if needed."""
    path = Path(dir_path)
    try:
        path.mkdir(parents=True, exist_ok=True) # exist_ok=True prevents error if exists
        print(f"Directory ensured: {path}")
    except Exception as e:
        print(f"Error creating directory {path}: {e}")

# Checking if File or Directory Exists
def path_exists(path_str):
    """Checks if a file or directory exists."""
    return Path(path_str).exists()

def is_file(path_str):
    """Checks if a path is an existing file."""
    return Path(path_str).is_file()

def is_dir(path_str):
    """Checks if a path is an existing directory."""
    return Path(path_str).is_dir()