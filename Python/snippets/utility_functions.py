import time
import functools
import logging
import sys

def timer_decorator(func):
    """Decorator that prints the execution time of the function it decorates."""
    @functools.wraps(func)
    def wrapper_timer(*args, **kwargs):
        start_time = time.perf_counter()
        value = func(*args, **kwargs)
        end_time = time.perf_counter()
        run_time = end_time - start_time
        print(f"Finished {func.__name__!r} in {run_time:.4f} secs")
        return value
    return wrapper_timer

def setup_basic_logging(level=logging.INFO, log_file: str | None = None):
    """Sets up basic logging to console and optionally to a file."""
    log_format = '%(asctime)s - %(levelname)s - %(message)s'
    handlers = [logging.StreamHandler(sys.stdout)]
    if log_file:
        handlers.append(logging.FileHandler(log_file, mode='a'))

    logging.basicConfig(level=level, format=log_format, handlers=handlers)
    logging.info("Logging setup complete.")