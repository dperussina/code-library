import time # Import time for timing operations.
import math # Import math for calculations.
from joblib import Parallel, delayed # Import Parallel and delayed from joblib for easy parallel processing.

def moderately_heavy_task(item, factor):
    """Example task suitable for joblib."""
    # Simulate a moderately CPU-bound task.
    result = 0
    # Perform a number of calculations.
    for i in range(10**5):
        result += math.sin(item * factor / (i+1))
    # Return the original item and the computed result.
    return item, result

def run_parallel_joblib(data: list, factor: float, n_jobs: int = -1, backend: str = "loky"):
    """Processes data in parallel using joblib.

    Args:
        data: The list of items to process.
        factor: An additional argument required by the task function.
        n_jobs: Number of parallel jobs. -1 means use all available CPU cores.
        backend: The backend for parallel processing (e.g., "loky", "multiprocessing", "threading").
                 "loky" is generally more robust.

    Returns:
        A list of results returned by the parallel tasks.
    """
    # Record start time.
    start_time = time.perf_counter()

    # Use joblib's Parallel context manager.
    # n_jobs specifies the number of parallel workers.
    # backend specifies the implementation (loky is default and robust).
    results = Parallel(n_jobs=n_jobs, backend=backend)(
        # Use a generator expression to create delayed calls to the task function.
        # delayed() wraps the function and its arguments for later execution.
        delayed(moderately_heavy_task)(item, factor) for item in data
    )

    # Record end time.
    end_time = time.perf_counter()
    # Print execution time.
    print(f"Joblib parallel processing (backend='{backend}') finished in {end_time - start_time:.4f} secs")
    # Return the collected results.
    return results