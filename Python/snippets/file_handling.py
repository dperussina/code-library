import os
from pathlib import Path

def read_text_file(filepath: str | Path) -> list[str]:
    """Reads a text file and returns a list of lines."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = [line.strip() for line in f]
        return lines
    except FileNotFoundError:
        print(f"Error: File not found at {filepath}")
        return []
    except Exception as e:
        print(f"Error reading file {filepath}: {e}")
        return []

def write_text_file(filepath: str | Path, lines: list[str], overwrite: bool = False):
    """Writes a list of strings to a text file, one string per line."""
    mode = 'w' if overwrite else 'a' # 'w' for overwrite, 'a' for append
    try:
        with open(filepath, mode, encoding='utf-8') as f:
            for line in lines:
                f.write(line + '\n')
        print(f"Successfully wrote {len(lines)} lines to {filepath} (mode: {mode})")
    except Exception as e:
        print(f"Error writing to file {filepath}: {e}")