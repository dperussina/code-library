import time # Import time for performance counter.
import functools # Import functools for using wraps decorator.
import logging # Import logging for setting up basic logging.
import sys # Import sys to access standard output (stdout).

# Define a decorator to time the execution of a function.
def timer_decorator(func):
    """Decorator that prints the execution time of the function it decorates."""
    # Use functools.wraps to preserve the original function's metadata (name, docstring, etc.).
    @functools.wraps(func)
    # Define the wrapper function that will replace the original function.
    def wrapper_timer(*args, **kwargs):
        # Record the time before calling the decorated function.
        start_time = time.perf_counter() # Use perf_counter for high-resolution timing.
        # Call the original function with its arguments.
        value = func(*args, **kwargs)
        # Record the time after the function finishes.
        end_time = time.perf_counter()
        # Calculate the duration.
        run_time = end_time - start_time
        # Print the execution time.
        print(f"Finished {func.__name__!r} in {run_time:.4f} secs")
        # Return the value that the original function returned.
        return value
    # Return the wrapper function.
    return wrapper_timer

def setup_basic_logging(level=logging.INFO, log_file: str | None = None):
    """Sets up basic logging configuration to console and optionally to a file."""
    # Define the format for log messages.
    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s' # Added %(name)s
    
    # List of handlers to manage log output destinations.
    handlers = []
    # Add a handler to output logs to the console (standard output).
    handlers.append(logging.StreamHandler(sys.stdout))
    
    # If a log file path is provided...
    if log_file:
        # Add a handler to output logs to the specified file.
        # mode='a' means append to the file if it exists.
        handlers.append(logging.FileHandler(log_file, mode='a'))

    # Configure the root logger.
    # level: The minimum severity level to log (e.g., INFO, DEBUG, WARNING).
    # format: The format string for log messages.
    # handlers: The list of handlers to use.
    # force=True: Allows reconfiguration if logging was already set up.
    logging.basicConfig(level=level, format=log_format, handlers=handlers, force=True)
    
    # Log a message indicating setup is complete.
    logging.info("Basic logging setup complete.")