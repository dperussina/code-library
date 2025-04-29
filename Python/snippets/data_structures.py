from collections import Counter

def count_items(items: list) -> Counter:
    """Counts the frequency of each item in a list."""
    return Counter(items)

def flatten_list(list_of_lists: list[list]) -> list:
    """Flattens a list of lists into a single list."""
    return [item for sublist in list_of_lists for item in sublist]

def unique_ordered(items: list) -> list:
    """Removes duplicates from a list while preserving original order."""
    seen = set()
    unique_items = []
    for item in items:
        if item not in seen:
            unique_items.append(item)
            seen.add(item)
    return unique_items