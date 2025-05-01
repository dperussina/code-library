import re # Import the regular expression module.

def find_pattern(text: str, pattern: str, find_all: bool = False):
    """Finds the first occurrence or all occurrences of a pattern in a string using regex.

    Args:
        text: The string to search within.
        pattern: The regular expression pattern to search for.
        find_all: If True, finds all non-overlapping matches (re.findall). 
                  If False (default), finds only the first match (re.search).

    Returns:
        If find_all is True: A list of all matches (strings).
        If find_all is False: A re.Match object for the first match, or None if no match is found.
        Returns None if a regex error occurs.
    """
    try:
        # Check if the user wants to find all occurrences.
        if find_all:
            # Use re.findall to return a list of all non-overlapping matches.
            return re.findall(pattern, text)
        # Otherwise, search for the first occurrence.
        # re.search scans through the string looking for the first location where the pattern produces a match.
        match = re.search(pattern, text)
        # Return the Match object if found, otherwise return None.
        return match # Note: match can be None if no match is found
    except re.error as e:
        # Handle invalid regular expression patterns.
        print(f"Regex error: {e} in pattern '{pattern}'")
        return None