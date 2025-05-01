import multiprocessing # Import the module for creating processes.
import time # Import the time module for timing operations.
import math # Import the math module for mathematical functions.

def heavy_computation(item):
    """Example CPU-intensive function."""
    # This function simulates a task that requires significant CPU time.
    result = 0
    # Perform a large number of computations.
    for _ in range(10**6):
        result += math.sqrt(item * math.pi)
    # Return the original item and the computed result.
    return item, result

def run_parallel_cpu(data: list, num_processes: int | None = None):
    """Processes data in parallel using multiprocessing.Pool.map."""
    # Determine the number of worker processes to use.
    # If not specified, use the number of available CPU cores.
    if num_processes is None:
        num_processes = multiprocessing.cpu_count()

    # Record the start time for performance measurement.
    start_time = time.perf_counter()

    # Create a pool of worker processes.
    # The 'with' statement ensures the pool is properly closed afterwards.
    with multiprocessing.Pool(processes=num_processes) as pool:
        # Distribute the 'heavy_computation' function across the data items in the pool.
        # pool.map blocks until all results are ready.
        results = pool.map(heavy_computation, data)

    # Record the end time.
    end_time = time.perf_counter()
    # Print the total time taken for the parallel processing.
    print(f"CPU-bound parallel processing finished in {end_time - start_time:.4f} secs")
    # Return the list of results obtained from the parallel computations.
    return results