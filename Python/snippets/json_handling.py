import json
from pathlib import Path

def read_json_file(filepath: str | Path) -> dict | list | None:
    """Reads a JSON file and returns its content (dict or list)."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        print(f"Error: File not found at {filepath}")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in {filepath}")
        return None
    except Exception as e:
        print(f"Error reading JSON file {filepath}: {e}")
        return None

def write_json_file(filepath: str | Path, data: dict | list, indent: int = 4):
    """Writes Python dict or list to a JSON file."""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=indent, ensure_ascii=False)
        print(f"Successfully wrote data to {filepath}")
    except Exception as e:
        print(f"Error writing JSON file {filepath}: {e}")