import logging # Import the logging module for recording events.
import time # Import the time module for pausing execution (time.sleep).
from functools import wraps # Import wraps for preserving function metadata in decorators.

# Define a decorator factory function that takes retry parameters.
def retry_on_exception(retries: int = 3, delay: float = 1.0, exceptions: tuple = (Exception,)):
    """Retries a function if specified exceptions occur."""
    # Define the actual decorator.
    def decorator(func):
        # Use @wraps to copy metadata (like __name__, __doc__) from the original function to the wrapper.
        @wraps(func)
        # Define the wrapper function that replaces the original function.
        def wrapper(*args, **kwargs):
            # Loop for the specified number of retry attempts.
            for attempt in range(retries):
                try:
                    # Attempt to execute the original function.
                    return func(*args, **kwargs)
                # Catch only the specified exceptions.
                except exceptions as e:
                    # Log a warning if an attempt fails.
                    logging.warning(f"Attempt {attempt + 1} failed: {e}")
                    # Wait for the specified delay before the next attempt.
                    time.sleep(delay)
            # If all retries fail, raise a RuntimeError.
            raise RuntimeError(f"Function {func.__name__} failed after {retries} retries.")
        # Return the wrapper function.
        return wrapper
    # Return the decorator itself.
    return decorator