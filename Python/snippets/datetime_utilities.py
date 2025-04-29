from datetime import datetime, timedelta

def get_current_timestamp(format_str: str = "%Y-%m-%d_%H-%M-%S") -> str:
    """Returns the current timestamp as a formatted string."""
    return datetime.now().strftime(format_str)

def string_to_datetime(date_string: str, format_str: str = "%Y-%m-%d") -> datetime | None:
    """Converts a date string to a datetime object."""
    try:
        return datetime.strptime(date_string, format_str)
    except ValueError:
        print(f"Error: Could not parse date string '{date_string}' with format '{format_str}'")
        return None

def datetime_to_string(dt_obj: datetime, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """Converts a datetime object to a formatted string."""
    return dt_obj.strftime(format_str)

def time_difference(dt1: datetime, dt2: datetime) -> timedelta:
    """Calculates the difference between two datetime objects."""
    return abs(dt1 - dt2)