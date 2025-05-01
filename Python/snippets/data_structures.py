from collections import Counter # Import Counter for efficient element counting.

def count_items(items: list) -> Counter:
    """Counts the frequency of each item in a list."""
    # Use collections.Counter to create a dictionary-like object mapping items to their counts.
    return Counter(items)

def flatten_list(list_of_lists: list[list]) -> list:
    """Flattens a list of lists into a single list."""
    # Use a list comprehension with nested loops to iterate through sublists and their items.
    return [item for sublist in list_of_lists for item in sublist]

def unique_ordered(items: list) -> list:
    """Removes duplicates from a list while preserving original order."""
    # Use a set to keep track of items encountered so far for fast lookups.
    seen = set()
    # Initialize an empty list to store the unique items in their original order.
    unique_items = []
    # Iterate through the input list.
    for item in items:
        # If the item hasn't been seen before...
        if item not in seen:
            # Add it to the list of unique items.
            unique_items.append(item)
            # Add it to the set of seen items.
            seen.add(item)
    # Return the list containing only the unique items in their original order.
    return unique_items