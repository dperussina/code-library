from datetime import datetime, timedelta

def get_current_timestamp(format_str: str = "%Y-%m-%d_%H-%M-%S") -> str:
    """Returns the current timestamp as a formatted string."""
    # Get the current date and time using datetime.now().
    # Format the datetime object into a string using strftime() with the specified format.
    return datetime.now().strftime(format_str)

def string_to_datetime(date_string: str, format_str: str = "%Y-%m-%d") -> datetime | None:
    """Converts a date string to a datetime object."""
    try:
        # Attempt to parse the input string into a datetime object using strptime().
        # Requires the string and the corresponding format code.
        return datetime.strptime(date_string, format_str)
    except ValueError:
        # Handle cases where the string does not match the specified format.
        print(f"Error: Could not parse date string '{date_string}' with format '{format_str}'")
        # Return None if parsing fails.
        return None

def datetime_to_string(dt_obj: datetime, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """Converts a datetime object to a formatted string."""
    # Format the given datetime object into a string using strftime() with the specified format.
    return dt_obj.strftime(format_str)

def time_difference(dt1: datetime, dt2: datetime) -> timedelta:
    """Calculates the difference between two datetime objects."""
    # Subtract one datetime object from another to get a timedelta object.
    # Use abs() to ensure the difference is always positive.
    return abs(dt1 - dt2)