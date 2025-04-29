import logging
import time
from functools import wraps

def retry_on_exception(retries: int = 3, delay: float = 1.0, exceptions: tuple = (Exception,)):
    """Retries a function if specified exceptions occur."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(retries):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    logging.warning(f"Attempt {attempt + 1} failed: {e}")
                    time.sleep(delay)
            raise RuntimeError(f"Function {func.__name__} failed after {retries} retries.")
        return wrapper
    return decorator