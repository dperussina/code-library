import multiprocessing
import time
import math

def heavy_computation(item):
    """Example CPU-intensive function."""
    result = 0
    for _ in range(10**6):
        result += math.sqrt(item * math.pi)
    return item, result

def run_parallel_cpu(data: list, num_processes: int | None = None):
    """Processes data in parallel using multiprocessing.Pool.map."""
    if num_processes is None:
        num_processes = multiprocessing.cpu_count()
    start_time = time.perf_counter()
    with multiprocessing.Pool(processes=num_processes) as pool:
        results = pool.map(heavy_computation, data)
    end_time = time.perf_counter()
    print(f"CPU-bound parallel processing finished in {end_time - start_time:.4f} secs")
    return results