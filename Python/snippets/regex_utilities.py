import re

def find_pattern(text: str, pattern: str, find_all: bool = False):
    """Finds patterns in a string using regular expressions."""
    try:
        if find_all:
            return re.findall(pattern, text)
        match = re.search(pattern, text)
        return match if match else None
    except re.error as e:
        print(f"Regex error: {e}")
        return None